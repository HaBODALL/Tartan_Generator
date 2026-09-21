## 2024-05-14 - Bypass p5.js overhead in tight rendering loops
**Learning:** In this p5.js project, performance in tight rendering loops is optimized by bypassing p5.js wrappers (`fill()`, `rect()`) and directly using native HTML5 Canvas API calls (`drawingContext.fillStyle`, `drawingContext.fillRect()`).
**Action:** When drawing thousands of rectangles in a nested loop (like weaving a pattern), replace p5's `fill()` and `rect()` with native `drawingContext.fillStyle` and `drawingContext.fillRect()`. This reduces the rendering overhead significantly, often by 3-4x.

## YYYY-MM-DD - Massive performance improvement in canvas weave drawing
**Learning:** In standard generative applications, rendering repeated weave patterns cell-by-cell is extremely slow because it invokes fill() and rect() for every thread. We can drastically improve this by leveraging how overlapping layers work.
**Action:** Draw the underlying continuous threads (the warp) as single vertical bands rather than pixel-by-pixel, grouping adjacent identical colored threads into a single band. Then, selectively draw the horizontal over-threads (weft) only where they are visible in the weave (in pairs), reducing standard p5.js drawing calls by ~75% and reducing main thread blocking.

## 2025-05-18 - Bypassing p5.js wrappers for extreme performance
**Learning:** Functions like fill() and rect() in p5.js carry significant overhead when used repeatedly in tight rendering loops (like generating thousands of thread weaves). We found that rendering 100,000 shapes directly using drawingContext.fillStyle and drawingContext.fillRect is more than 2x-5x faster than going through the p5.js abstractions.
**Action:** When working on performance-critical visual generation code like rendering weave threads, replace p5.js primitives with native canvas operations (drawingContext) to significantly unblock the main thread and provide a smoother user experience.
## 2024-05-30 - p5.js fill() overhead in render loops
**Learning:** In p5.js, calling `fill(hexString)` is relatively expensive because it requires parsing the hex string and updating the underlying Canvas 2D context state, even if the color hasn't changed. In dense rendering loops (like row-by-row weft drawing), this redundant state update becomes a noticeable bottleneck.
**Action:** When rendering rows or shapes that often share the same color consecutively, manually track the `currentColor` and wrap the `fill()` call in an `if (newColor !== currentColor)` condition. This prevents unnecessary canvas context updates and parsing, significantly improving render speed.
## 2025-02-12 - Using Native Canvas API for Tight Rendering Loops
**Learning:** In tight rendering loops (like row-by-row and cell-by-cell rendering), standard p5.js wrappers such as `fill()` and `rect()` incur a relatively high overhead due to state management.
**Action:** Bypass p5.js wrappers by directly using native HTML5 Canvas API calls like `drawingContext.fillStyle` and `drawingContext.fillRect()` to perform these operations significantly faster.

## 2025-02-14 - Batching canvas drawing calls for huge performance boosts
**Learning:** In tight rendering loops using the HTML5 Canvas API, repeatedly calling `fillRect()` is significantly slower than grouping many `rect()` operations within a single `beginPath()` and `fill()` block. In the Tartan generator's weaving loop, grouping the weft rectangles per row reduced drawing time for that phase by roughly 45%.
**Action:** When drawing many identical small shapes of the same color (like threads in a weave, or a grid of pixels), always batch them into a single path and `fill()` call rather than issuing hundreds of thousands of independent `fillRect()` operations.
## 2024-05-20 - [Multi-Row Weft Color Batching]
**Learning:** [In HTML5 Canvas, path state changes (`beginPath`, `fillStyle`, `fill`) are incredibly expensive compared to adding simple geometry (`rect`). In iterative row-by-row rendering like weavers/grids, contiguous bands of the same color can be grouped across multiple rows to reduce state changes by 90%+. Furthermore, Node.js `canvas` benchmarking drastically differs from actual browser performance; always test canvas performance inside an actual browser.]
**Action:** [When drawing large grids or iterative lines with repeating colors, avoid changing `fillStyle` or calling `beginPath()/fill()` every row. Instead, group geometry by color blocks. Always use Puppeteer to benchmark Canvas drawing optimizations, not Node.js directly.]

## 2026-09-21 - Caching DOM element lookups in render loops
**Learning:** Querying the DOM via `document.getElementById()` and `document.querySelector()` inside frequent rendering loops (like `redrawTartan()`) adds unnecessary lookup overhead and garbage collection pressure in JavaScript.
**Action:** Always cache references to static DOM elements in global variables during initialization (e.g., inside `setup()`). Then, reference those cached elements directly in your render or update loops to improve execution speed and reduce CPU usage.
## 2025-10-24 - Skipping invisible drawing operations in generative grids
**Learning:** When rendering layered visual grids (like weaving a pattern where over-threads cross under-threads), drawing an over-thread element is visually redundant if its color perfectly matches the under-thread element directly beneath it.
**Action:** Always check if the foreground element's state (e.g. color) matches the background element's state. If they match, skip issuing the canvas `rect()` drawing call entirely. By testing individual threads within a pair before rendering, we drastically reduce the number of rectangles drawn, resulting in measurably faster rendering times.
