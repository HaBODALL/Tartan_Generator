// Proposals, gold and silver stars, intermediate rounds, through the real page.
window.alerts = [];
window.alert = m => window.alerts.push(m);
const results = [];
const check = (n, ok, d) => results.push((ok ? 'PASS ' : 'FAIL ') + n + (d !== undefined ? ' -> ' + d : ''));
window.addEventListener('error', e => results.push('FAIL pageError ' + e.message));
const $ = id => document.getElementById(id);
const fire = (el, type) => el.dispatchEvent(new Event(type, { bubbles: true }));
const key = k => document.body.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true }));
const named = l => l.map(([code, count]) => ({ code, hex: SRT_PALETTE.find(c => c.code === code).hex, count }));
const SETT = named([['R', 72], ['B', 8], ['K', 12], ['Y', 2], ['K', 12], ['W', 2], ['G', 24], ['K', 4]]);
const cells = () => [...document.querySelectorAll('.proposal-cell')];
const star = (i, s) => cells()[i].querySelector('.star-' + s);
const code = p => buildSRTCode(p.stripes, p.symmetric);

function makePhoto(w, h) {
  const threads = countSettThreads(SETT, true), colors = buildThreadColors(SETT, true, threads);
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const ctx = c.getContext('2d'), img = ctx.createImageData(w, h), px = new Uint32Array(img.data.buffer);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const tx = Math.floor(x / 2), ty = Math.floor(y / 2);
    px[y * w + x] = ((tx - [2, 1, 0, 3][ty & 3]) & 3) < 2 ? colors[ty % threads] : colors[tx % threads];
  }
  ctx.putImageData(img, 0, 0);
  return new Promise(res => c.toBlob(b => res(new File([b], 'photo.png', { type: 'image/png' })), 'image/png'));
}

