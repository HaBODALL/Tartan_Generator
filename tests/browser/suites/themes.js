// Themes: Nuit douce by default, Atelier clair on demand; both readable everywhere, the choice remembered.
window.alerts = [];
window.alert = m => window.alerts.push(m);
const results = [];
const check = (n, ok, d) => results.push((ok ? 'PASS ' : 'FAIL ') + n + (d !== undefined ? ' -> ' + d : ''));
window.addEventListener('error', e => results.push('FAIL pageError ' + e.message));
const $ = id => document.getElementById(id);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const shown = el => el.getClientRects().length > 0;

// WCAG contrast of every visible text against the background it sits on
const toRgba = s => { const m = s.match(/[\d.]+/g).map(Number); return { r: m[0], g: m[1], b: m[2], a: m.length > 3 ? m[3] : 1 }; };
const lumOf = c => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b); };
function backdropOf(el) {
  const layers = [];
  for (let e = el; e; e = e.parentElement) {
    const st = getComputedStyle(e);
    if (st.backgroundImage.includes('gradient')) { const m = st.backgroundImage.match(/rgba?\([^)]*\)/); if (m) { layers.push(toRgba(m[0])); break; } }
    const c = toRgba(st.backgroundColor);
    if (c.a > 0) { layers.push(c); if (c.a >= 1) break; }
  }
  const page = toRgba(getComputedStyle(document.body).backgroundColor);
  let out = { r: page.r, g: page.g, b: page.b };
  for (const c of layers.reverse()) out = { r: c.r * c.a + out.r * (1 - c.a), g: c.g * c.a + out.g * (1 - c.a), b: c.b * c.a + out.b * (1 - c.a) };
  return out;
}
function lowContrast(root) {
  const bad = [];
  for (const el of root.querySelectorAll('*')) {
    // Controls laid over the pattern sit on any colour: their own surface is what counts, checked below
    if (!el.getClientRects().length || el.closest('[hidden], .sr-only, canvas, svg, .history-thumb, .color-swatch, .sheet-paper')) continue;
    const own = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()) || (el.matches('input:not([type=checkbox]):not([type=radio]):not([type=range]):not([type=color]), select') && el.value);
    if (!own) continue;
    const st = getComputedStyle(el);
    if (st.visibility === 'hidden' || +st.opacity < 0.5 || el.disabled) continue;
    const a = lumOf(toRgba(st.color)), b = lumOf(backdropOf(el)), ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
    if (ratio < 4.5) bad.push((el.id || el.className || el.tagName) + ' "' + (el.value || el.textContent).trim().slice(0, 18) + '" ' + ratio.toFixed(2));
  }
  return bad;
}
async function scanEverything() {
  const bad = [];
  for (const tab of ['tab-pattern', 'tab-colors', 'tab-fabric']) { $(tab).click(); bad.push(...lowContrast(document.body)); }
  for (const menu of ['btn-menu-new', 'btn-menu-import', 'btn-menu-export']) { $(menu).click(); bad.push(...lowContrast(document.body)); closeMenus(); }
  document.querySelector('.view-btn[data-view="scarf"]').click(); await sleep(40);
  $('btn-compare-scales').click(); bad.push(...lowContrast(document.body)); $('btn-compare-scales').click();
  document.querySelector('.view-btn[data-view="cloth"]').click();
  generatePatchwork(); bad.push(...lowContrast(document.body)); closePatchworkBoard();
  openAboutModal(); bad.push(...lowContrast(document.body)); closeAboutModal();
  $('tab-pattern').click();
  return [...new Set(bad)];
}

