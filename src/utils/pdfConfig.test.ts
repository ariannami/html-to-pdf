import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizePdfFilename,
  pxToMm,
  prepareRawHtmlForPdf,
  buildDirectHtml2PdfOptions,
  calculateEditorStats,
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

  it('prepareRawHtmlForPdf preserves user HTML without injecting @page overrides and embeds B Nazanin font', () => {
    const customHtml = '<!DOCTYPE html><html><head><style>@page { size: 1200px 800px; margin: 15mm; } body { background: #000; font-family: "Plus Jakarta Sans", sans-serif; }</style></head><body><h1>گزارش پروژه</h1></body></html>';
    const result = prepareRawHtmlForPdf(customHtml);

    assert.match(result, /<style id="pdf-color-preserve">/);
    assert.match(result, /-webkit-print-color-adjust: exact !important;/);
    assert.match(result, /font-family: "B Nazanin"/);
    assert.match(result, /data:font\/woff2;base64,/);
    assert.match(
      result,
      /font-family:\s*"RotoscopePersianBNazanin",\s*"B Nazanin",\s*"Plus Jakarta Sans",\s*sans-serif/
    );
    // Ensure user's own @page rule is completely untouched and no conflicting @page is injected
    const pageMatches = result.match(/@page/g) || [];
    assert.equal(pageMatches.length, 1);
    assert.match(result, /@page \{ size: 1200px 800px; margin: 15mm; \}/);
  });

  it('prepareRawHtmlForPdf wraps partial HTML fragments cleanly', () => {
    const snippet = '<div class="card">سلام دنیا</div>';
    const wrapped = prepareRawHtmlForPdf(snippet);
    assert.match(wrapped, /<!DOCTYPE html>/i);
    assert.match(wrapped, /<head>/i);
    assert.match(wrapped, /<div class="card">سلام دنیا<\/div>/);
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
