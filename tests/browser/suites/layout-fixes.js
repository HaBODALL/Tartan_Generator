// Review fixes: the pattern follows its container, the product view clears the buttons, thread counts say what they count.
window.alerts = [];
window.alert = m => window.alerts.push(m);
const results = [];
const check = (n, ok, d) => results.push((ok ? 'PASS ' : 'FAIL ') + n + (d !== undefined ? ' -> ' + d : ''));
window.addEventListener('error', e => results.push('FAIL pageError ' + e.message));
const $ = id => document.getElementById(id);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const fire = (el, type) => el.dispatchEvent(new Event(type, { bubbles: true }));
const box = el => el.getBoundingClientRect();
const overlap = (a, b) => a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;

async function run() {
  const vw = document.documentElement.clientWidth, wide = vw > 768;
  check('viewport ' + vw, true);
  const cont = $('canvas-container'), canvas = cont.querySelector(':scope > canvas');
  const painted = () => { const d = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data; let n = 0; for (let i = 0; i < d.length; i += 400) if (d[i] + d[i + 1] + d[i + 2] > 0) n++; return n; };

  // 1. A pattern area with no width, then with one again
  const col = document.querySelector('.canvas-column');
  const before = canvas.width;
  col.style.width = '0px'; col.style.flex = 'none'; col.style.minWidth = '0';
  await sleep(150);
  check('no crash and no resize to nothing', canvas.width === before, canvas.width);
  col.style.width = '333px';
  await sleep(200);
  check('the pattern follows its area', Math.round(box(canvas).width) === Math.round(box(cont).width) && Math.round(box(cont).width) === 333 && painted() > 50, box(canvas).width + ' / ' + box(cont).width + ' painted ' + painted());
  col.style.width = ''; col.style.flex = ''; col.style.minWidth = '';
  await sleep(200);
  check('and back to the full width', Math.round(box(canvas).width) === Math.round(box(cont).width) && box(cont).width > 100 && painted() > 50, box(canvas).width);
  check('canvas on whole pixels', Number.isInteger(box(cont).width) && Number.isInteger(box(cont).height), box(cont).width + 'x' + box(cont).height);

  // 2. Product view: nothing under the view switch or the panel button
  document.querySelector('.view-btn[data-view="scarf"]').click(); await sleep(60);
  const panel = box(document.querySelector('.preview-bar')), stage = box(document.querySelector('.preview-stage'));
  const toggle = $('btn-toggle-ui'), sw = box(document.querySelector('.view-switch'));
  if (toggle.getClientRects().length) check('panel button clear of the caption bar', !overlap(box(toggle), panel), JSON.stringify([box(toggle).bottom, panel.top]));
  else check('panel button hidden in the product view', true);
  check('the object starts under the view switch', stage.top >= sw.bottom && panel.top >= stage.bottom - 1, JSON.stringify([sw.bottom, stage.top, panel.top]));
  document.querySelector('.view-btn[data-view="cloth"]').click();

  // 3. Thread counts
  $('tab-pattern').click();
  check('label says what it counts', document.querySelector('label[for="in-sett"]').textContent === 'Fils des bandes');
  tartanStripes = [{ code: 'R', hex: '#C80000', count: 48 }, { code: 'B', hex: '#000064', count: 8 }, { code: 'K', hex: '#101010', count: 12 }];
  userPalette = paletteFromStripes(tartanStripes);
  $('in-sett').value = 260; $('check-sym').checked = true; fire($('check-sym'), 'change');
  check('mirrored: obtained and full repeat', $('sett-actual').textContent === 'obtenu : 68 · motif entier : 76 fils', $('sett-actual').textContent);
  check('same count as the SRT bar', $('srt-bar-size').textContent.includes('76 fils'), $('srt-bar-size').textContent);
  $('in-sett').value = 68; updateActualValues();
  check('on target, mirrored: only the full repeat', $('sett-actual').textContent === 'motif entier : 76 fils', $('sett-actual').textContent);
  $('check-sym').checked = false; fire($('check-sym'), 'change');
  check('not mirrored and on target: nothing', $('sett-actual').textContent === '', $('sett-actual').textContent);
  $('check-sym').checked = true; fire($('check-sym'), 'change');
  setLanguage('en');
  check('English', document.querySelector('label[for="in-sett"]').textContent === 'Threads in the stripes' && $('sett-actual').textContent === 'full repeat: 76 threads', $('sett-actual').textContent);
  setLanguage('fr');
  check('no horizontal overflow', document.documentElement.scrollWidth <= vw);
  check('no alert', alerts.length === 0);
  const out = document.createElement('pre'); out.id = 'bench-out'; out.style.display = 'none'; out.textContent = results.join('\n'); document.body.appendChild(out);
}
(function wait(n) {
  if (window.drawingContext && tartanStripes.length) run().catch(e => { const p = document.createElement('pre'); p.id = 'bench-out'; p.textContent = results.join('\n') + '\nFAIL crash ' + e.stack; document.body.appendChild(p); });
  else if (n > 0) setTimeout(() => wait(n - 1), 50);
})(200);
