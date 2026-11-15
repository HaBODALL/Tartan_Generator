// Weaving sheet, through the real page.
window.alerts = [];
window.alert = m => window.alerts.push(m);
const results = [];
const check = (n, ok, d) => results.push((ok ? 'PASS ' : 'FAIL ') + n + (d !== undefined ? ' -> ' + d : ''));
window.addEventListener('error', e => results.push('FAIL pageError ' + e.message));
const $ = id => document.getElementById(id);
const key = (k) => document.body.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true }));
const body = () => $('sheet-body');

async function run() {
  tartanStripes = [{ code: 'R', hex: '#C80000', count: 48 }, { code: 'B', hex: '#000064', count: 8 }, { code: 'K', hex: '#101010', count: 12 }];
  userPalette = paletteFromStripes(tartanStripes);
  $('check-sym').checked = true;
  $('in-threadmm').value = '0.5';
  updateGeneratedListUI();
  check('closed at load', getComputedStyle($('sheet-modal')).display === 'none');

  const btn = $('btn-weaving-sheet');
  $('btn-menu-export').click();
  check('menu opens', !$('menu-export').hidden && $('btn-menu-export').getAttribute('aria-expanded') === 'true');
  btn.focus(); btn.click();
  check('menu closes after a choice', $('menu-export').hidden);
  check('opens', getComputedStyle($('sheet-modal')).display !== 'none');
  check('focus on print', document.activeElement === $('btn-sheet-print'));
  const text = body().textContent;
  check('title', body().querySelector('h2').textContent === 'Fiche de tissage');
  check('SRT', text.includes('R/48 B8 K/12'));
  check('thread count', text.includes('76'), text.slice(0, 200));
  check('width', text.includes('3,8 cm') && text.includes('20,0 fils/cm (0,50 mm par fil)'), text.slice(0, 300));
  check('order expands the mirror', body().querySelector('.sheet-order').textContent === 'R 48 · B 8 · K 12 · B 8');
  const rows = [...body().querySelectorAll('.sheet-yarn tbody tr')];
  check('one row per color', rows.length === 3);
  check('color row', rows[1].cells[0].textContent.includes('(DB)') && rows[1].cells[3].textContent.endsWith(' m'), rows[1].textContent);
  const c = body().querySelector('canvas').getContext('2d').getImageData(0, 0, 360, 360).data;
  let painted = 0; for (let i = 3; i < c.length; i += 4) if (c[i]) painted++;
  check('swatch drawn', painted > 100000, painted);
  check('band has one part per stripe', body().querySelectorAll('.sheet-band span').length === 4);
  check('band to scale', body().querySelectorAll('.sheet-band span')[0].style.flexGrow === '48');

  // Modal behaviour
  const id = generationID;
  key('g');
  check('shortcuts do nothing behind the sheet', generationID === id);
  let printed = 0;
  window.print = () => { printed++; };
  $('btn-sheet-print').click();
  check('print button', printed === 1);
  key('Escape');
  check('Escape closes', getComputedStyle($('sheet-modal')).display === 'none');
  check('focus goes back to the Export menu', document.activeElement === $('btn-menu-export'));
  btn.click();
  $('sheet-modal').click();
  check('click outside closes', getComputedStyle($('sheet-modal')).display === 'none');
  btn.click();
  body().click();
  check('click inside does not close', getComputedStyle($('sheet-modal')).display !== 'none');
  $('btn-sheet-close').click();
  check('close button', getComputedStyle($('sheet-modal')).display === 'none');

  // Hostile import text is shown as text
  tartanStripes = [{ code: '<img>', hex: '#C80000', count: 48 }, { code: 'K', hex: '#101010', count: 12 }];
  userPalette = paletteFromStripes(tartanStripes);
  btn.click();
  check('codes are text, not markup', !body().querySelector('img') && body().textContent.includes('<img>'));
  $('btn-sheet-close').click();
  tartanStripes = [{ code: 'R', hex: '#C80000', count: 48 }, { code: 'K', hex: '#101010', count: 12 }];
  userPalette = paletteFromStripes(tartanStripes);

  setLanguage('en');
  btn.click();
  check('English sheet', body().querySelector('h2').textContent === 'Weaving sheet' && body().textContent.includes('Warping plan'));
  $('btn-sheet-close').click();
  setLanguage('fr');
  check('no alert', alerts.length === 0);
  const p = document.createElement('pre'); p.id = 'bench-out'; p.style.display = 'none'; p.textContent = results.join('\n'); document.body.appendChild(p);
}
(function wait(n) {
  if (window.drawingContext && tartanStripes.length) run().catch(e => { const p = document.createElement('pre'); p.id = 'bench-out'; p.textContent = results.join('\n') + '\nFAIL crash ' + e.stack; document.body.appendChild(p); });
  else if (n > 0) setTimeout(() => wait(n - 1), 50);
})(200);
