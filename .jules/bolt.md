## YYYY-MM-DD - Massive performance improvement in canvas weave drawing
**Learning:** In standard generative applications, rendering repeated weave patterns cell-by-cell is extremely slow because it invokes fill() and rect() for every thread. We can drastically improve this by leveraging how overlapping layers work.
**Action:** Draw the underlying continuous threads (the warp) as single vertical bands rather than pixel-by-pixel, grouping adjacent identical colored threads into a single band. Then, selectively draw the horizontal over-threads (weft) only where they are visible in the weave (in pairs), reducing standard p5.js drawing calls by ~75% and reducing main thread blocking.

## 2024-05-30 - p5.js fill() overhead in render loops
**Learning:** In p5.js, calling `fill(hexString)` is relatively expensive because it requires parsing the hex string and updating the underlying Canvas 2D context state, even if the color hasn't changed. In dense rendering loops (like row-by-row weft drawing), this redundant state update becomes a noticeable bottleneck.
**Action:** When rendering rows or shapes that often share the same color consecutively, manually track the `currentColor` and wrap the `fill()` call in an `if (newColor !== currentColor)` condition. This prevents unnecessary canvas context updates and parsing, significantly improving render speed.
