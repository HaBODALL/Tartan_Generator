// Stripe ribbon: the stripes to scale under the pattern, edited without the code.
window.alerts = [];
window.alert = m => window.alerts.push(m);
const results = [];
const check = (n, ok, d) => results.push((ok ? 'PASS ' : 'FAIL ') + n + (d !== undefined ? ' -> ' + d : ''));
window.addEventListener('error', e => results.push('FAIL pageError ' + e.message));
const $ = id => document.getElementById(id);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const stripesEl = () => [...document.querySelectorAll('#ribbon-track .ribbon-stripe')];
const mirrorEl = () => document.querySelectorAll('#ribbon-track .ribbon-mirror');
const press = (el, k, shift = false) => el.dispatchEvent(new KeyboardEvent('keydown', { key: k, shiftKey: shift, bubbles: true, cancelable: true }));
const code = () => buildSRTCode(tartanStripes, $('check-sym').checked);
const visible = el => !!el && getComputedStyle(el).display !== 'none' && el.getBoundingClientRect().height > 0;

async function run() {
  tartanStripes = [{ code: 'R', hex: '#C80000', count: 48 }, { code: 'B', hex: '#000064', count: 8 }, { code: 'K', hex: '#101010', count: 12 }, { code: 'W', hex: '#FFFFFF', count: 4 }];
  userPalette = paletteFromStripes(tartanStripes);
  $('check-sym').checked = true;
  updateGeneratedListUI();
  redrawTartan();
  await sleep(30);

  check('ribbon shown in the Atelier', visible($('stripe-ribbon')));
  check('one block per stripe', stripesEl().length === 4, stripesEl().length);
  check('mirrored half faded', mirrorEl().length === 2 && getComputedStyle(mirrorEl()[0]).opacity < 1);
  check('to scale', stripesEl()[0].style.flexGrow === '48' && stripesEl()[3].style.flexGrow === '4');
  check('counts written in', stripesEl().map(b => b.textContent).join() === '48,8,12,4');
  check('pivots marked', stripesEl()[0].classList.contains('pivot') && stripesEl()[3].classList.contains('pivot') && !stripesEl()[1].classList.contains('pivot'));
  check('readable ink', getComputedStyle(stripesEl()[3]).color === 'rgb(0, 0, 0)' && getComputedStyle(stripesEl()[2]).color === 'rgb(255, 255, 255)');
  check('editor closed at first', $('ribbon-editor').hidden);
  check('one tab stop', stripesEl().filter(b => b.tabIndex === 0).length === 1);

  // Select and change threads
  stripesEl()[1].click();
  check('click opens the bar', !$('ribbon-editor').hidden && stripesEl()[1].getAttribute('aria-pressed') === 'true');
  check('bar names the stripe', $('ribbon-which').textContent === 'Bande 2 sur 4 · B', $('ribbon-which').textContent);
  check('count in the field', $('ribbon-count').value === '8');
  const historyBefore = historyStack.length;
  $('ribbon-more').click(); $('ribbon-more').click(); $('ribbon-more').click();
  check('plus adds 2 threads each', tartanStripes[1].count === 14, tartanStripes[1].count);
  check('code follows', $('import-text').value === 'R/48 B14 K12 W/4', $('import-text').value);
  check('quick repeats make one undo step', historyStack.length === historyBefore + 1, historyStack.length - historyBefore);
  undo();
  check('undo brings the stripe back', tartanStripes[1].count === 8 && stripesEl()[1].textContent === '8');
  check('selection kept after undo', !$('ribbon-editor').hidden);

  $('ribbon-count').value = '20';
  $('ribbon-count').dispatchEvent(new Event('input'));
  check('typed count applies', tartanStripes[1].count === 20);
  $('ribbon-count').value = '0';
  $('ribbon-count').dispatchEvent(new Event('input'));
  $('ribbon-count').dispatchEvent(new Event('change'));
  check('impossible count refused', tartanStripes[1].count === 20 && $('ribbon-count').value === '20');

  // Colour
  const chips = [...document.querySelectorAll('#ribbon-colors .ribbon-color')];
  check('colour choices from the pattern', chips.length >= 4 && chips.filter(c => c.getAttribute('aria-pressed') === 'true').length === 1);
  chips.find(c => c.title.startsWith('W')).click();
  check('colour changes', tartanStripes[1].code === 'W' && tartanStripes[1].hex === '#FFFFFF');
  undo();

  // Move, duplicate, remove
  selectRibbonStripe(1);
  $('ribbon-right').click();
  check('move right', code() === 'R/48 K12 B20 W/4', code());
  check('selection follows the stripe', ribbonSelected === 2 && $('ribbon-which').textContent.includes('B'));
  selectRibbonStripe(3);
  check('right disabled at the end', $('ribbon-right').disabled && !$('ribbon-left').disabled);
  $('ribbon-dup').click();
  check('duplicate', tartanStripes.length === 5 && tartanStripes[4].code === 'W' && ribbonSelected === 4);
  $('ribbon-del').click();
  check('remove', tartanStripes.length === 4);
  tartanStripes = tartanStripes.slice(0, 2);
  updateGeneratedListUI();
  selectRibbonStripe(0);
  check('two stripes stay', $('ribbon-del').disabled);
  tartanStripes = [{ code: 'R', hex: '#C80000', count: 48 }, { code: 'B', hex: '#000064', count: 8 }, { code: 'K', hex: '#101010', count: 12 }, { code: 'W', hex: '#FFFFFF', count: 4 }];
  updateGeneratedListUI();

  // Keyboard
  const zoom = $('in-zoom') ? $('in-zoom').value : null;
  selectRibbonStripe(0);
  const first = stripesEl()[0];
  check('focus on the stripe', document.activeElement === first);
  press(document.activeElement, 'ArrowRight');
  check('arrow selects the next', ribbonSelected === 1 && document.activeElement === stripesEl()[1]);
  press(document.activeElement, '+');
  check('plus key adds threads', tartanStripes[1].count === 10);
  check('page zoom untouched', !$('in-zoom') || $('in-zoom').value === zoom);
  press(document.activeElement, 'ArrowRight', true);
  check('Shift+arrow moves', code() === 'R/48 K12 B10 W/4' && ribbonSelected === 2 && document.activeElement === stripesEl()[2], code());
  press(document.activeElement, 'Delete');
  check('Delete removes', tartanStripes.length === 3 && document.activeElement?.classList.contains('ribbon-stripe'));
  press(document.activeElement, 'Escape');
  check('Escape closes the bar', $('ribbon-editor').hidden && ribbonSelected === null);

  // Symmetry off: no mirror, no pivot
  $('check-sym').click();
  await sleep(20);
  check('asymmetric: no mirror', mirrorEl().length === 0 && !document.querySelector('.ribbon-stripe.pivot'));
  $('check-sym').click();
  await sleep(20);

  // A new pattern closes a selection out of range
  selectRibbonStripe(2);
  tartanStripes = tartanStripes.slice(0, 2);
  updateGeneratedListUI();
  check('selection out of range dropped', ribbonSelected === null && $('ribbon-editor').hidden);

  // Planche: the ribbon goes
  $('btn-generate-patchwork')?.click();
  await sleep(200);
  if (isPatchworkOpen()) {
    check('hidden on the Planche', !visible($('stripe-ribbon')));
    closePatchworkBoard();
    await sleep(50);
  }
  check('back in the Atelier', visible($('stripe-ribbon')));

  // Hostile codes stay text
  tartanStripes = [{ code: '<img>', hex: '#C80000', count: 8 }, { code: 'K', hex: '#101010', count: 8 }];
  updateGeneratedListUI();
  selectRibbonStripe(0);
  check('codes are text', !document.querySelector('#stripe-ribbon img') && $('ribbon-which').textContent.includes('<img>'));

  setLanguage('en');
  check('English', $('ribbon-which').textContent === 'Stripe 1 of 2 · <img>' && $('ribbon-dup').textContent === 'Duplicate');
  setLanguage('fr');
  ribbonSelected = null;
  tartanStripes = [{ code: 'R', hex: '#C80000', count: 48 }, { code: 'K', hex: '#101010', count: 12 }];
  updateGeneratedListUI();
  check('no alert', alerts.length === 0);
  const p = document.createElement('pre'); p.id = 'bench-out'; p.style.display = 'none'; p.textContent = results.join('\n'); document.body.appendChild(p);
}
(function start(n) {
  if (window.drawingContext && tartanStripes.length) run().catch(e => { const p = document.createElement('pre'); p.id = 'bench-out'; p.textContent = results.join('\n') + '\nFAIL crash ' + e.stack; document.body.appendChild(p); });
  else if (n > 0) setTimeout(() => start(n - 1), 50);
})(200);
