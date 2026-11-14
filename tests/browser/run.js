#!/usr/bin/env node
// Browser tests: each suite runs inside the real page, served over http with its real
// Content-Security-Policy, in headless Chrome. No dependency beyond Node and Chrome.
//
//   node tests/browser/run.js                  every suite, every width it supports
//   node tests/browser/run.js menus tabs       only these suites
//   node tests/browser/run.js --width=360      only this width
//   node tests/browser/run.js --list           the suites and their widths
//
// Chrome is found on its usual paths; set CHROME_PATH to use another one.
// A suite is a script in suites/: it drives the page, then adds <pre id="bench-out"> holding
// one line per check, starting with PASS or FAIL.

const http = require('http'), fs = require('fs'), os = require('os'), path = require('path');
const { spawn, execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..');
const SUITES_DIR = path.join(__dirname, 'suites');
const TIMEOUT_MS = 90000;

// Widths in CSS pixels. Suites written before the redesign only know the wide layout.
const WIDE = [1400];
const RESPONSIVE = [1400, 1024, 760, 360];
const SUITES = {
  'generation-settings': { widths: WIDE },
  'board': { widths: WIDE },
  'svg-export': { widths: WIDE },
  'board-pins': { widths: WIDE },
  'relief-yarn': { widths: WIDE },
  'zoom-controls': { widths: WIDE },
  'board-criteria': { widths: WIDE },
  'shared-link': { widths: WIDE, hash: '#tartan=1&sym=1&z=0&mm=0.7&id=4242&rel=1.5&yarn=1&s=R.C80000.48_B.000064.8_K.101010.12' },
  'text-export': { widths: WIDE },
  'weaving-sheet': { widths: RESPONSIVE },
  'product-views-canvas': { widths: RESPONSIVE },
  'zoom-pan': { widths: WIDE },
  'color-readability': { widths: WIDE },
  'photo-estimate': { widths: WIDE },
  'photo-proposals': { widths: WIDE },
  'image-invent': { widths: WIDE },
  'menus': { widths: RESPONSIVE },
  'tabs': { widths: RESPONSIVE },
  'srt-bar-history': { widths: RESPONSIVE },
  'modes-phone': { widths: RESPONSIVE },
  'menus-intent': { widths: RESPONSIVE },
  'readability': { widths: RESPONSIVE },
  'product-views': { widths: RESPONSIVE },
  'prepare-weaving': { widths: RESPONSIVE },
  'layout-fixes': { widths: RESPONSIVE },
  'themes': { widths: RESPONSIVE },
};

function findChrome() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  const candidates = [
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
  ];
  for (const c of candidates) if (fs.existsSync(c)) return c;
  for (const name of ['google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser']) {
    try { return execSync(`command -v ${name}`, { stdio: ['ignore', 'pipe', 'ignore'], shell: '/bin/sh' }).toString().trim(); } catch (e) { /* next */ }
  }
  return null;
}

