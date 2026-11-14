// Phase 5: menus by intent, the image window opening the right way, a history of 50.
window.alerts = [];
window.alert = m => window.alerts.push(m);
const results = [];
const check = (n, ok, d) => results.push((ok ? 'PASS ' : 'FAIL ') + n + (d !== undefined ? ' -> ' + d : ''));
window.addEventListener('error', e => results.push('FAIL pageError ' + e.message));
const $ = id => document.getElementById(id);
const ids = list => [...$(list).querySelectorAll('.menu-item')].map(i => i.id).join();
const toFile = c => new Promise(res => c.toBlob(b => res(new File([b], 'image.png', { type: 'image/png' })), 'image/png'));
function picture() {
  const c = document.createElement('canvas'); c.width = 600; c.height = 400;
  const g = c.getContext('2d');
  g.fillStyle = '#2060c0'; g.fillRect(0, 0, 600, 200); g.fillStyle = '#206030'; g.fillRect(0, 200, 600, 200);
  g.fillStyle = '#e03020'; g.beginPath(); g.arc(400, 120, 60, 0, 7); g.fill();
  return c;
}
// Picks a menu item that opens the file chooser, then hands it a file
async function choose(menuButton, item, file) {
  const input = $('import-photo');
  input.click = () => {}; // no file dialog in a test
  menuButton.click(); item.focus(); item.click();
  const dt = new DataTransfer(); dt.items.add(file); input.files = dt.files;
  const real = window.openEstimateFromFile; let opening = null;
  window.openEstimateFromFile = (f, m) => (opening = real(f, m));
  input.dispatchEvent(new Event('change'));
  await opening;
  window.openEstimateFromFile = real;
}

async function run() {
  const vw = document.documentElement.clientWidth;
  check('viewport ' + vw, true);
  check('Générer arrow: from an image; random is Générer itself', ids('menu-new') === 'menu-new-image' && $('btn-generate').textContent.trim() === 'Générer', ids('menu-new'));
  check('Importer: SRT, known tartan, tartan photo, text file', ids('menu-import') === 'menu-new-srt,menu-new-example,btn-import-photo,btn-import-file', ids('menu-import'));
  check('Enregistrer / partager starts with the link', ids('menu-export').split(',').filter(id => !['btn-patchwork-png', 'btn-generate-patchwork-zip'].includes(id))[0] === 'btn-share-link');
  check('no separate link button in the bar', !!$('btn-share-link').closest('#menu-export') && !document.querySelector('.header-btn'));
  for (const id of ['btn-menu-import', 'btn-menu-export']) {
    const r = $(id).getBoundingClientRect();
    check(id + ' in the bar, one line', r.right <= vw && r.left >= 0 && r.height < 40 && r.bottom <= 50, JSON.stringify([r.left, r.right, r.height]));
  }
  const labels = ['btn-menu-new', 'btn-menu-import', 'btn-menu-export'].map(id => $(id).innerText.replace(/\s+/g, ' ').trim());
  if (vw > 1180) check('long labels on wide screens', labels[1].startsWith('Importer') && labels[2].startsWith('Enregistrer / partager'), labels.join(' | '));
  else check('short labels', labels[2].startsWith('Enregistrer') && !labels[2].includes('partager'), labels.join(' | '));
  { const a = $('btn-generate').getBoundingClientRect(), b = $('btn-menu-new').getBoundingClientRect(), u = $('btn-undo').getBoundingClientRect();
    check('Générer, its arrow and Annuler side by side', a.width > 0 && b.left >= a.right - 1 && u.left >= b.right - 1 && Math.abs(a.top - u.top) < 12 && u.right <= vw, JSON.stringify([a.left, a.right, b.left, u.left, u.right])); }
  check('one main action only', document.querySelectorAll('.btn-generate').length === 2 && [...document.querySelectorAll('.btn-generate')].filter(b => b.getClientRects().length).length === 1);
  check('no horizontal overflow', document.documentElement.scrollWidth <= vw);
  for (const [btn, list] of [['btn-menu-new', 'menu-new'], ['btn-menu-import', 'menu-import'], ['btn-menu-export', 'menu-export']]) {
    $(btn).click();
    const covered = [...$(list).querySelectorAll('.menu-item')].filter(i => i.getClientRects().length).filter(i => { const r = i.getBoundingClientRect(); const hit = document.elementFromPoint(r.left + 12, r.top + r.height / 2); return !hit || !i.contains(hit); }).map(i => i.id);
    check(list + ': every choice on top and clickable', covered.length === 0, covered.join());
    closeMenus();
  }

  // The image window opens the way the menu said
  $('in-sett').value = 260;
  await choose($('btn-menu-new'), $('menu-new-image'), await toFile(picture()));
  check('Nouveau motif > image: invent mode', isEstimateOpen() && $('estimate-mode-invent').checked && document.querySelectorAll('.proposal-cell').length > 0, $('estimate-status').textContent);
  $('btn-estimate-cancel').click();
  check('focus back on Nouveau motif', document.activeElement === $('btn-menu-new'), document.activeElement && document.activeElement.id);
  await choose($('btn-menu-import'), $('btn-import-photo'), await toFile(picture()));
  check('Importer > photo: reading mode', isEstimateOpen() && $('estimate-mode-read').checked);
  $('btn-estimate-cancel').click();
  check('focus back on Importer', document.activeElement === $('btn-menu-import'), document.activeElement && document.activeElement.id);

  // From the Planche, Importer goes back to the Atelier
  generatePatchwork();
  check('Planche open', isPatchworkOpen());
  $('btn-menu-import').click(); $('menu-new-srt').click();
  check('Importer > code SRT leaves the Planche for the bar', !isPatchworkOpen() && document.activeElement === $('import-text'));

  // History of 50
  for (let i = 0; i < 55; i++) handleGenerateClick();
  const thumbs = document.querySelectorAll('#history-list .history-thumb');
  check('50 patterns kept', historyStack.length === 50 && thumbs.length === 50, historyStack.length + ' / ' + thumbs.length);
  const list = $('history-list');
  check('the strip scrolls sideways, the page does not', list.scrollWidth > list.clientWidth && document.documentElement.scrollWidth <= vw);
  check('strip height unchanged', Math.round(document.querySelector('.history-strip').getBoundingClientRect().height) === (vw <= 768 ? 48 : 58), document.querySelector('.history-strip').getBoundingClientRect().height);
  const before = historyStack.length; undo();
  check('undo goes back step by step', historyStack.length === before - 1);

  setLanguage('en');
  const en = ['btn-menu-new', 'btn-menu-import', 'btn-menu-export'].map(id => $(id).innerText.replace(/\s+/g, ' ').trim());
  check('English', $('btn-generate').textContent.trim() === 'Generate' && en[1].startsWith('Import') && en[2].startsWith('Save') && $('btn-share-link').textContent.includes('Copy the link') && $('menu-new-example').textContent === 'A known tartan (examples)', en.join(' | '));
  check('English fits', document.documentElement.scrollWidth <= vw && $('btn-menu-export').getBoundingClientRect().right <= vw);
  setLanguage('fr');
  check('no alert', alerts.length === 0);
  const p = document.createElement('pre'); p.id = 'bench-out'; p.style.display = 'none'; p.textContent = results.join('\n'); document.body.appendChild(p);
}
(function wait(n) {
  if (window.drawingContext && tartanStripes.length) run().catch(e => { const p = document.createElement('pre'); p.id = 'bench-out'; p.textContent = results.join('\n') + '\nFAIL crash ' + e.stack; document.body.appendChild(p); });
  else if (n > 0) setTimeout(() => wait(n - 1), 50);
})(200);
