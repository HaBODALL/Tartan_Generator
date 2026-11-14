// Relief strength slider and yarn irregularity, through the real page.
window.alerts = [];
window.alert = m => window.alerts.push(m);
const results = [];
const check = (n, ok, d) => results.push((ok ? 'PASS ' : 'FAIL ') + n + (d !== undefined ? ' -> ' + d : ''));
window.addEventListener('error', e => results.push('FAIL pageError ' + e.message));
const $ = id => document.getElementById(id);
const fire = (el, type) => el.dispatchEvent(new Event(type, { bubbles: true }));
const canvasPixels = () => { const c = document.querySelector('#canvas-container > canvas'); return c.getContext('2d').getImageData(0, 0, Math.min(400, c.width), Math.min(300, c.height)).data; };
const differs = (a, b) => { let n = 0; for (let i = 0; i < a.length; i += 4) if (a[i] !== b[i] || a[i + 1] !== b[i + 1] || a[i + 2] !== b[i + 2]) n++; return n; };

async function run() {
  const slider = $('relief-strength'), yarn = $('yarn-irregular'), effect = $('effect-relief');
  $('in-zoom').value = 6; fire($('in-zoom'), 'input');

  effect.checked = false; fire(effect, 'change');
  check('slider is off without the relief', slider.disabled);
  effect.checked = true; fire(effect, 'change');
  check('slider is on with the relief', !slider.disabled);

  const at100 = canvasPixels();
  slider.value = 200; fire(slider, 'input');
  check('slider shows its value', $('relief-strength-value').textContent === '200 %', $('relief-strength-value').textContent);
  const at200 = canvasPixels();
  check('200 % changes the drawing', differs(at100, at200) > 1000, differs(at100, at200));
  slider.value = 0; fire(slider, 'input'); fire(slider, 'change');
  const at0 = canvasPixels();
  effect.checked = false; fire(effect, 'change');
  const flat = canvasPixels();
  check('0 % looks like no relief', differs(at0, flat) < at0.length / 4 * 0.02, differs(at0, flat));
  check('strength is saved', JSON.parse(localStorage.getItem('tartanGeneratorState')).reliefStrength === 0);

  // Yarn irregularity
  const off = canvasPixels();
  yarn.checked = true; fire(yarn, 'change');
  const on = canvasPixels();
  check('yarn irregularity changes the threads', differs(off, on) > 1000, differs(off, on));
  fire(yarn, 'change');
  check('yarn irregularity is stable across redraws', differs(on, canvasPixels()) === 0);
  check('yarn irregularity is saved', JSON.parse(localStorage.getItem('tartanGeneratorState')).yarnIrregular === true);

  // Reload the state
  slider.value = 150; yarn.checked = false; effect.checked = true; fire(effect, 'change'); fire(slider, 'change');
  saveState();
  slider.value = 100; yarn.checked = true; effect.checked = false;
  loadState();
  check('settings come back after a reload', slider.value === '150' && !yarn.checked && effect.checked && !slider.disabled, `${slider.value} ${yarn.checked} ${effect.checked}`);
  const old = JSON.parse(localStorage.getItem('tartanGeneratorState')); delete old.reliefStrength; delete old.yarnIrregular;
  localStorage.setItem('tartanGeneratorState', JSON.stringify(old));
  check('a state from before still loads', loadState() === true);

  // Mood board follows the yarn setting
  yarn.checked = true; fire(yarn, 'change');
  $('patchwork-qty').value = 10; $('patchwork-scale').value = 'zoom';
  generatePatchwork();
  const tile = document.querySelector('.patchwork-tile canvas');
  const before = tile.getContext('2d').getImageData(0, 0, tile.width, tile.height).data;
  yarn.checked = false; fire(yarn, 'change');
  const redrawn = document.querySelector('.patchwork-tile canvas');
  const after = redrawn.getContext('2d').getImageData(0, 0, redrawn.width, redrawn.height).data;
  check('the open board redraws with the setting', differs(before, after) > 100, differs(before, after));
  closePatchworkBoard();

  setLanguage('en');
  check('labels in English', document.querySelector('[for=relief-strength]').textContent === 'Relief strength' && document.querySelector('[for=yarn-irregular]').textContent === 'Yarn irregularity');
  setLanguage('fr');
  check('no alert', alerts.length === 0);

  const p = document.createElement('pre'); p.id = 'bench-out'; p.style.display = 'none'; p.textContent = results.join('\n'); document.body.appendChild(p);
}
(function wait(n) {
  if (window.drawingContext && tartanStripes.length) run().catch(e => { const p = document.createElement('pre'); p.id = 'bench-out'; p.textContent = results.join('\n') + '\nFAIL crash ' + e.stack; document.body.appendChild(p); });
  else if (n > 0) setTimeout(() => wait(n - 1), 50);
})(200);
