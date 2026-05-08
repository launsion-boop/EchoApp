# Changelog

## 0.2.9 - 2026-05-08

- Normalize the app display name, summary, and description so catalog metadata describes product function instead of internal version labels or visual style.

## 0.2.8 - 2026-05-07

- Apply the EchoApp shared Design Hub design system across fonts, spacing, radius, controls, themes, and SVG icon handling.
- Add `translate="no"` and runtime SVG replacement for legacy emoji glyphs.
- Tighten the shared hero-title override so repackaged apps cannot keep oversized source headings after merge/rebase.
- Hide app-local language and theme toggle buttons; locale and color mode are controlled by the platform while both modes remain supported.
- Preserve sent user chat bubbles before showing the waiting indicator, with duplicate cleanup when native rendering catches up.
- Flatten home toolbar/list alignment so search rows and cards align with page titles without an extra surface.
- Delay generated chat fallback bubbles until native message rendering settles, preventing duplicate sent messages.
- Remove empty assistant waiting placeholders so the shared three-dot typing state is the only visible waiting bubble.
- Align Xiaozhi home list and empty-state tracks with the title/search row across card counts.

## 0.2.7 - 2026-05-07

- Apply the EchoApp shared Design Hub design system across fonts, spacing, radius, controls, themes, and SVG icon handling.
- Add `translate="no"` and runtime SVG replacement for legacy emoji glyphs.
- Tighten the shared hero-title override so repackaged apps cannot keep oversized source headings after merge/rebase.
- Hide app-local language and theme toggle buttons; locale and color mode are controlled by the platform while both modes remain supported.
- Preserve sent user chat bubbles before showing the waiting indicator, with duplicate cleanup when native rendering catches up.
- Flatten home toolbar/list alignment so search rows and cards align with page titles without an extra surface.

## 0.2.6 - 2026-05-07

- Apply the EchoApp shared Design Hub design system across fonts, spacing, radius, controls, themes, and SVG icon handling.
- Add `translate="no"` and runtime SVG replacement for legacy emoji glyphs.
- Tighten the shared hero-title override so repackaged apps cannot keep oversized source headings after merge/rebase.

## 0.2.5 - 2026-05-07

- Apply the EchoApp shared Design Hub design system across fonts, spacing, radius, controls, themes, and SVG icon handling.
- Add `translate="no"` and runtime SVG replacement for legacy emoji glyphs.

## 0.1.65 - 2026-05-07

- Bump EchoREC after publishing the latest preset package.

## 0.1.64 - 2026-05-06

- Replace the package with the latest local preset build while keeping version 0.1.64.
- Replace the package with the local preset build that fixes the scrolling issue.
- Publish the latest preset EchoREC package.

## 0.1.63 - 2026-04-29

- Publish the latest EchoREC v2 package with EchoREC Agent support.
- Add the `mcp` capability required by the new package.
- Migrate the package id from legacy `echorec` to V2 official id `app.local.echorec`.

## 0.1.28 - 2026-04-28

- Initial publish via echoapp-update channel.
