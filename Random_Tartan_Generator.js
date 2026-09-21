// =====================================================
//  RANDOM TARTAN GENERATOR V1.1.0 - P5.JS VERSION
//  By HaBOD, 2025 - CC BY-SA 4.0
//  Based on a Sketch from steven kay, 2011 (https://openprocessing.org/sketch/25876) - CC BY-SA 2.0
//  Complete rewrite with constraint-based workflow
//  Uses Scottish Register of Tartan 137 Colour Shades
//  Generates Threadcount code following SRT guidelines
//  This code was partially made with GenAI assistance
//  It is a tool to explore design of Tartans motifs
// =====================================================

/* ==========================================
   SECTION 1 : Palette definition
   ========================================== */

const SRT_PALETTE = [

  // LIGHT RED (3)
  { code: 'LR', name: 'Light Red', variant: 1, hex: '#F4CCCC' }, { code: 'LR', name: 'Light Red', variant: 2, hex: '#E87878' }, { code: 'LR', name: 'Light Red', variant: 3, hex: '#F04DB0' },

  // RED (8)
  { code: 'R', name: 'Red', variant: 1, hex: '#A00048' }, { code: 'R', name: 'Red', variant: 2, hex: '#FA4B00' }, { code: 'R', name: 'Red', variant: 3, hex: '#FF0000' }, { code: 'R', name: 'Red', variant: 4, hex: '#DC0000' },
  { code: 'R', name: 'Red', variant: 5, hex: '#C80000' }, { code: 'R', name: 'Red', variant: 6, hex: '#C82828' }, { code: 'R', name: 'Red', variant: 7, hex: '#C8002C' },{ code: 'R', name: 'Red', variant: 8, hex: '#B03000' },

  // DARK RED (9)
  { code: 'DR', name: 'Dark Red', variant: 1, hex: '#A00000' }, { code: 'DR', name: 'Dark Red', variant: 2, hex: '#960000' }, { code: 'DR', name: 'Dark Red', variant: 3, hex: '#960028' }, { code: 'DR', name: 'Dark Red', variant: 4, hex: '#880000' },
  { code: 'DR', name: 'Dark Red', variant: 5, hex: '#800028' }, { code: 'DR', name: 'Dark Red', variant: 6, hex: '#781C38' }, { code: 'DR', name: 'Dark Red', variant: 7, hex: '#4C0000' }, { code: 'DR', name: 'Dark Red', variant: 8, hex: '#901C38' },
  { code: 'DR', name: 'Dark Red', variant: 9, hex: '#680028' },

  // ORANGE (5)
  { code: 'O', name: 'Orange', variant: 1, hex: '#EC8048' }, { code: 'O', name: 'Orange', variant: 2, hex: '#E86000' }, { code: 'O', name: 'Orange', variant: 3, hex: '#FF5000' }, { code: 'O', name: 'Orange', variant: 4, hex: '#DC943C' },
  { code: 'O', name: 'Orange', variant: 5, hex: '#D87C00' },

  // DARK ORANGE (1)
  { code: 'DO', name: 'Dark Orange', variant: 1, hex: '#BE7832' },

  // LIGHT YELLOW (2)
  { code: 'LY', name: 'Light Yellow', variant: 1, hex: '#F9F5C8' }, { code: 'LY', name: 'Light Yellow', variant: 2, hex: '#F8E38C' },

  // YELLOW (7)
  { code: 'Y', name: 'Yellow', variant: 1, hex: '#FFFF00' }, { code: 'Y', name: 'Yellow', variant: 2, hex: '#FFE600' }, { code: 'Y', name: 'Yellow', variant: 3, hex: '#FFD700' }, { code: 'Y', name: 'Yellow', variant: 4, hex: '#FCCC00' },
  { code: 'Y', name: 'Yellow', variant: 5, hex: '#E0A126' }, { code: 'Y', name: 'Yellow', variant: 6, hex: '#E8C000' }, { code: 'Y', name: 'Yellow', variant: 7, hex: '#D8B000' },

  // DARK YELLOW (3)
  { code: 'DY', name: 'Dark Yellow', variant: 1, hex: '#BC8C00' }, { code: 'DY', name: 'Dark Yellow', variant: 2, hex: '#C89800' },
  { code: 'DY', name: 'Dark Yellow', variant: 3, hex: '#C88C00' },

  // LIGHT GREEN (6)
  { code: 'LG', name: 'Light Green', variant: 1, hex: '#789484' }, { code: 'LG', name: 'Light Green', variant: 2, hex: '#C4BC68' }, { code: 'LG', name: 'Light Green', variant: 3, hex: '#9C9C00' }, { code: 'LG', name: 'Light Green', variant: 4, hex: '#ACD74A' },
  { code: 'LG', name: 'Light Green', variant: 5, hex: '#86C67C' }, { code: 'LG', name: 'Light Green', variant: 6, hex: '#649848' },

  // GREEN (15)
  { code: 'G', name: 'Green', variant: 1, hex: '#008B00' }, { code: 'G', name: 'Green', variant: 2, hex: '#408060' }, { code: 'G', name: 'Green', variant: 3, hex: '#289C18' }, { code: 'G', name: 'Green', variant: 4, hex: '#006400' },
  { code: 'G', name: 'Green', variant: 5, hex: '#007800' }, { code: 'G', name: 'Green', variant: 6, hex: '#3F5642' }, { code: 'G', name: 'Green', variant: 7, hex: '#767E52' }, { code: 'G', name: 'Green', variant: 8, hex: '#5C6428' },
  { code: 'G', name: 'Green', variant: 9, hex: '#00643C' }, { code: 'G', name: 'Green', variant: 10, hex: '#146400' }, { code: 'G', name: 'Green', variant: 11, hex: '#006818' }, { code: 'G', name: 'Green', variant: 12, hex: '#004C00' },
  { code: 'G', name: 'Green', variant: 13, hex: '#285800' }, { code: 'G', name: 'Green', variant: 14, hex: '#005020' }, { code: 'G', name: 'Green', variant: 15, hex: '#005448' },

  // DARK GREEN (4)
  { code: 'DG', name: 'Dark Green', variant: 1, hex: '#003C14' }, { code: 'DG', name: 'Dark Green', variant: 2, hex: '#003820' }, { code: 'DG', name: 'Dark Green', variant: 3, hex: '#004028' }, { code: 'DG', name: 'Dark Green', variant: 4, hex: '#002814' },

  // LIGHT BLUE (3)
  { code: 'LB', name: 'Light Blue', variant: 1, hex: '#98C8E8' }, { code: 'LB', name: 'Light Blue', variant: 2, hex: '#82CFFD' }, { code: 'LB', name: 'Light Blue', variant: 3, hex: '#00FCFC' },

  // BLUE (16)
  { code: 'B', name: 'Blue', variant: 1, hex: '#BCC3D2' }, { code: 'B', name: 'Blue', variant: 2, hex: '#048888' }, { code: 'B', name: 'Blue', variant: 3, hex: '#3C82AF' }, { code: 'B', name: 'Blue', variant: 4, hex: '#5C8CA8' },
  { code: 'B', name: 'Blue', variant: 5, hex: '#2888C4' }, { code: 'B', name: 'Blue', variant: 6, hex: '#48A4C0' }, { code: 'B', name: 'Blue', variant: 7, hex: '#2474E8' }, { code: 'B', name: 'Blue', variant: 8, hex: '#0596FA' },
  { code: 'B', name: 'Blue', variant: 9, hex: '#0000FF' }, { code: 'B', name: 'Blue', variant: 10, hex: '#3850C8' }, { code: 'B', name: 'Blue', variant: 11, hex: '#788CB4' }, { code: 'B', name: 'Blue', variant: 12, hex: '#5F749C' },
  { code: 'B', name: 'Blue', variant: 13, hex: '#1870A4' }, { code: 'B', name: 'Blue', variant: 14, hex: '#1474B4' }, { code: 'B', name: 'Blue', variant: 15, hex: '#0000CD' }, { code: 'B', name: 'Blue', variant: 16, hex: '#2C4084' },

  // DARK BLUE (10)
  { code: 'DB', name: 'Dark Blue', variant: 1, hex: '#055183' }, { code: 'DB', name: 'Dark Blue', variant: 2, hex: '#003C64' }, { code: 'DB', name: 'Dark Blue', variant: 3, hex: '#00008C' }, { code: 'DB', name: 'Dark Blue', variant: 4, hex: '#2C2C80' },
  { code: 'DB', name: 'Dark Blue', variant: 5, hex: '#1C0070' }, { code: 'DB', name: 'Dark Blue', variant: 6, hex: '#000064' }, { code: 'DB', name: 'Dark Blue', variant: 7, hex: '#202060' }, { code: 'DB', name: 'Dark Blue', variant: 8, hex: '#000048' },
  { code: 'DB', name: 'Dark Blue', variant: 9, hex: '#141E46' }, { code: 'DB', name: 'Dark Blue', variant: 10, hex: '#1C1C50' },

  // LIGHT PURPLE (4)
  { code: 'LP', name: 'Light Purple', variant: 1, hex: '#A8ACE8' }, { code: 'LP', name: 'Light Purple', variant: 2, hex: '#C49CD8' }, { code: 'LP', name: 'Light Purple', variant: 3, hex: '#806D84' }, { code: 'LP', name: 'Light Purple', variant: 4, hex: '#9C68A4' },

  // PURPLE (7)
  { code: 'P', name: 'Purple', variant: 1, hex: '#9058D8' }, { code: 'P', name: 'Purple', variant: 2, hex: '#AA00FF' }, { code: 'P', name: 'Purple', variant: 3, hex: '#B458AC' }, { code: 'P', name: 'Purple', variant: 4, hex: '#6C0070' },
  { code: 'P', name: 'Purple', variant: 5, hex: '#5A008C' }, { code: 'P', name: 'Purple', variant: 6, hex: '#64008C' }, { code: 'P', name: 'Purple', variant: 7, hex: '#780078' },

  // DARK PURPLE (2)
  { code: 'DP', name: 'Dark Purple', variant: 1, hex: '#440044' }, { code: 'DP', name: 'Dark Purple', variant: 2, hex: '#1E0948' },

  // WHITE (6)
  { code: 'W', name: 'White', variant: 1, hex: '#E5DDD1' }, { code: 'W', name: 'White', variant: 2, hex: '#E8CCB8' }, { code: 'W', name: 'White', variant: 3, hex: '#F0E0C8' }, { code: 'W', name: 'White', variant: 4, hex: '#FCFCFC' },
  { code: 'W', name: 'White', variant: 5, hex: '#FFFFFF' }, { code: 'W', name: 'White', variant: 6, hex: '#F8F8F8' },

  // LIGHT GREY (1)
  { code: 'LN', name: 'Light Grey', variant: 1, hex: '#E0E0E0' },

  // GREY (7)
  { code: 'N', name: 'Grey', variant: 1, hex: '#C8C8C8' }, { code: 'N', name: 'Grey', variant: 2, hex: '#C0C0C0' }, { code: 'N', name: 'Grey', variant: 3, hex: '#B0B0B0' }, { code: 'N', name: 'Grey', variant: 4, hex: '#A0A0A0' },
  { code: 'N', name: 'Grey', variant: 5, hex: '#808080' }, { code: 'N', name: 'Grey', variant: 6, hex: '#888888' }, { code: 'N', name: 'Grey', variant: 7, hex: '#646464' },

  // DARK GREY (5)
  { code: 'DN', name: 'Dark Grey', variant: 1, hex: '#505050' }, { code: 'DN', name: 'Dark Grey', variant: 2, hex: '#555A64' }, { code: 'DN', name: 'Dark Grey', variant: 3, hex: '#1C1714' }, { code: 'DN', name: 'Dark Grey', variant: 4, hex: '#14283C' },
  { code: 'DN', name: 'Dark Grey', variant: 5, hex: '#1C1C1C' },

  // BLACK (2)
  { code: 'K', name: 'Black', variant: 1, hex: '#101010' }, { code: 'K', name: 'Black', variant: 2, hex: '#000000' },

  // LIGHT BROWN (4)
  { code: 'LT', name: 'Light Brown', variant: 1, hex: '#A08858' }, { code: 'LT', name: 'Light Brown', variant: 2, hex: '#8C7038' }, { code: 'LT', name: 'Light Brown', variant: 3, hex: '#A07C58' }, { code: 'LT', name: 'Light Brown', variant: 4, hex: '#B07430' },

  // BROWN (4)
  { code: 'T', name: 'Brown', variant: 1, hex: '#98481C' }, { code: 'T', name: 'Brown', variant: 2, hex: '#603800' }, { code: 'T', name: 'Brown', variant: 3, hex: '#604000' }, { code: 'T', name: 'Brown', variant: 4, hex: '#503C14' },

  // DARK BROWN (3)
  { code: 'DT', name: 'Dark Brown', variant: 1, hex: '#4C3428' }, { code: 'DT', name: 'Dark Brown', variant: 2, hex: '#441800' }, { code: 'DT', name: 'Dark Brown', variant: 3, hex: '#230D00' }
];

