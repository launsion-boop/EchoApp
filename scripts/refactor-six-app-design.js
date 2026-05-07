#!/usr/bin/env node

const { execFileSync } = require('node:child_process');
const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const STAMP = '2026-05-07T03:15:00Z';

const APPS = [
  { slug: 'xiaozhi', version: '0.9.7', zip: true, cssFiles: ['app.css'], htmlFiles: ['index.html', 'login.html', 'assistant.html'] },
  { slug: 'echorec', version: '0.2.7', zip: true, htmlFiles: ['index.html'] },
  { slug: 'oar', version: '4.0.15', zip: true, cssFiles: ['code/app.css', 'code/agent-client-panel.css', 'code/agent-client-panel-custom.css'], htmlFiles: ['index.html'] },
  { slug: 'echooffice', version: '0.2.7', zip: true, cssFiles: ['code/app.css'], htmlFiles: ['index.html'] },
  { slug: 'echo-console', version: '2.0.7', zip: true, htmlFiles: ['index.html'] }
];

const APP_META = {
  xiaozhi: {
    color: '#6366f1',
    iconSvg: "<g fill='none' stroke='currentColor' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'><path d='M20 14.5a3 3 0 0 1-3 3H9.5L4 20.5V6.5a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v8Z'/></g>",
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#6366f1"/><path d="M18 18h28a8 8 0 0 1 8 8v12a8 8 0 0 1-8 8H32l-10 7v-7h-4a8 8 0 0 1-8-8V26a8 8 0 0 1 8-8Z" fill="none" stroke="#fff" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M31 25l2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5Z" fill="#fff"/><path d="M43 22l1 2.5 2.5 1-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1 1-2.5Z" fill="#fff" opacity=".75"/></svg>'
  },
  echorec: {
    color: '#ef4444',
    iconSvg: "<g fill='none' stroke='currentColor' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'><rect x='9' y='3' width='6' height='12' rx='3' fill='currentColor' stroke='none'/><path d='M5 11a7 7 0 0 0 14 0M12 18v3M8 21h8'/></g>",
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#ef4444"/><rect x="24" y="13" width="16" height="28" rx="8" fill="#fff"/><path d="M16 32a16 16 0 0 0 32 0M32 48v6M24 54h16" fill="none" stroke="#fff" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M48 19a20 20 0 0 1 0 26" fill="none" stroke="#fecaca" stroke-width="3.2" stroke-linecap="round"/></svg>'
  },
  oar: {
    color: '#2563eb',
    iconSvg: "<g fill='none' stroke='currentColor' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='12' r='8.2'/><circle cx='12' cy='12' r='4.6'/><circle cx='12' cy='12' r='1.5' fill='currentColor' stroke='none'/><path d='M12 2.8v3M12 18.2v3M2.8 12h3M18.2 12h3'/></g>",
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#2563eb"/><circle cx="32" cy="32" r="20" fill="none" stroke="#fff" stroke-width="4.2"/><circle cx="32" cy="32" r="11" fill="none" stroke="#fff" stroke-width="3.8"/><circle cx="32" cy="32" r="4" fill="#fff"/><path d="M32 8v8M32 48v8M8 32h8M48 32h8" fill="none" stroke="#fff" stroke-width="4.2" stroke-linecap="round"/></svg>'
  },
  echooffice: {
    color: '#d45b35',
    iconSvg: "<g fill='none' stroke='currentColor' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'><path d='M6.5 3.8h8.2l3.8 3.8v12.6h-12a2 2 0 0 1-2-2V5.8a2 2 0 0 1 2-2Z'/><path d='M14.5 4v4h4M8 11h7M8 14h7M8 17h3.5M13.5 16h3.2M13.5 18.5h3.2'/></g>",
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#d45b35"/><path d="M20 11h20l8 8v34a4 4 0 0 1-4 4H20a4 4 0 0 1-4-4V15a4 4 0 0 1 4-4Z" fill="#fff"/><path d="M40 11v9h8" fill="#f8d8ca"/><path d="M24 29h16M24 36h16M24 43h8M36 42h7M36 48h7" fill="none" stroke="#b74324" stroke-width="3.2" stroke-linecap="round"/></svg>'
  },
  'echo-console': {
    color: '#2563eb',
    iconSvg: "<g fill='none' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round'><rect x='3.5' y='4.5' width='17' height='15' rx='3' stroke-width='1.6'/><circle cx='6.2' cy='6.5' r='.35' fill='currentColor' stroke='none'/><circle cx='8.1' cy='6.5' r='.35' fill='currentColor' stroke='none'/><circle cx='10' cy='6.5' r='.35' fill='currentColor' stroke='none'/><path d='M5.5 14h2.3l1-2.8 1.1 4.8 1.1-7 1.2 6 1.3-3.2 1.5 2.4 1.7-2.1 1.8 2.9' stroke-width='1.15'/></g>",
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#2563eb"/><rect x="13" y="16" width="38" height="32" rx="6" fill="none" stroke="#fff" stroke-width="4"/><path d="M13 25h38M22 34l5 5-5 5M32 44h10" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  }
};

const STYLE = `
/* Echo UI Design System v0.1.4 | Design Hub module design:module:echoapp */
:root {
  color-scheme: light dark;
  --echo-font-sans: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "PingFang SC", "Microsoft YaHei", "Segoe UI", system-ui, sans-serif;
  --echo-font-mono: "SF Mono", "Geist Mono", ui-monospace, monospace;
  --echo-font-micro: 10px;
  --echo-font-caption: 11px;
  --echo-font-callout: 12px;
  --echo-font-body: 13px;
  --echo-font-subheading: 15px;
  --echo-font-heading: 17px;
  --echo-font-title: 22px;
  --echo-space-xs: 4px;
  --echo-space-sm: 8px;
  --echo-space-md: 12px;
  --echo-space-lg: 16px;
  --echo-space-xl: 24px;
  --echo-space-2xl: 32px;
  --echo-space-3xl: 48px;
  --echo-radius-xs: 4px;
  --echo-radius-sm: 6px;
  --echo-radius-md: 8px;
  --echo-radius-lg: 12px;
  --echo-radius-xl: 16px;
  --echo-radius-pill: 999px;
  --echo-control-sm: 28px;
  --echo-control-md: 32px;
  --echo-control-lg: 40px;
  --echo-toolbar: 44px;
  --echo-titlebar: 52px;
  --echo-statusbar: 28px;
  --echo-sidebar: 220px;
  --echo-aux-panel: 340px;
  --echo-bg: #f7f8fb;
  --echo-bg-raised: #ffffff;
  --echo-bg-panel: #f1f3f7;
  --echo-text: #171a21;
  --echo-text-secondary: #5f6673;
  --echo-text-muted: #8a919f;
  --echo-border: #dde2ea;
  --echo-border-strong: #c8d0dc;
  --echo-accent: #6366f1;
  --echo-accent-hover: #818cf8;
  --echo-accent-soft: #eef2ff;
  --echo-accent-ring: #c7d2fe;
  --echo-success: #34c759;
  --echo-warning: #ff9f0a;
  --echo-danger: #ff453a;
  --echo-info: #0a84ff;
  --echo-shadow-sm: 0 1px 2px rgba(16, 24, 40, .06);
  --echo-shadow-md: 0 8px 24px rgba(16, 24, 40, .10);
  --echo-shadow-lg: 0 18px 48px rgba(16, 24, 40, .16);
  --echo-ease: cubic-bezier(.2, 0, 0, 1);
  --hub-font-family: var(--echo-font-sans);
  --hub-font-mono: var(--echo-font-mono);
  --hub-font-title: var(--echo-font-title);
  --hub-font-heading: var(--echo-font-heading);
  --hub-font-subheading: var(--echo-font-subheading);
  --hub-font-body: var(--echo-font-body);
  --hub-font-caption: var(--echo-font-caption);
  --hub-space-xs: var(--echo-space-xs);
  --hub-space-sm: var(--echo-space-sm);
  --hub-space-md: var(--echo-space-md);
  --hub-space-lg: var(--echo-space-lg);
  --hub-space-xl: var(--echo-space-xl);
  --hub-space-2xl: var(--echo-space-xl);
  --hub-space-3xl: var(--echo-space-2xl);
  --hub-radius-xs: var(--echo-radius-xs);
  --hub-radius-sm: var(--echo-radius-sm);
  --hub-radius-md: var(--echo-radius-md);
  --hub-radius-lg: var(--echo-radius-lg);
  --hub-radius-xl: var(--echo-radius-xl);
  --hub-accent: var(--echo-accent);
  --hub-accent-hover: var(--echo-accent-hover);
  --hub-accent-muted: var(--echo-accent-soft);
  --hub-accent-ring: var(--echo-accent-ring);
  --background: 220 33% 98%;
  --foreground: 222 24% 11%;
  --card: 0 0% 100%;
  --card-foreground: 222 24% 11%;
  --popover: 0 0% 100%;
  --popover-foreground: 222 24% 11%;
  --primary: 239 84% 67%;
  --primary-foreground: 0 0% 100%;
  --secondary: 220 23% 95%;
  --secondary-foreground: 222 24% 11%;
  --muted: 220 23% 95%;
  --muted-foreground: 220 8% 42%;
  --accent: 239 84% 96%;
  --accent-foreground: 239 58% 48%;
  --border: 216 26% 89%;
  --input: 216 26% 89%;

  --ring: 239 84% 67%;
  --bg: var(--echo-bg);
  --fg: var(--echo-text);
  --card-bg: var(--echo-bg-raised);
  --border-c: var(--echo-border);
  --accent-c: var(--echo-accent);
  --accent-soft: var(--echo-accent-soft);
  --danger: var(--echo-danger);
  --warn: var(--echo-warning);
  --ink: var(--echo-text);
  --muted: var(--echo-text-secondary);
  --line: var(--echo-border);
  --panel-solid: var(--echo-bg-raised);
  --paper: var(--echo-bg);
  --bg-canvas: #0c0c0e;
  --bg-panel: #141416;
  --bg-elevated: #1a1a1f;
  --bg-highlight: #222228;
  --txt-primary: #f2f4f8;
  --txt-secondary: #a8aeb8;
  --txt-tertiary: #6e747e;
  --accent-weak: rgba(99, 102, 241, .18);
  --accent-strong: rgba(99, 102, 241, .30);
  --ok: var(--echo-success);
  --err: var(--echo-danger);
}

/* Echo UI Platform Mode Contract v0.1.0 */
.theme-toggle,
.mode-toggle,
[data-theme-toggle],
[aria-label="切换主题"],
[aria-label="切换明暗主题"],
[aria-label="切换亮色/暗色模式"],
[aria-label="Toggle theme"],
[aria-label="Toggle light/dark theme"],
[title="切换主题"],
[title="切换明暗主题"],
[title="切换亮色/暗色模式"],
[title="Toggle theme"],
[title="Toggle light/dark theme"] {
  display: none !important;
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --echo-bg: #0c0c0e;
    --echo-bg-raised: #141416;
    --echo-bg-panel: #1a1a1f;
    --echo-text: #f2f4f8;
    --echo-text-secondary: #a8aeb8;
    --echo-text-muted: #6e747e;
    --echo-border: #2a2d34;
    --echo-border-strong: #3a3f49;
    --echo-accent-soft: #26275f;
    --background: 240 8% 5%;
    --foreground: 220 30% 96%;
    --card: 240 7% 8%;
    --card-foreground: 220 30% 96%;
    --secondary: 228 8% 12%;
    --secondary-foreground: 220 30% 96%;
    --muted: 228 8% 12%;
    --muted-foreground: 220 8% 68%;
    --accent: 238 43% 26%;
    --accent-foreground: 236 91% 92%;
    --border: 225 11% 18%;
    --input: 225 11% 18%;
  }
}

:root[data-theme="dark"], body[data-theme="dark"], .dark {
  --echo-bg: #0c0c0e;
  --echo-bg-raised: #141416;
  --echo-bg-panel: #1a1a1f;
  --echo-text: #f2f4f8;
  --echo-text-secondary: #a8aeb8;
  --echo-text-muted: #6e747e;
  --echo-border: #2a2d34;
  --echo-border-strong: #3a3f49;
  --echo-accent-soft: #26275f;
}

html, body {
  font-family: var(--echo-font-sans) !important;
  font-size: var(--echo-font-body);
  line-height: 1.45;
  letter-spacing: 0 !important;
}

button, input, textarea, select {
  font-family: var(--echo-font-sans) !important;
  letter-spacing: 0 !important;
}

button,
.btn,
.home-primary,
.home-secondary,
.sidebar-upload,
.sidebar-settings,
.dispatch-btn,
.toggle-btn,
.row-btn,
.card-btn,
.voiceprint-add button,
.voiceprint-intro button,
.vp-record,
.vp-delete,
.vp-submit,
.vp-redo,
.engine-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: var(--echo-control-md);
  border-radius: var(--echo-radius-md);
  font-size: var(--echo-font-body);
  font-weight: 600;
  line-height: 1;
  text-align: center;
  transition: background 120ms var(--echo-ease), border-color 120ms var(--echo-ease), color 120ms var(--echo-ease), transform 120ms var(--echo-ease), box-shadow 120ms var(--echo-ease);
}

button {
  max-width: 100%;
}

.agent-card-actions button,
.detail-actions button:not(.btn),
.row-actions button:not(.btn),
td button:not(.btn),
.dev-mcp-actions button:not(.btn),
.dev-mcp-form-actions button:not(.btn),
.card-actions button:not(.btn),
.toolbar-actions button:not(.btn) {
  appearance: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: var(--echo-control-sm);
  min-height: var(--echo-control-sm);
  padding: 0 var(--echo-space-md);
  border: 1px solid var(--echo-border);
  border-radius: var(--echo-radius-sm);
  background: var(--echo-bg-raised);
  color: var(--echo-text-secondary);
  box-shadow: none;
  font-size: var(--echo-font-callout);
  font-weight: 600;
  line-height: 1;
  white-space: nowrap;
}

.agent-card-actions button:hover,
.detail-actions button:not(.btn):hover,
.row-actions button:not(.btn):hover,
td button:not(.btn):hover,
.dev-mcp-actions button:not(.btn):hover,
.dev-mcp-form-actions button:not(.btn):hover,
.card-actions button:not(.btn):hover,
.toolbar-actions button:not(.btn):hover {
  background: var(--echo-bg-panel);
  border-color: var(--echo-border-strong);
  color: var(--echo-text);
}

.agent-card-actions {
  gap: var(--echo-space-sm) !important;
}

.agent-card-actions button {
  flex: 0 0 auto;
}

.panel,
.card,
.agent-card,
.stat-card,
.metric-card,
.empty,
.surface,
dialog,
.dialog-card,
.modal-card,
.dropzone {
  border-radius: min(var(--echo-radius-xl), 16px) !important;
  box-shadow: var(--echo-shadow-sm) !important;
}

.chip,
.badge,
.pill,
.tag,
.topic,
.skill-chip {
  border-radius: var(--echo-radius-pill) !important;
  font-size: var(--echo-font-caption) !important;
}

.dropzone h1,
.hero h1,
.empty h1,
.home-title,
.home-hero h1,
.engine-gate h1 {
  font-size: clamp(var(--echo-font-heading), 2.2vw, 28px) !important;
  line-height: 1.18 !important;
  letter-spacing: 0 !important;
}

.panel h1,
.panel h2,
.card h1,
.card h2,
.section-title,
.panel-title {
  letter-spacing: 0 !important;
}

canvas + *,
.chart,
[id^="chart-"] {
  color: var(--echo-text);
}

.home-primary,
.home-secondary,
.sidebar-upload,
.sidebar-settings,
.voiceprint-note button,
.voiceprint-add button,
.voiceprint-intro button,
.voiceprint-flow-actions button,
.vp-record,
.vp-delete,
.vp-submit,
.vp-redo,
.speaker-rename-cancel,
.speaker-rename-save {
  height: var(--echo-control-lg) !important;
  min-height: var(--echo-control-lg) !important;
  padding: 0 var(--echo-space-lg) !important;
  border-radius: var(--echo-radius-md) !important;
  font-size: var(--echo-font-body) !important;
  font-weight: 600 !important;
  letter-spacing: 0 !important;
}

.home-record-button {
  width: 128px !important;
  height: 128px !important;
  border-radius: var(--echo-radius-xl) !important;
  box-shadow: var(--echo-shadow-md) !important;
}

.home-record-button .record-label,
.home-record-button span {
  font-size: var(--echo-font-subheading) !important;
  font-weight: 600 !important;
}

.debug-fab {
  width: 32px !important;
  height: 32px !important;
  min-height: 32px !important;
  border-radius: var(--echo-radius-md) !important;
  font-size: 0 !important;
}

.debug-fab::before {
  content: "";
  width: 16px;
  height: 16px;
  background: currentColor;
  -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 8v4'/%3E%3Cpath d='M12 16h.01'/%3E%3Ccircle cx='12' cy='12' r='9'/%3E%3C/svg%3E") center / contain no-repeat;
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 8v4'/%3E%3Cpath d='M12 16h.01'/%3E%3Ccircle cx='12' cy='12' r='9'/%3E%3C/svg%3E") center / contain no-repeat;
}

button:hover:not(:disabled),
.btn:hover:not(:disabled),
.home-primary:hover,
.home-secondary:hover,
.sidebar-upload:hover,
.sidebar-settings:hover {
  transform: translateY(-1px);
}

button:focus-visible,
.btn:focus-visible,
[role="button"]:focus-visible,
[tabindex]:focus-visible {
  outline: 2px solid var(--echo-accent-ring) !important;
  outline-offset: 2px;
}

input:focus-visible,
textarea:focus-visible,
select:focus-visible {
  outline: none !important;
  border-color: var(--echo-accent) !important;
  box-shadow: none !important;
}

button:disabled,
.btn:disabled,
input:disabled,
textarea:disabled,
select:disabled {
  opacity: .52;
  cursor: not-allowed;
}

input,
textarea,
select,
.agent-input,
.chat-input,
.task-edit-area,
.speaker-rename-input {
  min-height: var(--echo-control-md);
  border-radius: var(--echo-radius-md) !important;
  font-size: var(--echo-font-body) !important;
}

.panel,
.card,
.task-item,
.home-hero,
.home-history,
.home-meter,
.recording-card,
.voiceprint-modal,
.engine-gate,
.dropzone,
.blocked-card,
.kpi,
.stage,
.bp,
.ai-stat,
.stage-row,
.metric,
.memory-entry,
.task-card {
  border-radius: var(--echo-radius-lg) !important;
}

.badge,
.chip,
.status-pill,
.hud-pill,
.version,
.home-quota-inline,
.quota,
.summary-window,
.utterance-speaker,
.tab-badge {
  border-radius: var(--echo-radius-pill) !important;
  font-size: var(--echo-font-caption) !important;
}

.app,
.app-shell,
#app {
  font-family: var(--echo-font-sans) !important;
  font-size: var(--echo-font-body) !important;
  line-height: 1.5 !important;
}

body,
button,
input,
select,
textarea {
  font-family: var(--echo-font-sans) !important;
}

.app-header,
.workspace-header,
.topbar,
.v4-topbar,
.brand,
.tasks-hd,
.sidebar > .brand,
.tasks > .tasks-hd,
.agent-rail-head,
.oar-sdk-agent-header,
.workspace-page-head,
.header,
.tabs,
.tab-bar,
.hud-bar,
header {
  height: var(--echo-titlebar) !important;
  min-height: var(--echo-titlebar) !important;
  max-height: var(--echo-titlebar) !important;
  align-items: center !important;
  box-sizing: border-box !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}

.topbar .mic-btn,
.topbar .stop-btn,
.brand-logo,
.brand-icon,
.app-logo-icon,
.v4-brand-mark,
.agent-rail-avatar,
.oar-sdk-agent-avatar,
.meagent-head-avatar {
  width: var(--echo-control-md) !important;
  height: var(--echo-control-md) !important;
  min-width: var(--echo-control-md) !important;
  flex-basis: var(--echo-control-md) !important;
  border-radius: var(--echo-radius-md) !important;
  font-size: var(--echo-font-subheading) !important;
  box-sizing: border-box !important;
}

.topbar .mic-btn svg,
.topbar .stop-btn svg,
.brand-logo svg,
.brand-icon svg,
.app-logo-icon svg,
.v4-brand-mark svg,
.agent-rail-avatar svg,
.oar-sdk-agent-avatar svg {
  width: 16px !important;
  height: 16px !important;
}

.topbar .mic-btn,
.topbar .stop-btn {
  border-radius: var(--echo-radius-pill) !important;
}

.brand-name,
.brand-text .title,
.app-logo,
.v4-brand-title,
.agent-rail-title strong,
.oar-sdk-agent-header strong,
.meagent-head-title,
header h1,
.header h1 {
  font-size: var(--echo-font-heading) !important;
  font-weight: 650 !important;
  line-height: 1.2 !important;
  letter-spacing: 0 !important;
}

.nav-item,
.v4-top-nav .v4-nav-copy span,
.v4-nav-copy span,
.tab,
.tabs button,
.tab-bar button,
header nav a,
header nav button {
  font-size: var(--echo-font-body) !important;
  font-weight: 600 !important;
  line-height: 1.2 !important;
  letter-spacing: 0 !important;
}

.page-hero {
  text-align: left !important;
  padding: 0 0 var(--echo-space-lg) !important;
  margin: 0 !important;
  max-width: none !important;
}

.page-hero-mono {
  display: none !important;
}

.page-hero-title {
  margin: 0 0 var(--echo-space-xs) !important;
  text-align: left !important;
  font-size: var(--echo-font-title) !important;
  font-weight: 650 !important;
  line-height: 1.2 !important;
  letter-spacing: 0 !important;
}

.page-hero-sub {
  margin: 0 !important;
  max-width: 680px !important;
  text-align: left !important;
  font-size: var(--echo-font-body) !important;
  font-weight: 400 !important;
  line-height: 1.5 !important;
  letter-spacing: 0 !important;
  color: var(--echo-text-secondary) !important;
}

.toolbar {
  max-width: none !important;
  margin: 0 0 var(--echo-space-xl) !important;
  padding: 0 !important;
  border: 0 !important;
  border-radius: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
  align-items: center !important;
  justify-content: flex-start !important;
  gap: var(--echo-space-sm) !important;
}

.agent-grid,
.pagination {
  max-width: none !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
}

.agent-grid {
  justify-content: flex-start !important;
  grid-template-columns: repeat(auto-fill, minmax(304px, 360px)) !important;
}

.detail-tabs button,
.detail-tabs button.active {
  text-decoration: none !important;
}

.detail-tabs button.active::after {
  content: none !important;
  display: none !important;
}

.brand-tag,
.brand-ver,
.brand-text .label,
.agent-rail-title span,
.oar-sdk-agent-header span,
.v4-brand-sub,
.v4-page-eyebrow,
.header-pills,
.pill,
.clock-date {
  font-size: var(--echo-font-caption) !important;
  font-weight: 500 !important;
  line-height: 1.2 !important;
}

.clock-time,
.timer {
  font-size: var(--echo-font-heading) !important;
  font-weight: 650 !important;
  letter-spacing: 0 !important;
}

.topbar .quota,
.topbar-actions .quota,
.quota,
.home-quota-inline,
.header-right .pill,
.topbar button,
.app-header button,
.workspace-header button,
.v4-topbar button,
.agent-rail-head button,
.oar-sdk-agent-header button,
.header button,
header button,
.topbar select,
.workspace-header select,
.v4-topbar select {
  height: var(--echo-control-md) !important;
  min-height: var(--echo-control-md) !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  font-size: var(--echo-font-body) !important;
  font-weight: 600 !important;
  line-height: 1 !important;
  border-radius: var(--echo-radius-md) !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  text-align: center !important;
  white-space: nowrap !important;
}

.v4-top-nav,
.header-pills {
  align-items: center !important;
  min-height: 0 !important;
}

.v4-page-title,
.workspace-page-title,
.feed-page-title,
.settings-title,
.home-panel h2,
.panel-title,
.panel-hd span:first-child,
.tasks-hd,
.voiceprint-title,
.stage-title {
  font-size: var(--echo-font-subheading) !important;
  font-weight: 650 !important;
  line-height: 1.25 !important;
  letter-spacing: 0 !important;
}

.app-logo,
.brand-name,
.home-history-title,
.panel-hd span:first-child,
.tasks-hd,
.voiceprint-title,
.stage-title,
.feed-page-title {
  font-size: var(--echo-font-heading) !important;
}

.home-title,
.dropzone h1,
.engine-gate h1 {
  font-size: clamp(var(--echo-font-title), 4vw, 34px) !important;
  letter-spacing: 0 !important;
}

/* Echo UI Assistant Rail Contract v0.1.0 */
:where(.tasks, .v4-agent-rail, #chat-panel, #chat-mount) {
  --echo-assistant-accent: var(--echo-accent);
  --echo-assistant-pad-x: 32px;
  --echo-assistant-empty-top: 32px;
  --echo-assistant-empty-font: var(--echo-font-subheading);
  --echo-assistant-empty-line: 1.7;
  --echo-assistant-control: 56px;
  --echo-assistant-editor-height: 104px;
  --echo-assistant-editor-radius: 24px;
  --echo-assistant-send-inner: 44px;
  --echo-assistant-placeholder-font: 14px;
  --echo-assistant-placeholder-line: 22px;
  --echo-assistant-title-pad-bottom: 12px;
  --echo-assistant-composer-pad-y: 24px;
  --echo-assistant-composer-pad-x: 32px;
  background: var(--echo-bg-raised) !important;
  color: var(--echo-text) !important;
  border-left: 1px solid var(--echo-border) !important;
  border-radius: 0 !important;
  box-shadow: none !important;
  display: flex !important;
  flex-direction: column !important;
  min-height: 0 !important;
}

.tasks { --echo-assistant-accent: #ef4444; }
.v4-agent-rail,
.oar-sdk-agent-root,
.oar-agent-panel { --echo-assistant-accent: #2563eb; }
#chat-panel { --echo-assistant-accent: #6366f1; }
#chat-mount { --echo-assistant-accent: #d45b35; position: relative !important; }

/* Echo UI OAR Blue Theme Contract v0.1.0 */
:root {
  --echo-oar-accent: #2563eb;
  --echo-oar-accent-soft: #dbeafe;
  --echo-oar-accent-border: rgba(37, 99, 235, .28);
  --echo-oar-accent-shadow: rgba(37, 99, 235, .18);
}

.v4-shell,
.v4-app,
.v4-topbar,
.v4-agent-rail,
.oar-agent-panel,
.oar-agent-shell,
.oar-sdk-agent-root {
  --primary: var(--echo-oar-accent) !important;
  --info: var(--echo-oar-accent) !important;
  --ring: var(--echo-oar-accent) !important;
  --echo-assistant-accent: var(--echo-oar-accent) !important;
  --echobraid-accent: var(--echo-oar-accent) !important;
  --echobraid-bubble-out-bg: var(--echo-oar-accent) !important;
}

.v4-brand-mark,
.app-logo-icon,
.v4-nav-item.active .v4-nav-icon,
.setup-logo,
.oar-sdk-agent-avatar,
.meagent-action-btn.primary {
  background: var(--echo-oar-accent) !important;
  background-image: none !important;
  color: #ffffff !important;
}

.v4-brand-mark {
  box-shadow: 0 8px 22px var(--echo-oar-accent-shadow) !important;
}

.v4-brand-mark .oar-logo-svg,
.setup-logo .oar-logo-svg,
.app-logo-icon .oar-logo-svg {
  width: 22px !important;
  height: 22px !important;
  display: block !important;
  color: #ffffff !important;
}

.app-logo-icon:not(:has(svg)) {
  font-size: 0 !important;
}

.app-logo-icon:not(:has(svg))::before {
  content: "" !important;
  width: 22px !important;
  height: 22px !important;
  display: block !important;
  background: #ffffff !important;
  -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='8.2'/%3E%3Ccircle cx='12' cy='12' r='4.6'/%3E%3Ccircle cx='12' cy='12' r='1.5' fill='black' stroke='none'/%3E%3Cpath d='M12 2.8v3M12 18.2v3M2.8 12h3M18.2 12h3'/%3E%3C/svg%3E") center / contain no-repeat !important;
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='8.2'/%3E%3Ccircle cx='12' cy='12' r='4.6'/%3E%3Ccircle cx='12' cy='12' r='1.5' fill='black' stroke='none'/%3E%3Cpath d='M12 2.8v3M12 18.2v3M2.8 12h3M18.2 12h3'/%3E%3C/svg%3E") center / contain no-repeat !important;
}

.v4-top-nav .v4-nav-item.active {
  color: var(--echo-oar-accent) !important;
  border-color: transparent !important;
}

.v4-top-nav .v4-nav-item.active::after,
.result-progress-bar {
  background: var(--echo-oar-accent) !important;
}

.oar-filter.active,
.setup-mode.active {
  background: var(--echo-oar-accent-soft) !important;
  border-color: var(--echo-oar-accent-border) !important;
  color: var(--echo-oar-accent) !important;
}

/* Echo UI OAR Home Workbench Contract v0.1.0 */
.home-workbench {
  background: var(--echo-bg-panel) !important;
}

.home-main {
  padding: var(--echo-space-xl) var(--echo-space-2xl) 40px !important;
  display: flex !important;
  flex-direction: column !important;
  gap: var(--echo-space-xl) !important;
}

.home-metric-grid {
  display: grid !important;
  grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
  gap: var(--echo-space-lg) !important;
}

.home-metric-card {
  display: grid !important;
  grid-template-columns: minmax(0, 1fr) auto !important;
  grid-template-rows: auto auto !important;
  align-items: start !important;
  justify-content: stretch !important;
  justify-items: start !important;
  min-height: 112px !important;
  padding: var(--echo-space-xl) !important;
  text-align: left !important;
  border: 1px solid var(--echo-border) !important;
  border-radius: var(--echo-radius-lg) !important;
  background: var(--echo-bg-raised) !important;
  box-shadow: var(--echo-shadow-sm) !important;
}

.home-metric-label {
  grid-column: 1 !important;
  grid-row: 1 !important;
  color: var(--echo-text-secondary) !important;
  font-size: var(--echo-font-body) !important;
  font-weight: 650 !important;
  line-height: 1.3 !important;
}

.home-metric-card strong {
  grid-column: 1 !important;
  grid-row: 2 !important;
  display: flex !important;
  align-items: baseline !important;
  justify-content: flex-start !important;
  gap: var(--echo-space-sm) !important;
  margin: var(--echo-space-md) 0 0 !important;
  color: var(--echo-text) !important;
  font-size: 36px !important;
  line-height: 1 !important;
  font-weight: 760 !important;
  letter-spacing: 0 !important;
}

.home-metric-card em {
  color: var(--echo-text-secondary) !important;
  font-size: var(--echo-font-subheading) !important;
  font-style: normal !important;
  font-weight: 650 !important;
}

.home-metric-card small {
  grid-column: 2 !important;
  grid-row: 1 / span 2 !important;
  align-self: center !important;
  justify-self: end !important;
  max-width: 180px !important;
  margin: 0 !important;
  color: var(--echo-text-secondary) !important;
  font-size: var(--echo-font-body) !important;
  line-height: 1.5 !important;
  text-align: right !important;
}

.home-panel.home-feed-panel {
  margin: 0 !important;
  padding: var(--echo-space-xl) !important;
  border: 1px solid var(--echo-border) !important;
  border-radius: var(--echo-radius-lg) !important;
  background: var(--echo-bg-raised) !important;
  box-shadow: var(--echo-shadow-sm) !important;
}

.home-panel-head {
  display: flex !important;
  align-items: flex-start !important;
  justify-content: space-between !important;
  gap: var(--echo-space-lg) !important;
  margin: 0 0 var(--echo-space-md) !important;
  padding: 0 0 var(--echo-space-md) !important;
  border-bottom: 1px solid var(--echo-border) !important;
}

.home-panel-head h2 {
  margin: 0 !important;
  color: var(--echo-text) !important;
  font-size: var(--echo-font-heading) !important;
  font-weight: 700 !important;
  line-height: 1.25 !important;
}

.home-panel-head p {
  margin: var(--echo-space-xs) 0 0 !important;
  color: var(--echo-text-secondary) !important;
  font-size: var(--echo-font-body) !important;
  line-height: 1.4 !important;
}

.home-feed-list {
  display: flex !important;
  flex-direction: column !important;
  gap: 0 !important;
  align-items: stretch !important;
  justify-content: flex-start !important;
}

.home-feed-item {
  width: 100% !important;
  min-width: 0 !important;
  display: grid !important;
  grid-template-columns: minmax(0, 1fr) !important;
  align-items: start !important;
  justify-content: stretch !important;
  justify-items: stretch !important;
  gap: 0 !important;
  padding: var(--echo-space-md) 0 !important;
  border: 0 !important;
  border-bottom: 1px solid var(--echo-border) !important;
  border-radius: 0 !important;
  background: transparent !important;
  color: var(--echo-text) !important;
  text-align: left !important;
  box-shadow: none !important;
}

.home-feed-item:last-child {
  border-bottom: 0 !important;
}

.home-feed-icon {
  display: none !important;
}

.home-feed-item span:last-child {
  min-width: 0 !important;
  display: block !important;
  text-align: left !important;
}

.feed-icon {
  display: none !important;
}

.feed-list {
  padding: var(--echo-space-lg) var(--echo-space-xl) !important;
}

.feed-item {
  padding: var(--echo-space-md) var(--echo-space-lg) !important;
  border-radius: var(--echo-radius-md) !important;
}

.feed-page-head {
  max-width: none !important;
  margin: 0 !important;
  padding: var(--echo-space-xl) var(--echo-space-2xl) var(--echo-space-md) !important;
  display: grid !important;
  grid-template-columns: auto minmax(0, 1fr) !important;
  align-items: start !important;
  gap: var(--echo-space-md) !important;
}

#feed-back-home {
  width: 28px !important;
  height: 28px !important;
  min-width: 28px !important;
  min-height: 28px !important;
  padding: 0 !important;
  border: 0 !important;
  border-radius: var(--echo-radius-md) !important;
  background: transparent !important;
  color: var(--echo-text-secondary) !important;
  box-shadow: none !important;
  font-size: 0 !important;
  line-height: 1 !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
}

#feed-back-home::before {
  content: "" !important;
  width: 16px !important;
  height: 16px !important;
  display: block !important;
  background: currentColor !important;
  -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M15 18l-6-6 6-6'/%3E%3C/svg%3E") center / contain no-repeat !important;
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M15 18l-6-6 6-6'/%3E%3C/svg%3E") center / contain no-repeat !important;
}

#feed-back-home:hover {
  background: rgba(37, 99, 235, .06) !important;
  color: var(--echo-oar-accent) !important;
}

.detail-back {
  width: 28px !important;
  height: 28px !important;
  min-width: 28px !important;
  min-height: 28px !important;
  padding: 0 !important;
  border: 0 !important;
  border-radius: var(--echo-radius-md) !important;
  background: transparent !important;
  color: var(--echo-text-secondary) !important;
  box-shadow: none !important;
  font-size: 0 !important;
  line-height: 1 !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  flex: 0 0 28px !important;
}

.detail-back::before {
  content: "" !important;
  width: 16px !important;
  height: 16px !important;
  display: block !important;
  background: currentColor !important;
  -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M15 18l-6-6 6-6'/%3E%3C/svg%3E") center / contain no-repeat !important;
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M15 18l-6-6 6-6'/%3E%3C/svg%3E") center / contain no-repeat !important;
}

.detail-back:hover {
  background: rgba(99, 102, 241, .06) !important;
  color: var(--echo-accent) !important;
}

.feed-page-title {
  margin: 0 !important;
  color: var(--echo-text) !important;
  font-size: var(--echo-font-heading) !important;
  font-weight: 700 !important;
  line-height: 1.25 !important;
}

.feed-page-sub {
  margin-top: var(--echo-space-xs) !important;
  color: var(--echo-text-secondary) !important;
  font-size: var(--echo-font-body) !important;
  line-height: 1.4 !important;
}

.home-feed-item strong {
  display: block !important;
  color: var(--echo-text) !important;
  font-size: var(--echo-font-body) !important;
  font-weight: 560 !important;
  line-height: 1.4 !important;
  white-space: normal !important;
  overflow: visible !important;
  text-overflow: clip !important;
}

.home-feed-item small {
  display: block !important;
  margin-top: var(--echo-space-xs) !important;
  color: var(--echo-text-muted) !important;
  font-size: var(--echo-font-caption) !important;
  font-weight: 400 !important;
  line-height: 1.3 !important;
  text-align: left !important;
}

.home-empty-line {
  padding: var(--echo-space-lg) 0 !important;
  border: 0 !important;
  color: var(--echo-text-secondary) !important;
  font-size: var(--echo-font-body) !important;
  text-align: left !important;
}

:where(.tasks-hd, .agent-rail-head, .oar-sdk-agent-header, #chat-panel .chat-head, #chat-mount::before) {
  height: var(--echo-titlebar) !important;
  min-height: var(--echo-titlebar) !important;
  max-height: var(--echo-titlebar) !important;
  padding: 0 var(--echo-assistant-pad-x) var(--echo-assistant-title-pad-bottom) !important;
  display: flex !important;
  align-items: flex-end !important;
  justify-content: flex-start !important;
  gap: var(--echo-space-md) !important;
  border-bottom: 1px solid var(--echo-border) !important;
  background: var(--echo-bg-raised) !important;
  box-sizing: border-box !important;
}

#chat-mount::before {
  content: "EchoOffice Agent";
  flex: 0 0 var(--echo-titlebar) !important;
}

:where(.tasks-hd, .agent-rail-title strong, .oar-sdk-agent-header strong, #chat-panel .chat-title, #chat-mount::before) {
  color: var(--echo-text) !important;
  font-size: var(--echo-font-heading) !important;
  font-weight: 700 !important;
  line-height: 1.2 !important;
  letter-spacing: 0 !important;
}

:where(.agent-rail-avatar, .oar-sdk-agent-avatar, .agent-rail-title span, .oar-sdk-agent-header span, .agent-rail-head .btn, .agent-rail-head button, .oar-sdk-agent-actions, .oar-sdk-agent-action, #chat-panel .chat-title-icon, #chat-panel .chat-head-actions, #chat-panel .chat-suggest) {
  display: none !important;
}

:where(.tasks-body, .agent-sdk-root, #agent-sdk-root .echobraid-chat, #agent-sdk-root .echobraid-chat-thread, .agent-scroll, .agent-rail-body, .agent-rail-messages, .oar-sdk-agent-body, .oar-sdk-agent-messages, #chat-panel .chat-messages, #chat-mount .echobraid-chat, #chat-mount .echobraid-chat-thread) {
  flex: 1 1 auto !important;
  min-height: 0 !important;
  background: var(--echo-bg-raised) !important;
  color: var(--echo-text) !important;
}

:where(.agent-intro, #agent-sdk-root .echobraid-chat-thread--empty > div, .agent-rail-empty, .oar-sdk-agent-empty, #chat-panel .chat-empty, #chat-mount .echobraid-empty-state, #chat-mount .echobraid-chat [data-empty], #chat-mount .echobraid-chat .empty) {
  margin: 0 !important;
  padding: var(--echo-assistant-empty-top) var(--echo-assistant-pad-x) 0 !important;
  display: block !important;
  align-items: flex-start !important;
  justify-content: flex-start !important;
  text-align: left !important;
  color: var(--echo-text-secondary) !important;
  font-size: var(--echo-assistant-empty-font) !important;
  font-weight: 400 !important;
  line-height: var(--echo-assistant-empty-line) !important;
  letter-spacing: 0 !important;
}

#chat-mount .echobraid-empty-state > * {
  display: none !important;
}

#chat-mount .echobraid-empty-state::before {
  content: "可以问我文档内容，或让 EchoOffice 帮你整理/改写文档。" !important;
  display: block !important;
}

:where(.agent-rail-empty h2, .oar-sdk-agent-empty h2, .oar-sdk-agent-empty strong, #chat-panel .chat-empty h2, #chat-mount .echobraid-chat .empty h2) {
  margin: 0 0 var(--echo-space-sm) !important;
  color: var(--echo-text-secondary) !important;
  font-size: var(--echo-assistant-empty-font) !important;
  font-weight: 400 !important;
  line-height: var(--echo-assistant-empty-line) !important;
  text-align: left !important;
}

:where(.agent-rail-empty span, .oar-sdk-agent-empty span, #chat-panel .chat-empty div, #chat-mount .echobraid-chat .empty span) {
  color: var(--echo-text-secondary) !important;
  font-size: var(--echo-assistant-empty-font) !important;
  font-weight: 400 !important;
  line-height: var(--echo-assistant-empty-line) !important;
  text-align: left !important;
}

:where(.agent-composer, #agent-sdk-root .echobraid-composer, .agent-rail-composer, .oar-agent-composer, .oar-sdk-agent-composer, #chat-panel .chat-input-row, #chat-mount .echobraid-composer) {
  flex: 0 0 auto !important;
  width: 100% !important;
  padding: var(--echo-assistant-composer-pad-y) var(--echo-assistant-composer-pad-x) !important;
  display: flex !important;
  align-items: center !important;
  gap: var(--echo-space-md) !important;
  border-top: 1px solid var(--echo-border) !important;
  background: var(--echo-bg-raised) !important;
  box-sizing: border-box !important;
}

:where(.agent-rail-input-row, #agent-sdk-root .echobraid-input, .oar-sdk-agent-input-row, .oar-agent-input-shell, #chat-mount .echobraid-input) {
  display: flex !important;
  align-items: center !important;
  gap: var(--echo-space-md) !important;
  width: 100% !important;
  max-width: none !important;
  min-height: 0 !important;
  margin: 0 !important;
  padding: 0 !important;
  border: 0 !important;
  border-radius: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
}

:where(.agent-input, .agent-rail-input-row .meagent-input, #agent-sdk-root .echobraid-input textarea, #agent-sdk-root .echobraid-input input, .oar-sdk-agent-input, .oar-agent-input-shell textarea, .oar-agent-input-shell input, .oar-agent-composer textarea, .oar-agent-composer input, #chat-panel .chat-input-row textarea, #chat-panel .chat-input-row input, #chat-mount .echobraid-input textarea, #chat-mount .echobraid-input input, #chat-mount .echobraid-chat [contenteditable="true"]) {
  flex: 1 1 auto !important;
  width: auto !important;
  min-width: 0 !important;
  height: var(--echo-assistant-control) !important;
  min-height: var(--echo-assistant-control) !important;
  max-height: var(--echo-assistant-control) !important;
  padding: 0 var(--echo-space-xl) !important;
  border: 1px solid var(--echo-border-strong) !important;
  border-radius: var(--echo-radius-pill) !important;
  background: var(--echo-bg-raised) !important;
  color: var(--echo-text) !important;
  box-shadow: var(--echo-shadow-sm) !important;
  font-size: var(--echo-font-subheading) !important;
  font-weight: 400 !important;
  line-height: var(--echo-assistant-control) !important;
  letter-spacing: 0 !important;
  resize: none !important;
  box-sizing: border-box !important;
}

:where(.agent-input::placeholder, .agent-rail-input-row .meagent-input::placeholder, #agent-sdk-root .echobraid-input textarea::placeholder, #agent-sdk-root .echobraid-input input::placeholder, .oar-agent-composer textarea::placeholder, #chat-panel .chat-input-row textarea::placeholder, #chat-panel .chat-input-row input::placeholder, #chat-mount .echobraid-chat textarea::placeholder, #chat-mount .echobraid-chat input::placeholder) {
  color: var(--echo-text-muted) !important;
  font-size: var(--echo-assistant-placeholder-font) !important;
  font-weight: 400 !important;
  line-height: var(--echo-assistant-placeholder-line) !important;
  opacity: 1 !important;
}

:where(#agent-send, .agent-rail-input-row .btn, #agent-sdk-root .echobraid-input button, .oar-agent-send, .oar-agent-composer button, .oar-sdk-agent-composer button, #chat-panel #btn-chat-send, #chat-mount .echobraid-input button) {
  flex: 0 0 var(--echo-assistant-control) !important;
  width: var(--echo-assistant-control) !important;
  height: var(--echo-assistant-control) !important;
  min-width: var(--echo-assistant-control) !important;
  min-height: var(--echo-assistant-control) !important;
  padding: 0 !important;
  border: 0 !important;
  border-radius: var(--echo-radius-pill) !important;
  background: var(--echo-assistant-accent) !important;
  color: #ffffff !important;
  box-shadow: none !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  text-align: center !important;
  font-size: 0 !important;
  line-height: 1 !important;
}

:where(#agent-send, .agent-rail-input-row .btn, #agent-sdk-root .echobraid-input button, .oar-agent-send, .oar-agent-composer button, .oar-sdk-agent-composer button, #chat-panel #btn-chat-send, #chat-mount .echobraid-input button)::before {
  content: "" !important;
  width: 20px !important;
  height: 20px !important;
  display: block !important;
  background: currentColor !important;
  -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M5 12h14'/%3E%3Cpath d='m13 6 6 6-6 6'/%3E%3C/svg%3E") center / contain no-repeat !important;
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M5 12h14'/%3E%3Cpath d='m13 6 6 6-6 6'/%3E%3C/svg%3E") center / contain no-repeat !important;
}

:where(#agent-send:disabled, .agent-rail-input-row .btn:disabled, #agent-sdk-root .echobraid-input button:disabled, .oar-agent-send:disabled, .oar-agent-composer button:disabled, .oar-sdk-agent-composer button:disabled, #chat-panel #btn-chat-send:disabled, #chat-mount .echobraid-input button:disabled) {
  opacity: .42 !important;
  cursor: default !important;
}

:where(#agent-send, .agent-rail-input-row .btn, #agent-sdk-root .echobraid-input button, .oar-agent-send, .oar-agent-composer button, .oar-sdk-agent-composer button, #chat-panel #btn-chat-send, #chat-mount .echobraid-input button) > * {
  display: none !important;
}

/* Echo UI Input Focus Contract v0.1.0 */
:where(.agent-rail-input-row, #agent-sdk-root .echobraid-input, .oar-sdk-agent-input-row, .oar-agent-input-shell, #chat-mount .echobraid-input, #chat-panel .chat-input-row):focus-within {
  border-color: var(--echo-assistant-accent) !important;
  box-shadow: var(--echo-shadow-sm) !important;
}

:where(.agent-input, .agent-rail-input-row .meagent-input, #agent-sdk-root .echobraid-input textarea, #agent-sdk-root .echobraid-input input, .oar-sdk-agent-input, .oar-agent-input-shell textarea, .oar-agent-input-shell input, .oar-agent-composer textarea, .oar-agent-composer input, #chat-panel .chat-input-row textarea, #chat-panel .chat-input-row input, #chat-mount .echobraid-input textarea, #chat-mount .echobraid-input input, #chat-mount .echobraid-chat [contenteditable="true"]):focus,
:where(.agent-input, .agent-rail-input-row .meagent-input, #agent-sdk-root .echobraid-input textarea, #agent-sdk-root .echobraid-input input, .oar-sdk-agent-input, .oar-agent-input-shell textarea, .oar-agent-input-shell input, .oar-agent-composer textarea, .oar-agent-composer input, #chat-panel .chat-input-row textarea, #chat-panel .chat-input-row input, #chat-mount .echobraid-input textarea, #chat-mount .echobraid-input input, #chat-mount .echobraid-chat [contenteditable="true"]):focus-visible {
  outline: none !important;
  border-color: transparent !important;
  box-shadow: none !important;
}

:where(#agent-send, .agent-rail-input-row .btn, #agent-sdk-root .echobraid-input button, .oar-agent-send, .oar-agent-composer button, .oar-sdk-agent-composer button, #chat-panel #btn-chat-send, #chat-mount .echobraid-input button):focus,
:where(#agent-send, .agent-rail-input-row .btn, #agent-sdk-root .echobraid-input button, .oar-agent-send, .oar-agent-composer button, .oar-sdk-agent-composer button, #chat-panel #btn-chat-send, #chat-mount .echobraid-input button):focus-visible {
  outline: none !important;
  box-shadow: none !important;
}

/* Echo UI Assistant Message Contract v0.1.0 */
:where(.tasks, .v4-agent-rail, .oar-agent-shell, .oar-sdk-agent-root, #agent-sdk-root, #chat-panel, #chat-mount, .sidebar#sidebar) :where(.echobraid-chat-thread, .chat-messages, .agent-rail-messages, .oar-sdk-agent-messages, .sidebar-body) {
  display: flex !important;
  flex-direction: column !important;
  gap: var(--echo-space-sm) !important;
  padding: 0 !important;
  box-sizing: border-box !important;
}

:where(.tasks, .v4-agent-rail, .oar-agent-shell, .oar-sdk-agent-root, #agent-sdk-root, #chat-panel, #chat-mount, .sidebar#sidebar) :where(.echobraid-chat-thread.echo-ui-chat-has-messages, .chat-messages.echo-ui-chat-has-messages, .agent-rail-messages.echo-ui-chat-has-messages, .oar-sdk-agent-messages.echo-ui-chat-has-messages, .sidebar-body.echo-ui-chat-has-messages) {
  padding: var(--echo-space-md) var(--echo-assistant-pad-x) 0 !important;
}

:where(.echo-ui-chat-has-messages, .echobraid-chat-thread:has(.echobraid-bubble-row), .chat-messages:has(.chat-msg), .sidebar-body:has(.chat-message)) :where(.chat-empty, .agent-intro, .agent-rail-empty, .oar-sdk-agent-empty, .echobraid-empty-state, [data-empty], .empty) {
  display: none !important;
}

:where(.echobraid-bubble-row, .chat-msg, .agent-rail-message, .oar-sdk-agent-message, .oar-agent-message) {
  width: 100% !important;
  min-width: 0 !important;
  display: flex !important;
  flex-direction: column !important;
  gap: var(--echo-space-xs) !important;
  margin: 0 !important;
  padding: 0 !important;
  box-sizing: border-box !important;
}

:where(.chat-message) {
  width: fit-content !important;
  max-width: min(78%, 520px) !important;
  min-width: 0 !important;
  margin: 0 !important;
  padding: 8px 12px !important;
  border: 1px solid var(--echo-border) !important;
  border-radius: 16px 16px 16px 6px !important;
  background: var(--echo-bg-panel) !important;
  color: var(--echo-text) !important;
  box-shadow: none !important;
  font-family: var(--echo-font-sans) !important;
  font-size: var(--echo-font-body) !important;
  font-weight: 400 !important;
  line-height: 1.5 !important;
  letter-spacing: 0 !important;
  white-space: pre-wrap !important;
  overflow-wrap: anywhere !important;
  box-sizing: border-box !important;
}

:where(.echobraid-bubble, .chat-bubble, .agent-rail-bubble, .oar-sdk-agent-bubble, .oar-agent-bubble) {
  width: fit-content !important;
  max-width: min(78%, 520px) !important;
  min-width: 0 !important;
  margin: 0 !important;
  padding: 8px 12px !important;
  border: 1px solid var(--echo-border) !important;
  border-radius: 16px 16px 16px 6px !important;
  background: var(--echo-bg-panel) !important;
  color: var(--echo-text) !important;
  box-shadow: none !important;
  font-family: var(--echo-font-sans) !important;
  font-size: var(--echo-font-body) !important;
  font-weight: 400 !important;
  line-height: 1.5 !important;
  letter-spacing: 0 !important;
  white-space: pre-wrap !important;
  overflow-wrap: anywhere !important;
  box-sizing: border-box !important;
}

:where(.echobraid-bubble-row--out, .chat-msg.user, .chat-message.user, .agent-rail-message--out, .oar-sdk-agent-message--out, .oar-agent-message--out) {
  align-items: flex-end !important;
  align-self: stretch !important;
}

:where(.echobraid-bubble-row--in, .chat-msg.assistant, .chat-msg.tool, .chat-msg.err, .chat-message.agent, .chat-message.assistant, .agent-rail-message--in, .oar-sdk-agent-message--in, .oar-agent-message--in) {
  align-items: flex-start !important;
  align-self: stretch !important;
}

:where(.echobraid-bubble--out, .chat-msg.user .chat-bubble, .chat-message.user, .agent-rail-message--out .agent-rail-bubble, .oar-sdk-agent-message--out .oar-sdk-agent-bubble, .oar-agent-message--out .oar-agent-bubble) {
  border-color: transparent !important;
  border-radius: 16px 16px 6px 16px !important;
  background: var(--echo-assistant-accent) !important;
  color: #ffffff !important;
}

:where(.echobraid-bubble--in, .chat-msg.assistant .chat-bubble, .chat-msg.tool .chat-bubble, .chat-msg.err .chat-bubble, .chat-message.agent, .chat-message.assistant, .agent-rail-message--in .agent-rail-bubble, .oar-sdk-agent-message--in .oar-sdk-agent-bubble, .oar-agent-message--in .oar-agent-bubble) {
  border-color: var(--echo-border) !important;
  border-radius: 16px 16px 16px 6px !important;
  background: var(--echo-bg-panel) !important;
  color: var(--echo-text) !important;
}

:where(.echobraid-bubble-timestamp, .chat-time, .chat-msg-time, .agent-rail-time, .oar-sdk-agent-time, .oar-agent-time) {
  color: var(--echo-text-muted) !important;
  font-size: var(--echo-font-caption) !important;
  line-height: 1.3 !important;
}

:where(.chat-typing-bubble, .echobraid-typing, .echo-ui-typing, [data-typing]) {
  width: fit-content !important;
  min-width: 44px !important;
  min-height: 34px !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 5px !important;
  padding: 8px 12px !important;
  border: 1px solid var(--echo-border) !important;
  border-radius: 16px 16px 16px 6px !important;
  background: var(--echo-bg-panel) !important;
  color: var(--echo-text-secondary) !important;
  box-shadow: none !important;
}

:where(.chat-typing-bubble span, .echobraid-typing span, .echo-ui-typing-dot, [data-typing] span) {
  width: 6px !important;
  height: 6px !important;
  display: block !important;
  border-radius: var(--echo-radius-pill) !important;
  background: currentColor !important;
  opacity: .36 !important;
  animation: echo-ui-typing-dot 1.05s infinite ease-in-out !important;
}

:where(.chat-typing-bubble span:nth-child(2), .echobraid-typing span:nth-child(2), .echo-ui-typing-dot:nth-child(2), [data-typing] span:nth-child(2)) {
  animation-delay: 120ms !important;
}

:where(.chat-typing-bubble span:nth-child(3), .echobraid-typing span:nth-child(3), .echo-ui-typing-dot:nth-child(3), [data-typing] span:nth-child(3)) {
  animation-delay: 240ms !important;
}

@keyframes echo-ui-typing-dot {
  0%, 80%, 100% {
    transform: translateY(0);
    opacity: .34;
  }
  40% {
    transform: translateY(-3px);
    opacity: .86;
  }
}

/* Echo UI OAR Agent Composer Contract v0.1.0 */
.oar-agent-shell {
  position: relative !important;
  overflow: hidden !important;
  background: var(--echo-bg-subtle) !important;
}

.oar-agent-shell .echobraid-chat-thread,
.oar-agent-shell .echobraid-chat-thread--empty {
  padding: 0 0 calc(var(--echo-assistant-editor-height) + var(--echo-assistant-composer-pad-y)) !important;
  background: var(--echo-bg-subtle) !important;
  box-sizing: border-box !important;
}

.oar-agent-shell .echobraid-chat-thread.echo-ui-chat-has-messages,
.oar-agent-shell .echobraid-chat-thread:has(.echobraid-bubble-row),
.oar-agent-shell .echobraid-chat-thread--empty:has(.echobraid-bubble-row) {
  padding: var(--echo-space-md) var(--echo-assistant-pad-x) calc(var(--echo-assistant-editor-height) + var(--echo-assistant-composer-pad-y) + var(--echo-space-md)) !important;
}

.oar-sdk-agent-header {
  height: var(--echo-titlebar) !important;
  min-height: var(--echo-titlebar) !important;
  max-height: var(--echo-titlebar) !important;
  padding: 0 var(--echo-assistant-pad-x) var(--echo-assistant-title-pad-bottom) !important;
  align-items: flex-end !important;
  justify-content: flex-start !important;
  background: var(--echo-bg-raised) !important;
  border-bottom: 1px solid var(--echo-border) !important;
  box-sizing: border-box !important;
}

.oar-sdk-agent-header strong {
  color: var(--echo-text) !important;
  font-size: var(--echo-font-heading) !important;
  font-weight: 700 !important;
  line-height: 1.2 !important;
  letter-spacing: 0 !important;
}

.oar-sdk-agent-empty {
  width: 100% !important;
  min-height: 0 !important;
  margin: 0 !important;
  padding: var(--echo-assistant-empty-top) var(--echo-assistant-pad-x) 0 !important;
  color: var(--echo-text-secondary) !important;
  font-size: var(--echo-assistant-empty-font) !important;
  font-weight: 400 !important;
  line-height: var(--echo-assistant-empty-line) !important;
  text-align: left !important;
  box-sizing: border-box !important;
}

.oar-sdk-agent-empty strong,
.oar-sdk-agent-empty span {
  color: var(--echo-text-secondary) !important;
  font-size: var(--echo-assistant-empty-font) !important;
  font-weight: 400 !important;
  line-height: var(--echo-assistant-empty-line) !important;
  text-align: left !important;
}

.oar-agent-composer,
.oar-sdk-agent-composer {
  position: absolute !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  flex: 0 0 auto !important;
  width: 100% !important;
  padding: 0 var(--echo-assistant-composer-pad-x) var(--echo-assistant-composer-pad-y) !important;
  border-top: 0 !important;
  background: transparent !important;
  box-sizing: border-box !important;
}

.oar-agent-input-shell,
.oar-sdk-agent-input-row {
  position: relative !important;
  width: 100% !important;
  max-width: none !important;
  height: var(--echo-assistant-editor-height) !important;
  min-height: var(--echo-assistant-editor-height) !important;
  margin: 0 !important;
  padding: 0 !important;
  display: flex !important;
  align-items: stretch !important;
  gap: 0 !important;
  border: 1px solid var(--echo-border-strong) !important;
  border-radius: var(--echo-assistant-editor-radius) !important;
  background: var(--echo-bg-raised) !important;
  box-shadow: var(--echo-shadow-sm) !important;
  box-sizing: border-box !important;
}

.oar-agent-input-shell:focus-within,
.oar-sdk-agent-input-row:focus-within {
  border-color: var(--echo-assistant-accent) !important;
  box-shadow: var(--echo-shadow-sm) !important;
}

.oar-agent-input-shell textarea,
.oar-sdk-agent-input-row textarea,
.oar-sdk-agent-input {
  height: 100% !important;
  min-height: 100% !important;
  max-height: 100% !important;
  padding: var(--echo-space-lg) calc(var(--echo-assistant-send-inner) + var(--echo-space-xl)) 48px var(--echo-space-xl) !important;
  line-height: 24px !important;
  overflow-y: auto !important;
  border: 0 !important;
  border-radius: 0 !important;
  background: transparent !important;
  color: var(--echo-text) !important;
  box-shadow: none !important;
  font-size: var(--echo-font-subheading) !important;
  resize: none !important;
  scrollbar-width: none !important;
  box-sizing: border-box !important;
}

.oar-agent-input-shell textarea::placeholder,
.oar-sdk-agent-input-row textarea::placeholder,
.oar-sdk-agent-input::placeholder {
  color: var(--echo-text-muted) !important;
  font-size: var(--echo-assistant-placeholder-font) !important;
  font-weight: 400 !important;
  line-height: var(--echo-assistant-placeholder-line) !important;
  opacity: 1 !important;
}

.oar-agent-input-shell textarea::-webkit-scrollbar,
.oar-sdk-agent-input-row textarea::-webkit-scrollbar {
  display: none !important;
}

.oar-agent-send,
.oar-agent-composer button,
.oar-sdk-agent-composer button {
  position: absolute !important;
  right: 10px !important;
  bottom: 10px !important;
  top: auto !important;
  transform: none !important;
  flex: 0 0 var(--echo-assistant-send-inner) !important;
  width: var(--echo-assistant-send-inner) !important;
  height: var(--echo-assistant-send-inner) !important;
  min-width: var(--echo-assistant-send-inner) !important;
  min-height: var(--echo-assistant-send-inner) !important;
  border-radius: var(--echo-radius-pill) !important;
}

/* Echo UI EchoREC SDK Assistant Hardening v0.1.0 */
.tasks #agent-sdk-root {
  flex: 1 1 auto !important;
  min-height: 0 !important;
  display: flex !important;
  flex-direction: column !important;
}

.tasks #agent-sdk-root .echobraid-chat {
  flex: 1 1 auto !important;
  min-height: 0 !important;
  display: flex !important;
  flex-direction: column !important;
  background: var(--echo-bg-raised) !important;
}

.tasks #agent-sdk-root .echobraid-chat-thread {
  flex: 1 1 auto !important;
  min-height: 0 !important;
  overflow-y: auto !important;
  background: var(--echo-bg-raised) !important;
}

.tasks #agent-sdk-root .echobraid-chat-thread--empty > div {
  margin: 0 !important;
  padding: var(--echo-assistant-empty-top) var(--echo-assistant-pad-x) 0 !important;
  color: var(--echo-text-secondary) !important;
  font-size: var(--echo-assistant-empty-font) !important;
  font-weight: 400 !important;
  line-height: var(--echo-assistant-empty-line) !important;
  letter-spacing: 0 !important;
  text-align: left !important;
  box-sizing: border-box !important;
}

.tasks #agent-sdk-root .echobraid-composer {
  position: static !important;
  flex: 0 0 auto !important;
  width: 100% !important;
  padding: 0 var(--echo-assistant-composer-pad-x) var(--echo-assistant-composer-pad-y) !important;
  border-top: 0 !important;
  background: var(--echo-bg-raised) !important;
  box-sizing: border-box !important;
}

.tasks #agent-sdk-root .echobraid-input {
  position: relative !important;
  width: 100% !important;
  max-width: none !important;
  height: var(--echo-assistant-editor-height) !important;
  min-height: var(--echo-assistant-editor-height) !important;
  margin: 0 !important;
  padding: 0 !important;
  display: flex !important;
  align-items: stretch !important;
  gap: 0 !important;
  border: 1px solid var(--echo-border-strong) !important;
  border-radius: var(--echo-assistant-editor-radius) !important;
  background: var(--echo-bg-raised) !important;
  box-shadow: var(--echo-shadow-sm) !important;
  box-sizing: border-box !important;
}

.tasks #agent-sdk-root .echobraid-input textarea {
  height: 100% !important;
  min-height: 100% !important;
  max-height: 100% !important;
  padding: var(--echo-space-lg) calc(var(--echo-assistant-send-inner) + var(--echo-space-xl)) 48px var(--echo-space-xl) !important;
  line-height: 24px !important;
  overflow-y: auto !important;
  border: 0 !important;
  border-radius: 0 !important;
  background: transparent !important;
  color: var(--echo-text) !important;
  box-shadow: none !important;
  font-size: var(--echo-font-subheading) !important;
  resize: none !important;
  scrollbar-width: none !important;
  box-sizing: border-box !important;
}

.tasks #agent-sdk-root .echobraid-input textarea::-webkit-scrollbar {
  display: none !important;
}

.tasks #agent-sdk-root .echobraid-input textarea::placeholder,
.tasks #agent-sdk-root .echobraid-input input::placeholder {
  color: var(--echo-text-muted) !important;
  font-size: var(--echo-assistant-placeholder-font) !important;
  font-weight: 400 !important;
  line-height: var(--echo-assistant-placeholder-line) !important;
  opacity: 1 !important;
}

.tasks #agent-sdk-root .echobraid-input button {
  position: absolute !important;
  right: 10px !important;
  bottom: 10px !important;
  top: auto !important;
  transform: none !important;
  flex: 0 0 var(--echo-assistant-send-inner) !important;
  width: var(--echo-assistant-send-inner) !important;
  height: var(--echo-assistant-send-inner) !important;
  min-width: var(--echo-assistant-send-inner) !important;
  min-height: var(--echo-assistant-send-inner) !important;
  border-radius: var(--echo-radius-pill) !important;
}

/* Echo UI EchoOffice SDK Assistant Hardening v0.1.0 */
.app[data-testid="echooffice-shell"] {
  display: grid !important;
  grid-template-columns: minmax(0, 1fr) var(--eo-chat-w, 340px) !important;
  grid-template-rows: var(--echo-titlebar) minmax(0, 1fr) !important;
  height: 100% !important;
  min-width: 0 !important;
  min-height: 0 !important;
  overflow: hidden !important;
}

.app[data-testid="echooffice-shell"] > .tabs {
  grid-column: 1 !important;
  grid-row: 1 !important;
  min-height: var(--echo-titlebar) !important;
  height: var(--echo-titlebar) !important;
}

.app[data-testid="echooffice-shell"] > .workspace {
  display: contents !important;
}

.app[data-testid="echooffice-shell"] .stage {
  grid-column: 1 !important;
  grid-row: 2 !important;
  min-width: 0 !important;
  min-height: 0 !important;
}

.app[data-testid="echooffice-shell"] #chat-mount {
  grid-column: 2 !important;
  grid-row: 1 / span 2 !important;
  width: var(--eo-chat-w, 340px) !important;
  min-width: 0 !important;
  height: 100% !important;
  min-height: 0 !important;
}

#chat-mount::before {
  content: "EchoOffice Agent" !important;
  height: var(--echo-titlebar) !important;
  min-height: var(--echo-titlebar) !important;
  max-height: var(--echo-titlebar) !important;
  flex: 0 0 var(--echo-titlebar) !important;
  padding: 0 var(--echo-assistant-pad-x) var(--echo-assistant-title-pad-bottom) !important;
  display: flex !important;
  align-items: flex-end !important;
  justify-content: flex-start !important;
  border-bottom: 1px solid var(--echo-border) !important;
  background: var(--echo-bg-raised) !important;
  color: var(--echo-text) !important;
  font-size: var(--echo-font-heading) !important;
  font-weight: 700 !important;
  line-height: 1.2 !important;
  box-sizing: border-box !important;
}

#chat-mount .echobraid-chat {
  flex: 1 1 auto !important;
  height: auto !important;
  min-height: 0 !important;
  display: flex !important;
  flex-direction: column !important;
  background: var(--echo-bg-raised) !important;
}

#chat-mount .echobraid-chat-thread {
  flex: 1 1 auto !important;
  min-height: 0 !important;
  overflow-y: auto !important;
  background: var(--echo-bg-raised) !important;
}

#chat-mount .echobraid-empty-state {
  height: auto !important;
  min-height: 0 !important;
  margin: 0 !important;
  padding: var(--echo-assistant-empty-top) var(--echo-assistant-pad-x) 0 !important;
  display: block !important;
  align-items: flex-start !important;
  justify-content: flex-start !important;
  text-align: left !important;
  color: var(--echo-text-secondary) !important;
  font-size: var(--echo-assistant-empty-font) !important;
  font-weight: 400 !important;
  line-height: var(--echo-assistant-empty-line) !important;
}

#chat-mount .echobraid-composer {
  position: static !important;
  flex: 0 0 auto !important;
  width: 100% !important;
  padding: 0 var(--echo-assistant-composer-pad-x) var(--echo-assistant-composer-pad-y) !important;
  border-top: 0 !important;
  background: var(--echo-bg-raised) !important;
  box-sizing: border-box !important;
}

#chat-mount .echobraid-input {
  position: relative !important;
  width: 100% !important;
  max-width: none !important;
  height: var(--echo-assistant-editor-height) !important;
  min-height: var(--echo-assistant-editor-height) !important;
  margin: 0 !important;
  padding: 0 !important;
  display: flex !important;
  align-items: stretch !important;
  gap: 0 !important;
  border: 1px solid var(--echo-border-strong) !important;
  border-radius: var(--echo-assistant-editor-radius) !important;
  background: var(--echo-bg-raised) !important;
  box-shadow: var(--echo-shadow-sm) !important;
  box-sizing: border-box !important;
}

#chat-mount .echobraid-input textarea {
  height: 100% !important;
  min-height: 100% !important;
  max-height: 100% !important;
  padding: var(--echo-space-lg) calc(var(--echo-assistant-send-inner) + var(--echo-space-xl)) 48px var(--echo-space-xl) !important;
  line-height: 24px !important;
  overflow-y: auto !important;
  border: 0 !important;
  border-radius: 0 !important;
  background: transparent !important;
  color: var(--echo-text) !important;
  box-shadow: none !important;
  font-size: var(--echo-font-subheading) !important;
  resize: none !important;
  scrollbar-width: none !important;
  box-sizing: border-box !important;
}

#chat-mount .echobraid-input textarea::-webkit-scrollbar {
  display: none !important;
}

#chat-mount .echobraid-input textarea::placeholder,
#chat-mount .echobraid-input input::placeholder {
  color: var(--echo-text-muted) !important;
  font-size: var(--echo-assistant-placeholder-font) !important;
  font-weight: 400 !important;
  line-height: var(--echo-assistant-placeholder-line) !important;
  opacity: 1 !important;
}

#chat-mount .echobraid-input button {
  position: absolute !important;
  right: 10px !important;
  bottom: 10px !important;
  top: auto !important;
  transform: none !important;
  flex: 0 0 var(--echo-assistant-send-inner) !important;
  width: var(--echo-assistant-send-inner) !important;
  height: var(--echo-assistant-send-inner) !important;
  min-width: var(--echo-assistant-send-inner) !important;
  min-height: var(--echo-assistant-send-inner) !important;
  border-radius: var(--echo-radius-pill) !important;
}

@media (max-width: 860px) {
  .app[data-testid="echooffice-shell"] {
    grid-template-columns: minmax(0, 1fr) !important;
  }

  .app[data-testid="echooffice-shell"] #chat-mount {
    display: none !important;
  }
}

/* Echo UI Xiaozhi Floating Assistant Contract v0.1.0 */
#chat-panel[hidden]:not(:popover-open) {
  display: none !important;
}

#chat-panel {
  --echo-assistant-accent: #6366f1;
  position: fixed !important;
  inset: 0 0 0 auto !important;
  width: min(var(--chat-panel-width, 420px), 100vw) !important;
  max-width: 100vw !important;
  height: 100dvh !important;
  min-height: 100dvh !important;
  z-index: 900 !important;
  transform: translateX(100%) !important;
  transition: transform var(--echo-ease) 220ms !important;
  overflow: hidden !important;
  box-shadow: var(--echo-shadow-lg) !important;
}

#chat-panel:popover-open,
#chat-panel.open {
  display: flex !important;
  transform: translateX(0) !important;
}

#chat-panel .chat-resize-handle {
  display: block !important;
}

#chat-panel .chat-head {
  flex: 0 0 var(--echo-titlebar) !important;
  height: var(--echo-titlebar) !important;
  min-height: var(--echo-titlebar) !important;
  max-height: var(--echo-titlebar) !important;
  padding: 0 var(--echo-assistant-pad-x) var(--echo-assistant-title-pad-bottom) !important;
  align-items: flex-end !important;
  justify-content: flex-start !important;
  border-bottom: 1px solid var(--echo-border) !important;
  box-sizing: border-box !important;
}

#chat-panel .chat-title {
  display: inline-flex !important;
  align-items: center !important;
  gap: var(--echo-space-sm) !important;
  height: auto !important;
  margin: 0 !important;
  color: var(--echo-text) !important;
  font-size: var(--echo-font-heading) !important;
  font-weight: 700 !important;
  line-height: 1.2 !important;
  letter-spacing: 0 !important;
}

#chat-panel .chat-title-icon {
  display: inline-flex !important;
  width: 18px !important;
  height: 18px !important;
}

#chat-panel .chat-head-actions {
  display: inline-flex !important;
  align-items: center !important;
  gap: var(--echo-space-sm) !important;
  margin-left: auto !important;
}

#chat-panel #btn-chat-clear {
  display: none !important;
}

#chat-panel .chat-head-actions .btn {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: var(--echo-control-md) !important;
  height: var(--echo-control-md) !important;
  min-width: var(--echo-control-md) !important;
  padding: 0 !important;
  border-radius: var(--echo-radius-md) !important;
  font-size: 0 !important;
  color: var(--echo-text) !important;
  background: transparent !important;
  border: 1px solid transparent !important;
}

#chat-panel #btn-chat-clear::before,
#chat-panel #btn-chat-close::before {
  content: "" !important;
  width: 16px !important;
  height: 16px !important;
  display: block !important;
  background: currentColor !important;
}

#chat-panel #btn-chat-clear::before {
  -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M3 12a9 9 0 1 0 3-6.7'/%3E%3Cpath d='M3 4v6h6'/%3E%3C/svg%3E") center / contain no-repeat !important;
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M3 12a9 9 0 1 0 3-6.7'/%3E%3Cpath d='M3 4v6h6'/%3E%3C/svg%3E") center / contain no-repeat !important;
}

#chat-panel #btn-chat-close::before {
  -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M18 6 6 18'/%3E%3Cpath d='m6 6 12 12'/%3E%3C/svg%3E") center / contain no-repeat !important;
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M18 6 6 18'/%3E%3Cpath d='m6 6 12 12'/%3E%3C/svg%3E") center / contain no-repeat !important;
}

#chat-panel .chat-messages {
  flex: 1 1 auto !important;
  min-height: 0 !important;
  overflow-y: auto !important;
  padding: var(--echo-assistant-empty-top) var(--echo-assistant-pad-x) 0 !important;
}

#chat-panel .chat-empty {
  padding: 0 !important;
}

#chat-panel .chat-suggest {
  flex: 0 0 auto !important;
  display: flex !important;
  flex-wrap: wrap !important;
  gap: var(--echo-space-sm) !important;
  padding: 0 var(--echo-assistant-composer-pad-x) var(--echo-space-md) !important;
  background: var(--echo-bg-raised) !important;
}

#chat-panel .chat-suggest:empty {
  display: none !important;
}

#chat-panel .chat-input-row {
  position: relative !important;
  flex: 0 0 auto !important;
  margin-top: auto !important;
  margin-left: var(--echo-assistant-composer-pad-x) !important;
  margin-right: var(--echo-assistant-composer-pad-x) !important;
  margin-bottom: var(--echo-assistant-composer-pad-y) !important;
  width: calc(100% - (var(--echo-assistant-composer-pad-x) * 2)) !important;
  height: var(--echo-assistant-editor-height) !important;
  min-height: var(--echo-assistant-editor-height) !important;
  padding: 0 !important;
  align-items: stretch !important;
  gap: 0 !important;
  border: 1px solid var(--echo-border-strong) !important;
  border-radius: var(--echo-assistant-editor-radius) !important;
  background: var(--echo-bg-raised) !important;
  box-shadow: var(--echo-shadow-sm) !important;
  box-sizing: border-box !important;
}

#chat-panel .chat-input-row textarea {
  height: 100% !important;
  min-height: 100% !important;
  max-height: 100% !important;
  padding: var(--echo-space-lg) calc(var(--echo-assistant-send-inner) + var(--echo-space-xl)) 48px var(--echo-space-xl) !important;
  line-height: 24px !important;
  overflow-y: auto !important;
  border: 0 !important;
  border-radius: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
  resize: none !important;
  scrollbar-width: none !important;
  box-sizing: border-box !important;
}

#chat-panel .chat-input-row textarea::-webkit-scrollbar {
  display: none !important;
}

#chat-panel .chat-input-row textarea::placeholder,
#chat-panel .chat-input-row input::placeholder {
  color: var(--echo-text-muted) !important;
  font-size: var(--echo-assistant-placeholder-font) !important;
  font-weight: 400 !important;
  line-height: var(--echo-assistant-placeholder-line) !important;
  opacity: 1 !important;
}

#chat-panel #btn-chat-send {
  position: absolute !important;
  right: 10px !important;
  bottom: 10px !important;
  top: auto !important;
  transform: none !important;
  height: var(--echo-assistant-send-inner) !important;
  min-height: var(--echo-assistant-send-inner) !important;
  width: var(--echo-assistant-send-inner) !important;
  min-width: var(--echo-assistant-send-inner) !important;
  flex-basis: var(--echo-assistant-send-inner) !important;
}

#chat-panel .chat-foot {
  flex: 0 0 auto !important;
  padding: 0 var(--echo-space-2xl) var(--echo-space-md) !important;
}

/* Echo UI Agent Header Alignment Guard v0.1.0 */
.tasks > .tasks-hd,
.v4-agent-rail > .agent-rail-head,
#chat-panel > .chat-head,
.app[data-testid="echooffice-shell"] #chat-mount::before {
  padding-left: var(--echo-assistant-pad-x) !important;
  padding-right: var(--echo-assistant-pad-x) !important;
  justify-content: flex-start !important;
  text-align: left !important;
}

/* Echo UI Assistant Message Spacing Guard v0.1.0 */
.tasks #agent-sdk-root .echobraid-chat-thread.echo-ui-chat-has-messages,
.tasks #agent-sdk-root .echobraid-chat-thread:has(.echobraid-bubble-row),
#chat-mount .echobraid-chat-thread.echo-ui-chat-has-messages,
#chat-mount .echobraid-chat-thread:has(.echobraid-bubble-row),
#chat-panel .chat-messages.echo-ui-chat-has-messages,
#chat-panel .chat-messages:has(.chat-msg),
.agent-rail-messages.echo-ui-chat-has-messages,
.agent-rail-messages:has(.agent-rail-message),
.oar-sdk-agent-messages.echo-ui-chat-has-messages,
.oar-sdk-agent-messages:has(.oar-sdk-agent-message) {
  padding: var(--echo-space-md) var(--echo-assistant-pad-x) 0 !important;
}

.oar-agent-shell .echobraid-chat-thread.echo-ui-chat-has-messages,
.oar-agent-shell .echobraid-chat-thread:has(.echobraid-bubble-row),
.oar-agent-shell .echobraid-chat-thread--empty:has(.echobraid-bubble-row) {
  padding: var(--echo-space-md) var(--echo-assistant-pad-x) calc(var(--echo-assistant-editor-height) + var(--echo-assistant-composer-pad-y) + var(--echo-space-md)) !important;
}

.echo-ui-icon,
[data-echo-icon] {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1em;
  height: 1em;
  color: currentColor;
  vertical-align: -0.15em;
}

.echo-ui-icon svg,
[data-echo-icon] svg {
  width: 1em;
  height: 1em;
  display: block;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.6;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.echo-ui-icon-inline {
  margin: 0 .18em;
}

.chat-title-icon,
.empty-icon,
.brand-logo,
.logo-mark,
.stage-row__icon,
.meagent-msg-avatar,
.chat-avatar,
.decision-row-icon,
.oar-delegation-banner-icon {
  font-family: var(--echo-font-sans) !important;
}

`;

const ICON_RUNTIME = `
<script>
/* Echo UI SVG Icon Runtime v0.1.0 */
(function () {
  if (window.__EchoUIIconsInstalled) return;
  window.__EchoUIIconsInstalled = true;
  const paths = {
    chat: '<path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z"/>',
    bot: '<rect x="4" y="10" width="16" height="10" rx="3"/><path d="M12 6v4"/><circle cx="12" cy="4" r="2"/><path d="M8.5 15h.01M15.5 15h.01"/>',
    user: '<path d="M20 21a8 8 0 0 0-16 0"/><circle cx="12" cy="7" r="4"/>',
    lightbulb: '<path d="M9 18h6"/><path d="M10 22h4"/><path d="M8.5 14.5A6 6 0 1 1 15.5 14.5c-.8.6-1.2 1.4-1.4 2.5H9.9c-.2-1.1-.6-1.9-1.4-2.5Z"/>',
    settings: '<path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z"/><path d="M20 12a8 8 0 0 0-.2-1.8l2-1.5-2-3.4-2.4 1a8 8 0 0 0-3-1.7L14 2h-4l-.4 2.6a8 8 0 0 0-3 1.7l-2.4-1-2 3.4 2 1.5A8 8 0 0 0 4 12c0 .6.1 1.2.2 1.8l-2 1.5 2 3.4 2.4-1a8 8 0 0 0 3 1.7L10 22h4l.4-2.6a8 8 0 0 0 3-1.7l2.4 1 2-3.4-2-1.5c.1-.6.2-1.2.2-1.8Z"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m16.5 16.5 4 4"/>',
    warning: '<path d="M12 3 2 20h20L12 3Z"/><path d="M12 9v5M12 17h.01"/>',
    check: '<path d="m20 6-11 11-5-5"/>',
    close: '<path d="M18 6 6 18M6 6l12 12"/>',
    file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z"/><path d="M14 2v6h6"/>',
    calendar: '<path d="M8 2v4M16 2v4"/><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    bell: '<path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Z"/><path d="M10 21h4"/>',
    lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    cloud: '<path d="M17.5 19H7a5 5 0 1 1 1.6-9.7A6 6 0 0 1 20 12a3.5 3.5 0 0 1-2.5 7Z"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z"/>',
    trash: '<path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="m19 6-1 14H6L5 6"/>',
    mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3M8 21h8"/>',
    play: '<path d="M8 5v14l11-7-11-7Z"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    dot: '<circle cx="12" cy="12" r="3"/>'
  };
  const emojiMap = new Map([
    ['💬', 'chat'], ['🤖', 'bot'], ['👤', 'user'], ['👨‍💼', 'user'], ['👩‍💼', 'user'], ['👨‍💻', 'user'], ['👩‍💻', 'user'], ['🧑‍🔧', 'user'], ['🧑‍🎨', 'user'], ['🧑‍🔬', 'user'], ['🧑‍💻', 'user'], ['👨', 'user'], ['👩', 'user'], ['🧑', 'user'],
    ['💡', 'lightbulb'], ['⚙', 'settings'], ['⚙️', 'settings'], ['🔍', 'search'], ['⚠', 'warning'], ['⚠️', 'warning'], ['✅', 'check'], ['✔️', 'check'], ['✓', 'check'], ['✕', 'close'], ['×', 'close'], ['❌', 'close'],
    ['📝', 'file'], ['📋', 'file'], ['📊', 'file'], ['📈', 'file'], ['📰', 'file'], ['📦', 'file'], ['📌', 'file'], ['📆', 'calendar'], ['➡️', 'arrow'], ['➕', 'plus'],
    ['🔔', 'bell'], ['🔒', 'lock'], ['🔐', 'lock'], ['☁️', 'cloud'], ['⏱️', 'clock'], ['🚨', 'warning'], ['🟢', 'check'], ['⚪', 'dot'], ['🟡', 'warning'], ['🔴', 'warning'], ['🎯', 'dot'], ['🎉', 'check'],
    ['📨', 'mail'], ['☀️', 'dot'], ['🌙', 'dot'], ['⚡', 'dot'], ['📤', 'arrow'], ['🚫', 'close'], ['↗', 'arrow'], ['↙', 'arrow'], ['✍️', 'edit'], ['🕸️', 'cloud'],
    ['🦊', 'user'], ['🐻', 'user'], ['🐼', 'user'], ['🐨', 'user'], ['🦁', 'user'], ['🐯', 'user']
  ]);
  const emojiRe = /(👨‍💼|👩‍💼|👨‍💻|👩‍💻|🧑‍🔧|🧑‍🎨|🧑‍🔬|🧑‍💻|⚙️|⚠️|✔️|☁️|⏱️|➡️|☀️|✍️|🕸️|[💬🤖👤💡⚙🔍⚠✅✓✕×❌📝📋📊📈📰📦📌📆➕🔔🔒🔐🚨🟢⚪🟡🔴🎯🎉📨🌙⚡📤🚫↗↙👨👩🧑🦊🐻🐼🐨🦁🐯])/g;
  function svg(name, size) {
    const body = paths[name] || paths.dot;
    const s = size || 16;
    return '<svg xmlns="http://www.w3.org/2000/svg" width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" aria-hidden="true"><g stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + body + '</g></svg>';
  }
  function renderIconElement(el) {
    const name = el.getAttribute('data-echo-icon');
    if (!name || el.getAttribute('data-echo-icon-rendered') === '1') return;
    el.innerHTML = svg(name, Number(el.getAttribute('data-size') || 16));
    el.setAttribute('data-echo-icon-rendered', '1');
    el.classList.add('echo-ui-icon');
  }
  function renderDataIcons(root) {
    (root || document).querySelectorAll('[data-echo-icon]').forEach(renderIconElement);
  }
  function replaceTextNode(node) {
    const text = node.nodeValue;
    if (!text || !emojiRe.test(text)) return;
    emojiRe.lastIndex = 0;
    const frag = document.createDocumentFragment();
    let last = 0;
    text.replace(emojiRe, function (match, _g, offset) {
      if (offset > last) frag.appendChild(document.createTextNode(text.slice(last, offset)));
      const span = document.createElement('span');
      span.className = 'echo-ui-icon echo-ui-icon-inline';
      span.setAttribute('data-echo-icon', emojiMap.get(match) || 'dot');
      span.setAttribute('aria-hidden', 'true');
      span.innerHTML = svg(emojiMap.get(match) || 'dot', 14);
      span.setAttribute('data-echo-icon-rendered', '1');
      frag.appendChild(span);
      last = offset + match.length;
      return match;
    });
    if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
    node.parentNode.replaceChild(frag, node);
  }
  function sanitize(root) {
    renderDataIcons(root || document);
    const walker = document.createTreeWalker(root || document.body, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const p = node.parentElement;
        if (!p || /^(SCRIPT|STYLE|TEXTAREA|INPUT|CODE|PRE)$/i.test(p.tagName)) return NodeFilter.FILTER_REJECT;
        return emojiRe.test(node.nodeValue || '') ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(replaceTextNode);
  }
  window.EchoUI = Object.assign(window.EchoUI || {}, { iconSvg: svg, renderIcons: renderDataIcons, sanitizeEmojiIcons: sanitize });
  const boot = () => sanitize(document.body);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
  if (typeof MutationObserver !== 'undefined') {
    const mo = new MutationObserver((items) => {
      for (const item of items) {
        item.addedNodes && item.addedNodes.forEach((node) => {
          if (node.nodeType === 1) sanitize(node);
          else if (node.nodeType === 3) replaceTextNode(node);
        });
      }
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });
  }
})();
</script>
`;

const CHAT_RUNTIME = `
<script>
/* Echo UI Chat Behavior Runtime v0.1.0 */
(function () {
  if (window.__EchoUIChatRuntimeInstalled) return;
  window.__EchoUIChatRuntimeInstalled = true;

  const rootSelectors = [
    '#chat-mount .echobraid-chat',
    '#agent-sdk-root .echobraid-chat',
    '#chat-panel',
    '.oar-agent-shell',
    '.oar-sdk-agent-root',
    '.v4-agent-rail',
    '.tasks',
    '.sidebar#sidebar'
  ];
  const messageSelector = [
    '.echobraid-bubble-row',
    '.chat-msg',
    '.chat-message',
    '.agent-rail-message',
    '.oar-sdk-agent-message',
    '.oar-agent-message'
  ].join(',');
  const outgoingSelector = [
    '.echobraid-bubble-row--out',
    '.chat-msg.user',
    '.chat-message.user',
    '.agent-rail-message--out',
    '.oar-sdk-agent-message--out',
    '.oar-agent-message--out'
  ].join(',');
  const emptySelector = [
    '.echobraid-empty-state',
    '.chat-empty',
    '.agent-intro',
    '.agent-rail-empty',
    '.oar-sdk-agent-empty',
    '[data-empty]',
    '.empty'
  ].join(',');
  const inputSelector = [
    'textarea',
    'input[type="text"]',
    'input:not([type])',
    '[contenteditable="true"]'
  ].join(',');
  const composerSelector = [
    '.echobraid-input',
    '.chat-input-row',
    '.agent-rail-input-row',
    '.oar-agent-input-shell',
    '.oar-sdk-agent-input-row',
    '.agent-composer',
    '.oar-agent-composer',
    '.oar-sdk-agent-composer',
    '.echobraid-composer',
    'form'
  ].join(',');
  const sendSelector = [
    '#agent-send',
    '#btn-chat-send',
    '#chat-send',
    '.chat-send',
    '.echobraid-input button',
    '.agent-rail-input-row .btn',
    '.oar-agent-send',
    '.oar-agent-composer button',
    '.oar-sdk-agent-composer button'
  ].join(',');

  function roots() {
    const set = new Set();
    rootSelectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((node) => set.add(node));
    });
    return Array.from(set);
  }

  function hasRealMessage(root) {
    return Array.from(root.querySelectorAll(messageSelector)).some((node) => {
      if (node.matches(emptySelector)) return false;
      if (node.closest(emptySelector)) return false;
      if (node.hidden) return false;
      return true;
    });
  }

  function threadFor(root) {
    return root.matches('.echobraid-chat-thread,.chat-messages,.sidebar-body')
      ? root
      : root.querySelector('.echobraid-chat-thread,.chat-messages,.sidebar-body,.agent-rail-messages,.oar-sdk-agent-messages');
  }

  function rootFor(source) {
    return source && source.closest ? source.closest(rootSelectors.join(',')) : null;
  }

  function normalizeText(value) {
    return String(value || '').replace(/\\s+/g, ' ').trim();
  }

  function readInput(input) {
    return input && input.isContentEditable ? input.textContent : input && input.value;
  }

  function usableInput(input) {
    if (!input || input.disabled || input.readOnly) return false;
    const type = (input.getAttribute('type') || '').toLowerCase();
    return !['button', 'submit', 'checkbox', 'radio', 'hidden', 'range'].includes(type);
  }

  function inputsFor(source) {
    const scope = source && source.closest ? (source.closest(composerSelector) || source.closest(rootSelectors.join(',')) || document) : document;
    return Array.from(scope.querySelectorAll(inputSelector)).filter(usableInput);
  }

  function draftFor(source) {
    const direct = source && source.matches && source.matches(inputSelector) && usableInput(source) ? source : null;
    const inputs = direct ? [direct] : inputsFor(source);
    for (const input of inputs) {
      const text = normalizeText(readInput(input));
      if (text) return text;
    }
    return '';
  }

  function messageText(node) {
    const clone = node.cloneNode(true);
    clone.querySelectorAll('[data-echo-ui-typing="1"], [data-typing], .echo-ui-typing-dot, time').forEach((child) => child.remove());
    return normalizeText(clone.textContent);
  }

  function hasOutgoingMessage(root, text) {
    const needle = normalizeText(text);
    if (!needle) return true;
    return Array.from(root.querySelectorAll(outgoingSelector)).some((node) => messageText(node) === needle);
  }

  function generatedUsers(root) {
    return Array.from(root.querySelectorAll('[data-echo-ui-user="1"]'));
  }

  function removeDuplicateGeneratedUsers(root) {
    generatedUsers(root).forEach((generated) => {
      const text = generated.getAttribute('data-echo-ui-user-text') || messageText(generated);
      const duplicate = Array.from(root.querySelectorAll(outgoingSelector)).some((node) => node !== generated && !node.hasAttribute('data-echo-ui-user') && messageText(node) === text);
      if (duplicate) generated.remove();
    });
  }

  function makeUserBubble(thread, text) {
    let node;
    let bubble;
    if (thread.matches('.chat-messages')) {
      node = document.createElement('div');
      node.className = 'chat-msg user echo-ui-generated-user';
      bubble = document.createElement('div');
      bubble.className = 'chat-bubble';
      bubble.textContent = text;
      node.appendChild(bubble);
    } else if (thread.matches('.sidebar-body')) {
      node = document.createElement('div');
      node.className = 'chat-message user echo-ui-generated-user';
      node.textContent = text;
    } else if (thread.matches('.agent-rail-messages')) {
      node = document.createElement('div');
      node.className = 'agent-rail-message agent-rail-message--out echo-ui-generated-user';
      bubble = document.createElement('div');
      bubble.className = 'agent-rail-bubble';
      bubble.textContent = text;
      node.appendChild(bubble);
    } else if (thread.matches('.oar-sdk-agent-messages')) {
      node = document.createElement('div');
      node.className = 'oar-sdk-agent-message oar-sdk-agent-message--out echo-ui-generated-user';
      bubble = document.createElement('div');
      bubble.className = 'oar-sdk-agent-bubble';
      bubble.textContent = text;
      node.appendChild(bubble);
    } else {
      node = document.createElement('div');
      node.className = 'echobraid-bubble-row echobraid-bubble-row--out echo-ui-generated-user';
      bubble = document.createElement('div');
      bubble.className = 'echobraid-bubble echobraid-bubble--out';
      bubble.textContent = text;
      node.appendChild(bubble);
    }
    node.setAttribute('data-echo-ui-user', '1');
    node.setAttribute('data-echo-ui-user-text', text);
    node.setAttribute('data-echo-i18n-ignore', '1');
    return node;
  }

  function insertUserMessage(source, text) {
    const root = rootFor(source);
    if (!root || !text || hasOutgoingMessage(root, text)) return;
    const thread = threadFor(root);
    if (!thread) return;
    const node = makeUserBubble(thread, text);
    const typing = thread.querySelector('[data-echo-ui-typing="1"]');
    if (typing && typing.parentElement === thread) thread.insertBefore(node, typing);
    else thread.appendChild(node);
    thread.classList.add('echo-ui-chat-has-messages');
    root.classList.add('echo-ui-chat-has-messages');
    thread.scrollTop = thread.scrollHeight;
  }

  function appendDots(node) {
    for (let i = 0; i < 3; i += 1) {
      const dot = document.createElement('span');
      dot.className = 'echo-ui-typing-dot';
      node.appendChild(dot);
    }
  }

  function hasNativeTyping(root) {
    return !!root.querySelector('.chat-typing-bubble, .chat-typing, .echobraid-tool-status--typing, .echobraid-typing:not([data-echo-ui-typing]), [data-typing]:not([data-echo-ui-typing])');
  }

  function removeResolvedTyping(root) {
    root.querySelectorAll('[data-echo-ui-typing="1"]').forEach((typing) => {
      let next = typing.nextElementSibling;
      while (next) {
        if (!next.matches('[data-echo-ui-typing="1"]') && next.matches('.echobraid-bubble-row--in, .chat-msg.assistant, .chat-message.agent, .agent-rail-message--in, .oar-sdk-agent-message--in, .oar-agent-message--in')) {
          typing.remove();
          return;
        }
        next = next.nextElementSibling;
      }
      const started = Number(typing.getAttribute('data-echo-ui-typing-start') || 0);
      if (started && Date.now() - started > 45000) typing.remove();
    });
  }

  function showTyping(source) {
    const root = rootFor(source);
    if (!root || hasNativeTyping(root) || root.querySelector('[data-echo-ui-typing="1"]')) return;
    const thread = threadFor(root);
    if (!thread) return;
    let node;
    if (thread.matches('.chat-messages')) {
      node = document.createElement('div');
      node.className = 'chat-msg assistant chat-typing echo-ui-generated-typing';
      const bubble = document.createElement('div');
      bubble.className = 'chat-bubble chat-typing-bubble';
      appendDots(bubble);
      node.appendChild(bubble);
    } else if (thread.matches('.sidebar-body')) {
      node = document.createElement('div');
      node.className = 'chat-message agent echo-ui-typing echo-ui-generated-typing';
      node.setAttribute('data-typing', '1');
      appendDots(node);
    } else {
      node = document.createElement('div');
      node.className = 'echobraid-bubble-row echobraid-bubble-row--in echo-ui-generated-typing';
      const bubble = document.createElement('div');
      bubble.className = 'echobraid-bubble echobraid-bubble--in echobraid-typing';
      bubble.setAttribute('data-typing', '1');
      appendDots(bubble);
      node.appendChild(bubble);
    }
    node.setAttribute('data-echo-ui-typing', '1');
    node.setAttribute('data-echo-ui-typing-start', String(Date.now()));
    thread.appendChild(node);
    thread.scrollTop = thread.scrollHeight;
    updateAll();
  }

  function updateRoot(root) {
    removeDuplicateGeneratedUsers(root);
    const has = hasRealMessage(root);
    root.classList.toggle('echo-ui-chat-has-messages', has);
    removeResolvedTyping(root);
    const thread = threadFor(root);
    if (thread) thread.classList.toggle('echo-ui-chat-has-messages', has);
    root.querySelectorAll(emptySelector).forEach((empty) => {
      if (has) {
        empty.hidden = true;
        empty.style.setProperty('display', 'none', 'important');
        empty.setAttribute('data-echo-ui-empty-hidden', '1');
      } else if (empty.getAttribute('data-echo-ui-empty-hidden') === '1') {
        empty.hidden = false;
        empty.style.removeProperty('display');
        empty.removeAttribute('data-echo-ui-empty-hidden');
      }
    });
  }

  function updateAll() {
    roots().forEach(updateRoot);
  }

  function setNativeValue(input, value) {
    if (input.isContentEditable) {
      input.textContent = value;
      return;
    }
    const proto = input instanceof HTMLTextAreaElement
      ? HTMLTextAreaElement.prototype
      : HTMLInputElement.prototype;
    const descriptor = Object.getOwnPropertyDescriptor(proto, 'value');
    if (descriptor && descriptor.set) descriptor.set.call(input, value);
    else input.value = value;
  }

  function dispatchInput(input) {
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function clearComposer(source) {
    const inputs = inputsFor(source);
    inputs.forEach((input) => {
      const current = input.isContentEditable ? input.textContent : input.value;
      if (!String(current || '').trim()) return;
      setNativeValue(input, '');
      dispatchInput(input);
    });
  }

  function afterSend(source) {
    const text = draftFor(source);
    window.setTimeout(() => {
      insertUserMessage(source, text);
      clearComposer(source);
      showTyping(source);
      updateAll();
    }, 0);
    window.setTimeout(() => {
      insertUserMessage(source, text);
      clearComposer(source);
      showTyping(source);
      updateAll();
    }, 80);
    window.setTimeout(updateAll, 220);
  }

  document.addEventListener('submit', (event) => {
    const form = event.target;
    if (form && form.matches && form.matches(composerSelector)) afterSend(form);
  }, true);

  document.addEventListener('click', (event) => {
    const button = event.target && event.target.closest ? event.target.closest(sendSelector) : null;
    if (button) afterSend(button);
  }, true);

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' || event.shiftKey || event.metaKey || event.ctrlKey || event.altKey || event.isComposing) return;
    const input = event.target && event.target.closest ? event.target.closest(inputSelector) : null;
    if (!input) return;
    if (!input.closest(rootSelectors.join(','))) return;
    afterSend(input);
  }, true);

  if (typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver(() => updateAll());
    const bootObserver = () => observer.observe(document.documentElement, { childList: true, subtree: true });
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bootObserver, { once: true });
    else bootObserver();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', updateAll, { once: true });
  else updateAll();
  window.EchoUIChat = Object.assign(window.EchoUIChat || {}, { refresh: updateAll, clearComposer, showTyping, insertUserMessage });
})();
</script>
`;

const I18N_RUNTIME = `
<script>
/* Echo UI I18N Runtime v0.1.0 */
(function () {
  if (window.__EchoUII18nInstalled) return;
  window.__EchoUII18nInstalled = true;

  const STORE_KEY = 'echo.ui.locale';
  const modes = ['zh', 'en', 'both'];
  const cjkRe = /[\\u3400-\\u9fff]/;
  const skipSelector = [
    '[data-echo-i18n-ignore]',
    '.echobraid-bubble',
    '.echobraid-bubble-row',
    '.chat-bubble',
    '.chat-msg',
    '.chat-message',
    '.agent-rail-message',
    '.oar-agent-message',
    '.oar-sdk-agent-message',
    '.history-message-content',
    '.transcript',
    '.utterance',
    '.monologue',
    '.message-content',
    '.doc-surface',
    '.pdf-page',
    '.office-frame',
    '[contenteditable="true"]'
  ].join(',');
  const attrNames = ['placeholder', 'title', 'aria-label', 'alt', 'data-tooltip'];
  const valueTypes = /^(button|submit|reset)$/i;
  const originals = new WeakMap();

  const pairs = [
    ['小智 控制台', 'Xiaozhi Console'],
    ['Echo 控制台', 'Echo Console'],
    ['控制台', 'Console'],
    ['小智助手', 'Xiaozhi Assistant'],
    ['小智', 'Xiaozhi'],
    ['助手 Assist', 'Assistant'],
    ['助手', 'Assistant'],
    ['浏览器', 'Browser'],
    ['我的智能体', 'My Agents'],
    ['管理 xiaozhi.me 上的智能体、设备与音色，所有变更即时生效。', 'Manage agents, devices, and voices on xiaozhi.me. Changes take effect immediately.'],
    ['按名称搜索智能体', 'Search agents by name'],
    ['还没有智能体', 'No agents yet'],
    ['新建智能体', 'New Agent'],
    ['创建智能体', 'Create Agent'],
    ['编辑智能体', 'Edit Agent'],
    ['删除智能体', 'Delete Agent'],
    ['智能体名称', 'Agent Name'],
    ['助手名', 'Assistant Name'],
    ['角色介绍', 'Character Profile'],
    ['记忆类型', 'Memory Type'],
    ['短期记忆', 'Short-term Memory'],
    ['高级设置', 'Advanced Settings'],
    ['识别速度', 'Recognition Speed'],
    ['语速', 'Speech Speed'],
    ['音高', 'Pitch'],
    ['官方 MCP', 'Official MCP'],
    ['未选择', 'None Selected'],
    ['全选', 'Select All'],
    ['确认删除智能体', 'Confirm Agent Deletion'],
    ['确认删除声纹', 'Confirm Voiceprint Deletion'],
    ['添加设备到智能体', 'Add Device to Agent'],
    ['目标智能体', 'Target Agent'],
    ['验证码', 'Verification Code'],
    ['设备端 MCP', 'Device MCP'],
    ['当前设备', 'Current Device'],
    ['可用工具', 'Available Tools'],
    ['新增声纹', 'New Voiceprint'],
    ['说话人名称', 'Speaker Name'],
    ['选择音频向量', 'Select Audio Vector'],
    ['会话消息', 'Session Messages'],
    ['该会话没有消息记录', 'No messages in this session'],
    ['调试日志（最近 20 次 fetch）', 'Debug Log (last 20 fetches)'],
    ['暂无 fetch 调用', 'No fetch calls yet'],
    ['MCP 接入点', 'MCP Endpoint'],
    ['刷新状态', 'Refresh Status'],
    ['复制 URL', 'Copy URL'],
    ['接入点状态', 'Endpoint Status'],
    ['当前工具', 'Current Tools'],
    ['让助手创建 MCP 服务', 'Ask Assistant to Create an MCP Service'],
    ['例：创建一个计算器 MCP 服务，支持加减乘除、平方根和百分比计算。', 'Example: create a calculator MCP service that supports add, subtract, multiply, divide, square roots, and percentages.'],
    ['例：列出我的智能体 / 创建一个叫小白的智能体 / 给 #12 加设备', 'Example: list my agents / create an agent named Xiaobai / add a device to #12'],
    ['列出我的智能体', 'List my agents'],
    ['列出已运行的 mcp_* 进程', 'List running mcp_* processes'],
    ['查看当前设备的设备端 MCP 工具', 'View device-side MCP tools on this device'],
    ['帮我创建一个叫“小白”的智能体', 'Help me create an agent named “Xiaobai”'],
    ['最近 7 天的对话', 'Conversations from the last 7 days'],
    ['思考中…', 'Thinking...'],
    ['读图输入', 'Enter CAPTCHA'],
    ['国家区号开头，如 +86', 'Start with country code, e.g. +86'],
    ['仅保存在本地 localStorage', 'Stored only in localStorage'],
    ['手机号登录', 'Phone Login'],
    ['Token 登录', 'Token Login'],
    ['使用短信验证码登录', 'Log in with SMS code'],
    ['手机号', 'Phone Number'],
    ['图形验证码', 'CAPTCHA'],
    ['短信验证码', 'SMS Code'],
    ['发送短信', 'Send SMS'],
    ['保存 token', 'Save Token'],
    ['退出登录', 'Log Out'],
    ['6 位短信码', '6-digit SMS code'],
    ['6 位设备验证码', '6-digit device code'],
    ['台湾女友', 'Taiwan Girlfriend'],
    ['普通话 (zh)', 'Mandarin (zh)'],
    ['普通话', 'Mandarin'],
    ['英语', 'English'],
    ['粤语', 'Cantonese'],
    ['声纹识别', 'Voice Recognition'],
    ['历史对话', 'Chat History'],
    ['MAC / Board 过滤', 'MAC / Board filter'],
    ['设备 (0)', 'Devices (0)'],
    ['设备', 'Devices'],
    ['音色', 'Voice'],
    ['记忆', 'Memory'],
    ['描述', 'Description'],
    ['例如：张三 / 客户本人', 'e.g. Zhang San / Customer'],
    ['可选：补充身份、场景或备注', 'Optional: add identity, context, or notes'],

    ['录音笔记', 'Recording Notes'],
    ['新建会话', 'New Session'],
    ['上传音频', 'Upload Audio'],
    ['说话人识别', 'Speaker Recognition'],
    ['开始', 'Start'],
    ['暂停', 'Pause'],
    ['结束会话', 'End Session'],
    ['未开始', 'Not Started'],
    ['正在记录', 'Recording'],
    ['已暂停', 'Paused'],
    ['笔记已完成', 'Note Completed'],
    ['今日剩余 --:--', 'Remaining today --:--'],
    ['按空格键可以标重点，AI 将重点分析这部分内容。', 'Press Space to mark a highlight. AI will analyze this part more closely.'],
    ['AI 摘要', 'AI Summary'],
    ['自动整理要点与线索', 'Automatically organizes key points and leads'],
    ['录音结束后生成摘要', 'A summary will be generated after recording ends'],
    ['逐字稿', 'Transcript'],
    ['等待录音内容', 'Waiting for recording content'],
    ['录音文件', 'Recording Files'],
    ['整段录音', 'Full Recording'],
    ['导出音频', 'Export Audio'],
    ['删除本地录音文件？此操作不可撤销。', 'Delete the local recording file? This cannot be undone.'],
    ['让 EchoREC 认识常见说话人的声音，下次录音时自动显示姓名。', 'Teach EchoREC the voices of frequent speakers so their names can appear automatically next time.'],
    ['添加说话人', 'Add Speaker'],
    ['第一步', 'Step 1'],
    ['添加一个说话人', 'Add a Speaker'],
    ['例如：张三', 'Example: Zhang San'],
    ['返回上一步', 'Back'],
    ['下一步', 'Next'],
    ['已识别的说话人', 'Recognized Speakers'],
    ['修改说话人名称', 'Rename Speaker'],
    ['可以问我会议内容、查找某段发言，或让 EchoREC 帮你整理待跟进事项。', 'Ask me about the meeting, find a specific remark, or have EchoREC organize follow-up items.'],
    ['我是 EchoREC Agent。可以直接问我会议内容，也可以让我把摘要事项交给 EchoAgent 继续处理。', 'I’m EchoREC Agent. Ask me about the meeting, or have me pass summary items to EchoAgent for follow-up.'],
    ['问 EchoREC Agent，或说：把摘要事项整理成待办', 'Ask EchoREC Agent, or say: turn summary items into todos'],
    ['问 EchoREC Agent...', 'Ask EchoREC Agent...'],
    ['Enter 发送，Shift+Enter 换行', 'Enter to send, Shift+Enter for a new line'],
    ['会议建议', 'Meeting Suggestions'],
    ['摘要识别出的研究事项', 'Research item identified from the summary'],
    ['让 Agent 处理', 'Let Agent handle it'],
    ['研究中', 'Researching'],
    ['失败可重试', 'Failed, retry available'],
    ['EchoAgent 未启动或模型未配置。请先在 EchoBraid 设置里保存模型配置，再重试。', 'EchoAgent is not running or the model is not configured. Save the model settings in EchoBraid, then try again.'],
    ['EchoAgent 未启动或模型未配置', 'EchoAgent is not running or the model is not configured'],
    ['未启动或模型未配置。请先在 EchoBraid 设置里保存模型配置，再重试。', 'is not running or the model is not configured. Save the model settings in EchoBraid, then try again.'],
    ['无法使用麦克风，请检查系统麦克风权限', 'Cannot access the microphone. Check system microphone permissions.'],
    ['没有听到清晰人声，请重新录一次', 'No clear speech was detected. Please record again.'],
    ['转写重连中…', 'Reconnecting transcription...'],
    ['未命名会议', 'Untitled Meeting'],
    ['未命名会话', 'Untitled Session'],

    ['导入文件', 'Import File'],
    ['拖入 docx、xlsx、pptx、pdf。Office 文件使用本地 ONLYOFFICE 真实编辑 surface；PDF 使用 PDF.js 只读预览。', 'Drop docx, xlsx, pptx, or pdf files. Office files use a real local ONLYOFFICE editing surface; PDFs open in read-only PDF.js preview.'],
    ['选择文件', 'Choose File'],
    ['正在检查 Office 依赖组件...', 'Checking Office dependencies...'],
    ['正在下载 / 校验 / 部署 / 启动本地 Office 编辑服务...', 'Downloading / Verifying / Deploying / Starting the local Office editing service...'],
    ['正在安装 Office 依赖组件', 'Installing Office dependencies'],
    ['Office 组件下载已暂停', 'Office component download paused'],
    ['Office 组件初始化失败', 'Office component initialization failed'],
    ['组件下载已暂停', 'Component download paused'],
    ['组件初始化失败', 'Component initialization failed'],
    ['暂停下载', 'Pause Download'],
    ['Office 依赖组件已就绪。', 'Office dependencies are ready.'],
    ['Office 依赖组件初始化超时。', 'Office dependency initialization timed out.'],
    ['依赖组件已就绪。', 'Dependencies are ready.'],
    ['依赖组件初始化超时。', 'Dependency initialization timed out.'],
    ['ONLYOFFICE runtime 未就绪', 'ONLYOFFICE runtime is not ready'],
    ['这个 Office 文件不会被 HTML 重新渲染。必须连接本地 ONLYOFFICE DocumentServer 后才能打开真实可编辑 surface。', 'This Office file will not be re-rendered as HTML. A local ONLYOFFICE DocumentServer must be connected to open the real editable surface.'],
    ['PDF.js 正在加载页面...', 'PDF.js is loading pages...'],
    ['暂不支持', 'Not supported yet'],
    ['暂无待审提案。', 'No proposals awaiting review.'],
    ['接受', 'Accept'],
    ['拒绝', 'Reject'],
    ['尚未导入文档。', 'No document imported yet.'],
    ['EchoAgent 提案', 'EchoAgent Proposal'],
    ['结构化修改已收到，等待用户审核。', 'Structured edit received. Waiting for user review.'],
    ['可以问我文档内容，或让 EchoOffice 帮你整理/改写文档。', 'Ask me about the document, or have EchoOffice organize or rewrite it.'],
    ['问 EchoOffice Agent，或说：帮我把这段文档改得更清楚', 'Ask EchoOffice Agent, or say: make this document clearer'],
    ['问 EchoOffice Agent...', 'Ask EchoOffice Agent...'],
    ['AI 通道不可用', 'AI channel unavailable'],

    ['OAR Agent', 'OAR Agent'],
    ['常驻办事入口', 'Persistent work entry'],
    ['leo的团队', 'Leo’s Team'],
    ['云端连接中', 'Connecting to cloud'],
    ['我的待办', 'My Todos'],
    ['目标概览', 'Objective Overview'],
    ['暂无待办', 'No todos'],
    ['暂无动态。', 'No activity yet.'],
    ['最新动态', 'Latest Activity'],
    ['查看更多', 'View More'],
    ['全部动态', 'All Activity'],
    ['团队最近 50 条变化。', 'Latest 50 team updates.'],
    ['团队 "leo的团队" 创建', 'Team "Leo’s Team" created'],
    ['返回首页', 'Back to Home'],
    ['创建团队', 'Create Team'],
    ['加入团队', 'Join Team'],
    ['默认使用本地连接', 'Use local connection by default'],
    ['申请远程连接', 'Request Remote Connection'],
    ['远程连接联系人', 'Remote Contact'],
    ['使用场景', 'Use Case'],
    ['你的名字', 'Your Name'],
    ['团队名称', 'Team Name'],
    ['Agent 名字（你的 AI 伙伴）', 'Agent Name (your AI partner)'],
    ['名字（你的 AI 伙伴）', 'Name (your AI partner)'],
    ['邀请链接', 'Invite Link'],
    ['微信 / 邮箱 / 手机号', 'WeChat / Email / Phone'],
    ['例如：张三的团队', 'Example: Zhang San’s Team'],
    ['粘贴 OAR-INVITE-v1... 云端邀请链接，或 TEAM-... LAN 邀请码', 'Paste an OAR-INVITE-v1 cloud invite link or a TEAM-... LAN invite code'],
    ['团队空间', 'Team Space'],
    ['加入其他团队', 'Join Another Team'],
    ['轮换团队码', 'Rotate Team Code'],
    ['添加成员', 'Add Member'],
    ['复制邀请码', 'Copy Invite Code'],
    ['配置职责', 'Configure Responsibilities'],
    ['复制 LAN 邀请', 'Copy LAN Invite'],
    ['复制远程邀请', 'Copy Remote Invite'],
    ['远程协作', 'Remote Collaboration'],
    ['申请远程协作', 'Request Remote Collaboration'],
    ['开启远程协作', 'Enable Remote Collaboration'],
    ['关闭远程协作', 'Disable Remote Collaboration'],
    ['你的 AI 助手 · 常驻办事入口', 'Your AI Assistant · Persistent work entry'],
    ['设置助手', 'Assistant Settings'],
    ['晨报', 'Morning Brief'],
    ['团队状态', 'Team Status'],
    ['当前风险', 'Current Risks'],
    ['随时把事情丢给 Agent…', 'Drop work to Agent anytime...'],
    ['直接说需求或任务… (Shift+Enter 换行)', 'Say the request or task... (Shift+Enter for a new line)'],
    ['我还没理解到要执行的具体操作。你可以直接说要创建、修改、查询或完成哪一项 OAR/TODO。', 'I do not yet understand the exact operation. You can say which OAR/TODO item to create, edit, query, or complete.'],
    ['可以，我需要先把 OAR 的关键信息补齐再创建：', 'Sure. I need a few key OAR details before creating it:'],
    ['这次目标是什么？', 'What is the goal this time?'],
    ['用哪几个结果判断目标达成？', 'Which results will prove the goal was achieved?'],
    ['第一批要推进哪些具体事项？', 'Which concrete items should move first?'],
    ['负责人：默认是你，还是要分配给其他成员？', 'Owner: should it default to you, or be assigned to another member?'],
    ['接受并创建 Objective', 'Accept and Create Objective'],
    ['不能修改上级定义文件', 'Cannot edit an upstream definition file'],
    ['标题不能为空', 'Title cannot be empty'],
    ['新 TODO...', 'New TODO...'],
    ['添加 Objective', 'Add Objective'],
    ['添加 Key Result', 'Add Key Result'],
    ['发布', 'Publish'],
    ['编辑中', 'Editing'],
    ['责任人', 'Owner'],
    ['我自己', 'Myself'],
    ['添加 Key Result：直击要点，不模棱两可', 'Add a Key Result: be direct and specific'],
    ['TODO 标题', 'TODO Title'],
    ['删除 KR', 'Delete KR'],
    ['删除 TODO', 'Delete TODO'],
    ['删除这个 Objective？它会进入归档/回收链路。', 'Delete this Objective? It will enter the archive/recycle flow.'],
    ['手动覆盖，点击清除', 'Manually overridden, click to clear'],
    ['人工', 'Manual'],
    ['决策中心', 'Decision Center'],
    ['待处理委派', 'Pending Delegations'],
    ['待审提案', 'Proposals to Review'],
    ['待处理升级', 'Pending Escalations'],
    ['点击处理', 'Click to Handle'],
    ['点击审批', 'Click to Review'],
    ['委派详情', 'Delegation Details'],
    ['提案详情', 'Proposal Details'],
    ['升级详情', 'Escalation Details'],
    ['反提议', 'Counterproposal'],
    ['批准', 'Approve'],
    ['驳回', 'Reject'],
    ['已知晓', 'Acknowledged'],
    ['已解决', 'Resolved'],
    ['先创建或加入团队', 'Create or join a team first'],
    ['Agent 暂不可用', 'Agent is unavailable'],
    ['这个筛选下暂无 OAR', 'No OAR items for this filter'],
    ['回收站为空', 'Recycle bin is empty'],
    ['数据库初始化失败', 'Database initialization failed'],
    ['数据加载失败', 'Data failed to load'],
    ['启动失败', 'Startup failed'],
    ['已切换团队空间', 'Switched team space'],
    ['团队创建成功', 'Team created'],
    ['创建失败', 'Creation failed'],
    ['清空和 OAR Agent 的对话历史？', 'Clear conversation history with OAR Agent?'],
    ['设置入口暂不可用，请稍后再试。', 'Settings entry is unavailable. Try again later.'],
    ['你和 Agent 的办事入口', 'Your work entry with Agent'],
    ['创建 OAR', 'Create OAR'],
    ['查看待办', 'View Todos'],
    ['同步给队友 Agent', 'Sync to teammates’ Agents'],
    ['告诉 Agent 你要做什么...', 'Tell Agent what you want to do...'],

    ['可以问我当前页面内容，或让 EchoAgent 帮你整理网页信息。', 'Ask me about the current page, or have EchoAgent organize webpage information.'],
    ['问 EchoAgent...', 'Ask EchoAgent...'],
    ['问 EchoAgent', 'Ask EchoAgent'],
    ['打开一个标签页开始浏览', 'Open a tab to start browsing'],
    ['用户输入 — agent 暂停', 'User input — agent paused'],

    ['链路', 'Link'],
    ['数据源', 'Data Source'],
    ['快照', 'Snapshot'],
    ['运行时', 'Runtime'],
    ['记忆星图', 'Memory Constellation'],
    ['主题地块', 'Topic Matrix'],
    ['时间流', 'Timeline'],
    ['实时事件流', 'Pulse Feed'],
    ['能力矩阵', 'Skill Matrix'],
    ['主题分布', 'Topic Distribution'],
    ['核心文件', 'Core Files'],
    ['当前 AI', 'Current AI'],
    ['定时任务', 'Scheduled Tasks'],
    ['记忆 L3·L2', 'Memory L3/L2'],
    ['能力 SKILL', 'Skills'],
    ['连接中', 'Connecting'],
    ['部分', 'Partial'],
    ['实时', 'Live'],
    ['演示', 'Demo'],
    ['无桥', 'No Bridge'],
    ['回退', 'Fallback'],
    ['健康', 'Healthy'],
    ['尚未配置', 'Not Set Up'],
    ['运行中', 'Running'],
    ['在追', 'Tracked'],
    ['节点', 'Nodes'],
    ['关联', 'Links'],
    ['个主题', 'Topics'],
    ['个月', 'Months'],
    ['个文件', 'Files'],
    ['每日 L3 记忆整理', 'Daily L3 Memory Cleanup'],
    ['索引刷新', 'Index Refresh'],
    ['冷启动', 'Warm-up'],
    ['备份', 'Backup'],
    ['陈旧记忆回收', 'Stale Memory Cleanup'],
    ['心跳', 'Heartbeat'],
    ['日终汇总推送', 'End-of-day Summary Push'],
    ['周末归档', 'Weekend Archive'],
    ['下次', 'Next'],
    ['未排期', 'Unscheduled'],
    ['上次成功', 'Last Succeeded'],
    ['上次失败', 'Last Failed'],
    ['已跳过', 'Skipped'],
    ['停用', 'Disabled'],
    ['定时', 'Schedule'],
    ['此刻', 'Now'],
    ['记忆层摄入', 'Memory Layer Ingested'],
    ['检索', 'Retrieval'],
    ['控制台 v2.0 已就绪', 'Console v2.0 Ready'],
    ['ECharts 未加载', 'ECharts not loaded'],
    ['暂无核心文件', 'No core files'],
    ['没有定时任务', 'No scheduled tasks'],
    ['暂无技能', 'No skills'],
    ['上下文', 'Context'],
    ['会话总数', 'Total Sessions'],
    ['最近 1 小时', 'Last Hour'],
    ['Token 用量', 'Token Usage'],
    ['入', 'In'],
    ['出', 'Out'],
    ['LLM 调用', 'LLM Calls'],
    ['平均延迟', 'Avg Latency'],
    ['检索次数', 'Retrievals'],

    ['首页', 'Home'],
    ['团队', 'Team'],
    ['会话', 'Chats'],
    ['创建应用', 'Create App'],
    ['导入应用', 'Import App'],
    ['搜索', 'Search'],
    ['设置', 'Settings'],
    ['清空', 'Clear'],
    ['刷新', 'Refresh'],
    ['编辑', 'Edit'],
    ['加设备', 'Add Device'],
    ['保存', 'Save'],
    ['删除', 'Delete'],
    ['取消', 'Cancel'],
    ['确认', 'Confirm'],
    ['重试', 'Retry'],
    ['关闭', 'Close'],
    ['返回', 'Back'],
    ['发送', 'Send'],
    ['新建', 'New'],
    ['新增', 'Add'],
    ['添加', 'Add'],
    ['修改', 'Edit'],
    ['打开', 'Open'],
    ['启动', 'Start'],
    ['停止', 'Stop'],
    ['恢复', 'Restore'],
    ['禁用', 'Disable'],
    ['启用', 'Enable'],
    ['状态', 'Status'],
    ['模型', 'Model'],
    ['配置', 'Configuration'],
    ['工具', 'Tools'],
    ['操作', 'Actions'],
    ['系统', 'System'],
    ['用户', 'User'],
    ['在线', 'Online'],
    ['离线', 'Offline'],
    ['成功', 'Success'],
    ['失败', 'Failed'],
    ['未连接', 'Disconnected'],
    ['已连接', 'Connected'],
    ['未配置', 'Not Configured'],
    ['正常', 'Normal'],
    ['关闭', 'Off'],
    ['慢', 'Slow'],
    ['快', 'Fast'],
    ['加载中', 'Loading'],
    ['处理中', 'Processing'],
    ['排队中', 'Queued'],
    ['登录', 'Log In'],
    ['确认删除', 'Confirm Delete'],
    ['保存中…', 'Saving...'],
    ['加载中…', 'Loading...'],
    ['点击加载', 'Click to load'],
    ['保存失败：', 'Save failed:'],
    ['加载失败：', 'Load failed:'],
    ['操作失败：', 'Operation failed:'],
    ['恢复失败', 'Restore failed'],
    ['目标', 'Objectives'],
    ['动态', 'Activity'],
    ['所有', 'All'],
    ['今天', 'Today'],
    ['暂无工具信息', 'No tool information yet'],
    ['点击刷新', 'Click to refresh'],
    ['切换主题', 'Toggle theme'],
    ['切换亮色/暗色模式', 'Toggle light/dark mode'],
    ['切换亮/暗主题', 'Toggle light/dark theme'],
    ['清空对话', 'Clear conversation'],
    ['清空对话历史', 'Clear conversation history'],
    ['调整助手宽度', 'Resize assistant'],
    ['发送（Enter）', 'Send (Enter)'],
    ['试听所选音频', 'Preview selected audio'],
    ['团队入口', 'Team entry'],
    ['OAR 工作区', 'OAR workspace'],
    ['常驻 Agent 对话框', 'Persistent Agent dialog'],
    ['设置助手名称和说明', 'Set assistant name and description'],
    ['调教 Agent 自我定义', 'Tune Agent self-definition'],
    ['断开此 peer', 'Disconnect this peer']
  ];

  const exact = new Map(pairs.map(([zh, en]) => [normalize(zh), en]));
  const sortedPairs = pairs
    .map(([zh, en]) => [normalize(zh), en])
    .filter(([zh]) => zh.length > 1)
    .sort((a, b) => b[0].length - a[0].length);
  const rules = [
    [/^今日剩余\\s+(.+)$/, 'Remaining today $1'],
    [/^已记录\\s+(\\d+)\\s+个重点，等待逐字稿对齐$/, '$1 highlights recorded. Waiting for transcript alignment'],
    [/^PDF\\.js 已渲染\\s+(\\d+)\\s+页，只读预览。$/, 'PDF.js rendered $1 pages in read-only preview.'],
    [/^PDF 预览失败：(.+)$/, 'PDF preview failed: $1'],
    [/^当前工作区版本 r(\\d+)。原文件默认不覆盖。$/, 'Current workspace version r$1. The original file is not overwritten by default.'],
    [/^已同步\\s+(.+)\\s+条远端变更$/, 'Synced $1 remote changes'],
    [/^(\\d+)\\s+个 KR$/, '$1 KRs'],
    [/^(\\d+)\\s+设备$/, '$1 devices'],
    [/^更新于\\s+(.+)$/, 'Updated $1'],
    [/^最近\\s+(\\d+)\\s+条团队变化。$/, 'Latest $1 team updates.']
  ];

  function normalize(value) {
    return String(value || '').replace(/\\s+/g, ' ').trim();
  }

  function englishFor(value) {
    const key = normalize(value);
    if (!key || !cjkRe.test(key)) return null;
    if (exact.has(key)) return exact.get(key);
    for (const [re, replacement] of rules) {
      if (re.test(key)) return key.replace(re, replacement);
    }
    let out = key;
    for (const [zh, en] of sortedPairs) {
      if (out.includes(zh)) out = out.split(zh).join(en);
    }
    return out !== key ? out : null;
  }

  function localize(original, locale) {
    const en = englishFor(original);
    if (!en) return original;
    if (locale === 'en') return en;
    if (locale === 'both') return normalize(original) + ' / ' + en;
    return original;
  }

  function shouldSkipElement(el) {
    if (!el) return true;
    if (/^(SCRIPT|STYLE|TEXTAREA|INPUT|CODE|PRE|NOSCRIPT|SVG|CANVAS)$/i.test(el.tagName)) return true;
    return !!el.closest(skipSelector);
  }

  function applyTextNode(node, locale) {
    const parent = node.parentElement;
    if (shouldSkipElement(parent)) return;
    if (!originals.has(node)) originals.set(node, node.nodeValue || '');
    const original = originals.get(node);
    if (!cjkRe.test(original || '')) return;
    const next = localize(original, locale);
    if (node.nodeValue !== next) node.nodeValue = next;
  }

  function applyElementAttributes(el, locale) {
    if (!el || el.nodeType !== 1) return;
    if (el.matches(skipSelector)) return;
    for (const attr of attrNames) {
      if (!el.hasAttribute(attr)) continue;
      const key = 'data-echo-i18n-original-' + attr.replace(/[^a-z0-9_-]/gi, '-');
      if (!el.hasAttribute(key)) el.setAttribute(key, el.getAttribute(attr) || '');
      const original = el.getAttribute(key) || '';
      if (!cjkRe.test(original)) continue;
      const next = localize(original, locale);
      if (el.getAttribute(attr) !== next) el.setAttribute(attr, next);
    }
    if (el instanceof HTMLInputElement && valueTypes.test(el.type || '') && cjkRe.test(el.value || '')) {
      if (!el.hasAttribute('data-echo-i18n-original-value')) el.setAttribute('data-echo-i18n-original-value', el.value || '');
      el.value = localize(el.getAttribute('data-echo-i18n-original-value') || '', locale);
    }
  }

  function apply(root) {
    const locale = getLocale();
    document.documentElement.lang = locale === 'en' ? 'en' : 'zh-CN';
    if (!root) root = document.body || document.documentElement;
    if (root.nodeType === 3) {
      applyTextNode(root, locale);
      return;
    }
    if (root.nodeType !== 1 && root.nodeType !== 9) return;
    const scope = root.nodeType === 9 ? root.documentElement : root;
    if (scope.nodeType === 1) applyElementAttributes(scope, locale);
    const attrWalkerRoot = scope;
    if (attrWalkerRoot.querySelectorAll) {
      attrWalkerRoot.querySelectorAll('*').forEach((el) => applyElementAttributes(el, locale));
    }
    const walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!cjkRe.test(node.nodeValue || '')) return NodeFilter.FILTER_REJECT;
        return shouldSkipElement(node.parentElement) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
      }
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => applyTextNode(node, locale));
  }

  function getLocale() {
    const saved = localStorage.getItem(STORE_KEY) || 'zh';
    return modes.includes(saved) ? saved : 'zh';
  }

  function setLocale(locale) {
    const next = modes.includes(locale) ? locale : 'zh';
    localStorage.setItem(STORE_KEY, next);
    apply(document.body || document.documentElement);
  }

  function boot() {
    apply(document.body || document.documentElement);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();

  if (typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver((items) => {
      const locale = getLocale();
      for (const item of items) {
        if (item.type === 'characterData') applyTextNode(item.target, locale);
        item.addedNodes && item.addedNodes.forEach((node) => apply(node));
        if (item.type === 'attributes') applyElementAttributes(item.target, locale);
      }
    });
    const start = () => observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: attrNames
    });
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
    else start();
  }

  window.EchoI18n = { t: englishFor, apply, getLocale, setLocale };
})();
</script>
`;

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function write(file, text) {
  fs.writeFileSync(file, text);
}

function ensureTranslateNo(html) {
  return html.replace(/<html([^>]*lang=["']zh-CN["'][^>]*)>/i, (m, attrs) => {
    return /translate=/i.test(attrs) ? m : `<html${attrs} translate="no">`;
  });
}

function stripDesignStyle(text) {
  return text.replace(/\n?\/\* Echo UI Design System v0\.1\.[\s\S]*?(?=\/\* Echo UI SVG Icon Runtime|<\/style>|$)/g, '\n');
}

function stripIconRuntime(html) {
  return html.replace(/\n?<script>\s*\/\* Echo UI SVG Icon Runtime v0\.1\.0 \*\/[\s\S]*?<\/script>\n?/g, '\n');
}

function stripChatRuntime(html) {
  return html.replace(/\n?<script>\s*\/\* Echo UI Chat Behavior Runtime v0\.1\.0 \*\/[\s\S]*?<\/script>\n?/g, '\n');
}

function stripI18nRuntime(html) {
  return html.replace(/\n?<script>\s*\/\* Echo UI I18N Runtime v0\.1\.0 \*\/[\s\S]*?<\/script>\n?/g, '\n');
}

function injectStyle(html) {
  const clean = stripDesignStyle(html);
  if (/<\/style>/i.test(clean)) return clean.replace(/<\/style>/i, `${STYLE}\n</style>`);
  return clean.replace(/<\/head>/i, `<style>${STYLE}\n</style>\n</head>`);
}

function injectRuntime(html) {
  const clean = stripI18nRuntime(stripChatRuntime(stripIconRuntime(html)));
  return clean.replace(/<\/body>/i, `${ICON_RUNTIME}\n${CHAT_RUNTIME}\n${I18N_RUNTIME}\n</body>`);
}

function normalizeHtml(html) {
  let out = ensureTranslateNo(html);
  out = out.replace(/stroke-width="1\.8"/g, 'stroke-width="1.6"');
  out = out.replace(/height:\s*72px;\s*padding:\s*0 var\(--ec-sp-xl\);/g, 'height: 52px; padding: 0 var(--ec-sp-lg);');
  out = out.replace(/<span aria-hidden="true">💬<\/span>\s*助手(?:\s*Assist)?/g, '<span data-echo-icon="chat" aria-hidden="true"></span> 助手');
  out = out.replace(/<span class="chat-title-icon">💬<\/span>/g, '<span class="chat-title-icon" data-echo-icon="chat" aria-hidden="true"></span>');
  out = injectStyle(out);
  out = injectRuntime(out);
  return out;
}

function appendStyleFile(file) {
  if (!fs.existsSync(file)) return;
  const current = stripDesignStyle(read(file));
  write(file, `${current}\n\n${STYLE}\n`);
}

function writeAppIcon(workDir, slug) {
  const meta = APP_META[slug];
  if (!meta) return;
  const dir = path.join(workDir, 'icons');
  fs.mkdirSync(dir, { recursive: true });
  write(path.join(dir, 'icon.svg'), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">${meta.iconSvg}</svg>\n`);
}

function patchEchoConsole(file) {
  if (!fs.existsSync(file)) return;
  let text = read(file);
  text = text
    .replace(/\? \['#007AFF','#5856D6','#34C759','#FF9500','#FF2D55','#FFCC00','#5AC8FA','#AF52DE'\]\s*: \['#22D3EE','#A78BFA','#34C759','#F97316','#EC4899','#FFD60A','#06B6D4','#8B5CF6'\]/,
      "? ['#dbeafe','#e0e7ff','#dcfce7','#fef3c7','#ffe4e6','#fef9c3','#e0f2fe','#f3e8ff']\n        : ['#1d4ed8','#4338ca','#047857','#b45309','#be123c','#a16207','#0e7490','#7e22ce']")
    .replace("treemapLabel: isLight ? '#1a1a2e' : '#0d0d18'", "treemapLabel: isLight ? '#111827' : '#f8fafc'")
    .replace("color: themeState.current === 'light' ? '#1a1a2e' : 'rgba(255,255,255,0.92)'", "color: themeState.current === 'light' ? '#111827' : '#f8fafc'")
    .replace(/fontFamily:'-apple-system, sans-serif'/g, "fontFamily:'-apple-system, BlinkMacSystemFont, \"SF Pro Display\", \"SF Pro Text\", \"PingFang SC\", \"Microsoft YaHei\", \"Segoe UI\", system-ui, sans-serif'")
    .replace(/stroke-width="1\.8"/g, 'stroke-width="1.6"')
    .replace(/borderRadius:4/g, 'borderRadius:8')
    .replace(/gapWidth:2/g, 'gapWidth:6');
  write(file, text);
}

function updateManifestEntries(workDir, manifest) {
  const files = [];
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      const rel = path.relative(workDir, full).split(path.sep).join('/');
      if (entry.isDirectory()) walk(full);
      else if (rel !== 'manifest.json') files.push(rel);
    }
  }
  walk(workDir);
  manifest.entries = files.sort().map((rel) => {
    const buf = fs.readFileSync(path.join(workDir, rel));
    return {
      path: rel,
      sha256: crypto.createHash('sha256').update(buf).digest('hex'),
      size: buf.length
    };
  });
}

function updateAppJson(app) {
  const file = path.join(ROOT, 'apps', app.slug, 'app.json');
  const json = JSON.parse(read(file));
  json.version = app.version;
  json.updated_at = STAMP;
  const meta = APP_META[app.slug];
  if (meta?.color) json.color = meta.color;
  if (meta?.iconSvg) json.icon_svg = meta.iconSvg;
  if (app.slug === 'web-extractor' && !json.capabilities.includes('ui')) json.capabilities.unshift('ui');
  write(file, `${JSON.stringify(json, null, 2)}\n`);
}

function updateChangelog(app) {
  const file = path.join(ROOT, 'apps', app.slug, 'changelog.md');
  let text = read(file);
  if (text.includes(`## ${app.version} - 2026-05-07`)) return;
  const entry = [
    `## ${app.version} - 2026-05-07`,
    '',
    '- Apply the EchoApp shared Design Hub design system across fonts, spacing, radius, controls, themes, and SVG icon handling.',
    '- Add `translate="no"` and runtime SVG replacement for legacy emoji glyphs.',
    '- Tighten the shared hero-title override so repackaged apps cannot keep oversized source headings after merge/rebase.',
    '- Hide app-local language and theme toggle buttons; locale and color mode are controlled by the platform while both modes remain supported.',
    '- Preserve sent user chat bubbles before showing the waiting indicator, with duplicate cleanup when native rendering catches up.',
    '- Flatten home toolbar/list alignment so search rows and cards align with page titles without an extra surface.',
    '',
    ''
  ].join('\n');
  text = text.replace(/# Changelog\n\n/, `# Changelog\n\n${entry}`);
  write(file, text);
}

function refactorZipApp(app) {
  const appDir = path.join(ROOT, 'apps', app.slug);
  const echoPath = path.join(appDir, 'app.echo');
  const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), `echoapp-${app.slug}-`));
  execFileSync('unzip', ['-q', echoPath, '-d', tmpRoot]);

  for (const rel of app.htmlFiles || []) {
    const file = path.join(tmpRoot, rel);
    if (fs.existsSync(file)) {
      let html = normalizeHtml(read(file));
      if (app.slug === 'xiaozhi') {
        html = html.replace(/(<span class="brand-ver">)v[^<]+(<\/span>)/, `$1v${app.version}$2`);
      }
      write(file, html);
    }
  }
  for (const rel of app.cssFiles || []) appendStyleFile(path.join(tmpRoot, rel));
  writeAppIcon(tmpRoot, app.slug);

  if (app.slug === 'xiaozhi') {
    const js = path.join(tmpRoot, 'app.js');
    if (fs.existsSync(js)) {
      let text = read(js);
      text = text.replace("tool: '⚙'", "tool: 'tool'");
      text = text.replace(/<span class="chat-title-icon">💬<\/span>/g, '<span class="chat-title-icon" data-echo-icon="chat" aria-hidden="true"></span>');
      write(js, text);
    }
    const css = path.join(tmpRoot, 'app.css');
    if (fs.existsSync(css)) {
      let text = read(css);
      text = text.replace("content: '💡';", "content: ''; width: 16px; height: 16px; margin-top: 1px; background: currentColor; -webkit-mask: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M9 18h6'/%3E%3Cpath d='M10 22h4'/%3E%3Cpath d='M8.5 14.5A6 6 0 1 1 15.5 14.5c-.8.6-1.2 1.4-1.4 2.5H9.9c-.2-1.1-.6-1.9-1.4-2.5Z'/%3E%3C/svg%3E\") center / contain no-repeat; mask: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M9 18h6'/%3E%3Cpath d='M10 22h4'/%3E%3Cpath d='M8.5 14.5A6 6 0 1 1 15.5 14.5c-.8.6-1.2 1.4-1.4 2.5H9.9c-.2-1.1-.6-1.9-1.4-2.5Z'/%3E%3C/svg%3E\") center / contain no-repeat;");
      write(css, text);
    }
  }

  if (app.slug === 'oar') {
    for (const rel of ['code/agent-client-panel.jsx', 'code/agent-client-panel.js']) {
      const panelFile = path.join(tmpRoot, rel);
      if (!fs.existsSync(panelFile)) continue;
      let panel = read(panelFile);
      panel = panel
        .replace(/el\.style\.height = '56px';\s*const next = Math\.min\(Math\.max\(el\.scrollHeight, 44\), 156\);\s*el\.style\.height = `\$\{next\}px`;\s*el\.style\.overflowY = el\.scrollHeight > 156 \? 'auto' : 'hidden';/g, "el.style.height = '56px';\n    el.style.overflowY = 'hidden';")
        .replace(/el\.style\.height = "56px";\s*const next = Math\.min\(Math\.max\(el\.scrollHeight, 44\), 156\);\s*el\.style\.height = `\$\{next\}px`;\s*el\.style\.overflowY = el\.scrollHeight > 156 \? "auto" : "hidden";/g, 'el.style.height = "56px";\n      el.style.overflowY = "hidden";')
        .replace(/const next = Math\.min\(156, Math\.max\(44, el\.scrollHeight\)\);\s*el\.style\.height = `\$\{next\}px`;\s*el\.style\.overflowY = el\.scrollHeight > 156 \? 'auto' : 'hidden';/g, "el.style.height = '56px';\n    el.style.overflowY = 'hidden';")
        .replace(/const next = Math\.min\(156, Math\.max\(44, el\.scrollHeight\)\);\s*el\.style\.height = `\$\{next\}px`;\s*el\.style\.overflowY = el\.scrollHeight > 156 \? "auto" : "hidden";/g, 'el.style.height = "56px";\n      el.style.overflowY = "hidden";')
        .replace(/el\.style\.height = 'auto';/g, "el.style.height = '56px';")
        .replace(/el\.style\.height = "auto";/g, 'el.style.height = "56px";')
        .replace(/const next=\w+\.min\(156,\w+\.max\(44,\w+\.scrollHeight\)\);\w+\.style\.height=`\$\{next\}px`;\w+\.style\.overflowY=\w+\.scrollHeight>156\?'auto':'hidden';/g, "el.style.height='56px';el.style.overflowY='hidden';");
      write(panelFile, panel);
    }

    const js = path.join(tmpRoot, 'code/app.js');
    if (fs.existsSync(js)) {
      let text = read(js);
      text = text
        .replace(/return `<svg class="oar-logo-svg" viewBox="0 0 64 64" aria-hidden="true" focusable="false">[\s\S]*?<\/svg>`;/, `return \`<svg class="oar-logo-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="8.2"></circle>
      <circle cx="12" cy="12" r="4.6"></circle>
      <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"></circle>
      <path d="M12 2.8v3M12 18.2v3M2.8 12h3M18.2 12h3"></path>
    </g>
  </svg>\`;`)
        .replace(/avatar TEXT DEFAULT '👤'/g, "avatar TEXT DEFAULT 'U'")
        .replace(/avatar TEXT DEFAULT '🤖'/g, "avatar TEXT DEFAULT 'AI'")
        .replace(/avatar = '👤'/g, "avatar = 'U'")
        .replace(/avatar = '🤖'/g, "avatar = 'AI'")
        .replace(/avatar: '👤'/g, "avatar: 'U'")
        .replace(/avatar: '🤖'/g, "avatar: 'AI'")
        .replace(/agent_name: 'Claw', avatar: '🤖'/g, "agent_name: 'Claw', avatar: 'AI'")
        .replace(/\$\{esc\(pair\.avatar \|\| '🤖'\)\}/g, "${esc(pair.avatar || 'AI')}")
        .replace(/\$\{esc\(pair\.avatar \|\| '💬'\)\}/g, "${esc(pair.avatar || 'AI')}")
        .replace(/\['👨‍💼','👩‍💼','👨‍💻','👩‍💻','🧑‍🔧','🧑‍🎨','🧑‍🔬','🧑‍💻','👤','👨','👩','🧑','🦊','🐻','🐼','🐨','🦁','🐯'\]/g, "['PM','OPS','DEV','QA','UX','SCI','AI','U']")
        .replace(/function feedIconOf\(t\) \{[\s\S]*?\n\}/, "function feedIconOf(t) {\n  return '';\n}");
      write(js, text);
    }
  }

  if (app.slug === 'echooffice') {
    const officeJs = path.join(tmpRoot, 'code/app.js');
    if (fs.existsSync(officeJs)) {
      let text = read(officeJs);
      text = text.replace(
        /placeholder:"跟 AI 说一下要做什么 \(Enter 发送 \/ Shift\+Enter 换行\)"/g,
        'placeholder:"问 EchoOffice Agent，或说：帮我把这段文档改得更清楚"'
      );
      write(officeJs, text);
    }
  }

  if (app.slug === 'echo-console') {
    patchEchoConsole(path.join(tmpRoot, 'index.html'));
  }

  const manifestPath = path.join(tmpRoot, 'manifest.json');
  const manifest = JSON.parse(read(manifestPath));
  manifest.version = app.version;
  if (APP_META[app.slug]?.color) manifest.color = APP_META[app.slug].color;
  if (APP_META[app.slug]?.iconSvg) manifest.icon_svg = APP_META[app.slug].iconSvg;
  updateManifestEntries(tmpRoot, manifest);
  write(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

  const nextEcho = path.join(os.tmpdir(), `${app.slug}.app.echo`);
  try { fs.unlinkSync(nextEcho); } catch {}
  execFileSync('zip', ['-X', '-qr', nextEcho, '.'], { cwd: tmpRoot });
  fs.copyFileSync(nextEcho, echoPath);
}

function refactorLegacyJsonApp(app) {
  const file = path.join(ROOT, 'apps', app.slug, 'app.echo');
  const pkg = JSON.parse(read(file));
  pkg.manifest.version = app.version;
  pkg.html = normalizeHtml(pkg.html);
  pkg.html = pkg.html.replace(/id="app-version">v[^<]+</, `id="app-version">v${app.version}<`);
  write(file, `${JSON.stringify(pkg, null, 2)}\n`);
}

function updateCatalog() {
  const file = path.join(ROOT, 'catalog.json');
  const json = JSON.parse(read(file));
  json.updated_at = STAMP;
  write(file, `${JSON.stringify(json, null, 2)}\n`);
}

for (const app of APPS) {
  updateAppJson(app);
  updateChangelog(app);
  if (app.zip) refactorZipApp(app);
  else refactorLegacyJsonApp(app);
  console.log(`refactored ${app.slug} -> ${app.version}`);
}
updateCatalog();
console.log('done');
