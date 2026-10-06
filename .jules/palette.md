## 2025-09-01 - Form Control Accessibility in Pure HTML/JS Interfaces
**Learning:** In static HTML/JS web applications without UI component libraries, form controls (inputs, selects, textareas, checkboxes, buttons) often lack `for` attributes on labels and explicit `aria-label` or `aria-labelledby` properties, impairing screen reader usability.
**Action:** Explicitly add `for="[id]"` on `<label>` elements and `aria-label` / `aria-labelledby` on form inputs and action buttons in HTML files to ensure complete screen reader accessibility.
## 2023-10-27 - Accessible Custom UI Components
**Learning:** When building custom interactive elements (like color picker chips or custom delete buttons) using `div` tags instead of semantic HTML, screen readers and keyboard users cannot interact with them properly by default.
**Action:** Always add `role="button"`, `tabindex="0"`, descriptive `aria-label`s, and `onkeydown` event listeners (handling Enter and Space keys) to custom interactive components to ensure full accessibility compliance.
## 2024-05-13 - [Focus indicators for Custom UI Components]
**Learning:** Adding custom keyboard events and ARIA roles (e.g. `role="button"` and `tabindex="0"`) on `div`-based UI components is excellent for a11y, but often developers intentionally suppress default browser outlines via CSS (like `outline: none`). This leaves keyboard-only users without any visible focus state.
**Action:** Always ensure that removing default `outline` styles is paired with explicit, visible `:focus-visible` styling—especially targeting common tags and interactive attributes like `[role="button"]` and `[tabindex]:not([tabindex="-1"])`—so keyboard users maintain spatial awareness on the page.
