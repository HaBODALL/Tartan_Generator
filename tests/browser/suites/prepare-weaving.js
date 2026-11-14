// Phase 8: "Préparer le tissage", the weaving sheet built from the chosen piece.
window.alerts = [];
window.alert = m => window.alerts.push(m);
const results = [];
const check = (n, ok, d) => results.push((ok ? 'PASS ' : 'FAIL ') + n + (d !== undefined ? ' -> ' + d : ''));
window.addEventListener('error', e => results.push('FAIL pageError ' + e.message));
const $ = id => document.getElementById(id);
const fire = (el, type) => el.dispatchEvent(new Event(type, { bubbles: true }));
const flat = s => s.replace(/[\s  ]+/g, ' ').trim();
const sleep = ms => new Promise(r => setTimeout(r, ms));
const plan = () => [...document.querySelectorAll('.sheet-plan tbody tr')].map(r => [flat(r.cells[1].textContent), +r.cells[2].textContent, flat(r.cells[3].textContent)]);
const yarnFoot = () => [...document.querySelector('.sheet-yarn tfoot tr').cells].map(c => flat(c.textContent));
const fact = term => { const dt = [...document.querySelectorAll('.sheet-piece-facts dt')].find(d => d.textContent === term); return dt ? flat(dt.nextElementSibling.textContent) : null; };
const set = (id, v, type = 'input') => { $(id).value = v; fire($(id), type); };

