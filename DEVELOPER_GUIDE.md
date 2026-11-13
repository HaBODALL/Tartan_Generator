# Developer & Forking Guide / Guide du Développeur

[🇬🇧 English Version](#english-version) | [🇫🇷 Version Française](#version-française)

---

<a id="english-version"></a>
# 🇬🇧 Developer Guide (English)

Welcome to the **Random Tartan Generator** repository! This document is intended for developers who wish to understand the codebase, fork the project, or contribute. The architecture is intentionally kept simple and lightweight.

## 1. High-Level Architecture

This project is a **100% static front-end web application**. It does not rely on modern build systems (like Webpack, Vite, React, or Rust/Tauri) and does not require a backend server or external database.

*   **HTML/CSS:** Handles the UI structure and styling (contained within `index.html`).
*   **Vanilla JavaScript:** Manages DOM interactions, state, and user events.
*   **p5.js:** The core graphics library used to render the Tartan patterns on an HTML5 `<canvas>`.
*   **Data Persistence:** Uses the browser's native `localStorage` to save user preferences, custom palettes, and the current Tartan code between sessions.

## 2. Codebase Tour

The repository is straightforward. All critical files are located at the root:

*   **`index.html`**: The entry point. It contains the UI markup, inline CSS styles, and structural elements (menus, buttons, input fields). If you need to add a UI element or change the CSS theme, start here.
*   **`Random_Tartan_Generator.js`**: The core application logic. This file handles:
    *   p5.js setup and rendering loops.
    *   Tartan mathematics and drawing algorithms.
    *   Event listeners for the UI.
    *   The `SRT_PALETTE` array holding the 137 official Scottish Register of Tartans shades.
    *   The bilingual dictionary (`TRANSLATIONS` object) for the UI.
*   **`p5.min.js`**: The minified p5.js library. **Do not modify this file.**
*   **`README.md` & `README.fr.md`**: Public user-facing documentation.
*   **`test.js`**: Unit tests of the pure functions, run with `node test.js` and on every pull request.
*   **`libraries/jszip.min.js`**: JSZip, loaded only when a ZIP is exported. Dependencies are served locally, never from a CDN.

## 3. Key Concepts to Understand

To effectively modify this codebase, you need to understand three main concepts:

### A. The p5.js Loop (`setup()` and `draw()`)
*   `setup()`: Runs once when the page loads. It initializes the canvas size, binds UI events, and sets up the initial state.
*   `draw()`: Normally an infinite loop in p5.js, but for performance reasons, we use `noLoop()` in `setup()`. The canvas is only redrawn when a specific action occurs (e.g., resizing, changing a color, generating a new pattern). The UI calls `redrawTartan()` directly: it weaves one repeat of the pattern at one pixel per thread into an offscreen canvas, then fills the main canvas with it as a scaled, repeating pattern.

### B. Vanilla DOM Manipulation
Since there is no frontend framework, UI interactions are handled via standard JavaScript: `document.getElementById()`, `addEventListener()`, and reading/writing `value` or `textContent`.

### C. Bilingual System
The UI text is handled dynamically via `data-i18n` attributes in the HTML. The JavaScript parses these attributes and replaces the text based on the selected language (`fr` or `en`) using the internal `TRANSLATIONS` dictionary.

## 4. Anatomy of an Action: Data Flow

**Scenario: The user clicks the "GENERATE" button.**
1.  **Event Trigger:** the click listener on `btn-generate`, set in `bindEvents()`, calls `handleGenerateClick()`.
2.  **Processing (`generateNewTartan`):** `readGenerationParams()` normalizes the settings and `createStripes()` builds the list of stripes (`{ code, hex, count }`).
3.  **State Update:** the previous pattern goes to `historyStack` (`pushToHistory()`) and `saveState()` writes to `localStorage`.
4.  **Rendering Trigger:** the function calls `redrawTartan()`.
5.  **Drawing (`redrawTartan`):** one repeat of the weave is written into `ImageData` at one pixel per thread (`fillTwillPixels`, or `fillTwillRelief` for the relief), then tiled with a canvas pattern. The cost depends on the sett, not on the screen size or the zoom. Do not go back to drawing thread by thread.

## 5. Local Development & Debugging

### How to Run the Project locally
There is **no compilation step** (no `npm install` or `npm run build`).

To run the project properly and avoid CORS (Cross-Origin Resource Sharing) issues when exporting images:
1.  Open a terminal in the project directory.
2.  Start a simple local HTTP server. If you have Python installed, run:
    ```bash
    python -m http.server 3000
    ```
    *(Alternatively, use `npx serve` or the VS Code Live Server extension).*
3.  Open your browser and navigate to `http://localhost:3000`.

### Running the tests
```bash
node test.js
```

### Debugging
If the application shows a blank screen or a button does not work:
1.  Open your browser's Developer Tools (Right-click > **Inspect** or press `F12`).
2.  Go to the **Console** tab.
3.  Look for red error messages. Since this is Vanilla JS, most issues will be standard `SyntaxError` or `TypeError` (e.g., trying to read a property of an undefined DOM element). The console will point you directly to the exact file and line number.

## 6. Where to Find What

| Feature | Main functions |
|---|---|
| Generation | `readGenerationParams`, `createStripes`, `recolorStripes` |
| Rendering | `redrawTartan`, `buildThreadColors`, `fillTwillPixels`, `fillTwillRelief` |
| View | `setZoom`, `zoomViewAt`, `panView`, `resetView`, `viewX` / `viewY` |
| Top bar menus (New pattern, Import, Save / share) | `setupMenus`, `closeMenus`, `revealInPanel`, `focusOpener`, `pendingImageMode` |
| Studio / Board modes | `syncModeSwitch`, `generatePatchwork`, `closePatchworkBoard` |
| Side panel tabs (Motif, Couleurs, Tissu) | `setupTabs`, `selectTab`, `currentTab`, `PANEL_TABS` |
| Saving and history | `saveState`, `loadState`, `pushToHistory`, `applyHistoryEntry` |
| Loading a whole pattern | `applyLoadedPattern` (shared link, text file, image) |
| Shared link | `encodeSharedPattern`, `decodeSharedPattern`, `openSharedLink` |
| Text import | `exportTXT`, `parseExportedText` |
| Mood board | `createPatchworkBatch`, `createCriteriaBatch`, `renderPatchworkBoard`, `mergePinnedTiles` |
| Weaving sheet | `buildWeavingSheetData`, `openWeavingSheet`, `renderSheetPiece`, `buildWarpPlan`, `pieceYarnWithPrefs`, `weavingPrefs` (localStorage `tartanWeavingPrefs`) |
| Product views | `setObjectView`, `OBJECT_VIEWS`, `buildPieceData`, `walkSequence`, `renderObjectPreview`, `updatePiecePanel`, `drawLoupe` |
| SRT bar | `currentSrtCode`, `showSrtInBar`, `applySrtBar`, `importSRT(keepShades)` |
| Readability | `findCloseNeighbors`, `VISION_MATRICES`, `installVisionFilters` |
| Photo estimate | `estimateTartan`, `prepareAxis`, `readAxis`, `segmentsToStripes` |
| Proposals and stars | `estimateProposals`, `blendProposals`, `setProposalStar`, `refineProposals` |
| Tartan from any image | `inventProposals`, `clusterColors`, `readImageLine`, `lineToRuns` |

## 7. Conventions

*   **Content-Security-Policy:** `index.html` allows scripts from the same origin only. No inline script, no `on...` attribute in the HTML, no CDN.
*   **Untrusted text:** imported codes, links and files never go through `innerHTML`. Build nodes with `createElement` and `textContent`, and validate the whole input before parsing it.
*   **Text in the interface:** every string exists in both `fr` and `en` in `TRANSLATIONS`.
*   **Unit tests:** `test.js` evaluates the script, and the evaluation stops at the first top-level call that needs a real page. A `const` or `let` used by a tested function must be declared near the top of the file, with the `RELIEF_*` constants.
*   **Saved data:** states in `localStorage` and exported files come from older versions too. New fields must be optional when they are read back.

Happy coding and thank you for your interest in improving the Random Tartan Generator!

---

<a id="version-française"></a>
# 🇫🇷 Guide du Développeur (Français)

Bienvenue sur le dépôt du projet **Random Tartan Generator** ! Ce document est destiné aux développeurs qui souhaitent comprendre l'architecture du code, forker le projet ou y contribuer. L'architecture a été volontairement pensée pour être simple et légère.

## 1. Architecture Globale

Ce projet est une **application web front-end 100% statique**. Il n'utilise pas de système de compilation moderne (comme Webpack, Vite, React, ou Rust/Tauri) et ne nécessite aucun serveur back-end ni base de données externe.

*   **HTML/CSS :** Gère la structure de l'interface et les styles (intégrés dans `index.html`).
*   **JavaScript (Vanilla) :** Gère les interactions avec le DOM, l'état de l'application et les événements utilisateur.
*   **p5.js :** La bibliothèque graphique principale utilisée pour générer et dessiner les motifs de Tartan sur un `<canvas>` HTML5.
*   **Persistance des données :** Utilise l'API native `localStorage` du navigateur pour sauvegarder les préférences de l'utilisateur, les palettes personnalisées et le code du Tartan en cours entre les sessions.

## 2. Visite Guidée du Code

Le dépôt est minimaliste. Tous les fichiers critiques sont à la racine :

*   **`index.html`** : Le point d'entrée. Il contient le balisage de l'interface, les styles CSS, et la structure des menus et boutons. Pour modifier l'UI ou le design global, commencez ici.
*   **`Random_Tartan_Generator.js`** : Le cœur logique de l'application. Ce fichier gère :
    *   L'initialisation et les boucles de rendu de p5.js.
    *   Les algorithmes mathématiques de génération du Tartan.
    *   Les écouteurs d'événements (event listeners) pour l'interface.
    *   Le tableau `SRT_PALETTE` contenant les 137 nuances officielles du Scottish Register of Tartans.
    *   Le dictionnaire bilingue (objet `TRANSLATIONS`) pour l'interface.
*   **`p5.min.js`** : La bibliothèque p5.js compressée. **Ne modifiez pas ce fichier.**
*   **`README.md` & `README.fr.md`** : La documentation publique destinée aux utilisateurs finaux.
*   **`test.js`** : Tests unitaires des fonctions pures, lancés avec `node test.js` et sur chaque pull request.
*   **`libraries/jszip.min.js`** : JSZip, chargé seulement à l'export ZIP. Les dépendances sont servies localement, jamais depuis un CDN.

## 3. Les Concepts Clés à Comprendre

Pour modifier ce code efficacement, trois concepts principaux sont à maîtriser :

### A. Le cycle de vie p5.js (`setup()` et `draw()`)
*   `setup()` : S'exécute une seule fois au chargement. Il initialise la taille de la toile, attache les événements à l'UI et configure l'état initial.
*   `draw()` : Habituellement une boucle infinie dans p5.js, mais pour des raisons de performances, nous utilisons `noLoop()` dans `setup()`. Le canevas n'est redessiné que lorsqu'une action spécifique se produit (redimensionnement, changement de couleur, génération). L'interface appelle directement `redrawTartan()` : cette fonction tisse une répétition du motif, à raison d'un pixel par fil, dans un canevas hors écran, puis remplit le canevas principal avec ce motif répété et mis à l'échelle.

### B. Manipulation du DOM (Vanilla JS)
En l'absence de framework, les interactions avec l'interface sont gérées en JavaScript standard : `document.getElementById()`, `addEventListener()`, et la lecture/écriture des propriétés `value` ou `textContent`.

### C. Système Bilingue
Le texte de l'interface est géré dynamiquement via des attributs `data-i18n` dans le HTML. Le JavaScript lit ces attributs et remplace le texte en fonction de la langue sélectionnée (`fr` ou `en`) en utilisant le dictionnaire interne `TRANSLATIONS`.

## 4. Flux de la Donnée : Anatomie d'une Action

**Scénario : L'utilisateur clique sur le bouton "GÉNÉRER".**
1.  **Déclencheur d'événement :** l'écouteur de `btn-generate`, posé dans `bindEvents()`, appelle `handleGenerateClick()`.
2.  **Traitement (`generateNewTartan`) :** `readGenerationParams()` normalise les réglages et `createStripes()` construit la liste des bandes (`{ code, hex, count }`).
3.  **Mise à jour de l'état :** le motif précédent passe dans `historyStack` (`pushToHistory()`) et `saveState()` écrit dans le `localStorage`.
4.  **Déclenchement du rendu :** la fonction appelle `redrawTartan()`.
5.  **Dessin (`redrawTartan`) :** un motif du tissage est écrit dans un `ImageData` à un pixel par fil (`fillTwillPixels`, ou `fillTwillRelief` pour le relief), puis répété avec un motif de canevas. Le coût dépend du sett, pas de la taille de l'écran ni du zoom. Ne pas revenir à un dessin fil par fil.

## 5. Développement Local et Débogage

### Comment lancer le projet en local
Il n'y a **aucune étape de compilation** (pas de `npm install` ni de `npm run build`).

Pour exécuter le projet correctement et éviter les erreurs CORS (Cross-Origin Resource Sharing) lors de l'exportation des images :
1.  Ouvrez un terminal dans le dossier du projet.
2.  Lancez un serveur HTTP local simple. Si Python est installé, tapez :
    ```bash
    python -m http.server 3000
    ```
    *(Vous pouvez aussi utiliser `npx serve` ou l'extension Live Server de VS Code).*
3.  Ouvrez votre navigateur à l'adresse `http://localhost:3000`.

### Lancer les tests
```bash
node test.js
```

### Débogage
Si l'application affiche un écran blanc ou si un bouton ne réagit pas :
1.  Ouvrez les Outils de Développement du navigateur (Clic droit > **Inspecter** ou touche `F12`).
2.  Allez dans l'onglet **Console**.
3.  Cherchez les messages d'erreur en rouge. S'agissant de JS Vanilla, il s'agira souvent d'erreurs standards de type `SyntaxError` ou `TypeError` (ex: tenter de lire une propriété d'un élément DOM inexistant). La console vous indiquera le fichier et le numéro de ligne exacts.

## 6. Où Trouver Quoi

| Fonction | Principales fonctions du code |
|---|---|
| Génération | `readGenerationParams`, `createStripes`, `recolorStripes` |
| Rendu | `redrawTartan`, `buildThreadColors`, `fillTwillPixels`, `fillTwillRelief` |
| Vue | `setZoom`, `zoomViewAt`, `panView`, `resetView`, `viewX` / `viewY` |
| Menus de la barre du haut (Nouveau motif, Importer, Enregistrer / partager) | `setupMenus`, `closeMenus`, `revealInPanel`, `focusOpener`, `pendingImageMode` |
| Modes Atelier / Planche | `syncModeSwitch`, `generatePatchwork`, `closePatchworkBoard` |
| Onglets du panneau (Motif, Couleurs, Tissu) | `setupTabs`, `selectTab`, `currentTab`, `PANEL_TABS` |
| Sauvegarde et historique | `saveState`, `loadState`, `pushToHistory`, `applyHistoryEntry` |
| Charger un motif complet | `applyLoadedPattern` (lien, fichier texte, image) |
| Lien partagé | `encodeSharedPattern`, `decodeSharedPattern`, `openSharedLink` |
| Import texte | `exportTXT`, `parseExportedText` |
| Mood board | `createPatchworkBatch`, `createCriteriaBatch`, `renderPatchworkBoard`, `mergePinnedTiles` |
| Fiche de tissage | `buildWeavingSheetData`, `openWeavingSheet`, `renderSheetPiece`, `buildWarpPlan`, `pieceYarnWithPrefs`, `weavingPrefs` (localStorage `tartanWeavingPrefs`) |
| Vues produit | `setObjectView`, `OBJECT_VIEWS`, `buildPieceData`, `walkSequence`, `renderObjectPreview`, `updatePiecePanel`, `drawLoupe` |
| Barre SRT | `currentSrtCode`, `showSrtInBar`, `applySrtBar`, `importSRT(keepShades)` |
| Lisibilité | `findCloseNeighbors`, `VISION_MATRICES`, `installVisionFilters` |
| Estimation depuis une photo | `estimateTartan`, `prepareAxis`, `readAxis`, `segmentsToStripes` |
| Propositions et étoiles | `estimateProposals`, `blendProposals`, `setProposalStar`, `refineProposals` |
| Tartan depuis une image quelconque | `inventProposals`, `clusterColors`, `readImageLine`, `lineToRuns` |

## 7. Conventions

*   **Content-Security-Policy :** `index.html` n'autorise que les scripts de la même origine. Pas de script en ligne, pas d'attribut `on...` dans le HTML, pas de CDN.
*   **Texte non fiable :** les codes, liens et fichiers importés ne passent jamais par `innerHTML`. Construisez les nœuds avec `createElement` et `textContent`, et validez l'entrée complète avant de l'analyser.
*   **Textes de l'interface :** chaque texte existe en `fr` et en `en` dans `TRANSLATIONS`.
*   **Tests unitaires :** `test.js` évalue le script, et l'évaluation s'arrête au premier appel de haut niveau qui demande une vraie page. Un `const` ou `let` utilisé par une fonction testée doit être déclaré en haut du fichier, avec les constantes `RELIEF_*`.
*   **Données enregistrées :** les états du `localStorage` et les fichiers exportés viennent aussi d'anciennes versions. Les nouveaux champs doivent rester optionnels à la relecture.

Bon code et merci pour votre intérêt à l'amélioration du Random Tartan Generator !