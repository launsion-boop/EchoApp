# Changelog

## 0.2.0 - 2026-05-09

- Use `echobraid.invoke('fs.save')` bridge instead of anchor `download` click — sandbox WCV blocked the previous approach.
- Declare `outputContract: [{ type: "fs.write", scopeRef: "app-sandbox" }]` in `handlers.json`; without it the host denies `fs.write` regardless of capability.
- Manifest capabilities corrected to canonical names (`clipboard`, `filesystem`).
- Add light / dark theme support — listens to `echobraid:theme-request` and switches `data-theme` attribute; light palette + dark default with `prefers-color-scheme` boot fallback.

## 0.1.0 - 2026-05-09

- Initial publish: compress, SVG conversion, crop, stitch.
