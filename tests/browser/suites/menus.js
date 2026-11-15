// Redesign phase 1: top bar menus, zoom on the canvas, Générer first.
window.alerts = [];
window.alert = m => window.alerts.push(m);
const results = [];
const check = (n, ok, d) => results.push((ok ? 'PASS ' : 'FAIL ') + n + (d !== undefined ? ' -> ' + d : ''));
window.addEventListener('error', e => results.push('FAIL pageError ' + e.message));
const $ = id => document.getElementById(id);
const key = (el, k) => el.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true }));
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function run() {
  const vw = document.documentElement.clientWidth;
  check('viewport ' + vw, true);
  // Layout
  check('no horizontal overflow', document.documentElement.scrollWidth <= vw, document.documentElement.scrollWidth + ' > ' + vw);
  const narrow = vw <= 600;
  for (const id of narrow ? ['btn-menu-new', 'btn-menu-import', 'btn-menu-export', 'btn-menu-more', 'btn-generate-patchwork'] : ['btn-menu-new', 'btn-menu-import', 'btn-menu-export', 'btn-about', 'lang-btn-en', 'btn-generate-patchwork']) {
    const r = $(id).getBoundingClientRect();
    check(id + ' visible in the bar', r.width > 0 && r.left >= 0 && r.right <= vw && r.bottom <= 50, JSON.stringify([r.left, r.right, r.bottom]));
  }
  const tools = $('canvas-tools').getBoundingClientRect(), canvasBox = $('canvas-container').getBoundingClientRect();
  check('zoom tools on the canvas', tools.width > 0 && tools.left >= canvasBox.left && tools.right <= canvasBox.right && tools.bottom <= canvasBox.bottom, JSON.stringify(tools));
  const toggle = $('btn-toggle-ui').getBoundingClientRect();
  check('zoom tools clear of the panel button', tools.right <= toggle.left || tools.bottom <= toggle.top || tools.top >= toggle.bottom);
  const first = $('sidebar').querySelector('button, input, select, summary');
  if (narrow) check('about and language move to ⋯ on phones', ['btn-about', 'lang-btn-en'].every(id => $(id).getClientRects().length === 0));
  else check('no ⋯ menu on wide screens', $('btn-menu-more').getClientRects().length === 0);
  check('Générer first in the panel', first === $('btn-generate'), first && first.id);
  check('Export section gone from the panel', ![...document.querySelectorAll('#sidebar summary')].some(s => s.textContent.trim() === 'Export'));
  check('section renamed', [...document.querySelectorAll('#sidebar summary')].some(s => s.textContent.trim() === 'Fil et rendu'));
  check('menus closed at load', $('menu-new').hidden && $('menu-export').hidden);

  // Mouse
  const nw = $('btn-menu-new');
  nw.click();
  check('Nouveau opens', !$('menu-new').hidden && nw.getAttribute('aria-expanded') === 'true');
  const list = $('menu-new').getBoundingClientRect();
  check('menu inside the screen', list.left >= 0 && list.right <= vw, JSON.stringify([list.left, list.right]));
  $('btn-menu-export').click();
  check('one menu at a time', $('menu-new').hidden && !$('menu-export').hidden && nw.getAttribute('aria-expanded') === 'false');
  document.body.click();
  check('click elsewhere closes', $('menu-export').hidden);
  nw.click(); nw.click();
  check('second click closes', $('menu-new').hidden);

  // Keyboard
  nw.focus(); key(nw, 'ArrowDown');
  check('ArrowDown opens on the first choice', !$('menu-new').hidden && document.activeElement === $('menu-new-random'));
  key(document.activeElement, 'ArrowUp');
  check('ArrowUp wraps to the last', document.activeElement === $('menu-new-image'), document.activeElement.id);
  key(document.activeElement, 'Home');
  check('Home', document.activeElement === $('menu-new-random'));
  key(document.activeElement, 'Escape');
  check('Escape closes and gives the focus back', $('menu-new').hidden && document.activeElement === nw);

  // Nouveau choices
  const id = generationID;
  nw.click(); $('menu-new-random').click();
  check('random pattern', generationID !== id && $('menu-new').hidden);
  toggleSidebar(); await sleep(400);
  check('panel collapsed', $('sidebar').classList.contains('collapsed'));
  $('btn-menu-import').click(); $('menu-new-srt').click();
  check('SRT code: the bar field has the focus, its code selected', document.activeElement === $('import-text') && $('import-text').selectionEnd - $('import-text').selectionStart === $('import-text').value.length);
  toggleSidebar(); await sleep(400);
  await sleep(400);
  $('btn-menu-import').click(); $('menu-new-example').click();
  check('example list has the focus', document.activeElement === $('srt-examples'));
  let picked = 0; const realFile = $('import-file').click, realImage = $('import-photo').click;
  $('import-file').click = () => picked++; $('import-photo').click = () => picked += 10;
  $('btn-menu-import').click(); $('btn-import-file').click(); $('btn-menu-import').click(); $('btn-import-photo').click();
  check('file and image choosers', picked === 11, picked);
  $('import-file').click = realFile; $('import-photo').click = realImage;

  // Zoom on the canvas
  const z = readZoom();
  $('btn-zoom-in').click();
  check('+ zooms', readZoom() > z, readZoom());
  $('btn-zoom-out').click();
  check('− zooms back', Math.abs(readZoom() - z) < 0.05, readZoom());
  panView(-120, -80);
  check('view moved', viewX !== 0 || viewY !== 0);
  $('btn-reset-view').click();
  check('⌖ back to the start', viewX === 0 && viewY === 0);
  generatePatchwork();
  check('zoom tools hidden over the mood board', getComputedStyle($('canvas-tools')).display === 'none');
  closePatchworkBoard();
  check('zoom tools back', getComputedStyle($('canvas-tools')).display !== 'none');

  // English
  setLanguage('en');
  check('English menus', nw.textContent.includes('New') && $('btn-menu-import').textContent.includes('Import') && $('btn-menu-export').textContent.includes('Save') && $('menu-new-image').textContent === 'From an image (drawing, photo or other)' && $('btn-import-photo').textContent === 'A photo of a tartan');
  check('English about', $('btn-about').getAttribute('aria-label') === 'About' && $('btn-about').textContent.includes('About'));
  check('English reset', $('btn-reset-view').getAttribute('aria-label') === 'Back to the start of the pattern');
  check('English section', [...document.querySelectorAll('#sidebar summary')].some(s => s.textContent.trim() === 'Yarn & rendering'));
  check('still fits in English', document.documentElement.scrollWidth <= vw && $('lang-btn-en').getBoundingClientRect().right <= vw);
  setLanguage('fr');
  check('no alert', alerts.length === 0);
  const p = document.createElement('pre'); p.id = 'bench-out'; p.style.display = 'none'; p.textContent = results.join('\n'); document.body.appendChild(p);
}
(function wait(n) {
  if (window.drawingContext && tartanStripes.length) run().catch(e => { const p = document.createElement('pre'); p.id = 'bench-out'; p.textContent = results.join('\n') + '\nFAIL crash ' + e.stack; document.body.appendChild(p); });
  else if (n > 0) setTimeout(() => wait(n - 1), 50);
})(200);
