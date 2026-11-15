// Preparing an application to the Scottish Register of Tartans, through the real page.
window.alerts = [];
window.alert = m => window.alerts.push(m);
const results = [];
const check = (n, ok, d) => results.push((ok ? 'PASS ' : 'FAIL ') + n + (d !== undefined ? ' -> ' + d : ''));
window.addEventListener('error', e => results.push('FAIL pageError ' + e.message));
const $ = id => document.getElementById(id);
const key = (k) => document.body.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true }));
const shown = () => getComputedStyle($('register-modal')).display !== 'none';
const regBody = () => $('register-body');
const wait = ms => new Promise(r => setTimeout(r, ms));

async function run() {
  try { localStorage.removeItem('tartanRegisterDraft'); } catch (e) { /* storage blocked */ }
  // Symmetric, 104 threads, the later pivot first: W/4 K40 B/20
  tartanStripes = [{ code: 'W', hex: '#FFFFFF', count: 4 }, { code: 'K', hex: '#101010', count: 40 }, { code: 'B', hex: '#000064', count: 20 }];
  userPalette = paletteFromStripes(tartanStripes);
  $('check-sym').checked = true;
  updateGeneratedListUI();
  check('closed at load', !shown());

  const btn = $('btn-register-guide');
  check('entry in the Export menu', !!btn && btn.closest('#menu-export') !== null);
  $('btn-menu-export').click();
  btn.focus(); btn.click();
  check('opens', shown());
  check('menu closes', $('menu-export').hidden);
  check('focus on print', document.activeElement === $('btn-register-print'));
  check('title', $('register-title').textContent === "Préparer une demande d'enregistrement");
  check('five sections', regBody().querySelectorAll('h3').length === 5, regBody().querySelectorAll('h3').length);

  // 1. The code: earliest pivot first, brought to 6-7 inches
  const code = $('register-code').textContent;
  check('code starts with B', code.startsWith('B/'), code);
  check('code ends with W pivot', /W\/\d+$/.test(code), code);
  const threads = countSettThreads(prepareRegisterPattern(tartanStripes, true, true).stripes, true);
  check('resized into 240-260', threads >= 240 && threads <= 260, threads);
  check('resize offered and on', $('register-resize') && $('register-resize').checked);
  check('reorder explained', regBody().textContent.includes("vient en premier dans l'alphabet"));
  check('pattern itself untouched', tartanStripes[0].code === 'W' && tartanStripes[0].count === 4);
  $('register-resize').click();
  check('resize off gives the original size', $('register-code').textContent === 'B/20 K40 W/4', $('register-code').textContent);
  check('focus stays on the box', document.activeElement === $('register-resize'));
  $('register-resize').click();

  // 2. Colours and the palette for Compare Designs
  const rows = regBody().querySelectorAll('.sheet-table tbody tr');
  check('one row per colour', rows.length === 3, rows.length);
  const palette = $('register-palette').textContent;
  check('palette format', /^([A-Z]+=#[0-9A-F]{6}#[A-Z ]+;)+$/.test(palette), palette);
  check('palette has the three codes', ['W=', 'K=', 'B='].every(k => palette.includes(k)), palette);
  const links = [...regBody().querySelectorAll('a')];
  check('links go to the Register', links.length >= 4 && links.every(a => a.href.startsWith('https://www.tartanregister.gov.uk/')), links.map(a => a.href).join(' '));
  check('links open apart', links.every(a => a.target === '_blank' && a.rel.includes('noopener')));
  let copied = null;
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: t => { copied = t; return Promise.resolve(); } } });
  $('register-palette').parentElement.querySelector('.reg-copy').click();
  await wait(20);
  check('copy palette', copied === palette);
  $('register-code').parentElement.querySelector('.reg-copy').click();
  await wait(20);
  check('copy code', copied === $('register-code').textContent);
  check('copy feedback', $('register-code').parentElement.querySelector('.reg-copy').textContent.includes('✓'));

  // 3. The JPEG image
  let blob = null, name = null;
  const realDownload = window.downloadBlob;
  window.downloadBlob = (b, n) => { blob = b; name = n; };
  $('register-download').click();
  for (let i = 0; i < 40 && !blob; i++) await wait(50);
  window.downloadBlob = realDownload;
  check('image is a JPEG', blob && blob.type === 'image/jpeg', blob && blob.type);
  check('image file name', /\.jpg$/.test(name || ''), name);
  if (blob) {
    const url = await new Promise(r => { const f = new FileReader(); f.onload = () => r(f.result); f.readAsDataURL(blob); });
    const img = new Image();
    await new Promise(r => { img.onload = r; img.onerror = r; img.src = url; });
    check('image square, one sett, about 1500 px', img.width === img.height && img.width % threads === 0 && img.width >= 1400 && img.width <= 1600, img.width);
  }

  // 4. The designer's part: counters, category hint, kept on the device
  const nameInput = $('register-name');
  check('name limited to 200', nameInput.maxLength === 200);
  nameInput.value = 'Test Tartan';
  nameInput.dispatchEvent(new Event('input'));
  check('name counter', nameInput.parentElement.querySelector('.reg-count').textContent === '11 / 200 caractères');
  const rationale = $('register-rationale');
  check('rationale limited to 1000', rationale.maxLength === 1000);
  rationale.value = 'Une ligne\net une autre';
  rationale.dispatchEvent(new Event('input'));
  check('rationale copied for print', rationale.parentElement.querySelector('.reg-print-text').textContent === 'Une ligne\net une autre');
  const cat = $('register-category');
  check('nine categories', cat.options.length === 9);
  check('fashion by default', cat.value === 'fashion');
  cat.value = 'name';
  cat.dispatchEvent(new Event('change'));
  check('category hint follows', cat.parentElement.querySelector('.reg-hint').textContent.includes('(Personal)'));
  const id = generationID;
  nameInput.focus();
  key('g');
  check('typing does not generate', generationID === id);

  // 5. Checklist
  const todo = $('register-checklist').textContent;
  check('fee and date', todo.includes('150 £') && todo.includes('15 novembre 2026'));
  check('four weeks', todo.includes('quatre semaines'));

  // Print shows only this page
  let printed = 0;
  window.print = () => { printed++; };
  $('btn-register-print').click();
  check('print button', printed === 1);

  key('Escape');
  check('Escape closes', !shown());
  check('focus back to Export', document.activeElement === $('btn-menu-export'));
  btn.click();
  check('draft kept', $('register-name').value === 'Test Tartan' && $('register-category').value === 'name');
  $('register-modal').click();
  check('click outside closes', !shown());
  btn.click();
  regBody().click();
  check('click inside does not close', shown());
  $('btn-register-close').click();
  check('close button', !shown());

  // A repeating sett is turned, and hostile codes stay text
  tartanStripes = [{ code: 'K', hex: '#101010', count: 100 }, { code: '<img>', hex: '#C80000', count: 60 }, { code: 'B', hex: '#000064', count: 50 }, { code: 'K', hex: '#101010', count: 40 }];
  userPalette = paletteFromStripes(tartanStripes);
  $('check-sym').checked = false;
  btn.click();
  check('repeating code turned', $('register-code').textContent === '...<img>60 B50 K140...', $('register-code').textContent);
  check('codes are text', !regBody().querySelector('img'));
  check('in range: no resize box', !$('register-resize') && regBody().textContent.includes('250 fils'));
  $('btn-register-close').click();

  setLanguage('en');
  tartanStripes = [{ code: 'R', hex: '#C80000', count: 48 }, { code: 'K', hex: '#101010', count: 12 }];
  userPalette = paletteFromStripes(tartanStripes);
  $('check-sym').checked = true;
  btn.click();
  check('English page', $('register-title').textContent === 'Prepare a registration application' && $('register-checklist').textContent.includes('£150'));
  $('btn-register-close').click();
  setLanguage('fr');
  try { localStorage.removeItem('tartanRegisterDraft'); } catch (e) { /* storage blocked */ }
  check('no alert', alerts.length === 0);
  const p = document.createElement('pre'); p.id = 'bench-out'; p.style.display = 'none'; p.textContent = results.join('\n'); document.body.appendChild(p);
}
(function start(n) {
  if (window.drawingContext && tartanStripes.length) run().catch(e => { const p = document.createElement('pre'); p.id = 'bench-out'; p.textContent = results.join('\n') + '\nFAIL crash ' + e.stack; document.body.appendChild(p); });
  else if (n > 0) setTimeout(() => start(n - 1), 50);
})(200);
