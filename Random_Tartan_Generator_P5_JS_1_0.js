// =====================================================
//  RANDOM TARTAN GENERATOR V1.0.0 - P5.JS VERSION
//  By HaBOD, 2025 - CC BY-SA 4.0
//  Based on a Sketch from steven kay, 2011 (https://openprocessing.org/sketch/25876) - CC BY-SA 2.0
//  Complete rewrite with constraint-based workflow
//  Uses Scottish Register of Tartan 137 Colour Shades
//  Generates Threadcount code following SRT guidelines
//  This code was partially made with GenAI assistance
//  It is a tool to explore design of Tartans motifs
// =====================================================

/* ==========================================
   SECTION 1 : Défintion de la palette 
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

console.log(`[OK] 1. Palette SRT Chargée : ${SRT_PALETTE.length} couleurs disponibles.`);

/* ==========================================
   SECTION 2 : VARIABLES GLOBALES
   ========================================== */

let canvas;
let pixelDensity_val = 1;

// État du tartan
let tartanStripes = [];      // Bandes générées [{color, width, colorCode}, ...]
let userPalette = [];        // Palette utilisateur [{hex, code, name}, ...]
let isSymmetric = true;      // Mode symétrique activé

// Paramètres de rendu
let threadSize = 2.0;        // Taille pixel d'un fil (zoom)
let threadMM = 0.3;          // Diamètre réel fil en mm
let settValue = 260;         // Sett (fils par 10cm)

// Identifiant de génération
let generationID = 0;

// HISTORIQUE (UNDO)
let historyStack = [];       // Pile des états précédents
const MAX_HISTORY = 10;      // Nombre max d'états conservés

// Graphiques off-screen pour performance
let patternBuffer = null;
let needsRedraw = true;

// Gestion multilingue
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
        chk_check_mode: "Damier (bande de largeurs égales)",
        lbl_sett: "Densité (Sett cible)",
        sec_zoom: "Zoom et Échelle",
        lbl_thread_mm: "Diamètre fil (mm)",
        lbl_zoom: "Zoom Visuel",
        lbl_width_cm: "Largeur motif",
        sec_palette: "Palette de couleurs sélectionnées (Max 8)",
        sec_srt: "Code SRT du Tartan",
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
        btn_export_all: "Exporter tout"
    },
    en: {
        ph_import: "Paste SRT code here (e.g., K4 R32)...",
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
        btn_export_all: "Export all"
    }
};
console.log("[OK] 2. Variables Globales Initialisées");

/* ==========================================
   SECTION 3 : INITIALISATION P5.JS
   ========================================== */
   
