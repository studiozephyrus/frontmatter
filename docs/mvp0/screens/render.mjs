// Renders every sNN-*.html in this folder to a PNG with headless Chrome.
// Waits on the FILE (PNG IEND trailer), never on the process (LR#74).
//   node docs/mvp0/screens/render.mjs [--only s03]
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const HERE = path.dirname(new URL(import.meta.url).pathname);
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const only = process.argv.includes('--only') ? process.argv[process.argv.indexOf('--only') + 1] : null;
const files = fs.readdirSync(HERE).filter(f => /^s\d\d-.*\.html$/.test(f) && (!only || f.startsWith(only))).sort();

function shoot(html) {
  const png = path.join(HERE, html.replace(/\.html$/, '.png'));
  const mobile = /-phone\.html$/.test(html);
  const [w, h] = mobile ? [390, 844] : [1440, 900];
  return new Promise((res, rej) => {
    fs.rmSync(png, { force: true });
    const profile = fs.mkdtempSync(path.join(process.env.TMPDIR || '/tmp', 'fm-shot-'));
    const p = spawn(CHROME, ['--headless', '--disable-gpu', '--no-sandbox', '--hide-scrollbars', '--no-first-run',
      '--disable-crash-reporter', `--user-data-dir=${profile}`, `--window-size=${w},${h}`, '--force-device-scale-factor=2',
      '--virtual-time-budget=4000', `--screenshot=${png}`, 'file://' + path.join(HERE, html)], { detached: true, stdio: 'ignore' });
    p.unref();
    const t0 = Date.now();
    const iv = setInterval(() => {
      if (fs.existsSync(png) && fs.statSync(png).size > 20000) {
        const sz = fs.statSync(png).size;
        const fd = fs.openSync(png, 'r'); const b = Buffer.alloc(12); fs.readSync(fd, b, 0, 12, sz - 12); fs.closeSync(fd);
        if (b.includes(Buffer.from('IEND'))) {
          clearInterval(iv); try { process.kill(-p.pid, 'SIGKILL'); } catch { /* already gone */ }
          fs.rmSync(profile, { recursive: true, force: true });
          return res(`${html} -> ${(sz / 1024).toFixed(0)} KB`);
        }
      }
      if (Date.now() - t0 > 60000) { clearInterval(iv); try { process.kill(-p.pid, 'SIGKILL'); } catch { /* already gone */ } rej(new Error(html + ' timeout')); }
    }, 300);
  });
}
for (const f of files) console.log('ok  ', await shoot(f));
