import React from 'react';
import {
  Eye,
  Sparkles,
  FileText,
} from 'lucide-react';
import {
  ENGLISH_FONT_OPTIONS,
  FARSI_FONT_OPTIONS,
  normalizePersianHTML,
  PdfLanguageFontSettings,
  prepareRawHtmlForPdf,
} from '../utils/pdfConfig';

interface LivePreviewPaneProps {
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  htmlCode: string;
  filename: string;
  fontSettings: PdfLanguageFontSettings;
  onLoadDefaultSample: () => void;
  exportStatusMessage?: string | null;
}

export const LivePreviewPane: React.FC<LivePreviewPaneProps> = ({
  iframeRef,
  htmlCode,
  filename,
  fontSettings,
  onLoadDefaultSample,
  exportStatusMessage,
}) => {
  const isEmpty = htmlCode.trim().length === 0;
  const normalizedHtml = normalizePersianHTML(htmlCode);
  const preparedHtml = prepareRawHtmlForPdf(normalizedHtml, fontSettings);

  const activeFontLabel =
    fontSettings.languageMode === 'en'
      ? ENGLISH_FONT_OPTIONS.find((o) => o.id === fontSettings.englishFont)
          ?.label || 'Vazirmatn (Default)'
      : FARSI_FONT_OPTIONS.find((o) => o.id === fontSettings.farsiFont)
          ?.label || 'Vazirmatn (وزیرمتن)';

  return (
    <section
      aria-label="Live HTML Preview Pane"
      className="flex flex-col h-full min-h-0 max-h-full bg-[#111111] min-w-0 overflow-hidden"
    >
      {/* Preview Toolbar Header */}
      <div className="flex items-center justify-between gap-2 px-3 sm:px-4 h-9 sm:h-10 bg-[#1A1A1A] border-b border-[#2A2A2A] shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <Eye className="w-3.5 h-3.5 text-[#C93B61] shrink-0" />
          <h2 className="text-xs font-semibold text-[#F5F5F5] whitespace-nowrap">
            Live Document Preview
          </h2>
          <span aria-hidden="true" className="hidden sm:inline text-[#444444]">
            ·
          </span>
          <span className="hidden sm:inline text-[11px] font-mono text-[#9A9A9A] truncate">
            {fontSettings.languageMode.toUpperCase()} · {activeFontLabel}
          </span>
        </div>

        <span className="text-[11px] font-mono text-[#9A9A9A] shrink-0">
          {filename.trim() || 'document.pdf'}
        </span>
      </div>

      {/* Main Unscaled Full-Bleed Preview Viewport */}
      <div className="relative flex-1 min-h-0 bg-[#111111] overflow-hidden flex flex-col">
        {isEmpty ? (
          <div className="m-auto max-w-md w-full bg-[#1A1A1A] border border-[#2A2A2A] p-8 text-center">
            <div className="w-10 h-10 mx-auto mb-4 bg-[#111111] border border-[#2A2A2A] flex items-center justify-center text-[#C93B61]">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-[#F5F5F5] mb-2">
              Ready to Convert HTML to PDF
            </h3>
            <p className="text-xs text-[#A3A3A3] leading-relaxed mb-6">
              Paste your HTML code in the editor or drop an{' '}
              <code className="text-[#F5F5F5]">.html</code> file. Switch between{' '}
              <strong className="text-[#F5F5F5]">EN</strong> and{' '}
              <strong className="text-[#F5F5F5]">FA (فارسی)</strong> in the top header to select your typography.
            </p>
            <button
              type="button"
              onClick={onLoadDefaultSample}
              className="px-4 py-2 bg-[#7F072B] hover:bg-[#960934] text-[#F5F5F5] border border-[#9E1940] text-xs font-semibold inline-flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Load Sample HTML</span>
            </button>
          </div>
        ) : null}

        <iframe
          ref={iframeRef}
          id="live-pdf-preview-iframe"
          title="Live HTML Preview"
          srcDoc={preparedHtml}
          className={isEmpty ? 'sr-only' : 'w-full h-full border-0 block bg-white flex-1'}
        />
      </div>

      {/* Preview Footer Bar */}
      <div className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[#1A1A1A] border-t border-[#2A2A2A] flex items-center justify-between gap-2 text-[11px] font-mono text-[#9A9A9A] shrink-0">
        <span className="truncate">
          {fontSettings.languageMode === 'en' ? 'EN Mode' : 'FA Mode'} · {activeFontLabel}
        </span>
        <div className="truncate text-right shrink-0" role="status" aria-live="polite">
          {exportStatusMessage ? (
            <span className="text-[#E5E5E5]">{exportStatusMessage}</span>
          ) : (
            <span>Ready · {filename.trim() || 'document.pdf'}</span>
          )}
        </div>
      </div>
    </section>
  );
};
