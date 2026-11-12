import { buildBNazaninFontFaceCss } from './bNazaninFont';

/**
 * Pure utility functions for direct HTML-to-PDF conversion without altering
 * the user's own CSS layout dimensions or @page rules, while guaranteeing
 * authentic B Nazanin rendering for all Farsi/Persian text.
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
 * Prepends the Unicode-ranged B Nazanin font-family ("RotoscopePersianBNazanin")
 * to CSS font-family declarations inside <style> blocks so Farsi characters always
 * render in B Nazanin even when a generic or Latin font (like Arial, Tahoma, or
 * Plus Jakarta Sans) is specified.
 */
export function enhanceFontFamilyDeclarationsForFarsi(html: string): string {
  return html.replace(
    /(<style\b[^>]*>)([\s\S]*?)(<\/style>)/gi,
    (fullBlock, openTag: string, cssContent: string, closeTag: string) => {
      if (/id=["']pdf-color-preserve["']/i.test(openTag)) {
        return fullBlock;
      }
      const updatedCss = cssContent.replace(
        /(font-family\s*:\s*)([^;}]+)/gi,
        (match, prefix: string, value: string) => {
          if (/RotoscopePersianBNazanin/i.test(value)) {
            return match;
          }
          const trimmedVal = value.trim();
          const importantSuffix = /\s*!important\s*$/i.test(trimmedVal)
            ? ' !important'
            : '';
          const cleanVal = trimmedVal.replace(/\s*!important\s*$/i, '').trim();
          return `${prefix}"RotoscopePersianBNazanin", "B Nazanin", ${cleanVal}${importantSuffix}`;
        }
      );
      return `${openTag}${updatedCss}${closeTag}`;
    }
  );
}

/**
 * Prepares raw HTML for preview and PDF conversion without injecting any @page size
 * or margin overrides that could conflict with the user's document CSS.
 * Embeds the B Nazanin @font-face (base64 WOFF2) and print-color-adjust rule so
 * dark backgrounds and Farsi/Persian typography render with 100% fidelity.
 */
export function prepareRawHtmlForPdf(rawHtml: string): string {
  const bNazaninCss = buildBNazaninFontFaceCss();
  const baseStyleTag = `<style id="pdf-color-preserve">
${bNazaninCss}
html, body, * {
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
  color-adjust: exact !important;
}
html, body {
  font-family: "RotoscopePersianBNazanin", "B Nazanin", sans-serif;
}
:lang(fa), [dir="rtl"] {
  font-family: "RotoscopePersianBNazanin", "B Nazanin", sans-serif;
}
</style>`;

  const farsiDomScript = `<script id="pdf-farsi-font-helper">
(function() {
  var farsiRegex = /[\\u0600-\\u06FF\\u0750-\\u077F\\u08A0-\\u08FF\\uFB50-\\uFDFF\\uFE70-\\uFEFF]/;
  function applyBNazaninToFarsiNodes() {
    if (!document.body) return;
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
    var node;
    while ((node = walker.nextNode())) {
      if (node.nodeValue && farsiRegex.test(node.nodeValue)) {
        var el = node.parentElement;
        if (el && !el.hasAttribute("data-b-nazanin-applied")) {
          var computed = window.getComputedStyle(el).fontFamily || "sans-serif";
          if (computed.indexOf("RotoscopePersianBNazanin") === -1) {
            el.style.setProperty("font-family", '"RotoscopePersianBNazanin", "B Nazanin", ' + computed, "important");
          }
          el.setAttribute("data-b-nazanin-applied", "true");
        }
      }
    }
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyBNazaninToFarsiNodes);
  } else {
    applyBNazaninToFarsiNodes();
  }
  window.addEventListener("load", applyBNazaninToFarsiNodes);
})();
</script>`;

  const trimmed = enhanceFontFamilyDeclarationsForFarsi(rawHtml.trim());

  if (!trimmed) {
    return `<!DOCTYPE html><html><head><meta charset="UTF-8">${baseStyleTag}</head><body></body></html>`;
  }

  let withHead = trimmed;
  if (/<head[\s>]/i.test(withHead)) {
    withHead = withHead.replace(/<head([^>]*)>/i, `<head$1>\n${baseStyleTag}`);
  } else if (/<html[\s>]/i.test(withHead)) {
    withHead = withHead.replace(
      /<html([^>]*)>/i,
      `<html$1>\n<head>\n<meta charset="UTF-8">\n${baseStyleTag}\n</head>`
    );
  } else {
    withHead = `<!DOCTYPE html>\n<html lang="fa">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n${baseStyleTag}\n</head>\n<body>\n${withHead}\n</body>\n</html>`;
  }

  if (/<\/body>/i.test(withHead)) {
    return withHead.replace(/<\/body>/i, `${farsiDomScript}\n</body>`);
  }
  return `${withHead}\n${farsiDomScript}`;
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
