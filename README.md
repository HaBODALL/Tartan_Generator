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
* Generate random tartans from constraints: number of stripes, stripe width, sett, symmetric or asymmetric, check mode.
* Keep the colors or the structure while generating.
* Choose up to 8 colors from the 137 SRT shades.
* History of the last 10 patterns, and undo.

**Bring a pattern in**
* Paste an SRT threadcount (`R/72 B8 K12 ...`) or load one of the examples.
* Reopen a text file written by the *Details* export, with its exact shades and rendering settings.
* Open a shared link.
* **Estimate a tartan from a photo.** Frame the cloth, compare up to 10 readings, give a *gold* star to the right one or *silver* stars to those that are close, and generate an intermediate from them. The image stays on your device. Thread counts are proportions, since a photo does not tell the real number of threads. This feature has only been validated on simulated photos so far.

**Explore**
* Mood board of 10 to 100 patterns, with pins and variants around a tile.
* Criteria mode: a grid whose columns and rows each vary one setting (colors, stripes, maximum width, sett, symmetry).
* Preview on a scarf, a cushion and a kilt, to scale from the thread size.
* Color readability: warning on neighboring stripes that are hard to tell apart, and color blindness simulation (on screen only).

**Render**
* 2/2 twill, Z or S, with thread relief and yarn irregularity.
* Zoom with the buttons, the slider, the mouse wheel (around the pointer), the `+` and `-` keys or a pinch.
* Move the pattern by dragging or with the arrow keys; a double click goes back to the start.

**Export and share**
* PNG of the current view, SVG of one seamless repeat at real size, text details (SRT and Ink/Stitch codes), ZIP or PNG of the mood board.
* Printable weaving sheet: thread order and yarn per color per square meter.
* Link that reopens exactly the pattern, with no server involved.

**Keyboard**: `Space` or `G` generate, `S` export all, `P` export PNG, `Ctrl+Z` undo, `+` and `-` zoom, arrows move, `Esc` closes the board or window.

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
