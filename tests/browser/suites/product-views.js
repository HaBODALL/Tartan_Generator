// Product views: the pattern on objects, to scale. A caption, a magnifier under the pointer,
// three pattern sizes side by side. An idea of the result, not a workshop dashboard.
window.alerts = [];
window.alert = m => window.alerts.push(m);
const results = [];
const check = (n, ok, d) => results.push((ok ? 'PASS ' : 'FAIL ') + n + (d !== undefined ? ' -> ' + d : ''));
window.addEventListener('error', e => results.push('FAIL pageError ' + e.message));
const $ = id => document.getElementById(id);
const fire = (el, type) => el.dispatchEvent(new Event(type, { bubbles: true }));
const viewBtn = v => document.querySelector('.view-btn[data-view="' + v + '"]');
const flat = s => s.replace(/[\s  ]+/g, ' ').trim();
const sleep = ms => new Promise(r => setTimeout(r, ms));
const shown = el => el.getClientRects().length > 0;
const box = el => el.getBoundingClientRect();
const toRgba = s => { const m = s.match(/[\d.]+/g).map(Number); return { r: m[0], g: m[1], b: m[2], a: m.length > 3 ? m[3] : 1 }; };
const lumOf = c => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b); };
function backdropOf(el) {
  for (let e = el; e; e = e.parentElement) { const c = toRgba(getComputedStyle(e).backgroundColor); if (c.a >= 1) return c; }
  return { r: 0, g: 0, b: 0 };
}
const contrast = el => { const a = lumOf(toRgba(getComputedStyle(el).color)), b = lumOf(backdropOf(el)); return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05); };