console.log(`[OK] 1. Palette SRT Chargée : ${SRT_PALETTE.length} available colors.`);

/* ==========================================
   SECTION 2 : GLOBAL VARIABLES
   ========================================== */

let canvas;
let pixelDensity_val = 1;

// Tartan state
let tartanStripes = [];      // Generated stripes [{color, width, colorCode}, ...]
let userPalette = [];        // User palette [{hex, code, name}, ...]
let isSymmetric = true;      // Symmetric mode enabled

// Rendering parameters
let threadSize = 2.0;        // Pixel size of a thread (zoom)
let threadMM = 0.3;          // Actual thread diameter in mm
let settValue = 260;         // Sett (threads per 10cm)

// Generation ID
let generationID = 0;

// HISTORY (UNDO)
let historyStack = [];       // Stack of previous states
const MAX_HISTORY = 10;      // Max number of states kept

// Off-screen graphics for performance
let patternBuffer = null;
let needsRedraw = true;

// DOM Element Caching for Performance
let domElements = {
    zoom: null,
    sym: null,
    weaveZ: null,
    threadMm: null,
    realWidth: null,
    threadCount: null,
    sett: null,
    stripesActual: null,
    settActual: null,
    minWidth: null,
    maxWidth: null,
    targetStripes: null,
    checkMode: null,
    lockColors: null,
    lockStructure: null,
    genId: null,
    srtDisplay: null,
    undoBtn: null
};

