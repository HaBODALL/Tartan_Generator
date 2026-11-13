// =====================================================
//  RANDOM TARTAN GENERATOR V1.2.4 - P5.JS VERSION
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
const MAX_HISTORY = 50;      // Max number of states kept (about 1 kB each in localStorage)
let committedSettings = null; // Structure settings of the current pattern
let appMessage = null;       // Message shown in the sidebar: { key, isError }

// Thread relief shading (declared early: the render functions use them)
const RELIEF_LEVELS = 64;
const RELIEF_MIN = 0.3;
const RELIEF_MAX = 1.3;
const RELIEF_MIN_PIXELS = 3; // Below this many device pixels per thread, relief is invisible
const ZOOM_MIN = 0.5;
const ZOOM_MAX = 12;
const ZOOM_STEP = 1.25;
// Values each mood board criterion takes along an axis
const PATCHWORK_AXES = {
    colors: [2, 3, 4, 5, 6],
    stripes: [4, 6, 8, 12, 16],
    maxWidth: [8, 16, 32, 64, 124],
    sett: [120, 180, 240, 320, 400],
    symmetric: [false, true]
};
let reliefMasks = { k: 0, strength: 1, masks: null };
// Below this color difference (CIE76), two neighboring stripes are hard to tell apart
const COLOR_CLOSE_DELTA = 15;
// Color vision deficiencies at full severity, in linear RGB (Machado, Oliveira, Fernandes 2009)
const VISION_MATRICES = {
    protan: [0.152286, 1.052583, -0.204868, 0.114503, 0.786281, 0.099216, -0.003882, -0.048116, 1.051998],
    deuter: [0.367322, 0.860646, -0.227968, 0.280085, 0.672501, 0.047413, -0.011820, 0.042940, 0.968881],
    tritan: [1.255528, -0.076749, -0.178779, -0.078411, 0.930809, 0.147602, 0.004733, 0.691367, 0.303900]
};
// Estimating a tartan from a photo
const ESTIMATE_MAX_SIDE = 1200;     // Longest side analyzed, in pixels
const ESTIMATE_PERIOD_MAX = 14;     // Mean color difference allowed between two repeats
const ESTIMATE_MIRROR_MAX = 11;     // Mean color difference allowed between the two sides of a pivot
const ESTIMATE_EDGE_WIDTH = 3;      // Narrower segments may be only the blur between two stripes
const ESTIMATE_MAX_COLORS = 8;
const ESTIMATE_MAX_PROPOSALS = 10;  // As many as the history keeps
const INVENT_GRID_SIDE = 160;       // Longest side of the small grid an image is reduced to
const INVENT_MAX_RUNS = 12;         // Most stripes read along a line of the image
const INVENT_MERGE_DISTANCE = 10;   // Color groups closer than this are one color
const ESTIMATE_BLEND_LENGTH = 480;  // Positions of a repeat when several proposals are averaged
const ESTIMATE_DARK_FLOOR = 0.015;  // Under this linear level, differences are only noise
let srtLabTable = null;
// Thread shown at the top left corner of the canvas (not whole while moving)
let viewX = 0;
let viewY = 0;
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
    srtBarSize: null,
    undoBtn: null,
    effectRelief: null,
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
        btn_import: "✓ Valider",
        opt_load_example: "-- Charger un exemple --",
        btn_generate: "GÉNÉRER",
        chk_keep_colors: "Garder les couleurs",
        chk_keep_struct: "Garder la structure",
        sec_structure: "Structure du motif",
        chk_symmetry: "Symétrie",
        lbl_stripes: "Nombre de bandes",
        lbl_limits: "Fils par bande (min. et max.)",
        chk_check_mode: "Damier",
        desc_check_mode: "Génère des bandes de largeurs égales",
        lbl_sett: "Fils par motif",
        sec_zoom: "Fil et rendu",
        lbl_thread_mm: "Taille d'un fil (mm)",
        lbl_zoom: "Zoom",
        lbl_width_cm: "Largeur d'un motif",
        sec_palette: "Couleurs (8 au plus)",
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
        lbl_add_nuance: "Ajouter une nuance",
        lbl_mod_nuance: "Modifier la nuance",
        btn_cancel: "Annuler",
        loading: "TISSAGE EN COURS...",
        lbl_thread_type: "Fil",
        btn_zoom_out: "Dézoomer",
        btn_zoom_in: "Zoomer",
        lbl_zoom_slider: "Zoom (curseur)",
        title_zoom: "Molette sur le motif ou touches + et − pour zoomer. Glisser ou flèches pour déplacer, double-clic pour revenir au début",
        opt_eff_relief: "Relief des fils",
        lbl_relief_strength: "Intensité du relief",
        lbl_yarn: "Irrégularité de la laine",
        title_yarn: "Légères variations de teinte d'un fil à l'autre, comme sur une vraie laine",
        opt_wool: "Laine (9 fils/cm)",
        opt_merino: "Mérinos (12 fils/cm)",
        opt_cotton: "Coton (14 fils/cm)",
        opt_custom: "Autre densité",
        lbl_weave_dir: "Diagonale du sergé",
        btn_undo: "Annuler",
        title_undo: "Annuler ({n} étapes disponibles)",
        sec_history: "Historique (50 motifs max)",
        hist_empty: "Les motifs précédents apparaîtront ici.",
        hist_restore: "Revenir à ce motif",
        btn_export_all: "Exporter tout",
        btn_about: "À propos",
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
        title_patch_board: "Planche patchwork : cliquez un motif pour le reprendre, 📌 pour le garder, ≈ pour des variantes",
        patch_pick: "Reprendre ce motif",
        patch_pin: "Garder ce motif au prochain lot",
        patch_unpin: "Ne plus garder ce motif",
        patch_vary: "Variantes de ce motif",
        patch_variants: "Variantes autour du motif choisi.",
        patch_exporting: "Export en cours…",
        patch_done: "Export terminé.",
        msg_patch_too_big: "Export trop grand : réduisez la quantité ou la taille des tuiles (50 mégapixels au maximum).",
        msg_patch_error: "L'export a échoué. Réessayez avec moins de tuiles ou des tuiles plus petites.",
        msg_zip_missing: "La bibliothèque JSZip n'a pas pu être chargée : l'export ZIP est impossible.",
        msg_err_sett_too_low: "Génération impossible : Le Sett cible est trop petit pour le nombre de bandes et la largeur minimale. (Ex: 10 bandes x 50 fils Min = 500 fils > Sett cible).",
        lbl_patch_mode: "Mode",
        opt_mode_random: "Aléatoire",
        opt_mode_criteria: "Par critères",
        lbl_axis_x: "Critère en colonnes",
        lbl_axis_y: "Critère en lignes",
        axis_none: "Aucun",
        axis_colors: "Nombre de couleurs",
        axis_stripes: "Nombre de bandes",
        axis_maxWidth: "Largeur max des bandes",
        axis_sett: "Fils par motif",
        axis_symmetric: "Symétrie",
        crit_colors: "% couleurs",
        crit_stripes: "% bandes",
        crit_maxWidth: "max % fils",
        crit_sett: "% fils",
        crit_sym: "Symétrique",
        crit_asym: "Asymétrique",
        patch_pins_dropped: "Nouvelle grille : les épingles n'ont pas été gardées.",
        btn_share_link: "Copier le lien",
        title_share_link: "Un lien qui rouvre exactement ce motif",
        msg_link_copied: "Lien du motif copié.",
        msg_link_manual: "Copiez ce lien :",
        msg_link_invalid: "Ce lien de motif est incomplet ou invalide.",
        btn_import_file: "Un fichier texte (.txt)",
        title_import_file: "Rouvrir un fichier texte exporté avec « Détails »",
        msg_import_file_err: "Ce fichier n'est pas un export de détails valide.",
        btn_weaving_sheet: "Fiche de tissage",
        title_weaving_sheet: "Une fiche imprimable : ordre des fils et quantité de fil par couleur",
        btn_print: "Imprimer",
        sheet_title: "Fiche de tissage",
        sheet_srt: "Code SRT",
        sheet_threads: "Fils par motif",
        sheet_width: "Largeur du motif",
        sheet_thread: "Densité",
        sheet_weave: "Armure",
        sheet_twill: "Sergé 2/2",
        sheet_structure: "Structure",
        sheet_order: "Ordre des fils sur un motif",
        sheet_colors: "Fil par couleur",
        sheet_color: "Couleur",
        sheet_col_threads: "Fils",
        sheet_col_yarn: "Mètres par m² de tissu",
        sheet_note: "Quantités théoriques pour la chaîne et la trame réunies, sans l'embuvage ni les chutes : prévoyez une marge.",
        btn_preview_objects: "Aperçu sur objets",
        preview_title: "Le motif à l'échelle, d'après la taille du fil",
        preview_scarf: "Écharpe",
        preview_cushion: "Coussin",
        preview_kilt: "Kilt",
        preview_repeat: "Un motif : % cm",
        sec_readability: "Lisibilité des couleurs",
        read_ok: "Toutes les bandes voisines se distinguent bien.",
        read_close: "Bandes voisines très proches :",
        read_deficient: "Peu distinctes en cas de daltonisme :",
        lbl_vision: "Simuler la vision",
        vision_normal: "Normale",
        vision_protan: "Protanopie (rouge)",
        vision_deuter: "Deutéranopie (vert)",
        vision_tritan: "Tritanopie (bleu)",
        note_vision: "À l'écran seulement : les exports gardent les vraies couleurs.",
        btn_import_photo: "Une photo de tartan",
        title_import_photo: "Retrouver le compte de fils d'un tartan photographié ou scanné. L'image reste sur votre appareil.",
        estimate_title: "Un tartan depuis une image",
        estimate_hint: "Tracez un rectangle sur l'image pour ne garder que le tissu. Pour un bon résultat : tissu à plat, bien éclairé, au moins deux motifs visibles.",
        lbl_estimate_tolerance: "Tolérance de couleur",
        lbl_estimate_threads: "Fils par motif",
        lbl_estimate_code: "Code SRT estimé",
        btn_estimate_apply: "Utiliser ce motif",
        estimate_good: "Répétition et symétrie détectées. Les nombres de fils sont des proportions, à vérifier.",
        estimate_fair: "Répétition détectée, sans symétrie : motif asymétrique, ou image trop irrégulière.",
        estimate_low: "Moins de deux motifs reconnus : le résultat ne décrit que ce qui se voit sur l'image.",
        estimate_none: "Aucune bande reconnue. Essayez de cadrer le tissu seul, ou changez la tolérance.",
        msg_photo_err: "Cette image n'a pas pu être lue.",
        msg_estimate_done: "Motif estimé depuis l'image : vérifiez les couleurs et les proportions.",
        estimate_stars: "Comparez jusqu'à 10 lectures. Étoile d'or : c'est le bon motif. Étoile d'argent : c'est proche ; les motifs argent servent à générer un intermédiaire.",
        estimate_refined: "Tour % : la première proposition est l'intermédiaire de vos étoiles d'argent.",
        star_gold: "Étoile d'or : c'est le bon motif",
        star_silver: "Étoile d'argent : c'est proche",
        btn_estimate_refine: "Générer l'intermédiaire",
        btn_estimate_back: "Tour précédent",
        btn_estimate_apply_gold: "Utiliser le motif d'or",
        proposal_base: "Lecture de base",
        proposal_finer: "Plus de détails",
        proposal_coarser: "Moins de détails",
        proposal_lighter: "Couleurs plus claires",
        proposal_darker: "Couleurs plus foncées",
        proposal_asymmetric: "Lu sans symétrie",
        proposal_symmetric: "Lu avec symétrie",
        proposal_other_axis: "Lu dans l'autre sens",
        proposal_thin_wider: "Filets plus larges",
        proposal_thin_narrower: "Filets plus fins",
        proposal_color: "Couleur %",
        proposal_intermediate: "Intermédiaire",
        proposal_kept: "Votre choix précédent",
        msg_estimate_gold: "Motif confirmé d'après l'image. Les nombres de fils restent des proportions.",
        estimate_mode_read: "Retrouver le tartan de l'image",
        estimate_mode_invent: "Inventer un tartan depuis l'image",
        invent_hint: "N'importe quelle image convient : ses couleurs deviennent la palette, et ce qu'on croise en la traversant donne les bandes. Tracez un rectangle pour n'en garder qu'une partie.",
        invent_status: "Motifs inventés à partir des couleurs de l'image.",
        invent_none: "Cette image n'a pas assez de couleurs différentes.",
        proposal_invent_horizontal: "Ligne horizontale",
        proposal_invent_vertical: "Ligne verticale",
        proposal_invent_diagonal: "Ligne en diagonale",
        proposal_invent_areas: "Surfaces des couleurs",
        proposal_invent_colors: "% couleurs",
        msg_invent_done: "Tartan inventé à partir de l'image.",
        nav_main: "Menus principaux",
        menu_new: "Nouveau",
        menu_new_random: "Motif aléatoire",
        menu_new_srt: "Un code SRT",
        menu_new_example: "Un tartan connu (exemples)",
        menu_export: "Enregistrer",
        menu_export_png: "Image PNG (vue actuelle)",
        menu_export_svg: "Vectoriel SVG (un motif raccordable)",
        menu_export_txt: "Détails (.txt, à rouvrir)",
        menu_export_sheet: "Fiche de tissage (à imprimer)",
        menu_export_all: "Tout : PNG, SVG et détails",
        btn_about_short: "À propos",
        btn_reset_view: "Revenir au début du motif",
        panel_tabs: "Sections du panneau",
        tab_pattern: "Motif",
        tab_colors: "Couleurs",
        tab_fabric: "Tissu",
        view_label: "Vue",
        view_cloth: "Tissu",
        strip_history: "Historique",
        title_import: "Appliquer le code (Entrée). Échap remet le code du motif.",
        title_copy_srt: "Copier le code SRT",
        msg_copied: "Copié !",
        srt_bar_size: "1 motif = %c cm · %n fils",
        mode_label: "Mode",
        mode_studio: "Atelier",
        mode_board: "Planche",
        title_mode_studio: "Un motif à la fois, avec tous ses réglages",
        title_mode_board: "Une planche de motifs à comparer",
        board_follows: "Les tuiles suivent les réglages et les verrous de l'Atelier.",
        menu_board_png: "Planche en PNG",
        menu_board_zip: "Planche en ZIP (une image par tuile)",
        menu_more: "Plus",
        menu_new_more: " motif",
        menu_new_image: "À partir d'une image (dessin, photo ou autre)",
        title_new_image: "Les couleurs et les formes d'une image deviennent un tartan. L'image reste sur votre appareil.",
        menu_import: "Importer",
        menu_export_more: " / partager",
        menu_share_link: "🔗 Copier le lien du motif",
        lbl_density: "Densité",
        unit_density: "fils/cm",
        note_thread_mm: "soit % mm par fil",
        actual_value: "obtenu : %",
        title_sett: "Le nombre de fils d'un motif complet, avant qu'il se répète",
        title_weave_dir: "Le sens des diagonales du sergé",
        sheet_density: "%d fils/cm (%m mm par fil)",
        title_remove_color: "Retirer de la palette",
        label_remove_color: "Retirer la couleur %",
        msg_err_check_mode_forced: "Mode Damier activé : Les limites Min et Max ont été égalisées à la valeur inférieure pour créer des bandes égales."
    },
    en: {
        ph_import: "Paste SRT code here (e.g. K4 R32)...",
        btn_import: "✓ Apply",
        opt_load_example: "-- Load Example --",
        btn_generate: "GENERATE",
        chk_keep_colors: "Keep the colors",
        chk_keep_struct: "Keep the structure",
        sec_structure: "Pattern structure",
        chk_symmetry: "Symmetry",
        lbl_stripes: "Number of stripes",
        lbl_limits: "Threads per stripe (min. and max.)",
        chk_check_mode: "Checkers",
        desc_check_mode: "Generates stripes of equal widths",
        lbl_sett: "Threads per repeat",
        sec_zoom: "Yarn & rendering",
        lbl_thread_mm: "Size of one thread (mm)",
        lbl_zoom: "Zoom",
        lbl_width_cm: "Width of one repeat",
        sec_palette: "Colors (8 at most)",
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
        lbl_add_nuance: "Add a shade",
        lbl_mod_nuance: "Change the shade",
        btn_cancel: "Cancel",
        loading: "WEAVING IN PROGRESS...",
        lbl_thread_type: "Yarn",
        btn_zoom_out: "Zoom out",
        btn_zoom_in: "Zoom in",
        lbl_zoom_slider: "Zoom (slider)",
        title_zoom: "Mouse wheel over the pattern or + and − keys to zoom. Drag or arrow keys to move, double click to go back to the start",
        opt_eff_relief: "Thread relief",
        lbl_relief_strength: "Relief strength",
        lbl_yarn: "Yarn irregularity",
        title_yarn: "Slight shade variations from thread to thread, as in real wool",
        opt_wool: "Wool (9 threads/cm)",
        opt_merino: "Merino (12 threads/cm)",
        opt_cotton: "Cotton (14 threads/cm)",
        opt_custom: "Other density",
        lbl_weave_dir: "Twill direction",
        btn_undo: "Undo",
        title_undo: "Undo ({n} steps available)",
        sec_history: "History (50 patterns max)",
        hist_empty: "Previous patterns will appear here.",
        hist_restore: "Go back to this pattern",
        btn_export_all: "Export All",
        btn_about: "About",
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
        title_patch_board: "Mood board: click a pattern to use it, 📌 to keep it, ≈ for variants",
        patch_pick: "Use this pattern",
        patch_pin: "Keep this pattern in the next batch",
        patch_unpin: "Stop keeping this pattern",
        patch_vary: "Variants of this pattern",
        patch_variants: "Variants around the chosen pattern.",
        patch_exporting: "Exporting…",
        patch_done: "Export finished.",
        msg_patch_too_big: "Export too large: lower the quantity or the tile size (50 megapixels at most).",
        msg_patch_error: "The export failed. Try fewer or smaller tiles.",
        msg_zip_missing: "The JSZip library could not be loaded, so the ZIP export is unavailable.",
        msg_err_sett_too_low: "Generation impossible: Target Sett is too small for the number of stripes and minimum width. (E.g., 10 stripes x 50 threads Min = 500 threads > Target Sett).",
        lbl_patch_mode: "Mode",
        opt_mode_random: "Random",
        opt_mode_criteria: "By criteria",
        lbl_axis_x: "Criterion across",
        lbl_axis_y: "Criterion down",
        axis_none: "None",
        axis_colors: "Number of colors",
        axis_stripes: "Number of stripes",
        axis_maxWidth: "Maximum stripe width",
        axis_sett: "Threads per repeat",
        axis_symmetric: "Symmetry",
        crit_colors: "% colors",
        crit_stripes: "% stripes",
        crit_maxWidth: "max % threads",
        crit_sett: "% threads",
        crit_sym: "Symmetric",
        crit_asym: "Asymmetric",
        patch_pins_dropped: "New grid: the pins were not kept.",
        btn_share_link: "Copy link",
        title_share_link: "A link that reopens exactly this pattern",
        msg_link_copied: "Pattern link copied.",
        msg_link_manual: "Copy this link:",
        msg_link_invalid: "This pattern link is incomplete or invalid.",
        btn_import_file: "A text file (.txt)",
        title_import_file: "Reopen a text file exported with \"Details\"",
        msg_import_file_err: "This file is not a valid details export.",
        btn_weaving_sheet: "Weaving sheet",
        title_weaving_sheet: "A printable sheet: thread order and yarn per color",
        btn_print: "Print",
        sheet_title: "Weaving sheet",
        sheet_srt: "SRT code",
        sheet_threads: "Threads per repeat",
        sheet_width: "Width of one repeat",
        sheet_thread: "Density",
        sheet_weave: "Weave",
        sheet_twill: "2/2 twill",
        sheet_structure: "Structure",
        sheet_order: "Thread order for one sett",
        sheet_colors: "Yarn per color",
        sheet_color: "Color",
        sheet_col_threads: "Threads",
        sheet_col_yarn: "Meters per m² of cloth",
        sheet_note: "Theoretical amounts for warp and weft together, without take-up or waste: allow a margin.",
        btn_preview_objects: "Preview on objects",
        preview_title: "The pattern to scale, from the thread size",
        preview_scarf: "Scarf",
        preview_cushion: "Cushion",
        preview_kilt: "Kilt",
        preview_repeat: "One repeat: % cm",
        sec_readability: "Color readability",
        read_ok: "All neighboring stripes are easy to tell apart.",
        read_close: "Neighboring stripes very close:",
        read_deficient: "Hard to tell apart with color blindness:",
        lbl_vision: "Simulate vision",
        vision_normal: "Normal",
        vision_protan: "Protanopia (red)",
        vision_deuter: "Deuteranopia (green)",
        vision_tritan: "Tritanopia (blue)",
        note_vision: "On screen only: exports keep the true colors.",
        btn_import_photo: "A photo of a tartan",
        title_import_photo: "Read the thread count of a photographed or scanned tartan. The image stays on your device.",
        estimate_title: "A tartan from an image",
        estimate_hint: "Drag a rectangle on the image to keep only the cloth. For a good result: flat cloth, even light, at least two repeats in view.",
        lbl_estimate_tolerance: "Color tolerance",
        lbl_estimate_threads: "Threads per sett",
        lbl_estimate_code: "Estimated SRT code",
        btn_estimate_apply: "Use this pattern",
        estimate_good: "Repeat and symmetry found. Thread counts are proportions, to be checked.",
        estimate_fair: "Repeat found, without symmetry: an asymmetric pattern, or an uneven image.",
        estimate_low: "Fewer than two repeats recognized: the result only describes what the image shows.",
        estimate_none: "No stripes recognized. Try framing only the cloth, or change the tolerance.",
        msg_photo_err: "This image could not be read.",
        msg_estimate_done: "Pattern estimated from the image: check its colors and proportions.",
        estimate_stars: "Compare up to 10 readings. Gold star: this is the right pattern. Silver star: it is close; silver patterns are used to generate an intermediate.",
        estimate_refined: "Round %: the first proposal is the intermediate of your silver stars.",
        star_gold: "Gold star: this is the right pattern",
        star_silver: "Silver star: it is close",
        btn_estimate_refine: "Generate intermediate",
        btn_estimate_back: "Previous round",
        btn_estimate_apply_gold: "Use the gold pattern",
        proposal_base: "Base reading",
        proposal_finer: "More detail",
        proposal_coarser: "Less detail",
        proposal_lighter: "Lighter colors",
        proposal_darker: "Darker colors",
        proposal_asymmetric: "Read as asymmetric",
        proposal_symmetric: "Read as symmetric",
        proposal_other_axis: "Read the other way",
        proposal_thin_wider: "Wider thin lines",
        proposal_thin_narrower: "Narrower thin lines",
        proposal_color: "Color %",
        proposal_intermediate: "Intermediate",
        proposal_kept: "Your previous choice",
        msg_estimate_gold: "Pattern confirmed from the image. Thread counts are still proportions.",
        estimate_mode_read: "Read the tartan in the image",
        estimate_mode_invent: "Invent a tartan from the image",
        invent_hint: "Any image will do: its colors become the palette, and what a line across it meets gives the stripes. Drag a rectangle to keep only a part of it.",
        invent_status: "Patterns invented from the colors of the image.",
        invent_none: "This image does not have enough different colors.",
        proposal_invent_horizontal: "Horizontal line",
        proposal_invent_vertical: "Vertical line",
        proposal_invent_diagonal: "Diagonal line",
        proposal_invent_areas: "Color areas",
        proposal_invent_colors: "% colors",
        msg_invent_done: "Tartan invented from the image.",
        nav_main: "Main menus",
        menu_new: "New",
        menu_new_random: "Random pattern",
        menu_new_srt: "An SRT code",
        menu_new_example: "A known tartan (examples)",
        menu_export: "Save",
        menu_export_png: "PNG image (current view)",
        menu_export_svg: "SVG vector (one seamless repeat)",
        menu_export_txt: "Details (.txt, can be reopened)",
        menu_export_sheet: "Weaving sheet (to print)",
        menu_export_all: "All: PNG, SVG and details",
        btn_about_short: "About",
        btn_reset_view: "Back to the start of the pattern",
        panel_tabs: "Panel sections",
        tab_pattern: "Pattern",
        tab_colors: "Colors",
        tab_fabric: "Fabric",
        view_label: "View",
        view_cloth: "Cloth",
        strip_history: "History",
        title_import: "Apply the code (Enter). Esc puts back the code of the pattern.",
        title_copy_srt: "Copy the SRT code",
        msg_copied: "Copied!",
        srt_bar_size: "1 repeat = %c cm · %n threads",
        mode_label: "Mode",
        mode_studio: "Studio",
        mode_board: "Board",
        title_mode_studio: "One pattern at a time, with all its settings",
        title_mode_board: "A board of patterns to compare",
        board_follows: "The tiles follow the Studio settings and locks.",
        menu_board_png: "Board as PNG",
        menu_board_zip: "Board as ZIP (one image per tile)",
        menu_more: "More",
        menu_new_more: " pattern",
        menu_new_image: "From an image (drawing, photo or other)",
        title_new_image: "The colors and shapes of an image become a tartan. The image stays on your device.",
        menu_import: "Import",
        menu_export_more: " / share",
        menu_share_link: "🔗 Copy the link to this pattern",
        lbl_density: "Density",
        unit_density: "threads/cm",
        note_thread_mm: "that is % mm per thread",
        actual_value: "got: %",
        title_sett: "The number of threads in one full repeat, before it starts again",
        title_weave_dir: "The direction of the twill lines",
        sheet_density: "%d threads/cm (%m mm per thread)",
        title_remove_color: "Remove from palette",
        label_remove_color: "Remove color %",
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

    // Initial Startup. A shared link wins over the saved state, which joins the history.
    const restored = loadState();
    const opened = openSharedLink();
    if (!restored && !opened) {
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
        threadMm: domElements.threadMm?.value || 1.11,
        zoom: domElements.zoom?.value || 2.0,
        weaveZ: domElements.weaveZ?.checked ?? true,
        effectType: getEffectType(),
        reliefStrength: readReliefStrength(),
        yarnIrregular: domElements.yarnIrregular?.checked || false,
        threadType: domElements.threadType?.value || '9',
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
        syncZoomSlider();

        if (domElements.weaveZ) {
            domElements.weaveZ.checked = state.weaveZ;
            let domWeaveS = document.getElementById('weave-s');
            if (domWeaveS) domWeaveS.checked = !state.weaveZ;
        }

        if (domElements.effectRelief && state.effectType) {
            // "Tous" (experimental) kept the relief; the removed overlay and grain mean no effect
            domElements.effectRelief.checked = state.effectType === 'relief' || state.effectType === 'experimental';
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
    domElements.density = document.getElementById('in-density');
    domElements.threadMmNote = document.getElementById('thread-mm-note');
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
    domElements.srtBarSize = document.getElementById('srt-bar-size');
    domElements.undoBtn = document.getElementById('btn-undo');
    domElements.effectRelief = document.getElementById('effect-relief');
    domElements.zoomSlider = document.getElementById('zoom-slider');
    domElements.btnZoomIn = document.getElementById('btn-zoom-in');
    domElements.btnZoomOut = document.getElementById('btn-zoom-out');
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
    domElements.btnShareLink = document.getElementById('btn-share-link');
    domElements.estimateModal = document.getElementById('estimate-modal');
    domElements.estimateSource = document.getElementById('estimate-source');
    domElements.estimateResult = document.getElementById('estimate-result');
    domElements.estimateModeRead = document.getElementById('estimate-mode-read');
    domElements.estimateModeInvent = document.getElementById('estimate-mode-invent');
    domElements.estimateHint = document.getElementById('estimate-hint');
    domElements.estimateToleranceRow = document.getElementById('estimate-tolerance-row');
    domElements.estimateProposals = document.getElementById('estimate-proposals');
    domElements.btnEstimateRefine = document.getElementById('btn-estimate-refine');
    domElements.btnEstimateBack = document.getElementById('btn-estimate-back');
    domElements.estimateTolerance = document.getElementById('estimate-tolerance');
    domElements.estimateThreads = document.getElementById('estimate-threads');
    domElements.estimateCode = document.getElementById('estimate-code');
    domElements.estimateStatus = document.getElementById('estimate-status');
    domElements.btnEstimateApply = document.getElementById('btn-estimate-apply');
    domElements.btnEstimateCancel = document.getElementById('btn-estimate-cancel');
    domElements.readabilityList = document.getElementById('readability-list');
    domElements.readabilityBadge = document.getElementById('readability-badge');
    domElements.visionSelect = document.getElementById('vision-select');
    domElements.previewBoard = document.getElementById('preview-board');
    domElements.previewCanvas = document.getElementById('preview-canvas');
    domElements.btnWeavingSheet = document.getElementById('btn-weaving-sheet');
    domElements.sheetModal = document.getElementById('sheet-modal');
    domElements.sheetBody = document.getElementById('sheet-body');
    domElements.btnSheetPrint = document.getElementById('btn-sheet-print');
    domElements.btnSheetClose = document.getElementById('btn-sheet-close');
    domElements.patchworkMode = document.getElementById('patchwork-mode');
    domElements.patchworkAxisX = document.getElementById('patchwork-axis-x');
    domElements.patchworkAxisY = document.getElementById('patchwork-axis-y');
    domElements.patchworkQtyRow = document.getElementById('patchwork-qty-row');
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

    // p5's temporary <main> took up room during the first measure: measure again now it is empty
    if (container.offsetWidth !== w || container.offsetHeight !== h) {
        resizeCanvas(container.offsetWidth, container.offsetHeight, true);
    }

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
        if (el && (id === 'in-minwidth' || id === 'in-maxwidth')) {
            el.addEventListener('change', () => linkWidthBounds(id === 'in-maxwidth' ? 'max' : 'min'));
        }
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
    if (btnImportSrt) btnImportSrt.addEventListener('click', () => applySrtBar(false));
    const srtField = domElements.importText;
    if (srtField) {
        srtField.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                applySrtBar(false);
            } else if (e.key === 'Escape') {
                e.preventDefault();
                showSrtInBar(true);
            }
        });
        srtField.addEventListener('input', () => {
            srtField.removeAttribute('aria-invalid');
            srtField.classList.toggle('edited', srtField.value.trim().toUpperCase() !== currentSrtCode());
        });
        srtField.addEventListener('change', () => applySrtBar(true));
    }

    const importPhoto = document.getElementById('import-photo');
    const btnImportPhoto = document.getElementById('btn-import-photo');
    if (importPhoto && btnImportPhoto) {
        btnImportPhoto.addEventListener('click', () => { pendingImageMode = 'read'; importPhoto.click(); });
        document.getElementById('menu-new-image')?.addEventListener('click', () => { pendingImageMode = 'invent'; importPhoto.click(); });
        importPhoto.addEventListener('change', () => {
            openEstimateFromFile(importPhoto.files[0], pendingImageMode);
            importPhoto.value = ''; // The same photo can be chosen again
        });
    }
    if (domElements.btnEstimateCancel) domElements.btnEstimateCancel.addEventListener('click', closeEstimate);
    if (domElements.btnEstimateApply) domElements.btnEstimateApply.addEventListener('click', applyEstimate);
    if (domElements.estimateTolerance) domElements.estimateTolerance.addEventListener('change', runEstimate);
    [domElements.estimateModeRead, domElements.estimateModeInvent].forEach(radio => {
        if (radio) radio.addEventListener('change', runEstimate);
    });
    if (domElements.estimateThreads) domElements.estimateThreads.addEventListener('change', rescaleProposals);
    if (domElements.btnEstimateRefine) domElements.btnEstimateRefine.addEventListener('click', refineProposals);
    if (domElements.btnEstimateBack) domElements.btnEstimateBack.addEventListener('click', previousProposals);
    bindEstimateSelection();

    setupMenus();
    setupTabs();
    const menuNewRandom = document.getElementById('menu-new-random');
    if (menuNewRandom) menuNewRandom.addEventListener('click', () => handleGenerateClick());
    const menuNewSrt = document.getElementById('menu-new-srt');
    if (menuNewSrt) menuNewSrt.addEventListener('click', () => { domElements.importText?.focus(); domElements.importText?.select(); });
    const menuNewExample = document.getElementById('menu-new-example');
    if (menuNewExample) menuNewExample.addEventListener('click', () => revealInPanel(domElements.srtExamples));
    const btnResetView = document.getElementById('btn-reset-view');
    if (btnResetView) btnResetView.addEventListener('click', resetView);

    const importFile = document.getElementById('import-file');
    const btnImportFile = document.getElementById('btn-import-file');
    if (importFile && btnImportFile) {
        btnImportFile.addEventListener('click', () => importFile.click());
        importFile.addEventListener('change', () => {
            importExportedFile(importFile.files[0]);
            importFile.value = ''; // The same file can be chosen again
        });
    }

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
    if (btnGenPatchwork) btnGenPatchwork.addEventListener('click', () => { if (!isPatchworkOpen()) generatePatchwork(); });

    const btnGenPatchworkZip = domElements.btnGenPatchworkZip;
    if (btnGenPatchworkZip) btnGenPatchworkZip.addEventListener('click', () => generatePatchworkZIP());

    if (domElements.btnPatchworkNew) domElements.btnPatchworkNew.addEventListener('click', () => generatePatchwork());
    if (domElements.btnPatchworkPng) domElements.btnPatchworkPng.addEventListener('click', () => exportPatchworkPNG());
    if (domElements.btnPatchworkClose) domElements.btnPatchworkClose.addEventListener('click', () => {
        if (!isPatchworkOpen()) return;
        closePatchworkBoard();
        domElements.btnPatchworkClose.focus();
    });
    // ⋯ menu (phones): the link, À propos and the other language
    document.getElementById('menu-about')?.addEventListener('click', () => openAboutModal());
    document.getElementById('menu-lang')?.addEventListener('click', () => setLanguage(currentLang === 'fr' ? 'en' : 'fr'));
    // A new pattern is made in the Atelier: leave the board first
    ['menu-new', 'menu-import'].forEach(id => document.getElementById(id)?.addEventListener('click', (e) => {
        if (e.target.closest('.menu-item') && isPatchworkOpen()) closePatchworkBoard();
    }, true));
    if (domElements.patchworkScale) domElements.patchworkScale.addEventListener('change', renderPatchworkBoard);
    [domElements.patchworkMode, domElements.patchworkAxisX, domElements.patchworkAxisY].forEach(el => {
        if (el) el.addEventListener('change', updatePatchworkModeUI);
    });
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
    // The weaver counts threads per cm; the thread size in mm follows
    const inDensity = domElements.density;
    if (inDensity) {
        inDensity.addEventListener('input', () => {
            const perCm = parseFloat(inDensity.value);
            if (!(perCm >= 1 && perCm <= 100)) return;
            if (domElements.threadType) {
                const preset = [...domElements.threadType.options].find(o => o.value !== 'custom' && parseFloat(o.value) === perCm);
                domElements.threadType.value = preset ? preset.value : 'custom';
            }
            inThreadMm.value = threadMmFromDensity(perCm);
            inThreadMm.dispatchEvent(new Event('input'));
        });
        inDensity.addEventListener('change', () => updateScaleInfo());
    }

    const inZoom = domElements.zoom;
    if (inZoom) inZoom.addEventListener('input', () => { syncZoomSlider(); updateZoom(); });
    if (domElements.zoomSlider) {
        domElements.zoomSlider.addEventListener('input', () => setZoom(sliderToZoom(domElements.zoomSlider.value)));
    }
    if (domElements.btnZoomIn) domElements.btnZoomIn.addEventListener('click', () => stepZoom(1));
    if (domElements.btnZoomOut) domElements.btnZoomOut.addEventListener('click', () => stepZoom(-1));
    // Mouse wheel over the pattern (not over the mood board, which has its own content)
    if (domElements.canvasContainer) {
        domElements.canvasContainer.addEventListener('wheel', (e) => {
            if (isPatchworkOpen() || isPreviewOpen() || e.ctrlKey) return;
            e.preventDefault();
            const box = domElements.canvasContainer.querySelector(':scope > canvas')?.getBoundingClientRect();
            if (box) stepZoom(e.deltaY < 0 ? 1 : -1, e.clientX - box.left, e.clientY - box.top);
            else stepZoom(e.deltaY < 0 ? 1 : -1);
        }, { passive: false });

        // Drag the cloth with the mouse or one finger; double click goes back to the start
        const container = domElements.canvasContainer;
        const isPatternCanvas = (el) => el.tagName === 'CANVAS' && el.parentElement === container;
        container.addEventListener('pointerdown', (e) => {
            if (!isPatternCanvas(e.target) || e.button !== 0) return;
            panPointer = { id: e.pointerId, x: e.clientX, y: e.clientY };
            e.target.setPointerCapture(e.pointerId);
            e.target.classList.add('panning');
        });
        container.addEventListener('pointermove', (e) => {
            if (!panPointer || e.pointerId !== panPointer.id) return;
            const dx = e.clientX - panPointer.x, dy = e.clientY - panPointer.y;
            panPointer.x = e.clientX;
            panPointer.y = e.clientY;
            if (dx !== 0 || dy !== 0) panView(dx, dy);
        });
        const endPan = (e) => {
            if (!panPointer || e.pointerId !== panPointer.id) return;
            panPointer = null;
            e.target.classList?.remove('panning');
        };
        container.addEventListener('pointerup', endPan);
        container.addEventListener('pointercancel', endPan);
        container.addEventListener('dblclick', (e) => { if (isPatternCanvas(e.target)) resetView(); });
    }
    syncZoomSlider();

    if (domElements.effectRelief) {
        domElements.effectRelief.addEventListener('change', () => {
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
    if (domElements.btnShareLink) domElements.btnShareLink.addEventListener('click', copySharedLink);
    installVisionFilters();
    if (domElements.visionSelect && domElements.canvasContainer) {
        domElements.visionSelect.addEventListener('change', () => {
            domElements.canvasContainer.dataset.vision = domElements.visionSelect.value;
        });
    }
    document.querySelectorAll('.view-btn').forEach(btn => btn.addEventListener('click', () => setObjectView(btn.dataset.view)));
    watchPreviewStage();
    if (domElements.btnWeavingSheet) domElements.btnWeavingSheet.addEventListener('click', openWeavingSheet);
    if (domElements.btnSheetPrint) domElements.btnSheetPrint.addEventListener('click', () => window.print());
    if (domElements.btnSheetClose) domElements.btnSheetClose.addEventListener('click', closeWeavingSheet);
    if (domElements.sheetModal) {
        domElements.sheetModal.addEventListener('click', (e) => { if (e.target === domElements.sheetModal) closeWeavingSheet(); });
    }
    // A link pasted in the address bar of an open page only changes the hash
    window.addEventListener('hashchange', openSharedLink);

    const btnExportTxt = domElements.btnExportTxt;
    if (btnExportTxt) btnExportTxt.addEventListener('click', exportTXT);

    const btnExportAll = domElements.btnExportAll;
    if (btnExportAll) btnExportAll.addEventListener('click', exportAll);

    if (domElements.btnCopySrt && domElements.copyToast) {
        domElements.btnCopySrt.addEventListener('click', () => {
            navigator.clipboard.writeText(currentSrtCode()).then(() => {
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
                panPointer = null; // Two fingers zoom, they do not drag
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
                    // Zoom around the point between the two fingers
                    const box = canvasContainer.querySelector(':scope > canvas')?.getBoundingClientRect();
                    const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2 - (box?.left || 0);
                    const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2 - (box?.top || 0);
                    setZoom(newZoom, midX, midY);
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
    const menuButton = openMenuButton();
    if (menuButton && e.key === 'Escape') {
        e.preventDefault();
        closeMenus();
        menuButton.focus();
        return;
    }

    if (isEstimateOpen()) {
        if (e.key === 'Escape') {
            e.preventDefault();
            closeEstimate();
        }
        return;
    }

    if (isWeavingSheetOpen()) {
        if (e.key === 'Escape') {
            e.preventDefault();
            closeWeavingSheet();
        }
        return;
    }

    if (isPreviewOpen()) {
        if (e.key === 'Escape') {
            e.preventDefault();
            closeObjectPreview();
            return;
        }
        if (['+', '=', '-', '_'].includes(e.key) || e.key.startsWith('Arrow')) return;
    }

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
        case '+':       // + / - = Zoom
        case '=':
            e.preventDefault();
            stepZoom(1);
            break;
        case '-':
        case '_':
            e.preventDefault();
            stepZoom(-1);
            break;
        case 'arrowleft':
        case 'arrowright':
        case 'arrowup':
        case 'arrowdown': // Arrows = Move the pattern, when no control has the focus
            if (e.target.closest('button, summary, a, [role="button"]')) break;
            e.preventDefault();
            panView(key === 'arrowleft' ? 40 : key === 'arrowright' ? -40 : 0, key === 'arrowup' ? 40 : key === 'arrowdown' ? -40 : 0);
            break;
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

    // Accessible names of icon-only buttons
    document.querySelectorAll('[data-i18n-label]').forEach(el => {
        let key = el.getAttribute('data-i18n-label');
        if(t[key]) el.setAttribute('aria-label', t[key]);
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
    updateReadabilityUI();
    updateScaleInfo(); // The size of a repeat in the SRT bar
    updateActualValues();
    const langItem = document.getElementById('menu-lang');
    if (langItem) {
        langItem.textContent = lang === 'fr' ? 'English' : 'Français';
        langItem.lang = lang === 'fr' ? 'en' : 'fr';
    }
    if (isEstimateOpen()) selectProposal(estimateState.selected);
    if (isPatchworkOpen()) renderPatchworkBoard();
    if (isPreviewOpen()) renderObjectPreview();
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
    return pickDistinctColors(Math.floor(random(2, 6)));
}

function pickDistinctColors(numColors) {
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
            display.textContent = TRANSLATIONS[currentLang].actual_value.replace('%', actual);
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
        display.textContent = TRANSLATIONS[currentLang].actual_value.replace('%', actualSett);
    } else {
        display.textContent = '';
    }
}

// === THREAD TYPE SELECTOR ===
// Threads per cm and the size of one thread in mm are the same measure
function threadMmFromDensity(perCm) {
    return String(Math.round(10 / perCm * 1000) / 1000);
}

function densityFromThreadMm(mm) {
    return Math.round(10 / mm * 10) / 10;
}

// A yarn picks its density; "Autre densité" leaves the field as it is
function applyThreadTypeUI() {
    const select = domElements.threadType;
    const input = domElements.threadMm;
    if (!select || !input) return;
    if (select.value !== 'custom') input.value = threadMmFromDensity(parseFloat(select.value));
    else if (document.activeElement === select) domElements.density?.focus();
}

// Numbers as the reader writes them: 7,1 in French, 7.1 in English
function formatNumber(value, digits = 1) {
    return Number(value).toLocaleString(currentLang === 'fr' ? 'fr-FR' : 'en-GB', { minimumFractionDigits: digits, maximumFractionDigits: digits });
}
window.formatNumber = formatNumber;

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
        delBtn.style.cssText = "color:#aaa; font-size:16px; font-weight:bold; cursor:pointer; margin-top:-2px; line-height:1;";
        delBtn.title = TRANSLATIONS[currentLang].title_remove_color;
        delBtn.setAttribute('role', 'button');
        delBtn.setAttribute('tabindex', '0');
        delBtn.setAttribute('aria-label', TRANSLATIONS[currentLang].label_remove_color.replace('%', formatColorLabel(p)));
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

    showSrtInBar();
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


// Top bar menus: a button opens its list; a choice, a click elsewhere or Escape closes it
function setupMenus() {
    document.querySelectorAll('.menu-btn').forEach(btn => {
        const list = document.getElementById(btn.getAttribute('aria-controls'));
        if (!list) return;
        const items = () => [...list.querySelectorAll('.menu-item')].filter(item => item.getClientRects().length > 0);
        btn.addEventListener('click', () => {
            const opening = list.hidden;
            closeMenus();
            if (opening) openMenu(btn);
        });
        btn.addEventListener('keydown', (e) => {
            if (e.key !== 'ArrowDown') return;
            e.preventDefault();
            closeMenus();
            openMenu(btn);
            items()[0].focus();
        });
        list.addEventListener('click', (e) => {
            if (!e.target.closest('.menu-item')) return;
            const stayed = list.contains(document.activeElement) || document.activeElement === document.body;
            closeMenus();
            if (stayed) btn.focus();
        });
        list.addEventListener('keydown', (e) => {
            const all = items(), i = all.indexOf(document.activeElement);
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault();
                all[(i + (e.key === 'ArrowDown' ? 1 : all.length - 1)) % all.length].focus();
            } else if (e.key === 'Home' || e.key === 'End') {
                e.preventDefault();
                all[e.key === 'Home' ? 0 : all.length - 1].focus();
            } else if (e.key === 'Tab') {
                closeMenus();
            }
        });
    });
    document.addEventListener('click', (e) => { if (!e.target.closest('.menu')) closeMenus(); });
}

function openMenu(btn) {
    document.getElementById(btn.getAttribute('aria-controls')).hidden = false;
    btn.setAttribute('aria-expanded', 'true');
}

function closeMenus() {
    document.querySelectorAll('.menu-btn').forEach(btn => {
        btn.setAttribute('aria-expanded', 'false');
        const list = document.getElementById(btn.getAttribute('aria-controls'));
        if (list) list.hidden = true;
    });
}

function openMenuButton() {
    return document.querySelector('.menu-btn[aria-expanded="true"]');
}

// Gives the focus back to what opened a window; a menu choice is hidden by then, so its menu button gets it
function focusOpener(el) {
    if (!el || !el.isConnected) return;
    const menu = el.closest('.menu');
    (menu ? menu.querySelector('.menu-btn') : el).focus();
}

// Side panel tabs (Motif, Couleurs, Tissu): click, or arrows, Home and End on the tab row
const PANEL_TABS = ['pattern', 'colors', 'fabric'];

function setupTabs() {
    PANEL_TABS.forEach((name, i) => {
        const tab = document.getElementById('tab-' + name);
        if (!tab) return;
        tab.addEventListener('click', () => selectTab(name));
        tab.addEventListener('keydown', (e) => {
            let next = null;
            if (e.key === 'ArrowRight') next = (i + 1) % PANEL_TABS.length;
            else if (e.key === 'ArrowLeft') next = (i + PANEL_TABS.length - 1) % PANEL_TABS.length;
            else if (e.key === 'Home') next = 0;
            else if (e.key === 'End') next = PANEL_TABS.length - 1;
            if (next === null) return;
            e.preventDefault();
            e.stopPropagation(); // The arrows move between tabs, not the pattern
            selectTab(PANEL_TABS[next], true);
        });
    });
}

function selectTab(name, focus = false) {
    PANEL_TABS.forEach(other => {
        const tab = document.getElementById('tab-' + other);
        const panel = document.getElementById('panel-' + other);
        if (!tab || !panel) return;
        const selected = other === name;
        tab.setAttribute('aria-selected', String(selected));
        tab.tabIndex = selected ? 0 : -1;
        panel.hidden = !selected;
        if (selected && focus) tab.focus();
    });
}

function currentTab() {
    return PANEL_TABS.find(name => document.getElementById('tab-' + name)?.getAttribute('aria-selected') === 'true');
}

// Shows a control of the side panel: opens the panel, its tab and its section, then gives it the focus
function revealInPanel(el) {
    if (!el) return;
    if (domElements.sidebar && domElements.sidebar.classList.contains('collapsed')) toggleSidebar();
    const panel = el.closest('.tab-panel');
    if (panel) selectTab(panel.id.replace('panel-', ''));
    const section = el.closest('details');
    if (section) section.open = true;
    el.scrollIntoView({ block: 'nearest' });
    el.focus();
}

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

// Even widths from 2 to 124, the minimum never above the maximum. The bound just changed
// wins and pushes the other one: a minimum raised past the maximum raises the maximum,
// a maximum lowered under the minimum lowers the minimum. An empty field keeps its last value.
const WIDTH_LIMIT_MIN = 2, WIDTH_LIMIT_MAX = 124;
let lastWidthBounds = { minW: 4, maxW: 64 };
function linkWidthBounds(changed = 'min') {
    const even = (field, fallback) => {
        const v = parseInt(field?.value);
        if (!Number.isFinite(v)) return fallback;
        return Math.max(WIDTH_LIMIT_MIN, Math.min(WIDTH_LIMIT_MAX, v % 2 ? v + 1 : v));
    };
    let minW = even(domElements.minWidth, lastWidthBounds.minW);
    let maxW = even(domElements.maxWidth, lastWidthBounds.maxW);
    if (minW > maxW) {
        if (changed === 'max') minW = maxW;
        else maxW = minW;
    }
    if (domElements.minWidth) domElements.minWidth.value = minW;
    if (domElements.maxWidth) domElements.maxWidth.value = maxW;
    lastWidthBounds = { minW, maxW };
    return lastWidthBounds;
}

// Reads and normalizes the structure settings. Returns errorKey when they cannot produce a pattern.
function readGenerationParams() {
    let { minW, maxW } = linkWidthBounds();
    let targetStripes = parseInt(domElements.targetStripes?.value) || 12;
    let targetSett = parseInt(domElements.sett?.value) || 260;
    let noticeKey = null;

    // Damier: every stripe takes one width, drawn between the two bounds
    let isCheckMode = domElements.checkMode?.checked || false;

    const errorKey = targetStripes * minW > targetSett ? 'msg_err_sett_too_low' : null;
    return { minW, maxW, targetStripes, targetSett, isCheckMode, noticeKey, errorKey };
}

// Returns false, without changing the pattern, when the settings cannot produce one.
// Picks a color from the palette, different from the previous stripe when possible.
// Prefers another SRT code; if every color shares the previous code (shades of one color
// chosen by hand), at least another shade. Same color only with a one-color palette.
function pickColorAvoiding(palette, previous, rand = Math.random) {
    let choices = palette.filter(c => c.code !== previous?.code);
    if (choices.length === 0) choices = palette.filter(c => c.hex !== previous?.hex);
    if (choices.length === 0) choices = palette;
    return choices[Math.floor(rand() * choices.length)];
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
function createStripes(params, palette, rand = Math.random) {
    const { minW, maxW, targetStripes, targetSett, isCheckMode } = params;
    const randomEvenWidth = (upper = maxW) => {
        const minPair = minW / 2;
        const maxPair = Math.max(minPair, upper / 2);
        return (Math.floor(rand() * (maxPair - minPair + 1)) + minPair) * 2;
    };
    // Damier: one width for every stripe, small enough for at least two whole stripes
    const fixedCheckWidth = isCheckMode ? randomEvenWidth(Math.min(maxW, Math.floor(targetSett / 4) * 2)) : 0;

    const stripes = [];
    let previous = null;
    let totalThreads = 0;

    // Generate until target sett is reached (or max number of stripes)
    for (let i = 0; i < targetStripes && totalThreads < targetSett; i++) {
        const color = pickColorAvoiding(palette, previous, rand);
        previous = color;

        let width = isCheckMode ? fixedCheckWidth : randomEvenWidth();

        // Adjust if sett is exceeded
        if (totalThreads + width > targetSett) {
            if (isCheckMode) break; // A cut stripe would break the Damier
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
function buildThreadColors(stripes, isSymmetric, length, start = 0) {
    const colors = new Uint32Array(length);
    const last = stripes.length - 1;
    let filled = 0;
    let skip = start > 0 ? start % countSettThreads(stripes, isSymmetric) : 0;
    const fill = (stripe) => {
        if (skip >= stripe.count) {
            skip -= stripe.count;
            return;
        }
        const end = Math.min(filled + stripe.count - skip, length);
        skip = 0;
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
// originX and originY: position of the tile in the cloth, which sets the twill phase.
function fillTwillPixels(pixels, tileW, tileH, threadColors, isZTwist, weftColors = threadColors, originX = 0, originY = 0) {
    const shifts = isZTwist ? [2, 1, 0, 3] : [2, 3, 0, 1];
    let offset = 0;
    for (let y = 0; y < tileH; y++) {
        const weft = weftColors[y];
        const shift = shifts[(y + originY) & 3];
        for (let x = 0; x < tileW; x++) {
            pixels[offset++] = ((x + originX - shift) & 3) < 2 ? weft : threadColors[x];
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

function getEffectType() {
    return domElements.effectRelief?.checked ? 'relief' : 'none';
}

// The strength slider only shows while the relief is on
function updateReliefStrengthUI() {
    const input = domElements.reliefStrength;
    if (!input) return;
    const active = getEffectType() === 'relief';
    input.disabled = !active;
    const row = input.closest('.control-row');
    if (row) row.hidden = !active;
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
function varyYarnColors(colors, amount = YARN_VARIATION, start = 0, period = Infinity) {
    const out = new Uint32Array(colors.length);
    for (let i = 0; i < colors.length; i++) {
        const thread = (start + i) % period;
        const noise = 0.65 * threadNoise(thread) + 0.35 * threadNoise(Math.floor(thread / 4) + 7919);
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
function fillTwillRelief(pixels, tileW, tileH, threadColors, isZTwist, k, weftColors = threadColors, originX = 0, originY = 0) {
    const shifts = isZTwist ? [2, 1, 0, 3] : [2, 3, 0, 1];
    const masks = getReliefMasks(k);
    const k2 = k * k;
    // The four shaded k x k blocks of each color (weft first and second half, warp first and second half),
    // computed once per color, then copied: the inner loop only moves pixels.
    const blocksByColor = new Map();
    const blocksFor = (color) => {
        let blocks = blocksByColor.get(color);
        if (blocks === undefined) {
            const shades = new Uint32Array(RELIEF_LEVELS);
            for (let l = 0; l < RELIEF_LEVELS; l++) {
                shades[l] = shadePixel(color, RELIEF_MIN + l * (RELIEF_MAX - RELIEF_MIN) / (RELIEF_LEVELS - 1));
            }
            blocks = new Uint32Array(4 * k2);
            for (let type = 0; type < 4; type++) {
                const mask = masks[type];
                for (let i = 0; i < k2; i++) blocks[type * k2 + i] = shades[mask[i]];
            }
            blocksByColor.set(color, blocks);
        }
        return blocks;
    };
    const warpBlocks = new Array(tileW);
    for (let x = 0; x < tileW; x++) warpBlocks[x] = blocksFor(threadColors[x]);
    const weftBlocks = new Array(tileH);
    for (let y = 0; y < tileH; y++) weftBlocks[y] = blocksFor(weftColors[y]);
    const rowPixels = tileW * k;

    for (let y = 0; y < tileH; y++) {
        const shift = shifts[(y + originY) & 3];
        const shiftAbove = shifts[(y - 1 + originY) & 3];
        const rowStart = y * k * rowPixels;
        for (let x = 0; x < tileW; x++) {
            const phase = (x + originX - shift) & 3;
            let blocks, type;
            if (phase < 2) {
                blocks = weftBlocks[y];
                type = phase;
            } else {
                blocks = warpBlocks[x];
                type = ((x + originX - shiftAbove) & 3) < 2 ? 2 : 3;
            }
            let source = type * k2;
            let offset = rowStart + x * k;
            for (let py = 0; py < k; py++) {
                for (let px = 0; px < k; px++) pixels[offset + px] = blocks[source + px];
                source += k;
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
let panPointer = null; // Pointer dragging the pattern
let objectView = 'scarf';
// Size of each object in cm; the scarf has fringes at both ends
const OBJECT_VIEWS = {
    scarf: { w: 30, h: 180, fringe: 6 },
    cushion: { w: 45, h: 45, fringe: 0 },
    kilt: { w: 60, h: 60, fringe: 0 },
};
let previewStageSize = '';
let previewLayoutTimer = 0;

function redrawTartan() {
    // Security: If no data, draw nothing
    if(!tartanStripes || tartanStripes.length === 0) return;

    // Zoom defines the size of a "thread" in pixels on screen
    let zoom = parseFloat(domElements.zoom?.value) || 2.0;
    let isSymmetric = domElements.sym ? domElements.sym.checked : false;
    let isZTwist = domElements.weaveZ ? domElements.weaveZ.checked : true; // Default Z

    let seqLen = countSettThreads(tartanStripes, isSymmetric);
    if (seqLen <= 0) return;

    // One more thread each way: the view can start part way through a thread
    let cols = Math.ceil(width / zoom) + 1;
    let rows = Math.ceil(height / zoom) + 1;
    let effectType = getEffectType();

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
    let startX = Math.floor(viewX);
    let startY = Math.floor(viewY);
    let originX = positiveModulo(startX, period);
    let originY = positiveModulo(startY, period);
    let warpColors = buildThreadColors(tartanStripes, isSymmetric, tileW, originX);
    let weftColors = buildThreadColors(tartanStripes, isSymmetric, tileH, originY);
    if (domElements.yarnIrregular?.checked) {
        warpColors = varyYarnColors(warpColors, YARN_VARIATION, originX, period);
        weftColors = varyYarnColors(weftColors, YARN_VARIATION, originY, period);
    }
    let tilePixels = new Uint32Array(tile.data.buffer);
    if (k > 1) fillTwillRelief(tilePixels, tileW, tileH, warpColors, isZTwist, k, weftColors, originX, originY);
    else fillTwillPixels(tilePixels, tileW, tileH, warpColors, isZTwist, weftColors, originX, originY);
    tileCtx.putImageData(tile, 0, 0);

    drawingContext.save();
    // Flat: crisp threads when enlarged, blended when several share a device pixel.
    // Relief: the tile is close to device resolution, so smooth any small rescaling.
    let devicePixels = zoom * pixelDensity();
    drawingContext.imageSmoothingEnabled = k > 1 ? devicePixels !== k : devicePixels < 1;
    // Part of a thread, snapped to device pixels so that threads stay crisp
    drawingContext.translate(
        -Math.round((viewX - startX) * devicePixels) / pixelDensity(),
        -Math.round((viewY - startY) * devicePixels) / pixelDensity()
    );
    drawingContext.scale(zoom / k, zoom / k);
    drawingContext.fillStyle = drawingContext.createPattern(weaveTileCanvas, 'repeat');
    drawingContext.fillRect(0, 0, cols * k, rows * k);
    drawingContext.restore();

    // Update textual info (Actual dimensions)
    updateScaleInfo(seqLen);
    updateActualValues();
    updateReadabilityUI();
    if (isPreviewOpen()) renderObjectPreview();
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
    if(el) el.textContent = formatNumber(sizeCm) + " cm";
    if (domElements.srtBarSize) {
        domElements.srtBarSize.textContent = TRANSLATIONS[currentLang].srt_bar_size
            .replace('%c', formatNumber(sizeCm))
            .replace('%n', totalThreads);
    }
    // The density field and its note follow the thread size, unless someone is typing in it
    const perCm = densityFromThreadMm(threadMm);
    if (domElements.density && document.activeElement !== domElements.density) domElements.density.value = perCm;
    if (domElements.threadMmNote) {
        domElements.threadMmNote.textContent = TRANSLATIONS[currentLang].note_thread_mm.replace('%', formatNumber(threadMm, 2));
    }

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

// The zoom slider is logarithmic: as much travel from 0.5 to 2 as from 3 to 12.

function clampZoom(value) {
    return Math.round(Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, value)) * 10) / 10;
}

function zoomToSlider(zoom) {
    return Math.round(Math.log(zoom / ZOOM_MIN) / Math.log(ZOOM_MAX / ZOOM_MIN) * 1000);
}

function sliderToZoom(position) {
    return ZOOM_MIN * Math.pow(ZOOM_MAX / ZOOM_MIN, position / 1000);
}

function readZoom() {
    return parseFloat(domElements.zoom?.value) || 2.0;
}

function syncZoomSlider() {
    if (domElements.zoomSlider) domElements.zoomSlider.value = zoomToSlider(clampZoom(readZoom()));
}

function positiveModulo(value, divisor) {
    return ((value % divisor) + divisor) % divisor;
}

// New view start, so that the thread under an anchor (in canvas pixels) does not move
function zoomViewAt(view, anchor, oldZoom, newZoom) {
    return view + anchor / oldZoom - anchor / newZoom;
}

// The anchor is the point that stays still; the middle of the canvas by default.
function setZoom(value, anchorX = width / 2, anchorY = height / 2) {
    const zoom = clampZoom(value);
    const current = readZoom();
    if (!domElements.zoom || zoom === current) return;
    viewX = zoomViewAt(viewX, anchorX, current, zoom);
    viewY = zoomViewAt(viewY, anchorY, current, zoom);
    domElements.zoom.value = zoom.toFixed(1);
    syncZoomSlider();
    updateZoom();
}

// One step in or out (buttons, wheel, keys); always moves by at least 0.1
function stepZoom(direction, anchorX, anchorY) {
    const current = readZoom();
    let next = clampZoom(direction > 0 ? current * ZOOM_STEP : current / ZOOM_STEP);
    if (next === current) next = clampZoom(current + direction * 0.1);
    setZoom(next, anchorX, anchorY);
}

function panView(dxPixels, dyPixels) {
    const zoom = readZoom();
    viewX -= dxPixels / zoom;
    viewY -= dyPixels / zoom;
    redrawTartan();
}

function resetView() {
    viewX = 0;
    viewY = 0;
    redrawTartan();
}
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
    content += currentSrtCode() || 'N/A';
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

    // Rendering settings, read back when the file is imported
    content += `RENDU:\n`;
    content += `- Sergé: ${domElements.weaveZ?.checked ?? true ? 'Z' : 'S'}\n`;
    content += `- Relief: ${getEffectType() === 'relief' ? Math.round(readReliefStrength() * 100) + ' %' : 'non'}\n`;
    content += `- Irrégularité du fil: ${domElements.yarnIrregular?.checked ? 'oui' : 'non'}\n\n`;

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

// --- SHARED LINK ---
// The pattern travels in the part of the URL after #, so no server is involved:
// #tartan=1&sym=1&z=1&mm=0.3&s=R.C80000.48_B.000064.8
function encodeSharedPattern(p) {
    const fields = [
        'tartan=1',
        `sym=${p.symmetric ? 1 : 0}`,
        `z=${p.zTwist ? 1 : 0}`,
        `mm=${p.threadMm}`,
        `id=${p.id}`
    ];
    if (p.relief !== null) fields.push(`rel=${p.relief}`);
    if (p.yarn) fields.push('yarn=1');
    fields.push('s=' + p.stripes.map(s => `${s.code}.${s.hex.slice(1)}.${s.count}`).join('_'));
    return fields.join('&');
}

// Returns null for anything that is not a complete, valid pattern.
function decodeSharedPattern(hash) {
    const text = String(hash).replace(/^#/, '');
    if (!text.startsWith('tartan=1&') || text.length > 20000) return null;
    const fields = new Map(text.split('&').map(part => {
        const i = part.indexOf('=');
        return [part.slice(0, i), part.slice(i + 1)];
    }));

    const parts = (fields.get('s') || '').split('_');
    if (parts.length < 2 || parts.length > 256) return null;
    const stripes = [];
    for (const part of parts) {
        const m = /^([A-Za-z0-9]{1,8})\.([0-9A-Fa-f]{6})\.([1-9][0-9]{0,5})$/.exec(part);
        if (!m) return null;
        stripes.push({ code: m[1], hex: '#' + m[2].toUpperCase(), count: parseInt(m[3], 10) });
    }

    const mm = parseFloat(fields.get('mm'));
    const relief = parseFloat(fields.get('rel'));
    const id = /^[0-9]{1,9}$/.test(fields.get('id') || '') ? parseInt(fields.get('id'), 10) : null;
    return {
        stripes,
        symmetric: fields.get('sym') === '1',
        zTwist: fields.get('z') !== '0',
        threadMm: mm > 0 && mm <= 20 ? mm : null,
        id,
        relief: relief >= 0 && relief <= 2 ? relief : null,
        yarn: fields.get('yarn') === '1'
    };
}

function paletteFromStripes(stripes) {
    const palette = [];
    for (const s of stripes) {
        const hex = s.hex.toUpperCase();
        if (palette.some(c => c.hex.toUpperCase() === hex)) continue;
        palette.push(SRT_PALETTE.find(c => c.hex.toUpperCase() === hex && c.code === s.code)
            || SRT_PALETTE.find(c => c.hex.toUpperCase() === hex)
            || { code: s.code, name: s.code, variant: null, hex: s.hex });
    }
    return palette;
}

// Makes a complete pattern the current one. The previous pattern goes to the history.
function applyLoadedPattern(p) {
    if (tartanStripes.length > 0) pushToHistory();
    tartanStripes = p.stripes;
    userPalette = paletteFromStripes(p.stripes);
    generationID = p.id ?? Math.floor(Math.random() * 1000000);

    if (domElements.sym) domElements.sym.checked = p.symmetric;
    if (domElements.weaveZ && p.zTwist !== undefined) {
        domElements.weaveZ.checked = p.zTwist;
        if (domElements.weaveS) domElements.weaveS.checked = !p.zTwist;
    }
    if (p.threadMm && domElements.threadMm) {
        domElements.threadMm.value = p.threadMm;
        if (domElements.threadType) domElements.threadType.value = 'custom';
        applyThreadTypeUI();
    }
    if (p.relief !== undefined && domElements.effectRelief) {
        domElements.effectRelief.checked = p.relief !== null;
        if (p.relief !== null && domElements.reliefStrength) domElements.reliefStrength.value = Math.round(p.relief * 100);
    }
    if (p.yarn !== undefined && domElements.yarnIrregular) domElements.yarnIrregular.checked = p.yarn;
    updateReliefStrengthUI();

    const counts = p.stripes.map(s => s.count);
    if (domElements.targetStripes) domElements.targetStripes.value = p.stripes.length;
    if (domElements.minWidth) domElements.minWidth.value = Math.min(...counts);
    if (domElements.maxWidth) domElements.maxWidth.value = Math.max(...counts);
    if (domElements.checkMode) domElements.checkMode.checked = counts.every(c => c === counts[0]);
    commitStructureSettings();

    showAppMessage(null);
    updateUserPaletteUI();
    updateGeneratedListUI();
    matchSrtWithExamples();
    redrawTartan();
    updateUndoButton();
    saveState();
}

// Reads back a file written by exportTXT. Colors come from the Ink/Stitch code, which holds
// the exact shades; the SRT code gives their names. Files from before the "RENDU" section
// leave the rendering settings as they are. Returns null when the file is not usable.
function parseExportedText(text) {
    const t = String(text).replace(/\r\n?/g, '\n');
    if (!t.includes('TARTAN GENERATOR - EXPORT')) return null;
    const ink = /^CODE INK\/STITCH:\n(.+)$/m.exec(t)?.[1]?.trim();
    if (!ink) return null;

    const srt = /^CODE SRT:\n(.+)$/m.exec(t)?.[1] || '';
    const codes = [...srt.matchAll(/([A-Z]+)\/?\d+/g)].map(m => m[1]);
    const tokens = [...ink.matchAll(/\(#([0-9A-Fa-f]{6})\)\/?([1-9][0-9]{0,5})/g)];
    if (tokens.length < 2 || tokens.length > 256) return null;

    const stripes = [];
    for (let i = 0; i < tokens.length; i++) {
        const hex = '#' + tokens[i][1].toUpperCase();
        const code = codes.length === tokens.length ? codes[i] : SRT_PALETTE.find(c => c.hex.toUpperCase() === hex)?.code;
        if (!code) return null;
        stripes.push({ code, hex, count: parseInt(tokens[i][2], 10) });
    }

    const pattern = { stripes, symmetric: !ink.startsWith('...') };
    const id = /^ID: ([0-9]{1,9})$/m.exec(t);
    if (id) pattern.id = parseInt(id[1], 10);
    const mm = parseFloat(/\(fil ([0-9.]+) ?mm\)/.exec(t)?.[1]);
    if (mm > 0 && mm <= 20) pattern.threadMm = mm;
    const twill = /^- Sergé: ([ZS])$/m.exec(t);
    if (twill) pattern.zTwist = twill[1] === 'Z';
    const relief = /^- Relief: (non|[0-9]{1,3} %)$/m.exec(t);
    if (relief) pattern.relief = relief[1] === 'non' ? null : Math.min(2, parseInt(relief[1], 10) / 100);
    const yarn = /^- Irrégularité du fil: (oui|non)$/m.exec(t);
    if (yarn) pattern.yarn = yarn[1] === 'oui';
    return pattern;
}

async function importExportedFile(file) {
    if (!file) return;
    let pattern = null;
    if (file.size <= 1000000) {
        try {
            pattern = parseExportedText(await file.text());
        } catch (error) {
            console.warn('Could not read the file', error);
        }
    }
    if (!pattern) {
        showAppMessage('msg_import_file_err', true);
        return;
    }
    applyLoadedPattern(pattern);
}

// Opens the pattern of the current URL, then cleans the URL: a reload must not bring it back
// over later work. Returns true when a pattern was opened.
function openSharedLink() {
    if (!location.hash.startsWith('#tartan=')) return false;
    const pattern = decodeSharedPattern(location.hash);
    history.replaceState(null, '', location.pathname + location.search);
    if (!pattern) {
        showAppMessage('msg_link_invalid', true);
        return false;
    }
    applyLoadedPattern(pattern);
    return true;
}

function buildSharedLink() {
    const relief = getEffectType() === 'relief' ? readReliefStrength() : null;
    const encoded = encodeSharedPattern({
        stripes: tartanStripes,
        symmetric: domElements.sym?.checked || false,
        zTwist: domElements.weaveZ?.checked ?? true,
        threadMm: parseFloat(domElements.threadMm?.value) || 1.11,
        id: generationID,
        relief,
        yarn: domElements.yarnIrregular?.checked || false
    });
    return location.href.split('#')[0] + '#' + encoded;
}

function copySharedLink() {
    if (tartanStripes.length === 0) return;
    const link = buildSharedLink();
    const manualCopy = () => window.prompt(TRANSLATIONS[currentLang].msg_link_manual, link);
    if (!navigator.clipboard) {
        manualCopy();
        return;
    }
    navigator.clipboard.writeText(link).then(() => showAppMessage('msg_link_copied')).catch(manualCopy);
}

// --- ESTIMATE A TARTAN FROM A PHOTO ---
// A twill shows as much warp as weft, so the mean of a column is half its warp thread and
// half the average weft, which is the same for every column. The stripes can therefore be
// read from the means of the columns, then the repeat and the pivots from their profile.

// Mean linear color along one axis. shear > 0 follows lines tilted by that slope.
// `step` skips lines across the axis, to go faster. Returns the bins seen by most lines.
function axisProfile(image, axis, shear = 0, step = 1) {
    const { data, width, height } = image;
    const along = axis === 'x' ? width : height;
    const across = axis === 'x' ? height : width;
    const spread = Math.ceil(Math.abs(shear) * across);
    const offset = shear < 0 ? spread : 0;
    const bins = along + spread + 1;
    const sums = new Float64Array(bins * 3);
    const counts = new Uint32Array(bins);
    const linear = new Float64Array(256);
    for (let i = 0; i < 256; i++) linear[i] = srgbToLinear(i);

    for (let b = 0; b < across; b += step) {
        const shift = b * shear + offset;
        for (let a = 0; a < along; a++) {
            const x = axis === 'x' ? a : b, y = axis === 'x' ? b : a;
            const bin = Math.round(a + shift);
            const p = (y * width + x) * 4;
            sums[bin * 3] += linear[data[p]];
            sums[bin * 3 + 1] += linear[data[p + 1]];
            sums[bin * 3 + 2] += linear[data[p + 2]];
            counts[bin]++;
        }
    }

    const needed = Math.max(1, across / step * 0.7);
    let first = 0, last = bins - 1;
    while (first < bins && counts[first] < needed) first++;
    while (last > first && counts[last] < needed) last--;
    const n = last - first + 1;
    const colors = new Float64Array(n * 3);
    for (let i = 0; i < n; i++) {
        const count = Math.max(1, counts[first + i]);
        for (let c = 0; c < 3; c++) colors[i * 3 + c] = sums[(first + i) * 3 + c] / count;
    }
    return { n, colors };
}

// Divides out a steady change of light across the photo
function removeLightTrend(profile) {
    const { n, colors } = profile;
    const middle = (n - 1) / 2;
    let sumXY = 0, sumXX = 0, sumY = 0;
    const log = new Float64Array(n);
    for (let i = 0; i < n; i++) {
        log[i] = Math.log(0.2126 * colors[i * 3] + 0.7152 * colors[i * 3 + 1] + 0.0722 * colors[i * 3 + 2] + 1e-4);
        sumY += log[i];
    }
    const mean = sumY / n;
    for (let i = 0; i < n; i++) {
        sumXY += (i - middle) * (log[i] - mean);
        sumXX += (i - middle) * (i - middle);
    }
    const slope = sumXX > 0 ? sumXY / sumXX : 0;
    const flat = new Float64Array(n * 3);
    for (let i = 0; i < n; i++) {
        const gain = Math.exp(-slope * (i - middle));
        for (let c = 0; c < 3; c++) flat[i * 3 + c] = colors[i * 3 + c] * gain;
    }
    return { n, colors: flat };
}

// Edges are sharpest when the lines follow the stripes
function profileSharpness(profile) {
    let total = 0;
    for (let i = 3; i < profile.n * 3; i += 3) {
        total += Math.pow(profile.colors[i + 1] - profile.colors[i - 2], 2);
    }
    return total / Math.max(1, profile.n);
}

// Slope of the stripes: a photo is rarely perfectly straight (up to about 8 degrees here)
function estimateShear(image, axis) {
    const across = axis === 'x' ? image.height : image.width;
    const step = Math.max(1, Math.floor(across / 200));
    let best = 0, bestScore = -1;
    const search = (from, to, delta) => {
        for (let shear = from; shear <= to + 1e-9; shear += delta) {
            const score = profileSharpness(axisProfile(image, axis, shear, step));
            if (score > bestScore) {
                bestScore = score;
                best = shear;
            }
        }
    };
    search(-0.14, 0.14, 0.01);
    const coarse = best;
    search(coarse - 0.008, coarse + 0.008, 0.002);
    return best;
}

// Removes the constant weft part from the means, then converts to Lab
function unmixProfile(profile) {
    const { n, colors } = profile;
    const mean = [0, 0, 0];
    for (let i = 0; i < n * 3; i++) mean[i % 3] += colors[i] / n;
    const lab = new Float64Array(n * 3);
    const clamp = v => Math.max(ESTIMATE_DARK_FLOOR, Math.min(1, v));
    for (let i = 0; i < n; i++) {
        const value = linearRgbToLab(
            clamp(2 * colors[i * 3] - mean[0]),
            clamp(2 * colors[i * 3 + 1] - mean[1]),
            clamp(2 * colors[i * 3 + 2] - mean[2])
        );
        lab.set(value, i * 3);
    }
    return lab;
}

function labDistance(a, i, b, j) {
    const dL = a[i * 3] - b[j * 3], da = a[i * 3 + 1] - b[j * 3 + 1], db = a[i * 3 + 2] - b[j * 3 + 2];
    return Math.sqrt(dL * dL + da * da + db * db);
}

// Smallest shift that lays the profile over itself, or null when under two repeats are seen
function findPeriod(lab, n) {
    const minLag = Math.max(8, Math.floor(n / 25));
    const maxLag = Math.floor(n * 0.78);
    if (maxLag <= minLag) return null;
    const mismatch = new Float64Array(maxLag + 4);
    for (let lag = 1; lag < maxLag + 4 && lag < n; lag++) {
        let sum = 0;
        for (let i = 0; i + lag < n; i++) sum += labDistance(lab, i, lab, i + lag);
        mismatch[lag] = sum / (n - lag);
    }

    let lowest = Infinity, average = 0, seen = 0;
    for (let lag = minLag; lag <= maxLag; lag++) {
        lowest = Math.min(lowest, mismatch[lag]);
        average += mismatch[lag];
        seen++;
    }
    average /= seen;
    // A plain area lays over itself at any shift: that is not a repeat
    if (average < 3 || lowest > ESTIMATE_PERIOD_MAX || lowest > average * 0.6) return null;

    const accepted = Math.max(lowest * 1.3, lowest + 1.5);
    for (let lag = minLag; lag <= maxLag; lag++) {
        if (mismatch[lag] > accepted) continue;
        let isMinimum = true;
        for (let k = 1; k <= 3 && isMinimum; k++) {
            if (mismatch[lag] > mismatch[lag - k] || mismatch[lag] > mismatch[lag + k]) isMinimum = false;
        }
        if (isMinimum) return { lag, mismatch: mismatch[lag] };
    }
    return null;
}

// Best mirror point of the profile. With a known repeat, it must hold over half a repeat.
function findMirror(lab, n, period) {
    const reach = period ? Math.ceil(period / 2) : Math.floor(n / 2);
    const needed = period ? Math.floor(reach * 0.95) : Math.max(16, Math.floor(n * 0.3));
    let best = null;
    for (let twice = 1; twice < 2 * n - 2; twice++) {
        let left = twice % 2 === 0 ? twice / 2 - 1 : (twice - 1) / 2;
        let right = twice % 2 === 0 ? twice / 2 + 1 : left + 1;
        let sum = 0, compared = 0;
        while (left >= 0 && right < n && compared < reach) {
            sum += labDistance(lab, left--, lab, right++);
            compared++;
        }
        if (compared < needed) continue;
        const distance = sum / compared;
        if (!best || distance < best.distance) best = { center: twice / 2, distance, reach: compared };
    }
    return best;
}

function averageBuckets(lab, n, length, bucketOf) {
    const sums = new Float64Array(length * 3);
    const counts = new Uint32Array(length);
    for (let i = 0; i < n; i++) {
        const b = bucketOf(i);
        if (b < 0 || b >= length) continue;
        for (let c = 0; c < 3; c++) sums[b * 3 + c] += lab[i * 3 + c];
        counts[b]++;
    }
    for (let b = 0; b < length; b++) {
        if (counts[b] > 0) {
            for (let c = 0; c < 3; c++) sums[b * 3 + c] /= counts[b];
        } else if (b > 0) {
            for (let c = 0; c < 3; c++) sums[b * 3 + c] = sums[(b - 1) * 3 + c];
        }
    }
    return sums;
}

// Half a repeat, from one pivot to the other
function foldMirrored(lab, n, center, period) {
    const length = period ? Math.round(period / 2) + 1 : Math.floor(Math.max(center, n - 1 - center)) + 1;
    return {
        length,
        lab: averageBuckets(lab, n, length, i => {
            const t = period ? positiveModulo(i - center, period) : Math.abs(i - center);
            return Math.floor(period ? Math.min(t, period - t) : t);
        })
    };
}

// One repeat, starting on its strongest edge so that no stripe is cut in two
function foldRepeat(lab, n, period) {
    const folded = averageBuckets(lab, n, period, i => i % period);
    let start = 0, strongest = -1;
    for (let i = 0; i < period; i++) {
        const edge = labDistance(folded, i, folded, (i + period - 1) % period);
        if (edge > strongest) {
            strongest = edge;
            start = i;
        }
    }
    const rotated = new Float64Array(period * 3);
    for (let i = 0; i < period; i++) rotated.set(folded.subarray(((i + start) % period) * 3, ((i + start) % period) * 3 + 3), i * 3);
    return { length: period, lab: rotated };
}

// Starts from one segment per position and merges the most similar neighbors
function segmentProfile(lab, length, tolerance, cyclic = false) {
    let segments = [];
    for (let i = 0; i < length; i++) segments.push({ width: 1, lab: [lab[i * 3], lab[i * 3 + 1], lab[i * 3 + 2]] });
    const distance = (a, b) => Math.hypot(a.lab[0] - b.lab[0], a.lab[1] - b.lab[1], a.lab[2] - b.lab[2]);

    const gaps = new Float64Array(length);
    for (let i = 0; i + 1 < segments.length; i++) gaps[i] = distance(segments[i], segments[i + 1]);
    while (segments.length > 1) {
        let at = 0;
        for (let i = 1; i + 1 < segments.length; i++) if (gaps[i] < gaps[at]) at = i;
        if (gaps[at] > tolerance) break;
        const a = segments[at], b = segments[at + 1];
        const width = a.width + b.width;
        a.lab = a.lab.map((v, c) => (v * a.width + b.lab[c] * b.width) / width);
        a.width = width;
        segments.splice(at + 1, 1);
        gaps.copyWithin(at + 1, at + 2);
        if (at > 0) gaps[at - 1] = distance(segments[at - 1], a);
        if (at + 1 < segments.length) gaps[at] = distance(a, segments[at + 1]);
    }
    return absorbTransitions(segments, cyclic);
}

// A narrow segment whose color lies between its two neighbors is only the blur of their edge
function absorbTransitions(segments, cyclic = false) {
    const result = [];
    for (let i = 0; i < segments.length; i++) {
        const s = segments[i], before = result[result.length - 1], after = segments[i + 1];
        if (before && after && s.width <= ESTIMATE_EDGE_WIDTH && isBetween(s.lab, before.lab, after.lab)) {
            const half = s.width / 2;
            before.width += half;
            after.width += half;
            continue;
        }
        result.push({ width: s.width, lab: s.lab });
    }
    // In a repeat, the two ends touch each other
    if (cyclic && result.length > 3) {
        const isBlur = (s, a, b) => s.width <= ESTIMATE_EDGE_WIDTH && isBetween(s.lab, a.lab, b.lab);
        if (isBlur(result[0], result[result.length - 1], result[1])) result[1].width += result.shift().width;
        if (isBlur(result[result.length - 1], result[result.length - 2], result[0])) result[0].width += result.pop().width;
    }
    return result;
}

function isBetween(point, a, b) {
    const ab = [0, 1, 2].map(c => b[c] - a[c]);
    const ap = [0, 1, 2].map(c => point[c] - a[c]);
    const length = ab.reduce((sum, v) => sum + v * v, 0);
    if (length === 0) return false;
    const t = ab.reduce((sum, v, c) => sum + v * ap[c], 0) / length;
    if (t <= 0 || t >= 1) return false;
    return Math.hypot(...ab.map((v, c) => ap[c] - v * t)) <= 10;
}

function nearestSrtColor(lab) {
    if (!srtLabTable) srtLabTable = SRT_PALETTE.map(color => ({ color, lab: hexToLab(color.hex) }));
    let best = null, bestDistance = Infinity;
    for (const entry of srtLabTable) {
        const d = Math.hypot(entry.lab[0] - lab[0], entry.lab[1] - lab[1], entry.lab[2] - lab[2]);
        if (d < bestDistance) {
            bestDistance = d;
            best = entry.color;
        }
    }
    return best;
}

// From measured segments to a sett: SRT colors, at most 8 of them, even thread counts.
function segmentsToStripes(segments, symmetric, targetThreads, lightShift = 0) {
    // The dark floor and the light of a photo lift black: it is rarely a true dark grey
    const blackColor = SRT_PALETTE.find(c => c.code === 'K');
    const nameColor = lab => lab[0] < 17 && Math.hypot(lab[1], lab[2]) < 8 ? blackColor : nearestSrtColor(lab);
    let parts = segments.map(s => ({ color: nameColor([s.lab[0] + lightShift, s.lab[1], s.lab[2]]), width: s.width }));
    const totals = () => {
        const map = new Map();
        for (const p of parts) map.set(p.color, (map.get(p.color) || 0) + p.width);
        return map;
    };
    const replace = (from, to) => parts.forEach(p => { if (p.color === from) p.color = to; });

    // One shade per SRT code: the code could not tell two shades apart
    for (const [color] of [...totals()].sort((a, b) => b[1] - a[1])) {
        const widest = [...totals()].filter(([c]) => c.code === color.code).sort((a, b) => b[1] - a[1])[0][0];
        if (widest !== color) replace(color, widest);
    }
    while (totals().size > ESTIMATE_MAX_COLORS) {
        const entries = [...totals()];
        let pair = null, closest = Infinity;
        for (let i = 0; i < entries.length; i++) {
            for (let j = i + 1; j < entries.length; j++) {
                const d = colorDifference(entries[i][0].hex, entries[j][0].hex);
                if (d < closest) {
                    closest = d;
                    pair = entries[i][1] < entries[j][1] ? [entries[i][0], entries[j][0]] : [entries[j][0], entries[i][0]];
                }
            }
        }
        replace(pair[0], pair[1]);
    }

    const merged = [];
    for (const p of parts) {
        const previous = merged[merged.length - 1];
        if (previous && previous.color === p.color) previous.width += p.width;
        else merged.push({ ...p });
    }
    if (!symmetric && merged.length > 2 && merged[0].color === merged[merged.length - 1].color) {
        merged[0].width += merged.pop().width;
    }
    if (merged.length < 2) return null;

    // A pivot is seen from its middle: its whole width is twice what was measured
    const last = merged.length - 1;
    const fullWidth = merged.map((p, i) => symmetric && (i === 0 || i === last) ? Math.max(1, 2 * p.width - 1) : p.width);
    const repeatWidth = fullWidth.reduce((sum, w, i) => sum + (symmetric && i !== 0 && i !== last ? 2 * w : w), 0);
    const factor = targetThreads / repeatWidth;
    return merged.map((p, i) => ({
        code: p.color.code,
        hex: p.color.hex,
        count: Math.max(2, Math.round(fullWidth[i] * factor / 2) * 2)
    }));
}

function prepareAxis(image, axis) {
    const profile = axisProfile(image, axis, estimateShear(image, axis));
    const n = profile.n;
    let lab = unmixProfile(profile);
    let period = findPeriod(lab, n);
    // The light correction is kept only if it makes the repeats line up better
    const flatLab = unmixProfile(removeLightTrend(profile));
    const flatPeriod = findPeriod(flatLab, n);
    if (flatPeriod && (!period || flatPeriod.mismatch < period.mismatch * 0.9)) {
        lab = flatLab;
        period = flatPeriod;
    }
    const mirror = findMirror(lab, n, period?.lag);
    const symmetric = !!mirror && mirror.distance <= ESTIMATE_MIRROR_MAX;
    const rank = period ? (symmetric ? 3 : 2) : (symmetric ? 1 : 0);
    return { axis, n, lab, rank, symmetric, mirror, period: period?.lag ?? null };
}

// Cuts a prepared axis into stripes, as a symmetric sett or not
function readAxis(prepared, tolerance, symmetric = prepared.symmetric) {
    const { axis, n, lab, rank, period, mirror } = prepared;
    let folded;
    if (symmetric) folded = foldMirrored(lab, n, mirror.center, period);
    else if (period) folded = foldRepeat(lab, n, period);
    else folded = { length: n, lab };
    return { axis, n, rank, symmetric, period, segments: segmentProfile(folded.lab, folded.length, tolerance, !symmetric && !!period) };
}

function analyzeAxis(image, axis, tolerance) {
    return readAxis(prepareAxis(image, axis), tolerance);
}

// image: { data, width, height } in RGBA. Returns null when no sett can be read.
function estimateTartan(image, { tolerance = 12, targetThreads = 240 } = {}) {
    const results = [analyzeAxis(image, 'x', tolerance), analyzeAxis(image, 'y', tolerance)]
        .filter(r => r.segments.length >= 2)
        .sort((a, b) => b.rank - a.rank || b.n - a.n);
    if (results.length === 0) return null;
    const best = results[0];
    const stripes = segmentsToStripes(best.segments, best.symmetric, targetThreads);
    if (!stripes) return null;
    return { stripes, symmetric: best.symmetric, confidence: ['low', 'low', 'fair', 'good'][best.rank], axis: best.axis, period: best.period };
}

// --- Proposals for a person to judge ---
// A photo leaves doubts, so up to 10 readings are offered. Gold confirms one; silver marks
// those that are close, and an intermediate is made from them for another round.

function createProposalList(limit = ESTIMATE_MAX_PROPOSALS) {
    const list = [];
    const seen = new Set();
    list.add = (stripes, symmetric, caption, confidence = null) => {
        if (!stripes || list.length >= limit) return;
        const key = symmetric + stripes.map(s => s.hex + s.count).join();
        if (seen.has(key)) return;
        seen.add(key);
        list.push({ stripes, symmetric, caption, confidence, star: null });
    };
    return list;
}

// The closest SRT color that is not one of the colors of the sett
function alternativeColor(hex, stripes) {
    const used = new Set(stripes.map(s => s.hex));
    const lab = hexToLab(hex);
    if (!srtLabTable) srtLabTable = SRT_PALETTE.map(color => ({ color, lab: hexToLab(color.hex) }));
    let best = null, bestDistance = Infinity;
    for (const entry of srtLabTable) {
        if (used.has(entry.color.hex)) continue;
        const d = Math.hypot(entry.lab[0] - lab[0], entry.lab[1] - lab[1], entry.lab[2] - lab[2]);
        if (d < bestDistance) {
            bestDistance = d;
            best = entry.color;
        }
    }
    return best;
}

// Small changes around a sett, to complete a series
function addVariants(list, base) {
    const { stripes, symmetric } = base;
    const coverage = new Map();
    for (const s of stripes) coverage.set(s.hex, (coverage.get(s.hex) || 0) + s.count);
    const widest = [...coverage].sort((a, b) => b[1] - a[1]).map(([hex]) => hex);

    const counts = stripes.map(s => s.count).sort((a, b) => a - b);
    const median = counts[Math.floor(counts.length / 2)];
    const nudge = delta => stripes.map(s => s.count < median ? { ...s, count: Math.max(2, s.count + delta) } : { ...s });
    list.add(nudge(4), symmetric, ['thin_wider']);
    list.add(nudge(-2), symmetric, ['thin_narrower']);

    for (const hex of widest) {
        const replacement = alternativeColor(hex, stripes);
        if (!replacement) continue;
        const from = stripes.find(s => s.hex === hex).code;
        list.add(stripes.map(s => s.hex === hex ? { ...s, code: replacement.code, hex: replacement.hex } : { ...s }), symmetric, ['color', `${from} → ${replacement.code}`]);
    }
}

// First series, from the photo
function estimateProposals(image, { tolerance = 12, targetThreads = 240 } = {}) {
    const axes = [prepareAxis(image, 'x'), prepareAxis(image, 'y')]
        .filter(p => readAxis(p, tolerance).segments.length >= 2)
        .sort((a, b) => b.rank - a.rank || b.n - a.n);
    const list = createProposalList();
    if (axes.length === 0) return list;

    const best = axes[0];
    const confidence = ['low', 'low', 'fair', 'good'][best.rank];
    const add = (prepared, factor, symmetric, caption, shift = 0) => {
        const { segments } = readAxis(prepared, tolerance * factor, symmetric);
        if (segments.length >= 2) list.add(segmentsToStripes(segments, symmetric, targetThreads, shift), symmetric, caption, confidence);
    };
    add(best, 1, best.symmetric, ['base']);
    add(best, 0.6, best.symmetric, ['finer']);
    add(best, 1.6, best.symmetric, ['coarser']);
    add(best, 1, best.symmetric, ['lighter'], 10);
    add(best, 1, best.symmetric, ['darker'], -10);
    if (best.symmetric || best.mirror) add(best, 1, !best.symmetric, [best.symmetric ? 'asymmetric' : 'symmetric']);
    if (axes[1]) add(axes[1], 1, axes[1].symmetric, ['other_axis']);
    add(best, 0.35, best.symmetric, ['finer']);
    add(best, 2.4, best.symmetric, ['coarser']);
    if (list.length > 0) addVariants(list, list[0]);
    return list;
}

// One full repeat as evenly spaced colors. A symmetric sett starts in the middle of its pivot.
function settProfile(stripes, symmetric, length = ESTIMATE_BLEND_LENGTH) {
    const { sequence, totalThreads } = buildWeavingSheetData(stripes, symmetric, 1);
    const labs = sequence.map(s => hexToLab(s.hex));
    const start = symmetric ? sequence[0].count / 2 : 0;
    const profile = new Float64Array(length * 3);
    for (let i = 0; i < length; i++) {
        let position = positiveModulo((i + 0.5) / length * totalThreads + start, totalThreads);
        let run = 0;
        while (run < sequence.length - 1 && position >= sequence[run].count) position -= sequence[run++].count;
        profile.set(labs[run], i * 3);
    }
    return profile;
}

// Turns a profile, or reads it backwards, to lay it best over the reference
function alignProfile(reference, profile, length = ESTIMATE_BLEND_LENGTH) {
    let best = null, bestCost = Infinity;
    for (const reversed of [false, true]) {
        for (let shift = 0; shift < length; shift++) {
            let cost = 0;
            for (let i = 0; i < length && cost < bestCost; i++) {
                const j = (reversed ? length - 1 - i + shift : i + shift) % length;
                cost += labDistance(reference, i, profile, j);
            }
            if (cost < bestCost) {
                bestCost = cost;
                best = { reversed, shift };
            }
        }
    }
    const aligned = new Float64Array(length * 3);
    for (let i = 0; i < length; i++) {
        const j = (best.reversed ? length - 1 - i + best.shift : i + best.shift) % length;
        aligned.set(profile.subarray(j * 3, j * 3 + 3), i * 3);
    }
    return aligned;
}

// Next series: the intermediate of the silver proposals, then choices around it
function blendProposals(silvers, { tolerance = 12, targetThreads = 240 } = {}) {
    const length = ESTIMATE_BLEND_LENGTH;
    const kept = silvers.slice(0, 3);
    const list = createProposalList(ESTIMATE_MAX_PROPOSALS - kept.length);
    const symmetricVotes = silvers.filter(s => s.symmetric).length;
    const symmetric = symmetricVotes * 2 > silvers.length || (symmetricVotes * 2 === silvers.length && silvers[0].symmetric);

    const first = silvers.find(s => s.symmetric === symmetric);
    const reference = settProfile(first.stripes, first.symmetric, length);
    const mean = new Float64Array(length * 3);
    for (const silver of silvers) {
        const profile = settProfile(silver.stripes, silver.symmetric, length);
        const aligned = silver === first ? profile : alignProfile(reference, profile, length);
        for (let i = 0; i < length * 3; i++) mean[i] += aligned[i] / silvers.length;
    }

    const folded = symmetric ? foldMirrored(mean, length, -0.5, length) : foldRepeat(mean, length, length);
    const add = (factor, caption, shift = 0) => {
        const segments = segmentProfile(folded.lab, folded.length, tolerance * factor, !symmetric);
        if (segments.length >= 2) list.add(segmentsToStripes(segments, symmetric, targetThreads, shift), symmetric, caption);
    };
    add(1, ['intermediate']);
    add(0.6, ['finer']);
    add(1.6, ['coarser']);
    add(1, ['lighter'], 10);
    add(1, ['darker'], -10);
    if (list.length > 0) addVariants(list, list[0]);

    const result = [...list];
    const seen = new Set(result.map(p => p.symmetric + p.stripes.map(s => s.hex + s.count).join()));
    for (const silver of kept) {
        const key = silver.symmetric + silver.stripes.map(s => s.hex + s.count).join();
        if (!seen.has(key)) result.push({ ...silver, caption: ['kept'], star: null });
    }
    return result;
}

function rescaleStripes(stripes, symmetric, targetThreads) {
    const factor = targetThreads / countSettThreads(stripes, symmetric);
    return stripes.map(s => ({ ...s, count: Math.max(2, Math.round(s.count * factor / 2) * 2) }));
}

// --- Inventing a tartan from any image ---
// No tartan to find here: the colors of the image become the palette, and the order and
// width of the colors met along a line across it become the sett.

// The image reduced to a small grid of Lab colors
function imageToLabGrid(image, side = INVENT_GRID_SIDE) {
    const { data, width, height } = image;
    const scale = Math.min(1, side / Math.max(width, height));
    const w = Math.max(1, Math.round(width * scale));
    const h = Math.max(1, Math.round(height * scale));
    const linear = new Float64Array(256);
    for (let i = 0; i < 256; i++) linear[i] = srgbToLinear(i);

    const sums = new Float64Array(w * h * 3);
    const counts = new Uint32Array(w * h);
    for (let y = 0; y < height; y++) {
        const gy = Math.min(h - 1, Math.floor(y * scale));
        for (let x = 0; x < width; x++) {
            const cell = gy * w + Math.min(w - 1, Math.floor(x * scale));
            const p = (y * width + x) * 4;
            sums[cell * 3] += linear[data[p]];
            sums[cell * 3 + 1] += linear[data[p + 1]];
            sums[cell * 3 + 2] += linear[data[p + 2]];
            counts[cell]++;
        }
    }
    const lab = new Float64Array(w * h * 3);
    for (let i = 0; i < w * h; i++) {
        const n = Math.max(1, counts[i]);
        lab.set(linearRgbToLab(sums[i * 3] / n, sums[i * 3 + 1] / n, sums[i * 3 + 2] / n), i * 3);
    }
    return { w, h, lab };
}

// Groups the cells into at most k colors (k-means, always the same result for an image)
function clusterColors(grid, k, seed = 1) {
    const { w, h, lab } = grid;
    const n = w * h;
    const rand = seededRandom(seed);
    const squared = (i, center) => Math.pow(lab[i * 3] - center[0], 2) + Math.pow(lab[i * 3 + 1] - center[1], 2) + Math.pow(lab[i * 3 + 2] - center[2], 2);
    const cellColor = i => [lab[i * 3], lab[i * 3 + 1], lab[i * 3 + 2]];

    // Starting colors spread over the image, each far from the previous ones
    let centers = [cellColor(Math.floor(rand() * n))];
    const nearest = new Float64Array(n).fill(Infinity);
    while (centers.length < k) {
        let total = 0;
        for (let i = 0; i < n; i++) {
            nearest[i] = Math.min(nearest[i], squared(i, centers[centers.length - 1]));
            total += nearest[i];
        }
        if (total < 1e-6) break;
        let target = rand() * total, chosen = n - 1;
        for (let i = 0; i < n; i++) {
            target -= nearest[i];
            if (target <= 0) {
                chosen = i;
                break;
            }
        }
        centers.push(cellColor(chosen));
    }

    const labels = new Uint8Array(n);
    const assign = () => {
        for (let i = 0; i < n; i++) {
            let best = 0, bestDistance = Infinity;
            for (let c = 0; c < centers.length; c++) {
                const d = squared(i, centers[c]);
                if (d < bestDistance) {
                    bestDistance = d;
                    best = c;
                }
            }
            labels[i] = best;
        }
    };
    const update = () => {
        const sums = centers.map(() => [0, 0, 0, 0]);
        for (let i = 0; i < n; i++) {
            const s = sums[labels[i]];
            s[0] += lab[i * 3];
            s[1] += lab[i * 3 + 1];
            s[2] += lab[i * 3 + 2];
            s[3]++;
        }
        centers = centers.map((center, c) => sums[c][3] > 0 ? [sums[c][0] / sums[c][3], sums[c][1] / sums[c][3], sums[c][2] / sums[c][3]] : center);
        return sums.map(s => s[3]);
    };
    let weights = [];
    for (let iteration = 0; iteration < 12; iteration++) {
        assign();
        weights = update();
    }

    // Groups that ended up alike, or empty, are merged away
    const target = centers.map((_, c) => c);
    for (let a = 0; a < centers.length; a++) {
        for (let b = a + 1; b < centers.length; b++) {
            if (target[b] === b && Math.hypot(centers[a][0] - centers[b][0], centers[a][1] - centers[b][1], centers[a][2] - centers[b][2]) < INVENT_MERGE_DISTANCE) target[b] = target[a];
        }
    }
    const kept = [...new Set(target)].filter(c => weights[c] > 0 || target.some((t, i) => t === c && weights[i] > 0));
    const renumber = new Map(kept.map((c, i) => [c, i]));
    for (let i = 0; i < n; i++) labels[i] = renumber.get(target[labels[i]]);
    const total = new Array(kept.length).fill(0);
    target.forEach((t, c) => { if (renumber.has(t)) total[renumber.get(t)] += weights[c]; });
    return { centers: kept.map((c, i) => ({ lab: centers[c], weight: total[i] })), labels };
}

// The main color of the cells around each point of a line across the grid
function readImageLine(grid, labels, colorCount, from, to) {
    const { w, h } = grid;
    const length = Math.max(Math.abs(to[0] - from[0]), Math.abs(to[1] - from[1])) + 1;
    const line = new Uint8Array(length);
    const counts = new Uint32Array(colorCount);
    for (let i = 0; i < length; i++) {
        const t = length > 1 ? i / (length - 1) : 0;
        const cx = Math.round(from[0] + (to[0] - from[0]) * t);
        const cy = Math.round(from[1] + (to[1] - from[1]) * t);
        counts.fill(0);
        for (let y = Math.max(0, cy - 2); y <= Math.min(h - 1, cy + 2); y++) {
            for (let x = Math.max(0, cx - 2); x <= Math.min(w - 1, cx + 2); x++) counts[labels[y * w + x]]++;
        }
        let best = 0;
        for (let c = 1; c < colorCount; c++) if (counts[c] > counts[best]) best = c;
        line[i] = best;
    }
    return line;
}

// Runs of one color along a line, with the narrowest ones absorbed by a neighbor
function lineToRuns(line, maxRuns = INVENT_MAX_RUNS) {
    const merge = runs => runs.reduce((out, run) => {
        const last = out[out.length - 1];
        if (last && last.label === run.label) last.width += run.width;
        else out.push({ ...run });
        return out;
    }, []);
    let runs = merge(Array.from(line, label => ({ label, width: 1 })));
    const minWidth = Math.max(2, line.length / 50);
    while (runs.length > 1) {
        let at = 0;
        for (let i = 1; i < runs.length; i++) if (runs[i].width < runs[at].width) at = i;
        if (runs.length <= maxRuns && runs[at].width >= minWidth) break;
        const before = runs[at - 1], after = runs[at + 1];
        const neighbor = !before ? after : !after ? before : (before.width >= after.width ? before : after);
        neighbor.width += runs[at].width;
        runs.splice(at, 1);
        runs = merge(runs);
    }
    return runs;
}

// Up to 10 tartans made from one image
function inventProposals(image, { targetThreads = 240 } = {}) {
    const grid = imageToLabGrid(image);
    const list = createProposalList();
    const { w, h } = grid;
    const right = w - 1, bottom = h - 1, middleX = Math.floor(w / 2), middleY = Math.floor(h / 2);
    const lines = {
        horizontal: [[0, middleY], [right, middleY]],
        vertical: [[middleX, 0], [middleX, bottom]],
        diagonal: [[0, 0], [right, bottom]],
        otherDiagonal: [[right, 0], [0, bottom]],
        upper: [[0, Math.floor(h / 3)], [right, Math.floor(h / 3)]],
        side: [[Math.floor(w / 3), 0], [Math.floor(w / 3), bottom]]
    };
    const clusterings = new Map();
    const clustered = k => {
        if (!clusterings.has(k)) clusterings.set(k, clusterColors(grid, k));
        return clusterings.get(k);
    };
    const addSegments = (segments, symmetric, caption) => {
        if (segments.length >= 2) list.add(segmentsToStripes(segments, symmetric, targetThreads), symmetric, caption);
    };
    const addLine = (k, name, caption, symmetric = true) => {
        const { centers, labels } = clustered(k);
        if (centers.length < 2) return;
        const runs = lineToRuns(readImageLine(grid, labels, centers.length, lines[name][0], lines[name][1]));
        addSegments(runs.map(run => ({ width: run.width, lab: centers[run.label].lab })), symmetric, caption);
    };
    // Every color of the image, dark and light in turn, as wide as the room it takes
    const addAreas = (k, caption) => {
        const { centers } = clustered(k);
        const sorted = [...centers].sort((a, b) => a.lab[0] - b.lab[0]);
        const alternating = sorted.map((_, i) => sorted[i % 2 === 0 ? i / 2 : sorted.length - 1 - (i - 1) / 2]);
        addSegments(alternating.map(c => ({ width: Math.sqrt(c.weight), lab: c.lab })), true, caption);
    };

    addLine(5, 'horizontal', ['invent_horizontal']);
    addLine(5, 'vertical', ['invent_vertical']);
    addLine(5, 'diagonal', ['invent_diagonal']);
    addAreas(5, ['invent_areas']);
    addLine(3, 'horizontal', ['invent_colors', 3]);
    addLine(4, 'vertical', ['invent_colors', 4]);
    addLine(8, 'horizontal', ['invent_colors', 8]);
    addLine(5, 'horizontal', ['asymmetric'], false);
    addLine(6, 'otherDiagonal', ['invent_diagonal']);
    addLine(5, 'upper', ['invent_horizontal']);
    addLine(5, 'side', ['invent_vertical']);
    addAreas(8, ['invent_areas']);
    if (list.length > 0) addVariants(list, list[0]);
    return list;
}

function isInventMode() {
    return !!domElements.estimateModeInvent?.checked;
}

let estimateState = null; // { photo, region, proposals, selected, result, rounds, opener }

function isEstimateOpen() {
    return !!domElements.estimateModal && !domElements.estimateModal.hidden;
}

// Importer > photo de tartan reads a tartan; Nouveau motif > image invents one
let pendingImageMode = 'read';

async function openEstimateFromFile(file, mode = 'read') {
    if (!file) return;
    let bitmap = null;
    if (file.size <= 40000000) {
        try {
            bitmap = await createImageBitmap(file);
        } catch (error) {
            console.warn('Could not read the photo', error);
        }
    }
    if (!bitmap) {
        showAppMessage('msg_photo_err', true);
        return;
    }
    const ratio = Math.min(1, ESTIMATE_MAX_SIDE / Math.max(bitmap.width, bitmap.height));
    const photo = document.createElement('canvas');
    photo.width = Math.max(1, Math.round(bitmap.width * ratio));
    photo.height = Math.max(1, Math.round(bitmap.height * ratio));
    const ctx = photo.getContext('2d', { willReadFrequently: true });
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(bitmap, 0, 0, photo.width, photo.height);
    bitmap.close();

    estimateState = { photo, region: null, proposals: [], selected: 0, result: null, rounds: [], opener: document.activeElement };
    if (domElements.estimateThreads) {
        domElements.estimateThreads.value = parseInt(domElements.sett?.value, 10) || 240;
    }
    const invent = mode === 'invent' && domElements.estimateModeInvent;
    if (invent) domElements.estimateModeInvent.checked = true;
    else if (domElements.estimateModeRead) domElements.estimateModeRead.checked = true;
    domElements.estimateModal.hidden = false;
    domElements.btnEstimateCancel?.focus();
    drawEstimateSource();
    runEstimate();
}

function closeEstimate() {
    if (!isEstimateOpen()) return;
    domElements.estimateModal.hidden = true;
    focusOpener(estimateState?.opener);
    estimateState = null;
}

// The photo, with what is outside the selected area dimmed
function drawEstimateSource(selection = estimateState?.region) {
    const canvas = domElements.estimateSource;
    if (!canvas || !estimateState) return;
    const { photo } = estimateState;
    const scale = Math.min(1, 360 / photo.width, 280 / photo.height);
    canvas.width = Math.max(1, Math.round(photo.width * scale));
    canvas.height = Math.max(1, Math.round(photo.height * scale));
    const ctx = canvas.getContext('2d');
    ctx.drawImage(photo, 0, 0, canvas.width, canvas.height);
    if (!selection) return;
    const r = { x: selection.x * scale, y: selection.y * scale, w: selection.w * scale, h: selection.h * scale };
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(0, 0, canvas.width, r.y);
    ctx.fillRect(0, r.y + r.h, canvas.width, canvas.height - r.y - r.h);
    ctx.fillRect(0, r.y, r.x, r.h);
    ctx.fillRect(r.x + r.w, r.y, canvas.width - r.x - r.w, r.h);
    ctx.strokeStyle = '#f5d08a';
    ctx.lineWidth = 2;
    ctx.strokeRect(r.x, r.y, r.w, r.h);
}

function readEstimateThreads() {
    const value = parseInt(domElements.estimateThreads?.value, 10) || 240;
    return Math.max(20, Math.min(2000, value));
}

function runEstimate() {
    if (!estimateState) return;
    const t = TRANSLATIONS[currentLang];
    const { photo, region } = estimateState;
    const area = region || { x: 0, y: 0, w: photo.width, h: photo.height };
    const image = photo.getContext('2d', { willReadFrequently: true }).getImageData(area.x, area.y, area.w, area.h);
    estimateState.rounds = [];
    showProposals(isInventMode()
        ? inventProposals(image, { targetThreads: readEstimateThreads() })
        : estimateProposals(image, { tolerance: readEstimateTolerance(), targetThreads: readEstimateThreads() }));
}

function readEstimateTolerance() {
    return parseInt(domElements.estimateTolerance?.value, 10) || 12;
}

function showProposals(proposals, selected = 0) {
    estimateState.proposals = proposals;
    selectProposal(selected);
}

function goldProposal() {
    return estimateState?.proposals.find(p => p.star === 'gold') || null;
}

function selectProposal(index) {
    const t = TRANSLATIONS[currentLang];
    const result = estimateState.proposals[index] || null;
    estimateState.selected = index;
    estimateState.result = result;

    const canvas = domElements.estimateResult;
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    if (result) renderPatternCanvas(canvas, { stripes: result.stripes, symmetric: result.symmetric }, 'fit');
    domElements.estimateCode.value = result ? buildSRTCode(result.stripes, result.symmetric) : '';
    const invent = isInventMode();
    if (domElements.estimateHint) domElements.estimateHint.textContent = invent ? t.invent_hint : t.estimate_hint;
    if (domElements.estimateToleranceRow) domElements.estimateToleranceRow.hidden = invent;
    if (!result) domElements.estimateStatus.textContent = invent ? t.invent_none : t.estimate_none;
    else if (estimateState.rounds.length > 0) domElements.estimateStatus.textContent = t.estimate_refined.replace('%', estimateState.rounds.length + 1);
    else domElements.estimateStatus.textContent = invent ? t.invent_status : t['estimate_' + result.confidence];
    renderProposalGrid();
}

function renderProposalGrid() {
    const grid = domElements.estimateProposals;
    if (!grid) return;
    const t = TRANSLATIONS[currentLang];
    const { proposals, selected, rounds } = estimateState;
    const density = window.devicePixelRatio || 1;
    const fragment = document.createDocumentFragment();
    proposals.forEach((proposal, index) => {
        const label = t['proposal_' + proposal.caption[0]].replace('%', proposal.caption[1] ?? '');
        const srt = buildSRTCode(proposal.stripes, proposal.symmetric);
        const cell = sheetElement('div', undefined, 'proposal-cell' + (proposal.star ? ' ' + proposal.star : '') + (index === selected ? ' selected' : ''));

        const tile = sheetElement('button', undefined, 'proposal-tile');
        tile.type = 'button';
        tile.title = `${label}\n${srt}`;
        tile.setAttribute('aria-label', `${label} : ${srt}`);
        tile.setAttribute('aria-pressed', String(index === selected));
        tile.addEventListener('click', () => selectProposal(index));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(120 * density);
        canvas.height = canvas.width;
        renderPatternCanvas(canvas, proposal, 'fit');
        tile.append(canvas, sheetElement('span', label, 'proposal-caption'));

        const stars = sheetElement('div', undefined, 'proposal-stars');
        for (const star of ['gold', 'silver']) {
            const button = sheetElement('button', '★', 'proposal-star star-' + star);
            button.type = 'button';
            button.title = t['star_' + star];
            button.setAttribute('aria-label', `${t['star_' + star]} : ${label}`);
            button.setAttribute('aria-pressed', String(proposal.star === star));
            button.addEventListener('click', () => setProposalStar(index, star));
            stars.appendChild(button);
        }
        cell.append(tile, stars);
        fragment.appendChild(cell);
    });
    grid.textContent = '';
    grid.appendChild(fragment);

    const gold = goldProposal();
    domElements.btnEstimateApply.disabled = !gold && !estimateState.result;
    domElements.btnEstimateApply.textContent = gold ? t.btn_estimate_apply_gold : t.btn_estimate_apply;
    domElements.btnEstimateRefine.disabled = !proposals.some(p => p.star === 'silver');
    domElements.btnEstimateBack.hidden = rounds.length === 0;
}

// Gold confirms one proposal, so there is only one. A proposal has one star at most.
function setProposalStar(index, star) {
    const { proposals } = estimateState;
    const proposal = proposals[index];
    if (!proposal) return;
    const next = proposal.star === star ? null : star;
    if (next === 'gold') proposals.forEach(p => { if (p.star === 'gold') p.star = null; });
    proposal.star = next;
    selectProposal(index);
    domElements.estimateProposals.querySelectorAll('.star-' + star)[index]?.focus();
}

function refineProposals() {
    const silvers = estimateState?.proposals.filter(p => p.star === 'silver') || [];
    if (silvers.length === 0) return;
    estimateState.rounds.push({ proposals: estimateState.proposals, selected: estimateState.selected });
    showProposals(blendProposals(silvers, { tolerance: readEstimateTolerance(), targetThreads: readEstimateThreads() }));
    domElements.estimateProposals.querySelector('.proposal-tile')?.focus();
}

function previousProposals() {
    const round = estimateState?.rounds.pop();
    if (round) showProposals(round.proposals, round.selected);
}

// The total of threads changes the counts, not the choices already made
function rescaleProposals() {
    if (!estimateState) return;
    const target = readEstimateThreads();
    const rescale = p => { p.stripes = rescaleStripes(p.stripes, p.symmetric, target); };
    estimateState.proposals.forEach(rescale);
    estimateState.rounds.forEach(round => round.proposals.forEach(rescale));
    selectProposal(estimateState.selected);
}

function applyEstimate() {
    const gold = goldProposal();
    const result = gold || estimateState?.result;
    if (!result) return;
    const invented = isInventMode();
    closeEstimate();
    applyLoadedPattern({ stripes: result.stripes, symmetric: result.symmetric });
    showAppMessage(invented ? 'msg_invent_done' : gold ? 'msg_estimate_gold' : 'msg_estimate_done');
}

// Drag on the photo to keep only the cloth. Too small a drag goes back to the whole photo.
function bindEstimateSelection() {
    const canvas = domElements.estimateSource;
    if (!canvas) return;
    let start = null, current = null;
    const toPhoto = (e) => {
        const box = canvas.getBoundingClientRect();
        const { photo } = estimateState;
        const clamp = (v, max) => Math.max(0, Math.min(max, v));
        return {
            x: clamp((e.clientX - box.left) / box.width, 1) * photo.width,
            y: clamp((e.clientY - box.top) / box.height, 1) * photo.height
        };
    };
    const rectangle = (a, b) => ({
        x: Math.round(Math.min(a.x, b.x)),
        y: Math.round(Math.min(a.y, b.y)),
        w: Math.round(Math.abs(a.x - b.x)),
        h: Math.round(Math.abs(a.y - b.y))
    });
    canvas.addEventListener('pointerdown', (e) => {
        if (!estimateState || e.button !== 0) return;
        start = toPhoto(e);
        current = null;
        canvas.setPointerCapture(e.pointerId);
    });
    canvas.addEventListener('pointermove', (e) => {
        if (!start) return;
        current = rectangle(start, toPhoto(e));
        drawEstimateSource(current);
    });
    const finish = () => {
        if (!start) return;
        start = null;
        estimateState.region = current && current.w >= 40 && current.h >= 40 ? current : null;
        current = null;
        drawEstimateSource();
        runEstimate();
    };
    canvas.addEventListener('pointerup', finish);
    canvas.addEventListener('pointercancel', finish);
}

// --- COLOR READABILITY ---
function linearRgbToLab(r, g, b) {
    // D65 white point
    const f = t => t > 216 / 24389 ? Math.cbrt(t) : (24389 / 27 * t + 16) / 116;
    const fx = f((0.4124 * r + 0.3576 * g + 0.1805 * b) / 0.95047);
    const fy = f(0.2126 * r + 0.7152 * g + 0.0722 * b);
    const fz = f((0.0193 * r + 0.1192 * g + 0.9505 * b) / 1.08883);
    return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
}

function hexToLab(hex, matrix = null) {
    const v = parseInt(hex.slice(1), 16);
    let r = srgbToLinear(v >>> 16), g = srgbToLinear((v >>> 8) & 0xFF), b = srgbToLinear(v & 0xFF);
    if (matrix) {
        const clamp = c => Math.max(0, Math.min(1, c));
        [r, g, b] = [
            clamp(matrix[0] * r + matrix[1] * g + matrix[2] * b),
            clamp(matrix[3] * r + matrix[4] * g + matrix[5] * b),
            clamp(matrix[6] * r + matrix[7] * g + matrix[8] * b)
        ];
    }
    return linearRgbToLab(r, g, b);
}

function colorDifference(hexA, hexB, matrix = null) {
    const a = hexToLab(hexA, matrix), b = hexToLab(hexB, matrix);
    return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
}

// Pairs of colors that touch in the sett and are hard to tell apart, once each.
function findCloseNeighbors(stripes, isSymmetric, matrix = null) {
    const pairs = new Map();
    const compare = (a, b) => {
        const key = [a.hex, b.hex].sort().join();
        if (pairs.has(key)) return;
        const delta = colorDifference(a.hex, b.hex, matrix);
        if (delta < COLOR_CLOSE_DELTA) pairs.set(key, { a, b, delta });
    };
    for (let i = 0; i + 1 < stripes.length; i++) compare(stripes[i], stripes[i + 1]);
    if (!isSymmetric && stripes.length > 2) compare(stripes[stripes.length - 1], stripes[0]);
    return [...pairs.values()];
}

let readabilityKey = '';

function readabilityRow(pair, note) {
    const row = sheetElement('div', undefined, 'read-row');
    for (const color of [pair.a, pair.b]) {
        const chip = sheetElement('span', undefined, 'sheet-chip');
        chip.style.background = color.hex;
        row.append(chip, document.createTextNode(color.code + ' '));
    }
    if (note) row.appendChild(sheetElement('span', note, 'read-note'));
    return row;
}

function updateReadabilityUI() {
    const list = domElements.readabilityList;
    if (!list || tartanStripes.length === 0) return;
    const isSymmetric = domElements.sym?.checked || false;
    const key = [tartanStripes.map(s => s.hex).join(), isSymmetric, currentLang].join('|');
    if (key === readabilityKey) return;
    readabilityKey = key;

    const t = TRANSLATIONS[currentLang];
    const close = findCloseNeighbors(tartanStripes, isSymmetric);
    const known = new Set(close.map(p => [p.a.hex, p.b.hex].sort().join()));
    const deficient = [];
    for (const type of Object.keys(VISION_MATRICES)) {
        for (const pair of findCloseNeighbors(tartanStripes, isSymmetric, VISION_MATRICES[type])) {
            const id = [pair.a.hex, pair.b.hex].sort().join();
            if (known.has(id)) continue;
            known.add(id);
            deficient.push({ pair, type });
        }
    }

    list.textContent = '';
    if (close.length === 0 && deficient.length === 0) list.appendChild(sheetElement('p', t.read_ok, 'read-ok'));
    if (close.length > 0) {
        list.appendChild(sheetElement('p', t.read_close));
        close.forEach(p => list.appendChild(readabilityRow(p)));
    }
    if (deficient.length > 0) {
        list.appendChild(sheetElement('p', t.read_deficient));
        deficient.forEach(d => list.appendChild(readabilityRow(d.pair, t['vision_' + d.type])));
    }
    if (domElements.readabilityBadge) domElements.readabilityBadge.textContent = close.length > 0 ? '⚠' : '';
    // Seen from the other tabs too
    const tabBadge = document.getElementById('tab-colors-badge');
    if (tabBadge) tabBadge.textContent = close.length > 0 ? '⚠' : '';
    const colorsTab = document.getElementById('tab-colors');
    if (colorsTab) colorsTab.title = close.length > 0 ? t.read_close : '';
}

// The filters act on what is displayed, so the exports keep the true colors.
function installVisionFilters() {
    const NS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('width', '0');
    svg.setAttribute('height', '0');
    svg.setAttribute('aria-hidden', 'true');
    svg.style.position = 'absolute';
    for (const [type, m] of Object.entries(VISION_MATRICES)) {
        const filter = document.createElementNS(NS, 'filter');
        filter.id = 'vision-' + type;
        filter.setAttribute('color-interpolation-filters', 'linearRGB');
        const matrix = document.createElementNS(NS, 'feColorMatrix');
        matrix.setAttribute('type', 'matrix');
        matrix.setAttribute('values', `${m.slice(0, 3).join(' ')} 0 0 ${m.slice(3, 6).join(' ')} 0 0 ${m.slice(6, 9).join(' ')} 0 0 0 0 0 1 0`);
        filter.appendChild(matrix);
        svg.appendChild(filter);
    }
    document.body.appendChild(svg);
}

// --- PREVIEW ON OBJECTS ---
// Objects drawn at the same scale, from the real thread size. Threads are much finer than
// a screen pixel here, so each pixel gets the average of the threads it covers, in linear
// light as the eye blends them. A 2/2 twill shows as much warp as weft.
function srgbToLinear(byte) {
    const c = byte / 255;
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function linearToSrgb(value) {
    const c = value <= 0.0031308 ? value * 12.92 : 1.055 * Math.pow(value, 1 / 2.4) - 0.055;
    return Math.round(Math.max(0, Math.min(1, c)) * 255);
}

// Linear RGB of each pixel along a run of `pixels` pixels, wrapping around the sequence.
function averageSettColors(sequence, threadsPerPixel, pixels) {
    const n = sequence.length;
    const ends = new Float64Array(n);
    const colors = new Float64Array(n * 3);
    const sums = new Float64Array((n + 1) * 3);
    let total = 0;
    sequence.forEach((s, i) => {
        const v = parseInt(s.hex.slice(1), 16);
        colors[i * 3] = srgbToLinear(v >>> 16);
        colors[i * 3 + 1] = srgbToLinear((v >>> 8) & 0xFF);
        colors[i * 3 + 2] = srgbToLinear(v & 0xFF);
        total += s.count;
        ends[i] = total;
        for (let c = 0; c < 3; c++) sums[(i + 1) * 3 + c] = sums[i * 3 + c] + colors[i * 3 + c] * s.count;
    });

    // Sum of the colors from thread 0 to a position, one channel at a time
    const integral = (position, out) => {
        const repeats = Math.floor(position / total);
        const rest = position - repeats * total;
        let lo = 0, hi = n - 1;
        while (lo < hi) {
            const mid = (lo + hi) >> 1;
            if (ends[mid] > rest) hi = mid; else lo = mid + 1;
        }
        const start = lo > 0 ? ends[lo - 1] : 0;
        for (let c = 0; c < 3; c++) out[c] = repeats * sums[n * 3 + c] + sums[lo * 3 + c] + (rest - start) * colors[lo * 3 + c];
    };

    const result = new Float64Array(pixels * 3);
    let before = [0, 0, 0], after = [0, 0, 0];
    integral(0, before);
    for (let p = 0; p < pixels; p++) {
        integral((p + 1) * threadsPerPixel, after);
        for (let c = 0; c < 3; c++) result[p * 3 + c] = (after[c] - before[c]) / threadsPerPixel;
        [before, after] = [after, before];
    }
    return result;
}

function isPreviewOpen() {
    return !!domElements.previewBoard && !domElements.previewBoard.hidden;
}

// A rectangle of cloth at the given scale, ready to be clipped to a shape.
function makeClothCanvas(sequence, threadsPerPixel, w, h) {
    const cloth = document.createElement('canvas');
    cloth.width = w;
    cloth.height = h;
    const ctx = cloth.getContext('2d');
    const image = ctx.createImageData(w, h);
    const warp = averageSettColors(sequence, threadsPerPixel, w);
    const weft = averageSettColors(sequence, threadsPerPixel, h);
    let offset = 0;
    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            for (let c = 0; c < 3; c++) image.data[offset++] = linearToSrgb((warp[x * 3 + c] + weft[y * 3 + c]) / 2);
            image.data[offset++] = 255;
        }
    }
    ctx.putImageData(image, 0, 0);
    return { cloth, warp };
}

function drawScarf(ctx, make, x, y, w, h, fringe) {
    const { cloth, warp } = make(w, h);
    ctx.drawImage(cloth, x, y);
    // Fringes: the warp threads running out of the cloth
    const step = Math.max(2, Math.round(w / 40));
    ctx.lineWidth = Math.max(1, step / 2);
    for (let px = Math.floor(step / 2); px < w; px += step) {
        ctx.strokeStyle = `rgb(${linearToSrgb(warp[px * 3])},${linearToSrgb(warp[px * 3 + 1])},${linearToSrgb(warp[px * 3 + 2])})`;
        ctx.beginPath();
        ctx.moveTo(x + px, y - fringe);
        ctx.lineTo(x + px, y);
        ctx.moveTo(x + px, y + h);
        ctx.lineTo(x + px, y + h + fringe);
        ctx.stroke();
    }
}

function drawCushion(ctx, make, x, y, size) {
    const pinch = size * 0.05;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + size / 2, y + pinch, x + size, y);
    ctx.quadraticCurveTo(x + size - pinch, y + size / 2, x + size, y + size);
    ctx.quadraticCurveTo(x + size / 2, y + size - pinch, x, y + size);
    ctx.quadraticCurveTo(x + pinch, y + size / 2, x, y);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(make(size, size).cloth, x, y);
    const shade = ctx.createRadialGradient(x + size * 0.45, y + size * 0.4, size * 0.1, x + size / 2, y + size / 2, size * 0.75);
    shade.addColorStop(0, 'rgba(255,255,255,0.12)');
    shade.addColorStop(1, 'rgba(0,0,0,0.42)');
    ctx.fillStyle = shade;
    ctx.fillRect(x, y, size, size);
    ctx.restore();
}

function drawKilt(ctx, make, x, y, w, h) {
    const waist = h * 0.07;
    const inset = w * 0.08;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x + inset, y);
    ctx.lineTo(x + w - inset, y);
    ctx.lineTo(x + w, y + h);
    ctx.lineTo(x, y + h);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(make(w, h).cloth, x, y);
    // Flat apron on the left, pleats on the right
    const pleats = 9;
    const start = x + w * 0.42;
    const pleat = (x + w - start) / pleats;
    for (let i = 0; i < pleats; i++) {
        const shade = ctx.createLinearGradient(start + i * pleat, 0, start + (i + 1) * pleat, 0);
        shade.addColorStop(0, 'rgba(255,255,255,0.14)');
        shade.addColorStop(1, 'rgba(0,0,0,0.42)');
        ctx.fillStyle = shade;
        ctx.fillRect(start + i * pleat, y + waist, pleat, h - waist);
    }
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(x, y, w, waist);
    ctx.restore();
}

function renderObjectPreview() {
    const canvas = domElements.previewCanvas;
    if (!canvas || !isPreviewOpen() || tartanStripes.length === 0) return;
    const t = TRANSLATIONS[currentLang];
    const stage = canvas.parentElement;
    const density = window.devicePixelRatio || 1;
    previewStageSize = stage.clientWidth + 'x' + stage.clientHeight;
    canvas.style.width = stage.clientWidth + 'px';
    canvas.style.height = stage.clientHeight + 'px';
    canvas.width = Math.max(1, Math.round(stage.clientWidth * density));
    canvas.height = Math.max(1, Math.round(stage.clientHeight * density));

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const threadMm = parseFloat(domElements.threadMm?.value) || 1.11;
    const isSymmetric = domElements.sym?.checked || false;
    const { sequence, widthCm } = buildWeavingSheetData(tartanStripes, isSymmetric, threadMm);

    // One object, as large as the stage allows, with a 10 cm bar and the size of a repeat under it
    const view = OBJECT_VIEWS[objectView] ? objectView : 'scarf';
    const o = OBJECT_VIEWS[view];
    const labelPx = 22 * density;
    const margin = 16 * density;
    const scale = Math.min((canvas.width - margin * 2) / o.w, (canvas.height - labelPx * 3 - margin) / (o.h + o.fringe * 2));
    const threadsPerPixel = 10 / threadMm / scale;
    const make = (w, h) => makeClothCanvas(sequence, threadsPerPixel, w, h);
    const px = cm => Math.max(1, Math.round(cm * scale));

    const x = Math.round((canvas.width - px(o.w)) / 2);
    const top = Math.round(labelPx + px(o.fringe));
    if (view === 'scarf') drawScarf(ctx, make, x, top, px(o.w), px(o.h), px(o.fringe));
    else if (view === 'cushion') drawCushion(ctx, make, x, top, px(o.w));
    else drawKilt(ctx, make, x, top, px(o.w), px(o.h));

    ctx.font = `${Math.round(12 * density)}px sans-serif`;
    ctx.textBaseline = 'bottom';
    ctx.fillStyle = '#ccc';
    const barY = top + px(o.h) + px(o.fringe) + Math.round(labelPx * 1.2);
    ctx.fillRect(x, barY, px(10), Math.max(2, Math.round(2 * density)));
    ctx.fillText('10 cm', x, barY - 3);
    ctx.fillText(t.preview_repeat.replace('%', formatNumber(widthCm)), x, barY + labelPx);
    canvas.setAttribute('aria-label', `${t['preview_' + view]} : ${t.preview_title}`);
}

// The canvas shows the cloth, or one object made of it: a view, not a window, so the settings stay usable
function setObjectView(view) {
    if (view === 'cloth' || !OBJECT_VIEWS[view]) {
        closeObjectPreview();
        return;
    }
    objectView = view;
    openObjectPreview();
}

function openObjectPreview() {
    if (!domElements.previewBoard || tartanStripes.length === 0) return;
    if (isPatchworkOpen()) closePatchworkBoard();
    domElements.previewBoard.hidden = false;
    syncViewSwitch();
    renderObjectPreview();
}

function closeObjectPreview() {
    if (!isPreviewOpen()) return;
    const hadFocus = domElements.previewBoard.contains(document.activeElement) || !!document.activeElement?.closest('.view-switch');
    domElements.previewBoard.hidden = true;
    syncViewSwitch();
    if (hadFocus) document.querySelector('.view-btn[data-view="cloth"]')?.focus();
}

function syncViewSwitch() {
    const current = isPreviewOpen() ? objectView : 'cloth';
    document.querySelectorAll('.view-btn').forEach(btn => btn.setAttribute('aria-pressed', String(btn.dataset.view === current)));
}

function watchPreviewStage() {
    const stage = domElements.previewCanvas?.parentElement;
    if (!stage || typeof ResizeObserver === 'undefined') return;
    new ResizeObserver(() => {
        clearTimeout(previewLayoutTimer);
        previewLayoutTimer = setTimeout(() => {
            if (isPreviewOpen() && stage.clientWidth + 'x' + stage.clientHeight !== previewStageSize) renderObjectPreview();
        }, 50);
    }).observe(stage);
}

// --- WEAVING SHEET ---
// Everything needed to warp a loom: the order of the threads and the yarn per color.
// Warp and weft follow the same sequence, so a color has the same share of both.
function buildWeavingSheetData(stripes, isSymmetric, threadMm) {
    const sequence = stripes.map(s => ({ ...s }));
    if (isSymmetric) {
        for (let i = stripes.length - 2; i >= 1; i--) sequence.push({ ...stripes[i] });
    }
    const totalThreads = sequence.reduce((sum, s) => sum + s.count, 0);
    const yarnPerSquareMeter = 2 * 1000 / threadMm; // Threads per meter of width, warp + weft, 1 m each

    const byColor = new Map();
    for (const s of sequence) {
        const color = byColor.get(s.hex) || { code: s.code, hex: s.hex, threads: 0 };
        color.threads += s.count;
        byColor.set(s.hex, color);
    }
    const colors = [...byColor.values()].map(c => ({
        ...c,
        percent: c.threads / totalThreads * 100,
        meters: c.threads / totalThreads * yarnPerSquareMeter
    }));
    return { sequence, colors, totalThreads, widthCm: totalThreads * threadMm / 10, yarnPerSquareMeter };
}

let weavingSheetOpener = null;

function isWeavingSheetOpen() {
    return !!domElements.sheetModal && !domElements.sheetModal.hidden;
}

function sheetElement(tag, text, className) {
    const el = document.createElement(tag);
    if (text !== undefined) el.textContent = text;
    if (className) el.className = className;
    return el;
}

function openWeavingSheet() {
    if (tartanStripes.length === 0 || !domElements.sheetBody) return;
    const t = TRANSLATIONS[currentLang];
    const isSymmetric = domElements.sym?.checked || false;
    const threadMm = parseFloat(domElements.threadMm?.value) || 1.11;
    const data = buildWeavingSheetData(tartanStripes, isSymmetric, threadMm);
    const palette = paletteFromStripes(tartanStripes);
    const body = domElements.sheetBody;
    body.textContent = '';

    body.appendChild(sheetElement('h2', t.sheet_title));
    body.appendChild(sheetElement('p', `ID ${String(generationID).padStart(6, '0')} · ${getFormattedDate().replace(/_/g, '-')}`, 'sheet-meta'));

    const head = sheetElement('div', undefined, 'sheet-head');
    const swatch = document.createElement('canvas');
    swatch.width = 360;
    swatch.height = 360;
    swatch.className = 'sheet-swatch';
    renderPatternCanvas(swatch, { stripes: tartanStripes, symmetric: isSymmetric }, 'fit');
    const facts = sheetElement('dl', undefined, 'sheet-facts');
    const twill = (domElements.weaveZ?.checked ?? true) ? 'Z' : 'S';
    [
        [t.sheet_srt, buildSRTCode(tartanStripes, isSymmetric)],
        [t.sheet_threads, String(data.totalThreads)],
        [t.sheet_width, `${formatNumber(data.widthCm)} cm`],
        [t.sheet_thread, t.sheet_density.replace('%d', formatNumber(densityFromThreadMm(threadMm))).replace('%m', formatNumber(threadMm, 2))],
        [t.sheet_weave, `${t.sheet_twill} ${twill}`],
        [t.sheet_structure, isSymmetric ? t.crit_sym : t.crit_asym]
    ].forEach(([term, value]) => facts.append(sheetElement('dt', term), sheetElement('dd', value)));
    head.append(swatch, facts);
    body.appendChild(head);

    // Stripes drawn to scale, in weaving order
    const band = sheetElement('div', undefined, 'sheet-band');
    data.sequence.forEach(s => {
        const part = document.createElement('span');
        part.style.background = s.hex;
        part.style.flexGrow = s.count;
        part.title = `${s.code} ${s.count}`;
        band.appendChild(part);
    });
    body.appendChild(band);

    body.appendChild(sheetElement('h3', t.sheet_order));
    body.appendChild(sheetElement('p', data.sequence.map(s => `${s.code} ${s.count}`).join(' · '), 'sheet-order'));

    body.appendChild(sheetElement('h3', t.sheet_colors));
    const table = sheetElement('table', undefined, 'sheet-table');
    const headRow = table.createTHead().insertRow();
    [t.sheet_color, t.sheet_col_threads, '%', t.sheet_col_yarn].forEach(label => headRow.appendChild(sheetElement('th', label)));
    const rows = table.createTBody();
    data.colors.forEach(c => {
        const row = rows.insertRow();
        const name = row.insertCell();
        const chip = sheetElement('span', undefined, 'sheet-chip');
        chip.style.background = c.hex;
        const color = palette.find(p => p.hex.toUpperCase() === c.hex.toUpperCase());
        name.append(chip, document.createTextNode(formatColorLabel(color)));
        row.insertCell().textContent = String(c.threads);
        row.insertCell().textContent = formatNumber(c.percent);
        row.insertCell().textContent = Math.round(c.meters).toLocaleString(currentLang);
    });
    body.appendChild(table);
    body.appendChild(sheetElement('p', t.sheet_note, 'sheet-note'));

    weavingSheetOpener = document.activeElement;
    domElements.sheetModal.hidden = false;
    domElements.btnSheetPrint?.focus();
}

function closeWeavingSheet() {
    if (!isWeavingSheetOpen()) return;
    domElements.sheetModal.hidden = true;
    focusOpener(weavingSheetOpener);
    weavingSheetOpener = null;
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
    let srtExamples = domElements.srtExamples;
    if (!srtExamples) return;

    // We match by checking if the dropdown value string is included in the SRT output
    let currentCode = currentSrtCode().toUpperCase();
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

// --- SRT BAR ---
// The code of the pattern on screen
function currentSrtCode() {
    return buildSRTCode(tartanStripes, domElements.sym?.checked || false);
}

// Shows the current code in the bar, unless someone is typing there (force puts it back anyway)
function showSrtInBar(force = false) {
    const field = domElements.importText;
    if (!field || (!force && document.activeElement === field && field.classList.contains('edited'))) return;
    field.value = currentSrtCode();
    field.classList.remove('edited');
    field.removeAttribute('aria-invalid');
}

// Applies the code typed in the bar. Leaving the field only applies a code that reads well, without a message.
function applySrtBar(fromLeaving) {
    const field = domElements.importText;
    if (!field) return;
    const text = field.value.trim().toUpperCase();
    if (!text) { showSrtInBar(true); return; }
    if (text === currentSrtCode()) { field.classList.remove('edited'); return; }
    if (fromLeaving && !looksLikeSrt(text)) { field.setAttribute('aria-invalid', 'true'); return; }
    importSRT();
}

function looksLikeSrt(text) {
    if (!/^[A-Z0-9\s.\/]+$/.test(text)) return false;
    const codes = new Set();
    for (const m of text.matchAll(/([A-Z]+)\/?(\d+)/g)) if (SRT_PALETTE.some(c => c.code === m[1])) codes.add(m[1]);
    return codes.size >= 2;
}

// --- LOAD SRT EXAMPLE ---
let importInputElement = null;
window.loadExample = function(val) {
    if(!val) return;
    if (!importInputElement) importInputElement = domElements.importText;
    if(importInputElement) {
        importInputElement.value = val;
        importSRT(false);
    }
}

// --- IMPORT SRT (OFFICIAL LOGIC) ---
window.importSRT = function(keepShades = true) {
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
    // Editing the code keeps the shade each color already has (an SRT code names a color, not a shade)
    const keptShades = new Map();
    if (keepShades === true) {
        for (const s of tartanStripes) {
            if (keptShades.has(s.code)) continue;
            const shade = SRT_PALETTE.find(c => c.code === s.code && c.hex.toUpperCase() === String(s.hex).toUpperCase());
            if (shade) keptShades.set(s.code, shade);
        }
    }

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
        } else if (keptShades.has(code)) {
            colorObj = keptShades.get(code);
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
    if (domElements.importText) domElements.importText.classList.remove('edited');

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
    if (isPatchworkCriteria()) {
        const { xAxis, yAxis } = readPatchworkAxes();
        cols = criteriaValues(xAxis, 6).length;
        rows = yAxis === 'none' || yAxis === xAxis ? 1 : criteriaValues(yAxis, 6).length;
    }

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
let patchworkLayout = null; // Criteria board: { cols, key }; null when the tiles flow freely

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
        batch.push(makePatchworkEntry(stripes, palette, symmetric));
    }
    return batch;
}

// Repeatable random numbers: every tile of a criteria board starts from the same draws,
// so two neighbors differ by the criterion and not by chance.
function seededRandom(seed) {
    let a = seed >>> 0;
    return () => {
        a = (a + 0x6D2B79F5) >>> 0;
        let t = a;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

function criteriaValues(axis, paletteSize) {
    if (axis !== 'colors') return PATCHWORK_AXES[axis];
    const values = PATCHWORK_AXES.colors.filter(v => v <= paletteSize);
    return values.length > 0 ? values : [paletteSize];
}

function applyCriterion(tile, axis, value) {
    if (axis === 'colors') tile.colorCount = value;
    else if (axis === 'stripes') tile.params.targetStripes = value;
    else if (axis === 'symmetric') tile.symmetric = value;
    else if (axis === 'sett') tile.params.targetSett = value;
    else if (axis === 'maxWidth') {
        tile.params.maxW = value;
        if (tile.params.minW > value) tile.params.minW = value;
    }
}

// Stripes usually stop short of the sett: resize them so the sett criterion is visible.
function fitStripesToSett(stripes, targetSett) {
    const factor = targetSett / sumStripeThreads(stripes);
    return stripes.map(s => ({ ...s, count: Math.max(2, Math.round(s.count * factor / 2) * 2) }));
}

// One tile per combination, row by row. yAxis 'none' gives a single row.
function createCriteriaBatch({ xAxis, yAxis, palette, defaultColors, params, symmetric, seed }) {
    const useY = yAxis !== 'none' && yAxis !== xAxis;
    const xValues = criteriaValues(xAxis, palette.length);
    const yValues = useY ? criteriaValues(yAxis, palette.length) : [null];
    const usesSett = xAxis === 'sett' || (useY && yAxis === 'sett');
    const batch = [];
    for (const y of yValues) {
        for (const x of xValues) {
            const tile = { params: { ...params }, colorCount: defaultColors, symmetric };
            applyCriterion(tile, xAxis, x);
            if (useY) applyCriterion(tile, yAxis, y);
            tile.params.minW = Math.min(tile.params.minW, tile.params.maxW, tile.params.targetSett);
            const colors = palette.slice(0, tile.colorCount);
            let stripes = createStripes(tile.params, colors, seededRandom(seed));
            if (usesSett) stripes = fitStripesToSett(stripes, tile.params.targetSett);
            const entry = makePatchworkEntry(stripes, colors, tile.symmetric);
            entry.criteria = useY ? [[xAxis, x], [yAxis, y]] : [[xAxis, x]];
            batch.push(entry);
        }
    }
    return { batch, cols: xValues.length };
}

function isPatchworkCriteria() {
    return domElements.patchworkMode?.value === 'criteria';
}

function readPatchworkAxes() {
    const xAxis = domElements.patchworkAxisX?.value || 'colors';
    const yAxis = domElements.patchworkAxisY?.value || 'none';
    return { xAxis, yAxis };
}

// Returns null and shows why when there are not enough colors.
function createPatchworkCriteriaBatch() {
    const keepColors = domElements.lockColors?.checked || false;
    if (keepColors && userPalette.length <= 1) {
        showAppMessage('msg_palette_min', true);
        return null;
    }
    // The axes replace the settings they vary, so the "sett too low" check does not apply
    const params = readGenerationParams();
    showAppMessage(params.noticeKey || null);
    const { xAxis, yAxis } = readPatchworkAxes();
    return createCriteriaBatch({
        xAxis,
        yAxis,
        palette: keepColors ? [...userPalette] : pickDistinctColors(6),
        defaultColors: keepColors ? userPalette.length : 4,
        params,
        symmetric: domElements.sym?.checked || false,
        seed: Math.floor(Math.random() * 4294967296)
    });
}

function updatePatchworkModeUI() {
    const criteria = isPatchworkCriteria();
    document.querySelectorAll('.patchwork-criteria-row').forEach(row => { row.hidden = !criteria; });
    if (domElements.patchworkQtyRow) domElements.patchworkQtyRow.hidden = criteria;
    updatePatchworkInfo();
}

function criterionLabel([axis, value], t) {
    if (axis === 'symmetric') return value ? t.crit_sym : t.crit_asym;
    return t['crit_' + axis].replace('%', value);
}

function makePatchworkEntry(stripes, palette, symmetric) {
    // Keep only the colors the pattern uses, in palette order
    const used = palette.filter(c => stripes.some(s => s.hex === c.hex));
    return { stripes, palette: used, symmetric, pinned: false, generationID: Math.floor(Math.random() * 1000000) };
}

// A pattern close to the source. Three kinds, used in turn:
// 0: same colors, widths changed by up to 40% (kept even); 1: same widths and palette,
// colors in another order; 2: same widths, a new random palette of the same size.
function createPatchworkVariant(source, kind) {
    let stripes, palette = source.palette;
    if (kind === 0) {
        stripes = source.stripes.map(s => {
            const factor = 0.6 + Math.random() * 0.8;
            return { ...s, count: Math.max(2, Math.round(s.count * factor / 2) * 2) };
        });
    } else if (kind === 1 && palette.length > 1) {
        stripes = recolorStripes(source.stripes, palette);
    } else {
        palette = pickRandomPalette();
        while (palette.length < Math.min(source.palette.length, 5)) {
            const extra = pickRandomPalette().find(c => !palette.some(p => p.code === c.code));
            if (!extra) break;
            palette.push(extra);
        }
        if (palette.length < 2) palette = source.palette;
        stripes = recolorStripes(source.stripes, palette);
    }
    return makePatchworkEntry(stripes, palette, source.symmetric);
}

// Pinned tiles stay in place, even beyond the quantity; new tiles fill the other places
// until the board holds the quantity.
function mergePinnedTiles(previous, fresh, qty) {
    const merged = [];
    let next = 0;
    let free = Math.max(0, qty - previous.filter(e => e.pinned).length);
    for (let i = 0; i < Math.max(previous.length, qty); i++) {
        if (previous[i]?.pinned) merged.push(previous[i]);
        else if (free > 0 && next < fresh.length) {
            merged.push(fresh[next++]);
            free--;
        }
    }
    return merged;
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

    const relief = getEffectType() === 'relief' && drawn === threads && threadPx >= RELIEF_MIN_PIXELS;
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
    const cols = patchworkLayout ? patchworkLayout.cols : Math.max(1, Math.min(n, Math.round(Math.sqrt(n * w / h))));
    const rows = Math.ceil(n / cols);
    const cell = Math.max(24, Math.floor(Math.min((w - gap * (cols - 1)) / cols, (h - gap * (rows - 1)) / rows)));
    grid.style.gridTemplateColumns = `repeat(${cols}, ${cell}px)`;
    grid.style.gridAutoRows = `${cell}px`;

    const density = window.devicePixelRatio || 1;
    const scaleMode = readPatchworkScale();
    const fragment = document.createDocumentFragment();
    patchworkBatch.forEach((entry, index) => {
        const srt = buildSRTCode(entry.stripes, entry.symmetric);
        const caption = entry.criteria ? entry.criteria.map(c => criterionLabel(c, t)).join(' · ') : '';
        const cellEl = document.createElement('div');
        cellEl.className = 'patchwork-cell' + (entry.pinned ? ' pinned' : '');

        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'patchwork-tile';
        button.title = [t.patch_pick, caption, srt].filter(Boolean).join('\n');
        button.setAttribute('aria-label', `${t.patch_pick} : ${caption ? caption + ', ' : ''}${srt}`);
        button.addEventListener('click', () => usePatchworkTile(index));

        const canvas = document.createElement('canvas');
        canvas.width = Math.round(cell * density);
        canvas.height = canvas.width;
        renderPatternCanvas(canvas, entry, scaleMode);
        button.appendChild(canvas);

        // Small actions over the tile: pin it, or explore variants around it
        const actions = document.createElement('div');
        actions.className = 'patchwork-actions';
        const pin = document.createElement('button');
        pin.type = 'button';
        pin.className = 'patchwork-action patchwork-pin';
        pin.textContent = '📌';
        pin.setAttribute('aria-pressed', String(entry.pinned));
        pin.title = entry.pinned ? t.patch_unpin : t.patch_pin;
        pin.setAttribute('aria-label', `${pin.title} : ${srt}`);
        pin.addEventListener('click', () => togglePatchworkPin(index));
        const vary = document.createElement('button');
        vary.type = 'button';
        vary.className = 'patchwork-action patchwork-vary';
        vary.textContent = '≈';
        vary.title = t.patch_vary;
        vary.setAttribute('aria-label', `${t.patch_vary} : ${srt}`);
        vary.addEventListener('click', () => showPatchworkVariants(index));
        actions.append(pin, vary);

        cellEl.append(button, actions);
        if (caption) {
            const label = document.createElement('span');
            label.className = 'patchwork-caption';
            label.textContent = caption;
            cellEl.appendChild(label);
        }
        fragment.appendChild(cellEl);
    });
    grid.appendChild(fragment);
}

function togglePatchworkPin(index) {
    const entry = patchworkBatch[index];
    if (!entry) return;
    entry.pinned = !entry.pinned;
    renderPatchworkBoard();
    // Keep the keyboard on the same pin after the redraw
    domElements.patchworkGrid.querySelectorAll('.patchwork-pin')[index]?.focus();
}

// Fills the board with variants of one tile; the tile and the pinned ones stay.
function showPatchworkVariants(index) {
    const source = patchworkBatch[index];
    if (!source) return;
    source.pinned = true;
    const qty = readPatchworkQty();
    const keptCount = patchworkBatch.filter(e => e.pinned).length;
    const variants = [];
    for (let i = 0; variants.length < Math.max(0, qty - keptCount) && i < qty * 3; i++) {
        const variant = createPatchworkVariant(source, i % 3);
        if (variant.stripes.length > 0) variants.push(variant);
    }
    patchworkBatch = mergePinnedTiles(patchworkBatch, variants, qty);
    patchworkLayout = null;
    setPatchworkStatus('patch_variants');
    renderPatchworkBoard();
    domElements.patchworkGrid.querySelectorAll('.patchwork-vary')[patchworkBatch.indexOf(source)]?.focus();
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

// Atelier: one pattern and its settings. Planche: the mood board, with its own settings in the panel.
function syncModeSwitch() {
    const board = isPatchworkOpen();
    document.body.classList.toggle('board-mode', board);
    domElements.btnPatchworkClose?.setAttribute('aria-pressed', String(!board));
    domElements.btnGenPatchwork?.setAttribute('aria-pressed', String(board));
}

function closePatchworkBoard() {
    if (!domElements.patchworkBoard) return;
    domElements.patchworkBoard.hidden = true;
    syncModeSwitch();
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
    const criteria = isPatchworkCriteria();
    const created = criteria ? createPatchworkCriteriaBatch() : createPatchworkBatch(readPatchworkQty());
    if (!created) {
        closePatchworkBoard();
        return;
    }
    const wasOpen = isPatchworkOpen();
    let status = null;
    if (criteria) {
        // "Nouveau lot" keeps the pinned tiles in their cell, as long as the grid is the same
        const { xAxis, yAxis } = readPatchworkAxes();
        const key = `${xAxis}|${yAxis}|${created.batch.length}`;
        const sameGrid = wasOpen && patchworkLayout?.key === key;
        if (wasOpen && !sameGrid && patchworkBatch.some(e => e.pinned)) status = 'patch_pins_dropped';
        patchworkBatch = sameGrid ? created.batch.map((e, i) => patchworkBatch[i].pinned ? patchworkBatch[i] : e) : created.batch;
        patchworkLayout = { cols: created.cols, key };
    } else {
        // "Nouveau lot" keeps the pinned tiles
        patchworkBatch = wasOpen ? mergePinnedTiles(patchworkBatch, created, readPatchworkQty()) : created;
        patchworkLayout = null;
    }
    if (!wasOpen) patchworkOpener = document.activeElement;
    closeObjectPreview();
    board.hidden = false;
    syncModeSwitch();
    setPatchworkStatus(status);
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
    const cols = patchworkLayout ? patchworkLayout.cols : Math.ceil(Math.sqrt(n));
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
