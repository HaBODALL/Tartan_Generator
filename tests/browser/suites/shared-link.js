// Shared link, through the real page. The runner opens the page with the link in the URL.
window.alerts = [];
window.alert = m => window.alerts.push(m);
const results = [];
const check = (n, ok, d) => results.push((ok ? 'PASS ' : 'FAIL ') + n + (d !== undefined ? ' -> ' + d : ''));
window.addEventListener('error', e => results.push('FAIL pageError ' + e.message));
const $ = id => document.getElementById(id);
const fire = (el, type) => el.dispatchEvent(new Event(type, { bubbles: true }));
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function run() {
  // Opened from the URL (see the hash in the launch command)
  check('pattern comes from the link', buildSRTCode(tartanStripes, $('check-sym').checked) === 'R/48 B8 K/12', buildSRTCode(tartanStripes, $('check-sym').checked));
  check('exact shade', tartanStripes[0].hex === '#C80000');
  check('settings from the link', $('check-sym').checked && $('weave-s').checked && $('in-threadmm').value === '0.7' && $('effect-relief').checked && $('relief-strength').value === '150' && $('yarn-irregular').checked);
  check('id from the link', generationID === 4242);
  check('thread type becomes custom', $('thread-type').value === 'custom');
  check('URL cleaned', location.hash === '', location.hash);
  check('palette from the stripes', userPalette.length === 3 && userPalette[0].name === 'Red', JSON.stringify(userPalette[0]));
  check('saved', JSON.parse(localStorage.getItem('tartanGeneratorState')).generationID === 4242);
  check('nothing useless in the history on a first visit', historyStack.length === 0, historyStack.length);

  // Copy button
  let copied = null;
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: t => { copied = t; return Promise.resolve(); } } });
  $('btn-share-link').click();
  await sleep(20);
  check('link copied', copied && copied.includes('#tartan=1&') && copied.includes('s=R.C80000.48_'), copied);
  check('confirmation shown', $('app-message').textContent.includes('copié'));

  // Open another link in the same page
  const srtBefore = buildSRTCode(tartanStripes, true);
  location.hash = 'tartan=1&sym=0&z=1&mm=0.4&id=99&s=K.101010.10_W.FFFFFF.20_K.101010.6';
  await sleep(50);
  check('pasted link opens', generationID === 99 && !$('check-sym').checked && tartanStripes.length === 3);
  check('relief off when the link has none', !$('effect-relief').checked);
  check('previous pattern is in the history', historyStack.length === 1);
  check('URL cleaned again', location.hash === '');
  undo();
  check('undo brings it back', buildSRTCode(tartanStripes, true) === srtBefore && generationID === 4242);

  // The copied link round trips
  const again = decodeSharedPattern(copied.split('#')[1]);
  check('copied link decodes', again && again.relief === 1.5 && again.yarn === true && again.threadMm === 0.7);

  // Bad link
  const id = generationID;
  location.hash = 'tartan=1&s=broken';
  await sleep(50);
  check('bad link leaves the pattern', generationID === id);
  check('bad link is announced', $('app-message').textContent.includes('invalide'), $('app-message').textContent);
  location.hash = 'something-else';
  await sleep(50);
  check('other anchors are left alone', location.hash === '#something-else');
  location.hash = '';

  // Clipboard refused: manual copy
  let prompted = null;
  window.prompt = (m, v) => { prompted = v; };
  navigator.clipboard.writeText = () => Promise.reject(new Error('no'));
  $('btn-share-link').click();
  await sleep(20);
  check('manual copy when the clipboard is refused', prompted && prompted.includes('#tartan=1&'));

  setLanguage('en');
  check('English button', $('btn-share-link').textContent.includes('Copy the link'));
  setLanguage('fr');
  check('no alert', alerts.length === 0);
  const p = document.createElement('pre'); p.id = 'bench-out'; p.style.display = 'none'; p.textContent = results.join('\n'); document.body.appendChild(p);
}
(function wait(n) {
  if (window.drawingContext && tartanStripes.length) run().catch(e => { const p = document.createElement('pre'); p.id = 'bench-out'; p.textContent = results.join('\n') + '\nFAIL crash ' + e.stack; document.body.appendChild(p); });
  else if (n > 0) setTimeout(() => wait(n - 1), 50);
})(200);