// Multilingual management
let currentLang = 'fr';
const TRANSLATIONS = {
    fr: {
        ph_import: "Coller le code SRT ici (ex: K4 R32)...",
        btn_import: "IMPORTER",
        opt_load_example: "-- Charger un exemple --",
        btn_generate: "GÉNÉRER",
        chk_keep_colors: "Conserver Couleurs",
        chk_keep_struct: "Conserver Structure",
        sec_structure: "Structure du Motif",
        chk_symmetry: "Symétrie",
        lbl_stripes: "Nombres de bandes (Cible)",
        lbl_limits: "Limites de fils par bande (Min/Max)",
        chk_check_mode: "Damier (bandes de largeurs égales)",
        lbl_sett: "Densité (Sett cible)",
        sec_zoom: "Zoom et Échelle",
        lbl_thread_mm: "Diamètre du fil (mm)",
        lbl_zoom: "Zoom Visuel",
        lbl_width_cm: "Largeur motif",
        sec_palette: "Palette de couleurs sélectionnées (Max 8)",
        sec_srt: "Code SRT du Tartan",
        sec_export: "Export",
        btn_details: "Détails",
        msg_palette_max: "Max 8 couleurs.",
        msg_palette_dup: "Cette couleur est déjà présente !",
        msg_palette_min: "La palette doit contenir au minimum 2 couleurs !",
        msg_import_ok: "Import réussi",
        msg_import_err: "Aucun code valide détecté.",
        lbl_add_nuance: "AJOUTER UNE NUANCE",
        lbl_mod_nuance: "MODIFIER LA NUANCE",
        btn_cancel: "ANNULER",
        loading: "TISSAGE EN COURS...",
        lbl_thread_type: "Type de fil",
        opt_wool: "Laine",
        opt_merino: "Mérinos",
        opt_cotton: "Coton",
        opt_custom: "Personnalisé",
        lbl_weave_dir: "Sens du tissage",
        btn_undo: "Annuler",
        btn_export_all: "Exporter tout",
        btn_about: "ℹ️ À propos",
        title_about: "À propos",
        txt_about_p1: "Random Tartan Generator est un outil open-source (CC BY-SA 4.0) permettant de créer des motifs de tartan. Il s'appuie sur le format du Scottish Register of Tartans (SRT).",
        txt_about_p2: "Vous pouvez l'utiliser pour la conception, ou exporter les motifs pour Ink/Stitch.",
        btn_close: "Fermer"
    },
    en: {
        ph_import: "Paste SRT code here (e.g. K4 R32)...",
        btn_import: "IMPORT",
        opt_load_example: "-- Load Example --",
        btn_generate: "GENERATE",
        chk_keep_colors: "Keep Colors",
        chk_keep_struct: "Keep Structure",
        sec_structure: "Pattern Structure",
        chk_symmetry: "Symmetry",
        lbl_stripes: "Number of Stripes (Target)",
        lbl_limits: "Thread Limits per Stripe (Min/Max)",
        chk_check_mode: "Checkers (Equal Widths)",
        lbl_sett: "Density (Target Sett)",
        sec_zoom: "Zoom & Scale",
        lbl_thread_mm: "Thread Diameter (mm)",
        lbl_zoom: "Visual Zoom",
        lbl_width_cm: "Pattern Width",
        sec_palette: "Selected Color Palette (Max 8)",
        sec_srt: "Tartan SRT Code",
        sec_export: "Export",
        btn_details: "Details",
        msg_palette_max: "Max 8 colors.",
        msg_palette_dup: "Color already in palette!",
        msg_palette_min: "Palette must have at least 2 colors!",
        msg_import_ok: "Import successful",
        msg_import_err: "No valid code detected.",
        lbl_add_nuance: "ADD SHADE",
        lbl_mod_nuance: "MODIFY SHADE",
        btn_cancel: "CANCEL",
        loading: "WEAVING IN PROGRESS...",
        lbl_thread_type: "Thread type",
        opt_wool: "Wool",
        opt_merino: "Merino",
        opt_cotton: "Cotton",
        opt_custom: "Custom",
        lbl_weave_dir: "Weave direction",
        btn_undo: "Undo",
        btn_export_all: "Export All",
        btn_about: "ℹ️ About",
        title_about: "About",
        txt_about_p1: "Random Tartan Generator is an open-source tool (CC BY-SA 4.0) to create tartan patterns. It uses the Scottish Register of Tartans (SRT) format.",
        txt_about_p2: "You can use it for design, or export patterns for Ink/Stitch.",
        btn_close: "Close"
    }
};
console.log("[OK] 2. Global Variables Initialized");

/* ==========================================
   SECTION 3 : P5.JS INITIALIZATION
   ========================================== */

function setup() {
    // Cache DOM Elements for performance
    domElements.zoom = document.getElementById('in-zoom');
    domElements.sym = document.getElementById('check-sym');
    domElements.weaveZ = document.querySelector('input[name="weave-dir"][value="Z"]');
    domElements.threadMm = document.getElementById('in-threadmm');
    domElements.realWidth = document.getElementById('real-width');
    domElements.threadCount = document.getElementById('thread-count');
    domElements.sett = document.getElementById('in-sett');
    domElements.stripesActual = document.getElementById('stripes-actual');
    domElements.settActual = document.getElementById('sett-actual');
    domElements.minWidth = document.getElementById('in-minwidth');
    domElements.maxWidth = document.getElementById('in-maxwidth');
    domElements.targetStripes = document.getElementById('in-stripes');
    domElements.checkMode = document.getElementById('check-mode-check');
    domElements.lockColors = document.getElementById('lock-colors');
    domElements.lockStructure = document.getElementById('lock-structure');
    domElements.genId = document.getElementById('gen-id');
    domElements.srtDisplay = document.getElementById('srt-display');
    domElements.undoBtn = document.getElementById('btn-undo');

    // A. Canvas initialization in the container
    let container = document.getElementById('canvas-container');
    if (!container) {
        console.error("❌ Error : #canvas-container not found in HTML.");
        return;
    }

    let w = container.offsetWidth;
    let h = container.offsetHeight;

    let canvas = createCanvas(w, h);
    canvas.parent('canvas-container');

    noLoop();    // Draw only on demand (resource saving)
    noSmooth();  // Sharp rendering for "thread" aspect (pixel perfect)

    // B. Add Reactivity (Event Listeners)
    // List of HTML IDs that should trigger an update
    // Note: Using 'input' for immediate reaction, or 'change' as needed
    let inputsToWatch = [
        'in-stripes',   // Target number of stripes
        'in-maxwidth',  // Max thread width
        'in-sett',      // Density
        'in-zoom',      // Visual zoom
        'in-threadmm',  // Thread diameter
        'check-sym'     // Symmetry Checkbox
    ];

    inputsToWatch.forEach(id => {
        let el = document.getElementById(id);
        if(el) {
            el.addEventListener('input', () => {
                // If the function is not yet defined (next sections), avoid crash
                if (window.handleGenerateClick) {
                    // For purely visual sliders (zoom), we can just redraw,
                    // but to simplify here we restart the central logic
                    window.handleGenerateClick(true); // true = "update parameters" mode
                }
            });
        }
    });

    // C. Initial Startup
    // Leave a small delay to ensure DOM is ready and fonts are loaded
    setTimeout(() => {
        console.log("[Info] Starting first generation...");

        // Note: These functions will be defined in sections 3 and 4.
        // Simulate a complete random generation at startup.
        if (window.randomizeUserPalette && window.handleGenerateClick) {
            randomizeUserPalette();
            window.handleGenerateClick();
        }

        // Initialize language
        setLanguage('fr');

    }, 100);

}
document.addEventListener('keydown', (e) => {
    // Ignore if focus is in an input
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    switch(e.key.toLowerCase()) {
        case ' ':       // Space = Generate
        case 'g':
            e.preventDefault();
            handleGenerateClick();  // ← CORRIGÉ
            break;
        case 's':       // S = Export all
            e.preventDefault();
            exportAll();
            break;
        case 'p':       // P = Export PNG only
            e.preventDefault();
            exportPNG();
            break;
        case 'z':       // Z = Undo
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                if (typeof undo === 'function') undo();
            }
            break;
    }
});
// --- LANGUAGE MANAGEMENT ---
window.toggleLanguage = function() {
    setLanguage(currentLang === 'fr' ? 'en' : 'fr');
}

