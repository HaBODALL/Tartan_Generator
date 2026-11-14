// Color readability, through the real page.
window.alerts = [];
window.alert = m => window.alerts.push(m);
const results = [];
const check = (n, ok, d) => results.push((ok ? 'PASS ' : 'FAIL ') + n + (d !== undefined ? ' -> ' + d : ''));
window.addEventListener('error', e => results.push('FAIL pageError ' + e.message));
const $ = id => document.getElementById(id);
const fire = (el, type) => el.dispatchEvent(new Event(type, { bubbles: true }));
const list = () => $('readability-list').textContent;
const setStripes = arr => { tartanStripes = arr.map(([code, hex, count]) => ({ code, hex, count })); userPalette = paletteFromStripes(tartanStripes); redrawTartan(); };
const main = () => document.querySelector('#canvas-container > canvas');

async function run() {
  $('check-sym').checked = true;
  setStripes([['K', '#101010', 48], ['W', '#FFFFFF', 8], ['Y', '#FFE600', 20]]);
  check('clear pattern is fine', list().includes('se distinguent bien'), list());
  check('no warning badge', $('readability-badge').textContent === '');

  setStripes([['K', '#101010', 48], ['DG', '#141414', 8], ['W', '#FFFFFF', 20]]);
  check('close stripes are reported', list().includes('très proches') && list().includes('K') && list().includes('DG'), list());
  check('warning badge', $('readability-badge').textContent === '⚠');
  check('chips', $('readability-list').querySelectorAll('.sheet-chip').length === 2);

  setStripes([['R', '#C80000', 48], ['G', '#2E7D00', 8], ['W', '#FFFFFF', 20]]);
  check('color blindness pair is reported', list().includes('daltonisme') && /Protan|Deut/.test(list()), list());
  check('no warning badge for it', $('readability-badge').textContent === '');

  // Not rebuilt on every redraw
  const row = $('readability-list').firstChild;
  redrawTartan();
  check('list is not rebuilt without a change', $('readability-list').firstChild === row);
  $('check-sym').checked = false; redrawTartan();
  check('symmetry change updates it', $('readability-list').firstChild !== row);
  $('check-sym').checked = true; redrawTartan();

  // Vision simulation
  const select = $('vision-select');
  check('filters exist', ['protan', 'deuter', 'tritan'].every(t => document.getElementById('vision-' + t)));
  const before = main().getContext('2d').getImageData(0, 0, 50, 50).data.join();
  select.value = 'deuter'; fire(select, 'change');
  check('filter on the pattern', getComputedStyle(main()).filter.includes('vision-deuter'), getComputedStyle(main()).filter);
  check('canvas pixels stay true for exports', main().getContext('2d').getImageData(0, 0, 50, 50).data.join() === before);
  $('patchwork-qty').value = 10; generatePatchwork();
  check('filter on the mood board', getComputedStyle(document.querySelector('.patchwork-tile canvas')).filter.includes('vision-deuter'));
  check('buttons are not filtered', getComputedStyle($('btn-toggle-ui')).filter === 'none');
  closePatchworkBoard();
  select.value = 'normal'; fire(select, 'change');
  check('back to normal', getComputedStyle(main()).filter === 'none');

  setLanguage('en');
  check('English list', list().includes('color blindness'), list());
  check('English option', select.options[1].textContent === 'Protanopia (red)');
  setLanguage('fr');
  check('French list back', list().includes('daltonisme'));

  check('no alert', alerts.length === 0);
  const p = document.createElement('pre'); p.id = 'bench-out'; p.style.display = 'none'; p.textContent = results.join('\n'); document.body.appendChild(p);
}
(function wait(n) {
  if (window.drawingContext && tartanStripes.length) run().catch(e => { const p = document.createElement('pre'); p.id = 'bench-out'; p.textContent = results.join('\n') + '\nFAIL crash ' + e.stack; document.body.appendChild(p); });
  else if (n > 0) setTimeout(() => wait(n - 1), 50);
})(200);
