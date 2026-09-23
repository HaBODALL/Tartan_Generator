## 2025-09-01 - Form Control Accessibility in Pure HTML/JS Interfaces
**Learning:** In static HTML/JS web applications without UI component libraries, form controls (inputs, selects, textareas, checkboxes, buttons) often lack `for` attributes on labels and explicit `aria-label` or `aria-labelledby` properties, impairing screen reader usability.
**Action:** Explicitly add `for="[id]"` on `<label>` elements and `aria-label` / `aria-labelledby` on form inputs and action buttons in HTML files to ensure complete screen reader accessibility.
## 2023-10-27 - Accessible Custom UI Components
**Learning:** When building custom interactive elements (like color picker chips or custom delete buttons) using `div` tags instead of semantic HTML, screen readers and keyboard users cannot interact with them properly by default.
**Action:** Always add `role="button"`, `tabindex="0"`, descriptive `aria-label`s, and `onkeydown` event listeners (handling Enter and Space keys) to custom interactive components to ensure full accessibility compliance.
