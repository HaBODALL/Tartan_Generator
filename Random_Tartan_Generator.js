// =====================================================
//  RANDOM TARTAN GENERATOR V1.2.0 - P5.JS VERSION
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


/* ==========================================
   SECTION 2 : GLOBAL VARIABLES
   ========================================== */

// Tartan state
let tartanStripes = [];      // Generated stripes [{color, width, colorCode}, ...]
let userPalette = [];        // User palette [{hex, code, name}, ...]

// Rendering parameters

// Generation ID
let generationID = 0;

// HISTORY (UNDO)
let historyStack = [];       // Stack of previous states
const MAX_HISTORY = 10;      // Max number of states kept
let committedSettings = null; // Structure settings of the current pattern
let appMessage = null;       // Message shown in the sidebar: { key, isError }

// Thread relief shading (declared early: the render functions use them)
const RELIEF_LEVELS = 64;
const RELIEF_MIN = 0.3;
const RELIEF_MAX = 1.3;
const RELIEF_MIN_PIXELS = 3; // Below this many device pixels per thread, relief is invisible
let reliefMasks = { k: 0, strength: 1, masks: null };
const YARN_VARIATION = 0.07; // Brightness spread of the yarn irregularity (+/- 7%)

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
    undoBtn: null,
    effectType: null,
    btnToggleUI: null,
    sidebar: null,
    btnCopySrt: null,
    copyToast: null
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
        chk_check_mode: "Damier",
        desc_check_mode: "Génère des bandes de largeurs égales",
        lbl_sett: "Densité (Sett cible)",
        sec_zoom: "Zoom et Échelle",
        lbl_thread_mm: "Diamètre du fil (mm)",
        lbl_zoom: "Zoom Visuel",
        lbl_width_cm: "Largeur motif",
        sec_palette: "Palette de couleurs sélectionnées (Max 8)",
        sec_srt: "Code SRT du Tartan",
        sec_export: "Export",
        btn_details: "Détails",
        title_export_svg: "Un motif complet en vectoriel, raccordable, à la taille réelle du tissu",
        msg_palette_max: "Max 8 couleurs.",
        msg_palette_dup: "Cette couleur est déjà présente !",
        msg_palette_min: "La palette doit contenir au minimum 2 couleurs !",
        msg_import_ok: "Import réussi",
        msg_import_err: "Code SRT incompatible ou invalide, veuillez vérifier celui-ci. Il faut au minimum deux couleurs. (Ex: K4 R4)",
        srt_help_title: "Qu'est-ce que le code SRT ?",
        srt_help_text: "Le format SRT (Scottish Register of Tartans) est la notation standard pour décrire un tartan.\n\nChaque couleur est définie par une lettre (ou plusieurs) suivie du nombre de fils.\n\nExemple : K4 R32\n- 'K' = Noir, 4 fils\n- 'R' = Rouge, 32 fils\n\nPour que le motif soit valide, le code doit contenir au minimum 2 couleurs différentes.",
        ph_import_short: "Coller ici (ex: K4 R32)...",
        lbl_add_nuance: "AJOUTER UNE NUANCE",
        lbl_mod_nuance: "MODIFIER LA NUANCE",
        btn_cancel: "ANNULER",
        loading: "TISSAGE EN COURS...",
        lbl_thread_type: "Type de fil",
        lbl_effect: "Effet Textile",
        opt_eff_none: "Aucun",
        opt_eff_relief: "Relief des fils",
        lbl_relief_strength: "Intensité du relief",
        lbl_yarn: "Irrégularité de la laine",
        title_yarn: "Légères variations de teinte d'un fil à l'autre, comme sur une vraie laine",
        opt_wool: "Laine",
        opt_merino: "Mérinos",
        opt_cotton: "Coton",
        opt_custom: "Personnalisé",
        lbl_weave_dir: "Sens du tissage",
        btn_undo: "Annuler",
        title_undo: "Annuler ({n} étapes disponibles)",
        sec_history: "Historique (10 motifs max)",
        hist_empty: "Les motifs précédents apparaîtront ici.",
        hist_restore: "Revenir à ce motif",
        btn_export_all: "Exporter tout",
        btn_about: "ℹ️ À propos",
        title_about: "À propos",
        txt_about_p1: "Random Tartan Generator est un outil open-source (CC BY-SA 4.0) permettant de créer des motifs de tartan. Il s'appuie sur le format du Scottish Register of Tartans (SRT).",
        txt_about_p2: "Vous pouvez l'utiliser pour la conception, ou exporter les motifs pour Ink/Stitch.",
        btn_close: "Fermer",
        title_toggle_ui: "Afficher/Masquer le panneau",
        sec_patchwork: "Patchwork (planche d'inspiration)",
        lbl_patch_qty: "Quantité (10-100)",
        lbl_patch_size: "Tuile à l'export (px)",
        lbl_patch_scale: "Échelle des tuiles",
        opt_scale_fit: "Motif entier",
        opt_scale_zoom: "Zoom actuel",
        btn_gen_patchwork: "OUVRIR LA PLANCHE",
        btn_gen_patchwork_zip: "Exporter ZIP",
        btn_patch_new: "Nouveau lot",
        btn_patch_png: "Exporter PNG",
        btn_patch_close: "Fermer",
        title_patch_board: "Planche patchwork : cliquez un motif pour le reprendre",
        patch_pick: "Reprendre ce motif",
        patch_exporting: "Export en cours…",
        patch_done: "Export terminé.",
        msg_patch_too_big: "Export trop grand : réduisez la quantité ou la taille des tuiles (50 mégapixels au maximum).",
        msg_patch_error: "L'export a échoué. Réessayez avec moins de tuiles ou des tuiles plus petites.",
        msg_zip_missing: "La bibliothèque JSZip n'a pas pu être chargée : l'export ZIP est impossible.",
        msg_err_sett_too_low: "Génération impossible : Le Sett cible est trop petit pour le nombre de bandes et la largeur minimale. (Ex: 10 bandes x 50 fils Min = 500 fils > Sett cible).",
        msg_err_check_mode_forced: "Mode Damier activé : Les limites Min et Max ont été égalisées à la valeur inférieure pour créer des bandes égales."
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
        chk_check_mode: "Checkers",
        desc_check_mode: "Generates stripes of equal widths",
        lbl_sett: "Density (Target Sett)",
        sec_zoom: "Zoom & Scale",
        lbl_thread_mm: "Thread Diameter (mm)",
        lbl_zoom: "Visual Zoom",
        lbl_width_cm: "Pattern Width",
        sec_palette: "Selected Color Palette (Max 8)",
        sec_srt: "Tartan SRT Code",
        sec_export: "Export",
        btn_details: "Details",
        title_export_svg: "One full repeat as vectors, seamless, at the real fabric size",
        msg_palette_max: "Max 8 colors.",
        msg_palette_dup: "Color already in palette!",
        msg_palette_min: "Palette must have at least 2 colors!",
        msg_import_ok: "Import successful",
        msg_import_err: "Incompatible or invalid SRT code, please verify it. At least two colors are required. (e.g. K4 R4)",
        srt_help_title: "What is an SRT Code?",
        srt_help_text: "The SRT (Scottish Register of Tartans) format is the standard notation for describing a tartan.\n\nEach color is defined by a letter (or multiple letters) followed by the number of threads.\n\nExample: K4 R32\n- 'K' = Black, 4 threads\n- 'R' = Red, 32 threads\n\nTo be a valid pattern, the code must contain at least 2 different colors.",
        ph_import_short: "Paste here (ex: K4 R32)...",
        lbl_add_nuance: "ADD SHADE",
        lbl_mod_nuance: "MODIFY SHADE",
        btn_cancel: "CANCEL",
        loading: "WEAVING IN PROGRESS...",
        lbl_thread_type: "Thread type",
        lbl_effect: "Textile Effect",
        opt_eff_none: "None",
        opt_eff_relief: "Thread relief",
        lbl_relief_strength: "Relief strength",
        lbl_yarn: "Yarn irregularity",
        title_yarn: "Slight shade variations from thread to thread, as in real wool",
        opt_wool: "Wool",
        opt_merino: "Merino",
        opt_cotton: "Cotton",
        opt_custom: "Custom",
        lbl_weave_dir: "Weave direction",
        btn_undo: "Undo",
        title_undo: "Undo ({n} steps available)",
        sec_history: "History (10 patterns max)",
        hist_empty: "Previous patterns will appear here.",
        hist_restore: "Go back to this pattern",
        btn_export_all: "Export All",
        btn_about: "ℹ️ About",
        title_about: "About",
        txt_about_p1: "Random Tartan Generator is an open-source tool (CC BY-SA 4.0) to create tartan patterns. It uses the Scottish Register of Tartans (SRT) format.",
        txt_about_p2: "You can use it for design, or export patterns for Ink/Stitch.",
        btn_close: "Close",
        title_toggle_ui: "Show/Hide panel",
        sec_patchwork: "Patchwork (mood board)",
        lbl_patch_qty: "Quantity (10-100)",
        lbl_patch_size: "Export tile (px)",
        lbl_patch_scale: "Tile scale",
        opt_scale_fit: "Whole pattern",
        opt_scale_zoom: "Current zoom",
        btn_gen_patchwork: "OPEN MOOD BOARD",
        btn_gen_patchwork_zip: "Export ZIP",
        btn_patch_new: "New batch",
        btn_patch_png: "Export PNG",
        btn_patch_close: "Close",
        title_patch_board: "Mood board: click a pattern to use it",
        patch_pick: "Use this pattern",
        patch_exporting: "Exporting…",
        patch_done: "Export finished.",
        msg_patch_too_big: "Export too large: lower the quantity or the tile size (50 megapixels at most).",
        msg_patch_error: "The export failed. Try fewer or smaller tiles.",
        msg_zip_missing: "The JSZip library could not be loaded, so the ZIP export is unavailable.",
        msg_err_sett_too_low: "Generation impossible: Target Sett is too small for the number of stripes and minimum width. (E.g., 10 stripes x 50 threads Min = 500 threads > Target Sett).",
        msg_err_check_mode_forced: "Checkers Mode active: Min and Max limits have been set to the lower value to create equal stripes."
    }
};