// Sent to the page next to the suite: reports the result and any Content-Security-Policy violation
const REPORTER = `(function w(){const p=document.getElementById('bench-out');if(p){fetch('/__done',{method:'POST',body:p.textContent});}else setTimeout(w,100);})();
window.addEventListener('securitypolicyviolation',e=>{fetch('/__csp',{method:'POST',body:e.violatedDirective+' '+e.blockedURI});});`;
const TYPES = { '.js': 'text/javascript', '.html': 'text/html', '.png': 'image/png', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml' };

// One suite at one width. Resolves to { pass, fail, lines, csp, timedOut }.
function runOnce(chromePath, name, width) {
  return new Promise(resolve => {
    const suite = SUITES[name];
    // Headless Chrome windows cannot be narrower than 500 px: narrow layouts run in an iframe
    const frame = width < 500 ? { w: width, h: 780 } : null;
    const hash = suite.hash || '';
    const csp = [];
    let chrome = null, done = false, timer = null;
    const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'tartan-tests-'));
    const finish = (text, timedOut = false) => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      const lines = text.split('\n').filter(Boolean);
      if (chrome) chrome.kill();
      server.close();
      setTimeout(() => {
        try { fs.rmSync(profile, { recursive: true, force: true }); } catch (e) { /* Chrome may still hold it */ }
        resolve({ pass: lines.filter(l => l.startsWith('PASS')).length, fail: lines.filter(l => l.startsWith('FAIL')).length, lines, csp, timedOut });
      }, 300);
    };
    const server = http.createServer((req, res) => {
      const url = req.url.split('?')[0];
      if (url === '/__done' || url === '/__csp') {
        let body = '';
        req.on('data', d => body += d);
        req.on('end', () => { res.end('ok'); if (url === '/__csp') csp.push(body); else finish(body); });
        return;
      }
      if (url === '/__frame') {
        res.setHeader('content-type', 'text/html');
        return res.end(`<!doctype html><body style="margin:0"><iframe src="/${hash}" style="width:${frame.w}px;height:${frame.h}px;border:0;display:block"></iframe>`);
      }
      if (url === '/__suite.js') { res.setHeader('content-type', 'text/javascript'); return res.end(fs.readFileSync(path.join(SUITES_DIR, name + '.js'), 'utf8')); }
      if (url === '/__reporter.js') { res.setHeader('content-type', 'text/javascript'); return res.end(REPORTER); }
      const file = path.join(ROOT, url === '/' ? 'index.html' : decodeURIComponent(url));
      if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.statusCode = 404; return res.end(); }
      res.setHeader('content-type', TYPES[path.extname(file)] || 'application/octet-stream');
      if (url === '/') return res.end(fs.readFileSync(file, 'utf8').replace('</body>', '<script src="/__reporter.js"></script><script src="/__suite.js"></script></body>'));
      res.end(fs.readFileSync(file));
    });
    server.listen(0, '127.0.0.1', () => {
      const port = server.address().port;
      const args = ['--headless=new', '--disable-gpu', '--no-first-run', '--hide-scrollbars', `--user-data-dir=${profile}`,
        `--window-size=${frame ? 600 : width},900`, '--remote-debugging-port=0'];
      if (process.env.CI) args.push('--no-sandbox');
      args.push(`http://127.0.0.1:${port}/${frame ? '__frame' : hash}`);
      chrome = spawn(chromePath, args, { stdio: 'ignore' });
      chrome.on('error', e => finish('FAIL could not start Chrome: ' + e.message));
      timer = setTimeout(() => finish(`FAIL no result after ${TIMEOUT_MS / 1000} s`, true), TIMEOUT_MS);
    });
  });
}

async function main() {
  const args = process.argv.slice(2);
  if (args.includes('--list')) {
    for (const [name, s] of Object.entries(SUITES)) console.log(`${name.padEnd(22)} ${s.widths.join(', ')}`);
    return 0;
  }
  const widthArg = args.find(a => a.startsWith('--width='));
  const onlyWidth = widthArg ? parseInt(widthArg.split('=')[1], 10) : null;
  const names = args.filter(a => !a.startsWith('--'));
  const unknown = names.filter(n => !SUITES[n]);
  if (unknown.length) { console.error('Unknown suite: ' + unknown.join(', ') + '. See --list.'); return 2; }
  const missing = Object.keys(SUITES).filter(n => !fs.existsSync(path.join(SUITES_DIR, n + '.js')));
  if (missing.length) { console.error('Suite file missing: ' + missing.join(', ')); return 2; }
  const chromePath = findChrome();
  if (!chromePath) { console.error('Chrome not found. Install it or set CHROME_PATH.'); return 2; }

  let failures = 0, checks = 0, runs = 0;
  for (const name of names.length ? names : Object.keys(SUITES)) {
    for (const width of SUITES[name].widths) {
      if (onlyWidth && width !== onlyWidth) continue;
      let r = await runOnce(chromePath, name, width);
      if (r.timedOut) r = await runOnce(chromePath, name, width); // A slow start is retried once
      runs++;
      checks += r.pass + r.fail;
      const bad = r.fail > 0 || r.csp.length > 0 || r.pass === 0;
      if (bad) failures++;
      console.log(`${bad ? 'FAIL' : 'ok  '} ${name} @${width}: ${r.pass} pass, ${r.fail} fail` + (r.csp.length ? `, ${r.csp.length} CSP violations` : ''));
      r.lines.filter(l => l.startsWith('FAIL')).forEach(l => console.log('     ' + l));
      r.csp.forEach(l => console.log('     CSP ' + l));
    }
  }
  if (runs === 0) { console.error('Nothing to run: no suite supports that width.'); return 2; }
  console.log(failures ? `\n${failures} of ${runs} runs failed.` : `\nAll ${runs} runs passed (${checks} checks).`);
  return failures ? 1 : 0;
}

main().then(code => process.exit(code));
