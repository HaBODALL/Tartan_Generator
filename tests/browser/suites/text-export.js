// Text export read back, through the real page.
window.alerts = [];
window.alert = m => window.alerts.push(m);
const results = [];
const check = (n, ok, d) => results.push((ok ? 'PASS ' : 'FAIL ') + n + (d !== undefined ? ' -> ' + d : ''));
window.addEventListener('error', e => results.push('FAIL pageError ' + e.message));
const $ = id => document.getElementById(id);
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function run() {
  // Capture a real export
  let blob = null;
  const realCreate = URL.createObjectURL;
  URL.createObjectURL = b => { blob = b; return realCreate.call(URL, b); };
  HTMLAnchorElement.prototype.click = function () {};

  tartanStripes = [{ code: 'R', hex: '#C80000', count: 48 }, { code: 'B', hex: '#000064', count: 8 }, { code: 'K', hex: '#101010', count: 12 }];
  userPalette = paletteFromStripes(tartanStripes);
  $('check-sym').checked = true;
  $('weave-s').checked = true; $('weave-z').checked = false;
  $('in-threadmm').value = '0.45';
  $('effect-relief').checked = true; $('relief-strength').value = 130;
  $('yarn-irregular').checked = true;
  updateGeneratedListUI();
  const id = generationID = 123456;
  exportTXT();
  const text = await blob.text();
  check('export has the rendering section', text.includes('RENDU:') && text.includes('- Sergé: S') && text.includes('- Relief: 130 %'), text.slice(-200));

  // Change everything, then read the file back through the file input
  tartanStripes = [{ code: 'W', hex: '#FFFFFF', count: 10 }, { code: 'G', hex: '#006400', count: 10 }];
  $('check-sym').checked = false; $('weave-z').checked = true; $('weave-s').checked = false;
  $('in-threadmm').value = '1'; $('effect-relief').checked = false; $('yarn-irregular').checked = false;
  generationID = 1;
  const before = historyStack.length;

  const dt = new DataTransfer();
  dt.items.add(new File([text], 'motif.txt', { type: 'text/plain' }));
  const input = $('import-file');
  input.files = dt.files;
  input.dispatchEvent(new Event('change'));
  await sleep(100);

  check('stripes restored with exact shades', tartanStripes.map(s => s.code + s.hex + s.count).join() === 'R#C8000048,B#0000648,K#10101012', JSON.stringify(tartanStripes));
  check('symmetry restored', $('check-sym').checked);
  check('twill restored', $('weave-s').checked && !$('weave-z').checked);
  check('thread size restored', $('in-threadmm').value === '0.45', $('in-threadmm').value);
  check('relief restored', $('effect-relief').checked && $('relief-strength').value === '130', $('relief-strength').value);
  check('strength row visible', !$('relief-strength').closest('.control-row').hidden);
  check('yarn restored', $('yarn-irregular').checked);
  check('id restored', generationID === id);
  check('palette restored', userPalette.length === 3);
  check('SRT shown', $('import-text').value === 'R/48 B8 K/12', $('import-text').value);
  check('previous pattern in the history', historyStack.length === before + 1);
  check('input cleared for the same file', input.value === '');
  undo();
  check('undo works', tartanStripes[0].code === 'W');

  // Bad files
  await importExportedFile(new File(['pas un export'], 'x.txt'));
  check('bad file leaves the pattern', tartanStripes[0].code === 'W');
  check('bad file is announced', $('app-message').textContent.includes('valide'), $('app-message').textContent);
  await importExportedFile(new File(['x'.repeat(1000001)], 'big.txt'));
  check('huge file refused', tartanStripes[0].code === 'W');

  // The file button opens the picker
  let opened = false;
  input.click = () => { opened = true; };
  $('btn-import-file').click();
  check('button opens the file picker', opened);
  check('input is not visible', getComputedStyle(input).display === 'none');

  setLanguage('en');
  check('English button', $('btn-import-file').textContent === 'A text file (.txt)');
  setLanguage('fr');
  check('no alert', alerts.length === 0);
  const p = document.createElement('pre'); p.id = 'bench-out'; p.style.display = 'none'; p.textContent = results.join('\n'); document.body.appendChild(p);
}
(function wait(n) {
  if (window.drawingContext && tartanStripes.length) run().catch(e => { const p = document.createElement('pre'); p.id = 'bench-out'; p.textContent = results.join('\n') + '\nFAIL crash ' + e.stack; document.body.appendChild(p); });
  else if (n > 0) setTimeout(() => wait(n - 1), 50);
})(200);