async function run() {
  const vw = document.documentElement.clientWidth, narrow = vw <= 600;
  check('viewport ' + vw, true);
  localStorage.removeItem('tartanTheme');
  applyTheme(readSavedTheme());
  const root = document.documentElement, bg = () => getComputedStyle(document.body).backgroundColor;

  // Default: Nuit douce, red accent
  check('Nuit douce by default', !root.dataset.theme && currentTheme === 'dark' && lumOf(toRgba(bg())) < 0.05, bg());
  const accent = toRgba(themeColor('--accent').replace(/^#(..)(..)(..)$/, (m, r, g, b) => `rgb(${parseInt(r, 16)},${parseInt(g, 16)},${parseInt(b, 16)})`));
  check('red accent', accent.r > 150 && accent.r > accent.g * 2 && accent.r > accent.b * 2, themeColor('--accent'));
  let bad = await scanEverything();
  check('Nuit douce: every visible text at 4.5:1 or more', bad.length === 0, bad.join(' ; '));

  // Switch
  const control = narrow ? $('menu-theme') : $('btn-theme');
  if (narrow) $('btn-menu-more').click();
  check('theme control reachable', shown(control), control.id);
  check('it names the theme it leads to', narrow ? control.textContent === 'Thème clair' : control.getAttribute('aria-label') === 'Passer au thème clair');
  control.click();
  check('Atelier clair', root.dataset.theme === 'light' && currentTheme === 'light' && lumOf(toRgba(bg())) > 0.7, bg());
  check('remembered', localStorage.getItem('tartanTheme') === 'light' && readSavedTheme() === 'light');
  if (narrow) $('btn-menu-more').click();
  check('the control now leads back', narrow ? $('menu-theme').textContent === 'Thème sombre' : $('btn-theme').getAttribute('aria-label') === 'Passer au thème sombre' && $('btn-theme').getAttribute('aria-pressed') === 'true');
  closeMenus();
  await sleep(400); // Colours ease in: measure once they have settled
  bad = await scanEverything();
  check('Atelier clair: every visible text at 4.5:1 or more', bad.length === 0, bad.join(' ; '));

  // What is drawn on a canvas follows the theme
  document.querySelector('.view-btn[data-view="scarf"]').click(); await sleep(40);
  const c = $('preview-canvas');
  const corner = () => [...c.getContext('2d').getImageData(2, 2, 1, 1).data];
  check('product view: transparent stage over the light theme', corner()[3] === 0 && lumOf(backdropOf(c.parentElement)) > 0.6, corner().join());
  check('labels use the theme text colour', themeColor('--text-soft') !== '' && lumOf(toRgba(getComputedStyle($('piece-caption')).color)) < 0.2);
  document.querySelector('.view-btn[data-view="cloth"]').click();

  // The weaving sheet stays white paper in both themes
  openWeavingSheet();
  const paper = getComputedStyle(document.querySelector('.sheet-paper'));
  check('weaving sheet: dark ink on white paper', lumOf(toRgba(paper.backgroundColor)) > 0.9 && lumOf(toRgba(paper.color)) < 0.1, paper.backgroundColor + ' ' + paper.color);
  closeWeavingSheet();

  setLanguage('en');
  check('English', narrow ? $('menu-theme').textContent === 'Dark theme' : $('btn-theme').getAttribute('aria-label') === 'Switch to the dark theme');
  setLanguage('fr');
  toggleTheme();
  check('back to Nuit douce', !root.dataset.theme && localStorage.getItem('tartanTheme') === 'dark');
  localStorage.removeItem('tartanTheme');
  check('no horizontal overflow', document.documentElement.scrollWidth <= vw);
  check('no alert', alerts.length === 0);
  const p = document.createElement('pre'); p.id = 'bench-out'; p.style.display = 'none'; p.textContent = results.join('\n'); document.body.appendChild(p);
}
(function wait(n) {
  if (window.drawingContext && tartanStripes.length) run().catch(e => { const p = document.createElement('pre'); p.id = 'bench-out'; p.textContent = results.join('\n') + '\nFAIL crash ' + e.stack; document.body.appendChild(p); });
  else if (n > 0) setTimeout(() => wait(n - 1), 50);
})(200);
