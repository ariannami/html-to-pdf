import express from 'express';
import { createServer as createViteServer } from 'vite';
import { execFile } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import os from 'os';
import crypto from 'crypto';
import {
  DEFAULT_LANGUAGE_FONT_SETTINGS,
  PdfLanguageFontSettings,
  prepareRawHtmlForPdf,
} from './src/utils/pdfConfig';

const execFileAsync = promisify(execFile);

const CHROMIUM_CANDIDATES = [
  '/ms-playwright/chrome-headless-shell-linux64/chrome-headless-shell',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  '/usr/bin/google-chrome',
  '/usr/bin/google-chrome-stable',
];

function findChromiumExecutable(): string | null {
  for (const candidate of CHROMIUM_CANDIDATES) {
    if (existsSync(candidate)) {
      return candidate;
    }
  }
  return null;
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Support large pasted HTML documents (up to 50MB)
  app.use(express.json({ limit: '50mb' }));

  app.post(['/api/pdf', '/html-to-pdf/api/pdf'], async (req, res) => {
    const rawHtml = typeof req.body?.html === 'string' ? req.body.html : '';
    const fontSettings: PdfLanguageFontSettings =
      req.body?.fontSettings && typeof req.body.fontSettings === 'object'
        ? { ...DEFAULT_LANGUAGE_FONT_SETTINGS, ...req.body.fontSettings }
        : DEFAULT_LANGUAGE_FONT_SETTINGS;

    if (!rawHtml.trim()) {
      res.status(400).json({ error: 'HTML content is required' });
      return;
    }

    const chromiumPath = findChromiumExecutable();
    if (!chromiumPath) {
      res.status(503).json({ error: 'Native Chromium PDF engine not found on host' });
      return;
    }

    const jobId = crypto.randomUUID();
    const tmpDir = os.tmpdir();
    const inputHtmlPath = path.join(tmpDir, `rotoscope-${jobId}.html`);
    const outputPdfPath = path.join(tmpDir, `rotoscope-${jobId}.pdf`);

    try {
      const preparedHtml = prepareRawHtmlForPdf(rawHtml, fontSettings);
      await fs.writeFile(inputHtmlPath, preparedHtml, 'utf-8');

      await execFileAsync(
        chromiumPath,
        [
          '--headless',
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-gpu',
          '--disable-dev-shm-usage',
          '--no-pdf-header-footer',
          `--print-to-pdf=${outputPdfPath}`,
          `file://${inputHtmlPath}`,
        ],
        { timeout: 30000 }
      );

      const pdfBuffer = await fs.readFile(outputPdfPath);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Length', pdfBuffer.length.toString());
      res.send(pdfBuffer);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to convert HTML to PDF';
      res.status(500).json({ error: message });
    } finally {
      await fs.unlink(inputHtmlPath).catch(() => {});
      await fs.unlink(outputPdfPath).catch(() => {});
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    // Allow accessing root / in dev even when vite.config.ts has base: '/html-to-pdf/'
    app.use((req, _res, next) => {
      if (
        !req.url.startsWith('/html-to-pdf') &&
        !req.url.startsWith('/api/') &&
        !req.url.startsWith('/@') &&
        !req.url.startsWith('/src/') &&
        !req.url.startsWith('/node_modules/')
      ) {
        req.url = `/html-to-pdf${req.url === '/' ? '/' : req.url}`;
      }
      next();
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use('/html-to-pdf', express.static(distPath));
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
