# Générateur de Tartan (p5.js)

[![Language: English](https://img.shields.io/badge/Language-English-blue.svg)](README.md) [![Français](https://img.shields.io/badge/Langue-Français-red.svg)](#)

Un outil web interactif conçu avec [p5.js](https://p5js.org/) pour créer et générer des motifs authentiques de **Tartan** en utilisant la table officielle des nuances de couleurs du **Scottish Register of Tartans (SRT)**. Également disponible et jouable en ligne sur [Itch.io](https://itch.io/).

---

> **Note:** Ce projet a été partiellement codé par "vibe coding" (programmation assistée par IA de manière intuitive). Notez qu'une version précédente du logiciel est disponible sur [itch.io](https://habod.itch.io/random-tartan-generator).
>
> *Basé sur un Sketch original de steven kay, 2011 (https://openprocessing.org/sketch/25876) - CC BY-SA 2.0*

---

## 📁 Structure du Dépôt

Le dépôt contient les fichiers suivants :

```
.
├── index.html                             # Point d'entrée HTML chargeant p5.js et le sketch
├── p5.min.js                              # Bibliothèque p5.js principale (build minifié autonome)
├── Random_Tartan_Generator.js   # Logique p5.js principale pour la génération de Tartans
├── sketch.properties                      # Métadonnées du sketch et configuration Processing/p5
└── libraries/                             # Dossier contenant des bibliothèques p5.js ou utilitaires
```

---

## 🎨 Présentation & Intégration du Scottish Register of Tartans (SRT)

Les tartans sont créés grâce à un motif de tissage spécifique (*sett*) combinant des fils de chaîne (verticaux) et de trame (horizontaux). Le **Scottish Register of Tartans (SRT)** définit les catégories de couleurs et codes officiels utilisés dans les tartans traditionnels écossais :

* **Rouge (R - Red)**
* **Bleu Clair (LB)** / **Bleu Foncé (DB)** / **Bleu (B)**
* **Vert (G - Green)** / **Vert Clair (LG)** / **Vert Foncé (DG)**
* **Jaune (Y - Yellow)**
* **Noir (K - Black)**
* **Blanc (W - White)**
* **Gris (N - Grey)**
* **Orange (O)** / **Violet (P - Purple)** / **Brun (T - Brown)**

Cet outil traduit la notation traditionnelle du compte de fils (ex: `R/24 DB/8 Y/4 G/16...`) en un motif de tissage sergé rendu directement sur un canvas web interactif.

---

## 🚀 Feuille de Route d'Optimisation & Améliorations

Voici une analyse détaillée des pistes d'optimisation et des fonctionnalités recommandées pour améliorer les performances, l'ergonomie, la fidélité visuelle et la distribution.

### 1. ⚡ Optimisations de Rendu & Performances

* **Mise en Cache par Tampon Hors-Écran (`p5.Graphics`)** :
  Au lieu de redessiner chaque fil du motif à chaque image dans la boucle `draw()`, générez la cellule élémentaire du tartan (*sett*) dans un tampon `p5.Graphics` hors-écran, puis répétez-la en mosaïque sur le canvas principal.
* **Manipulation Directe des Pixels (`pixels[]`)** :
  Pour générer des tartans haute résolution ou simuler la texture du tressage sergé 2/2, manipulez directement le tableau `pixels` (`loadPixels()` / `updatePixels()`) ou utilisez un shader WebGL (`p5.Shader`) pour un rendu ultra-rapide accéléré par GPU.
* **Gestion du Redimensionnement & Écran Retina (DPR)** :
  Ajustez la résolution du canvas selon `devicePixelRatio` pour éviter les rendus flous sur écrans haute densité tout en préservant le débit d'images (*FPS*).

### 2. 🧵 Génération du Tartan & Normes SRT

* **Simulation Authentique du Tissage Sergé 2/2 (Twill Weave)** :
  Implémentez le motif de tissage sergé 2/2 où les fils de chaîne et de trame se croisent selon un décalage diagonal à 45° (passant au-dessus de 2 fils puis en-dessous de 2 fils).
* **Analyseur de Syntaxe de Compte de Fils (*Sett Parser*)** :
  Ajoutez un outil d'analyse (*parser*) pour interpréter la notation textuelle SRT standard (ex: `K/24 R/8 W/4 B/32`). Cela permettra de copier-coller des formules officielles du registre écossais pour les visualiser instantanément.
* **Gestion des Motifs Symétriques et Asymétriques** :
  Prenez en charge les motifs **symétriques** (où le motif s'inverse aux fils pivots, ex: `...A-B-C-B-A...`) et **asymétriques** (répétition séquentielle `...A-B-C-A-B-C...`).
* **Préservation du Nombre de Couleurs** :
  Améliorez l'option "Conserver Structure" afin de conserver le même nombre de couleurs différentes (appartenant à la structure), ou ajoutez une contrainte explicite pour le nombre de couleurs.

### 3. 🎛️ Interface Utilisateur & Ergonomie (UI/UX)

* **Contrôles Interactifs** :
  Ajoutez des éléments de contrôle HTML/p5 (curseurs, sélecteurs de couleurs, interrupteurs) pour ajuster :
  * La largeur et la densité des fils
  * Les palettes de couleurs personnalisées conformes aux codes Hex/RGB du SRT
  * La bascule symétrie / asymétrie
  * La graine de génération aléatoire (*seed*)
* **Bibliothèque de Modèles Pré-chargés** :
  Proposez une sélection de tartans historiques célèbres (ex: Royal Stewart, Black Watch, Dress Gordon) comme modèles de démarrage rapide.

### 4. 💾 Fonctions d'Exportation & Partage

* **Exportation PNG Répétable Sans Couture (Seamless Tile)** :
  Ajoutez un bouton pour exporter une image PNG parfaitement répétable (texture sans couture) exploitable en modélisation 3D, graphisme ou impression textile.
* **Exportation Vectorielle SVG** :
  Intégrez `p5.svg` pour permettre l'exportation au format SVG vectoriel haute précision.
* **Sauvegarde & Chargement JSON** :
  Permettez aux utilisateurs de sauvegarder leurs créations et palettes sous forme de fichiers JSON pour les recharger ultérieurement.

### 5. 🎮 Intégration & Déploiement sur Itch.io

* **Adaptation Responsive aux iFrames** :
  Assurez-vous que `index.html` utilise un centrage CSS et gère l'événement `windowResized()` pour s'adapter automatiquement à la taille du lecteur iFrame HTML5 d'Itch.io.
* **Support Tactile pour Mobiles** :
  Ajoutez le support des gestes tactiles (pinch-to-zoom, pan) pour les utilisateurs consultant la page Itch.io sur mobile ou tablette.

---

## 🛠️ Installation & Exécution Locale

1. Clonez ou téléchargez les fichiers du dépôt.
2. Ouvrez `index.html` dans un navigateur web moderne, ou lancez un serveur HTTP local (ex: `npx serve`, VS Code Live Server ou `python -m http.server`).
3. Visualisez et interagissez avec le générateur de Tartan.

---

## 📄 Licence

Distribué sous la licence Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0).
