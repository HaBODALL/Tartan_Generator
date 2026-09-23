# Tartan Generator (p5.js)

[![Language: English](https://img.shields.io/badge/Language-English-blue.svg)](#) [![Français](https://img.shields.io/badge/Langue-Français-red.svg)](README.fr.md)

An interactive web-based tool built with [p5.js](https://p5js.org/) to design and generate authentic **Tartan motifs** using the official color shade table from the **Scottish Register of Tartans (SRT)**. Also available for web play and distribution on [Itch.io](https://itch.io/).

---

> **Note:** This project was partially vibe coded. Note that a previous version of the software is available on [itch.io](https://habod.itch.io/random-tartan-generator).
>
> *Based on an original Sketch from steven kay, 2011 (https://openprocessing.org/sketch/25876) - CC BY-SA 2.0*

---

## 📁 Repository Structure

The project repository includes the following files:

```
.
├── index.html                             # Main HTML entry point loading p5.js and sketch scripts
├── p5.min.js                              # p5.js core library (standalone minified build)
├── Random_Tartan_Generator.js   # Main p5.js sketch logic for generating Tartan patterns
├── sketch.properties                      # Sketch metadata and processing/p5 config properties
└── libraries/                             # Directory containing additional p5.js or helper libraries
```

---

## 🎨 Overview & Scottish Register of Tartans (SRT) Integration

Tartans are created through specific weaving patterns (sett) using alternating warp and weft thread counts. The **Scottish Register of Tartans (SRT)** defines official standard shade categories and color codes used in traditional Scottish clan and regional tartans:

* **Red (R)**
* **Light Blue (LB)** / **Dark Blue (DB)** / **Blue (B)**
* **Green (G)** / **Light Green (LG)** / **Dark Green (DG)**
* **Yellow (Y)**
* **Black (K)**
* **White (W)**
* **Grey (N)**
* **Orange (O)** / **Purple (P)** / **Brown (T)**

This tool translates traditional threadcount notation (e.g., `R/24 DB/8 Y/4 G/16...`) into visual twill weave patterns rendered directly on a web canvas.

---

## 🚀 Optimization & Feature Roadmap

Below are key recommendations and optimization avenues to improve performance, rendering accuracy, user experience, and deployment.

### 1. ⚡ Rendering & Performance Optimizations

* **Offscreen Buffer Caching (`p5.Graphics`)**:
  Instead of redrawing individual weave threads every frame in the main `draw()` loop, render the basic tartan unit cell (sett) into an offscreen `p5.Graphics` buffer. Then tile it across the main canvas or use it as a pattern fill.
* **Direct Pixel Manipulation (`pixels[]`)**:
  When generating high-resolution tartan patterns or applying a 2/2 twill weave texture, manipulate the `pixels` array directly (`loadPixels()` / `updatePixels()`) or use WebGL shaders (`p5.Shader`) for near-instant GPU-accelerated rendering.
* **Canvas Resizing & DPR Management**:
  Optimize canvas rendering for high-DPI (Retina) displays by scaling via `devicePixelRatio` or setting explicit pixel dimensions, preventing blurry exports.

### 2. 🧵 Tartan Generation & SRT Standards

* **Authentic 2/2 Twill Weave Pattern**:
  Implement true 2/2 twill weave simulation where warp (vertical) and weft (horizontal) threads cross over two and under two threads at a 45-degree diagonal shift, producing authentic woven texture.
* **Sett Syntax Parser**:
  Add a parser for standard SRT threadcount strings (e.g., `K/24 R/8 W/4 B/32`). This allows users to paste official tartan formulas from the Scottish Register of Tartans database and instantly visualize them.
* **Symmetrical & Asymmetrical Sett Logic**:
  Support both **symmetrical** tartans (where the pattern reflects at pivot threads, e.g. `...A-B-C-B-A...`) and **asymmetrical /'moving'** tartans (repeating sequentially `...A-B-C-A-B-C...`).
* **Color Count Preservation**:
  Enhance the "Keep Structure" feature so it preserves the exact number of unique colors from the previous structure, or introduce a new explicit constraint/control for the desired number of colors.

### 3. 🎛️ User Interface & Experience (UI/UX)

* **Interactive Controls**:
  Add HTML/p5 controls (sliders, color pickers, toggle switches) to easily adjust:
  * Thread width & density
  * Custom color palettes matching exact SRT Hex/RGB values
  * Symmetry toggles
  * Randomization seed control
* **Live Preset Selector**:
  Include pre-loaded historical tartans (e.g., Royal Stewart, Black Watch, Dress Gordon) as quick-start templates.

### 4. 💾 Export & Sharing Capabilities

* **Seamless Tile PNG Export**:
  Provide a one-click button to export a perfectly seamless repeating tile image for use in 3D texturing, graphic design, or fabric printing.
* **SVG Vector Export**:
  Integrate `p5.svg` or standalone SVG generation to export scalable vector files for professional textile design.
* **JSON Preset Import/Export**:
  Allow users to save their tartan designs and custom palettes to JSON files and reload them later.

### 5. 🎮 Itch.io Deployment & Web Integration

* **Responsive iFrame Scaling**:
  Ensure `index.html` uses CSS flexbox/grid and `windowResized()` handling to auto-fit any aspect ratio when embedded inside Itch.io's HTML5 iFrame player.
* **Touch & Mobile Support**:
  Add touch gesture controls (pinch-to-zoom, drag-to-pan) for mobile web visitors on Itch.io.

---

## 🛠️ Local Development & Running

1. Clone or download the repository files.
2. Open `index.html` in any modern web browser, or serve it using a local HTTP server (e.g. `npx serve`, VS Code Live Server, or `python -m http.server`).
3. View and interact with the Tartan generator.

---

## 📄 License

Distributed under the Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0) license.
