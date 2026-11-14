// End-to-end checks for the Patchwork mood board, through the real page.
window.alerts = [];
window.alert = m => window.alerts.push(m);
const results = [];
const check = (name, ok, detail) => results.push((ok ? 'PASS ' : 'FAIL ') + name + (detail !== undefined ? ' -> ' + detail : ''));
const $ = id => document.getElementById(id);
const fire = (el, type) => el.dispatchEvent(new Event(type, { bubbles: true }));
const snap = () => JSON.stringify(tartanStripes);
const msg = () => domElements.appMessage.hidden ? '' : domElements.appMessage.textContent;
const tiles = () => [...document.querySelectorAll('#patchwork-grid .patchwork-tile')];
const setDefaults = () => { $('in-stripes').value = 6; $('in-minwidth').value = 4; $('in-maxwidth').value = 64; $('in-sett').value = 260; $('check-mode-check').checked = false; };

// Capture downloads instead of saving files
const downloads = [];
const realCreate = URL.createObjectURL.bind(URL);
URL.createObjectURL = blob => { const u = realCreate(blob); downloads.push({ url: u, blob }); return u; };
HTMLAnchorElement.prototype.click = function () { const d = downloads.find(x => x.url === this.href); if (d) d.name = this.download; };
const waitFor = async (cond, ms = 8000) => { const t = Date.now(); while (!cond() && Date.now() - t < ms) await new Promise(r => setTimeout(r, 20)); return cond(); };
// As a data: URL: the page's Content-Security-Policy does not let images load from blob:
const asDataUrl = blob => new Promise(res => { const r = new FileReader(); r.onload = () => res(r.result); r.readAsDataURL(blob); });
const imageSize = blob => new Promise(async res => { const i = new Image(); i.onload = () => res([i.width, i.height]); i.onerror = () => res(null); i.src = await asDataUrl(blob); });

function canvasStats(cv) {
  const px = cv.getContext('2d').getImageData(0, 0, cv.width, cv.height).data;
  const colors = new Set(); let opaque = true;
  for (let i = 0; i < px.length; i += 4) { if (px[i + 3] !== 255) opaque = false; colors.add(px[i] + ',' + px[i + 1] + ',' + px[i + 2]); }
  return { opaque, colors: colors.size };
}