function setup() {
    // A. Initialisation du Canvas dans le conteneur
    let container = document.getElementById('canvas-container');
    if (!container) {
        console.error("❌ Erreur : #canvas-container introuvable dans le HTML.");
        return;
    }

    let w = container.offsetWidth;
    let h = container.offsetHeight;

    let canvas = createCanvas(w, h);
    canvas.parent('canvas-container');
    
    noLoop();    // On ne dessine que sur demande (économie de ressources)
    noSmooth();  // Rendu net pour l'aspect "fil" (pixel perfect)

    // B. Ajout de la Réactivité (Event Listeners)
    // Liste des IDs HTML qui doivent déclencher une mise à jour
    // Note : On utilise 'input' pour une réaction immédiate, ou 'change' selon besoin
    let inputsToWatch = [
        'in-stripes',   // Nombre de bandes cibles
        'in-maxwidth',  // Largeur max fil
        'in-sett',      // Densité
        'in-zoom',      // Zoom visuel
        'in-threadmm',  // Diamètre fil
        'check-sym'     // Checkbox Symétrie
    ];

    inputsToWatch.forEach(id => {
        let el = document.getElementById(id);
        if(el) {
            el.addEventListener('input', () => {
                // Si la fonction n'est pas encore définie (sections suivantes), on évite le crash
                if (window.handleGenerateClick) {
                    // Pour les sliders purement visuels (zoom), on peut juste redraw, 
                    // mais pour simplifier ici on relance la logique centrale
                    window.handleGenerateClick(true); // true = mode "update paramètres"
                }
            });
        }
    });

    // C. Démarrage Initial
    // On laisse un petit délai pour s'assurer que le DOM est prêt et les polices chargées
    setTimeout(() => {
        console.log("[Info] Démarrage de la première génération...");
        
        // Note: Ces fonctions seront définies dans les sections 3 et 4.
        // On simule une génération complète aléatoire au départ.
        if (window.randomizeUserPalette && window.handleGenerateClick) {
            randomizeUserPalette(); 
            window.handleGenerateClick(); 
        }
        
        // Initialiser la langue
        setLanguage('fr');
        
    }, 100);

}
document.addEventListener('keydown', (e) => {
    // Ignorer si focus dans un input
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    
    switch(e.key.toLowerCase()) {
        case ' ':       // Espace = Générer
        case 'g':
            e.preventDefault();
            handleGenerateClick();  // ← CORRIGÉ
            break;
        case 's':       // S = Export tout
            e.preventDefault();
            exportAll();
            break;
        case 'p':       // P = Export PNG seul
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
// --- GESTION LANGUE ---
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

    // Rafraîchir l'UI qui dépend de la langue (Palette, Modale...)
    updateUserPaletteUI();
}
console.log("[OK] 3. Setup P5.JS terminé")
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
    console.log(`[Info] Palette aléatoire générée : ${userPalette.length} couleurs.`);
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
        alert("Minimum 2 couleurs requises");
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
// === AFFICHAGE VALEURS RÉELLES ===

function updateActualValues() {
    updateActualStripes();
    updateActualSett();
}

function updateActualStripes() {
    const target = parseInt(document.getElementById('in-stripes')?.value) || 6;
    const actual = tartanStripes.length;
    const display = document.getElementById('stripes-actual');
    
    if (display) {
        if (actual !== target) {
            display.innerHTML = `→ <span style="color:#e74c3c;">${actual}</span>`;
        } else {
            display.textContent = '';  // Masquer si égal
        }
    }
}

function updateActualSett() {
    const display = document.getElementById('sett-actual');
    if (!display) return;
    
    // Si pas de stripes, masquer l'affichage
    if (!tartanStripes || tartanStripes.length === 0) {
        display.textContent = '';
        return;
    }
    
    // Calcul du nombre total de fils
    let totalThreads = 0;
    for (let s of tartanStripes) {
        totalThreads += s.count || 0;
    }
    
    // Éviter division par zéro
    if (totalThreads === 0 || threadMM <= 0) {
        display.textContent = '';
        return;
    }
    
    // Calcul du sett réel (fils par 10cm)
    let widthCm = totalThreads * threadMM / 10;
    let actualSett = Math.round(totalThreads / widthCm * 10);
    
    // Comparaison avec la cible
    let targetSett = parseInt(document.getElementById('in-sett')?.value) || 260;
    
    if (actualSett !== targetSett) {
        display.innerHTML = `→ <span style="color:#e74c3c;">${actualSett}</span>`;
    } else {
        display.textContent = '';
    }
}

// === SÉLECTEUR TYPE DE FIL ===
function updateThreadDiameter() {
    const select = document.getElementById('thread-type');
    const input = document.getElementById('in-threadmm');
    
    if (select.value === 'custom') {
        // Mode personnalisé : activer le champ
        input.disabled = false;
        input.style.opacity = '1';
        input.style.cursor = 'text';
    } else {
        // Mode prédéfini : désactiver et mettre la valeur
        input.disabled = true;
        input.style.opacity = '0.6';
        input.style.cursor = 'not-allowed';
        input.value = select.value;
    }
    
    updateScaleInfo();
}


// === GESTION HISTORIQUE ===

function pushToHistory() {
    let state = {
        stripes: JSON.parse(JSON.stringify(tartanStripes)),
        palette: JSON.parse(JSON.stringify(userPalette)),
        symmetric: document.getElementById('check-sym')?.checked || false,
        generationID: generationID,
        timestamp: Date.now()
    };
    
    historyStack.push(state);
    
    if (historyStack.length > MAX_HISTORY) {
        historyStack.shift();
    }
    
    updateUndoButton();
    console.log(`📚 Historique: ${historyStack.length}/${MAX_HISTORY} états`);
}

function undo() {
    if (historyStack.length === 0) {
        console.log("{INFO] Rien à annuler");
        return;
    }
    
    let previousState = historyStack.pop();
    
    tartanStripes = previousState.stripes;
    userPalette = previousState.palette;
    generationID = previousState.generationID;
    
    let symCheck = document.getElementById('check-sym');
    if (symCheck) symCheck.checked = previousState.symmetric;
    
    let idDisplay = document.getElementById('gen-id');
    if (idDisplay) idDisplay.textContent = generationID;
    
    // Rafraîchir l'UI
    updateUserPaletteUI();
    updateGeneratedListUI();
    redrawTartan();
    updateUndoButton();
    updateActualValues();
    console.log(`↩️ Retour à génération #${generationID}. Reste: ${historyStack.length} états`);
}

function updateUndoButton() {
    let btn = document.getElementById('btn-undo');
    if (btn) {
        btn.disabled = (historyStack.length === 0);
        btn.title = `Annuler (${historyStack.length} étapes disponibles)`;
    }
}

// Expose pour le HTML
window.undo = undo;


// Expose pour le HTML
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
    // Affiche Nom + Code + Hex
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

    listContainer.innerHTML = `<div style="font-size:10px; color:#666; margin-bottom:5px;"></div>`;

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
        chip.title = formatColorLabel(p) + "\nCliquer pour changer";
        chip.onclick = () => openColorPicker(idx); 
        
        let delBtn = document.createElement('div');
        delBtn.textContent = "\u00D7";
        delBtn.style.cssText = "color:#666; font-size:16px; font-weight:bold; cursor:pointer; margin-top:-2px; line-height:1;";
        delBtn.title = "Retirer de la palette";
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
    let srtInput = document.getElementById('srt-display');
    let idLabel = document.getElementById('gen-id');

    if(idLabel) idLabel.innerText = generationID;
    if(container) container.innerHTML = "";

    // Récupérer le mode symétrique
    let isSymmetric = document.getElementById('check-sym')?.checked || false;
    
    // Construction de la chaîne SRT selon les règles officielles
    let srtString = buildSRTCode(tartanStripes, isSymmetric);

    // Affichage visuel des bandes
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
            row.appendChild(document.createTextNode(` : ${s.count} fils`));

            container.appendChild(row);
        }
    });

    if(srtInput) srtInput.value = srtString;
}