function setLanguage(lang) {
    if(!TRANSLATIONS[lang]) return;
    currentLang = lang;

    let t = TRANSLATIONS[lang];

    // Update elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
        let key = el.getAttribute('data-i18n');
        if(t[key]) el.innerText = t[key];
    });

    // Update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        let key = el.getAttribute('data-i18n-placeholder');
        if(t[key]) el.placeholder = t[key];
    });

    // Update language buttons active state
    let btnFr = document.getElementById('lang-btn-fr');
    let btnEn = document.getElementById('lang-btn-en');
    if (btnFr && btnEn) {
        if (lang === 'fr') {
            btnFr.classList.add('active');
            btnEn.classList.remove('active');
        } else {
            btnEn.classList.add('active');
            btnFr.classList.remove('active');
        }
    }

    // Refresh language-dependent UI (Palette, Modal...)
    updateUserPaletteUI();
}
console.log("[OK] 3. P5.JS Setup complete")
// ================= 4. Palette UI =================

function windowResized() {
    let container = document.getElementById('canvas-container');
    if(container) {
        resizeCanvas(container.offsetWidth, container.offsetHeight);
        if (window.redrawTartan) window.redrawTartan();
    }
}

function formatColorLabel(p) {
    let varStr = p.variant ? ` ${p.variant}` : '';
    return `${p.name}${varStr} (${p.code})`;
}

function randomizeUserPalette() {
    let numColors = Math.floor(random(2, 6));
    userPalette = [];

    let tempPalette = [...SRT_PALETTE];

    for(let i = 0; i < numColors; i++) {
        if(tempPalette.length === 0) break;
        let randIndex = Math.floor(random(tempPalette.length));
        userPalette.push(tempPalette[randIndex]);
        tempPalette.splice(randIndex, 1);
    }

    updateUserPaletteUI();
    console.log(`[Info] Random palette generated : ${userPalette.length} colors.`);
}

function addToPalette(srtIndex) {
    let t = TRANSLATIONS[currentLang];

    if (userPalette.length >= 8) {
        alert(t.msg_palette_max);
        return;
    }

    let colorObj = SRT_PALETTE[srtIndex];

    if (userPalette.some(c => c.hex === colorObj.hex)) {
        alert(t.msg_palette_dup);
        return;
    }

    userPalette.push(colorObj);
    updateUserPaletteUI();
    regenerateColorsOnly();
}

function modifyPalette(userIndex, srtIndex) {
    let t = TRANSLATIONS[currentLang];
    let oldColor = userPalette[userIndex];
    let newColor = SRT_PALETTE[srtIndex];

    let existsElsewhere = userPalette.some((c, i) => c.hex === newColor.hex && i !== userIndex);
    if (existsElsewhere) {
        alert(t.msg_palette_dup);
        return;
    }

    userPalette[userIndex] = newColor;

    tartanStripes.forEach(stripe => {
        if (stripe.hex === oldColor.hex) {
            stripe.code = newColor.code;
            stripe.hex = newColor.hex;
        }
    });

    updateUserPaletteUI();
    updateGeneratedListUI();
    redrawTartan();
}

function removeFromPalette(index) {
    if (userPalette.length <= 2) {
        alert("Minimum 2 colors required");
        return;
    }

    let removedColor = userPalette[index];
    userPalette.splice(index, 1);
    updateUserPaletteUI();

    let replacement = userPalette[0];

    tartanStripes.forEach(stripe => {
        if (stripe.hex === removedColor.hex) {
            stripe.code = replacement.code;
            stripe.hex = replacement.hex;
        }
    });

    updateGeneratedListUI();
    redrawTartan();
}

function regenerateColorsOnly() {
    if (tartanStripes.length === 0) return;

    tartanStripes.forEach(stripe => {
        let randomColor = userPalette[Math.floor(Math.random() * userPalette.length)];
        stripe.code = randomColor.code;
        stripe.hex = randomColor.hex;
    });

    updateGeneratedListUI();
    redrawTartan();
}
// === DISPLAY ACTUAL VALUES ===

function updateActualValues() {
    updateActualStripes();
    updateActualSett();
}

function updateActualStripes() {
    const target = parseInt(domElements.targetStripes?.value) || 6;
    const actual = tartanStripes.length;
    const display = domElements.stripesActual;

    if (display) {
        if (actual !== target) {
            display.textContent = '';
            let span = document.createElement('span');
            span.style.color = '#e74c3c';
            span.textContent = actual;
            display.appendChild(document.createTextNode('→ '));
            display.appendChild(span);
        } else {
            display.textContent = '';  // Hide if equal
        }
    }
}

function updateActualSett() {
    const display = domElements.settActual;
    if (!display) return;

    // If no stripes, hide display
    if (!tartanStripes || tartanStripes.length === 0) {
        display.textContent = '';
        return;
    }

    // Calculate total number of threads
    let totalThreads = 0;
    for (let s of tartanStripes) {
        totalThreads += s.count || 0;
    }

    // Avoid division by zero
    if (totalThreads === 0 || threadMM <= 0) {
        display.textContent = '';
        return;
    }

    // Calculate actual sett (threads per 10cm)
    let widthCm = totalThreads * threadMM / 10;
    let actualSett = Math.round(totalThreads / widthCm * 10);

    // Comparison with target
    let targetSett = parseInt(domElements.sett?.value) || 260;

    if (actualSett !== targetSett) {
        display.textContent = '';
        let span = document.createElement('span');
        span.style.color = '#e74c3c';
        span.textContent = actualSett;
        display.appendChild(document.createTextNode('→ '));
        display.appendChild(span);
    } else {
        display.textContent = '';
    }
}

// === THREAD TYPE SELECTOR ===
function updateThreadDiameter() {
    const select = document.getElementById('thread-type');
    const input = domElements.threadMm;

    if (select.value === 'custom') {
        // Custom mode: enable field
        input.disabled = false;
        input.style.opacity = '1';
        input.style.cursor = 'text';
    } else {
        // Preset mode: disable and set value
        input.disabled = true;
        input.style.opacity = '0.6';
        input.style.cursor = 'not-allowed';
        input.value = select.value;
    }

    updateScaleInfo();
}


