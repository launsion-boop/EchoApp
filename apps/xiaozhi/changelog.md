# Changelog

## 0.9.8 - 2026-05-07

- Apply the EchoApp shared Design Hub design system across fonts, spacing, radius, controls, themes, and SVG icon handling.
- Add `translate="no"` and runtime SVG replacement for legacy emoji glyphs.
- Tighten the shared hero-title override so repackaged apps cannot keep oversized source headings after merge/rebase.
- Hide app-local language and theme toggle buttons; locale and color mode are controlled by the platform while both modes remain supported.
- Preserve sent user chat bubbles before showing the waiting indicator, with duplicate cleanup when native rendering catches up.
- Flatten home toolbar/list alignment so search rows and cards align with page titles without an extra surface.
- Delay generated chat fallback bubbles until native message rendering settles, preventing duplicate sent messages.
- Remove empty assistant waiting placeholders so the shared three-dot typing state is the only visible waiting bubble.
- Align Xiaozhi home list and empty-state tracks with the title/search row across card counts.

## 0.9.7 - 2026-05-07

- Apply the EchoApp shared Design Hub design system across fonts, spacing, radius, controls, themes, and SVG icon handling.
- Add `translate="no"` and runtime SVG replacement for legacy emoji glyphs.
- Tighten the shared hero-title override so repackaged apps cannot keep oversized source headings after merge/rebase.
- Hide app-local language and theme toggle buttons; locale and color mode are controlled by the platform while both modes remain supported.
- Preserve sent user chat bubbles before showing the waiting indicator, with duplicate cleanup when native rendering catches up.
- Flatten home toolbar/list alignment so search rows and cards align with page titles without an extra surface.

## 0.9.6 - 2026-05-07

- Apply the EchoApp shared Design Hub design system across fonts, spacing, radius, controls, themes, and SVG icon handling.
- Add `translate="no"` and runtime SVG replacement for legacy emoji glyphs.
- Tighten the shared hero-title override so repackaged apps cannot keep oversized source headings after merge/rebase.

## 0.9.5 - 2026-05-07

- Apply the EchoApp shared Design Hub design system across fonts, spacing, radius, controls, themes, and SVG icon handling.
- Add `translate="no"` and runtime SVG replacement for legacy emoji glyphs.

## 0.8.7 - 2026-05-07

- Repackage xiaozhi app from latest source.

## 0.8.6 - 2026-04-30

- Initial EchoApp catalog publish for the xiaozhi app.
- Manage xiaozhi.me agents, devices, voices, chat history, and MCP endpoints.
- Built-in conversational assistant via `echoagent_invoke`.
