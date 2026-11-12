import React from 'react';
import {
  Download,
  Printer,
  FileCode2,
  Loader2,
  Code2,
  Eye,
  Languages,
  Type,
} from 'lucide-react';
import {
  LanguageMode,
  EnglishFontPreset,
  FarsiFontPreset,
  ENGLISH_FONT_OPTIONS,
  FARSI_FONT_OPTIONS,
  PdfLanguageFontSettings,
} from '../utils/pdfConfig';

export type MobileActiveTab = 'editor' | 'preview';

interface TopControlBarProps {
  filename: string;
  onChangeFilename: (nextFilename: string) => void;
  fontSettings: PdfLanguageFontSettings;
  onChangeLanguageMode: (mode: LanguageMode) => void;
  onChangeEnglishFont: (font: EnglishFontPreset) => void;
  onChangeFarsiFont: (font: FarsiFontPreset) => void;
  onDownloadDirectPdf: () => void;
  onTriggerPrintVectorPdf: () => void;
  isGeneratingDirect: boolean;
  mobileTab: MobileActiveTab;
  onChangeMobileTab: (tab: MobileActiveTab) => void;
}

export const TopControlBar: React.FC<TopControlBarProps> = ({
  filename,
  onChangeFilename,
  fontSettings,
  onChangeLanguageMode,
  onChangeEnglishFont,
  onChangeFarsiFont,
  onDownloadDirectPdf,
  onTriggerPrintVectorPdf,
  isGeneratingDirect,
  mobileTab,
  onChangeMobileTab,
}) => {
  const { languageMode, englishFont, farsiFont } = fontSettings;

  return (
    <header className="w-full bg-[#1A1A1A] border-b border-[#2A2A2A] shrink-0">
      <div className="px-3 sm:px-4 py-2 sm:py-2.5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2.5">
        {/* Left: Brand Identity + Mobile Filename */}
        <div className="flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#7F072B] border border-[#9E1940] flex items-center justify-center text-[#F5F5F5] shrink-0">
              <FileCode2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-xs sm:text-sm font-semibold tracking-tight text-[#F5F5F5] truncate block leading-tight">
                Rotoscope HTML to PDF
              </span>
              <span className="hidden sm:block text-[10px] text-[#9A9A9A] font-mono truncate leading-tight mt-0.5">
                Direct HTML to PDF · EN &amp; Farsi Typography
              </span>
            </div>
          </div>

          {/* Compact Filename Input on Mobile (< sm) */}
          <div className="flex sm:hidden items-center gap-1.5 shrink-0">
            <label htmlFor="pdf-filename-input-mobile" className="sr-only">
              Output Filename
            </label>
            <input
              id="pdf-filename-input-mobile"
              type="text"
              value={filename}
              onChange={(e) => onChangeFilename(e.target.value)}
              placeholder="document.pdf"
              className="h-7 w-28 bg-[#111111] border border-[#2A2A2A] px-2 text-[11px] font-mono text-[#F5F5F5] placeholder-[#666666] focus:outline-none focus:border-[#7F072B]"
            />
          </div>
        </div>

        {/* Center / Right Controls: Language Switcher (EN / FA) + Font Selector + Filename + Export Buttons */}
        <div className="flex flex-wrap items-center justify-between lg:justify-end gap-2">
          {/* Language & Font Bar */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-1 sm:flex-initial min-w-0">
            {/* EN / FA Segmented Switcher */}
            <div
              role="group"
              aria-label="Document Language Mode"
              className="flex items-center h-8 bg-[#111111] border border-[#2A2A2A] p-0.5 shrink-0"
            >
              <Languages className="w-3.5 h-3.5 text-[#888888] mx-1.5 hidden sm:block" />
              <button
                type="button"
                onClick={() => onChangeLanguageMode('en')}
                className={`h-full px-2.5 text-xs font-mono font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  languageMode === 'en'
                    ? 'bg-[#7F072B] text-[#F5F5F5]'
                    : 'text-[#9A9A9A] hover:text-[#F5F5F5]'
                }`}
                title="English mode (Western numerals 0-9 & English fonts)"
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => onChangeLanguageMode('fa')}
                className={`h-full px-2.5 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  languageMode === 'fa'
                    ? 'bg-[#7F072B] text-[#F5F5F5]'
                    : 'text-[#9A9A9A] hover:text-[#F5F5F5]'
                }`}
                title="Farsi mode (Persian fonts like B Nazanin & Persian numerals ۰-۹)"
              >
                FA · فارسی
              </button>
            </div>

            {/* Dynamic Font Dropdown based on EN vs FA mode */}
            <div className="flex items-center h-8 bg-[#111111] border border-[#2A2A2A] px-2 gap-1.5 flex-1 sm:flex-initial min-w-0">
              <Type className="w-3.5 h-3.5 text-[#C93B61] shrink-0" />
              <label htmlFor="language-font-select" className="sr-only">
                {languageMode === 'en' ? 'English Font' : 'Farsi Font'}
              </label>
              {languageMode === 'en' ? (
                <select
                  id="language-font-select"
                  aria-label="English Font"
                  value={englishFont}
                  onChange={(e) =>
                    onChangeEnglishFont(e.target.value as EnglishFontPreset)
                  }
                  className="h-full w-full sm:w-44 bg-[#111111] text-xs text-[#F5F5F5] focus:outline-none cursor-pointer truncate"
                >
                  {ENGLISH_FONT_OPTIONS.map((opt) => (
                    <option
                      key={opt.id}
                      value={opt.id}
                      className="bg-[#1A1A1A] text-[#F5F5F5]"
                    >
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : (
                <select
                  id="language-font-select"
                  aria-label="Farsi Font"
                  value={farsiFont}
                  onChange={(e) =>
                    onChangeFarsiFont(e.target.value as FarsiFontPreset)
                  }
                  className="h-full w-full sm:w-44 bg-[#111111] text-xs text-[#F5F5F5] focus:outline-none cursor-pointer truncate"
                >
                  {FARSI_FONT_OPTIONS.map((opt) => (
                    <option
                      key={opt.id}
                      value={opt.id}
                      className="bg-[#1A1A1A] text-[#F5F5F5]"
                    >
                      {opt.label}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Filename Input (sm+) & Export Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="hidden sm:flex items-center gap-1.5">
              <label
                htmlFor="pdf-filename-input"
                className="text-[11px] font-mono text-[#A3A3A3] whitespace-nowrap"
              >
                File:
              </label>
              <input
                id="pdf-filename-input"
                type="text"
                value={filename}
                onChange={(e) => onChangeFilename(e.target.value)}
                placeholder="document.pdf"
                className="h-8 w-36 bg-[#111111] border border-[#2A2A2A] px-2.5 text-xs font-mono text-[#F5F5F5] placeholder-[#666666] focus:outline-none focus:border-[#7F072B] transition-colors"
              />
            </div>

            <button
              type="button"
              onClick={onDownloadDirectPdf}
              disabled={isGeneratingDirect}
              className="flex-1 sm:flex-initial h-8 px-3 sm:px-3.5 bg-[#7F072B] hover:bg-[#960934] active:bg-[#660522] disabled:opacity-60 text-[#F5F5F5] border border-[#9E1940] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7F072B]"
            >
              {isGeneratingDirect ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
              ) : (
                <Download className="w-3.5 h-3.5 shrink-0" />
              )}
              <span className="sm:hidden">
                {isGeneratingDirect ? 'Converting...' : 'Download PDF'}
              </span>
              <span className="hidden sm:inline">
                {isGeneratingDirect ? 'Converting...' : 'Download PDF (Direct)'}
              </span>
            </button>

            <button
              type="button"
              onClick={onTriggerPrintVectorPdf}
              className="flex-1 sm:flex-initial h-8 px-3 sm:px-3.5 bg-[#111111] hover:bg-[#7F072B] active:bg-[#660522] text-[#F5F5F5] border border-[#2A2A2A] hover:border-[#9E1940] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7F072B]"
            >
              <Printer className="w-3.5 h-3.5 shrink-0" />
              <span className="sm:hidden">Print Vector</span>
              <span className="hidden sm:inline">Save Vector PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile / Tablet Full-Height Workspace Switcher (< lg) */}
      <div
        role="tablist"
        aria-label="Workspace View Switcher"
        className="grid grid-cols-2 lg:hidden border-t border-[#2A2A2A] bg-[#141414]"
      >
        <button
          type="button"
          role="tab"
          aria-selected={mobileTab === 'editor'}
          onClick={() => onChangeMobileTab('editor')}
          className={`h-9 flex items-center justify-center gap-2 text-xs font-semibold border-r border-[#2A2A2A] transition-colors cursor-pointer ${
            mobileTab === 'editor'
              ? 'bg-[#7F072B] text-[#F5F5F5]'
              : 'bg-[#141414] text-[#A3A3A3] hover:text-[#F5F5F5]'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>HTML Code Editor</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mobileTab === 'preview'}
          onClick={() => onChangeMobileTab('preview')}
          className={`h-9 flex items-center justify-center gap-2 text-xs font-semibold transition-colors cursor-pointer ${
            mobileTab === 'preview'
              ? 'bg-[#7F072B] text-[#F5F5F5]'
              : 'bg-[#141414] text-[#A3A3A3] hover:text-[#F5F5F5]'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Live PDF Preview</span>
        </button>
      </div>
    </header>
  );
};
