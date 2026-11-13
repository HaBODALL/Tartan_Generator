# Tartan Generator (p5.js)

[![Language: English](https://img.shields.io/badge/Language-English-blue.svg)](#) [![Français](https://img.shields.io/badge/Langue-Français-red.svg)](README.fr.md)

An interactive web-based tool built with [p5.js](https://p5js.org/) to design and generate authentic **Tartan motifs** using the official color shade table from the **Scottish Register of Tartans (SRT)**. Also available for web play and distribution on [Itch.io](https://itch.io/).

---

> **Note:** This project was partially vibe coded and that an older version of the software is available on [itch.io](https://habod.itch.io/random-tartan-generator).
>
> *Based on an original Sketch from steven kay, 2011 (https://openprocessing.org/sketch/25876) - CC BY-SA 2.0*

---

## ✨ Features

**Create**
* Generate random tartans from constraints: number of stripes, stripe width (raising the minimum past the maximum raises the maximum, and the other way round), threads per repeat, symmetric or asymmetric, check mode (every stripe the same width, drawn between the two limits).
* Keep the colors or the structure while generating.
* Choose up to 8 colors from the 137 SRT shades.
* History of the last 50 patterns in a strip under the pattern, and undo.

**Bring a pattern in** (*Import* menu in the top bar; *New pattern* creates one)
* Type or paste an SRT threadcount (`R/72 B8 K12 ...`) in the bar under the pattern, which also shows the code of the current pattern: `Enter` applies, `Esc` puts the code back. Colors already there keep their shade. Or load one of the examples.
* Reopen a text file written by the *Details* export, with its exact shades and rendering settings.
* Open a shared link.
* **Read the tartan in an image** (photo, scan or drawing). Frame the cloth, compare up to 10 readings, give a *gold* star to the right one or *silver* stars to those that are close, and generate an intermediate from them. The image stays on your device. Thread counts are proportions, since a photo does not tell the real number of threads. This feature has only been validated on simulated photos so far.
* **Invent a tartan from any image.** In the same window, the colors of a picture become the palette, and what a line across it meets gives the stripes. Stars and intermediates work the same way.

**Explore** (*Board* mode, next to *Studio* in the top bar)
* Mood board of 10 to 100 patterns, with pins and variants around a tile.
* Criteria mode: a grid whose columns and rows each vary one setting (colors, stripes, maximum width, sett, symmetry).
* **Product views** on the pattern: Scarf (30 × 180 cm, loose 3 cm or twisted 10 cm fringes), Yardage (70 cm wide) and Sample (30 × 30 cm), to scale from the density; sizes can be changed. Beside the piece: warp ends and weft picks, repeats across the width, what each selvedge cuts, the pattern centred or starting at the selvedge, yarn per colour in metres (warp and weft, fringes included, without loom waste), and a magnifier on the real twill. The settings stay usable meanwhile.
* Color readability: warning on neighboring stripes that are hard to tell apart, and color blindness simulation (on screen only).

**Render**
* Density in threads per cm (Wool 9, Merino 12, Cotton 14, or any other); the size of one thread in mm follows.
* 2/2 twill, Z or S, with thread relief and yarn irregularity.
* Zoom with the buttons on the pattern, the slider, the mouse wheel (around the pointer), the `+` and `-` keys or a pinch.
* Move the pattern by dragging or with the arrow keys; a double click or the ⌖ button goes back to the start.

**Save and share** (*Save / share* menu in the top bar)
* PNG of the current view, SVG of one seamless repeat at real size, text details (SRT and Ink/Stitch codes), ZIP or PNG of the mood board.
* Printable weaving sheet: thread order and yarn per color per square meter.
* Link that reopens exactly the pattern, with no server involved.

**Keyboard**: `Space` or `G` generate, `S` export all, `P` export PNG, `Ctrl+Z` undo, `+` and `-` zoom, arrows move, `Esc` closes a menu, the board or a window. In a menu, the arrow keys move between choices.

---

## 📁 Repository Structure

```
.
├── index.html                   # Page, inline CSS and Content-Security-Policy
├── Random_Tartan_Generator.js   # All the application logic
├── test.js                      # Unit tests (node test.js)
├── p5.min.js                    # p5.js core library
├── libraries/                   # JSZip, served locally
├── Colour_shades.pdf            # SRT color shade table
├── DEVELOPER_GUIDE.md           # Architecture and how to contribute
├── sketch.properties            # Processing sketch metadata
└── .github/workflows/           # Tests on pull requests, deployment to GitHub Pages
```

---

## 🎨 Scottish Register of Tartans (SRT)

Tartans are defined by a thread sequence, the sett, woven identically in warp and weft. The **Scottish Register of Tartans (SRT)** defines standard shade categories and color codes:

* **Red (R)**
* **Light Blue (LB)** / **Dark Blue (DB)** / **Blue (B)**
* **Green (G)** / **Light Green (LG)** / **Dark Green (DG)**
* **Yellow (Y)**
* **Black (K)**
* **White (W)**
* **Grey (N)**
* **Orange (O)** / **Purple (P)** / **Brown (T)**

In a threadcount, `/` marks the two pivots of a symmetric sett (`R/72 B8 K/12`), and `...` marks a repeating asymmetric sett (`...R20 G20...`).

---

## 🚀 Roadmap

* Try the photo estimate on real photos and adjust it.
* A simplified presentation tool for people who want to produce their own tartan.
* Animations and patchwork backgrounds (on hold).
* Seamless PNG tile export and a control for the random seed.

---

## 🛠️ Local Development & Running

1. Clone or download the repository files.
2. Open `index.html` in a modern web browser, or serve the folder with a local HTTP server (for example `python -m http.server 3000` or `npx serve`).
3. Run the tests with `node test.js`. There is no build step and nothing to install.

---

## 📄 License

Distributed under the Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0) license.