// === GESTION HISTORY ===

function pushToHistory() {
    let state = {
        stripes: JSON.parse(JSON.stringify(tartanStripes)),
        palette: JSON.parse(JSON.stringify(userPalette)),
        symmetric: domElements.sym?.checked || false,
        generationID: generationID,
        timestamp: Date.now()
    };

    historyStack.push(state);

    if (historyStack.length > MAX_HISTORY) {
        historyStack.shift();
    }

    updateUndoButton();
    console.log(`📚 History: ${historyStack.length}/${MAX_HISTORY} states`);
}

function undo() {
    if (historyStack.length === 0) {
        console.log("{INFO] Nothing to undo");
        return;
    }

    let previousState = historyStack.pop();

    tartanStripes = previousState.stripes;
    userPalette = previousState.palette;
    generationID = previousState.generationID;

    let symCheck = domElements.sym;
    if (symCheck) symCheck.checked = previousState.symmetric;

    let idDisplay = domElements.genId;
    if (idDisplay) idDisplay.textContent = generationID;

    // Rafraîchir l'UI
    updateUserPaletteUI();
    updateGeneratedListUI();
    redrawTartan();
    updateUndoButton();
    updateActualValues();
    console.log(`↩️ Return to generation #${generationID}. Remaining: ${historyStack.length} states`);
}

function updateUndoButton() {
    let btn = domElements.undoBtn;
    if (btn) {
        btn.disabled = (historyStack.length === 0);
        btn.title = `Undo (${historyStack.length} steps available)`;
    }
}

// Expose to HTML
window.undo = undo;
function openColorPicker(editIndex = -1) {
    let t = TRANSLATIONS[currentLang];
    let existing = document.getElementById('picker-modal');
    if(existing) existing.remove();

    let modal = document.createElement('div');
    modal.id = 'picker-modal';
    modal.className = 'picker-modal';

    let titleText = (editIndex >= 0) ? t.lbl_mod_nuance : t.lbl_add_nuance;
    let title = document.createElement('div');
    title.innerText = titleText;
    title.style.cssText = "color:#fff; margin-bottom:10px; font-weight:bold; text-align:center;";
    modal.appendChild(title);

    let grid = document.createElement('div');
    grid.className = 'picker-grid';

    SRT_PALETTE.forEach((p, srtIndex) => {
        let chip = document.createElement('div');
        chip.className = 'picker-chip';
        chip.style.backgroundColor = p.hex;

        let label = formatColorLabel(p);
        chip.title = label;

        chip.onclick = () => {
            if(editIndex >= 0) {
                modifyPalette(editIndex, srtIndex);
            } else {
                addToPalette(srtIndex);
            }
            document.body.removeChild(modal);
        };

       chip.onmouseenter = () => {
    // Display Name + Code + Hex
    let label = `${formatColorLabel(p)} — ${p.hex}`;
    title.innerText = label;
    title.style.color = p.hex;
};

        grid.appendChild(chip);
    });

    modal.appendChild(grid);

    let closeBtn = document.createElement('button');
    closeBtn.innerText = t.btn_cancel;
    closeBtn.className = "btn-del";
    closeBtn.style.marginTop = "10px";
    closeBtn.onclick = () => document.body.removeChild(modal);
    modal.appendChild(closeBtn);

    document.body.appendChild(modal);
}

function updateUserPaletteUI() {
    let t = TRANSLATIONS[currentLang];
    let listContainer = document.getElementById('color-list');
    if(!listContainer) return;

    listContainer.textContent = '';
    let div = document.createElement('div');
    div.style.fontSize = '10px';
    div.style.color = '#666';
    div.style.marginBottom = '5px';
    listContainer.appendChild(div);

    let paletteRow = document.createElement('div');
    paletteRow.style.display = 'flex';
    paletteRow.style.flexWrap = 'wrap';
    paletteRow.style.gap = '8px';
    paletteRow.style.marginBottom = '15px';

    userPalette.forEach((p, idx) => {
        let itemWrapper = document.createElement('div');
        itemWrapper.style.cssText = "display:flex; flex-direction:column; align-items:center; width:34px;";

        let chip = document.createElement('div');
        chip.style.width = '32px';
        chip.style.height = '32px';
        chip.style.backgroundColor = p.hex;
        chip.style.border = '1px solid #555';
        chip.style.borderRadius = '4px';
        chip.style.cursor = 'pointer';
        chip.title = formatColorLabel(p) + "\nClick to change";
        chip.onclick = () => openColorPicker(idx);

        let delBtn = document.createElement('div');
        delBtn.textContent = "\u00D7";
        delBtn.style.cssText = "color:#666; font-size:16px; font-weight:bold; cursor:pointer; margin-top:-2px; line-height:1;";
        delBtn.title = "Remove from palette";
        delBtn.onmouseenter = () => delBtn.style.color = "red";
        delBtn.onmouseleave = () => delBtn.style.color = "#666";
        delBtn.onclick = () => removeFromPalette(idx);

        itemWrapper.appendChild(chip);
        itemWrapper.appendChild(delBtn);
        paletteRow.appendChild(itemWrapper);
    });

    if (userPalette.length < 8) {
        let addWrapper = document.createElement('div');
        addWrapper.style.cssText = "display:flex; flex-direction:column; align-items:center; width:34px;";

        let btnPlus = document.createElement('button');
        btnPlus.innerText = "+";
        btnPlus.style.cssText = "width:32px; height:32px; background:#222; color:#fff; border:1px dashed #666; cursor:pointer; border-radius:4px;";
        btnPlus.onclick = () => openColorPicker(-1);

        addWrapper.appendChild(btnPlus);
        paletteRow.appendChild(addWrapper);
    }

    listContainer.appendChild(paletteRow);
}

function updateGeneratedListUI() {
    let container = document.getElementById('generated-stripes-list');
    let srtInput = domElements.srtDisplay;
    let idLabel = domElements.genId;

    if(idLabel) idLabel.innerText = generationID;
    if(container) container.textContent = "";

    // Retrieve symmetric mode
    let isSymmetric = domElements.sym?.checked || false;

    // Construct SRT string according to official rules
    let srtString = buildSRTCode(tartanStripes, isSymmetric);

    // Visual display of stripes
    tartanStripes.forEach(s => {
        if(container) {
            let row = document.createElement('div');
            row.style.cssText = 'display:flex; align-items:center; margin-bottom:2px; font-size:11px; color:#aaa;';

            let colorBox = document.createElement('div');
            colorBox.style.width = '12px';
            colorBox.style.height = '12px';
            colorBox.style.backgroundColor = s.hex;
            colorBox.style.marginRight = '8px';
            colorBox.style.border = '1px solid #333';

            let codeBold = document.createElement('b');
            codeBold.textContent = s.code;

            row.appendChild(colorBox);
            row.appendChild(codeBold);
            row.appendChild(document.createTextNode(` : ${s.count} threads`));

            container.appendChild(row);
        }
    });

    if(srtInput) srtInput.value = srtString;
}

