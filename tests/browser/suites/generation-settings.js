// End-to-end checks for generation, settings, palette, history and thread type, through the real page.
window.alerts = [];
window.alert = m => window.alerts.push(m);
const results = [];
const check = (name, ok, detail) => results.push((ok ? 'PASS ' : 'FAIL ') + name + (detail !== undefined ? ' -> ' + detail : ''));
const sleep = ms => new Promise(r => setTimeout(r, ms));
const $ = id => document.getElementById(id);
const fire = (el, type) => el.dispatchEvent(new Event(type, { bubbles: true }));
const snap = () => JSON.stringify(tartanStripes);
const setDefaults = () => { $('in-stripes').value = 6; $('in-minwidth').value = 4; $('in-maxwidth').value = 64; $('in-sett').value = 260; $('check-mode-check').checked = false; };
const msg = () => domElements.appMessage.hidden ? '' : domElements.appMessage.textContent;
const adjacentDup = () => tartanStripes.some((s, i) => i > 0 && s.code === tartanStripes[i - 1].code);

async function run() {
  setDefaults();
  handleGenerateClick();

  // Typing no longer regenerates or alerts
  let before = snap(), id = generationID;
  const sett = $('in-sett');
  for (const v of ['2', '26', '260']) { sett.value = v; fire(sett, 'input'); }
  check('typing in the sett keeps the pattern', snap() === before && generationID === id);
  check('typing in the sett shows no message and no alert', msg() === '' && alerts.length === 0, alerts.length);

  // Committing a valid value regenerates and is undoable, restoring the old value too
  sett.value = 200;
  const depth = historyStack.length;
  fire(sett, 'change');
  check('committing a setting regenerates', generationID !== id);
  check('committing a setting adds a history entry', historyStack.length === depth + 1);
  $('btn-undo').click();
  check('undo brings the pattern back', snap() === before && generationID === id);
  check('undo restores the setting too', sett.value === '260', sett.value);

  // Min width is watched like the others
  id = generationID;
  $('in-minwidth').value = 6; fire($('in-minwidth'), 'change');
  check('min width regenerates on commit', generationID !== id);
  setDefaults(); handleGenerateClick();

  // Invalid value: inline error, nothing changes
  before = snap(); id = generationID;
  const palette = JSON.stringify(userPalette), histDepth = historyStack.length;
  sett.value = 2; fire(sett, 'change');
  check('invalid setting shows an inline error', domElements.appMessage.classList.contains('error') && msg().length > 0, msg().slice(0, 40));
  check('invalid setting uses no alert', alerts.length === 0);
  check('invalid setting keeps pattern and palette', snap() === before && JSON.stringify(userPalette) === palette && generationID === id);
  check('invalid setting adds no history', historyStack.length === histDepth);

  // Generate button with invalid settings used to change the palette only
  $('lock-colors').checked = false;
  $('btn-generate').click();
  check('generate refused: palette stays in sync', JSON.stringify(userPalette) === palette && snap() === before && historyStack.length === histDepth);
  check('message translates live', (() => { const fr = msg(); setLanguage('en'); const en = msg(); setLanguage('fr'); return fr !== en && en.startsWith('Generation impossible'); })());

  // Fixing the value clears the error
  sett.value = 260; fire(sett, 'change');
  check('valid value clears the error', msg() === '');

  // Check mode keeps both bounds: one width for all stripes, drawn between them
  id = generationID;
  $('check-mode-check').checked = true; $('in-minwidth').value = 4; $('in-maxwidth').value = 64;
  $('btn-generate').click();
  check('check mode leaves the bounds alone', $('in-minwidth').value === '4' && $('in-maxwidth').value === '64' && msg() === '' && alerts.length === 0, msg().slice(0, 30));
  check('check mode still generates equal stripes', generationID !== id && new Set(tartanStripes.map(s => s.count)).size === 1);
  const widths = new Set(); for (let i = 0; i < 12; i++) { handleGenerateClick(); widths.add(tartanStripes[0].count); }
  check('check mode width varies, not stuck on the minimum', widths.size > 1 && [...widths].every(w => w >= 4 && w <= 64), [...widths].join());
  setDefaults(); handleGenerateClick();
  check('equal bounds do not tick Damier by themselves', ($('in-minwidth').value = 8, $('in-maxwidth').value = 8, handleGenerateClick(), !$('check-mode-check').checked) && new Set(tartanStripes.map(s => s.count)).size === 1);
  setDefaults(); handleGenerateClick();
  // The bound moved pushes the other one
  $('in-minwidth').value = 80; fire($('in-minwidth'), 'change');
  check('min above max raises max', $('in-minwidth').value === '80' && $('in-maxwidth').value === '80', $('in-minwidth').value + '/' + $('in-maxwidth').value);
  $('in-maxwidth').value = 30; fire($('in-maxwidth'), 'change');
  check('max under min lowers min', $('in-minwidth').value === '30' && $('in-maxwidth').value === '30', $('in-minwidth').value + '/' + $('in-maxwidth').value);
  $('in-minwidth').value = ''; fire($('in-minwidth'), 'change');
  check('an empty field keeps its value, not 2', $('in-minwidth').value === '30', $('in-minwidth').value);
  $('in-minwidth').value = 7; fire($('in-minwidth'), 'change');
  check('odd goes to the next even', $('in-minwidth').value === '8' && $('in-maxwidth').value === '30');
  $('in-maxwidth').value = 500; fire($('in-maxwidth'), 'change');
  check('max capped at 124', $('in-maxwidth').value === '124');
  check('stripes within the bounds', tartanStripes.every(s => s.count >= 8 || s === tartanStripes[tartanStripes.length - 1]));
  setDefaults(); handleGenerateClick();

  // Locked structure ignores settings
  $('lock-structure').checked = true;
  before = snap(); id = generationID;
  $('in-stripes').value = 3; fire($('in-stripes'), 'change');
  check('locked structure ignores a settings change', snap() === before && generationID === id);
  $('lock-structure').checked = false; setDefaults();

  // Add a color: one stripe changes, undoable
  document.getElementById('import-text').value = 'R/32 K4 G32 W4 B32 K/4';
  importSRT();
  setDefaults();
  const base = tartanStripes.map(s => s.hex);
  const undoDepth = historyStack.length;
  const newIdx = SRT_PALETTE.findIndex(c => c.code === 'Y');
  addToPalette(newIdx);
  const changed = tartanStripes.filter((s, i) => s.hex !== base[i]).length;
  check('adding a color changes exactly one stripe', changed === 1, changed);
  check('new color is visible in the pattern', tartanStripes.some(s => s.hex === SRT_PALETTE[newIdx].hex));
  check('adding a color is undoable', historyStack.length === undoDepth + 1);
  undo();
  check('undo removes the added color', tartanStripes.map(s => s.hex).join() === base.join() && !userPalette.some(c => c.hex === SRT_PALETTE[newIdx].hex));

  // Duplicate and max: inline
  addToPalette(SRT_PALETTE.findIndex(c => c.hex === userPalette[0].hex));
  check('duplicate color shows an inline error', msg().length > 0 && alerts.length === 0);
  handleGenerateClick(true);

  // Remove a color: no identical neighbors, undoable
  document.getElementById('import-text').value = 'R/32 K4 G32 W4 B32 K/4';
  importSRT();
  setDefaults();
  const pal = JSON.stringify(userPalette), st = snap();
  removeFromPalette(userPalette.findIndex(c => c.code === 'K'));
  check('removing a color leaves no identical neighbors', !adjacentDup(), tartanStripes.map(s => s.code).join(' '));
  check('removed color is gone', !tartanStripes.some(s => s.code === 'K'));
  undo();
  check('undo restores a removed color', JSON.stringify(userPalette) === pal && snap() === st);

  // Modify a color: undoable
  const m0 = snap();
  modifyPalette(0, SRT_PALETTE.findIndex(c => c.code === 'P'));
  check('modifying a color changes the pattern', snap() !== m0);
  undo();
  check('undo restores a modified color', snap() === m0);

  // Minimum palette: translated inline message
  document.getElementById('import-text').value = '...R20 G20...';
  importSRT();
  setLanguage('en');
  removeFromPalette(0);
  check('minimum palette message is inline and translated', msg().startsWith('Palette must have') && alerts.length === 0, msg());
  setLanguage('fr');
  $('check-sym').checked = true; updateSymmetry();
  setDefaults(); handleGenerateClick();

  // History strip: 50 max, most recent first, thumbnails drawn
  for (let i = 0; i < 54; i++) handleGenerateClick();
  const thumbs = () => [...domElements.historyList.querySelectorAll('.history-thumb')];
  check('history holds 50 patterns at most', historyStack.length === 50 && thumbs().length === 50, thumbs().length);
  check('the saved state keeps 50 too', JSON.parse(localStorage.getItem(Object.keys(localStorage).find(k => (localStorage.getItem(k) || '').includes('"history"')))).history.length === 50);
  const cv = thumbs()[0].querySelector('canvas');
  const px = cv.getContext('2d').getImageData(0, 0, cv.width, cv.height).data;
  const colors = new Set(); for (let i = 0; i < px.length; i += 4) colors.add(px[i] + ',' + px[i + 1] + ',' + px[i + 2]);
  check('thumbnail is opaque and shows several colors', px[3] === 255 && colors.size >= 2, colors.size);
  check('thumbnail is labelled', thumbs()[0].getAttribute('aria-label').includes('/'), thumbs()[0].getAttribute('aria-label').slice(0, 40));
  check('most recent pattern comes first', thumbs()[0].getAttribute('aria-label').includes(buildSRTCode(historyStack[49].stripes, true)));

  // Click a thumbnail: pattern restored, current one kept
  const current = snap(), target = JSON.stringify(historyStack[45].stripes), targetId = historyStack[45].generationID;
  const curId = generationID;
  thumbs()[4].click();
  check('clicking a thumbnail restores that pattern', snap() === target && generationID === targetId);
  check('the previous current pattern stays in history', historyStack.length === 50 && historyStack.some(h => JSON.stringify(h.stripes) === current && h.generationID === curId));
  check('SRT and display follow the restored pattern', domElements.importText.value === buildSRTCode(tartanStripes, domElements.sym.checked));
  $('btn-undo').click();
  check('undo after a restore returns to the previous pattern', snap() === current);

  // Keyboard: the thumbnail is a real button, space does not generate
  id = generationID;
  thumbs()[0].dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true }));
  check('space on a thumbnail does not generate', generationID === id);

  // Persistence: history survives a reload of state
  saveState();
  const savedDepth = historyStack.length, savedSnap = snap();
  historyStack = []; updateUndoButton();
  check('empty history shows a hint', domElements.historyList.textContent.length > 0 && thumbs().length === 0);
  loadState();
  check('history is restored after a reload', historyStack.length === savedDepth && thumbs().length === savedDepth && snap() === savedSnap);
  check('undo button is enabled after a reload', !$('btn-undo').disabled);
  localStorage.setItem('tartanGeneratorState', JSON.stringify({ ...JSON.parse(localStorage.getItem('tartanGeneratorState')), history: 'broken' }));
  check('corrupt history is ignored', loadState() === true && historyStack.length === 0);
  // A state saved before this version has no history or thread type
  const oldState = JSON.parse(localStorage.getItem('tartanGeneratorState')); delete oldState.history; delete oldState.threadType;
  localStorage.setItem('tartanGeneratorState', JSON.stringify(oldState));
  check('state from the previous version still loads', loadState() === true && historyStack.length === 0);

  // Thread type persists
  const select = $('thread-type');
  select.value = '12'; fire(select, 'change');
  check('preset sets the density', $('in-threadmm').value === '0.833' && $('in-density').value === '12', $('in-threadmm').value + ' / ' + $('in-density').value);
  check('preset is saved', JSON.parse(localStorage.getItem('tartanGeneratorState')).threadType === '12');
  select.value = 'custom'; applyThreadTypeUI();
  loadState();
  check('preset is restored', select.value === '12' && $('in-threadmm').value === '0.833', select.value);
  select.value = 'custom'; fire(select, 'change');
  check('custom keeps the density', $('in-density').value === '12' && !$('in-density').disabled);

  // Import is undoable with its previous settings and symmetry
  setDefaults(); $('check-sym').checked = true; updateSymmetry(); handleGenerateClick();
  const preImport = snap();
  document.getElementById('import-text').value = '...R20 G20...';
  importSRT();
  check('import applies asymmetry', !$('check-sym').checked);
  undo();
  check('undo of an import restores pattern, symmetry and settings', snap() === preImport && $('check-sym').checked && $('in-maxwidth').value === '64', $('in-maxwidth').value);

  // Patchwork stays parked
  check("patchwork board present", typeof exportPatchworkPNG === "function" && !$("btn-generate-patchwork").disabled);
  check('no alert during the whole run', alerts.length === 0, JSON.stringify(alerts));

  // Leave a visible state for the screenshot
  for (let i = 0; i < 7; i++) handleGenerateClick();
  sett.value = 2; fire(sett, 'change');

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
