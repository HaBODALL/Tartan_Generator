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
* Génération aléatoire sous contraintes : nombre de bandes, largeur des bandes (monter le minimum au-delà du maximum monte le maximum, et inversement), fils par motif, symétrique ou asymétrique, mode damier (toutes les bandes de la même largeur, tirée entre les deux limites).
* Conservation des couleurs ou de la structure pendant la génération.
* Choix de 8 couleurs au plus parmi les 137 nuances SRT.
* Historique des 50 derniers motifs en bande sous le motif, et annulation.

**Reprendre un motif** (menu *Importer* de la barre du haut ; *Nouveau motif* en crée un)
* Taper ou coller un code SRT (`R/72 B8 K12 ...`) dans la barre sous le motif, qui affiche aussi le code du motif courant : `Entrée` valide, `Échap` remet le code. Les couleurs déjà présentes gardent leur nuance. Ou charger un exemple.
* Rouvrir un fichier texte produit par l'export *Détails*, avec ses teintes exactes et ses réglages de rendu.
* Ouvrir un lien partagé.
* **Retrouver le tartan d'une image** (photo, scan ou dessin). Cadrez le tissu, comparez jusqu'à 10 lectures, donnez une étoile d'*or* à la bonne ou des étoiles d'*argent* à celles qui sont proches, et générez un intermédiaire à partir d'elles. L'image reste sur votre appareil. Les nombres de fils sont des proportions : une photo ne donne pas le nombre réel de fils. Cette fonction n'a pour l'instant été validée que sur des photos simulées.
* **Inventer un tartan depuis n'importe quelle image.** Dans la même fenêtre, les couleurs d'une image deviennent la palette, et ce qu'on croise en la traversant donne les bandes. Les étoiles et les intermédiaires fonctionnent de la même façon.

**Explorer** (mode *Planche*, à côté d'*Atelier* dans la barre du haut)
* Mood board de 10 à 100 motifs, avec épingles et variantes autour d'une tuile.
* Mode par critères : une grille dont les colonnes et les lignes font varier chacune un réglage (couleurs, bandes, largeur max, sett, symétrie).
* **Vues produit** sur le motif : Écharpe (30 × 180 cm, franges de 3 cm libres ou 10 cm torsadées), Métrage (70 cm de large) et Échantillon (30 × 30 cm), à l'échelle d'après la densité ; les dimensions se changent. À côté de la pièce : fils de chaîne et duites, motifs dans la largeur, ce que coupe chaque lisière, motif centré ou depuis la lisière, fil par couleur en mètres (chaîne et trame, franges comprises, sans la perte au métier), et une loupe sur le vrai sergé. Les réglages restent utilisables pendant ce temps.
* Lisibilité des couleurs : alerte sur les bandes voisines difficiles à distinguer, et simulation du daltonisme (à l'écran seulement).

**Rendu**
* Densité en fils par cm (Laine 9, Mérinos 12, Coton 14, ou une autre) ; la taille d'un fil en mm s'en déduit.
* Sergé 2/2, Z ou S, avec relief des fils et irrégularité de la laine.
* Zoom aux boutons posés sur le motif, au curseur, à la molette (autour du pointeur), aux touches `+` et `-` ou au pincement.
* Déplacement du motif en le faisant glisser ou aux flèches ; un double-clic ou le bouton ⌖ revient au début.

**Enregistrer et partager** (menu *Enregistrer / partager* de la barre du haut)
* PNG de la vue, SVG d'un motif complet raccordable à la taille réelle, détails en texte (codes SRT et Ink/Stitch), ZIP ou PNG du mood board.
* Fiche de tissage imprimable : ordre des fils et fil par couleur au m².
* Lien qui rouvre exactement le motif, sans aucun serveur.

**Clavier** : `Espace` ou `G` génèrent, `S` exporte tout, `P` exporte le PNG, `Ctrl+Z` annule, `+` et `-` zooment, les flèches déplacent, `Échap` ferme un menu, la planche ou la fenêtre. Dans un menu, les flèches passent d'un choix à l'autre.

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
