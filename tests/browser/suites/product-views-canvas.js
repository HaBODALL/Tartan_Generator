// Product views drawn on the canvas (Tissu, Écharpe, Métrage, Échantillon), through the real page.
window.alerts = [];
window.alert = m => window.alerts.push(m);
const results = [];
const check = (n, ok, d) => results.push((ok ? 'PASS ' : 'FAIL ') + n + (d !== undefined ? ' -> ' + d : ''));
window.addEventListener('error', e => results.push('FAIL pageError ' + e.message));
const $ = id => document.getElementById(id);
const fire = (el, type) => el.dispatchEvent(new Event(type, { bubbles: true }));
const sleep = ms => new Promise(r => setTimeout(r, ms));
const key = k => document.body.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true }));
const snap = () => { const c = $('preview-canvas'); return c.getContext('2d').getImageData(0, 0, c.width, c.height).data; };
const differs = (a, b) => { let n = 0; if (a.length !== b.length) return -1; for (let i = 0; i < a.length; i += 4) if (a[i] !== b[i] || a[i + 1] !== b[i + 1] || a[i + 2] !== b[i + 2]) n++; return n; };
const viewBtn = v => document.querySelector(`.view-btn[data-view="${v}"]`);
const pressed = () => [...document.querySelectorAll('.view-btn')].filter(b => b.getAttribute('aria-pressed') === 'true').map(b => b.dataset.view).join();
const painted = a => { let n = 0; for (let i = 3; i < a.length; i += 4) if (a[i]) n++; return n / (a.length / 4); };