async function run() {
  const vw = document.documentElement.clientWidth;
  check('viewport ' + vw, true);
  localStorage.removeItem('tartanWeavingPrefs');
  tartanStripes = [{ code: 'R', hex: '#C80000', count: 48 }, { code: 'B', hex: '#000064', count: 8 }, { code: 'K', hex: '#101010', count: 12 }];
  userPalette = paletteFromStripes(tartanStripes);
  $('check-sym').checked = true;
  set('thread-type', '9', 'change');
  redrawTartan(); updateGeneratedListUI();

  // From the scarf view
  document.querySelector('.view-btn[data-view="scarf"]').click(); await sleep(30);
  check('the sheet is not pushed in the product view', !$('btn-piece-sheet'));
  openWeavingSheet();
  check('sheet opens on the scarf', !$('sheet-modal').hidden && $('sheet-piece').value === 'scarf' && $('sheet-width').value === '30' && $('sheet-length').value === '180' && $('sheet-fringe').value === '10');
  check('warp length per end', fact('Longueur de chaîne') === '200 cm par fil, franges et perte comprises', fact('Longueur de chaîne'));

  // Warping plan, selvedge to selvedge
  let p = plan();
  check('plan starts and ends on the cut red stripe', p[0][1] === 7 && p[p.length - 1][1] === 7 && p[0][0] === p[p.length - 1][0], JSON.stringify([p[0], p[p.length - 1]]));
  check('plan adds up to 270 ends', p.reduce((s, r) => s + r[1], 0) === 270 && p[p.length - 1][2] === '270');
  check('neighbours differ', p.every((r, i) => i === 0 || r[0] !== p[i - 1][0]));
  check('weft line', flat($('sheet-body').textContent).includes('1 620 duites, soit 21,3 motifs. Commencer par Dark Blue 6 (DB), 6 duites.'), (flat($('sheet-body').textContent).match(/Même ordre.{0,120}/) || [''])[0]);

  // Yarn, then the weaver's own loss and margin
  check('yarn without loss or margin', yarnFoot().slice(0, 4).join('|') === 'Total|540|486|1 026 m', yarnFoot().join('|'));
  check('note asks for loss and margin', $('sheet-body').textContent.includes('Ajoutez la perte au métier'));
  set('sheet-loss', '50');
  check('50 cm loss per end: 675 m of warp', yarnFoot()[1] === '675' && fact('Longueur de chaîne').startsWith('250 cm'), yarnFoot().join('|'));
  set('sheet-margin', '10');
  check('10 % margin', yarnFoot()[3] === '1 277 m', yarnFoot().join('|'));
  check('note states them', $('sheet-body').textContent.includes('avec 50 cm de perte par fil de chaîne et 10 % de marge'));

  // Weight from metres per kilo
  const kg = [...document.querySelectorAll('.sheet-perkg')];
  check('one m/kg field per colour, empty', kg.length === 3 && kg.every(k => k.value === ''));
  kg[0].value = '2000'; fire(kg[0], 'input');
  const grams = () => [...document.querySelectorAll('.sheet-yarn tbody tr')].map(r => flat(r.cells[5].textContent));
  check('grams for that colour only', /^\d+ g$/.test(grams()[0]) && grams()[1] === '—' && yarnFoot()[5] === '—', grams().join('|') + ' / ' + yarnFoot()[5]);
  kg.slice(1).forEach(k => { k.value = '2000'; fire(k, 'input'); });
  check('total weight once every yarn has one', yarnFoot()[5] === '639 g', yarnFoot()[5]);

  // Kept for next time
  $('btn-sheet-close').click();
  openWeavingSheet();
  check('loss, margin and m/kg kept', $('sheet-loss').value === '50' && $('sheet-margin').value === '10' && [...document.querySelectorAll('.sheet-perkg')].every(k => k.value === '2000'));
  set('sheet-loss', '0'); set('sheet-margin', '0');

  // Placement and size
  set('sheet-place', 'edge', 'change');
  p = plan();
  check('from the selvedge: whole red stripe first', p[0][1] === 48 && p[p.length - 1][1] === 42, JSON.stringify([p[0], p[p.length - 1]]));
  set('sheet-place', 'centre', 'change');
  set('sheet-width', '40');
  check('width 40: 360 ends, the view follows', plan().slice(-1)[0][2] === '360' && OBJECT_VIEWS.scarf.w === 40 && pieceLayouts.length === 1);
  set('sheet-width', '30');

  // Other pieces
  check('only woven pieces on the sheet', [...$('sheet-piece').options].map(o => o.value).join() === 'scarf,plaid');
  set('sheet-piece', 'plaid', 'change');
  check('plaid: 130 cm wide, 3 cm fringes', $('sheet-width').value === '130' && $('sheet-fringe').value === '3' && plan().slice(-1)[0][2] === '1 170' && fact('Longueur de chaîne').startsWith('176 cm'), $('sheet-width').value + ' ' + plan().slice(-1)[0][2] + ' ' + fact('Longueur de chaîne'));
  check('the product view keeps its own object', document.querySelector('.view-btn[aria-pressed="true"]').dataset.view === 'scarf');
  set('sheet-piece', 'scarf', 'change');

  // From the menu too, and in English
  $('btn-sheet-close').click();
  $('btn-menu-export').click();
  check('menu entry renamed', $('btn-weaving-sheet').textContent === 'Préparer le tissage (fiche à imprimer)');
  closeMenus();
  setLanguage('en');
  openWeavingSheet();
  check('English', $('sheet-body').textContent.includes('Warping plan') && $('sheet-body').textContent.includes('Loom waste (cm per warp end)'));
  $('btn-sheet-close').click();
  setLanguage('fr');
  check('sheet fits the screen', $('sheet-modal').hidden && document.documentElement.scrollWidth <= vw);
  localStorage.removeItem('tartanWeavingPrefs');
  document.querySelector('.view-btn[data-view="cloth"]').click();
  check('no alert', alerts.length === 0);
  const out = document.createElement('pre'); out.id = 'bench-out'; out.style.display = 'none'; out.textContent = results.join('\n'); document.body.appendChild(out);
}
(function wait(n) {
  if (window.drawingContext && tartanStripes.length) run().catch(e => { const p = document.createElement('pre'); p.id = 'bench-out'; p.textContent = results.join('\n') + '\nFAIL crash ' + e.stack; document.body.appendChild(p); });
  else if (n > 0) setTimeout(() => wait(n - 1), 50);
})(200);
