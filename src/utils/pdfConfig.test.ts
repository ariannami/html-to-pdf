import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizePersianHTML,
  normalizePdfFilename,
  pxToMm,
  prepareRawHtmlForPdf,
  buildDirectHtml2PdfOptions,
  calculateEditorStats,
  EnglishFontPreset,
  FarsiFontPreset,
  VAZIRMATN_CDN_URL,
} from './pdfConfig.ts';

describe('pdfConfig pure functions', () => {
  it('normalizePersianHTML replaces Heh+Yeh above (ۀ and هٔ), Arabic Yeh (ي/ى), and Arabic Kaf (ك)', () => {
    const raw =
      '<p>خانۀ من و خانه\u0654 پدری و خانه\u0655 ما در كتابخانه\u06C0 بزرگ با يک كليد و ى</p>';
    const normalized = normalizePersianHTML(raw);

    // Every ۀ (\u06C0) and هٔ (\u0647\u0654 / \u0647\u0655) must become ه‌ی (\u0647\u200C\u06CC)
    assert.ok(!normalized.includes('\u06C0'), 'Should not contain \\u06C0');
    assert.ok(!normalized.includes('\u0654'), 'Should not contain \\u0654');
    assert.ok(!normalized.includes('\u0655'), 'Should not contain \\u0655');
    assert.ok(!normalized.includes('\u064A'), 'Should not contain Arabic Yeh \\u064A');
    assert.ok(!normalized.includes('\u0649'), 'Should not contain Alef Maksura \\u0649');
    assert.ok(!normalized.includes('\u0643'), 'Should not contain Arabic Kaf \\u0643');

    assert.equal(
      normalized,
      '<p>خانه\u200Cی من و خانه\u200Cی پدری و خانه\u200Cی ما در کتابخانه\u200Cی بزرگ با یک کلید و ی</p>'
    );
  });

  it('normalizePdfFilename appends .pdf and sanitizes invalid characters', () => {
    assert.equal(normalizePdfFilename(''), 'document.pdf');
    assert.equal(normalizePdfFilename('   '), 'document.pdf');
    assert.equal(normalizePdfFilename('report'), 'report.pdf');
    assert.equal(normalizePdfFilename('report.PDF'), 'report.pdf');
    assert.equal(normalizePdfFilename('.pdf'), 'document.pdf');
    assert.equal(normalizePdfFilename('my:file/name?.pdf'), 'my-file-name-.pdf');
  });

  it('pxToMm accurately converts 96 DPI pixels to millimeters', () => {
    assert.equal(pxToMm(1920), 508);
    assert.equal(pxToMm(1080), 285.75);
  });

  it('prepareRawHtmlForPdf normalizes Persian HTML and injects Vazirmatn CDN and RTL typography fix rules', () => {
    const customHtml =
      '<!DOCTYPE html><html><head><style>@page { size: 1200px 800px; margin: 15mm; }</style></head><body><h1>پروژ\u06C0 شماره ۱ با كیفیت عالی</h1></body></html>';
    const result = prepareRawHtmlForPdf(customHtml);

    assert.ok(result.includes(VAZIRMATN_CDN_URL), 'Must inject Vazirmatn v33.003 CDN link');
    assert.match(result, /font-family:\s*'Vazirmatn',\s*Tahoma,\s*sans-serif\s*!important/);
    assert.match(result, /letter-spacing:\s*0px\s*!important/);
    assert.match(
      result,
      /font-feature-settings:\s*"kern"\s*1,\s*"liga"\s*1,\s*"calt"\s*1\s*!important/
    );
    assert.match(result, /-webkit-font-smoothing:\s*antialiased/);
    assert.match(result, /-webkit-print-color-adjust:\s*exact\s*!important/);
    assert.match(result, /print-color-adjust:\s*exact\s*!important/);
    // Verify Persian normalization happened inside prepareRawHtmlForPdf
    assert.ok(result.includes('پروژه\u200Cی شماره ۱ با کیفیت عالی'));
    assert.ok(!result.includes('\u06C0'));
    assert.ok(!result.includes('\u0643'));
  });

  it('prepareRawHtmlForPdf in FA mode with B Nazanin embeds B Nazanin and keeps anti-disconnect rules', () => {
    const customHtml = '<!DOCTYPE html><html><head></head><body><h1>گزارش پروژهٔ اول</h1></body></html>';
    const result = prepareRawHtmlForPdf(customHtml, {
      languageMode: 'fa',
      englishFont: EnglishFontPreset.VazirmatnDefault,
      farsiFont: FarsiFontPreset.BNazanin,
    });

    assert.match(result, /font-family: "B Nazanin"/);
    assert.match(result, /data:font\/woff2;base64,/);
    assert.match(result, /letter-spacing:\s*0px\s*!important/);
    assert.ok(result.includes('پروژه\u200Cی اول'));
  });

  it('buildDirectHtml2PdfOptions uses exact measured dimensions without forcing A4', () => {
    const opts = buildDirectHtml2PdfOptions('rotoscope', 1920, 1080, '#111111');
    assert.equal(opts.filename, 'rotoscope.pdf');
    assert.equal(opts.margin, 0);
    assert.equal(opts.html2canvas.windowWidth, 1920);
    assert.equal(opts.html2canvas.width, 1920);
    assert.equal(opts.html2canvas.height, 1080);
    assert.deepEqual(opts.jsPDF.format, [508, 285.75]);
    assert.equal(opts.jsPDF.orientation, 'landscape');
  });

  it('calculateEditorStats counts lines, characters, and UTF-8 bytes', () => {
    assert.deepEqual(calculateEditorStats(''), {
      lines: 1,
      characters: 0,
      bytes: 0,
    });
    assert.deepEqual(calculateEditorStats('<h1>Title</h1>\n<p>Body</p>'), {
      lines: 2,
      characters: 26,
      bytes: 26,
    });
  });
});
