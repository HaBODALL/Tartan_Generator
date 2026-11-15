// Redesign phase 3: the SRT bar under the pattern and the history strip.
window.alerts = [];
window.alert = m => window.alerts.push(m);
const results = [];
const check = (n, ok, d) => results.push((ok ? 'PASS ' : 'FAIL ') + n + (d !== undefined ? ' -> ' + d : ''));
window.addEventListener('error', e => results.push('FAIL pageError ' + e.message));
const $ = id => document.getElementById(id);
const fire = (el, type) => el.dispatchEvent(new Event(type, { bubbles: true }));
const key = (el, k) => el.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true }));
const sleep = ms => new Promise(r => setTimeout(r, ms));
const code = () => buildSRTCode(tartanStripes, $('check-sym').checked);
const type = (text) => { const f = $('import-text'); f.focus(); f.value = text; fire(f, 'input'); };

async function run() {
  const vw = document.documentElement.clientWidth;
  check('viewport ' + vw, true);
  const f = $('import-text');
  // Layout
  const bar = document.querySelector('.srt-bar').getBoundingClientRect(), cont = $('canvas-container').getBoundingClientRect(), strip = document.querySelector('.history-strip').getBoundingClientRect();
  check('bar under the pattern, strip under the bar', bar.top >= cont.bottom - 1 && strip.top >= bar.bottom - 1 && strip.bottom <= window.innerHeight + 1, JSON.stringify([cont.bottom, bar.top, bar.bottom, strip.top, strip.bottom]));
  check('pattern canvas on whole pixels', Number.isInteger(cont.height) && Number.isInteger(cont.top), cont.top + ' ' + cont.height);
  check('bar fits', bar.right <= vw && $('btn-copy-srt').getBoundingClientRect().right <= vw);
  check('panel has no SRT field any more', !$('sidebar').contains(f) && !$('srt-display'));

  // Shows the code
  check('shows the code of the pattern', f.value === code(), f.value + ' / ' + code());
  handleGenerateClick();
  check('follows a new pattern', f.value === code());
  if (vw > 600) check('size of a repeat', /^1 motif = \d+,\d cm · \d+ fils$/.test($('srt-bar-size').textContent), $('srt-bar-size').textContent);

  // Editing: nothing moves while typing, Entrée applies
  $('check-sym').checked = true;
  tartanStripes = [{ code: 'R', hex: '#C8002C', count: 48 }, { code: 'B', hex: '#1870A4', count: 8 }, { code: 'K', hex: '#101010', count: 12 }];
  userPalette = paletteFromStripes(tartanStripes); updateGeneratedListUI(); redrawTartan();
  const shadeR = SRT_PALETTE.find(c => c.code === 'R' && c.hex === '#C8002C');
  check('test shade exists', !!shadeR);
  const hist = historyStack.length;
  type('R/48 B8 K12 Y2 K/12');
  check('typing marks the field', f.classList.contains('edited'));
  check('typing does not change the pattern', code() === 'R/48 B8 K/12', code());
  updateGeneratedListUI();
  check('a redraw does not wipe what is being typed', f.value === 'R/48 B8 K12 Y2 K/12');
  key(f, 'Enter');
  check('Entrée applies', code() === 'R/48 B8 K12 Y2 K/12' && !f.classList.contains('edited'), code());
  check('one history step', historyStack.length === hist + 1, historyStack.length - hist);
  check('kept shades', tartanStripes[0].hex === '#C8002C' && tartanStripes[1].hex === '#1870A4' && tartanStripes[2].hex === '#101010', tartanStripes.map(s => s.hex).join());

  // Échap puts the code back
  type('G4 W4');
  key(f, 'Escape');
  check('Échap puts the code back', f.value === code() && !f.classList.contains('edited'));

  // Leaving the field applies a valid code, once
  const h2 = historyStack.length;
  type('R/48 K/12');
  fire(f, 'change'); f.blur();
  check('leaving applies a valid code', code() === 'R/48 K/12' && historyStack.length === h2 + 1, code());
  $('btn-import-srt').click();
  check('✓ after leaving does not add a step', historyStack.length === h2 + 1);

  // Leaving with something wrong: no message, the field says it
  type('hello');
  fire(f, 'change');
  check('wrong code on leaving: marked, no alert, pattern kept', f.getAttribute('aria-invalid') === 'true' && alerts.length === 0 && code() === 'R/48 K/12');
  type('R/48 K/12 Y4');
  check('typing again clears the mark', !f.hasAttribute('aria-invalid'));
  $('btn-import-srt').click();
  check('✓ applies', code() === 'R/48 K12 Y/4', code());
  type('zz');
  $('btn-import-srt').click();
  check('✓ on a wrong code warns as before', alerts.length === 1);
  alerts.length = 0;
  type('');
  fire(f, 'change');
  check('emptied field gets the code back', f.value === code());

  // Examples still get their own shades; the menu goes to the bar
  $('btn-menu-import').click(); $('menu-new-srt').click();
  check('Nouveau > code SRT selects the code', document.activeElement === f && f.selectionStart === 0 && f.selectionEnd === f.value.length);
  loadExample('R/72 B8 K12 Y2 K12 W2 K12 G24 R8 K2 R/4');
  check('example applied, bar follows', f.value === 'R/72 B8 K12 Y2 K12 W2 K12 G24 R8 K2 R/4' && $('srt-examples').selectedIndex === 1, f.value);

  // Copy
  let copied = null;
  navigator.clipboard.writeText = t => { copied = t; return Promise.resolve(); };
  type('K4 W4');
  $('btn-copy-srt').click(); await sleep(20);
  check('copy gives the code of the pattern, not the draft', copied === code(), copied);
  check('copy shows a toast', $('copy-toast').classList.contains('show'));
  key(f, 'Escape');

  // History strip
  const thumbs = () => [...document.querySelectorAll('#history-list .history-thumb')];
  check('history in the strip', document.querySelector('.history-strip').contains($('history-list')) && thumbs().length === Math.min(historyStack.length, 10), thumbs().length);
  const tb = thumbs()[0].getBoundingClientRect();
  check('thumbnails are small squares', Math.abs(tb.width - tb.height) < 1 && tb.width <= 44, tb.width + 'x' + tb.height);
  for (let i = 0; i < 10; i++) handleGenerateClick();
  const list = $('history-list');
  check('more than ten thumbnails in one row, nothing overflows the page', thumbs().length > 10 && new Set(thumbs().map(t => Math.round(t.getBoundingClientRect().top))).size === 1 && document.documentElement.scrollWidth <= vw, thumbs().length);
  check('the strip scrolls when it is too narrow', list.scrollWidth <= list.clientWidth || getComputedStyle(list).overflowX === 'auto');
  const target = historyStack[historyStack.length - 1];
  thumbs()[0].click();
  check('a thumbnail restores its pattern', buildSRTCode(tartanStripes, $('check-sym').checked) === buildSRTCode(target.stripes, target.settings?.symmetric || false) && f.value === code());

  // English
  setLanguage('en');
  check('English', $('btn-import-srt').textContent === '✓ Apply' && document.querySelector('.history-strip-label').textContent === 'History' && $('history-list').getAttribute('aria-label').startsWith('History') && $('btn-copy-srt').getAttribute('aria-label') === 'Copy the SRT code');
  if (vw > 600) check('English size', /^1 repeat = \d+\.\d cm · \d+ threads$/.test($('srt-bar-size').textContent), $('srt-bar-size').textContent);
  setLanguage('fr');
  check('no alert', alerts.length === 0);
  const p = document.createElement('pre'); p.id = 'bench-out'; p.style.display = 'none'; p.textContent = results.join('\n'); document.body.appendChild(p);
}
(function wait(n) {
  if (window.drawingContext && tartanStripes.length) run().catch(e => { const p = document.createElement('pre'); p.id = 'bench-out'; p.textContent = results.join('\n') + '\nFAIL crash ' + e.stack; document.body.appendChild(p); });
  else if (n > 0) setTimeout(() => wait(n - 1), 50);
})(200);
