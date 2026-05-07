# Changelog

## 2.0.5 - 2026-05-07

- Apply the EchoApp shared Design Hub design system across fonts, spacing, radius, controls, themes, and SVG icon handling.
- Add `translate="no"` and runtime SVG replacement for legacy emoji glyphs.

## 2.0.0 - 2026-05-06

- Complete UI redesign: replaced cyberpunk/neon HUD aesthetic with macOS-native clean design following UXD design system tokens.
- Dual theme support: dark mode and light mode with smooth transitions and localStorage persistence; auto-detects `prefers-color-scheme`.
- Responsive layout with 3 breakpoints: compact (<800px single column), regular (800-1199px two columns), wide (>=1200px three columns).
- CSS custom properties mapped from UXD tokens: 8pt spacing grid, SF Pro font scale, macOS shadow scale, OKLCH-aware color palette.
- Theme-aware ECharts: constellation force-graph, treemap, and timeline auto-adapt colors on theme toggle.
- Header with theme toggle button (sun/moon icons) and app branding.
- Cards with subtle glassmorphism (backdrop-filter), rounded corners (10px radius), and hover micro-interactions.
- KPI tiles with animated count-up, status indicators, and accessible focus states.
- Pulse feed with timestamp badges, smooth scroll, and theme-matched styling.
- New app icon: dark gradient base with frosted-glass panel, macOS traffic lights, and cyan-to-blue pulse waveform with glow; replaces the generic concentric-circle wireframe.
- All original bridge/demo functionality preserved; no breaking API changes.

## 1.2.0 - 2026-04-30

- AI detail stage 2×2 grid replaces install/skill/memory/retrieval counts with EchoAgent usage stats: 会话总数 (incl. last-hour delta), Token 用量 (in/out), LLM 调用 (avg latency), 检索次数 (success/failure split).
- Adds `formatTokens` and `formatDuration` helpers for compact K/M and ms/s/m display.
- Demo fallback now mirrors the new fields so the panel remains coherent when bridges are unavailable.
- Requires EchoBraid Desktop ≥ 2.0.7 which exposes `console:snapshot.usage` + `overview.{sessionCount,totalTokensIn,totalTokensOut,totalLlmCalls,totalToolCalls}` from `~/Library/Application Support/EchoBraid/echoagent/experiments/*.jsonl`.

## 1.1.2 - 2026-04-30

- First public release of Echo Console as a standalone EchoApp.
- Dark sci-fi HUD layout fits a single desktop viewport with no scrolling.
- 5 KPI tiles (AI / Schedules / Memory L3·L2 / Skills / Core files) toggle the left stage panel.
- Right rail keeps the topic matrix, timeline and pulse feed docked.
- ECharts force-graph constellation, treemap and timeline auto-resize via ResizeObserver.
- Auto-shrinking AI tile handles long model identifiers without breaking the layout.
