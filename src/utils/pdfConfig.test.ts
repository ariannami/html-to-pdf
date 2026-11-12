import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizePdfFilename,
  pxToMm,
  prepareRawHtmlForPdf,
  buildDirectHtml2PdfOptions,
  calculateEditorStats,
  EnglishFontPreset,
  FarsiFontPreset,
} from './pdfConfig.ts';

describe('pdfConfig pure functions', () => {
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

  it('prepareRawHtmlForPdf in EN Original mode does not inject B Nazanin so English numbers stay untouched', () => {
    const customHtml =
      '<!DOCTYPE html><html><head><style>@page { size: 1200px 800px; margin: 15mm; } body { background: #000; font-family: "Plus Jakarta Sans", sans-serif; }</style></head><body><h1>4,820 m²</h1></body></html>';
    const result = prepareRawHtmlForPdf(customHtml, {
      languageMode: 'en',
      englishFont: EnglishFontPreset.Original,
      farsiFont: FarsiFontPreset.BNazanin,
    });

    assert.match(result, /<style id="pdf-color-preserve">/);
    assert.doesNotMatch(result, /B Nazanin/);
    // Ensure user's own @page rule is completely untouched
    const pageMatches = result.match(/@page/g) || [];
    assert.equal(pageMatches.length, 1);
  });

  it('prepareRawHtmlForPdf in EN custom font mode applies the chosen English font', () => {
    const customHtml = '<!DOCTYPE html><html><head></head><body><h1>Report 2026</h1></body></html>';
    const result = prepareRawHtmlForPdf(customHtml, {
      languageMode: 'en',
      englishFont: EnglishFontPreset.JetBrainsMono,
      farsiFont: FarsiFontPreset.BNazanin,
    });

    assert.match(result, /JetBrains Mono/);
    assert.doesNotMatch(result, /B Nazanin/);
  });

  it('prepareRawHtmlForPdf in FA mode embeds and applies the selected Farsi font', () => {
    const customHtml = '<!DOCTYPE html><html><head></head><body><h1>گزارش پروژه</h1></body></html>';
    const result = prepareRawHtmlForPdf(customHtml, {
      languageMode: 'fa',
      englishFont: EnglishFontPreset.Original,
      farsiFont: FarsiFontPreset.BNazanin,
    });

    assert.match(result, /font-family: "B Nazanin"/);
    assert.match(result, /data:font\/woff2;base64,/);
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
