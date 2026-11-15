// Criteria mood board, through the real page.
window.alerts = [];
window.alert = m => window.alerts.push(m);
const results = [];
const check = (n, ok, d) => results.push((ok ? 'PASS ' : 'FAIL ') + n + (d !== undefined ? ' -> ' + d : ''));
window.addEventListener('error', e => results.push('FAIL pageError ' + e.message));
const $ = id => document.getElementById(id);
const fire = (el, type) => el.dispatchEvent(new Event(type, { bubbles: true }));
const sleep = ms => new Promise(r => setTimeout(r, ms));
const tiles = () => [...document.querySelectorAll('.patchwork-cell')];
const colsOf = () => $('patchwork-grid').style.gridTemplateColumns.match(/repeat\((\d+)/)[1] | 0;

async function run() {
  const mode = $('patchwork-mode'), x = $('patchwork-axis-x'), y = $('patchwork-axis-y');
  const rows = [...document.querySelectorAll('.patchwork-criteria-row')];
  check('axes hidden in random mode', rows.every(r => getComputedStyle(r).display === 'none'));
  check('quantity shown in random mode', getComputedStyle($('patchwork-qty-row')).display !== 'none');
  $('patchwork-qty').value = 12; generatePatchwork();
  check('random board unchanged', tiles().length === 12, tiles().length);
  check('random board has no captions', !document.querySelector('.patchwork-caption'));
  closePatchworkBoard();

  mode.value = 'criteria'; fire(mode, 'change');
  check('axes shown in criteria mode', rows.every(r => getComputedStyle(r).display !== 'none'));
  check('quantity hidden in criteria mode', getComputedStyle($('patchwork-qty-row')).display === 'none');
  check('default axes', x.value === 'colors' && y.value === 'stripes', x.value + ' ' + y.value);
  check('info matches the grid', /1500x1500/.test($('patchwork-info').textContent), $('patchwork-info').textContent);

  generatePatchwork();
  await sleep(120);
  check('5 x 5 grid', tiles().length === 25 && colsOf() === 5, tiles().length + ' ' + colsOf());
  check('caption on the first tile', tiles()[0].querySelector('.patchwork-caption').textContent === '2 couleurs · 4 bandes', tiles()[0].querySelector('.patchwork-caption').textContent);
  check('caption on the last tile', tiles()[24].querySelector('.patchwork-caption').textContent === '6 couleurs · 16 bandes');
  { const g = $('patchwork-grid'), r = tiles()[24].getBoundingClientRect(), gr = g.getBoundingClientRect(), s = getComputedStyle(g); check('tiles fit the board', r.bottom <= gr.bottom + 1 && r.right <= gr.right + 1, [g.scrollHeight, g.clientHeight, r.bottom, gr.bottom, s.gridAutoRows, s.padding, s.gap, s.alignContent].join(' ')); }
  check('tile colors follow the column', patchworkBatch.every(e => e.palette.length <= e.criteria[0][1]));

  // Pins stay in their cell
  togglePatchworkPin(7);
  const pinned = patchworkBatch[7], other = patchworkBatch[8];
  generatePatchwork();
  check('pin stays in its cell', patchworkBatch[7] === pinned && patchworkBatch.length === 25);
  check('other tiles change', patchworkBatch[8] !== other);
  check('caption of the cells is unchanged', patchworkBatch.every((e, i) => e.criteria[0][1] === PATCHWORK_AXES.colors[i % 5]));

  // Another grid
  x.value = 'symmetric'; y.value = 'none'; fire(x, 'change');
  generatePatchwork();
  check('single row', tiles().length === 2 && colsOf() === 2, tiles().length);
  check('pins not kept are announced', $('patchwork-status').textContent.includes('épingles'), $('patchwork-status').textContent);
  check('symmetry applied', patchworkBatch[0].symmetric === false && patchworkBatch[1].symmetric === true);
  check('symmetric caption', tiles()[1].querySelector('.patchwork-caption').textContent === 'Symétrique');

  // PNG export uses the grid
  let sheet = null;
  const realBlob = HTMLCanvasElement.prototype.toBlob;
  const realDownload = window.downloadBlob;
  HTMLCanvasElement.prototype.toBlob = function (cb, ...a) { sheet = { w: this.width, h: this.height }; return realBlob.call(this, cb, ...a); };
  x.value = 'colors'; y.value = 'symmetric'; generatePatchwork();
  $('patchwork-size').value = 100;
  await exportPatchworkPNG();
  HTMLCanvasElement.prototype.toBlob = realBlob;
  check('PNG sheet follows the grid', sheet && sheet.w === 500 && sheet.h === 200, JSON.stringify(sheet));

  // Picking a tile applies it
  const entry = patchworkBatch[3];
  usePatchworkTile(3);
  check('tile becomes the pattern', tartanStripes.length === entry.stripes.length && !isPatchworkOpen());

  // Variants leave the grid layout
  generatePatchwork();
  $('patchwork-qty').value = 12;
  showPatchworkVariants(0);
  await sleep(120);
  check('variants flow freely', patchworkLayout === null && tiles().length === 12, tiles().length);
  closePatchworkBoard();

  // Settings that block the random mode do not block the grid
  $('in-sett').value = 40; $('in-stripes').value = 40;
  x.value = 'stripes'; y.value = 'none';
  generatePatchwork();
  check('axes ignore the sett limit', isPatchworkOpen() && tiles().length === 5, tiles().length);
  closePatchworkBoard();
  $('in-sett').value = 260; $('in-stripes').value = 6;

  // One color locked
  const savedPalette = userPalette;
  userPalette = [savedPalette[0]];
  $('lock-colors').checked = true;
  generatePatchwork();
  check('one locked color is refused', !isPatchworkOpen());
  userPalette = savedPalette;
  x.value = 'colors'; y.value = 'none';
  generatePatchwork();
  check('locked palette limits the columns', tiles().length === Math.max(1, PATCHWORK_AXES.colors.filter(v => v <= userPalette.length).length) && patchworkBatch.every(e => e.palette.every(c => userPalette.some(p => p.hex === c.hex))), tiles().length + ' / ' + userPalette.length);
  closePatchworkBoard();
  $('lock-colors').checked = false;

  // Translation
  setLanguage('en');
  x.value = 'stripes'; y.value = 'none';
  generatePatchwork();
  check('English caption', tiles()[0].querySelector('.patchwork-caption').textContent === '4 stripes');
  check('English option', mode.options[1].textContent === 'By criteria');
  closePatchworkBoard();
  setLanguage('fr');
  check('no alert', alerts.length === 0);

  const p = document.createElement('pre'); p.id = 'bench-out'; p.style.display = 'none'; p.textContent = results.join('\n'); document.body.appendChild(p);
}
(function wait(n) {
  if (window.drawingContext && tartanStripes.length) run().catch(e => { const p = document.createElement('pre'); p.id = 'bench-out'; p.textContent = results.join('\n') + '\nFAIL crash ' + e.stack; document.body.appendChild(p); });
  else if (n > 0) setTimeout(() => wait(n - 1), 50);
})(200);