/* ==========================================
   SECTION 3 : P5.JS INITIALIZATION
   ========================================== */

function setup() {
    cacheDomElements();
    initCanvas();
    bindEvents();

    // Initial Startup
    if (!loadState()) {
        randomizeUserPalette();
        window.handleGenerateClick();
    }
    setLanguage('fr');
}

function saveState() {
    let state = {
        stripes: tartanStripes,
        palette: userPalette,
        symmetric: domElements.sym?.checked || false,
        checkMode: domElements.checkMode?.checked || false,
        generationID: generationID,
        minWidth: domElements.minWidth?.value || 4,
        maxWidth: domElements.maxWidth?.value || 64,
        targetStripes: domElements.targetStripes?.value || 6,
        sett: domElements.sett?.value || 260,
        threadMm: domElements.threadMm?.value || 0.30,
        zoom: domElements.zoom?.value || 2.0,
        weaveZ: domElements.weaveZ?.checked ?? true,
        effectType: domElements.effectType?.value || 'none',
        reliefStrength: readReliefStrength(),
        yarnIrregular: domElements.yarnIrregular?.checked || false,
        threadType: domElements.threadType?.value || 'custom',
        history: historyStack
    };
    try {
        localStorage.setItem('tartanGeneratorState', JSON.stringify(state));
    } catch(e) {
        console.warn("Could not save to localStorage", e);
    }
}

// For inputs that fire continuously (zoom, pinch): localStorage writes are synchronous.
let saveStateTimer = null;
function scheduleSaveState() {
    clearTimeout(saveStateTimer);
    saveStateTimer = setTimeout(saveState, 250);
}

function loadState() {
    try {
        let saved = localStorage.getItem('tartanGeneratorState');
        if (!saved) return false;

        let state = JSON.parse(saved);
        if (!state.stripes || state.stripes.length === 0) return false;

        tartanStripes = state.stripes;
        userPalette = state.palette || [];
        generationID = state.generationID || 0;
        historyStack = Array.isArray(state.history)
            ? state.history.filter(h => h && Array.isArray(h.stripes) && h.stripes.length > 0).slice(-MAX_HISTORY)
            : [];

        if (domElements.sym) domElements.sym.checked = state.symmetric;
        if (domElements.checkMode) domElements.checkMode.checked = state.checkMode;
        if (domElements.minWidth) domElements.minWidth.value = state.minWidth;
        if (domElements.maxWidth) domElements.maxWidth.value = state.maxWidth;
        if (domElements.targetStripes) domElements.targetStripes.value = state.targetStripes;
        if (domElements.sett) domElements.sett.value = state.sett;
        if (domElements.threadMm) domElements.threadMm.value = state.threadMm;
        if (domElements.zoom) domElements.zoom.value = state.zoom;

        if (domElements.weaveZ) {
            domElements.weaveZ.checked = state.weaveZ;
            let domWeaveS = document.getElementById('weave-s');
            if (domWeaveS) domWeaveS.checked = !state.weaveZ;
        }

        if (domElements.effectType && state.effectType) {
            // "Tous" (experimental) kept the relief; the removed overlay and grain fall back to none
            const effect = state.effectType === 'experimental' ? 'relief' : state.effectType;
            domElements.effectType.value = effect;
            if (!domElements.effectType.value) domElements.effectType.value = 'none';
        }
        if (domElements.reliefStrength && Number.isFinite(state.reliefStrength)) {
            domElements.reliefStrength.value = Math.round(state.reliefStrength * 100);
        }
        if (domElements.yarnIrregular) domElements.yarnIrregular.checked = state.yarnIrregular === true;
        updateReliefStrengthUI();

        if (domElements.threadType && state.threadType) {
            domElements.threadType.value = state.threadType;
            if (domElements.threadType.selectedIndex < 0) domElements.threadType.value = 'custom';
            applyThreadTypeUI();
        }

        commitStructureSettings();
        updateUserPaletteUI();
        updateGeneratedListUI();
        redrawTartan();
        updateUndoButton();
        return true;
    } catch(e) {
        console.warn("Could not load from localStorage", e);
        return false;
    }
}

function cacheDomElements() {
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
    domElements.effectType = document.getElementById('effect-type');
    domElements.reliefStrength = document.getElementById('relief-strength');
    domElements.reliefStrengthValue = document.getElementById('relief-strength-value');
    domElements.yarnIrregular = document.getElementById('yarn-irregular');
    domElements.btnToggleUI = document.getElementById('btn-toggle-ui');
    domElements.sidebar = document.getElementById('sidebar');
    domElements.canvasContainer = document.getElementById('canvas-container');
    domElements.btnCopySrt = document.getElementById('btn-copy-srt');
    domElements.copyToast = document.getElementById('copy-toast');
    domElements.threadType = document.getElementById('thread-type');
    domElements.btnAbout = document.getElementById('btn-about');
    domElements.langBtnFr = document.getElementById('lang-btn-fr');
    domElements.langBtnEn = document.getElementById('lang-btn-en');
    domElements.aboutModal = document.getElementById('about-modal');
    domElements.modalContentInner = document.getElementById('modal-content-inner');
    domElements.btnCloseAbout = document.getElementById('btn-close-about');
    domElements.btnImportSrt = document.getElementById('btn-import-srt');
    domElements.btnSrtHelp = document.getElementById('btn-srt-help');
    domElements.srtExamples = document.getElementById('srt-examples');
    domElements.btnGenerate = document.getElementById('btn-generate');
    domElements.btnGenPatchwork = document.getElementById('btn-generate-patchwork');
    domElements.btnGenPatchworkZip = document.getElementById('btn-generate-patchwork-zip');
    domElements.weaveS = document.getElementById('weave-s');
    domElements.btnExportPng = document.getElementById('btn-export-png');
    domElements.btnExportSvg = document.getElementById('btn-export-svg');
    domElements.btnExportTxt = document.getElementById('btn-export-txt');
    domElements.btnExportAll = document.getElementById('btn-export-all');
    domElements.colorList = document.getElementById('color-list');
    domElements.generatedStripesList = document.getElementById('generated-stripes-list');
    domElements.patchworkQty = document.getElementById('patchwork-qty');
    domElements.patchworkSize = document.getElementById('patchwork-size');
    domElements.patchworkInfo = document.getElementById('patchwork-info');
    domElements.patchworkScale = document.getElementById('patchwork-scale');
    domElements.patchworkBoard = document.getElementById('patchwork-board');
    domElements.patchworkGrid = document.getElementById('patchwork-grid');
    domElements.patchworkStatus = document.getElementById('patchwork-status');
    domElements.btnPatchworkNew = document.getElementById('btn-patchwork-new');
    domElements.btnPatchworkPng = document.getElementById('btn-patchwork-png');
    domElements.btnPatchworkClose = document.getElementById('btn-patchwork-close');
    domElements.importText = document.getElementById('import-text');
    domElements.appMessage = document.getElementById('app-message');
    domElements.historyList = document.getElementById('history-list');
}

function initCanvas() {
    let container = domElements.canvasContainer;
    if (!container) return;

    let w = container.offsetWidth;
    let h = container.offsetHeight;

    let canvas = createCanvas(w, h);
    canvas.parent('canvas-container');

    noLoop();
    noSmooth();
}

