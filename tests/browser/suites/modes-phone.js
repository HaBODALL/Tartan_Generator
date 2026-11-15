// Redesign phase 4: Atelier / Planche modes, and the phone layout.
window.alerts = [];
window.alert = m => window.alerts.push(m);
const results = [];
const check = (n, ok, d) => results.push((ok ? 'PASS ' : 'FAIL ') + n + (d !== undefined ? ' -> ' + d : ''));
window.addEventListener('error', e => results.push('FAIL pageError ' + e.message));
const $ = id => document.getElementById(id);
const key = (el, k) => el.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true }));
const sleep = ms => new Promise(r => setTimeout(r, ms));
const shown = el => el.getClientRects().length > 0;
const visibleItems = id => { const btn = document.querySelector('[aria-controls="' + id + '"]'); btn.click(); const out = [...$(id).querySelectorAll('.menu-item')].filter(shown).map(i => i.id); closeMenus(); return out; };
const inScreen = el => { const r = el.getBoundingClientRect(); return r.left >= 0 && r.right <= document.documentElement.clientWidth && r.top >= 0 && r.bottom <= window.innerHeight; };

async function run() {
  const vw = document.documentElement.clientWidth, narrow = vw <= 600;
  check('viewport ' + vw, true);
  const studio = $('btn-patchwork-close'), board = $('btn-generate-patchwork');
  check('Atelier at load', studio.getAttribute('aria-pressed') === 'true' && board.getAttribute('aria-pressed') === 'false' && !document.body.classList.contains('board-mode'));
  check('mode switch in the top bar', inScreen(studio) && inScreen(board) && studio.getBoundingClientRect().bottom <= 50);
  check('Atelier exports only', visibleItems('menu-export').join() === 'btn-share-link,btn-export-png,btn-export-svg,btn-export-txt,btn-weaving-sheet,btn-export-all', visibleItems('menu-export').join());
  check('board settings hidden in the Atelier', !shown($('panel-board')));

  // Planche
  const depth = historyStack.length, code = buildSRTCode(tartanStripes, $('check-sym').checked);
  board.focus(); board.click();
  check('Planche opens the board', isPatchworkOpen() && document.body.classList.contains('board-mode') && board.getAttribute('aria-pressed') === 'true');
  check('panel: board settings and Nouveau lot', shown($('panel-board')) && shown($('btn-patchwork-new')) && shown($('patchwork-qty')) && !shown($('tab-pattern')) && !shown($('lock-colors')));
  check('pattern and history kept', historyStack.length === depth && buildSRTCode(tartanStripes, $('check-sym').checked) === code);
  check('board exports only', visibleItems('menu-export').join() === 'btn-patchwork-png,btn-generate-patchwork-zip', visibleItems('menu-export').join());
  const exp = $('btn-menu-export');
  exp.focus(); key(exp, 'ArrowDown');
  check('arrows reach the first visible choice', document.activeElement === $('btn-patchwork-png'), document.activeElement.id);
  key(document.activeElement, 'ArrowDown'); key(document.activeElement, 'ArrowDown');
  check('arrows skip hidden choices', document.activeElement === $('btn-patchwork-png'), document.activeElement.id);
  key(document.activeElement, 'Escape');
  const batch = patchworkBatch;
  board.click();
  check('Planche again keeps the batch', patchworkBatch === batch);
  patchworkBatch[0].pinned = true;
  const pinned = patchworkBatch[0];
  $('btn-patchwork-new').click();
  check('Nouveau lot: new batch, pin kept', patchworkBatch !== batch && patchworkBatch.includes(pinned));

  // Back to the Atelier
  studio.click();
  check('Atelier closes the board', !isPatchworkOpen() && !document.body.classList.contains('board-mode') && studio.getAttribute('aria-pressed') === 'true');
  check('focus on Atelier', document.activeElement === studio);
  check('panel back', shown($('tab-pattern')) && !shown($('panel-board')));
  board.click();
  key(document.body, 'Escape');
  check('Escape goes back to the Atelier', !isPatchworkOpen() && studio.getAttribute('aria-pressed') === 'true');
  board.click();
  const tile = document.querySelector('#patchwork-grid .patchwork-tile, #patchwork-grid button');
  tile.click();
  check('picking a tile goes back to the Atelier', !isPatchworkOpen() && studio.getAttribute('aria-pressed') === 'true' && historyStack.length === depth + 1, historyStack.length - depth);
  board.click();
  const id = generationID;
  $('btn-generate').click();
  check('Nouveau from the Planche: back to the Atelier, new pattern', !isPatchworkOpen() && generationID !== id && !document.body.classList.contains('board-mode'));

  // Phones: the ⋯ menu, Générer under the thumb
  if (narrow) {
    const more = $('btn-menu-more');
    check('⋯ in the bar', inScreen(more));
    more.click();
    check('⋯ menu inside the screen', inScreen($('menu-more')), JSON.stringify($('menu-more').getBoundingClientRect()));
    let copied = null; navigator.clipboard.writeText = t => { copied = t; return Promise.resolve(); };
    $('btn-menu-export').click(); $('btn-share-link').click(); await sleep(20);
    check('Enregistrer copies the link', typeof copied === 'string' && copied.includes('#tartan='), copied && copied.slice(0, 40));
    more.click(); $('menu-about').click();
    check('⋯ opens À propos', getComputedStyle($('about-modal')).display !== 'none');
    $('btn-close-about').click();
    more.click();
    check('language entry names English', $('menu-lang').textContent === 'English');
    $('menu-lang').click();
    check('⋯ switches to English', currentLang === 'en' && $('menu-lang').textContent === 'Français' && studio.textContent.includes('Studio'));
    more.click(); $('menu-lang').click();
    check('and back to French', currentLang === 'fr');
    $('btn-menu-new').click();
    check('Nouveau menu inside the screen', inScreen($('menu-new')));
    document.body.click();

    const sb = $('sidebar'), g = $('btn-generate'), tabs = document.querySelector('.panel-tabs');
    for (const where of ['top', 'bottom']) {
      sb.scrollTop = where === 'top' ? 0 : sb.scrollHeight; await sleep(50);
      const gr = g.getBoundingClientRect(), sr = sb.getBoundingClientRect(), tr = tabs.getBoundingClientRect();
      check('Générer in the bottom bar, scrolled ' + where, gr.bottom <= window.innerHeight + 1 && gr.top >= window.innerHeight - 60 && gr.top >= sr.bottom - 1 && document.elementFromPoint(gr.left + gr.width / 2, gr.top + gr.height / 2)?.closest('#btn-generate') !== null, JSON.stringify([gr.top, gr.bottom, sr.bottom]));
      check('tabs at the bottom of the panel, above the bar, scrolled ' + where, tr.bottom <= gr.top + 1 && tr.top >= sr.top && tr.bottom <= sr.bottom + 1, JSON.stringify([tr.top, tr.bottom, gr.top]));
    }
    sb.scrollTop = 0;
    $('tab-fabric').click();
    check('Tissu content above the bottom block', shown($('thread-type')) && $('thread-type').getBoundingClientRect().bottom <= tabs.getBoundingClientRect().top);
    $('tab-pattern').click();
  } else {
    check('no ⋯ on wide screens', !shown($('btn-menu-more')));
  }

  // English labels
  setLanguage('en');
  check('English modes', studio.textContent.includes('Studio') && board.textContent.includes('Board') && $('btn-patchwork-new').textContent === 'New batch');
  setLanguage('fr');
  check('no horizontal overflow', document.documentElement.scrollWidth <= vw);
  check('no alert', alerts.length === 0);
  const p = document.createElement('pre'); p.id = 'bench-out'; p.style.display = 'none'; p.textContent = results.join('\n'); document.body.appendChild(p);
}
(function wait(n) {
  if (window.drawingContext && tartanStripes.length) run().catch(e => { const p = document.createElement('pre'); p.id = 'bench-out'; p.textContent = results.join('\n') + '\nFAIL crash ' + e.stack; document.body.appendChild(p); });
  else if (n > 0) setTimeout(() => wait(n - 1), 50);
})(200);
