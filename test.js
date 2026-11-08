const fs = require('fs');

// Read the code
let code = fs.readFileSync('Random_Tartan_Generator.js', 'utf8');

// Quick mock for browser environment
global.window = {};
global.document = {
    addEventListener: () => {},
    getElementById: () => null,
    querySelector: () => null,
    createElement: () => ({ style: {} })
};
global.random = () => 0.5;
global.console = { log: () => {}, warn: () => {}, error: () => {} };
global.TRANSLATIONS = { fr: {}, en: {} };

// Evaluate the code to make functions available
try {
    const vm = require('vm');
    vm.runInThisContext(code);
} catch (e) {
    // Ignore p5 initialization errors, we just want to test pure functions
}

function assertEqual(actual, expected, message) {
    if (actual !== expected) {
        throw new Error(`TEST FAILED: ${message}\nExpected: ${expected}\nActual:   ${actual}`);
    }
    console.info(`✅ ${message}`);
}

function assertSilent(condition, message) {
    if (!condition) throw new Error(`TEST FAILED: ${message}`);
}

function runTests() {
    let failed = 0;
    const testCases = [
        () => {
            // Test formatColorLabel
            const color1 = { name: 'Red', code: 'R', variant: null };
            assertEqual(formatColorLabel(color1), 'Red (R)', 'formatColorLabel without variant');
            const color2 = { name: 'Dark Blue', code: 'DB', variant: 2 };
            assertEqual(formatColorLabel(color2), 'Dark Blue 2 (DB)', 'formatColorLabel with variant');
        },
        () => {
            // Test buildSRTCode
            const stripes = [
                { code: 'B', count: 24 },
                { code: 'W', count: 4 },
                { code: 'K', count: 24 }
            ];
            assertEqual(buildSRTCode(stripes, true), 'B/24 W4 K/24', 'buildSRTCode symmetric');
            assertEqual(buildSRTCode(stripes, false), '...B24 W4 K24...', 'buildSRTCode asymmetric');
        },
        () => {
            // Test buildInkStitchCode
            const stripes = [
                { hex: '#0000FF', count: 24 },
                { hex: '#FFFFFF', count: 4 }
            ];
            assertEqual(buildInkStitchCode(stripes, true), '(#0000FF)/24 (#FFFFFF)/4', 'buildInkStitchCode symmetric');
            assertEqual(buildInkStitchCode(stripes, false), '...(#0000FF)24 (#FFFFFF)4...', 'buildInkStitchCode asymmetric');
        },
        () => {
            // Test getFormattedDate
            const dateStr = getFormattedDate();
            if (!/^\d{4}_\d{2}_\d{2}$/.test(dateStr)) {
                throw new Error(`TEST FAILED: getFormattedDate format incorrect, got ${dateStr}`);
            }
            console.info(`✅ getFormattedDate format correct`);
        },
        () => {
            // Test shuffleArray
            const arr = [1, 2, 3, 4, 5];
            const original = [...arr];
            shuffleArray(arr);
            if (arr.length !== original.length) {
                throw new Error('TEST FAILED: shuffleArray changed length');
            }
            const hasAllElements = original.every(el => arr.includes(el));
            if (!hasAllElements) {
                throw new Error('TEST FAILED: shuffleArray lost elements');
            }
            console.info(`✅ shuffleArray works`);
        },
        () => {
            // Test countSettThreads / getWeavePeriod
            const stripes = [{ count: 4 }, { count: 6 }, { count: 2 }];
            assertEqual(countSettThreads(stripes, false), 12, 'countSettThreads asymmetric');
            assertEqual(countSettThreads(stripes, true), 18, 'countSettThreads symmetric counts each pivot once');
            assertEqual(countSettThreads([{ count: 5 }], true), 5, 'countSettThreads single stripe');
            assertEqual(sumStripeThreads([{ count: 4 }, {}, { count: 2 }]), 6, 'sumStripeThreads ignores missing counts');
            // Royal Stewart: R/72 ... R/4 must not double either pivot
            const royal = [72, 8, 12, 2, 12, 2, 12, 24, 8, 2, 4].map(count => ({ count }));
            assertEqual(countSettThreads(royal, true), 240, 'countSettThreads Royal Stewart');
            assertEqual(getWeavePeriod(12), 12, 'getWeavePeriod multiple of 4');
            assertEqual(getWeavePeriod(22), 44, 'getWeavePeriod even');
            assertEqual(getWeavePeriod(7), 28, 'getWeavePeriod odd');
        },
        () => {
            // Test hexToPixel (ABGR, opaque)
            assertEqual(hexToPixel('#112233'), 0xFF332211, 'hexToPixel swaps channels');
        },
        () => {
            // Test buildThreadColors: order, mirroring and wrap-around
            const a = hexToPixel('#000001'), b = hexToPixel('#000002'), c = hexToPixel('#000003');
            const stripes = [{ hex: '#000001', count: 1 }, { hex: '#000002', count: 2 }, { hex: '#000003', count: 1 }];
            const sym = Array.from(buildThreadColors(stripes, true, 8)).join();
            assertEqual(sym, [a, b, b, c, b, b, a, b].join(), 'buildThreadColors mirrors and wraps without doubling pivots');
            const asym = Array.from(buildThreadColors(stripes, false, 6)).join();
            assertEqual(asym, [a, b, b, c, a, b].join(), 'buildThreadColors repeats');
            assertEqual(buildThreadColors([{ hex: '#000001', count: 1e9 }], false, 3).length, 3, 'buildThreadColors never expands past the request');
        },
        () => {
            // Test fillTwillPixels against the 2/2 twill rule, for both twists
            const threads = [10, 20, 30, 40, 50, 60];
            const rules = { Z: [2, 1, 0, 3], S: [2, 3, 0, 1] };
            for (const twist of ['Z', 'S']) {
                const pixels = new Uint32Array(36);
                fillTwillPixels(pixels, 6, 6, threads, twist === 'Z');
                for (let y = 0; y < 6; y++) {
                    for (let x = 0; x < 6; x++) {
                        const over = ((x - rules[twist][y % 4]) % 4 + 4) % 4 < 2;
                        if (pixels[y * 6 + x] !== (over ? threads[y] : threads[x])) {
                            throw new Error(`TEST FAILED: twill ${twist} wrong at ${x},${y}`);
                        }
                    }
                }
            }
            console.info('✅ fillTwillPixels follows the twill rule');
        },
        () => {
            // Test fillTwillRelief: same twill ownership as fillTwillPixels, shaded around the base color
            const colors = [hexToPixel('#FF0000'), hexToPixel('#00FF00'), hexToPixel('#0000FF'), hexToPixel('#FFFF00'), hexToPixel('#FF00FF')];
            const k = 6, w = 5, h = 5;
            for (const isZ of [true, false]) {
                const flat = new Uint32Array(w * h);
                fillTwillPixels(flat, w, h, colors, isZ);
                const relief = new Uint32Array(w * k * h * k);
                fillTwillRelief(relief, w, h, colors, isZ, k);
                for (let y = 0; y < h; y++) {
                    for (let x = 0; x < w; x++) {
                        const base = flat[y * w + x];
                        const centre = relief[(y * k + k / 2) * w * k + x * k + k / 2];
                        // Pure colors stay pure: the same channels are lit
                        const lit = p => [p & 0xFF, (p >>> 8) & 0xFF, (p >>> 16) & 0xFF].map(c => c > 0).join();
                        if (lit(centre) !== lit(base)) throw new Error(`TEST FAILED: relief owner wrong at ${x},${y}`);
                    }
                }
            }
            console.info('✅ fillTwillRelief keeps the twill');
            const masks = getReliefMasks(8);
            const level = (m, px, py) => masks[m][py * 8 + px];
            assertSilent(level(0, 3, 4) > level(0, 3, 0), 'relief is lighter in the middle of a thread');
            assertSilent(level(0, 7, 4) > level(0, 0, 4), 'relief darkens where a float dives under');
            assertSilent(level(2, 4, 3) > level(2, 0, 3), 'warp relief runs across x');
            console.info('✅ relief masks shade like a round yarn');
        },
        () => {
            // Test zoom helpers: limits, rounding, logarithmic slider
            assertEqual(clampZoom(0.1), 0.5, 'zoom minimum');
            assertEqual(clampZoom(99), 12, 'zoom maximum');
            assertEqual(clampZoom(2.34), 2.3, 'zoom rounds to one decimal');
            assertEqual(zoomToSlider(0.5), 0, 'slider start');
            assertEqual(zoomToSlider(12), 1000, 'slider end');
            assertSilent(sliderToZoom(500) > 2 && sliderToZoom(500) < 3, 'slider middle is a low zoom');
            for (const z of [0.5, 1, 2, 4.5, 8, 12]) {
                assertEqual(clampZoom(sliderToZoom(zoomToSlider(z))), z, `slider round trip for ${z}`);
            }
            console.info('✅ zoom helpers');
        },
        () => {
            // Test relief strength: 0% is flat, 200% has more contrast than 100%
            const spread = () => { const m = getReliefMasks(8)[0]; return Math.max(...m) - Math.min(...m); };
            const saved = domElements.reliefStrength;
            try {
                domElements.reliefStrength = { value: '100' };
                const normal = spread();
                domElements.reliefStrength = { value: '0' };
                assertEqual(spread(), 0, 'relief strength 0 is flat');
                domElements.reliefStrength = { value: '200' };
                assertSilent(spread() > normal, 'relief strength 200 has more contrast');
                domElements.reliefStrength = { value: '500' };
                assertEqual(readReliefStrength(), 2, 'relief strength is capped at 200%');
            } finally {
                domElements.reliefStrength = saved;
            }
            console.info('✅ relief strength scales the shading');
        },
        () => {
            // Test varyYarnColors: stable, within the spread, and actually varied
            const base = hexToPixel('#808080');
            const colors = new Uint32Array(200).fill(base);
            const a = varyYarnColors(colors), b = varyYarnColors(colors);
            assertSilent(a.every((p, i) => p === b[i]), 'yarn variation is the same on every redraw');
            const greys = [...a].map(p => p & 0xFF);
            assertSilent(greys.every(g => Math.abs(g - 128) <= Math.ceil(128 * YARN_VARIATION) + 1), 'yarn variation stays within its spread');
            assertSilent(new Set(greys).size > 5, 'yarn variation changes the threads');
            assertSilent(a.every(p => (p >>> 24) === 0xFF), 'yarn variation keeps colors opaque');
            console.info('✅ yarn irregularity is stable and subtle');
        },
        () => {
            // Test createStripes: widths even and within limits, sett respected, no identical neighbors
            const palette = ['R', 'G', 'B', 'K'].map(code => ({ code, hex: '#' + code }));
            for (let run = 0; run < 200; run++) {
                const params = { minW: 4, maxW: 40, targetStripes: 8, targetSett: 200, isCheckMode: false };
                const stripes = createStripes(params, palette);
                assertSilent(stripes.length >= 1 && stripes.length <= 8, 'createStripes stripe count');
                assertSilent(sumStripeThreads(stripes) <= 200, 'createStripes respects the sett');
                assertSilent(stripes.every(s => s.count % 2 === 0 && s.count >= 4 && s.count <= 40), 'createStripes widths');
                assertSilent(stripes.every((s, i) => i === 0 || s.code !== stripes[i - 1].code), 'createStripes neighbors differ');
            }
            const check = createStripes({ minW: 6, maxW: 6, targetStripes: 5, targetSett: 260, isCheckMode: true }, palette);
            assertEqual(new Set(check.map(s => s.count)).size, 1, 'createStripes check mode uses one width');
            console.info('✅ createStripes follows the settings');
        },
        () => {
            // Test random palettes: one shade per SRT code, so neighbors never share a code
            for (let run = 0; run < 300; run++) {
                const palette = pickRandomPalette();
                assertSilent(new Set(palette.map(c => c.code)).size === palette.length, 'random palette has distinct codes');
            }
            // Hand-picked shades of one code: neighbors still differ in color
            const reds = [{ code: 'R', hex: '#C80000' }, { code: 'R', hex: '#FF0000' }];
            for (let run = 0; run < 50; run++) {
                const stripes = createStripes({ minW: 4, maxW: 20, targetStripes: 8, targetSett: 200, isCheckMode: false }, reds);
                assertSilent(stripes.every((s, i) => i === 0 || s.hex !== stripes[i - 1].hex), 'shades of one code alternate');
            }
            console.info('✅ random palettes use one shade per code');
        },
        () => {
            // Test recolorStripes: same widths, new objects, no identical neighbors
            const palette = ['R', 'G'].map(code => ({ code, hex: '#' + code }));
            const source = [6, 4, 8, 2].map(count => ({ code: 'X', hex: '#X', count }));
            const out = recolorStripes(source, palette);
            assertEqual(out.map(s => s.count).join(), '6,4,8,2', 'recolorStripes keeps widths');
            assertEqual(source[0].code, 'X', 'recolorStripes leaves the source untouched');
            assertSilent(out.every((s, i) => i === 0 || s.code !== out[i - 1].code), 'recolorStripes neighbors differ');
        },
        () => {
            // Test buildTartanSVG: one repeat, sized in mm, one rectangle per stripe run
            const stripes = [{ code: 'R', hex: '#C80000', count: 24 }, { code: 'K', hex: '#101010', count: 6 }, { code: 'Y', hex: '#FFE600', count: 2 }];
            const svg = buildTartanSVG(stripes, true, true, 0.5);
            const period = getWeavePeriod(countSettThreads(stripes, true)); // 24+6+2+6 = 38 threads, repeat 76
            assertEqual(period, 76, 'SVG repeat');
            assertSilent(svg.includes('width="38mm"') && svg.includes('viewBox="0 0 76 76"'), 'SVG sized in mm');
            const warp = (svg.match(/height="76" fill="#/g) || []).length;
            const weft = (svg.match(/fill="url\(#weft/g) || []).length;
            assertEqual(warp, 8, 'SVG warp runs over two setts (R K Y K, twice)');
            assertEqual(weft, warp, 'SVG has as many weft runs as warp runs');
            assertEqual((svg.match(/<pattern /g) || []).length, 3, 'SVG has one twill pattern per color');
            console.info('✅ buildTartanSVG draws one repeat');
        },
        () => {
            // Test mergePinnedTiles: pinned tiles keep their place, the rest is replaced
            const old = ['a', 'b', 'c', 'd'].map((id, i) => ({ id, pinned: i === 1 || i === 3 }));
            const fresh = ['x', 'y', 'z'].map(id => ({ id, pinned: false }));
            assertEqual(mergePinnedTiles(old, fresh, 4).map(e => e.id).join(''), 'xbyd', 'pinned tiles stay in place');
            assertEqual(mergePinnedTiles(old, fresh, 2).map(e => e.id).join(''), 'bd', 'pinned tiles survive a smaller quantity');
            assertEqual(mergePinnedTiles(old, fresh, 5).map(e => e.id).join(''), 'xbydz', 'a larger quantity adds tiles at the end');
            assertEqual(mergePinnedTiles([], fresh, 3).map(e => e.id).join(''), 'xyz', 'no pins: all new');

            // Test createPatchworkVariant: each kind keeps what it promises
            const source = { symmetric: true, palette: [{ code: 'R', hex: '#C80000' }, { code: 'K', hex: '#101010' }, { code: 'W', hex: '#FFFFFF' }],
                stripes: [{ code: 'R', hex: '#C80000', count: 24 }, { code: 'K', hex: '#101010', count: 8 }, { code: 'W', hex: '#FFFFFF', count: 4 }] };
            for (let run = 0; run < 30; run++) {
                const widths = createPatchworkVariant(source, 0);
                assertSilent(widths.stripes.map(s => s.hex).join() === source.stripes.map(s => s.hex).join(), 'width variant keeps the colors');
                assertSilent(widths.stripes.every(s => s.count >= 2 && s.count % 2 === 0), 'width variant keeps even widths');
                for (const kind of [1, 2]) {
                    const v = createPatchworkVariant(source, kind);
                    assertSilent(v.stripes.map(s => s.count).join() === '24,8,4', 'color variant keeps the widths');
                    assertSilent(v.stripes.every((s, i) => i === 0 || s.code !== v.stripes[i - 1].code), 'color variant has no identical neighbors');
                    assertSilent(v.symmetric === true && v.pinned === false, 'variant keeps the symmetry and is not pinned');
                }
            }
            console.info('✅ patchwork pins and variants');
        },
        () => {
            // Test addColorToOneStripe: exactly one stripe changes, no duplicate neighbor, no color lost
            const make = () => ['R', 'G', 'R', 'B', 'G'].map(code => ({ code, hex: '#' + code, count: 4 }));
            const color = { code: 'K', hex: '#K' };
            for (let run = 0; run < 50; run++) {
                const stripes = make();
                assertSilent(addColorToOneStripe(stripes, color), 'addColorToOneStripe finds a stripe');
                const changed = stripes.filter((s, i) => s.code !== make()[i].code).length;
                assertSilent(changed === 1, 'addColorToOneStripe changes one stripe');
                ['R', 'G', 'B', 'K'].forEach(c => assertSilent(stripes.some(s => s.code === c), 'addColorToOneStripe keeps every color'));
            }
            const full = [{ code: 'K', hex: '#K' }, { code: 'R', hex: '#R' }, { code: 'K', hex: '#K' }];
            assertEqual(addColorToOneStripe(full, color), false, 'addColorToOneStripe leaves the pattern alone when no stripe fits');
        },
        () => {
            // Test replaceColorInStripes
            const c = code => ({ code, hex: '#' + code });
            const stripe = code => ({ ...c(code), count: 4 });
            const codes = list => list.map(s => s.code).join();

            const avoided = replaceColorInStripes(['R', 'X', 'G'].map(stripe), '#X', [c('R'), c('G'), c('B')]);
            assertEqual(codes(avoided), 'R,B,G', 'replaceColorInStripes avoids both neighbors');

            const consecutive = replaceColorInStripes(['R', 'X', 'X', 'G'].map(stripe), '#X', [c('R'), c('G'), c('B')]);
            assertEqual(consecutive.some((s, i) => i > 0 && s.hex === consecutive[i - 1].hex), false, 'replaceColorInStripes leaves no identical neighbors');

            const merged = replaceColorInStripes(['R', 'X', 'G'].map(stripe), '#X', [c('R'), c('G')]);
            assertEqual(merged.length, 2, 'replaceColorInStripes merges when there is no choice');
            assertEqual(merged.reduce((sum, s) => sum + s.count, 0), 12, 'replaceColorInStripes keeps the thread count');
        },
        () => {
            // Criteria board: one tile per combination, only the criterion changes
            const a = seededRandom(42), b = seededRandom(42);
            assertEqual(a(), b(), 'seededRandom repeats');
            const pal = ['R', 'G', 'B', 'K', 'W', 'Y'].map(code => ({ code, hex: '#' + code + '00000', name: code }));
            const params = { minW: 4, maxW: 64, targetStripes: 6, targetSett: 260, isCheckMode: false };
            const base = { palette: pal, defaultColors: 4, params, symmetric: false, seed: 7 };
            const grid = createCriteriaBatch({ ...base, xAxis: 'colors', yAxis: 'stripes' });
            assertEqual(grid.cols, 5, 'criteria grid columns');
            assertEqual(grid.batch.length, 25, 'criteria grid has every combination');
            assertSilent(grid.batch.every(e => e.palette.length <= e.criteria[0][1]), 'criteria tiles respect the color count');
            assertSilent(grid.batch.filter(e => e.criteria[1][1] === 4).every(e => e.stripes.length <= 4), 'criteria tiles respect the stripe count');
            assertEqual(createCriteriaBatch({ ...base, xAxis: 'sett', yAxis: 'none' }).batch.length, 5, 'one row without a second criterion');
            assertEqual(createCriteriaBatch({ ...base, xAxis: 'sett', yAxis: 'sett' }).batch.length, 5, 'same criterion twice gives one row');
            const setts = createCriteriaBatch({ ...base, xAxis: 'sett', yAxis: 'none' }).batch.map(e => sumStripeThreads(e.stripes));
            assertSilent(setts.every((s, i) => Math.abs(s - PATCHWORK_AXES.sett[i]) <= 12), 'criteria tiles reach the sett');
            const small = createCriteriaBatch({ ...base, params: { ...params, minW: 124, maxW: 124 }, xAxis: 'sett', yAxis: 'none' });
            assertSilent(small.batch.every(e => e.stripes.length > 0), 'a wide minimum still gives tiles');
            const two = createCriteriaBatch({ ...base, palette: pal.slice(0, 3), defaultColors: 3, xAxis: 'colors', yAxis: 'none' });
            assertEqual(two.cols, 2, 'color criterion is limited by the palette');
            console.info('✅ criteria board');
        }
    ];

    console.info("Running tests...\n");
    testCases.forEach(test => {
        try {
            test();
        } catch (e) {
            console.error(e.message);
            failed++;
        }
    });

    if (failed > 0) {
        console.error(`\n❌ ${failed} test(s) failed.`);
        process.exit(1);
    } else {
        console.info("\n🎉 All tests passed!");
    }
}

// Ensure original console is available for tests
global.console = require('console');
runTests();