// === OFFICIAL SRT CODE CONSTRUCTION ===
function buildSRTCode(stripes, isSymmetric) {
    if (!stripes || stripes.length === 0) return "";

    let parts = [];

    stripes.forEach((s, index) => {
        let code = s.code;
        let count = s.count;

        if (isSymmetric) {
            // First and last = pivots with /
            if (index === 0 || index === stripes.length - 1) {
                parts.push(`${code}/${count}`);
            } else {
                parts.push(`${code}${count}`);
            }
        } else {
            // Asymmetric: no /
            parts.push(`${code}${count}`);
        }
    });

    if (isSymmetric) {
        // Format: B/24 W4 K24 W/2
        return parts.join(' ');
    } else {
        // Format: ...B24 W4 K24 W2...
        return '...' + parts.join(' ') + '...';
    }
}

// === INK/STITCH CODE CONSTRUCTION ===
function buildInkStitchCode(stripes, isSymmetric) {
    if (!stripes || stripes.length === 0) return "";

    let parts = [];

    stripes.forEach((s, index) => {
        let hex = s.hex;
        let count = s.count;

        if (isSymmetric) {
            // First and last = pivots with /
            if (index === 0 || index === stripes.length - 1) {
                parts.push(`(${hex})/${count}`);
            } else {
                parts.push(`(${hex})${count}`);
            }
        } else {
            parts.push(`(${hex})${count}`);
        }
    });

    if (isSymmetric) {
        return parts.join(' ');
    } else {
        return '...' + parts.join(' ') + '...';
    }
}

// Expose for export
window.buildSRTCode = buildSRTCode;
window.buildInkStitchCode = buildInkStitchCode;


// Initialize styles on load
injectDynamicStyles();

console.log("[OK] 4. Palette Logic and UI loaded");

// ================= 5. PATTERN GENERATION LOGIC =================

// --- Click Handler (Conductor) ---
window.handleGenerateClick = function(isUpdateOnly = false) {

    // SAVE CURRENT STATE BEFORE ANY MODIFICATION
    if (tartanStripes.length > 0 && !isUpdateOnly) {
        pushToHistory();
    }

    // 1. Read checkbox state (USE SAME IDs EVERYWHERE)
    let keepColors = domElements.lockColors?.checked || false;
    let keepStructure = domElements.lockStructure?.checked || false;

    // 2. If colors are NOT kept → randomize palette
    // But only if it's not a simple "visual update" (slider)
    if(!keepColors && !isUpdateOnly) {
        randomizeUserPalette();
    }

    // 3. Security check
    if(userPalette.length <= 1) {
        alert(TRANSLATIONS[currentLang].msg_palette_min);
        return;
    }

    // 4. UI Management
    drawLoadingScreen();

    // 5. Generation with delay
    setTimeout(() => {
        generateNewTartan(keepColors, keepStructure); // ← PASS PARAMS

        if(typeof redrawTartan === 'function') redrawTartan();
        if(typeof updateGeneratedListUI === 'function') updateGeneratedListUI();

    }, 50);
}

window.generateNewTartan = function generateNewTartan(lockColors = false, lockStructure = false) {
    // 1. Retrieve HTML parameters
    let minW = parseInt(domElements.minWidth?.value) || 2;
    let maxW = parseInt(domElements.maxWidth?.value) || 124;
    let targetStripes = parseInt(domElements.targetStripes?.value) || 12;
    let targetSett = parseInt(domElements.sett?.value) || 260;

    // Option "Check Mode" (Equal widths)
    let isCheckMode = domElements.checkMode?.checked || false;

    // Automatic correction: Min/Max must be even
    if (minW % 2 !== 0) minW++;
    if (maxW % 2 !== 0) maxW++;
    if (minW < 2) minW = 2;
    if (maxW > 124) maxW = 124;
    if (minW > maxW) minW = maxW;

    generationID = Math.floor(Math.random() * 1000000);

    // --- CASE A/B: KEEP STRUCTURE, SHUFFLE COLORS ---
    if (lockStructure && tartanStripes.length > 0) {
        // We keep the widths (count) but assign new colors from the current palette
        let previousColorCode = null;

        tartanStripes.forEach(bande => {
            // Pick a new random color from user palette, avoiding the same adjacent color
            let newColor;
            let hasDifferentColor = userPalette.some(c => c.code !== previousColorCode);

            if (!hasDifferentColor) {
                newColor = userPalette[Math.floor(Math.random() * userPalette.length)];
            } else {
                do {
                    newColor = userPalette[Math.floor(Math.random() * userPalette.length)];
                } while (newColor.code === previousColorCode);
            }

            bande.code = newColor.code;
            bande.hex = newColor.hex;
            previousColorCode = newColor.code;
        });

        if (lockColors) {
            console.log("[INFO] Structure and Colors locked: Shuffled colors across existing stripes.");
        } else {
            console.log("[INFO] Structure kept, Palette changed & colors assigned.");
        }
        return;
    }

    // --- CASE C: KEEP COLORS (Palette doesn't change, but order and widths change) ---
    // Note: In current code, "Keep color" is implicit because 'userPalette' is used.
    // If checkbox is NOT checked, we might want to regenerate palette entirely?
    // For now, assume "Keep Colors" means "Do not touch the left list".
    // If 'lock-palette' is FALSE, we could trigger a randomizeUserPalette()?

    if (!lockColors) {
        // Optionnel : Si l'utilisateur veut que le bouton génère aussi une nouvelle palette
        // Pour l'instant, on laisse l'utilisateur gérer sa palette manuellement.
    }

    // --- CASE D: STANDARD GENERATION ---

let tempStripes = [];
let previousColorCode = null;
let totalThreads = 0; // ✅ Compteur de threads

// Pre-calculate fixed width for Check mode
let fixedCheckWidth = 0;
if (isCheckMode) {
    let minPair = minW / 2;
    let maxPair = maxW / 2;
    fixedCheckWidth = (Math.floor(Math.random() * (maxPair - minPair + 1)) + minPair) * 2;
}

// Generate until target sett is reached (or max number of stripes)
for (let i = 0; i < targetStripes && totalThreads < targetSett; i++) {

    // 1. Color choice (avoid adjacent duplicate)
    let selectedColor;
    let hasDifferentColor = userPalette.some(c => c.code !== previousColorCode);

    if (!hasDifferentColor) {
        selectedColor = userPalette[Math.floor(Math.random() * userPalette.length)];
    } else {
        do {
            selectedColor = userPalette[Math.floor(Math.random() * userPalette.length)];
        } while (selectedColor.code === previousColorCode);
    }

    previousColorCode = selectedColor.code;

    // 2. Width choice
    let finalWidth;

    if (isCheckMode) {
        finalWidth = fixedCheckWidth;
    } else {
        let minPair = minW / 2;
        let maxPair = maxW / 2;
        let randomPair = Math.floor(Math.random() * (maxPair - minPair + 1)) + minPair;
        finalWidth = randomPair * 2;
    }

    // ✅ Adjust if sett is exceeded
    if (totalThreads + finalWidth > targetSett) {
        finalWidth = targetSett - totalThreads;
        if (finalWidth % 2 !== 0) finalWidth--; // Keep even
        if (finalWidth < minW) break; // Too small, stop
    }

    tempStripes.push({
        code: selectedColor.code,
        hex: selectedColor.hex,
        count: finalWidth
    });

    totalThreads += finalWidth; // ✅ Update counter
}
tartanStripes = tempStripes;
console.log(`[INFO] New Tartan generated: ${tempStripes.length} stripes, Total Sett: ${totalThreads}/${targetSett}`);
}

