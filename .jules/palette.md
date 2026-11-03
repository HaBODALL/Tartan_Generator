## 2025-09-01 - Form Control Accessibility in Pure HTML/JS Interfaces
**Learning:** In static HTML/JS web applications without UI component libraries, form controls (inputs, selects, textareas, checkboxes, buttons) often lack `for` attributes on labels and explicit `aria-label` or `aria-labelledby` properties, impairing screen reader usability.
**Action:** Explicitly add `for="[id]"` on `<label>` elements and `aria-label` / `aria-labelledby` on form inputs and action buttons in HTML files to ensure complete screen reader accessibility.
## 2023-10-27 - Accessible Custom UI Components
**Learning:** When building custom interactive elements (like color picker chips or custom delete buttons) using `div` tags instead of semantic HTML, screen readers and keyboard users cannot interact with them properly by default.
**Action:** Always add `role="button"`, `tabindex="0"`, descriptive `aria-label`s, and `onkeydown` event listeners (handling Enter and Space keys) to custom interactive components to ensure full accessibility compliance.
## 2024-05-13 - [Focus indicators for Custom UI Components]
**Learning:** Adding custom keyboard events and ARIA roles (e.g. `role="button"` and `tabindex="0"`) on `div`-based UI components is excellent for a11y, but often developers intentionally suppress default browser outlines via CSS (like `outline: none`). This leaves keyboard-only users without any visible focus state.
**Action:** Always ensure that removing default `outline` styles is paired with explicit, visible `:focus-visible` styling—especially targeting common tags and interactive attributes like `[role="button"]` and `[tabindex]:not([tabindex="-1"])`—so keyboard users maintain spatial awareness on the page.
## 2026-11-01 - Clipboard API in Playwright Tests
**Learning:** When writing temporary Playwright tests to verify clipboard interactions (like a "click to copy" button), the default browser context may deny clipboard access.
**Action:** When writing temporary Playwright tests that interact with clipboard APIs, ensure the browser context is explicitly initialized with clipboard permissions (e.g., `browser.new_context(permissions=['clipboard-write', 'clipboard-read'])`) to prevent access denial.
## 2026-11-02 - Toast Notifications Accessibility
**Learning:** Custom UI toast notifications (e.g. for "Copied!" actions) fail to notify screen readers if they lack `aria-live` attributes. Adding `aria-label` attributes matching exactly the button text causes redundancies and overwrites translated text content.
**Action:** Always append `aria-live="polite"` or `aria-live="assertive"` on custom toast/notification containers in the DOM. Do not add redundant `aria-label` attributes to buttons containing valid text.
## 2026-11-03 - Redundant aria-label on i18n translated elements
**Learning:** Static `aria-label` attributes on elements with dynamic `data-i18n` text must be avoided. The static attribute, if not localized, overrides the localized inner text for screen readers (e.g. static French text reads out to English users).
**Action:** Before adding an `aria-label`, check if the element has dynamically translated text via JS. If it does, rely on the translated inner text or ensure the `aria-label` is also dynamically translated using something like `data-i18n-aria`.
