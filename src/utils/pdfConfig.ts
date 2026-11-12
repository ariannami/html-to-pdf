import { PERSIAN_FONT_WOFF2_BASE64 } from './bNazaninFont';

export const VAZIRMATN_CDN_URL =
  'https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css';

export type LanguageMode = 'en' | 'fa';

export enum EnglishFontPreset {
  VazirmatnDefault = 'vazirmatn-default',
  Original = 'original',
  PlusJakartaSans = 'plus-jakarta',
  Inter = 'inter',
  CormorantGaramond = 'cormorant',
  JetBrainsMono = 'jetbrains-mono',
  Georgia = 'georgia',
}

export enum FarsiFontPreset {
  Vazirmatn = 'vazirmatn',
  BNazanin = 'b-nazanin',
  BYekan = 'b-yekan',
  BZar = 'b-zar',
  BTitr = 'b-titr',
  BLotus = 'b-lotus',
}

export interface FontOptionSpec<T extends string> {
  id: T;
  label: string;
  cssFamily: string;
  googleFontHref?: string;
}

export const ENGLISH_FONT_OPTIONS: FontOptionSpec<EnglishFontPreset>[] = [
  {
    id: EnglishFontPreset.VazirmatnDefault,
    label: 'Vazirmatn (Default RTL/LTR Safe)',
    cssFamily: "'Vazirmatn', Tahoma, sans-serif",
  },
  {
    id: EnglishFontPreset.PlusJakartaSans,
    label: 'Plus Jakarta Sans',
    cssFamily: "'Plus Jakarta Sans', 'Vazirmatn', Tahoma, sans-serif",
    googleFontHref:
      'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap',
  },
  {
    id: EnglishFontPreset.Inter,
    label: 'Inter',
    cssFamily: "'Inter', 'Vazirmatn', Tahoma, sans-serif",
    googleFontHref:
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
  },
  {
    id: EnglishFontPreset.CormorantGaramond,
    label: 'Cormorant Garamond (Serif)',
    cssFamily: "'Cormorant Garamond', 'Vazirmatn', Georgia, serif",
    googleFontHref:
      'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,400&display=swap',
  },
  {
    id: EnglishFontPreset.JetBrainsMono,
    label: 'JetBrains Mono',
    cssFamily: "'JetBrains Mono', 'Vazirmatn', monospace",
    googleFontHref:
      'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap',
  },
  {
    id: EnglishFontPreset.Georgia,
    label: 'Georgia / Classic Serif',
    cssFamily: "Georgia, 'Times New Roman', 'Vazirmatn', serif",
  },
  {
    id: EnglishFontPreset.Original,
    label: 'Original HTML CSS Stack',
    cssFamily: "'Vazirmatn', Tahoma, sans-serif",
  },
];

export const FARSI_FONT_OPTIONS: FontOptionSpec<FarsiFontPreset>[] = [
  {
    id: FarsiFontPreset.Vazirmatn,
    label: 'Vazirmatn (وزیرمتن — استاندارد)',
    cssFamily: "'Vazirmatn', Tahoma, sans-serif",
  },
  {
    id: FarsiFontPreset.BNazanin,
    label: 'B Nazanin (بی نازنین)',
    cssFamily: "'B Nazanin', 'BNazanin', 'Vazirmatn', Tahoma, sans-serif",
  },
  {
    id: FarsiFontPreset.BYekan,
    label: 'B Yekan (بی یکان)',
    cssFamily: "'B Yekan', 'BYekan', 'Vazirmatn', Tahoma, sans-serif",
  },
  {
    id: FarsiFontPreset.BZar,
    label: 'B Zar (بی زر)',
    cssFamily: "'B Zar', 'BZar', 'Vazirmatn', Tahoma, sans-serif",
  },
  {
    id: FarsiFontPreset.BTitr,
    label: 'B Titr Bold (بی تیتر)',
    cssFamily: "'B Titr', 'BTitr', 'Vazirmatn', Tahoma, sans-serif",
  },
  {
    id: FarsiFontPreset.BLotus,
    label: 'B Lotus (بی لوتوس)',
    cssFamily: "'B Lotus', 'BLotus', 'Vazirmatn', Tahoma, sans-serif",
  },
];

