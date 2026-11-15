// Phase 7: product views for the weaver.
window.alerts = [];
window.alert = m => window.alerts.push(m);
const results = [];
const check = (n, ok, d) => results.push((ok ? 'PASS ' : 'FAIL ') + n + (d !== undefined ? ' -> ' + d : ''));
window.addEventListener('error', e => results.push('FAIL pageError ' + e.message));
const $ = id => document.getElementById(id);
const fire = (el, type) => el.dispatchEvent(new Event(type, { bubbles: true }));
const viewBtn = v => document.querySelector('.view-btn[data-view="' + v + '"]');
const flat = s => s.replace(/[\s  ]+/g, ' ').trim();
const fact = term => { const dt = [...$('piece-facts').querySelectorAll('dt')].find(d => d.textContent === term); return dt ? flat(dt.nextElementSibling.textContent) : null; };
const foot = () => [...$('piece-yarn').tFoot.rows[0].cells].map(c => flat(c.textContent));
const toRgba = s => { const m = s.match(/[\d.]+/g).map(Number); return { r: m[0], g: m[1], b: m[2], a: m.length > 3 ? m[3] : 1 }; };
const lumOf = c => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b); };
function backdropOf(el) {
  const layers = [];
  for (let e = el; e; e = e.parentElement) { const c = toRgba(getComputedStyle(e).backgroundColor); if (c.a > 0) { layers.push(c); if (c.a >= 1) break; } }
  let out = { r: 0, g: 0, b: 0 };
  for (const c of layers.reverse()) out = { r: c.r * c.a + out.r * (1 - c.a), g: c.g * c.a + out.g * (1 - c.a), b: c.b * c.a + out.b * (1 - c.a) };
  return out;
}
function lowContrast(root) {
  const bad = [];
  for (const el of root.querySelectorAll('*')) {
    if (!el.getClientRects().length || el.closest('[hidden], .sr-only, canvas, .piece-chip')) continue;
    if (![...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())) continue;
    const st = getComputedStyle(el);
    const a = lumOf(toRgba(st.color)), b = lumOf(backdropOf(el)), ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
    if (ratio < 4.5) bad.push((el.id || el.className || el.tagName) + ' "' + el.textContent.trim().slice(0, 18) + '" ' + ratio.toFixed(2));
  }
  return bad;
}
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function run() {
  const vw = document.documentElement.clientWidth;
  check('viewport ' + vw, true);
  tartanStripes = [{ code: 'R', hex: '#C80000', count: 48 }, { code: 'B', hex: '#000064', count: 8 }, { code: 'K', hex: '#101010', count: 12 }];
  userPalette = paletteFromStripes(tartanStripes);
  $('check-sym').checked = true;
  $('thread-type').value = '9'; fire($('thread-type'), 'change');
  redrawTartan(); updateGeneratedListUI();

  check('views: cloth, scarf, yardage, sample; no kilt', [...document.querySelectorAll('.view-btn')].map(b => b.dataset.view).join() === 'cloth,scarf,yardage,sample' && !document.body.textContent.includes('Kilt'));
  viewBtn('scarf').click(); await sleep(50);
  check('scarf panel', isPreviewOpen() && $('piece-title').textContent === 'Écharpe' && $('piece-width').value === '30' && $('piece-length').value === '180' && !$('piece-fringe-row').hidden && $('piece-fringe').value === '10');
  check('size with fringes', fact('Dimensions') === '30 × 180 cm + franges de 10 cm aux deux bouts', fact('Dimensions'));
  check('270 ends at 9 per cm', fact('Chaîne') === '270 fils à 9,0 fils/cm', fact('Chaîne'));
  check('1 620 picks', fact('Trame') === '1 620 duites', fact('Trame'));
  check('repeats across', fact('Motifs dans la largeur') === '3,6 (un motif = 8,4 cm)', fact('Motifs dans la largeur'));
  check('centred: both selvedges alike', fact('Lisière gauche') === fact('Lisière droite') && /, 7 fils sur 48$/.test(fact('Lisière gauche')), fact('Lisière gauche') + ' | ' + fact('Lisière droite'));
  check('yarn: 540 m warp, 486 m weft, 1 026 m', foot().join('|') === 'Total|540|486|1 026 m', foot().join('|'));
  check('one row per colour', $('piece-yarn').tBodies[0].rows.length === 3);
  const sumRows = [...$('piece-yarn').tBodies[0].rows].reduce((s, r) => s + parseFloat(flat(r.cells[3].textContent).replace(/ /g, '').replace(',', '.')), 0);
  check('rows add up to the total', Math.abs(sumRows - 1026) < 2, sumRows);

  // Placement from the selvedge
  $('piece-place').value = 'edge'; fire($('piece-place'), 'change');
  check('from the selvedge: whole stripe left, cut right', /bande entière \(48 fils\)/.test(fact('Lisière gauche')) && /42 fils sur 48/.test(fact('Lisière droite')), fact('Lisière gauche') + ' | ' + fact('Lisière droite'));
  $('piece-place').value = 'centre'; fire($('piece-place'), 'change');

  // Fringes and size
  $('piece-fringe').value = '3'; fire($('piece-fringe'), 'change');
  check('3 cm fringes: less warp yarn', fact('Dimensions').endsWith('franges de 3 cm aux deux bouts') && foot()[1] === '502', foot().join('|'));
  $('piece-fringe').value = '0'; fire($('piece-fringe'), 'change');
  check('no fringes', fact('Dimensions') === '30 × 180 cm' && foot()[1] === '486');
  $('piece-fringe').value = '10'; fire($('piece-fringe'), 'change');
  $('piece-width').value = '40'; fire($('piece-width'), 'input');
  check('width 40 cm: 360 ends', fact('Chaîne').startsWith('360 fils'), fact('Chaîne'));
  $('piece-width').value = '2'; fire($('piece-width'), 'input');
  check('out of range ignored', fact('Chaîne').startsWith('360 fils'));
  $('piece-width').value = '30'; fire($('piece-width'), 'input'); fire($('piece-width'), 'change');

  // Density follows
  $('thread-type').value = '12'; fire($('thread-type'), 'change'); renderObjectPreview();
  check('12 per cm: 360 ends', fact('Chaîne') === '360 fils à 12,0 fils/cm', fact('Chaîne'));
  $('thread-type').value = '9'; fire($('thread-type'), 'change'); renderObjectPreview();

  // Magnifier
  const loupe = $('piece-loupe');
  const px = () => { const d = loupe.getContext('2d').getImageData(0, 0, loupe.width, loupe.height).data; const set = new Set(); for (let i = 0; i < d.length; i += 16) set.add(d[i] + ',' + d[i + 1] + ',' + d[i + 2]); return set.size; };
  check('magnifier drawn, at the middle', loupe.width > 0 && loupe.dataset.at === '135,810', loupe.dataset.at);
  const c = $('preview-canvas'), r = c.getBoundingClientRect(), d = c.width / r.width;
  const at = (fx, fy) => ({ clientX: r.left + (pieceLayout.x + pieceLayout.w * fx) / d, clientY: r.top + (pieceLayout.y + pieceLayout.h * fy) / d, bubbles: true });
  c.dispatchEvent(new PointerEvent('pointermove', at(0.1, 0.2)));
  const moved = loupe.dataset.at.split(',').map(Number);
  check('pointer moves the magnifier, threads of several colours', Math.abs(moved[0] - 27) <= 1 && Math.abs(moved[1] - 324) <= 2 && px() >= 3, loupe.dataset.at + ' colours ' + px());
  c.dispatchEvent(new PointerEvent('pointermove', { clientX: r.left + 2, clientY: r.top + 2, bubbles: true }));
  check('outside the piece: stays', loupe.dataset.at === moved.join(','));

  // Other products
  viewBtn('yardage').click(); await sleep(30);
  check('yardage 70 × 100, no fringes', $('piece-title').textContent === 'Métrage' && $('piece-fringe-row').hidden && fact('Dimensions') === '70 × 100 cm' && fact('Chaîne').startsWith('630 fils'), fact('Dimensions'));
  viewBtn('sample').click(); await sleep(30);
  check('sample 30 × 30', $('piece-title').textContent === 'Échantillon' && fact('Dimensions') === '30 × 30 cm');
  viewBtn('scarf').click(); await sleep(30);
  check('scarf keeps its fringes', $('piece-fringe').value === '10');

  // Layout and readability
  const panel = document.querySelector('.piece-panel').getBoundingClientRect(), box = $('canvas-container').getBoundingClientRect();
  check('panel inside the pattern area', panel.width > 0 && panel.left >= box.left - 1 && panel.right <= box.right + 1 && panel.bottom <= box.bottom + 1, JSON.stringify([panel.left, panel.right, panel.bottom, box.right, box.bottom]));
  const stage = document.querySelector('.preview-stage').getBoundingClientRect();
  check('piece still has room', stage.width > 120 && stage.height > 120, stage.width + 'x' + stage.height);
  const bad = lowContrast(document.querySelector('.preview-layout'));
  check('panel text at 4.5:1 or more', bad.length === 0, bad.join(' ; '));
  check('no horizontal overflow', document.documentElement.scrollWidth <= vw);

  setLanguage('en'); await sleep(30);
  check('English', $('piece-title').textContent === 'Scarf' && fact('Warp') === '270 ends at 9.0 per cm' && foot().join('|') === 'Total|540|486|1,026 m', fact('Warp') + ' ' + foot().join('|'));
  setLanguage('fr');
  viewBtn('cloth').click();
  check('back to the cloth', !isPreviewOpen());
  check('no alert', alerts.length === 0);
  const p = document.createElement('pre'); p.id = 'bench-out'; p.style.display = 'none'; p.textContent = results.join('\n'); document.body.appendChild(p);
}
(function wait(n) {
  if (window.drawingContext && tartanStripes.length) run().catch(e => { const p = document.createElement('pre'); p.id = 'bench-out'; p.textContent = results.join('\n') + '\nFAIL crash ' + e.stack; document.body.appendChild(p); });
  else if (n > 0) setTimeout(() => wait(n - 1), 50);
})(200);
