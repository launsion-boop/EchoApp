# Changelog

## 0.3.32-test.20260512-skill-available-tools - 2026-05-12

- Publish the latest EchoOffice preset package with the available-tools skill update.
- Refresh the OTA artifact checksum for Desktop update verification.

## 0.2.11 - 2026-05-08

- Align the document tab strip with light and dark themes; active documents now use a bottom accent line instead of a large selected block.

## 0.2.10 - 2026-05-08

- Fix the dark-mode engine-installing surface so the top strip follows the dark background instead of the old light gradient.

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

## 0.1.4 - 2026-05-07

- Publish the latest preset EchoOffice package with OTA update metadata.

## 0.1.0 - 2026-04-30

- Publish EchoOffice to the EchoApp catalog.
- Include the current document shell, icon, protocol files, and EchoAgent document-editing skill.
- Target EchoBraid Desktop 2.0.0+ with the local ONLYOFFICE runtime bridge.