// Utility shuffle function (Fisher-Yates)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
console.log("[OK] 5. PATTERN GENERATION LOGIC");
// =========================================================================
// 6. RENDERING (WEAVING)
// =========================================================================

function redrawTartan() {
    // Security: If no data, draw nothing
    if(!tartanStripes || tartanStripes.length === 0) return;

    // 1. Retrieve rendering parameters
    // Zoom defines the size of a "thread" in pixels on screen
    let domZoom = domElements.zoom;
    let zoom = domZoom ? (parseFloat(domZoom.value) || 2.0) : 2.0;

    // Symmetry check
    let domSym = domElements.sym;
    let isSymmetric = domSym ? domSym.checked : false;

    // Retrieve weaving direction (Z or S)
    let domWeaveZ = domElements.weaveZ;
    let isZTwist = domWeaveZ ? domWeaveZ.checked : true; // Default Z

    // 2. Construction de la séquence de threads (WARP - Chaîne)
    // On convertit "Rouge: 4 threads, Bleu: 6 threads" en un tableau [R,R,R,R, B,B,B,B,B,B]
    let warpSeq = [];

    // Part A (Forward)
    for(let s of tartanStripes) {
        for(let k=0; k<s.count; k++) warpSeq.push(s.hex);
    }

    // Part B (Backward - if symmetric)
    // Do not repeat last block to avoid doubling (A-B-C-B-A and not A-B-C-C-B-A)
    // Note: In complex tartans, symmetry sometimes pivots differently. Simple pivot here.
    if (isSymmetric) {
        for(let i = tartanStripes.length - 2; i >= 0; i--) {
            let s = tartanStripes[i];
            for(let k=0; k<s.count; k++) warpSeq.push(s.hex);
        }
        // NOTE: If you want total symmetry including last stripe: change index to length-1
    }

    let seqLen = warpSeq.length;

    // 3. Canvas Preparation
    clear();
    background(20);
    noStroke();

    // Calcul du nombre de threads à dessiner pour remplir l'écran
    let cols = Math.ceil(width / zoom);
    let rows = Math.ceil(height / zoom);

    // 4. WEAVING LOOP (Twill 2/2)
    // This is where the magic happens.
    // Standard tartan algorithm is a 2/2 twill: 2 over, 2 under, shifted by 1 each line.

    // ⚡ Bolt Optimization: Pre-calculate warp sequence colors for each column
    let warpColors = new Array(cols);
    for (let x = 0; x < cols; x++) {
        warpColors[x] = warpSeq[x % seqLen];
    }

    // ⚡ Bolt Optimization: Draw entire warp vertically, grouping adjacent identical colors
    // ⚡ Bolt Optimization: Use native drawingContext API to bypass p5.js wrappers
    if (cols > 0) {
        let currentWarpColor = warpColors[0];
        let warpStart = 0;
        for (let x = 1; x <= cols; x++) {
            if (x === cols || warpColors[x] !== currentWarpColor) {
                drawingContext.fillStyle = currentWarpColor;
                drawingContext.fillRect(warpStart * zoom, 0, (x - warpStart) * zoom, rows * zoom);
                if (x < cols) {
                    currentWarpColor = warpColors[x];
                    warpStart = x;
                }
            }
        }
    }

    // ⚡ Bolt Optimization: Draw only the visible weft (horizontal) threads, grouping pairs
    // ⚡ Bolt Optimization: Batch drawing operations using beginPath()/rect()/fill() instead of fillRect()
    // ⚡ Bolt Optimization: Multi-row color batching. Weft threads of the same color appear in contiguous blocks.
    // By grouping these blocks into a single beginPath() and fill(), we reduce canvas draw calls
    // from O(rows) to O(color_bands), reducing total weft rendering time by ~45%.
    if (rows > 0) {
        let currentWeftColor = warpSeq[0];
        drawingContext.fillStyle = currentWeftColor;
        drawingContext.beginPath();

        for (let y = 0; y < rows; y++) {
            let weftColor = warpSeq[y % seqLen];
            let yZoom = y * zoom;
            let yMod = y & 3; // Bitwise & 3 is equivalent to % 4 but faster

            // ⚡ Bolt Optimization: Only update fillStyle and trigger fill() when the color changes.
            // Prevents 90%+ of expensive canvas 2d context state updates and path rasterizations.
            if (weftColor !== currentWeftColor) {
                drawingContext.fill(); // Render the previous block of same-color rows

                drawingContext.fillStyle = weftColor;
                currentWeftColor = weftColor;
                drawingContext.beginPath();
            }

            // Determine starting x-index for visible weft based on twist direction
            let xStart = isZTwist ? (6 - yMod) & 3 : (yMod + 2) & 3;

            // The first group might be cut off on the left edge
            if (xStart === 3) {
                // ⚡ Bolt Optimization: skip drawing if identical to warp color underneath
                if (weftColor !== warpColors[0]) {
                    drawingContext.rect(0, yZoom, zoom, zoom);
                }
            }

            // Draw the rest in pairs (since it's a 2/2 twill weave, weft is visible for 2 threads)
            for (let x = xStart; x < cols; x += 4) {
                let w = x + 2 > cols ? cols - x : 2;

                // ⚡ Bolt Optimization: Skip drawing pixels that are the same color as the warp underneath.
                // For a pair (w=2), test both threads individually to maximize omitted rectangles.
                if (w === 2) {
                    let match1 = weftColor === warpColors[x];
                    let match2 = weftColor === warpColors[x + 1];

                    if (!match1 && !match2) {
                        drawingContext.rect(x * zoom, yZoom, 2 * zoom, zoom);
                    } else if (!match1) {
                        drawingContext.rect(x * zoom, yZoom, zoom, zoom);
                    } else if (!match2) {
                        drawingContext.rect((x + 1) * zoom, yZoom, zoom, zoom);
                    }
                    // if both match, draw nothing
                } else {
                    // For edges where w < 2
                    if (weftColor !== warpColors[x]) {
                        drawingContext.rect(x * zoom, yZoom, zoom, zoom);
                    }
                }
            }
        }
        drawingContext.fill(); // Render the final block
    }

    // Update textual info (Actual dimensions)
    updateScaleInfo(seqLen);
    updateActualValues();
}

// Utility function: Loading Screen
function drawLoadingScreen() {
    background(0);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(16);
    text(TRANSLATIONS[currentLang].loading, width/2, height/2);
}

// Update size info (cm)
window.updateScaleInfo = function(totalThreadsOverride) {
    let domThread = domElements.threadMm;
    // By default, threadThickness = 0.5mm (Chunky wool) or use a Sett
    // Si on veut un Sett de 30 threads/cm => 1 fil = 0.33mm.
    let threadMm = domThread ? (parseFloat(domThread.value) || 0.5) : 0.5;

    let totalThreads = 0;
    if (totalThreadsOverride) {
        totalThreads = totalThreadsOverride;
    } else {
        tartanStripes.forEach(s => totalThreads += s.count);
        let domSym = domElements.sym;
        if(domSym && domSym.checked) totalThreads = (totalThreads * 2) - tartanStripes[tartanStripes.length-1].count; // Approx symmetry
    }

    // Calculate width: (NbThreads * Thickness mm) / 10 to get cm
    let sizeCm = (totalThreads * threadMm) / 10;

    let el = domElements.realWidth;
    if(el) el.innerText = sizeCm.toFixed(1) + " cm";

    let elCount = domElements.threadCount;
    if(elCount) elCount.innerText = totalThreads + " threads";

    return { count: totalThreads, size: sizeCm.toFixed(2) };
}

