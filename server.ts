import express from 'express';
import { createServer as createViteServer } from 'vite';
import { execFile } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import os from 'os';
import crypto from 'crypto';

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

/**
 * Ensures the HTML string is a valid document and preserves background colors in PDF
 * without overriding any of the user's own CSS, layout, or @page rules.
 */
function prepareHtmlForNativePdf(rawHtml: string): string {
  const colorRule = `<style id="rotoscope-print-color-preserve">html, body, * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; color-adjust: exact !important; }</style>`;
  const trimmed = rawHtml.trim();

  if (!trimmed) {
    return `<!DOCTYPE html><html><head><meta charset="UTF-8">${colorRule}</head><body></body></html>`;
  }

  if (/<head[\s>]/i.test(trimmed)) {
    return trimmed.replace(/<head([^>]*)>/i, `<head$1>\n${colorRule}`);
  }

  if (/<html[\s>]/i.test(trimmed)) {
    return trimmed.replace(
      /<html([^>]*)>/i,
      `<html$1>\n<head><meta charset="UTF-8">${colorRule}</head>`
    );
  }

  return `<!DOCTYPE html>\n<html>\n<head>\n<meta charset="UTF-8">\n${colorRule}\n</head>\n<body>\n${trimmed}\n</body>\n</html>`;
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Support large pasted HTML documents (up to 50MB)
  app.use(express.json({ limit: '50mb' }));

  app.post('/api/pdf', async (req, res) => {
    const rawHtml = typeof req.body?.html === 'string' ? req.body.html : '';
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
      const preparedHtml = prepareHtmlForNativePdf(rawHtml);
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
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
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
