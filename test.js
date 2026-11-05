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