function bindEvents() {
    let inputsToWatch = [
        'in-stripes',
        'in-minwidth',
        'in-maxwidth',
        'in-sett'
    ];

    inputsToWatch.forEach(id => {
        let el = document.getElementById(id);
        if(el) {
            // 'change' waits for the end of typing: "260" is not read as "2", then "26"
            el.addEventListener('change', () => window.handleGenerateClick(true));
        }
    });

    // Move inline events to JS
    const btnAbout = domElements.btnAbout;
    if (btnAbout) btnAbout.addEventListener('click', openAboutModal);

    const langBtnFr = domElements.langBtnFr;
    if (langBtnFr) langBtnFr.addEventListener('click', () => setLanguage('fr'));

    const langBtnEn = domElements.langBtnEn;
    if (langBtnEn) langBtnEn.addEventListener('click', () => setLanguage('en'));

    const aboutModal = domElements.aboutModal;
    if (aboutModal) aboutModal.addEventListener('click', closeAboutModal);

    const modalContentInner = domElements.modalContentInner;
    if (modalContentInner) modalContentInner.addEventListener('click', (e) => e.stopPropagation());

    const btnCloseAbout = domElements.btnCloseAbout;
    if (btnCloseAbout) btnCloseAbout.addEventListener('click', closeAboutModal);

    const btnImportSrt = domElements.btnImportSrt;
    if (btnImportSrt) btnImportSrt.addEventListener('click', importSRT);

    const btnSrtHelp = domElements.btnSrtHelp;
    if (btnSrtHelp) {
        btnSrtHelp.addEventListener('click', showSrtHelp);
        btnSrtHelp.addEventListener('keydown', (e) => { if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); showSrtHelp(); } });
    }

    const srtExamples = domElements.srtExamples;
    if (srtExamples) srtExamples.addEventListener('change', (e) => loadExample(e.target.value));

    const btnGenerate = domElements.btnGenerate;
    if (btnGenerate) btnGenerate.addEventListener('click', () => handleGenerateClick());

    const btnGenPatchwork = domElements.btnGenPatchwork;
    if (btnGenPatchwork) btnGenPatchwork.addEventListener('click', () => generatePatchwork());

    const btnGenPatchworkZip = domElements.btnGenPatchworkZip;
    if (btnGenPatchworkZip) btnGenPatchworkZip.addEventListener('click', () => generatePatchworkZIP());

    if (domElements.btnPatchworkNew) domElements.btnPatchworkNew.addEventListener('click', () => generatePatchwork());
    if (domElements.btnPatchworkPng) domElements.btnPatchworkPng.addEventListener('click', () => exportPatchworkPNG());
    if (domElements.btnPatchworkClose) domElements.btnPatchworkClose.addEventListener('click', closePatchworkBoard);
    if (domElements.patchworkScale) domElements.patchworkScale.addEventListener('change', renderPatchworkBoard);
    watchPatchworkGrid();

    const btnUndo = domElements.undoBtn;
    if (btnUndo) btnUndo.addEventListener('click', undo);

    const weaveZ = document.getElementById('weave-z');
    if (weaveZ) weaveZ.addEventListener('change', updateZoom);

    const weaveS = domElements.weaveS;
    if (weaveS) weaveS.addEventListener('change', updateZoom);

    const checkSym = domElements.sym;
    if (checkSym) checkSym.addEventListener('change', updateSymmetry);

    const threadType = domElements.threadType;
    if (threadType) threadType.addEventListener('change', updateThreadDiameter);

    const inThreadMm = domElements.threadMm;
    if (inThreadMm) inThreadMm.addEventListener('input', () => {
        updateScaleInfo();
        redrawTartan();
        scheduleSaveState();
    });

    const inZoom = domElements.zoom;
    if (inZoom) inZoom.addEventListener('input', updateZoom);

    if (domElements.effectType) {
        domElements.effectType.addEventListener('change', () => {
            updateReliefStrengthUI();
            refreshRendering();
            saveState();
        });
    }
    if (domElements.reliefStrength) {
        domElements.reliefStrength.addEventListener('input', () => {
            updateReliefStrengthUI();
            redrawTartan();
        });
        domElements.reliefStrength.addEventListener('change', () => {
            refreshRendering();
            saveState();
        });
    }
    if (domElements.yarnIrregular) {
        domElements.yarnIrregular.addEventListener('change', () => {
            refreshRendering();
            saveState();
        });
    }
    updateReliefStrengthUI();

    if (domElements.btnToggleUI) {
        domElements.btnToggleUI.addEventListener('click', toggleSidebar);
    }

    const btnExportPng = domElements.btnExportPng;
    if (btnExportPng) btnExportPng.addEventListener('click', exportPNG);
    if (domElements.btnExportSvg) domElements.btnExportSvg.addEventListener('click', exportSVG);

    const btnExportTxt = domElements.btnExportTxt;
    if (btnExportTxt) btnExportTxt.addEventListener('click', exportTXT);

    const btnExportAll = domElements.btnExportAll;
    if (btnExportAll) btnExportAll.addEventListener('click', exportAll);

    if (domElements.btnCopySrt && domElements.copyToast && domElements.srtDisplay) {
        domElements.btnCopySrt.addEventListener('click', () => {
            domElements.srtDisplay.select();
            navigator.clipboard.writeText(domElements.srtDisplay.value).then(() => {
                domElements.copyToast.classList.add('show');
                setTimeout(() => {
                    domElements.copyToast.classList.remove('show');
                }, 2000);
            }).catch(err => {
                console.error("Could not copy text: ", err);
            });
        });
    }

    // Touch events for Pinch-to-Zoom on canvas container
    const canvasContainer = domElements.canvasContainer;
    if (canvasContainer) {
        let initialPinchDistance = null;
        let initialZoom = null;

        canvasContainer.addEventListener('touchstart', (e) => {
            if (e.touches.length === 2) {
                // Prevent default to stop page zooming
                e.preventDefault();
                initialPinchDistance = Math.hypot(
                    e.touches[0].clientX - e.touches[1].clientX,
                    e.touches[0].clientY - e.touches[1].clientY
                );
                initialZoom = parseFloat(domElements.zoom.value) || 2.0;
            }
        }, { passive: false });

        canvasContainer.addEventListener('touchmove', (e) => {
            if (e.touches.length === 2 && initialPinchDistance !== null) {
                e.preventDefault();
                const currentPinchDistance = Math.hypot(
                    e.touches[0].clientX - e.touches[1].clientX,
                    e.touches[0].clientY - e.touches[1].clientY
                );

                // Calculate ratio
                const pinchRatio = currentPinchDistance / initialPinchDistance;

                // Calculate new zoom and clamp between 0.5 and 12
                let newZoom = initialZoom * pinchRatio;
                newZoom = Math.max(0.5, Math.min(12.0, newZoom));

                // Update input field and redraw
                if (domElements.zoom) {
                    // Round to nearest 0.5 step to match input step if desired, or just to 1 decimal
                    domElements.zoom.value = newZoom.toFixed(1);
                    domElements.zoom.dispatchEvent(new Event('input'));
                }
            }
        }, { passive: false });

        canvasContainer.addEventListener('touchend', (e) => {
            if (e.touches.length < 2) {
                initialPinchDistance = null;
            }
        });
    }
}
document.addEventListener('keydown', (e) => {
    // While the mood board is open, only Escape is handled (it closes the board)
    if (isPatchworkOpen()) {
        if (e.key === 'Escape') {
            e.preventDefault();
            closePatchworkBoard();
        }
        return;
    }

    // Form controls keep all their keys (typing, arrows, type-ahead)
    if (e.target.closest('input, textarea, select')) return;

    const key = e.key.toLowerCase();

    // Space activates the focused button, link or disclosure
    if (key === ' ' && e.target.closest('button, summary, a, [role="button"]')) return;

    // Browser shortcuts (Ctrl+P, Ctrl+S...) stay untouched, except undo
    if (e.altKey || ((e.ctrlKey || e.metaKey) && key !== 'z')) return;

    switch(key) {
        case ' ':       // Space = Generate
        case 'g':
            e.preventDefault();
            handleGenerateClick();
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

    // Update titles
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        let key = el.getAttribute('data-i18n-title');
        if(t[key]) el.title = t[key];
    });

    // Update language buttons active state
    let btnFr = domElements.langBtnFr;
    let btnEn = domElements.langBtnEn;
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
    updateUndoButton();
    renderAppMessage();
    if (isPatchworkOpen()) renderPatchworkBoard();
}
// ================= 4. Palette UI =================

function windowResized() {
    let container = domElements.canvasContainer;
    if(container) {
        resizeCanvas(container.offsetWidth, container.offsetHeight);
        if (window.redrawTartan) window.redrawTartan();
    }
}

function formatColorLabel(p) {
    let varStr = p.variant ? ` ${p.variant}` : '';
    return `${p.name}${varStr} (${p.code})`;
}

function pickRandomPalette() {
    let numColors = Math.floor(random(2, 6));
    let palette = [];
    let tempPalette = [...SRT_PALETTE];

    for(let i = 0; i < numColors; i++) {
        if(tempPalette.length === 0) break;
        let randIndex = Math.floor(random(tempPalette.length));
        let picked = tempPalette[randIndex];
        palette.push(picked);
        // One shade per SRT code: shades sharing a code (e.g. several reds "R")
        // read as the same color in the SRT code and could end up side by side
        tempPalette = tempPalette.filter(c => c.code !== picked.code);
    }
    return palette;
}

function randomizeUserPalette() {
    userPalette = pickRandomPalette();
    updateUserPaletteUI();
}

// Gives the new color to one stripe, so the rest of the pattern stays as it is.
// Prefers a stripe whose current color is also used elsewhere, so no color disappears.
function addColorToOneStripe(stripes, color) {
    const isFree = (i) => stripes[i].hex !== color.hex
        && stripes[i - 1]?.code !== color.code
        && stripes[i + 1]?.code !== color.code;
    const uses = new Map();
    stripes.forEach(s => uses.set(s.hex, (uses.get(s.hex) || 0) + 1));

    const free = stripes.map((s, i) => i).filter(isFree);
    const spare = free.filter(i => uses.get(stripes[i].hex) > 1);
    const candidates = spare.length > 0 ? spare : free;
    if (candidates.length === 0) return false;

    const stripe = stripes[candidates[Math.floor(Math.random() * candidates.length)]];
    stripe.code = color.code;
    stripe.hex = color.hex;
    return true;
}

// Replaces a removed color without creating two identical stripes side by side.
// When the remaining palette leaves no choice, identical neighbors merge into one stripe.
function replaceColorInStripes(stripes, removedHex, palette) {
    stripes.forEach((s, i) => {
        if (s.hex !== removedHex) return;
        const prevCode = stripes[i - 1]?.code;
        const next = stripes[i + 1];
        const nextCode = next && next.hex !== removedHex ? next.code : undefined;
        const color = palette.find(c => c.code !== prevCode && c.code !== nextCode)
            || palette.find(c => c.code !== prevCode)
            || palette[0];
        s.code = color.code;
        s.hex = color.hex;
    });

    const merged = [];
    stripes.forEach(s => {
        const last = merged[merged.length - 1];
        if (last && last.hex === s.hex) last.count += s.count;
        else merged.push(s);
    });
    return merged;
}

function refreshAfterPaletteChange() {
    showAppMessage(null);
    updateUserPaletteUI();
    updateGeneratedListUI();
    redrawTartan();
    saveState();
}

function addToPalette(srtIndex) {
    if (userPalette.length >= 8) {
        showAppMessage('msg_palette_max', true);
        return;
    }

    let colorObj = SRT_PALETTE[srtIndex];

    if (userPalette.some(c => c.hex === colorObj.hex)) {
        showAppMessage('msg_palette_dup', true);
        return;
    }

    pushToHistory();
    userPalette.push(colorObj);
    addColorToOneStripe(tartanStripes, colorObj);
    refreshAfterPaletteChange();
}

function modifyPalette(userIndex, srtIndex) {
    let oldColor = userPalette[userIndex];
    let newColor = SRT_PALETTE[srtIndex];

    let existsElsewhere = userPalette.some((c, i) => c.hex === newColor.hex && i !== userIndex);
    if (existsElsewhere) {
        showAppMessage('msg_palette_dup', true);
        return;
    }

    pushToHistory();
    userPalette[userIndex] = newColor;

    tartanStripes.forEach(stripe => {
        if (stripe.hex === oldColor.hex) {
            stripe.code = newColor.code;
            stripe.hex = newColor.hex;
        }
    });

    refreshAfterPaletteChange();
}