async function run() {
  const vw = document.documentElement.clientWidth;
  check('viewport ' + vw, true);
  tartanStripes = [{ code: 'R', hex: '#C80000', count: 48 }, { code: 'B', hex: '#000064', count: 8 }, { code: 'K', hex: '#101010', count: 12 }];
  userPalette = paletteFromStripes(tartanStripes);
  $('check-sym').checked = true;
  $('thread-type').value = '9'; fire($('thread-type'), 'change');
  redrawTartan(); updateGeneratedListUI();
  const c = $('preview-canvas'), loupe = $('piece-loupe');
  const painted = () => { const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 3; i < d.length; i += 4) if (d[i]) n++; return n / (d.length / 4); };
  const at = (layout, fx, fy) => { const r = box(c), d = c.width / r.width; return { clientX: r.left + (layout.x + layout.w * fx) / d, clientY: r.top + (layout.y + layout.h * fy) / d, bubbles: true }; };

  // Objects
  check('views: cloth, scarf, plaid, cushion, kilt', [...document.querySelectorAll('.view-btn')].map(b => b.dataset.view).join() === 'cloth,scarf,plaid,cushion,kilt');
  check('no workshop panel in the view', !document.querySelector('.piece-panel') && !$('piece-yarn') && !$('btn-piece-sheet'));
  viewBtn('scarf').click(); await sleep(50);
  check('scarf: one object, drawn', isPreviewOpen() && pieceLayouts.length === 1 && painted() > 0.01, painted());
  check('caption: size, repeat, density', flat($('piece-caption').textContent).startsWith('Écharpe, 30 × 180 cm · un motif = 8,4 cm · 9,0 fils/cm'), flat($('piece-caption').textContent));
  check('caption readable', contrast($('piece-caption')) >= 4.5, contrast($('piece-caption')).toFixed(2));
  const stage = box(document.querySelector('.preview-stage')), sw = box(document.querySelector('.view-switch'));
  check('object below the view switch, inside the stage', stage.top >= sw.bottom && stage.height > 150, JSON.stringify([sw.bottom, stage.top, stage.height]));
  const one = pieceLayouts[0];
  check('to scale: 30 × 180', Math.abs(one.h / one.w - 6) < 0.1, (one.h / one.w).toFixed(2));
  check('centred in the stage', Math.abs((one.x + one.w / 2) - c.width / 2) <= 2);

  // Magnifier under the pointer
  check('magnifier hidden at rest', loupe.hidden);
  c.dispatchEvent(new PointerEvent('pointermove', at(one, 0.1, 0.2)));
  const colours = () => { const d = loupe.getContext('2d').getImageData(0, 0, loupe.width, loupe.height).data; const set = new Set(); for (let i = 0; i < d.length; i += 16) set.add(d[i] + ',' + d[i + 1] + ',' + d[i + 2]); return set.size; };
  check('magnifier shows the weave where the pointer is', !loupe.hidden && shown(loupe) && loupe.dataset.at === '27,324' && colours() >= 3, loupe.dataset.at + ' colours ' + colours());
  const lb = box(loupe);
  check('magnifier inside the stage, beside the pointer', lb.left >= stage.left - 1 && lb.right <= stage.right + 1 && lb.top >= stage.top - 1 && lb.bottom <= stage.bottom + 1, JSON.stringify([lb.left, lb.top, lb.right, lb.bottom]));
  c.dispatchEvent(new PointerEvent('pointermove', { clientX: box(c).left + 2, clientY: box(c).top + 2, bubbles: true }));
  check('off the object: magnifier hidden', loupe.hidden);
  c.dispatchEvent(new PointerEvent('pointermove', at(one, 0.5, 0.5)));
  c.dispatchEvent(new PointerEvent('pointerleave', { bubbles: true }));
  check('leaving the stage hides it', loupe.hidden);

  // Three pattern sizes
  const compare = $('btn-compare-scales');
  check('compare button; take buttons hidden', shown(compare) && compare.getAttribute('aria-pressed') === 'false' && !shown($('btn-scale-smaller')) && !shown($('btn-scale-larger')));
  compare.click(); await sleep(30);
  check('three sizes side by side', pieceLayouts.length === 3 && pieceLayouts.map(l => l.factor).join() === '0.5,1,2' && compare.getAttribute('aria-pressed') === 'true');
  check('same object size, no overlap, inside the canvas', pieceLayouts.every(l => l.w === pieceLayouts[0].w) && pieceLayouts[0].x + pieceLayouts[0].w < pieceLayouts[1].x && pieceLayouts[2].x + pieceLayouts[2].w <= c.width && pieceLayouts[0].x >= 0, JSON.stringify(pieceLayouts.map(l => [l.x, l.w])));
  check('stripes scaled on even counts', pieceLayouts[0].stripes.map(s => s.count).join() === '24,4,6' && pieceLayouts[2].stripes.map(s => s.count).join() === '96,16,24');
  c.dispatchEvent(new PointerEvent('pointermove', at(pieceLayouts[2], 0.5, 0.5)));
  check('magnifier follows the size under the pointer', !loupe.hidden && loupe.dataset.factor === '2');
  check('take buttons shown', shown($('btn-scale-smaller')) && shown($('btn-scale-larger')));
  const depth = historyStack.length;
  $('btn-scale-larger').click(); await sleep(30);
  check('taking the bolder one scales the pattern', tartanStripes.map(s => s.count).join() === '96,16,24' && historyStack.length === depth + 1 && isPreviewOpen());
  check('SRT code and caption follow', $('import-text').value.includes('96') && flat($('piece-caption').textContent).includes('un motif = 16,9 cm'), $('import-text').value + ' | ' + flat($('piece-caption').textContent));
  c.dispatchEvent(new MouseEvent('click', at(pieceLayouts[0], 0.5, 0.5)));
  await sleep(30);
  check('clicking the finer one takes it', tartanStripes.map(s => s.count).join() === '48,8,12' && historyStack.length === depth + 2);
  c.dispatchEvent(new MouseEvent('click', at(pieceLayouts[1], 0.5, 0.5)));
  check('clicking the current one changes nothing', tartanStripes.map(s => s.count).join() === '48,8,12' && historyStack.length === depth + 2);
  undo(); await sleep(30);
  check('undo goes back one size', tartanStripes.map(s => s.count).join() === '96,16,24');
  undo(); await sleep(30);
  compare.click(); await sleep(30);
  check('comparison off: one object again', pieceLayouts.length === 1 && !shown($('btn-scale-smaller')));
  c.dispatchEvent(new MouseEvent('click', at(pieceLayouts[0], 0.5, 0.5)));
  check('a click outside the comparison changes nothing', tartanStripes.map(s => s.count).join() === '48,8,12');

  // Other objects
  for (const [view, title, size, ratio] of [['plaid', 'Plaid', '130 × 170', 170 / 130], ['cushion', 'Coussin', '45 × 45', 1], ['kilt', 'Kilt', '60 × 60', 1]]) {
    viewBtn(view).click(); await sleep(40);
    const l = pieceLayouts[0];
    check(view + ': caption, scale, drawn', flat($('piece-caption').textContent).startsWith(title + ', ' + size + ' cm') && Math.abs(l.h / l.w - ratio) < 0.05 && painted() > 0.03, flat($('piece-caption').textContent) + ' ' + painted());
  }
  viewBtn('scarf').click(); await sleep(30);

  // Layout
  const bar = box(document.querySelector('.preview-bar')), area = box($('canvas-container'));
  check('caption bar inside the pattern area', bar.left >= area.left - 1 && bar.right <= area.right + 1 && bar.bottom <= area.bottom + 1, JSON.stringify([bar.left, bar.right, bar.bottom, area.right, area.bottom]));
  check('no horizontal overflow', document.documentElement.scrollWidth <= vw);

  setLanguage('en'); await sleep(30);
  check('English', flat($('piece-caption').textContent).startsWith('Scarf, 30 × 180 cm · one repeat = 8.4 cm · 9.0 threads/cm') && compare.textContent === 'Compare pattern sizes' && viewBtn('plaid').textContent === 'Throw', flat($('piece-caption').textContent));
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