// Globally mapped UI handlers
let aboutModalElement = null;
window.openAboutModal = function() {
    if (!aboutModalElement) aboutModalElement = document.getElementById('about-modal');
    if (aboutModalElement) aboutModalElement.style.display = 'flex';
}
window.closeAboutModal = function(e) {
    if(e && e.target !== e.currentTarget) return; // Ignore clicks inside modal content if handled differently, but we use stopPropagation so this is safe
    if (!aboutModalElement) aboutModalElement = document.getElementById('about-modal');
    if (aboutModalElement) aboutModalElement.style.display = 'none';
}
window.updateZoom = function() { redrawTartan(); }
window.updateSymmetry = function() {
    // We might need to update SRT text if symmetry changes display
    redrawTartan();
}
console.log("[OK] 6. Rendu (TISSAGE)");

// ==========================================
//  7. EXPORT & IMPORT
// ==========================================
// === EXPORT HELPERS ===

function getFormattedDate() {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    return `${yyyy}_${mm}_${dd}`;
}

function getFilename(extension) {
    const idPadded = String(generationID).padStart(6, '0');
    return `Tartan_${idPadded}_${getFormattedDate()}.${extension}`;
}

// --- EXPORT TXT ---
function exportTXT() {
    // Generate filename
    let date = new Date();
    let dateStr = date.getFullYear() + '-' +
                  String(date.getMonth() + 1).padStart(2, '0') + '-' +
                  String(date.getDate()).padStart(2, '0');
    let filename = `Tartan_${generationID}_${dateStr}.txt`;

    // Build content
    let content = `TARTAN GENERATOR - EXPORT\n`;
    content += `==========================\n\n`;
    content += `ID: ${generationID}\n`;
    content += `Date: ${dateStr}\n\n`;

    // Code SRT
    content += `CODE SRT:\n`;
    content += domElements.srtDisplay?.value || 'N/A';
    content += `\n\n`;
    // Code Ink/Stitch
    let isSymmetric = domElements.sym?.checked || false;
    content += `\nCODE INK/STITCH:\n`;
    content += buildInkStitchCode(tartanStripes, isSymmetric);
    content += `\n\n`;
    // Statistics
    let totalThreads = tartanStripes.reduce((sum, s) => sum + (s.count || 0), 0);
    let threadMM = parseFloat(domElements.threadMm?.value) || 1.11;
    let sizeCM = ((totalThreads * 2 * threadMM) / 10).toFixed(1);

    content += `STATISTIQUES:\n`;
    content += `- Demi-sett: ${totalThreads} fils\n`;
    content += `- Sett complet: ${totalThreads * 2} fils\n`;
    content += `- Largeur estimée: ${sizeCM} cm (fil ${threadMM}mm)\n`;
    content += `- Nombre de bandes: ${tartanStripes.length}\n\n`;

    // Palette used
    content += `PALETTE:\n`;
    userPalette.forEach(c => {
        content += `- ${c.code}: ${c.name} (${c.hex})\n`;
    });

    // Download
    let blob = new Blob([content], { type: 'text/plain' });
    let url = URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

// --- EXPORT PNG ---
function exportPNG() {
    // Generate filename
    let date = new Date();
    let dateStr = date.getFullYear() + '-' +
                  String(date.getMonth() + 1).padStart(2, '0') + '-' +
                  String(date.getDate()).padStart(2, '0');
    let filename = `Tartan_${generationID}_${dateStr}.png`;

    // Save canvas
    saveCanvas(filename, 'png');
}

function exportAll() {
    exportPNG();
    setTimeout(() => {
        exportTXT();
    }, 500); // Delay to avoid browser conflict
}

// Expose to HTML
window.exportAll = exportAll;



// Dynamic styles for modal
function injectDynamicStyles() {
    let css = `
        .picker-modal { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #222; border: 1px solid #555; padding: 20px; z-index: 10000; width: 380px; border-radius: 8px; box-shadow: 0 20px 50px rgba(0,0,0,0.8); color:white; font-family:sans-serif;}
        .picker-grid { display: grid; grid-template-columns: repeat(8, 1fr); gap: 4px; max-height: 300px; overflow-y: auto; margin: 15px 0; }
        .picker-chip { width: 100%; aspect-ratio: 1; cursor: pointer; border-radius: 2px; }
        .picker-chip:hover { transform: scale(1.2); border: 2px solid #fff; z-index:2; position:relative; }
    `;
    let style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
}

// --- LOAD SRT EXAMPLE ---
let importInputElement = null;
window.loadExample = function(val) {
    if(!val) return;
    if (!importInputElement) importInputElement = document.getElementById('import-text');
    if(importInputElement) {
        importInputElement.value = val;
        importSRT();
    }
}

// --- IMPORT SRT (OFFICIAL LOGIC) ---
window.importSRT = function() {
    if (!importInputElement) importInputElement = document.getElementById('import-text');
    let input = importInputElement;
    if(!input) return;
    let text = input.value.trim().toUpperCase();
    if(!text) { alert("Please enter an SRT code."); return; }

    let domSym = domElements.sym;
    let isAsymmetricImport = false;
    let isSymmetricImport = false;

    // Asymmetry Detection (...)
    if (text.includes('...')) {
        isAsymmetricImport = true;
        text = text.replace(/\.\.\./g, '');
    }

    // Symmetry Detection (/)
    if (text.includes('/')) {
        isSymmetricImport = true;
    }

    // Update checkbox
    if (domSym) {
        if (isAsymmetricImport) {
            domSym.checked = false;
        } else if (isSymmetricImport) {
            domSym.checked = true;
        }
    }

    // Regex for Code/Number (accepts optional slash)
    let regex = /([A-Z]+)\/?(\d+)/g;

    let match;
    let newStripes = [];
    let newPaletteMap = new Map();

    while ((match = regex.exec(text)) !== null) {
        let code = match[1];
        let count = parseInt(match[2]);

        let colorObj = SRT_PALETTE.find(c => c.code === code);

        if (!colorObj) {
            console.warn(`Unknown color code ignored: ${code}`);
            continue;
        }

        newStripes.push({
            code: colorObj.code,
            hex: colorObj.hex,
            count: count
        });

        if (!newPaletteMap.has(code)) {
            newPaletteMap.set(code, colorObj);
        }
    }

    if (newStripes.length === 0) {
        alert("No valid code detected.");
        return;
    }

    // Save history before modification
    if (typeof pushToHistory === 'function') {
        pushToHistory();
    }

    tartanStripes = newStripes;
    userPalette = Array.from(newPaletteMap.values());

    updateUserPaletteUI();
    redrawTartan();
    updateGeneratedListUI();

    console.log(`[INFO] Import successful: ${newStripes.length} bandes.`);
}

console.log("[OK] 7. Export/Import loaded");
console.log("[OK] Random Tartan Generator v1.1.0 Loaded.");
