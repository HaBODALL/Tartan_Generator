// Zoom on the pointer and moving the pattern, through the real page.
window.alerts = [];
window.alert = m => window.alerts.push(m);
const results = [];
const check = (n, ok, d) => results.push((ok ? 'PASS ' : 'FAIL ') + n + (d !== undefined ? ' -> ' + d : ''));
window.addEventListener('error', e => results.push('FAIL pageError ' + e.message));
const $ = id => document.getElementById(id);
const fire = (el, type) => el.dispatchEvent(new Event(type, { bubbles: true }));
const main = () => document.querySelector('#canvas-container > canvas');
const snap = () => { const c = main(); return { w: c.width, h: c.height, d: c.getContext('2d').getImageData(0, 0, c.width, c.height).data }; };
// Compares the image moved by (sx, sy) device pixels with the reference
function shifted(a, b, sx, sy) {
  let bad = 0, n = 0;
  for (let y = 0; y < a.h - sy; y += 3) for (let x = 0; x < a.w - sx; x += 3) {
    const i = (y + sy) * a.w * 4 + (x + sx) * 4, j = y * a.w * 4 + x * 4;
    n++;
    if (a.d[i] !== b.d[j] || a.d[i + 1] !== b.d[j + 1] || a.d[i + 2] !== b.d[j + 2]) bad++;
  }
  return bad / n;
}
const key = k => document.body.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true }));

