import React, { useCallback, useRef, useState } from 'react';
import { TopControlBar, MobileActiveTab } from './components/TopControlBar';
import { HtmlEditorPane } from './components/HtmlEditorPane';
import { LivePreviewPane } from './components/LivePreviewPane';
import {
  buildDirectHtml2PdfOptions,
  DEFAULT_LANGUAGE_FONT_SETTINGS,
  EnglishFontPreset,
  FarsiFontPreset,
  LanguageMode,
  normalizePdfFilename,
  PdfLanguageFontSettings,
  prepareRawHtmlForPdf,
} from './utils/pdfConfig';
import {
  DEFAULT_FARSI_SAMPLE_HTML,
  DEFAULT_SAMPLE_HTML,
  SAMPLE_TEMPLATES,
  SampleTemplate,
} from './utils/sampleHtml';

const HTML2PDF_CDN_URL =
  'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';

type Html2PdfFactory = () => {
  set: (options: unknown) => {
    from: (element: HTMLElement) => {
      save: () => Promise<void>;
    };
  };
};

declare global {
  interface Window {
    html2pdf?: Html2PdfFactory;
  }
}

export default function App() {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const [htmlCode, setHtmlCode] = useState<string>(DEFAULT_SAMPLE_HTML);
  const [filename, setFilename] = useState<string>('document.pdf');
  const [fontSettings, setFontSettings] = useState<PdfLanguageFontSettings>(
    DEFAULT_LANGUAGE_FONT_SETTINGS
  );
  const [mobileTab, setMobileTab] = useState<MobileActiveTab>('editor');
  const [isGeneratingDirect, setIsGeneratingDirect] = useState(false);
  const [exportStatusMessage, setExportStatusMessage] = useState<string | null>(
    null
  );

  const handleChangeLanguageMode = useCallback((mode: LanguageMode) => {
    setFontSettings((prev) => ({ ...prev, languageMode: mode }));
    setHtmlCode((currentHtml) => {
      if (mode === 'fa' && currentHtml === DEFAULT_SAMPLE_HTML) {
        return DEFAULT_FARSI_SAMPLE_HTML;
      }
      if (mode === 'en' && currentHtml === DEFAULT_FARSI_SAMPLE_HTML) {
        return DEFAULT_SAMPLE_HTML;
      }
      return currentHtml;
    });
    setExportStatusMessage(
      mode === 'fa'
        ? 'Switched to Farsi (فارسی) typography mode'
        : 'Switched to English (EN) typography mode'
    );
  }, []);

  const handleChangeEnglishFont = useCallback((englishFont: EnglishFontPreset) => {
    setFontSettings((prev) => ({ ...prev, englishFont }));
  }, []);

  const handleChangeFarsiFont = useCallback((farsiFont: FarsiFontPreset) => {
    setFontSettings((prev) => ({ ...prev, farsiFont }));
  }, []);

  const handleClearEditor = useCallback(() => {
    setHtmlCode('');
    setExportStatusMessage('Editor cleared');
  }, []);

  const handleLoadSample = useCallback(
    (template?: SampleTemplate) => {
      if (fontSettings.languageMode === 'fa') {
        setHtmlCode(DEFAULT_FARSI_SAMPLE_HTML);
        setFilename('krono-farsi-report.pdf');
        setExportStatusMessage('Loaded Farsi sample HTML');
        return;
      }
      const chosen = template || SAMPLE_TEMPLATES[0];
      setHtmlCode(chosen.html);
      setFilename(chosen.recommendedFilename);
      setExportStatusMessage(`Loaded sample: ${chosen.name}`);
    },
    [fontSettings.languageMode]
  );

  const handleFileLoaded = useCallback((loadedName: string, content: string) => {
    setHtmlCode(content);
    const baseName = loadedName.replace(/\.(html|htm)$/i, '').trim();
    if (baseName) {
      setFilename(`${baseName}.pdf`);
    }
    setExportStatusMessage(`Loaded ${loadedName}`);
  }, []);

  const handleDownloadDirectPdf = useCallback(async () => {
    if (!htmlCode.trim()) {
      setExportStatusMessage('Paste or upload HTML before downloading PDF');
      return;
    }

    const normalizedName = normalizePdfFilename(filename);
    if (normalizedName !== filename) {
      setFilename(normalizedName);
    }

    setIsGeneratingDirect(true);
    setExportStatusMessage(`Converting HTML to ${normalizedName}...`);

    try {
      const response = await fetch('/api/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          html: htmlCode,
          filename: normalizedName,
          fontSettings,
        }),
      }).catch(() => null);

      if (
        response &&
        response.ok &&
        response.headers.get('content-type')?.includes('application/pdf')
      ) {
        const pdfBlob = await response.blob();
        const downloadUrl = URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = normalizedName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(downloadUrl);
        setExportStatusMessage(`Downloaded ${normalizedName}`);
        return;
      }

      // Client-side fallback (for GitHub Pages / static hosting)
      const iframe = iframeRef.current;
      const doc = iframe?.contentDocument;
      const iframeWin = iframe?.contentWindow as
        | (Window & { html2pdf?: Html2PdfFactory })
        | null
        | undefined;

      if (!doc || !doc.body || !iframeWin) {
        throw new Error('Preview frame not ready');
      }

      if (doc.fonts && typeof doc.fonts.ready?.then === 'function') {
        await doc.fonts.ready;
      }

      if (typeof iframeWin.html2pdf !== 'function') {
        await new Promise<void>((resolve, reject) => {
          const script = doc.createElement('script');
          script.src = HTML2PDF_CDN_URL;
          script.crossOrigin = 'anonymous';
          script.onload = () => resolve();
          script.onerror = () =>
            reject(new Error('Failed to load html2pdf.js fallback'));
          doc.head.appendChild(script);
        });
      }

      const bodyStyle = iframeWin.getComputedStyle(doc.body);
      const htmlStyle = iframeWin.getComputedStyle(doc.documentElement);
      const resolvedBgColor =
        bodyStyle.backgroundColor &&
        bodyStyle.backgroundColor !== 'rgba(0, 0, 0, 0)' &&
        bodyStyle.backgroundColor !== 'transparent'
          ? bodyStyle.backgroundColor
          : htmlStyle.backgroundColor &&
            htmlStyle.backgroundColor !== 'rgba(0, 0, 0, 0)' &&
            htmlStyle.backgroundColor !== 'transparent'
          ? htmlStyle.backgroundColor
          : '#FFFFFF';

      const actualWidth = Math.max(
        doc.body.scrollWidth,
        doc.documentElement.scrollWidth,
        doc.body.offsetWidth,
        800
      );
      const actualHeight = Math.max(
        doc.body.scrollHeight,
        doc.documentElement.scrollHeight,
        doc.body.offsetHeight,
        600
      );

      const options = buildDirectHtml2PdfOptions(
        normalizedName,
        actualWidth,
        actualHeight,
        resolvedBgColor
      );

      const runner = iframeWin.html2pdf || window.html2pdf;
      if (typeof runner === 'function') {
        await runner().set(options).from(doc.body).save();
        setExportStatusMessage(`Downloaded ${normalizedName}`);
      } else {
        throw new Error('PDF generator unavailable');
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'PDF conversion failed';
      setExportStatusMessage(`Error: ${msg}`);
    } finally {
      setIsGeneratingDirect(false);
    }
  }, [htmlCode, filename, fontSettings]);

  const handleTriggerPrintVectorPdf = useCallback(() => {
    if (!htmlCode.trim()) {
      setExportStatusMessage('Paste or upload HTML before printing PDF');
      return;
    }

    const normalizedName = normalizePdfFilename(filename);
    const preparedHtml = prepareRawHtmlForPdf(htmlCode, fontSettings);

    const existingPrintFrame = document.getElementById(
      'dedicated-vector-print-iframe'
    );
    if (existingPrintFrame) {
      existingPrintFrame.remove();
    }

    const printFrame = document.createElement('iframe');
    printFrame.id = 'dedicated-vector-print-iframe';
    printFrame.title = 'Vector Print Frame';
    printFrame.style.position = 'fixed';
    printFrame.style.right = '0';
    printFrame.style.bottom = '0';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = '0';
    printFrame.style.visibility = 'hidden';
    document.body.appendChild(printFrame);

    const printDoc = printFrame.contentDocument;
    const printWin = printFrame.contentWindow;
    if (!printDoc || !printWin) {
      setExportStatusMessage('Print engine unavailable');
      return;
    }

    printDoc.open();
    printDoc.write(preparedHtml);
    printDoc.close();
    printDoc.title = normalizedName.replace(/\.pdf$/i, '');

    setExportStatusMessage(`Opened Print / Save as PDF (${normalizedName})`);

    window.setTimeout(() => {
      printWin.focus();
      printWin.print();
    }, 300);
  }, [htmlCode, filename, fontSettings]);

  return (
    <div className="flex flex-col h-dvh w-screen bg-[#111111] text-[#F5F5F5] overflow-hidden">
      <TopControlBar
        filename={filename}
        onChangeFilename={setFilename}
        fontSettings={fontSettings}
        onChangeLanguageMode={handleChangeLanguageMode}
        onChangeEnglishFont={handleChangeEnglishFont}
        onChangeFarsiFont={handleChangeFarsiFont}
        onDownloadDirectPdf={handleDownloadDirectPdf}
        onTriggerPrintVectorPdf={handleTriggerPrintVectorPdf}
        isGeneratingDirect={isGeneratingDirect}
        mobileTab={mobileTab}
        onChangeMobileTab={setMobileTab}
      />

      {/* Full-height single pane on mobile (< lg) with tab switching; side-by-side split on desktop (lg+) */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 grid-rows-[minmax(0,1fr)] min-h-0 overflow-hidden">
        <div
          className={`${
            mobileTab === 'editor' ? 'flex' : 'hidden'
          } lg:flex flex-col h-full min-h-0 min-w-0 overflow-hidden`}
        >
          <HtmlEditorPane
            htmlCode={htmlCode}
            onChangeHtml={setHtmlCode}
            onClear={handleClearEditor}
            onLoadSample={handleLoadSample}
            onFileLoaded={handleFileLoaded}
          />
        </div>

        <div
          className={`${
            mobileTab === 'preview' ? 'flex' : 'hidden'
          } lg:flex flex-col h-full min-h-0 min-w-0 overflow-hidden`}
        >
          <LivePreviewPane
            iframeRef={iframeRef}
            htmlCode={htmlCode}
            filename={filename}
            fontSettings={fontSettings}
            onLoadDefaultSample={() => handleLoadSample(SAMPLE_TEMPLATES[0])}
            exportStatusMessage={exportStatusMessage}
          />
        </div>
      </main>
    </div>
  );
}
