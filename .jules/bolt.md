## 2024-05-14 - Bypass p5.js overhead in tight rendering loops
**Learning:** In this p5.js project, performance in tight rendering loops is optimized by bypassing p5.js wrappers (`fill()`, `rect()`) and directly using native HTML5 Canvas API calls (`drawingContext.fillStyle`, `drawingContext.fillRect()`).
**Action:** When drawing thousands of rectangles in a nested loop (like weaving a pattern), replace p5's `fill()` and `rect()` with native `drawingContext.fillStyle` and `drawingContext.fillRect()`. This reduces the rendering overhead significantly, often by 3-4x.

## YYYY-MM-DD - Massive performance improvement in canvas weave drawing
**Learning:** In standard generative applications, rendering repeated weave patterns cell-by-cell is extremely slow because it invokes fill() and rect() for every thread. We can drastically improve this by leveraging how overlapping layers work.
**Action:** Draw the underlying continuous threads (the warp) as single vertical bands rather than pixel-by-pixel, grouping adjacent identical colored threads into a single band. Then, selectively draw the horizontal over-threads (weft) only where they are visible in the weave (in pairs), reducing standard p5.js drawing calls by ~75% and reducing main thread blocking.
