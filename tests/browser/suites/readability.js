// Phase 6: readability. Threads per cm, words instead of arrows, French numbers, contrast, one font.
window.alerts = [];
window.alert = m => window.alerts.push(m);
const results = [];
const check = (n, ok, d) => results.push((ok ? 'PASS ' : 'FAIL ') + n + (d !== undefined ? ' -> ' + d : ''));
window.addEventListener('error', e => results.push('FAIL pageError ' + e.message));
const $ = id => document.getElementById(id);
const fire = (el, type) => el.dispatchEvent(new Event(type, { bubbles: true }));

// WCAG contrast of every visible text against the background it sits on
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
    if (!el.getClientRects().length || el.closest('[hidden], .sr-only, canvas, svg, .history-thumb, .color-swatch, .sheet-chip')) continue;
    const own = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()) || (el.matches('input:not([type=checkbox]):not([type=radio]):not([type=range]):not([type=color]), select') && el.value);
    if (!own) continue;
    const st = getComputedStyle(el);
    if (st.visibility === 'hidden' || +st.opacity < 0.5 || el.disabled) continue;
    const fg = toRgba(st.color), bg = backdropOf(el);
    const a = lumOf(fg), b = lumOf(bg), ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
    if (ratio < 4.5) bad.push((el.id || el.className || el.tagName) + ' "' + (el.value || el.textContent).trim().slice(0, 18) + '" ' + ratio.toFixed(2));
  }
  return bad;
}

async function run() {
  const vw = document.documentElement.clientWidth;
  check('viewport ' + vw, true);
  $('tab-fabric').click();

  // Threads per cm, with the mm computed
  check('Laine 9 fils/cm at first', $('thread-type').value === '9' && $('in-density').value === '9' && $('in-threadmm').value === '1.11', $('thread-type').value + ' ' + $('in-density').value + ' ' + $('in-threadmm').value);
  check('the mm is a note', $('thread-mm-note').textContent === 'soit 1,11 mm par fil', $('thread-mm-note').textContent);
  check('no mm field shown', $('in-threadmm').type === 'hidden');
  $('thread-type').value = '14'; fire($('thread-type'), 'change');
  check('Coton: 14 fils/cm', $('in-density').value === '14' && $('in-threadmm').value === '0.714' && $('thread-mm-note').textContent === 'soit 0,71 mm par fil', $('in-density').value + ' ' + $('in-threadmm').value);
  $('in-density').focus(); $('in-density').value = '12'; fire($('in-density'), 'input');
  check('typing 12 picks Mérinos', $('thread-type').value === '12' && $('in-threadmm').value === '0.833');
  $('in-density').value = '10.5'; fire($('in-density'), 'input');
  check('typing 10.5: another density', $('thread-type').value === 'custom' && $('in-threadmm').value === '0.952');
  $('in-density').value = '0'; fire($('in-density'), 'input');
  check('0 is ignored', $('in-threadmm').value === '0.952');
  $('in-density').value = '10.5'; $('in-density').blur();
  const repeat = countSettThreads(tartanStripes, $('check-sym').checked) * 0.952 / 10;
  check('width of one repeat in French', $('real-width').textContent === repeat.toFixed(1).replace('.', ',') + ' cm', $('real-width').textContent);
  check('SRT bar in French', $('srt-bar-size').textContent.includes(repeat.toFixed(1).replace('.', ',') + ' cm'), $('srt-bar-size').textContent);
  $('thread-type').value = 'custom'; $('thread-type').focus(); fire($('thread-type'), 'change');
  check('Autre densité: focus on the field', document.activeElement === $('in-density'));
  $('in-density').blur();
  $('thread-type').value = '9'; fire($('thread-type'), 'change');

  // Older ways in still work
  $('in-threadmm').value = '0.5'; fire($('in-threadmm'), 'input');
  check('a thread size from a link or file shows as 20 fils/cm', $('in-density').value === '20');
  localStorage.setItem('tartanGeneratorState', JSON.stringify(Object.assign(JSON.parse(localStorage.getItem('tartanGeneratorState')), { threadType: '0.83', threadMm: '0.83' })));
  loadState();
  check('an old saved yarn keeps its size', $('thread-type').value === 'custom' && $('in-threadmm').value === '0.83' && $('in-density').value === '12', $('in-density').value);
  $('thread-type').value = '9'; fire($('thread-type'), 'change');

  // Labels
  $('tab-pattern').click();
  const label = id => document.querySelector('label[for="' + id + '"]').textContent.trim();
  check('labels', label('in-stripes') === 'Nombre de bandes' && label('in-sett') === 'Fils des bandes' && $('lbl-limits').textContent === 'Fils par bande (min. et max.)' && $('lbl-weave-dir').textContent === 'Diagonale du sergé', [label('in-stripes'), label('in-sett')].join(' | '));
  check('Z and S', label('weave-z').startsWith('Z') && label('weave-s').startsWith('S') && !document.body.textContent.includes('Twist'));
  $('in-sett').value = 151; tartanStripes = [{ code: 'R', hex: '#C80000', count: 48 }, { code: 'K', hex: '#101010', count: 12 }]; updateActualValues();
  check('value obtained said in words', $('sett-actual').textContent.startsWith('obtenu : 60') && !$('sett-actual').textContent.includes('→'), $('sett-actual').textContent);
  check('value obtained not in red', getComputedStyle($('sett-actual')).color !== 'rgb(231, 76, 60)');
  $('in-sett').value = 260; handleGenerateClick();
  check('number fields in the page font', getComputedStyle($('in-sett')).fontFamily === getComputedStyle(document.body).fontFamily);
  check('zoom reads as a factor', $('in-zoom').parentElement.textContent.includes('×'));

  // Contrast of every visible text, tab by tab and in the Planche
  const bad = [];
  for (const tab of ['tab-pattern', 'tab-colors', 'tab-fabric']) { $(tab).click(); bad.push(...lowContrast(document.body)); }
  generatePatchwork(); bad.push(...lowContrast(document.body)); closePatchworkBoard();
  check('every visible text at 4.5:1 or more', bad.length === 0, [...new Set(bad)].join(' ; '));

  // English
  setLanguage('en');
  $('tab-fabric').click();
  check('English density', $('thread-mm-note').textContent === 'that is 1.11 mm per thread' && $('thread-type').options[0].textContent === 'Wool (9 threads/cm)', $('thread-mm-note').textContent);
  check('English numbers', /\d\.\d cm/.test($('real-width').textContent), $('real-width').textContent);
  setLanguage('fr');
  check('back to French numbers', /\d,\d cm/.test($('real-width').textContent), $('real-width').textContent);
  check('no horizontal overflow', document.documentElement.scrollWidth <= vw);
  check('no alert', alerts.length === 0);
  const p = document.createElement('pre'); p.id = 'bench-out'; p.style.display = 'none'; p.textContent = results.join('\n'); document.body.appendChild(p);
}
(function wait(n) {
  if (window.drawingContext && tartanStripes.length) run().catch(e => { const p = document.createElement('pre'); p.id = 'bench-out'; p.textContent = results.join('\n') + '\nFAIL crash ' + e.stack; document.body.appendChild(p); });
  else if (n > 0) setTimeout(() => wait(n - 1), 50);
})(200);