function removeFromPalette(index) {
    if (userPalette.length <= 2) {
        showAppMessage('msg_palette_min', true);
        return;
    }

    pushToHistory();
    let removedColor = userPalette[index];
    userPalette.splice(index, 1);
    tartanStripes = replaceColorInStripes(tartanStripes, removedColor.hex, userPalette);
    refreshAfterPaletteChange();
}

// === SIDEBAR MESSAGES ===
function showAppMessage(key, isError = false) {
    appMessage = key ? { key, isError } : null;
    renderAppMessage();
}

function renderAppMessage() {
    const el = domElements.appMessage;
    if (!el) return;
    el.hidden = !appMessage;
    el.classList.toggle('error', !!appMessage?.isError);
    el.textContent = appMessage ? TRANSLATIONS[currentLang][appMessage.key] : '';
    if (appMessage) el.scrollIntoView({ block: 'nearest' });
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

    // Same measure as the generator's target: the threads listed in the stripes
    let actualSett = sumStripeThreads(tartanStripes);

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
function applyThreadTypeUI() {
    const select = domElements.threadType;
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
}

function updateThreadDiameter() {
    applyThreadTypeUI();
    updateScaleInfo();
    saveState();
}


// === GESTION HISTORY ===

function readStructureSettings() {
    return {
        minWidth: domElements.minWidth?.value,
        maxWidth: domElements.maxWidth?.value,
        targetStripes: domElements.targetStripes?.value,
        sett: domElements.sett?.value,
        checkMode: domElements.checkMode?.checked || false,
        symmetric: domElements.sym?.checked || false
    };
}

// The fields may already hold the next values when history is saved, so remember
// the settings that produced the current pattern.
function commitStructureSettings() {
    committedSettings = readStructureSettings();
}

function createHistoryEntry() {
    return {
        stripes: JSON.parse(JSON.stringify(tartanStripes)),
        palette: JSON.parse(JSON.stringify(userPalette)),
        settings: committedSettings || readStructureSettings(),
        generationID: generationID
    };
}

function pushToHistory() {
    historyStack.push(createHistoryEntry());

    if (historyStack.length > MAX_HISTORY) {
        historyStack.shift();
    }

    updateUndoButton();
}

function applyHistoryEntry(entry) {
    tartanStripes = entry.stripes;
    userPalette = entry.palette;
    generationID = entry.generationID;

    const s = entry.settings;
    if (domElements.minWidth) domElements.minWidth.value = s.minWidth;
    if (domElements.maxWidth) domElements.maxWidth.value = s.maxWidth;
    if (domElements.targetStripes) domElements.targetStripes.value = s.targetStripes;
    if (domElements.sett) domElements.sett.value = s.sett;
    if (domElements.checkMode) domElements.checkMode.checked = s.checkMode;
    if (domElements.sym) domElements.sym.checked = s.symmetric;
    commitStructureSettings();

    showAppMessage(null);
    updateUserPaletteUI();
    updateGeneratedListUI();
    redrawTartan();
    updateUndoButton();
    saveState();
}

function undo() {
    if (historyStack.length === 0) return;
    applyHistoryEntry(historyStack.pop());
}

// Goes back to any pattern. The current one joins the history, so nothing is lost.
function restoreHistoryEntry(index) {
    const entry = historyStack.splice(index, 1)[0];
    if (!entry) return;
    historyStack.push(createHistoryEntry());
    applyHistoryEntry(entry);
}

function updateUndoButton() {
    let btn = domElements.undoBtn;
    if (btn) {
        btn.disabled = (historyStack.length === 0);
        btn.title = TRANSLATIONS[currentLang].title_undo.replace('{n}', historyStack.length);
    }
    updateHistoryList();
}

// One full repeat of the pattern, squeezed into the thumbnail.
function drawHistoryThumbnail(canvas, entry) {
    const size = canvas.width;
    const symmetric = entry.settings?.symmetric || false;
    const settThreads = countSettThreads(entry.stripes, symmetric);
    if (settThreads <= 0) return;

    const sampled = Math.min(settThreads, 4096);
    const threads = buildThreadColors(entry.stripes, symmetric, sampled);
    const colors = new Uint32Array(size);
    for (let i = 0; i < size; i++) colors[i] = threads[Math.floor(i * sampled / size)];

    const ctx = canvas.getContext('2d');
    const image = ctx.createImageData(size, size);
    fillTwillPixels(new Uint32Array(image.data.buffer), size, size, colors, domElements.weaveZ?.checked ?? true);
    ctx.putImageData(image, 0, 0);
}

function updateHistoryList() {
    const list = domElements.historyList;
    if (!list) return;
    const t = TRANSLATIONS[currentLang];
    list.textContent = '';

    if (historyStack.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'history-empty';
        empty.textContent = t.hist_empty;
        list.appendChild(empty);
        return;
    }

    const fragment = document.createDocumentFragment();
    // Most recent first
    for (let i = historyStack.length - 1; i >= 0; i--) {
        const entry = historyStack[i];
        const srt = buildSRTCode(entry.stripes, entry.settings?.symmetric || false);
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'history-thumb';
        button.title = `${t.hist_restore}\n${srt}`;
        button.setAttribute('aria-label', `${t.hist_restore} : ${srt}`);
        button.addEventListener('click', () => restoreHistoryEntry(i));

        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        drawHistoryThumbnail(canvas, entry);

        button.appendChild(canvas);
        fragment.appendChild(button);
    }
    list.appendChild(fragment);
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
        chip.setAttribute('role', 'button');
        chip.setAttribute('tabindex', '0');

        let label = formatColorLabel(p);
        chip.title = label;
        chip.setAttribute('aria-label', label);

        const onChipSelect = () => {
            if(editIndex >= 0) {
                modifyPalette(editIndex, srtIndex);
            } else {
                addToPalette(srtIndex);
            }
            document.body.removeChild(modal);
        };

        chip.onclick = onChipSelect;
        chip.onkeydown = (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onChipSelect();
            }
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
    let listContainer = domElements.colorList;
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
        chip.setAttribute('role', 'button');
        chip.setAttribute('tabindex', '0');

        let label = formatColorLabel(p) + "\nClick to change";
        chip.title = label;
        chip.setAttribute('aria-label', `Change color ${formatColorLabel(p)}`);

        chip.onclick = () => openColorPicker(idx);
        chip.onkeydown = (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openColorPicker(idx);
            }
        };

        let delBtn = document.createElement('div');
        delBtn.textContent = "\u00D7";
        delBtn.style.cssText = "color:#666; font-size:16px; font-weight:bold; cursor:pointer; margin-top:-2px; line-height:1;";
        delBtn.title = "Remove from palette";
        delBtn.setAttribute('role', 'button');
        delBtn.setAttribute('tabindex', '0');
        delBtn.setAttribute('aria-label', `Remove color ${formatColorLabel(p)}`);
        delBtn.onmouseenter = () => delBtn.style.color = "red";
        delBtn.onmouseleave = () => delBtn.style.color = "#666";

        const onDelSelect = () => removeFromPalette(idx);
        delBtn.onclick = onDelSelect;
        delBtn.onkeydown = (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onDelSelect();
            }
        };

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
        btnPlus.setAttribute('aria-label', 'Add a color to the palette');
        btnPlus.onclick = () => openColorPicker(-1);

        addWrapper.appendChild(btnPlus);
        paletteRow.appendChild(addWrapper);
    }

    listContainer.appendChild(paletteRow);
}

