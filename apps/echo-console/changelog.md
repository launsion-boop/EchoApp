# Changelog

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
