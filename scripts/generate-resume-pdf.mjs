/**
 * Renders the /resume page of the built site to PDF.
 *
 *  - dist/resume.pdf        Public copy, deployed with the site. No phone number.
 *  - private/<fileName>     Private copy with your phone number, for sending
 *                           with applications. Never deployed (dist/ only is
 *                           uploaded) and git-ignored.
 *
 * The phone number comes from RESUME_PHONE in `.env.local` (git-ignored).
 * It is injected into the page only while printing the private copy, so it is
 * never part of the website's code. No RESUME_PHONE = no private copy.
 *
 * Runs automatically at the end of `npm run build`. Run it on its own with
 * `npm run resume:pdf` (after a build) to regenerate just the PDFs.
 */
import { loadEnv, preview } from 'vite';
import puppeteer from 'puppeteer';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(root, 'dist');
const privateDir = path.join(root, 'private');

if (!fs.existsSync(path.join(distDir, 'index.html'))) {
  console.error('dist/ not found. Run `npm run build` first.');
  process.exit(1);
}

// '' prefix = load every variable in .env / .env.local, not just VITE_ ones.
const env = { ...loadEnv('production', root, ''), ...process.env };
const phone = (env.RESUME_PHONE || '').trim();
// Reuse resume.fileName from the config for the private copy's name.
const configText = fs.readFileSync(
  path.join(root, 'gitprofile.config.ts'),
  'utf8',
);
const privateName =
  configText.match(/fileName:\s*['"`]([^'"`]+\.pdf)['"`]/)?.[1] || 'Resume.pdf';

const server = await preview({
  root,
  logLevel: 'warn',
  preview: { port: 0, strictPort: false, open: false },
});
const baseUrl = server.resolvedUrls?.local?.[0];
if (!baseUrl) {
  console.error('Could not start the preview server.');
  process.exit(1);
}

const browser = await puppeteer.launch({
  // GitHub Actions / Docker runners need this; harmless locally.
  args: process.env.CI ? ['--no-sandbox', '--disable-setuid-sandbox'] : [],
});

const countPages = (pdf) =>
  (pdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;

const renderPdf = async (privateDetails) => {
  const page = await browser.newPage();
  page.on('pageerror', (err) => console.error('[resume page]', err.message));
  if (privateDetails) {
    await page.evaluateOnNewDocument((details) => {
      window.__RESUME_PRIVATE__ = details;
    }, privateDetails);
  }
  await page.goto(new URL('resume?print', baseUrl).href, {
    waitUntil: 'networkidle0',
  });
  await page.waitForSelector('html[data-resume-ready="true"]', {
    timeout: 15000,
  });
  const pdf = Buffer.from(
    await page.pdf({
      preferCSSPageSize: true,
      printBackground: true,
      tagged: true, // accessible PDF (headings, lists, links)
      outline: true, // PDF bookmarks from the headings
    }),
  );
  await page.close();
  return pdf;
};

const report = (label, file, pdf) => {
  const pages = countPages(pdf);
  console.log(
    `✓ ${label} → ${path.relative(root, file)} (${pages} page${pages === 1 ? '' : 's'}, ${Math.round(pdf.length / 1024)} KB)`,
  );
  if (pages > 2) {
    console.warn(
      '  Heads up: the resume now runs past 2 pages. Add `hideOnPDF: true` to some items in gitprofile.config.ts.',
    );
  }
};

try {
  const publicFile = path.join(distDir, 'resume.pdf');
  const publicPdf = await renderPdf(null);
  fs.writeFileSync(publicFile, publicPdf);
  report('public resume', publicFile, publicPdf);

  if (phone) {
    fs.mkdirSync(privateDir, { recursive: true });
    const privateFile = path.join(privateDir, privateName);
    const privatePdf = await renderPdf({ phone });
    fs.writeFileSync(privateFile, privatePdf);
    report('private resume (with phone)', privateFile, privatePdf);
  } else {
    console.log(
      '  No RESUME_PHONE in .env.local, so no private copy was made (that is fine on CI).',
    );
  }

  // Safety net: the phone number must never end up in the deployed site.
  if (phone) {
    const digits = phone.replace(/\D/g, '');
    const leaks = [];
    const walk = (dir) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(full);
        else if (/\.(html|js|css|json|txt|webmanifest|pdf)$/.test(entry.name)) {
          const text = fs.readFileSync(full, 'latin1');
          if (text.includes(phone) || text.includes(digits)) leaks.push(full);
        }
      }
    };
    walk(distDir);
    if (leaks.length) {
      console.error(
        `✗ Your phone number was found in files that would be deployed:\n  ${leaks.map((f) => path.relative(root, f)).join('\n  ')}`,
      );
      process.exitCode = 1;
    }
  }
} finally {
  await browser.close();
  await server.close();
}
