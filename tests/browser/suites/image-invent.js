// Inventing a tartan from any image, through the real page.
window.alerts = [];
window.alert = m => window.alerts.push(m);
const results = [];
const check = (n, ok, d) => results.push((ok ? 'PASS ' : 'FAIL ') + n + (d !== undefined ? ' -> ' + d : ''));
window.addEventListener('error', e => results.push('FAIL pageError ' + e.message));
const $ = id => document.getElementById(id);
const fire = (el, type) => el.dispatchEvent(new Event(type, { bubbles: true }));
const cells = () => [...document.querySelectorAll('.proposal-cell')];
const code = p => buildSRTCode(p.stripes, p.symmetric);
const caption = i => cells()[i].querySelector('.proposal-caption').textContent;
const toFile = c => new Promise(res => c.toBlob(b => res(new File([b], 'image.png', { type: 'image/png' })), 'image/png'));

function landscape() {
  const c = document.createElement('canvas'); c.width = 900; c.height = 600;
  const g = c.getContext('2d');
  const sky = g.createLinearGradient(0, 0, 0, 380);
  sky.addColorStop(0, '#2060c0'); sky.addColorStop(1, '#f0d090');
  g.fillStyle = sky; g.fillRect(0, 0, 900, 380);
  g.fillStyle = '#e03020'; g.beginPath(); g.arc(640, 200, 90, 0, 7); g.fill();
  g.fillStyle = '#206030'; g.fillRect(0, 380, 900, 220);
  g.fillStyle = '#604020'; g.fillRect(180, 300, 70, 220);
  g.fillStyle = '#f0f0f0'; g.fillRect(420, 420, 160, 120);
  return c;
}

async function run() {
  $('in-sett').value = 260;
  await openEstimateFromFile(await toFile(landscape()));
  check('reading mode at opening', $('estimate-mode-read').checked);
  check('tolerance shown when reading', getComputedStyle($('estimate-tolerance-row')).display !== 'none');
  check('reading hint', $('estimate-hint').textContent.includes('tissu'), $('estimate-hint').textContent);
  const reading = estimateState.proposals.map(code).join('|');

  const invent = $('estimate-mode-invent');
  invent.checked = true; fire(invent, 'change');
  check('series of 10', cells().length === 10, cells().length);
  check('other series than reading', estimateState.proposals.map(code).join('|') !== reading);
  check('first caption names how it was made', ['Ligne horizontale', 'Ligne verticale', 'Ligne en diagonale', 'Surfaces des couleurs'].includes(caption(0)), caption(0));
  check('status', $('estimate-status').textContent.includes('inventés'), $('estimate-status').textContent);
  check('hint', $('estimate-hint').textContent.includes("N'importe quelle image"));
  check('tolerance hidden', getComputedStyle($('estimate-tolerance-row')).display === 'none');
  check('apply enabled', !$('btn-estimate-apply').disabled);
  const data = $('estimate-result').getContext('2d').getImageData(0, 0, 280, 280).data;
  let painted = 0; for (let i = 3; i < data.length; i += 4) if (data[i]) painted++;
  check('result drawn', painted === 280 * 280, painted);

  // The image shows in the colors
  const colors = new Set(estimateState.proposals[0].stripes.map(s => s.code));
  check('several colors', colors.size >= 2, [...colors].join());
  const hasGreen = estimateState.proposals.some(p => p.stripes.some(s => { const l = hexToLab(s.hex); return l[1] < -10; }));
  check('the green of the image is used', hasGreen);

  // Selecting a part of the image changes the series
  const whole = estimateState.proposals.map(code).join('|');
  const c = $('estimate-source'); c.setPointerCapture = () => {};
  const box = c.getBoundingClientRect();
  const sx = box.width / 900, sy = box.height / 600;
  const ptr = (t, x, y) => c.dispatchEvent(new PointerEvent(t, { pointerId: 3, clientX: box.left + x * sx, clientY: box.top + y * sy, button: 0, bubbles: true }));
  ptr('pointerdown', 500, 50); ptr('pointermove', 800, 300); ptr('pointerup', 800, 300);
  check('a selection changes the series', estimateState.region && estimateState.proposals.map(code).join('|') !== whole);
  check('still inventing', invent.checked && cells().length > 0, cells().length);
  ptr('pointerdown', 10, 10); ptr('pointerup', 10, 10);
  check('whole image gives the same series again', estimateState.proposals.map(code).join('|') === whole);

  // Stars and intermediate work here too
  cells()[1].querySelector('.star-silver').click();
  cells()[2].querySelector('.star-silver').click();
  $('btn-estimate-refine').click();
  check('intermediate of invented tartans', caption(0) === 'Intermédiaire', caption(0));
  check('round status', $('estimate-status').textContent.includes('Tour 2'));
  $('btn-estimate-back').click();
  check('previous round', estimateState.rounds.length === 0 && cells()[1].classList.contains('silver'));

  // Thread total
  $('estimate-threads').value = 400; fire($('estimate-threads'), 'change');
  check('thread total applies', Math.abs(countSettThreads(estimateState.proposals[0].stripes, estimateState.proposals[0].symmetric) - 400) <= 40);

  // Applying
  cells()[3].querySelector('.star-gold').click();
  const gold = estimateState.proposals[3];
  $('btn-estimate-apply').click();
  check('applied', !isEstimateOpen() && code({ stripes: tartanStripes, symmetric: $('check-sym').checked }) === code(gold));
  check('message', $('app-message').textContent.includes('inventé'), $('app-message').textContent);

  // Next opening starts in reading mode
  await openEstimateFromFile(await toFile(landscape()));
  check('reading mode again', $('estimate-mode-read').checked && getComputedStyle($('estimate-tolerance-row')).display !== 'none');

  // Back and forth, then a plain image
  invent.checked = true; fire(invent, 'change');
  const read = $('estimate-mode-read');
  read.checked = true; fire(read, 'change');
  check('back to reading', estimateState.proposals.map(code).join('|') === reading);
  $('btn-estimate-cancel').click();

  const plain = document.createElement('canvas'); plain.width = 300; plain.height = 300;
  const g = plain.getContext('2d'); g.fillStyle = '#808080'; g.fillRect(0, 0, 300, 300);
  await openEstimateFromFile(await toFile(plain));
  invent.checked = true; fire(invent, 'change');
  check('plain image has nothing to offer', cells().length === 0 && $('btn-estimate-apply').disabled && $('estimate-status').textContent.includes('assez de couleurs'), $('estimate-status').textContent);

  setLanguage('en');
  check('English', $('estimate-status').textContent.includes('enough') && $('estimate-title').textContent === 'A tartan from an image', $('estimate-status').textContent);
  setLanguage('fr');
  $('btn-estimate-cancel').click();
  check('no alert', alerts.length === 0);
  const p = document.createElement('pre'); p.id = 'bench-out'; p.style.display = 'none'; p.textContent = results.join('\n'); document.body.appendChild(p);
}
(function wait(n) {
  if (window.drawingContext && tartanStripes.length) run().catch(e => { const p = document.createElement('pre'); p.id = 'bench-out'; p.textContent = results.join('\n') + '\nFAIL crash ' + e.stack; document.body.appendChild(p); });
  else if (n > 0) setTimeout(() => wait(n - 1), 50);
})(200);