async function run() {
  await openEstimateFromFile(await makePhoto(1000, 700));
  check('series of 10', cells().length === 10, cells().length);
  check('first selected', cells()[0].classList.contains('selected'));
  check('captions', cells()[0].querySelector('.proposal-caption').textContent === 'Lecture de base', cells()[0].querySelector('.proposal-caption').textContent);
  const tile = cells()[0].querySelector('canvas').getContext('2d').getImageData(0, 0, 50, 50).data;
  check('tiles drawn', tile[3] === 255);
  check('refine off without silver', $('btn-estimate-refine').disabled);
  check('back hidden in the first round', getComputedStyle($('btn-estimate-back')).display === 'none');

  // Selecting
  cells()[3].querySelector('.proposal-tile').click();
  check('tile selects', cells()[3].classList.contains('selected') && !cells()[0].classList.contains('selected'));
  check('code follows the selection', $('estimate-code').value === code(estimateState.proposals[3]));

  // Stars
  star(1, 'silver').click();
  check('silver set', cells()[1].classList.contains('silver') && star(1, 'silver').getAttribute('aria-pressed') === 'true');
  check('refine on with silver', !$('btn-estimate-refine').disabled);
  check('focus stays on the star', document.activeElement === star(1, 'silver'));
  star(1, 'gold').click();
  check('gold replaces silver on a tile', cells()[1].classList.contains('gold') && !cells()[1].classList.contains('silver'));
  check('apply names gold', $('btn-estimate-apply').textContent === "Utiliser le motif d'or", $('btn-estimate-apply').textContent);
  star(2, 'gold').click();
  check('one gold only', cells().filter(c => c.classList.contains('gold')).length === 1 && cells()[2].classList.contains('gold'));
  star(2, 'gold').click();
  check('gold can be removed', cells().filter(c => c.classList.contains('gold')).length === 0);
  check('apply label back', $('btn-estimate-apply').textContent === 'Utiliser ce motif');

  // Intermediate
  star(0, 'silver').click(); star(1, 'silver').click(); star(4, 'silver').click();
  const firstRound = estimateState.proposals.map(code).join('|');
  const sources = [0, 1, 4].map(i => estimateState.proposals[i]);
  $('btn-estimate-refine').click();
  check('next series', cells().length > 0 && cells().length <= 10, cells().length);
  check('intermediate first', cells()[0].querySelector('.proposal-caption').textContent === 'Intermédiaire', cells()[0].querySelector('.proposal-caption').textContent);
  check('stars start afresh', document.querySelectorAll('.proposal-cell.silver, .proposal-cell.gold').length === 0);
  check('status gives the round', $('estimate-status').textContent.includes('Tour 2'), $('estimate-status').textContent);
  check('silver choices kept', estimateState.proposals.some(p => p.caption[0] === 'kept') || sources.some(s => estimateState.proposals.some(p => code(p) === code(s))));
  check('back shown', getComputedStyle($('btn-estimate-back')).display !== 'none');

  // Thread total keeps the choices
  star(1, 'silver').click();
  $('estimate-threads').value = 400; fire($('estimate-threads'), 'change');
  check('rescale keeps stars', cells()[1].classList.contains('silver'));
  check('rescale changes the counts', Math.abs(countSettThreads(estimateState.proposals[0].stripes, estimateState.proposals[0].symmetric) - 400) <= 20, countSettThreads(estimateState.proposals[0].stripes, estimateState.proposals[0].symmetric));
  $('estimate-threads').value = 240; fire($('estimate-threads'), 'change');

  // Third round, then back twice
  $('btn-estimate-refine').click();
  check('third round', $('estimate-status').textContent.includes('Tour 3'));
  $('btn-estimate-back').click();
  check('back one round', $('estimate-status').textContent.includes('Tour 2') && cells()[1].classList.contains('silver'));
  $('btn-estimate-back').click();
  check('back to the first series', estimateState.rounds.length === 0 && cells()[0].classList.contains('silver') && cells().length === 10);

  // Applying the gold, whichever tile is selected
  star(5, 'gold').click();
  const gold = estimateState.proposals[5];
  cells()[7].querySelector('.proposal-tile').click();
  check('selection does not move the gold', estimateState.selected === 7 && goldProposal() === gold);
  const before = historyStack.length;
  $('btn-estimate-apply').click();
  check('gold applied', !isEstimateOpen() && code({ stripes: tartanStripes, symmetric: $('check-sym').checked }) === code(gold));
  check('gold message', $('app-message').textContent.includes('confirmé'), $('app-message').textContent);
  check('history', historyStack.length === before + 1);

  // Without gold, the selected tile is applied
  await openEstimateFromFile(await makePhoto(1000, 700));
  cells()[2].querySelector('.proposal-tile').click();
  const selected = estimateState.proposals[2];
  $('btn-estimate-apply').click();
  check('selected applied', code({ stripes: tartanStripes, symmetric: $('check-sym').checked }) === code(selected));

  // Tolerance starts over
  await openEstimateFromFile(await makePhoto(1000, 700));
  star(0, 'silver').click();
  $('btn-estimate-refine').click();
  $('estimate-tolerance').value = 20; fire($('estimate-tolerance'), 'change');
  check('tolerance starts a new series', estimateState.rounds.length === 0 && document.querySelectorAll('.proposal-cell.silver').length === 0);

  setLanguage('en');
  check('English captions', cells()[0].querySelector('.proposal-caption').textContent === 'Base reading');
  check('English status', $('estimate-status').textContent.length > 0 && !$('estimate-status').textContent.includes('Répétition'));
  setLanguage('fr');
  key('Escape');
  check('Escape closes', !isEstimateOpen());
  check('no alert', alerts.length === 0);
  const p = document.createElement('pre'); p.id = 'bench-out'; p.style.display = 'none'; p.textContent = results.join('\n'); document.body.appendChild(p);
}
(function wait(n) {
  if (window.drawingContext && tartanStripes.length) run().catch(e => { const p = document.createElement('pre'); p.id = 'bench-out'; p.textContent = results.join('\n') + '\nFAIL crash ' + e.stack; document.body.appendChild(p); });
  else if (n > 0) setTimeout(() => wait(n - 1), 50);
})(200);