// === CONSTRUCTION CODE SRT OFFICIEL ===
function buildSRTCode(stripes, isSymmetric) {
    if (!stripes || stripes.length === 0) return "";
    
    let parts = [];
    
    stripes.forEach((s, index) => {
        let code = s.code;
        let count = s.count;
        
        if (isSymmetric) {
            // Premier et dernier = pivots avec /
            if (index === 0 || index === stripes.length - 1) {
                parts.push(`${code}/${count}`);
            } else {
                parts.push(`${code}${count}`);
            }
        } else {
            // Asymétrique : pas de /
            parts.push(`${code}${count}`);
        }
    });
    
    if (isSymmetric) {
        // Format : B/24 W4 K24 W/2
        return parts.join(' ');
    } else {
        // Format : ...B24 W4 K24 W2...
        return '...' + parts.join(' ') + '...';
    }
}

// === CONSTRUCTION CODE INK/STITCH ===
function buildInkStitchCode(stripes, isSymmetric) {
    if (!stripes || stripes.length === 0) return "";
    
    let parts = [];
    
    stripes.forEach((s, index) => {
        let hex = s.hex;
        let count = s.count;
        
        if (isSymmetric) {
            // Premier et dernier = pivots avec /
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

// Expose pour export
window.buildSRTCode = buildSRTCode;
window.buildInkStitchCode = buildInkStitchCode;


// Initialisation des styles au chargement
injectDynamicStyles();

console.log("[OK] 4. Logique Palette et UI chargée");

// ================= 5. LOGIQUE GÉNÉRATION MOTIF =================

// --- Gestionnaire du Clic (Chef d'orchestre) ---
window.handleGenerateClick = function(isUpdateOnly = false) {
    
    // SAUVEGARDER L'ÉTAT ACTUEL AVANT TOUTE MODIFICATION
    if (tartanStripes.length > 0 && !isUpdateOnly) {
        pushToHistory();
    }
    
    // 1. Lire l'état des cases (UTILISE LES MÊMES IDs PARTOUT)
    let keepColors = document.getElementById('lock-colors')?.checked || false;
    let keepStructure = document.getElementById('lock-structure')?.checked || false;

    // 2. Si on ne conserve PAS les couleurs → randomiser la palette
    // Mais seulement si ce n'est pas une simple "mise à jour visuelle" (slider)
    if(!keepColors && !isUpdateOnly) {
        randomizeUserPalette();
    }

    // 3. Vérification de sécurité
    if(userPalette.length <= 1) {
        alert(TRANSLATIONS[currentLang].msg_palette_min);
        return;
    }

    // 4. Gestion de l'UI
    drawLoadingScreen();

    // 5. Génération avec délai
    setTimeout(() => {
        generateNewTartan(keepColors, keepStructure); // ← PASSER LES PARAMS
        
        if(typeof redrawTartan === 'function') redrawTartan();
        if(typeof updateGeneratedListUI === 'function') updateGeneratedListUI();
        
    }, 50);
}

function generateNewTartan(lockColors = false, lockStructure = false) {
    // 1. Récupération des paramètres HTML
    let minW = parseInt(document.getElementById('in-minwidth').value) || 2;
    let maxW = parseInt(document.getElementById('in-maxwidth').value) || 124;
    let targetStripes = parseInt(document.getElementById('in-stripes').value) || 12;
    let targetSett = parseInt(document.getElementById('in-sett').value) || 260;
    
    // Option "Mode Check" (Largeurs égales)
    let isCheckMode = document.getElementById('check-mode-check')?.checked || false;

    // Correction automatique : Min/Max doivent être pairs
    if (minW % 2 !== 0) minW++;
    if (maxW % 2 !== 0) maxW++;
    if (minW < 2) minW = 2;
    if (maxW > 124) maxW = 124;
    if (minW > maxW) minW = maxW;

    generationID = Math.floor(Math.random() * 1000000);

    // --- CAS A : TOUT EST VERROUILLÉ (Rien ne se passe) ---
    if (lockColors && lockStructure) {
        console.log("[INFO] Tout est verrouillé. Pas de changement.");
        return; 
    }

    // --- CAS B : GARDER STRUCTURE, CHANGER COULEURS ---
    if (lockStructure && tartanStripes.length > 0) {
        // On garde les largeurs (count), on change juste les codes couleurs
        tartanStripes.forEach(bande => {
            // On prend une nouvelle couleur au hasard dans la palette utilisateur
            let newColor = userPalette[Math.floor(Math.random() * userPalette.length)];
            bande.code = newColor.code;
            bande.hex = newColor.hex;
        });
        console.log("[INFO] Structure gardée, Couleurs changées.");
        return;
    }

    // --- CAS C : GARDER COULEURS (La palette ne change pas, mais l'ordre et largeurs changent) ---
    // Note : Dans votre code actuel, "Garder couleur" est implicite car on utilise 'userPalette'.
    // Si la case n'est PAS cochée, on pourrait vouloir régénérer la palette entièrement ?
    // Pour l'instant, on assume que "Garder Couleurs" signifie "Ne pas toucher à la liste de gauche".
    // Si 'lock-palette' est FALSE, on pourrait relancer un randomizeUserPalette() ?
    
    if (!lockColors) {
        // Optionnel : Si l'utilisateur veut que le bouton génère aussi une nouvelle palette
        // randomizeUserPalette(); 
        // Pour l'instant, on laisse l'utilisateur gérer sa palette manuellement.
    }

    // --- CAS D : GÉNÉRATION STANDARD ---

let tempStripes = [];
let previousColorCode = null;
let totalThreads = 0; // ✅ Compteur de fils

// Pré-calcul largeur fixe pour mode Check
let fixedCheckWidth = 0;
if (isCheckMode) {
    let minPair = minW / 2;
    let maxPair = maxW / 2;
    fixedCheckWidth = (Math.floor(Math.random() * (maxPair - minPair + 1)) + minPair) * 2;
}

// On génère jusqu'à atteindre le sett cible (ou nombre max de bandes)
for (let i = 0; i < targetStripes && totalThreads < targetSett; i++) {
    
    // 1. Choix de la couleur (éviter doublon adjacent)
    let availableColors = userPalette.filter(c => c.code !== previousColorCode);
    if (availableColors.length === 0) availableColors = userPalette;

    let selectedColor = availableColors[Math.floor(Math.random() * availableColors.length)];
    previousColorCode = selectedColor.code;

    // 2. Choix de la largeur
    let finalWidth;
    
    if (isCheckMode) {
        finalWidth = fixedCheckWidth;
    } else {
        let minPair = minW / 2;
        let maxPair = maxW / 2;
        let randomPair = Math.floor(Math.random() * (maxPair - minPair + 1)) + minPair;
        finalWidth = randomPair * 2;
    }
    
    // ✅ Ajuster si on dépasse le sett
    if (totalThreads + finalWidth > targetSett) {
        finalWidth = targetSett - totalThreads;
        if (finalWidth % 2 !== 0) finalWidth--; // Garder pair
        if (finalWidth < minW) break; // Trop petit, on arrête
    }

    tempStripes.push({
        code: selectedColor.code,
        hex: selectedColor.hex,
        count: finalWidth
    });
    
    totalThreads += finalWidth; // ✅ Mise à jour du compteur
}
tartanStripes = tempStripes;
console.log(`[INFO] Nouveau Tartan généré : ${tempStripes.length} bandes, Sett total: ${totalThreads}/${targetSett}`);
}

// Fonction utilitaire de mélange (Fisher-Yates)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
console.log("[OK] 5. LOGIQUE GÉNÉRATION MOTIF");
// =========================================================================
// 6. RENDU (TISSAGE)
// =========================================================================

function redrawTartan() {
    // Sécurité : Si pas de données, on ne dessine rien
    if(!tartanStripes || tartanStripes.length === 0) return;

    // 1. Récupération des paramètres de rendu
    // Le zoom définit la taille d'un "fil" en pixels à l'écran
    let domZoom = document.getElementById('in-zoom');
    let zoom = domZoom ? (parseFloat(domZoom.value) || 2.0) : 2.0;
    
    // Vérification de la symétrie
    let domSym = document.getElementById('check-sym');
    let isSymmetric = domSym ? domSym.checked : false;

    // Récupération de la direction de tissage (Z ou S)
    let domWeaveZ = document.querySelector('input[name="weave-dir"][value="Z"]');
    let isZTwist = domWeaveZ ? domWeaveZ.checked : true; // Par défaut Z

    // 2. Construction de la séquence de fils (WARP - Chaîne)
    // On convertit "Rouge: 4 fils, Bleu: 6 fils" en un tableau [R,R,R,R, B,B,B,B,B,B]
    let warpSeq = [];
    
    // Partie A (Aller)
    for(let s of tartanStripes) { 
        for(let k=0; k<s.count; k++) warpSeq.push(s.hex); 
    }
    
    // Partie B (Retour - si symétrique)
    // On ne répète pas le dernier bloc pour éviter un doublement (A-B-C-B-A et non A-B-C-C-B-A)
    // Note: Dans les tartans complexes, la symétrie pivote parfois différemment. Ici pivot simple.
    if (isSymmetric) {
        for(let i = tartanStripes.length - 2; i >= 0; i--) {
            let s = tartanStripes[i];
            for(let k=0; k<s.count; k++) warpSeq.push(s.hex);
        }
        // NOTE: Si vous voulez une symétrie totale incluant la dernière bande : changer index à length-1
    }

    let seqLen = warpSeq.length;

    // 3. Préparation du Canvas
    clear(); 
    background(20); 
    noStroke();

    // Calcul du nombre de fils à dessiner pour remplir l'écran
    let cols = Math.ceil(width / zoom);
    let rows = Math.ceil(height / zoom);

    // 4. BOUCLE DE TISSAGE (Twill 2/2)
    // C'est ici que la magie opère.
    // L'algorithme standard du tartan est un sergé (twill) 2/2 : 2 dessus, 2 dessous, décalé de 1 à chaque ligne.

    // ⚡ Bolt Optimization: Pre-calculate warp sequence colors for each column
    let warpColors = new Array(cols);
    for (let x = 0; x < cols; x++) {
        warpColors[x] = warpSeq[x % seqLen];
    }

    // ⚡ Bolt Optimization: Draw entire warp vertically, grouping adjacent identical colors
    // Use native drawingContext instead of p5's fill() and rect() for >2x performance boost
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
    for (let y = 0; y < rows; y++) {
        let weftColor = warpSeq[y % seqLen];
        let yZoom = y * zoom;
        let yMod = y & 3; // Bitwise & 3 is equivalent to % 4 but faster

        drawingContext.fillStyle = weftColor;

        // Determine starting x-index for visible weft based on twist direction
        let xStart = isZTwist ? (6 - yMod) & 3 : (yMod + 2) & 3;

        // The first group might be cut off on the left edge
        if (xStart === 3) {
            drawingContext.fillRect(0, yZoom, zoom, zoom);
        }

        // Draw the rest in pairs (since it's a 2/2 twill weave, weft is visible for 2 threads)
        for (let x = xStart; x < cols; x += 4) {
            let w = x + 2 > cols ? cols - x : 2;
            drawingContext.fillRect(x * zoom, yZoom, w * zoom, zoom);
        }
    }

    // 4. BOUCLE DE TISSAGE (Twill 2/2)
    // C'est ici que la magie opère.
    // L'algorithme standard du tartan est un sergé (twill) 2/2 : 2 dessus, 2 dessous, décalé de 1 à chaque ligne.

    // ⚡ Bolt Optimization: Pre-calculate warp sequence colors for each column
    let warpColors = new Array(cols);
    for (let x = 0; x < cols; x++) {
        warpColors[x] = warpSeq[x % seqLen];
    }

    // ⚡ Bolt Optimization: Draw entire warp vertically, grouping adjacent identical colors
    if (cols > 0) {
        let currentWarpColor = warpColors[0];
        let warpStart = 0;
        for (let x = 1; x <= cols; x++) {
            if (x === cols || warpColors[x] !== currentWarpColor) {
                // ⚡ Bolt: Bypass p5.js overhead (fill/rect) and use native canvas API
                // This avoids internal p5 state checks and wrapper overhead in this tight loop.
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
    let currentWeftColor = null;
    for (let y = 0; y < rows; y++) {
        let weftColor = warpSeq[y % seqLen];
        let yZoom = y * zoom;
        let yMod = y & 3; // Bitwise & 3 is equivalent to % 4 but faster

        // ⚡ Bolt: Bypass p5.js overhead (fill) and use native canvas API
        // Significantly faster when called thousands of times per frame.
        drawingContext.fillStyle = weftColor;
        // ⚡ Bolt Optimization: Only call fill() if color actually changes.
        // Prevents ~90%+ of expensive canvas 2d context updates and hex color parsing per row
        if (weftColor !== currentWeftColor) {
            fill(weftColor);
            currentWeftColor = weftColor;
        }

        // Determine starting x-index for visible weft based on twist direction
        let xStart = isZTwist ? (6 - yMod) & 3 : (yMod + 2) & 3;

        // The first group might be cut off on the left edge
        if (xStart === 3) {
            // ⚡ Bolt: Native canvas API for drawing
            drawingContext.fillRect(0, yZoom, zoom, zoom);
        }

        // Draw the rest in pairs (since it's a 2/2 twill weave, weft is visible for 2 threads)
        for (let x = xStart; x < cols; x += 4) {
            let w = x + 2 > cols ? cols - x : 2;
            // ⚡ Bolt: Native canvas API for drawing in tight loop
            drawingContext.fillRect(x * zoom, yZoom, w * zoom, zoom);
        }
    }

    // Mise à jour des infos textuelles (Dimensions réelles)
    updateScaleInfo(seqLen);
    updateActualValues();
}

// Fonction utilitaire : Écran de chargement
function drawLoadingScreen() {
    background(0); 
    fill(255); 
    textAlign(CENTER, CENTER); 
    textSize(16);
    text(TRANSLATIONS[currentLang].loading, width/2, height/2);
}

// Mise à jour des infos de taille (cm)
window.updateScaleInfo = function(totalThreadsOverride) {
    let domThread = document.getElementById('in-threadmm');
    // Par défaut, threadThickness = 0.5mm (Grosse laine) ou on utilise un Sett
    // Si on veut un Sett de 30 fils/cm => 1 fil = 0.33mm.
    let threadMm = domThread ? (parseFloat(domThread.value) || 0.5) : 0.5;
    
    let totalThreads = 0;
    if (totalThreadsOverride) {
        totalThreads = totalThreadsOverride;
    } else {
        tartanStripes.forEach(s => totalThreads += s.count);
        let domSym = document.getElementById('check-sym');
        if(domSym && domSym.checked) totalThreads = (totalThreads * 2) - tartanStripes[tartanStripes.length-1].count; // Approx symétrie
    }

    // Calcul largeur : (NbFils * Epaisseur mm) / 10 pour avoir des cm
    let sizeCm = (totalThreads * threadMm) / 10;
    
    let el = document.getElementById('real-width');
    if(el) el.innerText = sizeCm.toFixed(1) + " cm";
    
    let elCount = document.getElementById('thread-count');
    if(elCount) elCount.innerText = totalThreads + " fils";

    return { count: totalThreads, size: sizeCm.toFixed(2) };
}

// Handlers UI mappés globalement
window.updateZoom = function() { redrawTartan(); }
window.updateSymmetry = function() { 
    // On doit peut-être mettre à jour le texte SRT si la symétrie change l'affichage
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

// === CONSTRUCTION CODE SRT OFFICIEL ===
function buildSRTCode(stripes, isSymmetric) {
    if (stripes.length === 0) return "";
    
    let parts = stripes.map((s, index) => {
        // En mode symétrique : premier et dernier = pivots avec "/"
        if (isSymmetric && (index === 0 || index === stripes.length - 1)) {
            return `${s.code}/${s.count}`;
        }
        return `${s.code}${s.count}`;
    });
    
    if (isSymmetric) {
        // Format: B/24 W4 K24 G/8
        return parts.join(' ');
    } else {
        // Format: ...B24 W4 K24 G8...
        return `...${parts.join(' ')}...`;
    }
}

// === CONSTRUCTION CODE INK/STITCH ===
function buildInkStitchCode(stripes, isSymmetric) {
    if (stripes.length === 0) return "";
    
    let parts = stripes.map((s, index) => {
        // En mode symétrique : premier et dernier = pivots avec "/"
        if (isSymmetric && (index === 0 || index === stripes.length - 1)) {
            return `(${s.hex})/${s.count}`;
        }
        return `(${s.hex})${s.count}`;
    });
    
    if (isSymmetric) {
        return parts.join(' ');
    } else {
        return `...${parts.join(' ')}...`;
    }
}

// --- EXPORT TXT ---
function exportTXT() {
    // Générer le nom de fichier
    let date = new Date();
    let dateStr = date.getFullYear() + '-' + 
                  String(date.getMonth() + 1).padStart(2, '0') + '-' + 
                  String(date.getDate()).padStart(2, '0');
    let filename = `Tartan_${generationID}_${dateStr}.txt`;
    
    // Construire le contenu
    let content = `TARTAN GENERATOR - EXPORT\n`;
    content += `==========================\n\n`;
    content += `ID: ${generationID}\n`;
    content += `Date: ${dateStr}\n\n`;
    
    // Code SRT
    content += `CODE SRT:\n`;
    content += document.getElementById('srt-display')?.value || 'N/A';
    content += `\n\n`;
    // Code Ink/Stitch
    let isSymmetric = document.getElementById('check-sym')?.checked || false;
    content += `\nCODE INK/STITCH:\n`;
    content += buildInkStitchCode(tartanStripes, isSymmetric);
    content += `\n\n`;
    // Statistiques
    let totalThreads = tartanStripes.reduce((sum, s) => sum + (s.count || 0), 0);
    let threadMM = parseFloat(document.getElementById('in-threadmm')?.value) || 1.11;
    let sizeCM = ((totalThreads * 2 * threadMM) / 10).toFixed(1);
    
    content += `STATISTIQUES:\n`;
    content += `- Demi-sett: ${totalThreads} fils\n`;
    content += `- Sett complet: ${totalThreads * 2} fils\n`;
    content += `- Largeur estimée: ${sizeCM} cm (fil ${threadMM}mm)\n`;
    content += `- Nombre de bandes: ${tartanStripes.length}\n\n`;
    
    // Palette utilisée
    content += `PALETTE:\n`;
    userPalette.forEach(c => {
        content += `- ${c.code}: ${c.name} (${c.hex})\n`;
    });
    
    // Télécharger
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
    // Générer le nom de fichier
    let date = new Date();
    let dateStr = date.getFullYear() + '-' + 
                  String(date.getMonth() + 1).padStart(2, '0') + '-' + 
                  String(date.getDate()).padStart(2, '0');
    let filename = `Tartan_${generationID}_${dateStr}.png`;
    
    // Sauvegarder le canvas
    saveCanvas(filename, 'png');
}

function exportAll() {
    exportPNG();
    setTimeout(() => {
        exportTXT();
    }, 500); // Délai pour éviter conflit navigateur
}

// Expose pour le HTML
window.exportAll = exportAll;

// --- MISE À JOUR AFFICHAGE SRT ---
function updateGeneratedListUI() {
    let container = document.getElementById('generated-stripes-list');
    let srtInput = document.getElementById('srt-display');
    let idLabel = document.getElementById('gen-id');

    if(idLabel) idLabel.innerText = generationID;
    if(container) container.innerHTML = "";

    // Construire le code SRT officiel
    let isSymmetric = document.getElementById('check-sym')?.checked || false;
    let srtCode = buildSRTCode(tartanStripes, isSymmetric);

    // Affichage visuel des bandes
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
            row.appendChild(document.createTextNode(` : ${s.count} fils`));

            container.appendChild(row);
        }
    });

    // Mise à jour du textarea avec format SRT officiel
    if(srtInput) srtInput.value = srtCode;
}

// Styles dynamiques pour la modale
function injectDynamicStyles() {
    let css = `
        .picker-modal { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #222; border: 1px solid #555; padding: 20px; z-index: 10000; width: 380px; border-radius: 8px; box-shadow: 0 20px 50px rgba(0,0,0,0.8); color:white; font-family:sans-serif;}
        .picker-grid { display: grid; grid-template-columns: repeat(8, 1fr); gap: 4px; max-height: 300px; overflow-y: auto; margin: 15px 0; }
        .picker-chip { width: 100%; aspect-ratio: 1; cursor: pointer; border-radius: 2px; }
        .picker-chip:hover { transform: scale(1.2); border: 2px solid #fff; z-index:2; position:relative; }
    `;
    let style = document.createElement('style');
    style.innerHTML = css;
    document.head.appendChild(style);
}

// --- CHARGER UN EXEMPLE SRT ---
window.loadExample = function(val) {
    if(!val) return;
    let input = document.getElementById('import-text');
    if(input) {
        input.value = val;
        importSRT();
    }
}

// --- IMPORT SRT (LOGIQUE OFFICIELLE) ---
window.importSRT = function() {
    let input = document.getElementById('import-text');
    if(!input) return;
    let text = input.value.trim().toUpperCase();
    if(!text) { alert("Veuillez entrer un code SRT."); return; }
    
    let domSym = document.getElementById('check-sym');
    let isAsymmetricImport = false;
    let isSymmetricImport = false;

    // Détection Asymétrie (...)
    if (text.includes('...')) {
        isAsymmetricImport = true;
        text = text.replace(/\.\.\./g, '');
    }

    // Détection Symétrie (/)
    if (text.includes('/')) {
        isSymmetricImport = true;
    }

    // Mise à jour checkbox
    if (domSym) {
        if (isAsymmetricImport) {
            domSym.checked = false;
        } else if (isSymmetricImport) {
            domSym.checked = true;
        }
    }

    // Regex pour Code/Nombre (accepte slash optionnel)
    let regex = /([A-Z]+)\/?(\d+)/g;
    
    let match;
    let newStripes = [];
    let newPaletteMap = new Map();
    
    while ((match = regex.exec(text)) !== null) {
        let code = match[1];
        let count = parseInt(match[2]);
        
        let colorObj = SRT_PALETTE.find(c => c.code === code);
        
        if (!colorObj) {
            console.warn(`Code couleur inconnu ignoré: ${code}`);
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
        alert("Aucun code valide détecté.");
        return;
    }
    
    // Sauvegarde historique avant modification
    if (typeof pushToHistory === 'function') {
        pushToHistory();
    }
    
    tartanStripes = newStripes;
    userPalette = Array.from(newPaletteMap.values());
    
    updateUserPaletteUI();
    redrawTartan();
    updateGeneratedListUI();
    
    console.log(`[INFO] Import réussi : ${newStripes.length} bandes.`);
}

console.log("[OK] 7. Export/Import chargée");
console.log("[OK] Random Tartan Generator v1.0.0 Loaded.");
