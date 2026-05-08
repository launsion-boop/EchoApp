## 4.0.20 - 2026-05-08

- Fix the dark-mode create/join team segmented control so inactive tabs no longer render with a white background.

## 4.0.19 - 2026-05-08

- Regenerate the packaged manifest entries so the dark-mode repair package passes install-pipeline size and hash validation.

## 4.0.18 - 2026-05-08

- Restore complete dark-mode rendering for OAR setup and workspace screens, and remove internal light-mode hardcoding.

# Changelog

## 4.0.17 - 2026-05-08

- Normalize the app display name, summary, and description so catalog metadata describes product function instead of internal version labels or visual style.

## 4.0.16 - 2026-05-07

- Apply the EchoApp shared Design Hub design system across fonts, spacing, radius, controls, themes, and SVG icon handling.
- Add `translate="no"` and runtime SVG replacement for legacy emoji glyphs.
- Tighten the shared hero-title override so repackaged apps cannot keep oversized source headings after merge/rebase.
- Hide app-local language and theme toggle buttons; locale and color mode are controlled by the platform while both modes remain supported.
- Preserve sent user chat bubbles before showing the waiting indicator, with duplicate cleanup when native rendering catches up.
- Flatten home toolbar/list alignment so search rows and cards align with page titles without an extra surface.
- Delay generated chat fallback bubbles until native message rendering settles, preventing duplicate sent messages.
- Remove empty assistant waiting placeholders so the shared three-dot typing state is the only visible waiting bubble.
- Align Xiaozhi home list and empty-state tracks with the title/search row across card counts.

## 4.0.15 - 2026-05-07

- Apply the EchoApp shared Design Hub design system across fonts, spacing, radius, controls, themes, and SVG icon handling.
- Add `translate="no"` and runtime SVG replacement for legacy emoji glyphs.
- Tighten the shared hero-title override so repackaged apps cannot keep oversized source headings after merge/rebase.
- Hide app-local language and theme toggle buttons; locale and color mode are controlled by the platform while both modes remain supported.
- Preserve sent user chat bubbles before showing the waiting indicator, with duplicate cleanup when native rendering catches up.
- Flatten home toolbar/list alignment so search rows and cards align with page titles without an extra surface.

## 4.0.14 - 2026-05-07

- Apply the EchoApp shared Design Hub design system across fonts, spacing, radius, controls, themes, and SVG icon handling.
- Add `translate="no"` and runtime SVG replacement for legacy emoji glyphs.
- Tighten the shared hero-title override so repackaged apps cannot keep oversized source headings after merge/rebase.

## 4.0.13 - 2026-05-07

- Apply the EchoApp shared Design Hub design system across fonts, spacing, radius, controls, themes, and SVG icon handling.
- Add `translate="no"` and runtime SVG replacement for legacy emoji glyphs.

## 4.0.8 - 2026-05-06

- Publish the latest preset OAR package.

## 4.0.6 - 2026-04-30

- Replace OAR with the v4 cloud team workspace package.
- Add Agent collaboration, domain seed, cloud sync, and declarative MCP export metadata.

## 1.1.1 - 2026-04-28

- Smoke-test release for EchoBraid GitHub subscribed updates.

## 1.1.0 - 2026-04-27

- Initial EchoApp update-source entry for the OAR app.
