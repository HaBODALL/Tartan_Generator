# Sentinel Journal

## 2026-09-01 - DOM-based XSS via Dynamic InnerHTML Construction
**Vulnerability:** Unsanitized dynamic properties injected directly into `innerHTML` during list UI updates (`updateGeneratedListUI`).
**Learning:** Even when color codes come from pre-defined palettes or regex patterns, constructing DOM nodes using string interpolation with `innerHTML` opens potential DOM-based XSS vectors if object attributes are modified or extended.
**Prevention:** Always use safe DOM element creation (`document.createElement`), text nodes (`textContent`), and element properties (`style.backgroundColor`) instead of `innerHTML` with string interpolation.
