## 2025-09-01 - Form Control Accessibility in Pure HTML/JS Interfaces
**Learning:** In static HTML/JS web applications without UI component libraries, form controls (inputs, selects, textareas, checkboxes, buttons) often lack `for` attributes on labels and explicit `aria-label` or `aria-labelledby` properties, impairing screen reader usability.
**Action:** Explicitly add `for="[id]"` on `<label>` elements and `aria-label` / `aria-labelledby` on form inputs and action buttons in HTML files to ensure complete screen reader accessibility.
