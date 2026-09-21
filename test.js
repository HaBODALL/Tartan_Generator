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
    eval(code);
} catch (e) {
    // Ignore p5 initialization errors, we just want to test pure functions
}

function assertEqual(actual, expected, message) {
    if (actual !== expected) {
        throw new Error(`TEST FAILED: ${message}\nExpected: ${expected}\nActual:   ${actual}`);
    }
    console.info(`✅ ${message}`);
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
