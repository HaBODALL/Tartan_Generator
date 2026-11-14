// Zoom controls and relief checkbox, through the real page.
window.alerts = [];
window.alert = m => window.alerts.push(m);
const results = [];
const check = (n, ok, d) => results.push((ok ? 'PASS ' : 'FAIL ') + n + (d !== undefined ? ' -> ' + d : ''));
window.addEventListener('error', e => results.push('FAIL pageError ' + e.message));
const $ = id => document.getElementById(id);
const fire = (el, type) => el.dispatchEvent(new Event(type, { bubbles: true }));
const zoom = () => parseFloat($('in-zoom').value);
const key = k => document.body.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true }));
const wheel = dy => { const ev = new WheelEvent('wheel', { deltaY: dy, bubbles: true, cancelable: true }); $('canvas-container').dispatchEvent(ev); return ev.defaultPrevented; };

async function run() {
  const slider = $('zoom-slider');
  $('in-zoom').value = 2; fire($('in-zoom'), 'input');
  check('slider follows the number field', slider.value === String(zoomToSlider(2)), slider.value);

  // Buttons
  $('btn-zoom-in').click();
  check('+ zooms in by one step', zoom() === 2.5, zoom());
  $('btn-zoom-out').click(); $('btn-zoom-out').click();
  check('- zooms out by one step', zoom() === 1.6, zoom());
  check('slider follows the buttons', slider.value === String(zoomToSlider(1.6)), slider.value);
  for (let i = 0; i < 30; i++) $('btn-zoom-out').click();
  check('zoom stops at 0.5', zoom() === 0.5, zoom());
  for (let i = 0; i < 40; i++) $('btn-zoom-in').click();
  check('zoom stops at 12', zoom() === 12, zoom());

  // Slider is logarithmic: its middle is near 2.4, not 6.25
  slider.value = 500; fire(slider, 'input');
  check('slider middle gives a low zoom', zoom() > 2 && zoom() < 3, zoom());
  check('slider updates the number field and the drawing', $('in-zoom').value === zoom().toFixed(1));
  slider.value = 0; fire(slider, 'input');
  check('slider start is 0.5', zoom() === 0.5);
  slider.value = 1000; fire(slider, 'input');
  check('slider end is 12', zoom() === 12);

  // Wheel over the pattern
  $('in-zoom').value = 4; fire($('in-zoom'), 'input');
  const prevented = wheel(-100);
  check('wheel up zooms in', zoom() === 5 && prevented, zoom());
  wheel(100);
  check('wheel down zooms out', zoom() === 4, zoom());

  // Keys
  key('+');
  check('+ key zooms in', zoom() === 5, zoom());
  key('-');
  check('- key zooms out', zoom() === 4, zoom());
  const id = generationID;
  $('in-zoom').focus();
  $('in-zoom').dispatchEvent(new KeyboardEvent('keydown', { key: '-', bubbles: true, cancelable: true }));
  check('typing - in the field does not zoom', zoom() === 4 && generationID === id);
  $('in-zoom').blur();

  // Zoom is saved
  saveState();
  check('zoom is saved', parseFloat(JSON.parse(localStorage.getItem('tartanGeneratorState')).zoom) === 4);
  $('in-zoom').value = 7; loadState();
  check('zoom and slider come back after a reload', zoom() === 4 && slider.value === String(zoomToSlider(4)));

  // Wheel does not zoom behind the mood board
  $('patchwork-qty').value = 10; generatePatchwork();
  wheel(-100);
  check('wheel over the mood board does not zoom', zoom() === 4);
  closePatchworkBoard();

  // Relief checkbox and strength row
  const relief = $('effect-relief'), row = $('relief-strength').closest('.control-row');
  relief.checked = false; fire(relief, 'change');
  check('strength row is hidden without the relief', row.hidden && getComputedStyle(row).display === 'none');
  relief.checked = true; fire(relief, 'change');
  check('strength row shows with the relief', !row.hidden && getComputedStyle(row).display !== 'none');
  check('relief draws at a large tile scale', getTileScale(getEffectType(), 4) > 1);
  saveState();
  check('relief is saved as before', JSON.parse(localStorage.getItem('tartanGeneratorState')).effectType === 'relief');
  for (const [old, on] of [['experimental', true], ['noise', false], ['overlay', false], ['none', false], ['relief', true]]) {
    const s = JSON.parse(localStorage.getItem('tartanGeneratorState')); s.effectType = old;
    localStorage.setItem('tartanGeneratorState', JSON.stringify(s));
    loadState();
    check(`saved "${old}" loads as relief ${on ? 'on' : 'off'}`, relief.checked === on && row.hidden === !on);
  }

  // Labels
  setLanguage('en');
  check('English labels', document.querySelector('[for=effect-relief]').textContent === 'Thread relief' && $('btn-zoom-in').getAttribute('aria-label') === 'Zoom in' && $('btn-zoom-out').title === 'Zoom out');
  check('panel toggle label translated', $('btn-toggle-ui').getAttribute('aria-label') === 'Show/Hide panel');
  setLanguage('fr');
  check('French labels back', $('btn-zoom-in').getAttribute('aria-label') === 'Zoomer');
  check('no alert', alerts.length === 0);

  const p = document.createElement('pre'); p.id = 'bench-out'; p.style.display = 'none'; p.textContent = results.join('\n'); document.body.appendChild(p);
}
(function wait(n) {
  if (window.drawingContext && tartanStripes.length) run().catch(e => { const p = document.createElement('pre'); p.id = 'bench-out'; p.textContent = results.join('\n') + '\nFAIL crash ' + e.stack; document.body.appendChild(p); });
  else if (n > 0) setTimeout(() => wait(n - 1), 50);
})(200);