async function run() {
  setDefaults(); handleGenerateClick();
  $('lock-colors').checked = false; $('lock-structure').checked = false;

  // The sidebar controls are usable now
  check('sidebar controls are enabled', !$('patchwork-qty').disabled && !$('patchwork-size').disabled && !$('btn-generate-patchwork').disabled);
  check('board exports live in the Exporter menu', $('menu-export').contains($('btn-generate-patchwork-zip')) && $('menu-export').contains($('btn-patchwork-png')));
  check('Atelier mode at load', !document.body.classList.contains('board-mode') && $('btn-patchwork-close').getAttribute('aria-pressed') === 'true');

  // Open the board
  const before = snap(), depth = historyStack.length;
  $('patchwork-qty').value = 12;
  $('btn-generate-patchwork').focus();
  $('btn-generate-patchwork').click();
  check('board opens', !$('patchwork-board').hidden);
  check('Planche mode', document.body.classList.contains('board-mode') && $('btn-generate-patchwork').getAttribute('aria-pressed') === 'true' && $('btn-patchwork-close').getAttribute('aria-pressed') === 'false');
  check('panel shows the board settings only', getComputedStyle($('panel-board')).display !== 'none' && getComputedStyle(document.querySelector('.panel-top')).display === 'none' && getComputedStyle($('panel-pattern')).display === 'none');
  check('board shows the requested number of tiles', tiles().length === 12, tiles().length);
  check('opening the board keeps the pattern and history', snap() === before && historyStack.length === depth);
  const stats = tiles().map(t => canvasStats(t.querySelector('canvas')));
  check('every tile is drawn, opaque, with several colors', stats.every(s => s.opaque && s.colors >= 2), JSON.stringify(stats.slice(0, 3)));
  const rect = $('patchwork-grid').getBoundingClientRect(), last = tiles()[11].getBoundingClientRect();
  check('tiles fit the board without scrolling', last.bottom <= rect.bottom + 1 && last.right <= rect.right + 1, `${Math.round(last.bottom)}<=${Math.round(rect.bottom)}`);
  check('tiles are labelled with their SRT code', tiles()[0].getAttribute('aria-label').includes(buildSRTCode(patchworkBatch[0].stripes, patchworkBatch[0].symmetric)));
  check('focus moves into the board', document.activeElement === tiles()[0]);
  check('free batch varies palettes', new Set(patchworkBatch.map(e => e.palette.map(c => c.code).join())).size > 1);
  check('tile palettes list only used colors', patchworkBatch.every(e => e.palette.every(c => e.stripes.some(s => s.hex === c.hex))));
  check('no tile has identical neighbors', patchworkBatch.every(e => e.stripes.every((s, i) => i === 0 || s.code !== e.stripes[i - 1].code)));

  // Shortcuts are off while the board is open, except Escape
  let id = generationID;
  for (const key of [' ', 'Enter', 'g', 'r']) document.body.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
  check('shortcuts do not generate behind the board', generationID === id && snap() === before);
  document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
  check('Escape closes the board', $('patchwork-board').hidden);
  check('focus returns to the open button', document.activeElement === $('btn-generate-patchwork'));

  // Locks
  $('lock-colors').checked = true;
  generatePatchwork();
  const pal = userPalette.map(c => c.hex);
  check('"keep colors" uses the current palette for every tile', patchworkBatch.every(e => e.stripes.every(s => pal.includes(s.hex))));
  $('lock-colors').checked = false; $('lock-structure').checked = true;
  $('btn-patchwork-new').click();
  const counts = tartanStripes.map(s => s.count).join();
  check('"keep structure" keeps the widths of every tile', patchworkBatch.every(e => e.stripes.map(s => s.count).join() === counts));
  check('"new batch" replaces the tiles', tiles().length === 12);
  $('lock-structure').checked = false;

  // Symmetry follows the checkbox
  $('check-sym').checked = false; updateSymmetry();
  generatePatchwork();
  check('asymmetric setting gives asymmetric tiles', patchworkBatch.every(e => e.symmetric === false));
  $('check-sym').checked = true; updateSymmetry();
  generatePatchwork();

  // Pick a tile
  const pick = JSON.parse(JSON.stringify(patchworkBatch[3]));
  const prev = snap(), prevDepth = historyStack.length;
  tiles()[3].click();
  check('picking a tile makes it the pattern', snap() === JSON.stringify(pick.stripes) && generationID === pick.generationID);
  check('picking a tile adopts its palette', JSON.stringify(userPalette) === JSON.stringify(pick.palette));
  check('picking a tile closes the board', $('patchwork-board').hidden);
  check('the previous pattern goes to history', historyStack.length === Math.min(10, prevDepth + 1) && JSON.stringify(historyStack[historyStack.length - 1].stripes) === prev);
  check('SRT field follows the picked tile', domElements.importText.value === buildSRTCode(tartanStripes, domElements.sym.checked));
  undo();
  check('undo returns to the pattern before the pick', snap() === prev);

  // Invalid settings: inline error, board stays closed
  $('in-sett').value = 2;
  $('btn-generate-patchwork').click();
  check('invalid settings keep the board closed', $('patchwork-board').hidden);
  check('invalid settings show the inline error', domElements.appMessage.classList.contains('error') && msg().length > 0, msg().slice(0, 40));
  setDefaults();

  // Scale and relief modes render
  generatePatchwork();
  $('in-zoom').value = 8;
  $('patchwork-scale').value = 'zoom'; fire($('patchwork-scale'), 'change');
  const fitColors = canvasStats(tiles()[0].querySelector('canvas')).colors;
  check('"current zoom" scale renders tiles', tiles().length === 12 && canvasStats(tiles()[0].querySelector('canvas')).opaque, fitColors);
  domElements.effectRelief.checked = true;
  renderPatchworkBoard();
  const reliefColors = canvasStats(tiles()[0].querySelector('canvas')).colors;
  check('relief effect shades the tiles', reliefColors > fitColors, `${fitColors} -> ${reliefColors}`);
  domElements.effectRelief.checked = false;
  $('patchwork-scale').value = 'fit'; fire($('patchwork-scale'), 'change');

  // Language
  setLanguage('en');
  check('board translates', $('patchwork-title').textContent.startsWith('Mood board') && tiles()[0].getAttribute('aria-label').startsWith('Use this pattern'), $('patchwork-title').textContent);
  setLanguage('fr');

  // PNG export
  $('patchwork-size').value = 100;
  downloads.length = 0;
  await exportPatchworkPNG();
  const png = downloads.find(d => d.name && d.name.endsWith('.png'));
  check('PNG export downloads one file', !!png, png && png.name);
  const dims = png && await imageSize(png.blob);
  check('PNG is a 4 x 3 grid of 100 px tiles', dims && dims[0] === 400 && dims[1] === 300, JSON.stringify(dims));
  check('status says the export is done', $('patchwork-status').textContent.length > 0, $('patchwork-status').textContent);

  // Too big
  $('patchwork-qty').value = 100; $('patchwork-size').value = 1000;
  generatePatchwork();
  downloads.length = 0;
  await exportPatchworkPNG();
  check('too-large export is refused with a message', downloads.length === 0 && $('patchwork-status').textContent.includes('50'), $('patchwork-status').textContent.slice(0, 40));
  const fits = () => tiles().length === 100 && tiles()[99].getBoundingClientRect().bottom <= $('patchwork-grid').getBoundingClientRect().bottom + 1;
  await waitFor(fits, 2000);
  check('100 tiles still fit after the status line changes', fits(), Math.round(tiles()[99].getBoundingClientRect().bottom) + ' vs ' + Math.round($('patchwork-grid').getBoundingClientRect().bottom));

  // ZIP export
  $('patchwork-qty').value = 10; $('patchwork-size').value = 64;
  generatePatchwork();
  downloads.length = 0;
  $('btn-generate-patchwork-zip').click();
  await waitFor(() => downloads.some(d => d.name && d.name.endsWith('.zip')), 45000);
  check('status reads done after the ZIP', await waitFor(() => !patchworkExporting, 5000) && $('patchwork-status').textContent.length > 0);
  const zipDl = downloads.find(d => d.name && d.name.endsWith('.zip'));
  check('ZIP export downloads one file', !!zipDl, zipDl && zipDl.name);
  if (zipDl) {
    const zip = await JSZip.loadAsync(zipDl.blob);
    const names = Object.keys(zip.files);
    check('ZIP holds one PNG per tile and the codes', names.filter(n => n.endsWith('.png')).length === 10 && names.includes('codes.txt'), names.length);
    const codes = await zip.file('codes.txt').async('string');
    check('codes list every SRT', patchworkBatch.every(e => codes.includes(buildSRTCode(e.stripes, e.symmetric))));
    const first = await imageSize(await zip.file(names.find(n => n.endsWith('.png'))).async('blob'));
    check('ZIP tiles have the export size', first && first[0] === 64 && first[1] === 64, JSON.stringify(first));
  }

  // Leave the board open for the screenshot
  // An export keeps its own batch even if a new one is drawn meanwhile
  $('patchwork-size').value = 64; $('patchwork-qty').value = 10;
  generatePatchwork();
  const exported = patchworkBatch.map(e => buildSRTCode(e.stripes, e.symmetric));
  downloads.length = 0;
  const pending = generatePatchworkZIP();
  generatePatchwork();
  await pending;
  const z2 = downloads.find(d => d.name && d.name.endsWith('.zip'));
  const codes2 = z2 ? await (await JSZip.loadAsync(z2.blob)).file('codes.txt').async('string') : '';
  check('an export is not mixed with a newer batch', !!z2 && exported.every(c => codes2.includes(c)));

  $('patchwork-qty').value = 20;
  generatePatchwork();
  check('no alert during the whole run', alerts.length === 0, JSON.stringify(alerts));

  const pre = document.createElement('pre');
  pre.id = 'bench-out';
  pre.style.display = 'none';
  pre.textContent = results.join('\n');
  document.body.appendChild(pre);
}

window.addEventListener('error', e => results.push('FAIL pageError ' + e.message));
(function wait(n) {
  if (window.drawingContext && tartanStripes.length) {
    run().catch(e => { const p = document.createElement('pre'); p.id = 'bench-out'; p.style.display = 'none'; p.textContent = results.join('\n') + '\nFAIL crash ' + e.stack; document.body.appendChild(p); });
  } else if (n > 0) setTimeout(() => wait(n - 1), 50);
})(200);