async function run() {
  tartanStripes = [{ code: 'R', hex: '#C80000', count: 48 }, { code: 'B', hex: '#000064', count: 48 }];
  userPalette = paletteFromStripes(tartanStripes);
  $('check-sym').checked = false;
  $('in-threadmm').value = '0.3';
  updateGeneratedListUI();
  check('cloth view at load', pressed() === 'cloth' && !isPreviewOpen(), pressed());
  check('four views', ['cloth', 'scarf', 'yardage', 'sample'].every(v => viewBtn(v)));
  const sw = document.querySelector('.view-switch').getBoundingClientRect(), cont = $('canvas-container').getBoundingClientRect();
  check('switch on the canvas', sw.left >= cont.left && sw.top >= cont.top && sw.right <= cont.right, JSON.stringify(sw));

  viewBtn('scarf').focus(); viewBtn('scarf').click();
  await sleep(100);
  check('scarf view', isPreviewOpen() && pressed() === 'scarf', pressed());
  check('focus stays on the switch', document.activeElement === viewBtn('scarf'));
  const c = $('preview-canvas'), stage = c.parentElement;
  check('canvas fills the stage', c.clientWidth === stage.clientWidth && c.clientHeight === stage.clientHeight, c.clientWidth + ' ' + stage.clientWidth);
  const scarf = snap();
  check('scarf drawn', painted(scarf) > 0.015, painted(scarf));
  check('switch stays visible over the view', getComputedStyle(document.querySelector('.view-switch')).display !== 'none' && document.elementFromPoint(sw.left + sw.width / 2, sw.top + sw.height / 2)?.closest('.view-switch') !== null);
  check('zoom tools hidden in an object view', getComputedStyle($('canvas-tools')).display === 'none');
  check('canvas named after the object', c.getAttribute('aria-label').startsWith('Écharpe'), c.getAttribute('aria-label'));

  // The middle of the scarf is colored
  const mid = c.getContext('2d').getImageData(Math.round(c.width / 2), Math.round(c.height * 0.45), 1, 1).data;
  check('scarf pixels are colored', mid[3] === 255 && mid[0] + mid[2] > 60, [...mid].join());

  viewBtn('yardage').click();
  const yardage = snap();
  check('yardage view', pressed() === 'yardage' && differs(scarf, yardage) > 1000 && painted(yardage) > 0.05, painted(yardage));
  viewBtn('sample').click();
  const sample = snap();
  check('sample view', pressed() === 'sample' && differs(yardage, sample) > 1000 && painted(sample) > 0.05, painted(sample));

  // Follows the thread size and the pattern, settings stay usable beside it
  $('in-threadmm').value = '3'; fire($('in-threadmm'), 'input');
  check('follows the thread size', differs(sample, snap()) > 1000);
  const b = snap();
  $('check-sym').checked = true; fire($('check-sym'), 'change');
  tartanStripes = [{ code: 'K', hex: '#101010', count: 96 }, { code: 'W', hex: '#FFFFFF', count: 96 }];
  redrawTartan();
  check('follows the pattern', differs(b, snap()) > 1000);

  // Keys: zoom and moves do nothing, generating works, Échap goes back to the cloth
  const zoom = $('in-zoom').value, vx = viewX;
  $('canvas-container').dispatchEvent(new WheelEvent('wheel', { deltaY: -100, bubbles: true, cancelable: true }));
  key('+'); key('ArrowLeft');
  check('wheel, + and arrows do nothing behind', $('in-zoom').value === zoom && viewX === vx);
  const id = generationID, before = snap();
  key('g');
  check('G generates and the sample follows', generationID !== id && isPreviewOpen() && differs(before, snap()) > 1000);
  viewBtn('sample').focus();
  key('Escape');
  check('Escape goes back to the cloth', !isPreviewOpen() && pressed() === 'cloth');
  check('focus on Tissu', document.activeElement === viewBtn('cloth'));
  check('zoom tools back', getComputedStyle($('canvas-tools')).display !== 'none');

  // One board at a time
  viewBtn('scarf').click();
  $('patchwork-qty').value = 10; generatePatchwork();
  check('mood board replaces the view', isPatchworkOpen() && !isPreviewOpen() && pressed() === 'cloth');
  check('switch hidden over the mood board', getComputedStyle(document.querySelector('.view-switch')).display === 'none');
  viewBtn('scarf').click();
  check('a view replaces the mood board', !isPatchworkOpen() && isPreviewOpen());
  viewBtn('cloth').click();
  check('Tissu closes the view', !isPreviewOpen() && pressed() === 'cloth');

  // Resize
  viewBtn('yardage').click();
  const w = c.width;
  stage.style.width = '500px'; stage.style.flex = 'none';
  await sleep(200);
  check('follows its stage', c.width !== w && c.clientWidth === 500, c.clientWidth);
  stage.style.width = ''; stage.style.flex = '';
  await sleep(200);

  // Huge imported counts stay fast
  tartanStripes = [{ code: 'K', hex: '#101010', count: 999999 }, { code: 'W', hex: '#FFFFFF', count: 999999 }];
  for (const v of ['scarf', 'yardage', 'sample']) {
    viewBtn(v).click();
    const t0 = performance.now(); renderObjectPreview();
    check('huge counts stay fast: ' + v, performance.now() - t0 < 2000, Math.round(performance.now() - t0) + ' ms');
  }
  tartanStripes = [{ code: 'K', hex: '#101010', count: 96 }, { code: 'W', hex: '#FFFFFF', count: 96 }];

  setLanguage('en');
  check('English', viewBtn('cloth').textContent === 'Cloth' && viewBtn('scarf').textContent === 'Scarf' && c.getAttribute('aria-label').startsWith('Sample'), viewBtn('cloth').textContent + ' ' + c.getAttribute('aria-label'));
  setLanguage('fr');
  viewBtn('cloth').click();
  check('no alert', alerts.length === 0);
  const p = document.createElement('pre'); p.id = 'bench-out'; p.style.display = 'none'; p.textContent = results.join('\n'); document.body.appendChild(p);
}
(function wait(n) {
  if (window.drawingContext && tartanStripes.length) run().catch(e => { const p = document.createElement('pre'); p.id = 'bench-out'; p.textContent = results.join('\n') + '\nFAIL crash ' + e.stack; document.body.appendChild(p); });
  else if (n > 0) setTimeout(() => wait(n - 1), 50);
})(200);
