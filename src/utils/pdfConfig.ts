import { PERSIAN_FONT_WOFF2_BASE64 } from './bNazaninFont';

export type LanguageMode = 'en' | 'fa';

export enum EnglishFontPreset {
  Original = 'original',
  PlusJakartaSans = 'plus-jakarta',
  Inter = 'inter',
  CormorantGaramond = 'cormorant',
  JetBrainsMono = 'jetbrains-mono',
  Georgia = 'georgia',
}

export enum FarsiFontPreset {
  BNazanin = 'b-nazanin',
  Vazirmatn = 'vazirmatn',
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
    id: EnglishFontPreset.Original,
    label: 'Original HTML Font (Default)',
    cssFamily: '',
  },
  {
    id: EnglishFontPreset.PlusJakartaSans,
    label: 'Plus Jakarta Sans',
    cssFamily: '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, sans-serif',
    googleFontHref:
      'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap',
  },
  {
    id: EnglishFontPreset.Inter,
    label: 'Inter',
    cssFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
    googleFontHref:
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
  },
  {
    id: EnglishFontPreset.CormorantGaramond,
    label: 'Cormorant Garamond (Serif)',
    cssFamily: '"Cormorant Garamond", Georgia, serif',
    googleFontHref:
      'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,400&display=swap',
  },
  {
    id: EnglishFontPreset.JetBrainsMono,
    label: 'JetBrains Mono',
    cssFamily: '"JetBrains Mono", monospace',
    googleFontHref:
      'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap',
  },
  {
    id: EnglishFontPreset.Georgia,
    label: 'Georgia / Classic Serif',
    cssFamily: 'Georgia, "Times New Roman", Times, serif',
  },
];

export const FARSI_FONT_OPTIONS: FontOptionSpec<FarsiFontPreset>[] = [
  {
    id: FarsiFontPreset.BNazanin,
    label: 'B Nazanin (بی نازنین)',
    cssFamily: '"B Nazanin", "BNazanin", Tahoma, sans-serif',
  },
  {
    id: FarsiFontPreset.Vazirmatn,
    label: 'Vazirmatn (وزیرمتن)',
    cssFamily: '"Vazirmatn", "B Nazanin", Tahoma, sans-serif',
    googleFontHref:
      'https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;600;700&display=swap',
  },
  {
    id: FarsiFontPreset.BYekan,
    label: 'B Yekan (بی یکان)',
    cssFamily: '"B Yekan", "BYekan", Tahoma, sans-serif',
  },
  {
    id: FarsiFontPreset.BZar,
    label: 'B Zar (بی زر)',
    cssFamily: '"B Zar", "BZar", Tahoma, sans-serif',
  },
  {
    id: FarsiFontPreset.BTitr,
    label: 'B Titr Bold (بی تیتر)',
    cssFamily: '"B Titr", "BTitr", Tahoma, sans-serif',
  },
  {
    id: FarsiFontPreset.BLotus,
    label: 'B Lotus (بی لوتوس)',
    cssFamily: '"B Lotus", "BLotus", Tahoma, sans-serif',
  },
];

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

  // Always register B Nazanin plus whichever Farsi font is currently selected
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
  languageMode: 'en',
  englishFont: EnglishFontPreset.Original,
  farsiFont: FarsiFontPreset.BNazanin,
};

/**
 * Prepares raw HTML for preview and PDF conversion without injecting @page size
 * or margin overrides.
 * - In 'en' mode: preserves Western/English numerals (0-9) and either keeps the HTML's
 *   original fonts or applies the selected English font preset.
 * - In 'fa' mode: embeds the selected Persian font (B Nazanin, Vazirmatn, B Yekan,
 *   B Zar, B Titr, or B Lotus) and applies it across the document.
 */
export function prepareRawHtmlForPdf(
  rawHtml: string,
  fontSettings: PdfLanguageFontSettings = DEFAULT_LANGUAGE_FONT_SETTINGS
): string {
  const { languageMode, englishFont, farsiFont } = fontSettings;

  let googleFontLink = '';
  let customFontCss = '';

  if (languageMode === 'en') {
    const enSpec =
      ENGLISH_FONT_OPTIONS.find((o) => o.id === englishFont) ||
      ENGLISH_FONT_OPTIONS[0];

    if (enSpec.googleFontHref) {
      googleFontLink = `<link rel="stylesheet" href="${enSpec.googleFontHref}">\n`;
    }

    if (enSpec.id !== EnglishFontPreset.Original && enSpec.cssFamily) {
      customFontCss = `html, body, body * {
  font-family: ${enSpec.cssFamily} !important;
}`;
    }
  } else {
    const faSpec =
      FARSI_FONT_OPTIONS.find((o) => o.id === farsiFont) ||
      FARSI_FONT_OPTIONS[0];

    if (faSpec.googleFontHref) {
      googleFontLink = `<link rel="stylesheet" href="${faSpec.googleFontHref}">\n`;
    }

    const persianFontFaces = buildPersianFontFaceCss(faSpec.id);
    customFontCss = `${persianFontFaces}
html, body, body * {
  font-family: ${faSpec.cssFamily} !important;
}`;
  }

  const baseStyleTag = `${googleFontLink}<style id="pdf-color-preserve">
html, body, * {
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
  color-adjust: exact !important;
}
${customFontCss}
</style>`;

  const trimmed = rawHtml.trim();

  if (!trimmed) {
    return `<!DOCTYPE html><html><head><meta charset="UTF-8">${baseStyleTag}</head><body></body></html>`;
  }

  // Place our style tag right before </head> so when a specific font is chosen (or FA mode is active),
  // its font-family rule cleanly takes effect while leaving @page and layout untouched.
  if (/<\/head>/i.test(trimmed)) {
    return trimmed.replace(/<\/head>/i, `${baseStyleTag}\n</head>`);
  }

  if (/<head[\s>]/i.test(trimmed)) {
    return trimmed.replace(/<head([^>]*)>/i, `<head$1>\n${baseStyleTag}`);
  }

  if (/<html[\s>]/i.test(trimmed)) {
    return trimmed.replace(
      /<html([^>]*)>/i,
      `<html$1>\n<head>\n<meta charset="UTF-8">\n${baseStyleTag}\n</head>`
    );
  }

  const defaultLangAttr = languageMode === 'fa' ? 'lang="fa" dir="rtl"' : 'lang="en"';
  return `<!DOCTYPE html>\n<html ${defaultLangAttr}>\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n${baseStyleTag}\n</head>\n<body>\n${trimmed}\n</body>\n</html>`;
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
