// SVG export: the vector repeat must match the app's own weave, pixel for pixel.
window.alert = () => {};
const results = [];
const check = (n, ok, d) => results.push((ok ? 'PASS ' : 'FAIL ') + n + (d !== undefined ? ' -> ' + d : ''));
window.addEventListener('error', e => results.push('FAIL pageError ' + e.message));

const downloads = [];
const realCreate = URL.createObjectURL.bind(URL);
URL.createObjectURL = blob => { const u = realCreate(blob); downloads.push({ url: u, blob }); return u; };
HTMLAnchorElement.prototype.click = function () { const d = downloads.find(x => x.url === this.href); if (d) d.name = this.download; };
const sleep = ms => new Promise(r => setTimeout(r, ms));

// Blobs go through a data: URL: the page's Content-Security-Policy does not let images load from blob:
const asDataUrl = blob => new Promise(res => { const r = new FileReader(); r.onload = () => res(r.result); r.readAsDataURL(blob); });
const loadImage = src => new Promise(res => { const i = new Image(); i.onload = () => res(i); i.onerror = () => res(null); i.src = src; });

async function compare(name, stripes, sym, isZ) {
  const svg = buildTartanSVG(stripes, sym, isZ, 1.11);
  const P = getWeavePeriod(countSettThreads(stripes, sym));
  // Render at 1 px per thread (the file itself is sized in mm)
  const px = svg.replace(/width="[\d.]+mm" height="[\d.]+mm"/, 'width="' + P + '" height="' + P + '"');
  if (px === svg) return check(name + ': mm size found', false);
  const img = await loadImage('data:image/svg+xml;charset=utf-8,' + encodeURIComponent(px));
  if (!img) return check(name + ': SVG loads', false);
  const cv = document.createElement('canvas'); cv.width = P; cv.height = P;
  const ctx = cv.getContext('2d'); ctx.imageSmoothingEnabled = false;
  ctx.drawImage(img, 0, 0, P, P);
  const got = new Uint32Array(ctx.getImageData(0, 0, P, P).data.buffer);
  const want = new Uint32Array(P * P);
  fillTwillPixels(want, P, P, buildThreadColors(stripes, sym, P), isZ);
  let diff = 0; for (let i = 0; i < want.length; i++) if (got[i] !== want[i]) diff++;
  check(`${name}: SVG matches the weave pixel for pixel`, diff === 0, `${diff}/${want.length} px differ, period ${P}, ${svg.length} bytes`);
}

const S = (spec) => spec.split(' ').map(t => { const [hex, count] = t.split(':'); return { code: 'X', hex: '#' + hex, count: +count }; });

async function run() {
  await compare('symmetric Z', S('C80000:24 000064:6 101010:12 FFE600:2 006400:20'), true, true);
  await compare('symmetric S', S('C80000:24 000064:6 101010:12 FFE600:2 006400:20'), true, false);
  await compare('asymmetric Z, sett not a multiple of 4', S('C80000:13 FFFFFF:3 101010:7'), false, true);
  await compare('asymmetric S, odd sett', S('C80000:5 006400:4'), false, false);
  await compare('two-color check', S('000000:8 FFFFFF:8'), true, true);

  // Real size and metadata
  const svg = buildTartanSVG(S('C80000:24 101010:16'), true, true, 0.5);
  const P = getWeavePeriod(countSettThreads(S('C80000:24 101010:16'), true));
  check('size is in mm from the thread diameter', svg.includes(`width="${P * 0.5}mm"`) && svg.includes(`viewBox="0 0 ${P} ${P}"`), `${P} threads`);
  check('file stays small for a big sett', buildTartanSVG(S('C80000:400 101010:300 FFFFFF:200'), true, true, 1).length < 5000);

  // Button and "export all"
  const btn = document.getElementById('btn-export-svg');
  check('SVG button has a translated tooltip', !!btn && btn.title.length > 10, btn && btn.title);
  setLanguage('en'); check('tooltip in English', btn.title.startsWith('One full repeat')); setLanguage('fr');
  downloads.length = 0;
  btn.click();
  const d = downloads.find(x => x.name && x.name.endsWith('.svg'));
  check('SVG button downloads a .svg', !!d && d.blob.type === 'image/svg+xml', d && d.name);
  if (d) {
    const text = await d.blob.text();
    check('downloaded SVG is the current pattern', text.includes(buildSRTCode(tartanStripes, domElements.sym.checked).replace(/[<>&"]/g, '')));
    const ok = await loadImage(await asDataUrl(d.blob));
    check('downloaded SVG opens as an image', !!ok);
  }
  downloads.length = 0;
  exportAll();
  await sleep(1500);
  const names = downloads.filter(x => x.name).map(x => x.name.split('.').pop()).sort().join();
  check('"Exporter tout" now includes the SVG', names.includes('svg') && names.includes('txt'), names);

  const p = document.createElement('pre'); p.id = 'bench-out'; p.textContent = results.join('\n'); document.body.appendChild(p);
}
(function wait(n) {
  if (window.drawingContext && tartanStripes.length) run().catch(e => { const p = document.createElement('pre'); p.id = 'bench-out'; p.textContent = results.join('\n') + '\nFAIL crash ' + e.stack; document.body.appendChild(p); });
  else if (n > 0) setTimeout(() => wait(n - 1), 50);
})(200);