async function run() {
  tartanStripes = [['R', '#C80000', 72], ['B', '#000064', 8], ['K', '#101010', 12], ['Y', '#FFE600', 2], ['K', '#101010', 12], ['W', '#FFFFFF', 2], ['G', '#006400', 24]].map(([code, hex, count]) => ({ code, hex, count }));
  userPalette = paletteFromStripes(tartanStripes);
  $('check-sym').checked = true;
  const density = pixelDensity();
  const setZ = z => { $('in-zoom').value = z; syncZoomSlider(); };

  for (const [label, relief, yarn, z] of [['flat', false, false, 3], ['relief', true, false, 6], ['yarn', false, true, 3], ['relief high zoom', true, true, 12]]) {
    $('effect-relief').checked = relief; $('yarn-irregular').checked = yarn; updateReliefStrengthUI();
    setZ(z); viewX = 0; viewY = 0; redrawTartan();
    const a = snap();
    viewX = 13; viewY = 7; redrawTartan();
    const b = snap();
    const r = shifted(a, b, 13 * z * density, 7 * z * density);
    check(`${label}: moved view is the same cloth`, r === 0, r);
  }

  // Wrapping past a full repeat (large period at a high zoom, and negative positions)
  $('effect-relief').checked = false; $('yarn-irregular').checked = false; updateReliefStrengthUI();
  setZ(3); viewX = 0; viewY = 0; redrawTartan();
  const base = snap();
  const period = getWeavePeriod(countSettThreads(tartanStripes, true));
  viewX = period; viewY = -period; redrawTartan();
  check('a whole repeat away looks the same', shifted(base, snap(), 0, 0) === 0);
  viewX = -5; viewY = 0; redrawTartan();
  check('negative positions work', shifted(snap(), base, 5 * 3 * density, 0) === 0);

  // Long sett, zoomed in: the tile is a window of the cloth
  const long = tartanStripes;
  tartanStripes = long.map(s => ({ ...s, count: s.count * 10 }));
  setZ(12); viewX = 0; viewY = 0; redrawTartan();
  const wa = snap();
  viewX = 700; viewY = 300; redrawTartan();
  const wb = snap();
  viewX = 703; viewY = 301; redrawTartan();
  check('moving a window', shifted(wb, snap(), 3 * 12 * density, 12 * density) === 0);
  check('a far window differs', shifted(wa, wb, 0, 0) > 0.05);
  tartanStripes = long;

  // Wheel keeps the point under the pointer
  setZ(4); viewX = 20; viewY = 10; redrawTartan();
  const box = main().getBoundingClientRect();
  const ax = 200, ay = 120;
  const threadX = viewX + ax / 4, threadY = viewY + ay / 4;
  const ev = new WheelEvent('wheel', { deltaY: -100, clientX: box.left + ax, clientY: box.top + ay, bubbles: true, cancelable: true });
  main().dispatchEvent(ev);
  const z2 = readZoom();
  check('wheel zooms', z2 === 5 && ev.defaultPrevented, z2);
  check('wheel keeps the thread under the pointer', Math.abs(viewX + ax / z2 - threadX) < 1e-9 && Math.abs(viewY + ay / z2 - threadY) < 1e-9, [viewX, viewY, threadY, z2, box.top, main().getBoundingClientRect().top, $('canvas-container').getBoundingClientRect().top].join());

  // Buttons zoom around the middle
  viewX = 0; viewY = 0; setZ(4); redrawTartan();
  const mid = width / 2 / 4;
  $('btn-zoom-in').click();
  check('buttons keep the middle', Math.abs(viewX + width / 2 / readZoom() - mid) < 1e-9, viewX);

  // Dragging
  setZ(2); viewX = 0; viewY = 0; redrawTartan();
  const c = main();
  c.setPointerCapture = () => {};
  const ptr = (t, x, y, extra = {}) => c.dispatchEvent(new PointerEvent(t, { pointerId: 5, clientX: x, clientY: y, button: 0, bubbles: true, ...extra }));
  ptr('pointerdown', 100, 100);
  check('cursor changes while dragging', c.classList.contains('panning'));
  ptr('pointermove', 80, 90);
  check('drag moves the view', viewX === 10 && viewY === 5, viewX + ' ' + viewY);
  ptr('pointermove', 60, 90);
  check('drag continues', viewX === 20 && viewY === 5, viewX);
  ptr('pointerup', 60, 90);
  check('drag ends', !c.classList.contains('panning'));
  ptr('pointermove', 0, 0);
  check('no move after the end', viewX === 20);
  check('canvas does not scroll on touch', getComputedStyle(c).touchAction === 'none');

  c.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
  check('double click goes back', viewX === 0 && viewY === 0);

  // Arrows
  document.activeElement?.blur();
  key('ArrowLeft');
  check('arrow moves', viewX === -20, viewX);
  key('ArrowDown');
  check('arrow moves down', viewY === 20, viewY);
  resetView();
  $('in-zoom').focus();
  $('in-zoom').dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true, cancelable: true }));
  check('arrows stay in the fields', viewX === 0);
  $('in-zoom').blur();

  // Mood board tiles keep their clicks
  $('patchwork-qty').value = 10; generatePatchwork();
  const tile = document.querySelector('.patchwork-tile canvas');
  tile.dispatchEvent(new PointerEvent('pointerdown', { pointerId: 6, clientX: 10, clientY: 10, button: 0, bubbles: true }));
  tile.dispatchEvent(new PointerEvent('pointermove', { pointerId: 6, clientX: 50, clientY: 50, bubbles: true }));
  check('drag does not start on the mood board', viewX === 0 && panPointer === null);
  closePatchworkBoard();

  // Fractional view stays crisp: every pixel is an existing color
  setZ(3); viewX = 2.5; viewY = 1.5; redrawTartan();
  const fr = snap();
  check('fractional view has no blurred colors', (() => { const s = new Set(); for (let i = 0; i < fr.d.length; i += 4) s.add(fr.d[i] << 16 | fr.d[i + 1] << 8 | fr.d[i + 2]); return s.size <= 6; })());
  resetView();

  check('no alert', alerts.length === 0);
  const p = document.createElement('pre'); p.id = 'bench-out'; p.style.display = 'none'; p.textContent = results.join('\n'); document.body.appendChild(p);
}
(function wait(n) {
  if (window.drawingContext && tartanStripes.length) run().catch(e => { const p = document.createElement('pre'); p.id = 'bench-out'; p.textContent = results.join('\n') + '\nFAIL crash ' + e.stack; document.body.appendChild(p); });
  else if (n > 0) setTimeout(() => wait(n - 1), 50);
})(200);
