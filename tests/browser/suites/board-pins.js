// Mood board pins and variants, through the real page.
window.alerts = [];
window.alert = m => window.alerts.push(m);
const results = [];
const check = (n, ok, d) => results.push((ok ? 'PASS ' : 'FAIL ') + n + (d !== undefined ? ' -> ' + d : ''));
window.addEventListener('error', e => results.push('FAIL pageError ' + e.message));
const $ = id => document.getElementById(id);
const cells = () => [...document.querySelectorAll('#patchwork-grid .patchwork-cell')];
const srt = e => buildSRTCode(e.stripes, e.symmetric);

async function run() {
  $('in-stripes').value = 6; $('in-minwidth').value = 4; $('in-maxwidth').value = 64; $('in-sett').value = 260;
  $('lock-colors').checked = false; $('lock-structure').checked = false;
  handleGenerateClick();
  $('patchwork-qty').value = 12;
  generatePatchwork();

  check('every tile has a pin and a variants button', cells().length === 12 && cells().every(c => c.querySelector('.patchwork-pin') && c.querySelector('.patchwork-vary')));
  check('pins start released', cells().every(c => c.querySelector('.patchwork-pin').getAttribute('aria-pressed') === 'false'));

  // Pin two tiles
  cells()[2].querySelector('.patchwork-pin').click();
  check('focus stays on the pin after the redraw', document.activeElement === cells()[2].querySelector('.patchwork-pin'));
  cells()[5].querySelector('.patchwork-pin').click();
  check('pinned tiles are marked', cells()[2].classList.contains('pinned') && cells()[5].querySelector('.patchwork-pin').getAttribute('aria-pressed') === 'true');
  const kept = [srt(patchworkBatch[2]), srt(patchworkBatch[5])];
  const others = patchworkBatch.filter((e, i) => i !== 2 && i !== 5).map(srt);

  $('btn-patchwork-new').click();
  check('"new batch" keeps pinned tiles in place', srt(patchworkBatch[2]) === kept[0] && srt(patchworkBatch[5]) === kept[1]);
  const changed = patchworkBatch.filter((e, i) => i !== 2 && i !== 5 && !others.includes(srt(e))).length;
  check('"new batch" replaces the other tiles', changed >= 9 && patchworkBatch.length === 12, changed);

  // A smaller quantity never drops pinned tiles
  $('patchwork-qty').value = 1;
  $('btn-patchwork-new').click();
  check('pinned tiles survive a smaller quantity', patchworkBatch.length === 2 && patchworkBatch.every(e => e.pinned), patchworkBatch.length);
  $('patchwork-qty').value = 12;
  $('btn-patchwork-new').click();
  check('quantity grows back around the pins', patchworkBatch.length === 12, patchworkBatch.length);

  // Unpin
  const pinIndex = patchworkBatch.findIndex(e => e.pinned);
  cells()[pinIndex].querySelector('.patchwork-pin').click();
  check('a pin can be released', !patchworkBatch[pinIndex].pinned && patchworkBatch.filter(e => e.pinned).length === 1);

  // Variants
  const sourceIndex = patchworkBatch.findIndex(e => !e.pinned);
  const source = patchworkBatch[sourceIndex];
  const widths = source.stripes.map(s => s.count).join();
  const colors = source.stripes.map(s => s.hex).join();
  cells()[sourceIndex].querySelector('.patchwork-vary').click();
  check('variants keep the source, pinned, in place', patchworkBatch[sourceIndex] === source && source.pinned);
  check('variants keep the other pinned tile', patchworkBatch.filter(e => e.pinned).length === 2);
  check('board still holds the quantity', patchworkBatch.length === 12, patchworkBatch.length);
  const fresh = patchworkBatch.filter(e => !e.pinned);
  const sameWidths = fresh.filter(e => e.stripes.map(s => s.count).join() === widths).length;
  const sameColors = fresh.filter(e => e.stripes.map(s => s.hex).join() === colors).length;
  check('variants: some keep the widths, some keep the colors', sameWidths >= 3 && sameColors >= 3, `${sameWidths} same widths, ${sameColors} same colors`);
  check('status explains the variants', $('patchwork-status').textContent.length > 0, $('patchwork-status').textContent);
  check('focus stays on the variants button', document.activeElement === cells()[sourceIndex].querySelector('.patchwork-vary'));

  // English labels
  setLanguage('en');
  const pinTitle = cells()[0].querySelector('.patchwork-pin').title;
  check('actions are translated', /pattern/.test(pinTitle) && cells()[0].querySelector('.patchwork-vary').title === 'Variants of this pattern', pinTitle);
  setLanguage('fr');

  // Using a tile still works
  const depth = historyStack.length;
  const target = patchworkBatch[0];
  cells()[0].querySelector('.patchwork-tile').click();
  check('clicking a tile still adopts it', JSON.stringify(tartanStripes) === JSON.stringify(target.stripes) && $('patchwork-board').hidden && historyStack.length === Math.min(10, depth + 1));

  // Reopening starts fresh (pins belong to the open board)
  generatePatchwork();
  check('reopening the board starts a fresh batch', patchworkBatch.every(e => !e.pinned));
  cells()[1].querySelector('.patchwork-pin').click();
  cells()[3].querySelector('.patchwork-vary').click();
  check('no alert during the run', alerts.length === 0, JSON.stringify(alerts));

  const p = document.createElement('pre'); p.id = 'bench-out'; p.style.display = 'none'; p.textContent = results.join('\n'); document.body.appendChild(p);
}
(function wait(n) {
  if (window.drawingContext && tartanStripes.length) run().catch(e => { const p = document.createElement('pre'); p.id = 'bench-out'; p.textContent = results.join('\n') + '\nFAIL crash ' + e.stack; document.body.appendChild(p); });
  else if (n > 0) setTimeout(() => wait(n - 1), 50);
})(200);