function updateGeneratedListUI() {
    let container = domElements.generatedStripesList;
    let srtInput = domElements.srtDisplay;
    let idLabel = domElements.genId;

    if(idLabel) idLabel.innerText = generationID;
    if(container) container.textContent = "";

    // Retrieve symmetric mode
    let isSymmetric = domElements.sym?.checked || false;

    // Construct SRT string according to official rules
    let srtString = buildSRTCode(tartanStripes, isSymmetric);

    // Visual display of stripes
    if (container) {
        let fragment = document.createDocumentFragment();
        tartanStripes.forEach(s => {
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

            fragment.appendChild(row);
        });
        container.appendChild(fragment);
    }

    if(srtInput) srtInput.value = srtString;
    if (typeof matchSrtWithExamples === 'function') matchSrtWithExamples();
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


// Toggle Sidebar
function toggleSidebar() {
    if (!domElements.sidebar || !domElements.btnToggleUI) return;

    domElements.sidebar.classList.toggle('collapsed');
    domElements.btnToggleUI.classList.toggle('collapsed');

    // We need to trigger windowResized after animation completes
    // The CSS transition is 0.3s
    setTimeout(() => {
        windowResized();
    }, 320);
}

// Initialize styles on load
injectDynamicStyles();


// ================= 5. PATTERN GENERATION LOGIC =================

// --- Click Handler (Conductor) ---
window.handleGenerateClick = function(isUpdateOnly = false) {
    let keepColors = domElements.lockColors?.checked || false;
    let keepStructure = domElements.lockStructure?.checked || false;

    // A locked structure ignores the structure settings
    if (isUpdateOnly && keepStructure) return;

    // Validate before changing anything, so a refusal leaves palette and pattern in sync
    let params = null;
    if (!keepStructure || tartanStripes.length === 0) {
        params = readGenerationParams();
        if (params.errorKey) {
            showAppMessage(params.errorKey, true);
            return;
        }
    }
    if ((keepColors || isUpdateOnly) && userPalette.length <= 1) {
        showAppMessage('msg_palette_min', true);
        return;
    }

    if (tartanStripes.length > 0) pushToHistory();

    // If colors are NOT kept, the palette changes too, except for a settings update
    if (!keepColors && !isUpdateOnly) randomizeUserPalette();

    generateNewTartan(keepColors, keepStructure);
    commitStructureSettings();
    showAppMessage(params?.noticeKey || null);
    redrawTartan();
    updateGeneratedListUI();
    saveState();
}

// Reads and normalizes the structure settings. Returns errorKey when they cannot produce a pattern.
function readGenerationParams() {
    let minW = parseInt(domElements.minWidth?.value) || 2;
    let maxW = parseInt(domElements.maxWidth?.value) || 124;
    let targetStripes = parseInt(domElements.targetStripes?.value) || 12;
    let targetSett = parseInt(domElements.sett?.value) || 260;
    let noticeKey = null;

    // Option "Check Mode" (Equal widths)
    let isCheckMode = domElements.checkMode?.checked || false;

    // Automatic correction: Min/Max must be even
    if (minW % 2 !== 0) minW++;
    if (maxW % 2 !== 0) maxW++;
    if (minW < 2) minW = 2;
    if (maxW > 124) maxW = 124;
    if (minW === maxW && !isCheckMode) {
        isCheckMode = true;
        if (domElements.checkMode) domElements.checkMode.checked = true;
    }

    if (isCheckMode && minW !== maxW) {
        noticeKey = 'msg_err_check_mode_forced';
        let lower = Math.min(minW, maxW);
        minW = lower;
        maxW = lower;
        if (domElements.minWidth) domElements.minWidth.value = lower;
        if (domElements.maxWidth) domElements.maxWidth.value = maxW;
    } else if (minW > maxW) {
        minW = maxW;
    }

    const errorKey = targetStripes * minW > targetSett ? 'msg_err_sett_too_low' : null;
    return { minW, maxW, targetStripes, targetSett, isCheckMode, noticeKey, errorKey };
}

// Returns false, without changing the pattern, when the settings cannot produce one.
// Picks a color from the palette, different from the previous stripe when possible.
// Prefers another SRT code; if every color shares the previous code (shades of one color
// chosen by hand), at least another shade. Same color only with a one-color palette.
function pickColorAvoiding(palette, previous) {
    let choices = palette.filter(c => c.code !== previous?.code);
    if (choices.length === 0) choices = palette.filter(c => c.hex !== previous?.hex);
    if (choices.length === 0) choices = palette;
    return choices[Math.floor(Math.random() * choices.length)];
}

// Same widths, new colors from the palette.
function recolorStripes(stripes, palette) {
    let previous = null;
    return stripes.map(s => {
        const color = pickColorAvoiding(palette, previous);
        previous = color;
        return { code: color.code, hex: color.hex, count: s.count };
    });
}

// New stripes from normalized settings (see readGenerationParams).
function createStripes(params, palette) {
    const { minW, maxW, targetStripes, targetSett, isCheckMode } = params;
    const randomEvenWidth = () => {
        const minPair = minW / 2;
        const maxPair = maxW / 2;
        return (Math.floor(Math.random() * (maxPair - minPair + 1)) + minPair) * 2;
    };
    const fixedCheckWidth = isCheckMode ? randomEvenWidth() : 0;

    const stripes = [];
    let previous = null;
    let totalThreads = 0;

    // Generate until target sett is reached (or max number of stripes)
    for (let i = 0; i < targetStripes && totalThreads < targetSett; i++) {
        const color = pickColorAvoiding(palette, previous);
        previous = color;

        let width = isCheckMode ? fixedCheckWidth : randomEvenWidth();

        // Adjust if sett is exceeded
        if (totalThreads + width > targetSett) {
            width = targetSett - totalThreads;
            if (width % 2 !== 0) width--; // Keep even
            if (width < minW) break; // Too small, stop
        }

        stripes.push({ code: color.code, hex: color.hex, count: width });
        totalThreads += width;
    }
    return stripes;
}

// Returns false, without changing the pattern, when the settings cannot produce one.
window.generateNewTartan = function generateNewTartan(lockColors = false, lockStructure = false) {
    const keepsStructure = lockStructure && tartanStripes.length > 0;
    let params = null;
    if (!keepsStructure) {
        params = readGenerationParams();
        if (params.errorKey) return false;
    }

    generationID = Math.floor(Math.random() * 1000000);
    tartanStripes = keepsStructure
        ? recolorStripes(tartanStripes, userPalette)
        : createStripes(params, userPalette);
    return true;
}

// Utility shuffle function (Fisher-Yates)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
// =========================================================================
// 6. RENDERING (WEAVING)
// =========================================================================

// Threads listed in the stripes, i.e. the half-sett of a symmetric tartan.
function sumStripeThreads(stripes) {
    let total = 0;
    for (let i = 0; i < stripes.length; i++) total += stripes[i].count || 0;
    return total;
}

// Number of threads in one full repeat of the sett.
function countSettThreads(stripes, isSymmetric) {
    let total = sumStripeThreads(stripes);
    // Both pivots appear once per repeat, the stripes between them twice (A-B-C-B, then A again)
    if (isSymmetric && stripes.length >= 2) {
        total = total * 2 - stripes[0].count - stripes[stripes.length - 1].count;
    }
    return total;
}

// Twill rows shift by one thread per row, so the weave repeats every lcm(threads, 4) threads.
function getWeavePeriod(settThreads) {
    if (settThreads % 4 === 0) return settThreads;
    return settThreads % 2 === 0 ? settThreads * 2 : settThreads * 4;
}

function hexToPixel(hex) {
    const n = parseInt(hex.slice(1), 16);
    // ImageData pixels are little-endian ABGR once viewed as a Uint32Array
    return (0xFF000000 | ((n & 0xFF) << 16) | (n & 0xFF00) | (n >>> 16)) >>> 0;
}

// Colors of the first `length` threads, wrapping around the sett.
// Only what is needed is expanded, so huge imported counts (K999999) stay cheap.
function buildThreadColors(stripes, isSymmetric, length) {
    const colors = new Uint32Array(length);
    const last = stripes.length - 1;
    let filled = 0;
    const fill = (stripe) => {
        const end = Math.min(filled + stripe.count, length);
        if (end > filled) colors.fill(hexToPixel(stripe.hex), filled, end);
        filled = end;
    };
    while (filled < length) {
        for (let i = 0; i <= last && filled < length; i++) fill(stripes[i]);
        if (isSymmetric) {
            for (let i = last - 1; i >= 1 && filled < length; i--) fill(stripes[i]);
        }
    }
    return colors;
}

// 2/2 twill at one pixel per thread: the weft passes over two threads, under two.
function fillTwillPixels(pixels, tileW, tileH, threadColors, isZTwist) {
    const shifts = isZTwist ? [2, 1, 0, 3] : [2, 3, 0, 1];
    let offset = 0;
    for (let y = 0; y < tileH; y++) {
        const weft = threadColors[y];
        const shift = shifts[y & 3];
        for (let x = 0; x < tileW; x++) {
            pixels[offset++] = ((x - shift) & 3) < 2 ? weft : threadColors[x];
        }
    }
}

// --- Thread relief ---------------------------------------------------------
// Each thread is drawn on k x k pixels and shaded like a round yarn: lighter along its
// middle, darker at its edges and where it dives under the crossing thread.

// across: 0..1 over the thread width; along: 0..1 over its float (two threads long)
function reliefFactor(across, along) {
    const roundness = 1 - 0.28 * Math.pow(2 * across - 1, 2);
    const dive = 1 - 0.35 * Math.pow(2 * along - 1, 4);
    const light = 1 + 0.1 * (0.5 - across); // Light from the top left
    return roundness * dive * light * 1.08;
}

// Four k x k masks of shading levels: weft float start/end, warp float start/end.
// 0 = flat, 1 = default, 2 = twice as marked
function readReliefStrength() {
    const value = parseFloat(domElements.reliefStrength?.value);
    return Number.isFinite(value) ? Math.max(0, Math.min(2, value / 100)) : 1;
}

function updateReliefStrengthUI() {
    const input = domElements.reliefStrength;
    if (!input) return;
    const active = domElements.effectType?.value === 'relief';
    input.disabled = !active;
    const row = input.closest('.control-row');
    if (row) row.style.opacity = active ? '1' : '0.5';
    if (domElements.reliefStrengthValue) domElements.reliefStrengthValue.textContent = Math.round(readReliefStrength() * 100) + ' %';
}

// Main canvas and, when open, the mood board
function refreshRendering() {
    redrawTartan();
    if (typeof isPatchworkOpen === 'function' && isPatchworkOpen()) renderPatchworkBoard();
}

function getReliefMasks(k) {
    const strength = readReliefStrength();
    if (reliefMasks.k === k && reliefMasks.strength === strength) return reliefMasks.masks;
    const masks = [0, 1, 2, 3].map(() => new Uint8Array(k * k));
    for (let py = 0; py < k; py++) {
        for (let px = 0; px < k; px++) {
            const a = (px + 0.5) / k;
            const b = (py + 0.5) / k;
            for (let type = 0; type < 4; type++) {
                const isWeft = type < 2;
                const half = type & 1; // Floats span two threads: first or second half
                const across = isWeft ? b : a;
                const along = (half + (isWeft ? a : b)) / 2;
                const shaded = 1 + (reliefFactor(across, along) - 1) * strength;
                const f = Math.min(RELIEF_MAX, Math.max(RELIEF_MIN, shaded));
                masks[type][py * k + px] = Math.round((f - RELIEF_MIN) / (RELIEF_MAX - RELIEF_MIN) * (RELIEF_LEVELS - 1));
            }
        }
    }
    reliefMasks = { k, strength, masks };
    return masks;
}

// Deterministic noise in [-1, 1] for a thread index
function threadNoise(i) {
    let x = Math.imul(i + 1, 2654435761) >>> 0;
    x = Math.imul(x ^ (x >>> 15), 2246822519) >>> 0;
    x = Math.imul(x ^ (x >>> 13), 3266489917) >>> 0;
    return ((x ^ (x >>> 16)) >>> 0) / 4294967295 * 2 - 1;
}

// Each thread a little lighter or darker, with slow streaks over a few threads like real yarn.
// Indexed by thread, so the same thread keeps its shade and a repeat still tiles.
function varyYarnColors(colors, amount = YARN_VARIATION) {
    const out = new Uint32Array(colors.length);
    for (let i = 0; i < colors.length; i++) {
        const noise = 0.65 * threadNoise(i) + 0.35 * threadNoise(Math.floor(i / 4) + 7919);
        out[i] = shadePixel(colors[i], 1 + amount * noise);
    }
    return out;
}

function shadePixel(pixel, factor) {
    const r = Math.min(255, Math.round((pixel & 0xFF) * factor));
    const g = Math.min(255, Math.round(((pixel >>> 8) & 0xFF) * factor));
    const b = Math.min(255, Math.round(((pixel >>> 16) & 0xFF) * factor));
    return (0xFF000000 | (b << 16) | (g << 8) | r) >>> 0;
}

// Same twill as fillTwillPixels, at k pixels per thread, with yarn shading.
function fillTwillRelief(pixels, tileW, tileH, threadColors, isZTwist, k) {
    const shifts = isZTwist ? [2, 1, 0, 3] : [2, 3, 0, 1];
    const masks = getReliefMasks(k);
    const shades = [];
    const shadeBase = new Map();
    const baseFor = (color) => {
        let base = shadeBase.get(color);
        if (base === undefined) {
            base = shades.length;
            for (let l = 0; l < RELIEF_LEVELS; l++) {
                shades.push(shadePixel(color, RELIEF_MIN + l * (RELIEF_MAX - RELIEF_MIN) / (RELIEF_LEVELS - 1)));
            }
            shadeBase.set(color, base);
        }
        return base;
    };
    const weftOver = (x, y) => ((x - shifts[y & 3]) & 3) < 2;
    const rowPixels = tileW * k;

    for (let y = 0; y < tileH; y++) {
        for (let x = 0; x < tileW; x++) {
            let color, type;
            if (weftOver(x, y)) {
                color = threadColors[y];
                type = ((x - shifts[y & 3]) & 3) === 0 ? 0 : 1;
            } else {
                color = threadColors[x];
                type = weftOver(x, y - 1) ? 2 : 3;
            }
            const base = baseFor(color);
            const mask = masks[type];
            let offset = y * k * rowPixels + x * k;
            for (let py = 0; py < k; py++) {
                const m = py * k;
                for (let px = 0; px < k; px++) pixels[offset + px] = shades[base + mask[m + px]];
                offset += rowPixels;
            }
        }
    }
}

// Pixels per thread in the tile: about one tile pixel per device pixel, or 1 without relief.
function getTileScale(effectType, zoom) {
    if (effectType !== 'relief') return 1;
    const devicePixels = zoom * pixelDensity();
    if (devicePixels < RELIEF_MIN_PIXELS) return 1;
    return Math.min(16, Math.round(devicePixels));
}

let weaveTileCanvas = null;

function redrawTartan() {
    // Security: If no data, draw nothing
    if(!tartanStripes || tartanStripes.length === 0) return;

    // Zoom defines the size of a "thread" in pixels on screen
    let zoom = parseFloat(domElements.zoom?.value) || 2.0;
    let isSymmetric = domElements.sym ? domElements.sym.checked : false;
    let isZTwist = domElements.weaveZ ? domElements.weaveZ.checked : true; // Default Z

    let seqLen = countSettThreads(tartanStripes, isSymmetric);
    if (seqLen <= 0) return;

    let cols = Math.ceil(width / zoom);
    let rows = Math.ceil(height / zoom);
    let effectType = domElements.effectType ? domElements.effectType.value : 'none';

    // Weave one repeat at one pixel per thread, then let the browser tile and scale it.
    // The cost depends on the sett, not on the screen size or the zoom.
    let period = getWeavePeriod(seqLen);
    let tileW = Math.min(period, cols);
    let tileH = Math.min(period, rows);

    // Pixels per thread in the tile (more than 1 only for the relief effect)
    let k = getTileScale(effectType, zoom);

    if (!weaveTileCanvas) weaveTileCanvas = document.createElement('canvas');
    weaveTileCanvas.width = tileW * k;
    weaveTileCanvas.height = tileH * k;

    let tileCtx = weaveTileCanvas.getContext('2d');
    let tile = tileCtx.createImageData(tileW * k, tileH * k);
    let threadColors = buildThreadColors(tartanStripes, isSymmetric, Math.max(tileW, tileH));
    if (domElements.yarnIrregular?.checked) threadColors = varyYarnColors(threadColors);
    let tilePixels = new Uint32Array(tile.data.buffer);
    if (k > 1) fillTwillRelief(tilePixels, tileW, tileH, threadColors, isZTwist, k);
    else fillTwillPixels(tilePixels, tileW, tileH, threadColors, isZTwist);
    tileCtx.putImageData(tile, 0, 0);

    drawingContext.save();
    // Flat: crisp threads when enlarged, blended when several share a device pixel.
    // Relief: the tile is close to device resolution, so smooth any small rescaling.
    let devicePixels = zoom * pixelDensity();
    drawingContext.imageSmoothingEnabled = k > 1 ? devicePixels !== k : devicePixels < 1;
    drawingContext.scale(zoom / k, zoom / k);
    drawingContext.fillStyle = drawingContext.createPattern(weaveTileCanvas, 'repeat');
    drawingContext.fillRect(0, 0, cols * k, rows * k);
    drawingContext.restore();

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
function updateScaleInfo(totalThreadsOverride) {
    let domThread = domElements.threadMm;
    // By default, threadThickness = 0.5mm (Chunky wool) or use a Sett
    // Si on veut un Sett de 30 threads/cm => 1 fil = 0.33mm.
    let threadMm = domThread ? (parseFloat(domThread.value) || 0.5) : 0.5;

    let totalThreads = totalThreadsOverride || countSettThreads(tartanStripes, domElements.sym?.checked || false);

    // Calculate width: (NbThreads * Thickness mm) / 10 to get cm
    let sizeCm = (totalThreads * threadMm) / 10;

    let el = domElements.realWidth;
    if(el) el.innerText = sizeCm.toFixed(1) + " cm";

    let elCount = domElements.threadCount;
    if(elCount) elCount.innerText = totalThreads + " threads";

    return { count: totalThreads, size: sizeCm.toFixed(2) };
}
window.updateScaleInfo = updateScaleInfo;

// Globally mapped UI handlers
let aboutModalElement = null;
window.openAboutModal = function() {
    if (!aboutModalElement) aboutModalElement = domElements.aboutModal;
    if (aboutModalElement) aboutModalElement.style.display = 'flex';
}
window.closeAboutModal = function(e) {
    if(e && e.target !== e.currentTarget) return; // Ignore clicks inside modal content if handled differently, but we use stopPropagation so this is safe
    if (!aboutModalElement) aboutModalElement = domElements.aboutModal;
    if (aboutModalElement) aboutModalElement.style.display = 'none';
}
window.updateZoom = function() { redrawTartan(); scheduleSaveState(); }
window.updateSymmetry = function() {
    commitStructureSettings();
    updateGeneratedListUI(); // The SRT notation depends on symmetry
    redrawTartan();
    saveState();
}

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
    let filename = getFilename('txt');

    // Build content
    let content = `TARTAN GENERATOR - EXPORT\n`;
    content += `==========================\n\n`;
    content += `ID: ${generationID}\n`;
    content += `Date: ${getFormattedDate()}\n\n`;

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
    let settThreads = countSettThreads(tartanStripes, isSymmetric);
    let threadMM = parseFloat(domElements.threadMm?.value) || 1.11;
    let sizeCM = ((settThreads * threadMM) / 10).toFixed(1);

    content += `STATISTIQUES:\n`;
    if (isSymmetric) content += `- Demi-sett: ${sumStripeThreads(tartanStripes)} fils\n`;
    content += `- Sett complet: ${settThreads} fils\n`;
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
    let filename = getFilename('png');

    // Save canvas
    saveCanvas(filename, 'png');
}

// --- EXPORT SVG ---
// One full weave repeat, which tiles without seams, sized in mm from the thread diameter.
// Warp: one rectangle per stripe. Weft: one rectangle per stripe, filled with a 4 x 4 twill
// pattern of its color, so the file stays small whatever the sett.
function buildTartanSVG(stripes, isSymmetric, isZTwist, threadMM) {
    const period = getWeavePeriod(countSettThreads(stripes, isSymmetric));

    // Color runs along one repeat: [start, length, hex]
    const runs = [];
    let pos = 0;
    const add = (s) => {
        if (pos >= period) return;
        const len = Math.min(s.count, period - pos);
        const last = runs[runs.length - 1];
        if (last && last[2] === s.hex) last[1] += len;
        else runs.push([pos, len, s.hex]);
        pos += len;
    };
    while (pos < period) {
        stripes.forEach(add);
        if (isSymmetric) for (let i = stripes.length - 2; i >= 1; i--) add(stripes[i]);
    }

    // Weft cells over the warp in each of the 4 twill rows (same rule as fillTwillPixels)
    const shifts = isZTwist ? [2, 1, 0, 3] : [2, 3, 0, 1];
    const twillCells = (fill) => shifts.map((shift, y) =>
        [0, 1].map(d => `<rect x="${(shift + d) % 4}" y="${y}" width="1" height="1" fill="${fill}"/>`).join('')
    ).join('');

    const colors = [...new Set(runs.map(r => r[2]))];
    const patterns = colors.map((hex, i) =>
        `<pattern id="weft${i}" width="4" height="4" patternUnits="userSpaceOnUse">${twillCells(hex)}</pattern>`
    ).join('\n    ');
    const warp = runs.map(([x, w, hex]) => `<rect x="${x}" y="0" width="${w}" height="${period}" fill="${hex}"/>`).join('\n    ');
    const weft = runs.map(([y, h, hex]) => `<rect x="0" y="${y}" width="${period}" height="${h}" fill="url(#weft${colors.indexOf(hex)})"/>`).join('\n    ');

    const sizeMM = +(period * threadMM).toFixed(2);
    const srt = buildSRTCode(stripes, isSymmetric).replace(/[<>&"]/g, '');
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${sizeMM}mm" height="${sizeMM}mm" viewBox="0 0 ${period} ${period}" shape-rendering="crispEdges">
  <title>Tartan ${srt}</title>
  <desc>2/2 twill (${isZTwist ? 'Z' : 'S'}), one repeat of ${period} threads, thread ${threadMM} mm. Tiles seamlessly.</desc>
  <defs>
    ${patterns}
  </defs>
  <g id="warp">
    ${warp}
  </g>
  <g id="weft">
    ${weft}
  </g>
</svg>
`;
}

function exportSVG() {
    if (tartanStripes.length === 0) return;
    const threadMM = parseFloat(domElements.threadMm?.value) || 1.11;
    const svg = buildTartanSVG(tartanStripes, domElements.sym?.checked || false, domElements.weaveZ?.checked ?? true, threadMM);
    downloadBlob(new Blob([svg], { type: 'image/svg+xml' }), getFilename('svg'));
}

function exportAll() {
    exportPNG();
    setTimeout(() => {
        exportSVG();
    }, 400); // Delays avoid the browser blocking several downloads at once
    setTimeout(() => {
        exportTXT();
    }, 800);
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

// Function to match SRT code with examples in the select dropdown
function matchSrtWithExamples() {
    let srtInput = domElements.srtDisplay;
    let srtExamples = domElements.srtExamples;
    if (!srtInput || !srtExamples) return;

    // We match by checking if the dropdown value string is included in the SRT output
    let currentCode = srtInput.value.trim().toUpperCase();
    let found = false;
    for (let i = 1; i < srtExamples.options.length; i++) {
        let optVal = srtExamples.options[i].value.trim().toUpperCase();
        if (optVal && currentCode === optVal) {
            srtExamples.selectedIndex = i;
            found = true;
            break;
        }
    }
    if (!found) srtExamples.selectedIndex = 0;
}

// --- LOAD SRT EXAMPLE ---
let importInputElement = null;
window.loadExample = function(val) {
    if(!val) return;
    if (!importInputElement) importInputElement = domElements.importText;
    if(importInputElement) {
        importInputElement.value = val;
        importSRT();
    }
}

// --- IMPORT SRT (OFFICIAL LOGIC) ---
window.importSRT = function() {
    if (!importInputElement) importInputElement = domElements.importText;
    let input = importInputElement;
    if(!input) return;
    let text = input.value.trim().toUpperCase();
    if(!text) { alert(TRANSLATIONS[currentLang].msg_import_err); return; }

    // 🛡️ Sentinel: Pre-validate input format to reject anomalous payloads
    if (!/^[A-Z0-9\s\.\/]+$/.test(text)) {
        alert(TRANSLATIONS[currentLang].msg_import_err);
        return;
    }

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

    let domCheckMode = domElements.checkMode;

    // Regex for Code/Number (accepts optional slash)
    let regex = /([A-Z]+)\/?(\d+)/g;

    let match;
    let newStripes = [];
    let newPaletteMap = new Map();

    // ⚡ Bolt Optimization: O(1) lookup map for parsing
    let srtLookup = new Map();
    for (let c of SRT_PALETTE) {
        if (!srtLookup.has(c.code)) srtLookup.set(c.code, c);
    }

    let isCheckModePattern = true;
    let firstCount = -1;

    while ((match = regex.exec(text)) !== null) {
        let code = match[1];
        let count = parseInt(match[2]);

        if (firstCount === -1) {
            firstCount = count;
        } else if (count !== firstCount) {
            isCheckModePattern = false;
        }

        let colorObj;
        if (newPaletteMap.has(code)) {
            colorObj = newPaletteMap.get(code);
        } else {
            let variants = SRT_PALETTE.filter(c => c.code === code);
            if (variants.length > 0) {
                 colorObj = variants[Math.floor(Math.random() * variants.length)];
            } else {
                colorObj = srtLookup.get(code); // Fallback to map if something goes wrong
            }
        }

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

    if (newStripes.length === 0 || newPaletteMap.size < 2) {
        alert(TRANSLATIONS[currentLang].msg_import_err);
        return;
    }

    // Update UI constraints based on imported code
    if (domElements.targetStripes) domElements.targetStripes.value = newStripes.length;

    let minW = Math.min(...newStripes.map(s => s.count));
    let maxW = Math.max(...newStripes.map(s => s.count));
    if (domElements.minWidth) domElements.minWidth.value = minW;
    if (domElements.maxWidth) domElements.maxWidth.value = maxW;

    if (domCheckMode) {
        domCheckMode.checked = isCheckModePattern;
    }

    // Save history before modification
    if (typeof pushToHistory === 'function') {
        pushToHistory();
    }

    tartanStripes = newStripes;
    userPalette = Array.from(newPaletteMap.values());
    commitStructureSettings();
    showAppMessage(null);

    updateUserPaletteUI();
    redrawTartan();
    updateGeneratedListUI();
    matchSrtWithExamples();
    saveState();

}


window.showSrtHelp = function() {
    alert(`${TRANSLATIONS[currentLang].srt_help_title}\n\n${TRANSLATIONS[currentLang].srt_help_text}`);
};

window.updatePatchworkInfo = function() {
    let qtyInput = domElements.patchworkQty;
    let sizeInput = domElements.patchworkSize;
    let infoDiv = domElements.patchworkInfo;
    if(!qtyInput || !sizeInput || !infoDiv) return;

    let qty = parseInt(qtyInput.value) || 10;
    let tileSize = parseInt(sizeInput.value) || 300;

    qty = Math.max(1, Math.min(100, qty));
    tileSize = Math.max(50, Math.min(2000, tileSize));

    let cols = Math.ceil(Math.sqrt(qty));
    let rows = Math.ceil(qty / cols);

    let totalW = cols * tileSize;
    let totalH = rows * tileSize;

    // Rough estimate: assuming ~0.5 byte per pixel for PNG with simple colors (can vary wildly based on complexity)
    let estimatedBytes = totalW * totalH * 0.5;
    let estimatedMB = (estimatedBytes / (1024 * 1024)).toFixed(1);

    infoDiv.textContent = `${totalW}x${totalH} px \u2022 ~${estimatedMB} MB`;
};

window.addEventListener('DOMContentLoaded', () => {
    let qtyInput = document.getElementById('patchwork-qty');
    let sizeInput = document.getElementById('patchwork-size');
    if (qtyInput) qtyInput.addEventListener('input', updatePatchworkInfo);
    if (sizeInput) sizeInput.addEventListener('input', updatePatchworkInfo);
});

// ============================================================================
// PATCHWORK: MOOD BOARD OF GENERATED PATTERNS
// ============================================================================
// Each batch follows the sidebar settings and locks: "Conserver Couleurs" keeps the palette
// for every tile, "Conserver Structure" keeps the current widths and only changes the colors.

const PATCHWORK_MAX_PIXELS = 50e6;
let patchworkBatch = [];
let patchworkOpener = null;
let patchworkGridSize = '';
let patchworkLayoutTimer = 0;

function isPatchworkOpen() {
    return !!domElements.patchworkBoard && !domElements.patchworkBoard.hidden;
}

function readPatchworkQty() {
    let qty = parseInt(domElements.patchworkQty?.value) || 10;
    return Math.max(1, Math.min(100, qty));
}

function readPatchworkTileSize() {
    let size = parseInt(domElements.patchworkSize?.value) || 300;
    return Math.max(50, Math.min(2000, size));
}

// Returns null and shows why when the settings cannot produce patterns.
function createPatchworkBatch(qty) {
    const keepColors = domElements.lockColors?.checked || false;
    const keepStructure = (domElements.lockStructure?.checked || false) && tartanStripes.length > 0;

    let params = null;
    if (!keepStructure) {
        params = readGenerationParams();
        if (params.errorKey) {
            showAppMessage(params.errorKey, true);
            return null;
        }
    }
    if (keepColors && userPalette.length <= 1) {
        showAppMessage('msg_palette_min', true);
        return null;
    }
    showAppMessage(params?.noticeKey || null);

    const symmetric = domElements.sym?.checked || false;
    const batch = [];
    for (let i = 0; i < qty; i++) {
        const palette = keepColors ? userPalette : pickRandomPalette();
        const stripes = keepStructure ? recolorStripes(tartanStripes, palette) : createStripes(params, palette);
        if (stripes.length === 0) continue;
        // Keep only the colors the pattern uses, in palette order
        const used = palette.filter(c => stripes.some(s => s.hex === c.hex));
        batch.push({ stripes, palette: used, symmetric, generationID: Math.floor(Math.random() * 1000000) });
    }
    return batch;
}

// Draws a pattern into a square canvas. "fit" shows one full repeat; "zoom" uses the main zoom.
function renderPatternCanvas(canvas, entry, scaleMode) {
    const size = canvas.width;
    const ctx = canvas.getContext('2d');
    const settThreads = countSettThreads(entry.stripes, entry.symmetric);
    if (settThreads <= 0) return;

    const zoom = parseFloat(domElements.zoom?.value) || 2.0;
    const threadPx = scaleMode === 'zoom' ? zoom : size / settThreads;
    const threads = Math.ceil(size / threadPx);
    const isZTwist = domElements.weaveZ?.checked ?? true;

    // Very small threads: sample the colors instead of drawing more threads than pixels
    const drawn = Math.min(threads, 4096);
    let threadColors = buildThreadColors(entry.stripes, entry.symmetric, Math.min(threads, 16384));
    if (threadColors.length !== drawn) {
        const sampled = new Uint32Array(drawn);
        for (let i = 0; i < drawn; i++) sampled[i] = threadColors[Math.floor(i * threadColors.length / drawn)];
        threadColors = sampled;
    }
    if (domElements.yarnIrregular?.checked) threadColors = varyYarnColors(threadColors);

    const relief = domElements.effectType?.value === 'relief' && drawn === threads && threadPx >= RELIEF_MIN_PIXELS;
    const k = relief ? Math.min(16, Math.round(threadPx)) : 1;

    const tile = document.createElement('canvas');
    tile.width = drawn * k;
    tile.height = drawn * k;
    const tileCtx = tile.getContext('2d');
    const image = tileCtx.createImageData(tile.width, tile.height);
    const pixels = new Uint32Array(image.data.buffer);
    if (k > 1) fillTwillRelief(pixels, drawn, drawn, threadColors, isZTwist, k);
    else fillTwillPixels(pixels, drawn, drawn, threadColors, isZTwist);
    tileCtx.putImageData(image, 0, 0);

    const target = drawn === threads ? threads * threadPx : size;
    const exact = Number.isInteger(threadPx / k) && threadPx >= k;
    ctx.imageSmoothingEnabled = !exact;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(tile, 0, 0, tile.width, tile.height, 0, 0, target, target);
}

function readPatchworkScale() {
    return domElements.patchworkScale?.value === 'zoom' ? 'zoom' : 'fit';
}

function setPatchworkStatus(key) {
    if (domElements.patchworkStatus) domElements.patchworkStatus.textContent = key ? TRANSLATIONS[currentLang][key] : '';
}

// Lays the tiles out to fill the board without scrolling, then draws them.
function renderPatchworkBoard() {
    const grid = domElements.patchworkGrid;
    if (!grid || !isPatchworkOpen()) return;
    const t = TRANSLATIONS[currentLang];
    grid.textContent = '';

    const n = patchworkBatch.length;
    if (n === 0) return;
    patchworkGridSize = grid.clientWidth + 'x' + grid.clientHeight;
    const gap = 6;
    const w = Math.max(1, grid.clientWidth);
    const h = Math.max(1, grid.clientHeight);
    const cols = Math.max(1, Math.min(n, Math.round(Math.sqrt(n * w / h))));
    const rows = Math.ceil(n / cols);
    const cell = Math.max(24, Math.floor(Math.min((w - gap * (cols - 1)) / cols, (h - gap * (rows - 1)) / rows)));
    grid.style.gridTemplateColumns = `repeat(${cols}, ${cell}px)`;
    grid.style.gridAutoRows = `${cell}px`;

    const density = window.devicePixelRatio || 1;
    const scaleMode = readPatchworkScale();
    const fragment = document.createDocumentFragment();
    patchworkBatch.forEach((entry, index) => {
        const srt = buildSRTCode(entry.stripes, entry.symmetric);
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'patchwork-tile';
        button.title = `${t.patch_pick}\n${srt}`;
        button.setAttribute('aria-label', `${t.patch_pick} : ${srt}`);
        button.addEventListener('click', () => usePatchworkTile(index));

        const canvas = document.createElement('canvas');
        canvas.width = Math.round(cell * density);
        canvas.height = canvas.width;
        renderPatternCanvas(canvas, entry, scaleMode);

        button.appendChild(canvas);
        fragment.appendChild(button);
    });
    grid.appendChild(fragment);
}

// Makes a tile the current pattern. The previous pattern goes to the history.
function usePatchworkTile(index) {
    const entry = patchworkBatch[index];
    if (!entry) return;
    if (tartanStripes.length > 0) pushToHistory();

    tartanStripes = JSON.parse(JSON.stringify(entry.stripes));
    userPalette = JSON.parse(JSON.stringify(entry.palette));
    generationID = entry.generationID;
    if (domElements.sym) domElements.sym.checked = entry.symmetric;
    commitStructureSettings();

    closePatchworkBoard();
    showAppMessage(null);
    updateUserPaletteUI();
    updateGeneratedListUI();
    redrawTartan();
    updateUndoButton();
    saveState();
}

function closePatchworkBoard() {
    if (!domElements.patchworkBoard) return;
    domElements.patchworkBoard.hidden = true;
    // Back to the control that opened the board, or to the open button
    const target = patchworkOpener?.isConnected ? patchworkOpener : domElements.btnGenPatchwork;
    patchworkOpener = null;
    target?.focus();
}

// The grid changes size with the window and with the header (a long status line wraps it)
function watchPatchworkGrid() {
    const grid = domElements.patchworkGrid;
    if (!grid || typeof ResizeObserver === 'undefined') return;
    new ResizeObserver(() => {
        // Redraw after the layout settles, outside the observer callback
        clearTimeout(patchworkLayoutTimer);
        patchworkLayoutTimer = setTimeout(() => {
            const size = grid.clientWidth + 'x' + grid.clientHeight;
            if (size !== patchworkGridSize && isPatchworkOpen()) renderPatchworkBoard();
        }, 50);
    }).observe(grid);
}

// Opens the board with a new batch (also used by "Nouveau lot").
window.generatePatchwork = function() {
    const board = domElements.patchworkBoard;
    if (!board) return;
    const batch = createPatchworkBatch(readPatchworkQty());
    if (!batch) {
        closePatchworkBoard();
        return;
    }
    patchworkBatch = batch;
    const wasOpen = isPatchworkOpen();
    if (!wasOpen) patchworkOpener = document.activeElement;
    board.hidden = false;
    setPatchworkStatus(null);
    renderPatchworkBoard();
    if (!wasOpen) domElements.patchworkGrid.querySelector('button')?.focus();
};

function ensurePatchworkBatch() {
    if (patchworkBatch.length > 0) return true;
    const batch = createPatchworkBatch(readPatchworkQty());
    if (!batch) return false;
    patchworkBatch = batch;
    return true;
}

function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 0);
}

function canvasToBlob(canvas) {
    return new Promise((resolve, reject) => {
        canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('toBlob failed')), 'image/png');
    });
}

function showPatchworkError(key) {
    if (isPatchworkOpen()) setPatchworkStatus(key);
    else showAppMessage(key, true);
}

let patchworkExporting = false;

// Exports the current batch as one image: the tiles side by side, without gaps.
window.exportPatchworkPNG = async function() {
    if (patchworkExporting || !ensurePatchworkBatch()) return;
    // A new batch may be drawn during the export: keep this one
    const batch = patchworkBatch;
    const tileSize = readPatchworkTileSize();
    const n = batch.length;
    const cols = Math.ceil(Math.sqrt(n));
    const rows = Math.ceil(n / cols);
    if (cols * rows * tileSize * tileSize > PATCHWORK_MAX_PIXELS) {
        showPatchworkError('msg_patch_too_big');
        return;
    }

    patchworkExporting = true;
    setPatchworkStatus('patch_exporting');
    try {
        const sheet = document.createElement('canvas');
        sheet.width = cols * tileSize;
        sheet.height = rows * tileSize;
        const ctx = sheet.getContext('2d');
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, sheet.width, sheet.height);

        const tile = document.createElement('canvas');
        tile.width = tileSize;
        tile.height = tileSize;
        const scaleMode = readPatchworkScale();
        for (let i = 0; i < n; i++) {
            tile.getContext('2d').clearRect(0, 0, tileSize, tileSize);
            renderPatternCanvas(tile, batch[i], scaleMode);
            ctx.drawImage(tile, (i % cols) * tileSize, Math.floor(i / cols) * tileSize);
        }
        downloadBlob(await canvasToBlob(sheet), `Tartan_Patchwork_${n}_tiles_${getFormattedDate()}.png`);
        setPatchworkStatus('patch_done');
    } catch (error) {
        console.error('Patchwork PNG export failed:', error);
        showPatchworkError('msg_patch_error');
    } finally {
        patchworkExporting = false;
    }
};

function loadJSZip() {
    if (typeof JSZip !== 'undefined') return Promise.resolve();
    return new Promise((resolve, reject) => {
        let script = document.createElement('script');
        script.src = 'libraries/jszip.min.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// Exports the current batch as one PNG per tile, with their SRT and Ink/Stitch codes.
window.generatePatchworkZIP = async function() {
    if (patchworkExporting || !ensurePatchworkBatch()) return;
    // A new batch may be drawn during the export: keep this one
    const batch = patchworkBatch;
    patchworkExporting = true;
    try {
        await loadJSZip();
    } catch (error) {
        patchworkExporting = false;
        showPatchworkError('msg_zip_missing');
        return;
    }

    setPatchworkStatus('patch_exporting');
    try {
        const tileSize = readPatchworkTileSize();
        const scaleMode = readPatchworkScale();
        const zip = new JSZip();
        const pad = String(batch.length).length;
        let codes = "Tartan Generator - Patchwork\n============================\n\n";

        const tile = document.createElement('canvas');
        tile.width = tileSize;
        tile.height = tileSize;
        for (let i = 0; i < batch.length; i++) {
            const entry = batch[i];
            const name = `tartan_${String(i + 1).padStart(pad, '0')}_${String(entry.generationID).padStart(6, '0')}`;
            tile.getContext('2d').clearRect(0, 0, tileSize, tileSize);
            renderPatternCanvas(tile, entry, scaleMode);
            zip.file(`${name}.png`, await canvasToBlob(tile));
            codes += `${name}\n  SRT: ${buildSRTCode(entry.stripes, entry.symmetric)}\n  Ink/Stitch: ${buildInkStitchCode(entry.stripes, entry.symmetric)}\n\n`;
        }
        zip.file('codes.txt', codes);

        downloadBlob(await zip.generateAsync({ type: 'blob' }), `Tartan_Patchwork_${batch.length}_tiles_${getFormattedDate()}.zip`);
        setPatchworkStatus('patch_done');
    } catch (error) {
        console.error('Patchwork ZIP export failed:', error);
        showPatchworkError('msg_patch_error');
    } finally {
        patchworkExporting = false;
    }
};
