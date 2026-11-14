// Estimate from a photo, through the real page.
window.alerts = [];
window.alert = m => window.alerts.push(m);
const results = [];
const check = (n, ok, d) => results.push((ok ? 'PASS ' : 'FAIL ') + n + (d !== undefined ? ' -> ' + d : ''));
window.addEventListener('error', e => results.push('FAIL pageError ' + e.message));
const $ = id => document.getElementById(id);
const fire = (el, type) => el.dispatchEvent(new Event(type, { bubbles: true }));
const sleep = ms => new Promise(r => setTimeout(r, ms));
const key = k => document.body.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true }));

const named = l => l.map(([code, count]) => ({ code, hex: SRT_PALETTE.find(c => c.code === code).hex, count }));
const SETT = named([['R', 72], ['B', 8], ['K', 12], ['Y', 2], ['K', 12], ['W', 2], ['G', 24], ['K', 4]]);

// A simulated photo: cloth on a plain table, or the cloth alone
function makePhoto(w, h, margin) {
  const threads = countSettThreads(SETT, true), colors = buildThreadColors(SETT, true, threads);
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const ctx = c.getContext('2d'), img = ctx.createImageData(w, h), px = new Uint32Array(img.data.buffer);
  const table = 0xFF60A0C0;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    if (x < margin || y < margin || x >= w - margin || y >= h - margin) { px[y * w + x] = table - ((x * 7 + y * 13) % 19) * 0x010101; continue; }
    const tx = Math.floor(x / 2), ty = Math.floor(y / 2);
    px[y * w + x] = ((tx - [2, 1, 0, 3][ty & 3]) & 3) < 2 ? colors[ty % threads] : colors[tx % threads];
  }
  ctx.putImageData(img, 0, 0);
  return new Promise(res => c.toBlob(b => res(new File([b], 'photo.png', { type: 'image/png' })), 'image/png'));
}
const form = l => l.map(s => s.code).join(' ');
const sameColors = (a, b) => a.length === b.length && a.every((s, i) => colorDifference(s.hex, b[i].hex) < 25);
const reads = l => !!l && (sameColors(l, SETT) || sameColors(l, [...SETT].reverse()));

async function run() {
  check('closed at load', getComputedStyle($('estimate-modal')).display === 'none');
  $('in-sett').value = 300;

  // Through the file input
  const dt = new DataTransfer();
  dt.items.add(await makePhoto(1000, 700, 0));
  const input = $('import-photo');
  input.files = dt.files;
  const realOpen = window.openEstimateFromFile; let opening = null;
  window.openEstimateFromFile = f => (opening = realOpen(f));
  input.dispatchEvent(new Event('change'));
  await opening;
  window.openEstimateFromFile = realOpen;
  check('opens on a photo', isEstimateOpen(), $('app-message').textContent);
  check('input cleared', input.value === '');
  check('focus in the window', document.activeElement === $('btn-estimate-cancel'));
  check('thread total follows the settings', $('estimate-threads').value === '300', $('estimate-threads').value);
  const r = estimateState.result;
  check('sett found', r && r.symmetric && r.confidence === 'good', r && JSON.stringify([r.symmetric, r.confidence]));
  check('sequence right', r && reads(r.stripes), r && form(r.stripes));
  check('total close to the target', r && Math.abs(countSettThreads(r.stripes, true) - 300) <= 12, r && countSettThreads(r.stripes, true));
  check('SRT shown', $('estimate-code').value === buildSRTCode(r.stripes, true), $('estimate-code').value);
  check('status good', $('estimate-status').textContent.includes('symétrie'));
  const data = $('estimate-result').getContext('2d').getImageData(0, 0, 280, 280).data;
  let painted = 0; for (let i = 3; i < data.length; i += 4) if (data[i]) painted++;
  check('result drawn', painted === 280 * 280, painted);
  check('apply enabled', !$('btn-estimate-apply').disabled);
  const zoom = $('in-zoom').value, id = generationID;
  key('g');
  check('shortcuts do nothing behind', generationID === id);

  // Controls
  $('estimate-threads').value = 200; fire($('estimate-threads'), 'change');
  check('thread total changes the counts', Math.abs(countSettThreads(estimateState.result.stripes, true) - 200) <= 12);

  // Applying
  const before = historyStack.length;
  $('btn-estimate-apply').click();
  check('window closes', !isEstimateOpen());
  check('pattern applied', form(tartanStripes) === form(r.stripes) && $('check-sym').checked);
  check('previous in the history', historyStack.length === before + 1);
  check('message', $('app-message').textContent.includes('image'), $('app-message').textContent);

  // Cloth on a table: selecting the cloth is what makes it work
  await openEstimateFromFile(await makePhoto(1200, 800, 100));
  const whole = estimateState.result;
  const c = $('estimate-source'); c.setPointerCapture = () => {};
  const box = c.getBoundingClientRect();
  const sx = box.width / 1200, sy = box.height / 800;
  const ptr = (t, x, y) => c.dispatchEvent(new PointerEvent(t, { pointerId: 3, clientX: box.left + x * sx, clientY: box.top + y * sy, button: 0, bubbles: true }));
  ptr('pointerdown', 110, 110); ptr('pointermove', 600, 500); ptr('pointermove', 1090, 690); ptr('pointerup', 1090, 690);
  const reg = estimateState.region;
  check('selection stored', reg && Math.abs(reg.x - 110) <= 2 && Math.abs(reg.w - 980) <= 3, JSON.stringify(reg));
  const sel = estimateState.result;
  check('selection reads the cloth', sel && sel.symmetric && reads(sel.stripes), sel && form(sel.stripes));
  check('whole photo is not as good', !whole || !reads(whole.stripes), whole && form(whole.stripes));
  ptr('pointerdown', 50, 50); ptr('pointerup', 50, 50);
  check('a click goes back to the whole photo', estimateState.region === null);
  key('Escape');
  check('Escape closes', !isEstimateOpen());
  check('pattern unchanged by closing', form(tartanStripes) === form(r.stripes));

  // Plain image
  const plain = document.createElement('canvas'); plain.width = 300; plain.height = 300;
  const g = plain.getContext('2d'); g.fillStyle = '#808080'; g.fillRect(0, 0, 300, 300);
  await openEstimateFromFile(await new Promise(res => plain.toBlob(b => res(new File([b], 'p.png')))));
  check('plain image: nothing to use', $('btn-estimate-apply').disabled && $('estimate-status').textContent.includes('Aucune'), $('estimate-status').textContent);
  $('btn-estimate-cancel').click();

  // Bad file
  await openEstimateFromFile(new File(['not an image'], 'x.png', { type: 'image/png' }));
  check('bad file refused', !isEstimateOpen() && $('app-message').textContent.includes('image'), $('app-message').textContent);

  setLanguage('en');
  check('English', $('estimate-title').textContent === 'A tartan from an image' && $('btn-import-photo').textContent === 'A photo of a tartan');
  setLanguage('fr');
  check('no alert', alerts.length === 0);
  const p = document.createElement('pre'); p.id = 'bench-out'; p.style.display = 'none'; p.textContent = results.join('\n'); document.body.appendChild(p);
}
(function wait(n) {
  if (window.drawingContext && tartanStripes.length) run().catch(e => { const p = document.createElement('pre'); p.id = 'bench-out'; p.textContent = results.join('\n') + '\nFAIL crash ' + e.stack; document.body.appendChild(p); });
  else if (n > 0) setTimeout(() => wait(n - 1), 50);
})(200);