/**
 * 1. AUTOMATIC PERSIAN CHARACTER NORMALIZATION (CRITICAL):
 * Runs automatically on all input HTML before rendering the preview AND before exporting to PDF.
 * - Replaces all instances of Arabic/Persian Heh with Yeh above (`ۀ` / `\u06C0`) and
 *   decomposed Heh + Hamza above (`هٔ` / `\u0647\u0654` and `\u0647\u0655`, plus `\u06C2`)
 *   with the standard Persian sequence: Heh + Zero-Width Non-Joiner (ZWNJ) + Yeh (`ه\u200Cی` / `\u0647\u200C\u06CC`).
 * - Replaces Arabic Yeh (`ي` / `\u064A` and `ى` / `\u0649`) with standard Persian Yeh (`ی` / `\u06CC`).
 * - Replaces Arabic Kaf (`ك` / `\u0643`) with Persian Kaf (`ک` / `\u06A9`).
 */
export function normalizePersianHTML(html: string): string {
  if (!html) return '';
  return html
    // Replace decomposed Heh + Hamza above/below (\u0647\u0654 and \u0647\u0655) and precomposed Heh with Yeh above (\u06C0, \u06C2)
    .replace(/\u0647[\u0654\u0655]|\u0647?[\u06C0\u06C2]/g, '\u0647\u200C\u06CC')
    // Also handle numeric HTML entities for \u06C0 if present in raw markup
    .replace(/\u0647?(?:&#1728;|&#x0*6[cC]0;)/g, '\u0647\u200C\u06CC')
    // Replace Arabic Yeh (\u064A and Alef Maksura \u0649) with standard Persian Yeh (\u06CC)
    .replace(/[\u064A\u0649]/g, '\u06CC')
    // Replace Arabic Kaf (\u0643) with standard Persian Kaf (\u06A9)
    .replace(/\u0643/g, '\u06A9');
}

/**
 * Builds @font-face declarations for the embedded Persian fonts using Base64 WOFF2
 * so they work 100% offline, on GitHub Pages, in Print Vector, and in Direct PDF.
 */
export function buildPersianFontFaceCss(selectedFarsiFont: FarsiFontPreset): string {
  const fontMap: Record<
    Exclude<FarsiFontPreset, FarsiFontPreset.Vazirmatn>,
    { aliases: string[]; base64: string }
  > = {
    [FarsiFontPreset.BNazanin]: {
      aliases: ['B Nazanin', 'BNazanin', 'B-Nazanin', 'Nazanin'],
      base64: PERSIAN_FONT_WOFF2_BASE64.BNazanin,
    },
    [FarsiFontPreset.BYekan]: {
      aliases: ['B Yekan', 'BYekan', 'B-Yekan', 'Yekan'],
      base64: PERSIAN_FONT_WOFF2_BASE64.BYekan,
    },
    [FarsiFontPreset.BZar]: {
      aliases: ['B Zar', 'BZar', 'B-Zar', 'Zar'],
      base64: PERSIAN_FONT_WOFF2_BASE64.BZar,
    },
    [FarsiFontPreset.BTitr]: {
      aliases: ['B Titr', 'BTitr', 'B-Titr', 'Titr'],
      base64: PERSIAN_FONT_WOFF2_BASE64.BTitr,
    },
    [FarsiFontPreset.BLotus]: {
      aliases: ['B Lotus', 'BLotus', 'B-Lotus', 'Lotus'],
      base64: PERSIAN_FONT_WOFF2_BASE64.BLotus,
    },
  };

  const keysToInclude = new Set<Exclude<FarsiFontPreset, FarsiFontPreset.Vazirmatn>>([
    FarsiFontPreset.BNazanin,
  ]);
  if (selectedFarsiFont !== FarsiFontPreset.Vazirmatn) {
    keysToInclude.add(selectedFarsiFont);
  }

  const rules: string[] = [];
  for (const key of keysToInclude) {
    const entry = fontMap[key];
    const dataUri = `data:font/woff2;base64,${entry.base64}`;
    for (const family of entry.aliases) {
      for (const weight of ['normal', 'bold', '400', '700']) {
        rules.push(`@font-face {
  font-family: "${family}";
  src: url("${dataUri}") format("woff2");
  font-weight: ${weight};
  font-style: normal;
  font-display: block;
}`);
      }
    }
  }

  return rules.join('\n');
}

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

export interface PdfLanguageFontSettings {
  languageMode: LanguageMode;
  englishFont: EnglishFontPreset;
  farsiFont: FarsiFontPreset;
}

export const DEFAULT_LANGUAGE_FONT_SETTINGS: PdfLanguageFontSettings = {
  languageMode: 'fa',
  englishFont: EnglishFontPreset.VazirmatnDefault,
  farsiFont: FarsiFontPreset.Vazirmatn,
};

/**
 * 2. INJECT STANDARD PERSIAN FONT (VAZIRMATN) & FIX RTL TYPOGRAPHY:
 * Automatically runs `normalizePersianHTML` and injects:
 * - `<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css" />`
 * - Anti-disconnection & glyph shaping CSS rules (`letter-spacing: 0px !important`,
 *   `font-feature-settings: "kern" 1, "liga" 1, "calt" 1 !important`,
 *   `-webkit-font-smoothing: antialiased`, and `print-color-adjust: exact !important`).
 */
export function prepareRawHtmlForPdf(
  rawHtml: string,
  fontSettings: PdfLanguageFontSettings = DEFAULT_LANGUAGE_FONT_SETTINGS
): string {
  // Always normalize Persian characters first (ۀ / هٔ -> ه‌ی, ي/ى -> ی, ك -> ک)
  const normalizedHtml = normalizePersianHTML(rawHtml);

  const { languageMode, englishFont, farsiFont } = fontSettings;

  const vazirmatnLinkTag = `<link rel="stylesheet" href="${VAZIRMATN_CDN_URL}" />`;
  let extraGoogleFontLink = '';
  let activeFontFamily = "'Vazirmatn', Tahoma, sans-serif";
  let extraFontFaces = '';

  if (languageMode === 'en') {
    const enSpec =
      ENGLISH_FONT_OPTIONS.find((o) => o.id === englishFont) ||
      ENGLISH_FONT_OPTIONS[0];
    if (enSpec.googleFontHref) {
      extraGoogleFontLink = `\n<link rel="stylesheet" href="${enSpec.googleFontHref}" />`;
    }
    if (enSpec.cssFamily) {
      activeFontFamily = enSpec.cssFamily;
    }
  } else {
    const faSpec =
      FARSI_FONT_OPTIONS.find((o) => o.id === farsiFont) ||
      FARSI_FONT_OPTIONS[0];
    if (faSpec.googleFontHref) {
      extraGoogleFontLink = `\n<link rel="stylesheet" href="${faSpec.googleFontHref}" />`;
    }
    activeFontFamily = faSpec.cssFamily;
    if (faSpec.id !== FarsiFontPreset.Vazirmatn) {
      extraFontFaces = `${buildPersianFontFaceCss(faSpec.id)}\n`;
    }
  }

  const injectedHeadBlock = `${vazirmatnLinkTag}${extraGoogleFontLink}
<style id="pdf-color-preserve">
${extraFontFaces}html, body, * {
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
  color-adjust: exact !important;
}
body, p, h1, h2, h3, h4, h5, h6, span, div, li, td, th, blockquote {
  font-family: ${activeFontFamily} !important;
  letter-spacing: 0px !important;
  font-feature-settings: "kern" 1, "liga" 1, "calt" 1 !important;
  -webkit-font-smoothing: antialiased;
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}
</style>`;

  const trimmed = normalizedHtml.trim();

  if (!trimmed) {
    return `<!DOCTYPE html><html><head><meta charset="UTF-8">\n${injectedHeadBlock}\n</head><body></body></html>`;
  }

  if (/<\/head>/i.test(trimmed)) {
    return trimmed.replace(/<\/head>/i, `${injectedHeadBlock}\n</head>`);
  }

  if (/<head[\s>]/i.test(trimmed)) {
    return trimmed.replace(/<head([^>]*)>/i, `<head$1>\n${injectedHeadBlock}`);
  }

  if (/<html[\s>]/i.test(trimmed)) {
    return trimmed.replace(
      /<html([^>]*)>/i,
      `<html$1>\n<head>\n<meta charset="UTF-8">\n${injectedHeadBlock}\n</head>`
    );
  }

  const defaultLangAttr =
    languageMode === 'fa' ? 'lang="fa" dir="rtl"' : 'lang="en"';
  return `<!DOCTYPE html>\n<html ${defaultLangAttr}>\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n${injectedHeadBlock}\n</head>\n<body>\n${trimmed}\n</body>\n</html>`;
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
