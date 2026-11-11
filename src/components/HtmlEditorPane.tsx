import React, { useRef, useState } from 'react';
import {
  Upload,
  Trash2,
  Sparkles,
  FileCode,
} from 'lucide-react';
import { calculateEditorStats } from '../utils/pdfConfig';
import { SAMPLE_TEMPLATES, SampleTemplate } from '../utils/sampleHtml';

interface HtmlEditorPaneProps {
  htmlCode: string;
  onChangeHtml: (nextHtml: string) => void;
  onClear: () => void;
  onLoadSample: (template?: SampleTemplate) => void;
  onFileLoaded: (filename: string, content: string) => void;
}

export const HtmlEditorPane: React.FC<HtmlEditorPaneProps> = ({
  htmlCode,
  onChangeHtml,
  onClear,
  onLoadSample,
  onFileLoaded,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [cursorPosition, setCursorPosition] = useState<{ line: number; col: number }>({
    line: 1,
    col: 1,
  });

  const stats = calculateEditorStats(htmlCode);
  const lineCount = Math.max(1, stats.lines);

  const handleScroll = () => {
    if (textareaRef.current && gutterRef.current) {
      gutterRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const updateCursorMetrics = () => {
    const el = textareaRef.current;
    if (!el) return;
    const selectionStart = el.selectionStart || 0;
    const upToCursor = el.value.slice(0, selectionStart);
    const lines = upToCursor.split('\n');
    setCursorPosition({
      line: lines.length,
      col: lines[lines.length - 1].length + 1,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const el = e.currentTarget;
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const nextValue =
        htmlCode.substring(0, start) + '  ' + htmlCode.substring(end);
      onChangeHtml(nextValue);
      requestAnimationFrame(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd =
            start + 2;
          updateCursorMetrics();
        }
      });
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = typeof event.target?.result === 'string' ? event.target.result : '';
      setUploadedFileName(file.name);
      onFileLoaded(file.name, content);
    };
    reader.readAsText(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
    e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDraggingOver) {
      setIsDraggingOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  return (
    <section
      aria-label="HTML Code Editor Pane"
      className="flex flex-col h-full min-h-0 max-h-full bg-[#1A1A1A] lg:border-r border-[#2A2A2A] min-w-0 overflow-hidden"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        id="html-file-upload-input"
        type="file"
        accept=".html,.htm,text/html"
        onChange={handleFileInputChange}
        className="sr-only"
      />

      {/* Editor Toolbar Header */}
      <div className="flex items-center justify-between gap-2 px-3 sm:px-4 h-9 sm:h-10 bg-[#1A1A1A] border-b border-[#2A2A2A] shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <FileCode className="w-3.5 h-3.5 text-[#A3A3A3] shrink-0" />
          <h2 className="text-xs font-semibold text-[#F5F5F5] whitespace-nowrap">
            Raw HTML
          </h2>
          <span aria-hidden="true" className="hidden sm:inline text-[#444444]">
            ·
          </span>
          <span className="hidden sm:inline text-[11px] font-mono text-[#9A9A9A] tabular-nums whitespace-nowrap truncate">
            {stats.lines} lines · {stats.characters.toLocaleString()} chars
          </span>
        </div>

        {/* Editor Actions: Upload (Mobile inline), Load Sample HTML, Clear */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="sm:hidden h-7 px-2 bg-[#111111] hover:bg-[#242424] text-[#D4D4D4] border border-[#2A2A2A] text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            title="Upload .html file"
          >
            <Upload className="w-3 h-3 text-[#C93B61]" />
            <span>Upload</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setUploadedFileName(null);
              onLoadSample(SAMPLE_TEMPLATES[0]);
            }}
            className="h-7 px-2 sm:px-2.5 bg-[#7F072B] hover:bg-[#960934] active:bg-[#660522] text-[#F5F5F5] border border-[#9E1940] text-[11px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <Sparkles className="w-3 h-3" />
            <span className="sm:hidden">Sample</span>
            <span className="hidden sm:inline">Load Sample HTML</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setUploadedFileName(null);
              onClear();
            }}
            className="h-7 px-2 sm:px-2.5 bg-[#111111] hover:bg-[#242424] text-[#D4D4D4] hover:text-[#F5F5F5] border border-[#2A2A2A] text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Drag-and-Drop HTML Upload Zone (Shown on sm+ screens so mobile gets maximum code space) */}
      <div className="hidden sm:block px-4 py-2 bg-[#151515] border-b border-[#2A2A2A] shrink-0">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={`w-full py-1.5 px-3 border border-dashed flex items-center justify-between gap-3 text-left transition-colors cursor-pointer ${
            isDraggingOver
              ? 'bg-[#7F072B]/25 border-[#7F072B] text-[#F5F5F5]'
              : 'bg-[#111111] border-[#2A2A2A] hover:border-[#7F072B] text-[#A3A3A3] hover:text-[#F5F5F5]'
          }`}
        >
          <span className="flex items-center gap-2 text-xs truncate">
            <Upload className="w-3.5 h-3.5 text-[#C93B61] shrink-0" />
            <span className="truncate">
              {isDraggingOver
                ? 'Drop .html file here to load into editor'
                : uploadedFileName
                ? `Loaded file: ${uploadedFileName} (click or drag to replace)`
                : 'Drag and drop an .html file here, or click to upload'}
            </span>
          </span>
          <span className="text-[11px] font-mono text-[#888888] whitespace-nowrap shrink-0">
            .html / .htm
          </span>
        </button>
      </div>

      {/* Monospace Code Editor with Absolute Line-Number Gutter & Scrollable Textarea */}
      <div className="relative flex-1 min-h-0 bg-[#111111] overflow-hidden">
        {/* Line Numbers Gutter */}
        <div
          ref={gutterRef}
          aria-hidden="true"
          onWheel={(e) => {
            if (textareaRef.current) {
              textareaRef.current.scrollTop += e.deltaY;
            }
          }}
          className="absolute inset-y-0 left-0 w-10 sm:w-12 py-3 bg-[#161616] border-r border-[#2A2A2A] text-right pr-2 sm:pr-3 select-none overflow-hidden font-mono text-[11px] sm:text-[12px] leading-[22px] text-[#666666] tabular-nums z-10"
        >
          {Array.from({ length: lineCount }, (_, idx) => {
            const lineNum = idx + 1;
            const isCurrent = lineNum === cursorPosition.line;
            return (
              <div
                key={lineNum}
                className={
                  isCurrent ? 'text-[#F5F5F5] font-semibold' : 'text-[#5A5A5A]'
                }
              >
                {lineNum}
              </div>
            );
          })}
        </div>

        {/* Code Textarea with guaranteed vertical & horizontal scrolling */}
        <div className="absolute inset-y-0 left-10 sm:left-12 right-0">
          <label htmlFor="html-source-textarea" className="sr-only">
            HTML and CSS Source Code Editor
          </label>
          <textarea
            ref={textareaRef}
            id="html-source-textarea"
            value={htmlCode}
            onChange={(e) => {
              onChangeHtml(e.target.value);
              updateCursorMetrics();
            }}
            onScroll={handleScroll}
            onKeyUp={updateCursorMetrics}
            onClick={updateCursorMetrics}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            placeholder="Paste your raw HTML here..."
            className="w-full h-full py-3 px-3 sm:px-4 bg-[#111111] text-[#F5F5F5] placeholder-[#555555] font-mono text-[12px] sm:text-[12.5px] leading-[22px] resize-none focus:outline-none overflow-y-scroll overflow-x-auto selection:bg-[#7F072B] selection:text-[#FFFFFF] bg-[linear-gradient(to_bottom,transparent_21px,#1A1A1A_22px)] bg-[size:100%_22px] bg-local"
          />
        </div>
      </div>

      {/* Editor Footer Status Bar */}
      <div className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[#1A1A1A] border-t border-[#2A2A2A] flex items-center justify-between gap-2 text-[11px] font-mono text-[#9A9A9A] shrink-0">
        <div className="flex items-center gap-2 sm:gap-3 tabular-nums">
          <span>
            Ln {cursorPosition.line}, Col {cursorPosition.col}
          </span>
          <span aria-hidden="true">·</span>
          <span>{(stats.bytes / 1024).toFixed(2)} KB</span>
          <span aria-hidden="true" className="hidden sm:inline">·</span>
          <span className="hidden sm:inline">UTF-8</span>
        </div>
        <span className="text-[#888888] truncate">
          Direct HTML passthrough
        </span>
      </div>
    </section>
  );
};
