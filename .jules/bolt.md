## YYYY-MM-DD - Massive performance improvement in canvas weave drawing
**Learning:** In standard generative applications, rendering repeated weave patterns cell-by-cell is extremely slow because it invokes fill() and rect() for every thread. We can drastically improve this by leveraging how overlapping layers work.
**Action:** Draw the underlying continuous threads (the warp) as single vertical bands rather than pixel-by-pixel, grouping adjacent identical colored threads into a single band. Then, selectively draw the horizontal over-threads (weft) only where they are visible in the weave (in pairs), reducing standard p5.js drawing calls by ~75% and reducing main thread blocking.

## 2025-05-18 - Bypassing p5.js wrappers for extreme performance
**Learning:** Functions like fill() and rect() in p5.js carry significant overhead when used repeatedly in tight rendering loops (like generating thousands of thread weaves). We found that rendering 100,000 shapes directly using drawingContext.fillStyle and drawingContext.fillRect is more than 2x-5x faster than going through the p5.js abstractions.
**Action:** When working on performance-critical visual generation code like rendering weave threads, replace p5.js primitives with native canvas operations (drawingContext) to significantly unblock the main thread and provide a smoother user experience.
