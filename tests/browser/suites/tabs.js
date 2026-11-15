// Redesign phase 2: the side panel in three tabs under a fixed Générer block.
window.alerts = [];
window.alert = m => window.alerts.push(m);
const results = [];
const check = (n, ok, d) => results.push((ok ? 'PASS ' : 'FAIL ') + n + (d !== undefined ? ' -> ' + d : ''));
window.addEventListener('error', e => results.push('FAIL pageError ' + e.message));
const $ = id => document.getElementById(id);
const key = (el, k) => el.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true }));
const sleep = ms => new Promise(r => setTimeout(r, ms));
const shown = id => !$(id).closest('[hidden]') && $(id).getClientRects().length > 0;
const tabs = ['pattern', 'colors', 'fabric'];
const state = () => tabs.map(n => $('tab-' + n).getAttribute('aria-selected') === 'true' ? 1 : 0).join('') + '/' + tabs.map(n => $('panel-' + n).hidden ? 0 : 1).join('');

async function run() {
  const vw = document.documentElement.clientWidth;
  check('viewport ' + vw, true);
  check('Motif open at load', state() === '100/100', state());
  check('tab roles', $('tab-colors').getAttribute('role') === 'tab' && $('panel-colors').getAttribute('role') === 'tabpanel' && $('tab-colors').getAttribute('aria-controls') === 'panel-colors');
  check('only the selected tab in the Tab order', $('tab-pattern').tabIndex === 0 && $('tab-colors').tabIndex === -1);
  // Contents
  check('Motif: examples, structure', ['srt-examples', 'in-stripes'].every(id => $('panel-pattern').contains($(id))));
  check('Couleurs: palette, readability', ['color-list', 'readability-list', 'vision-select'].every(id => $('panel-colors').contains($(id))));
  check('Tissu: yarn, relief, irregularity, width', ['thread-type', 'effect-relief', 'yarn-irregular', 'real-width'].every(id => $('panel-fabric').contains($(id))));
  check('Générer and locks above the tabs', !$('btn-generate').closest('.tab-panel') && !$('lock-colors').closest('.tab-panel'));
  // Mouse
  $('tab-colors').click();
  check('Couleurs selected', state() === '010/010', state());
  check('palette section open in its tab', $('color-list').closest('details').open && shown('color-list'));
  $('tab-fabric').click();
  check('Tissu selected', state() === '001/001' && shown('thread-type'), state());
  // Keyboard
  $('tab-fabric').focus();
  const vx = viewX;
  key($('tab-fabric'), 'ArrowRight');
  check('ArrowRight wraps to Motif with the focus', state() === '100/100' && document.activeElement === $('tab-pattern'), state());
  check('arrows on the tabs do not move the pattern', viewX === vx);
  key($('tab-pattern'), 'ArrowLeft');
  check('ArrowLeft wraps to Tissu', state() === '001/001' && document.activeElement === $('tab-fabric'));
  key($('tab-fabric'), 'Home');
  check('Home', state() === '100/100');
  key($('tab-pattern'), 'End');
  check('End', state() === '001/001');
  // Générer stays visible from any tab, even scrolled down
  const sb = $('sidebar');
  sb.scrollTop = sb.scrollHeight;
  await sleep(50);
  const g = $('btn-generate').getBoundingClientRect(), s = sb.getBoundingClientRect();
  check('Générer visible after scrolling', g.top >= s.top - 1 && g.bottom <= s.bottom && document.elementFromPoint(g.left + g.width / 2, g.top + g.height / 2)?.closest('#btn-generate') !== null, JSON.stringify([g.top, s.top]));
  const id = generationID;
  $('btn-generate').click();
  check('Générer works from Tissu', generationID !== id && state() === '001/001');
  sb.scrollTop = 0;
  // The menus reach controls in other tabs
  $('btn-menu-import').click(); $('menu-new-srt').click();
  check('Nouveau > code SRT goes to the bar, tab unchanged', state() === '001/001' && document.activeElement === $('import-text'), state());
  $('tab-colors').click();
  $('btn-menu-import').click(); $('menu-new-example').click();
  check('Nouveau > exemple switches to Motif', state() === '100/100' && document.activeElement === $('srt-examples'));
  // Readability warning seen from another tab
  check('no warning badge on a readable pattern, or a warning matches the section', $('tab-colors-badge').textContent === $('readability-badge').textContent);
  tartanStripes = [['K', '#101010', 48], ['DG', '#141414', 8], ['W', '#FFFFFF', 20]].map(([code, hex, count]) => ({ code, hex, count }));
  userPalette = paletteFromStripes(tartanStripes); redrawTartan();
  check('warning on the Couleurs tab', $('tab-colors-badge').textContent === '⚠' && $('tab-colors').title.length > 0, $('tab-colors-badge').textContent);
  // Collapsed panel
  toggleSidebar(); await sleep(400);
  check('collapsed panel hides the top block', getComputedStyle(document.querySelector('.panel-top')).display === 'none');
  toggleSidebar(); await sleep(400);
  // English
  setLanguage('en');
  check('English tabs', $('tab-pattern').textContent.trim() === 'Pattern' && $('tab-colors').textContent.includes('Colors') && $('tab-fabric').textContent.trim() === 'Fabric');
  check('English tab list name', document.querySelector('.panel-tabs').getAttribute('aria-label') === 'Panel sections');
  setLanguage('fr');
  check('no horizontal overflow', document.documentElement.scrollWidth <= vw && sb.scrollWidth <= sb.clientWidth + 1, sb.scrollWidth + ' / ' + sb.clientWidth);
  check('no alert', alerts.length === 0);
  const p = document.createElement('pre'); p.id = 'bench-out'; p.style.display = 'none'; p.textContent = results.join('\n'); document.body.appendChild(p);
}
(function wait(n) {
  if (window.drawingContext && tartanStripes.length) run().catch(e => { const p = document.createElement('pre'); p.id = 'bench-out'; p.textContent = results.join('\n') + '\nFAIL crash ' + e.stack; document.body.appendChild(p); });
  else if (n > 0) setTimeout(() => wait(n - 1), 50);
})(200);
