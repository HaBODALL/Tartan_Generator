# Sentinel Journal

## 2026-09-01 - DOM-based XSS via Dynamic InnerHTML Construction
**Vulnerability:** Unsanitized dynamic properties injected directly into `innerHTML` during list UI updates (`updateGeneratedListUI`).
**Learning:** Even when color codes come from pre-defined palettes or regex patterns, constructing DOM nodes using string interpolation with `innerHTML` opens potential DOM-based XSS vectors if object attributes are modified or extended.
**Prevention:** Always use safe DOM element creation (`document.createElement`), text nodes (`textContent`), and element properties (`style.backgroundColor`) instead of `innerHTML` with string interpolation.

## 2026-12-05 - DoS Risk via Regex Evaluation on Unbounded Input
**Vulnerability:** The SRT import input field lacked length constraints. Pasting extremely large strings could cause the underlying regex pattern matching (`regex.exec`) to block the main thread, leading to a Denial of Service (DoS) in the browser.
**Learning:** Even simple regex patterns can suffer from performance degradation when applied to massive inputs. Client-side input fields must have length boundaries to prevent user-supplied data from causing unexpected UI freezes.
**Prevention:** Always add a reasonable `maxlength` attribute on text `<input>` elements that feed into parsing logic or regex evaluations.

## 2026-12-05 - Inadequate Input Validation for Parsers
**Vulnerability:** The SRT text parser in `importSRT` relied solely on extracting matches (`regex.exec`) from the input string without enforcing a strict overall format. Maliciously crafted or corrupted payloads containing unexpected characters could bypass validation and behave unpredictably in the parser.
**Learning:** Extracting matching substrings from an input without first validating the input's entire structure leaves the application vulnerable to edge cases or logic bypasses.
**Prevention:** Always validate the entire input string against an expected format (e.g., using a strict regex like `/^[A-Z0-9\s\.\/]+$/`) before attempting to parse or extract its contents.

## 2026-11-04 - Missing Subresource Integrity (SRI) on External CDN Scripts
**Vulnerability:** Loading third-party scripts from CDNs without SRI checks (`integrity` attribute) allows potential supply-chain attacks if the CDN is compromised and serves a modified script.
**Learning:** Security defense-in-depth requires assuming that external dependencies and hosting platforms might be breached. Without SRI, any alteration to the remote script will be executed directly in the context of our application.
**Prevention:** Always include `integrity` and `crossorigin="anonymous"` attributes for external scripts loaded from CDNs to ensure only the expected codebase runs.

## 2026-11-04 - Loading Third-Party Scripts from External CDNs
**Vulnerability:** Relying on external CDNs (like cdnjs) for third-party scripts introduces a supply-chain risk. Even with Subresource Integrity (SRI), the application becomes dependent on the availability and security of a third-party server, and SRI doesn't protect against the CDN tracking users.
**Learning:** For a static standalone web application, self-hosting all dependencies removes the dependency on external network requests, avoids CDN tracking, and ensures the application can function completely offline and remains secure.
**Prevention:** Download and serve all third-party dependencies (like JSZip) locally from the project repository (e.g., from a `libraries/` directory) rather than loading them via `<script src="https://...">`.
