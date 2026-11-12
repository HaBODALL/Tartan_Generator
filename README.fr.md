# Générateur de Tartan (p5.js)

[![Language: English](https://img.shields.io/badge/Language-English-blue.svg)](README.md) [![Français](https://img.shields.io/badge/Langue-Français-red.svg)](#)

Un outil web interactif conçu avec [p5.js](https://p5js.org/) pour créer et générer des motifs authentiques de **Tartan** en utilisant la table officielle des nuances de couleurs du **Scottish Register of Tartans (SRT)**. Également disponible et jouable en ligne sur [Itch.io](https://itch.io/).

---

> **Note:** Ce projet a été partiellement codé par "vibe coding" (programmation assistée par IA de manière intuitive). Notez qu'une version précédente du logiciel est disponible sur [itch.io](https://habod.itch.io/random-tartan-generator).
>
> *Basé sur un Sketch original de steven kay, 2011 (https://openprocessing.org/sketch/25876) - CC BY-SA 2.0*

---

## ✨ Fonctionnalités

**Créer**
* Génération aléatoire sous contraintes : nombre de bandes, largeur des bandes, sett, symétrique ou asymétrique, mode damier.
* Conservation des couleurs ou de la structure pendant la génération.
* Choix de 8 couleurs au plus parmi les 137 nuances SRT.
* Historique des 10 derniers motifs, et annulation.

**Reprendre un motif**
* Coller un code SRT (`R/72 B8 K12 ...`) ou charger un exemple.
* Rouvrir un fichier texte produit par l'export *Détails*, avec ses teintes exactes et ses réglages de rendu.
* Ouvrir un lien partagé.
* **Estimer un tartan depuis une photo.** Cadrez le tissu, comparez jusqu'à 10 lectures, donnez une étoile d'*or* à la bonne ou des étoiles d'*argent* à celles qui sont proches, et générez un intermédiaire à partir d'elles. L'image reste sur votre appareil. Les nombres de fils sont des proportions : une photo ne donne pas le nombre réel de fils. Cette fonction n'a pour l'instant été validée que sur des photos simulées.
* **Inventer un tartan depuis n'importe quelle image.** Dans la même fenêtre, les couleurs d'une image deviennent la palette, et ce qu'on croise en la traversant donne les bandes. Les étoiles et les intermédiaires fonctionnent de la même façon.

**Explorer**
* Mood board de 10 à 100 motifs, avec épingles et variantes autour d'une tuile.
* Mode par critères : une grille dont les colonnes et les lignes font varier chacune un réglage (couleurs, bandes, largeur max, sett, symétrie).
* Aperçu sur une écharpe, un coussin et un kilt, à l'échelle d'après la taille du fil.
* Lisibilité des couleurs : alerte sur les bandes voisines difficiles à distinguer, et simulation du daltonisme (à l'écran seulement).

**Rendu**
* Sergé 2/2, Z ou S, avec relief des fils et irrégularité de la laine.
* Zoom aux boutons, au curseur, à la molette (autour du pointeur), aux touches `+` et `-` ou au pincement.
* Déplacement du motif en le faisant glisser ou aux flèches ; un double-clic revient au début.

**Exporter et partager**
* PNG de la vue, SVG d'un motif complet raccordable à la taille réelle, détails en texte (codes SRT et Ink/Stitch), ZIP ou PNG du mood board.
* Fiche de tissage imprimable : ordre des fils et fil par couleur au m².
* Lien qui rouvre exactement le motif, sans aucun serveur.

**Clavier** : `Espace` ou `G` génèrent, `S` exporte tout, `P` exporte le PNG, `Ctrl+Z` annule, `+` et `-` zooment, les flèches déplacent, `Échap` ferme la planche ou la fenêtre.

---

## 📁 Structure du Dépôt

```
.
├── index.html                   # Page, CSS intégré et Content-Security-Policy
├── Random_Tartan_Generator.js   # Toute la logique de l'application
├── test.js                      # Tests unitaires (node test.js)
├── p5.min.js                    # Bibliothèque p5.js
├── libraries/                   # JSZip, servi localement
├── Colour_shades.pdf            # Table des nuances SRT
├── DEVELOPER_GUIDE.md           # Architecture et contribution
├── sketch.properties            # Métadonnées du sketch Processing
└── .github/workflows/           # Tests sur les pull requests, déploiement GitHub Pages
```

---

## 🎨 Scottish Register of Tartans (SRT)

Un tartan est défini par une séquence de fils, le sett, tissée à l'identique en chaîne et en trame. Le **Scottish Register of Tartans (SRT)** définit des catégories de nuances et des codes couleur standards :

* **Rouge (R)**
* **Bleu clair (LB)** / **Bleu foncé (DB)** / **Bleu (B)**
* **Vert (G)** / **Vert clair (LG)** / **Vert foncé (DG)**
* **Jaune (Y)**
* **Noir (K)**
* **Blanc (W)**
* **Gris (N)**
* **Orange (O)** / **Violet (P)** / **Marron (T)**

Dans un code, `/` marque les deux pivots d'un sett symétrique (`R/72 B8 K/12`), et `...` un sett asymétrique qui se répète (`...R20 G20...`).

---

## 🚀 Feuille de Route

* Essayer l'estimation sur de vraies photos et l'ajuster.
* Un outil de présentation simplifié pour les personnes qui veulent produire leur tartan.
* Animations et fonds en patchwork (en suspens).
* Export d'une tuile PNG raccordable et réglage de la graine aléatoire.

---

## 🛠️ Installation & Exécution Locale

1. Clonez ou téléchargez les fichiers du dépôt.
2. Ouvrez `index.html` dans un navigateur récent, ou servez le dossier avec un serveur HTTP local (par exemple `python -m http.server 3000` ou `npx serve`).
3. Lancez les tests avec `node test.js`. Il n'y a ni compilation ni installation.

---

## 📄 Licence

Distribué sous la licence Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0).
