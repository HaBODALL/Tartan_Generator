// Stripe ribbon: the stripes under the cloth, where the canvas shows them, edited without the code.
window.alerts = [];
window.alert = m => window.alerts.push(m);
const results = [];
const check = (n, ok, d) => results.push((ok ? 'PASS ' : 'FAIL ') + n + (d !== undefined ? ' -> ' + d : ''));
window.addEventListener('error', e => results.push('FAIL pageError ' + e.message));
const $ = id => document.getElementById(id);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const stripesEl = () => [...document.querySelectorAll('#ribbon-track .ribbon-stripe')];
const near = (a, b) => Math.abs(a - b) <= 1;
const canvasLeft = () => drawingContext.canvas.getBoundingClientRect().left;
const press = (el, k, shift = false) => el.dispatchEvent(new KeyboardEvent('keydown', { key: k, shiftKey: shift, bubbles: true, cancelable: true }));
const code = () => buildSRTCode(tartanStripes, $('check-sym').checked);
const visible = el => !!el && getComputedStyle(el).display !== 'none' && el.getBoundingClientRect().height > 0;

async function run() {
  tartanStripes = [{ code: 'R', hex: '#C80000', count: 48 }, { code: 'B', hex: '#000064', count: 8 }, { code: 'K', hex: '#101010', count: 12 }, { code: 'W', hex: '#FFFFFF', count: 4 }];
  userPalette = paletteFromStripes(tartanStripes);
  $('check-sym').checked = true;
  const zoomBefore = $('in-zoom').value;
  $('in-zoom').value = '2';
  viewX = 0; viewY = 0;
  updateGeneratedListUI();
  redrawTartan();
  await sleep(30);

  check('ribbon shown in the Atelier', visible($('stripe-ribbon')));
  // A ruler under the cloth: same start, same zoom, every repeat and the mirror
  const blocks = stripesEl();
  check('starts under the canvas edge', near(blocks[0].getBoundingClientRect().left, canvasLeft()), blocks[0].getBoundingClientRect().left + ' vs ' + canvasLeft());
  check('widths follow the zoom', near(blocks[0].getBoundingClientRect().width, 48 * 2) && near(blocks[1].getBoundingClientRect().width, 8 * 2));
  check('weaving order with the mirror', blocks.slice(0, 7).map(b => b.dataset.index).join() === '0,1,2,3,2,1,0', blocks.slice(0, 7).map(b => b.dataset.index).join());
  check('repeats fill the width', blocks.length > 7 && near(blocks[blocks.length - 1].getBoundingClientRect().right, drawingContext.canvas.getBoundingClientRect().right));
  check('counts written when wide enough', blocks[0].textContent === '48' && blocks[3].textContent === '' && blocks[1].textContent === '8');
  check('pivots marked', blocks[0].classList.contains('pivot') && blocks[3].classList.contains('pivot') && !blocks[1].classList.contains('pivot'));
  check('readable ink', getComputedStyle(blocks[3]).color === 'rgb(0, 0, 0)' && getComputedStyle(blocks[2]).color === 'rgb(255, 255, 255)');
  check('editor closed at first', $('ribbon-editor').hidden);
  check('one tab stop', stripesEl().filter(b => b.tabIndex === 0).length === 1);

  // Pan and zoom: the ribbon follows
  viewX = 10;
  redrawTartan();
  check('pan cuts the first stripe', near(stripesEl()[0].getBoundingClientRect().width, 38 * 2) && near(stripesEl()[0].getBoundingClientRect().left, canvasLeft()));
  $('in-zoom').value = '4';
  redrawTartan();
  check('zoom widens', near(stripesEl()[1].getBoundingClientRect().width, 8 * 4));
  viewX = 0;
  $('in-zoom').value = '2';
  redrawTartan();

  // A click on a mirrored copy selects the stripe of the list
  const mirrorCopy = stripesEl()[5];
  mirrorCopy.click();
  check('mirror copy selects its stripe', ribbonSelected === 1);
  check('every copy marked', stripesEl().filter(b => b.dataset.index === '1').every(b => b.getAttribute('aria-pressed') === 'true'));
  check('focus stays on the clicked copy', document.activeElement === stripesEl()[5]);
  ribbonSelected = null;
  renderStripeRibbon();

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

  // Move, add, remove
  selectRibbonStripe(1);
  $('ribbon-right').click();
  check('move right', code() === 'R/48 K12 B20 W/4', code());
  check('selection follows the stripe', ribbonSelected === 2 && $('ribbon-which').textContent.includes('B'));
  selectRibbonStripe(3);
  check('right disabled at the end', $('ribbon-right').disabled && !$('ribbon-left').disabled);
  $('ribbon-add').click();
  check('add a stripe of another colour', tartanStripes.length === 5 && ribbonSelected === 4 && tartanStripes[4].hex !== tartanStripes[3].hex, code());
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
  document.activeElement?.blur();
  ribbonFocusX = null;
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

  // Neighbours of one colour merge
  tartanStripes = [{ code: 'R', hex: '#C80000', count: 48 }, { code: 'B', hex: '#000064', count: 8 }, { code: 'K', hex: '#101010', count: 12 }, { code: 'W', hex: '#FFFFFF', count: 4 }];
  userPalette = paletteFromStripes(tartanStripes);
  updateGeneratedListUI();
  selectRibbonStripe(2, false);
  [...document.querySelectorAll('#ribbon-colors .ribbon-color')].find(c => c.style.background === 'rgb(0, 0, 100)').click();
  check('same colour as a neighbour: they merge', code() === 'R/48 B20 W/4' && ribbonSelected === 1, code() + ' @' + ribbonSelected);
  undo();
  selectRibbonStripe(1, false);
  tartanStripes = [{ code: 'R', hex: '#C80000', count: 48 }, { code: 'B', hex: '#000064', count: 8 }, { code: 'R', hex: '#C80000', count: 12 }, { code: 'W', hex: '#FFFFFF', count: 4 }];
  updateGeneratedListUI();
  selectRibbonStripe(1, false);
  $('ribbon-del').click();
  check('removing between two of one colour merges them, the pivot twice', code() === 'R/72 W/4', code());
  check('threads of the cloth kept, less the removed stripe', countSettThreads(tartanStripes, true) === 92 - 16, countSettThreads(tartanStripes, true));

  // Drag a stripe along the ribbon
  tartanStripes = [{ code: 'R', hex: '#C80000', count: 48 }, { code: 'B', hex: '#000064', count: 8 }, { code: 'K', hex: '#101010', count: 12 }, { code: 'W', hex: '#FFFFFF', count: 4 }];
  updateGeneratedListUI();
  ribbonSelected = null;
  renderStripeRibbon();
  {
    const track = $('ribbon-track');
    const blue = stripesEl()[1];
    const r = blue.getBoundingClientRect(), y = r.top + r.height / 2, x0 = r.left + r.width / 2;
    const ev = (el, type, x) => el.dispatchEvent(new PointerEvent(type, { clientX: x, clientY: y, pointerId: 9, button: 0, bubbles: true }));
    const historyBefore = historyStack.length;
    ev(blue, 'pointerdown', x0);
    for (let x = x0; x <= x0 + 30; x += 5) ev(track, 'pointermove', x);
    ev(track, 'pointerup', x0 + 30);
    track.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    check('drag moves the stripe past a neighbour', code() === 'R/48 K12 B8 W/4', code());
    check('drag is one step in the history', historyStack.length === historyBefore + 1);
    check('the dragged stripe stays chosen', ribbonSelected === 2);
    ev(stripesEl()[0], 'pointerdown', stripesEl()[0].getBoundingClientRect().left + 5);
    ev(track, 'pointermove', stripesEl()[0].getBoundingClientRect().left + 7);
    ev(track, 'pointerup', stripesEl()[0].getBoundingClientRect().left + 7);
    check('a small slip is not a drag', code() === 'R/48 K12 B8 W/4' && historyStack.length === historyBefore + 1);
    undo();
    check('undo puts it back', code() === 'R/48 B8 K12 W/4', code());
  }

  // The palette under the ribbon, the shades for a stripe
  ribbonSelected = null;
  renderStripeRibbon();
  check('palette shown when no stripe is chosen', !$('ribbon-palette').hidden && $('color-list').querySelectorAll('.palette-chip').length === userPalette.length);
  selectRibbonStripe(1, false);
  check('palette gives way to the bar', $('ribbon-palette').hidden && !$('ribbon-editor').hidden);
  $('ribbon-shade').click();
  const picker = $('picker-modal');
  check('shades of the Register', !!picker && picker.querySelectorAll('.picker-chip').length === SRT_PALETTE.length);
  const yellow = SRT_PALETTE.findIndex(c => c.code === 'Y');
  picker.querySelectorAll('.picker-chip')[yellow].click();
  check('the stripe takes the shade', tartanStripes[1].hex === SRT_PALETTE[yellow].hex && !$('picker-modal'));
  check('the shade joins the palette', userPalette.some(c => c.hex === SRT_PALETTE[yellow].hex) || userPalette.length >= 8);
  undo();
  ribbonSelected = null;
  renderStripeRibbon();

  // Lock: Générer keeps the stripe at its place
  tartanStripes = [{ code: 'R', hex: '#C80000', count: 48 }, { code: 'Y', hex: '#E8C000', count: 6 }, { code: 'K', hex: '#101010', count: 12 }, { code: 'W', hex: '#FFFFFF', count: 4 }];
  updateGeneratedListUI();
  selectRibbonStripe(1, false);
  $('ribbon-lock').click();
  check('lock button pressed', $('ribbon-lock').getAttribute('aria-pressed') === 'true' && tartanStripes[1].locked === true);
  check('kept stripe marked on the ribbon', stripesEl().filter(b => b.dataset.index === '1').every(b => b.classList.contains('locked') && b.title.includes('gardée')));
  let keptEveryTime = true;
  for (let k = 0; k < 4; k++) {
    $('btn-generate').click();
    await sleep(20);
    const s1 = tartanStripes[1];
    if (!(s1 && s1.locked && s1.code === 'Y' && s1.count === 6 && s1.hex === '#E8C000')) keptEveryTime = false;
    if (tartanStripes[0].hex === '#E8C000' || tartanStripes[2]?.hex === '#E8C000') keptEveryTime = false;
  }
  check('Générer keeps it, neighbours differ', keptEveryTime, JSON.stringify(tartanStripes.slice(0, 3)));
  check('its colour joins the palette', userPalette.some(c => c.hex.toUpperCase() === '#E8C000') || userPalette.length >= 8);
  check('code shows it', $('import-text').value.includes('Y6'), $('import-text').value);
  selectRibbonStripe(1, false);
  $('ribbon-add').click();
  check('a new stripe starts free', !tartanStripes[2].locked && tartanStripes[1].locked);
  undo();
  selectRibbonStripe(1, false);
  $('ribbon-lock').click();
  check('unlock', !tartanStripes[1].locked && $('ribbon-lock').getAttribute('aria-pressed') === 'false' && !document.querySelector('.ribbon-stripe.locked'));
  ribbonSelected = null;
  tartanStripes = [{ code: 'R', hex: '#C80000', count: 48 }, { code: 'B', hex: '#000064', count: 8 }, { code: 'K', hex: '#101010', count: 12 }];
  updateGeneratedListUI();

  // Symmetry off: no mirror, no pivot
  $('check-sym').click();
  await sleep(20);
  check('asymmetric: repeats without mirror', stripesEl().slice(0, 4).map(b => b.dataset.index).join() === '0,1,2,0' && !document.querySelector('.ribbon-stripe.pivot'), stripesEl().slice(0, 4).map(b => b.dataset.index).join());
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

  // A palette colour can be removed from its picker (touch screens have no small cross)
  {
    const pal = userPalette;
    userPalette = [{ code: 'K', hex: '#101010', name: 'Black' }, { code: 'R', hex: '#C80000', name: 'Red' }, { code: 'B', hex: '#000064', name: 'Blue' }];
    updateUserPaletteUI();
    document.querySelectorAll('#color-list .palette-chip')[2].click();
    const rm = $('picker-remove');
    check('picker of a palette colour offers to remove it', !!rm);
    rm?.click();
    check('removed from the picker', userPalette.length === 2 && !$('picker-modal'));
    document.querySelectorAll('#color-list .palette-chip')[0].click();
    check('never fewer than two colours', !$('picker-remove'));
    document.querySelector('#picker-modal .btn-del')?.click();
    userPalette = pal;
    updateUserPaletteUI();
  }

  // A repeating sett: dragging the last stripe past the edge does not turn the pattern round
  $('check-sym').click();
  await sleep(20);
  tartanStripes = [{ code: 'R', hex: '#C80000', count: 20 }, { code: 'B', hex: '#000064', count: 20 }, { code: 'K', hex: '#101010', count: 20 }];
  viewX = 0;
  updateGeneratedListUI();
  redrawTartan();
  {
    const track = $('ribbon-track');
    const last = stripesEl().find(b => b.dataset.index === '2');
    const r = last.getBoundingClientRect();
    const at = (type, x) => track.dispatchEvent(new PointerEvent(type, { bubbles: true, pointerId: 9, button: 0, clientX: x, clientY: r.top + 4 }));
    last.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerId: 9, button: 0, clientX: r.left + r.width / 2, clientY: r.top + 4 }));
    for (let dx = 10; dx <= r.width * 1.5; dx += 10) at('pointermove', r.left + r.width / 2 + dx);
    at('pointerup', r.left + r.width * 2);
    check('drag stops at the edge of a repeating sett', tartanStripes.map(s => s.code).join() === 'R,B,K', tartanStripes.map(s => s.code).join());
  }
  $('check-sym').click();
  await sleep(20);
  ribbonSelected = null;
  tartanStripes = [{ code: 'R', hex: '#C80000', count: 48 }, { code: 'B', hex: '#000064', count: 8 }, { code: 'K', hex: '#101010', count: 12 }];
  updateGeneratedListUI();

  // Hostile codes stay text
  tartanStripes = [{ code: '<img>', hex: '#C80000', count: 8 }, { code: 'K', hex: '#101010', count: 8 }];
  updateGeneratedListUI();
  selectRibbonStripe(0);
  check('codes are text', !document.querySelector('#stripe-ribbon img') && $('ribbon-which').textContent.includes('<img>'));

  setLanguage('en');
  check('English', $('ribbon-which').textContent === 'Stripe 1 of 2 · <img>' && $('ribbon-add').textContent === 'Add');
  setLanguage('fr');
  ribbonSelected = null;
  tartanStripes = [{ code: 'R', hex: '#C80000', count: 48 }, { code: 'K', hex: '#101010', count: 12 }];
  updateGeneratedListUI();
  $('in-zoom').value = zoomBefore;
  redrawTartan();
  check('no alert', alerts.length === 0);
  const p = document.createElement('pre'); p.id = 'bench-out'; p.style.display = 'none'; p.textContent = results.join('\n'); document.body.appendChild(p);
}
(function start(n) {
  if (window.drawingContext && tartanStripes.length) run().catch(e => { const p = document.createElement('pre'); p.id = 'bench-out'; p.textContent = results.join('\n') + '\nFAIL crash ' + e.stack; document.body.appendChild(p); });
  else if (n > 0) setTimeout(() => start(n - 1), 50);
})(200);
