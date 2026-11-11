/**
 * Pure utility functions for direct HTML-to-PDF conversion without altering
 * the user's own CSS, layout dimensions, or @page rules.
 */

/**
 * Normalizes a user-supplied PDF filename, ensuring it is non-empty and ends with .pdf
 */
export function normalizePdfFilename(raw: string): string {
  const trimmed = raw.trim().replace(/[<>:"/\\|?*]+/g, '-');
  if (!trimmed) {
    return 'document.pdf';
  }
  if (trimmed.toLowerCase().endsWith('.pdf')) {
    const base = trimmed.slice(0, -4).trim();
    return base ? `${base}.pdf` : 'document.pdf';
  }
  return `${trimmed}.pdf`;
}

/**
 * Converts pixels (at 96 DPI standard CSS pixel ratio) to millimeters (25.4mm per inch)
 */
export function pxToMm(px: number): number {
  const mm = (px * 25.4) / 96;
  return Math.max(10, Math.round(mm * 100) / 100);
}

/**
 * Prepares raw HTML for preview and PDF conversion without injecting any @page size
 * or margin overrides that could conflict with the user's document CSS.
 * Only inserts a print-color-adjust rule at the start of <head> so background colors
 * and gradients are preserved by default while giving 100% precedence to the user's styles.
 */
export function prepareRawHtmlForPdf(rawHtml: string): string {
  const colorPreserveTag = `<style id="pdf-color-preserve">html, body, * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; color-adjust: exact !important; }</style>`;
  const trimmed = rawHtml.trim();

  if (!trimmed) {
    return `<!DOCTYPE html><html><head><meta charset="UTF-8">${colorPreserveTag}</head><body></body></html>`;
  }

  if (/<head[\s>]/i.test(trimmed)) {
    return trimmed.replace(/<head([^>]*)>/i, `<head$1>\n${colorPreserveTag}`);
  }

  if (/<html[\s>]/i.test(trimmed)) {
    return trimmed.replace(
      /<html([^>]*)>/i,
      `<html$1>\n<head>\n<meta charset="UTF-8">\n${colorPreserveTag}\n</head>`
    );
  }

  return `<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n${colorPreserveTag}\n</head>\n<body>\n${trimmed}\n</body>\n</html>`;
}

export interface Html2PdfOptions {
  margin: number;
  filename: string;
  image: { type: 'jpeg' | 'png' | 'webp'; quality: number };
  html2canvas: {
    scale: number;
    useCORS: boolean;
    logging: boolean;
    scrollX: number;
    scrollY: number;
    backgroundColor?: string | null;
    windowWidth?: number;
    width?: number;
    height?: number;
  };
  jsPDF: {
    unit: 'mm';
    format: [number, number];
    orientation: 'portrait' | 'landscape';
  };
  pagebreak: {
    mode: string[];
  };
}

/**
 * Builds client-side html2pdf.js options that match the exact rendered dimensions
 * of the user's HTML inside the preview iframe without forcing A4 or margins.
 */
export function buildDirectHtml2PdfOptions(
  filename: string,
  measuredWidthPx: number,
  measuredHeightPx: number,
  resolvedBackgroundColor?: string | null
): Html2PdfOptions {
  const normalizedFilename = normalizePdfFilename(filename);
  const safeWidthPx = Math.max(320, Math.round(measuredWidthPx || 800));
  const safeHeightPx = Math.max(200, Math.round(measuredHeightPx || 600));

  const widthMm = pxToMm(safeWidthPx);
  const heightMm = pxToMm(safeHeightPx);
  const orientation: 'portrait' | 'landscape' =
    widthMm > heightMm ? 'landscape' : 'portrait';

  return {
    margin: 0,
    filename: normalizedFilename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      logging: false,
      scrollX: 0,
      scrollY: 0,
      backgroundColor: resolvedBackgroundColor || '#FFFFFF',
      windowWidth: safeWidthPx,
      width: safeWidthPx,
      height: safeHeightPx,
    },
    jsPDF: {
      unit: 'mm',
      format: [widthMm, heightMm],
      orientation,
    },
    pagebreak: {
      mode: ['css', 'legacy'],
    },
  };
}

export interface EditorStats {
  lines: number;
  characters: number;
  bytes: number;
}

export function calculateEditorStats(code: string): EditorStats {
  if (!code) {
    return { lines: 1, characters: 0, bytes: 0 };
  }
  const lines = code.split(/\r\n|\r|\n/).length;
  const characters = code.length;
  const bytes = new TextEncoder().encode(code).length;
  return { lines, characters, bytes };
}
