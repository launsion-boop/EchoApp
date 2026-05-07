#!/usr/bin/env node

const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const TARGETS = [
  { slug: 'xiaozhi', kind: 'zip', files: ['app.css', 'index.html', 'login.html', 'assistant.html'] },
  { slug: 'echorec', kind: 'zip', files: ['index.html'] },
  { slug: 'oar', kind: 'zip', files: ['code/app.css', 'code/agent-client-panel.css', 'code/agent-client-panel-custom.css', 'index.html'] },
  { slug: 'echooffice', kind: 'zip', files: ['code/app.css', 'index.html'] },
  { slug: 'echo-console', kind: 'zip', files: ['index.html'] }
];

const BROWSER_ROOT = '/Users/pc/Desktop/echobraid/packages/factory-apps/browser';
const REQUIRED_STYLE_MARKER = 'Echo UI Design System v0.1.4';
const REQUIRED_ASSISTANT_MARKER = 'Echo UI Assistant Rail Contract v0.1.0';
const REQUIRED_ASSISTANT_HEADER_ALIGN_MARKER = 'Echo UI Agent Header Alignment Guard v0.1.0';
const REQUIRED_INPUT_FOCUS_MARKER = 'Echo UI Input Focus Contract v0.1.0';
const REQUIRED_ASSISTANT_MESSAGE_MARKER = 'Echo UI Assistant Message Contract v0.1.0';
const REQUIRED_ASSISTANT_MESSAGE_SPACING_MARKER = 'Echo UI Assistant Message Spacing Guard v0.1.0';
const REQUIRED_CHAT_RUNTIME_MARKER = 'Echo UI Chat Behavior Runtime v0.1.0';
const REQUIRED_THEME_RUNTIME_MARKER = 'Echo UI Theme Runtime v0.1.0';
const REQUIRED_PLATFORM_MODE_MARKER = 'Echo UI Platform Mode Contract v0.1.0';
const REQUIRED_DARK_READABILITY_MARKER = 'Echo UI Dark Readability Contract v0.1.0';
const REQUIRED_I18N_RUNTIME_MARKER = 'Echo UI I18N Runtime v0.1.0';
const REQUIRED_OAR_COMPOSER_MARKER = 'Echo UI OAR Agent Composer Contract v0.1.0';
const REQUIRED_OAR_THEME_MARKER = 'Echo UI OAR Blue Theme Contract v0.1.0';
const REQUIRED_OAR_HOME_MARKER = 'Echo UI OAR Home Workbench Contract v0.1.0';
const REQUIRED_XIAOZHI_FLOATING_MARKER = 'Echo UI Xiaozhi Floating Assistant Contract v0.1.0';
const REQUIRED_ECHOREC_SDK_MARKER = 'Echo UI EchoREC SDK Assistant Hardening v0.1.0';
const REQUIRED_ECHOOFFICE_SDK_MARKER = 'Echo UI EchoOffice SDK Assistant Hardening v0.1.0';
const errors = [];

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function lineOf(text, needle) {
  const i = text.indexOf(needle);
  if (i < 0) return 0;
  return text.slice(0, i).split('\n').length;
}

function fail(scope, file, message, line = 0) {
  errors.push({ scope, file, line, message });
}

function unpack(slug) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), `echoapp-design-audit-${slug}-`));
  execFileSync('unzip', ['-q', path.join(ROOT, 'apps', slug, 'app.echo'), '-d', dir]);
  return dir;
}

function requireText(scope, file, text, needle, message) {
  if (!text.includes(needle)) fail(scope, file, message, lineOf(text, needle));
}

function rejectPattern(scope, file, text, pattern, message) {
  const lines = text.split('\n');
  lines.forEach((line, i) => {
    if (pattern.test(line)) fail(scope, file, message, i + 1);
  });
}

function auditManifest(scope, manifest, file) {
  if (!manifest.icon_svg) fail(scope, file, 'missing manifest.icon_svg for Desktop app list icon');
  if (!manifest.color) fail(scope, file, 'missing manifest.color for Desktop app list tile');
  const brandedIcon = scope === 'echo-console' && manifest.icon_svg && manifest.icon_svg.includes('ec-ibg');
  if (manifest.icon_svg && !brandedIcon && !/stroke-width=['"]1\.6['"]/.test(manifest.icon_svg)) {
    fail(scope, file, 'manifest.icon_svg must use 1.6 stroke width');
  }
  if (manifest.icon_svg && /transform=['"]translate\(/.test(manifest.icon_svg)) {
    fail(scope, file, 'manifest.icon_svg must be centered in the host 24x24 viewBox without translate offsets');
  }
  if (scope === 'oar' && manifest.color !== '#2563eb') {
    fail(scope, file, 'OAR manifest color must use the unified blue theme #2563eb');
  }
  if (scope === 'oar') {
    requireText(scope, file, manifest.icon_svg || '', "circle cx='12' cy='12'", 'OAR manifest icon must be a centered SVG target');
    rejectPattern(scope, file, manifest.icon_svg || '', /M17 17l5 5/, 'OAR manifest icon must not use the old magnifier handle');
  }
}

function auditIconFile(scope, file) {
  if (!fs.existsSync(file)) {
    fail(scope, file, 'missing icons/icon.svg for Desktop app list icon fallback');
    return;
  }
  const text = read(file);
  requireText(scope, file, text, 'viewBox="0 0 24 24"', 'icons/icon.svg must use the host 24x24 viewBox');
  const brandedIcon = scope === 'echo-console' && text.includes('ec-ibg');
  if (!brandedIcon && !/stroke-width=['"]1\.6['"]/.test(text)) fail(scope, file, 'icons/icon.svg must use 1.6 stroke width');
  if (brandedIcon) requireText(scope, file, text, '#22d3ee', 'Echo Console branded icon must keep the internal waveform mark');
  rejectPattern(scope, file, text, /viewBox=["']0 0 64 64["']/, 'icons/icon.svg must not use a 64x64 colored tile');
  rejectPattern(scope, file, text, /transform=['"]translate\(/, 'icons/icon.svg glyph must not be translated to the lower-right');
}

function auditAppJson(scope) {
  const file = path.join(ROOT, 'apps', scope, 'app.json');
  const json = JSON.parse(read(file));
  if (!json.icon_svg) fail(scope, file, 'missing app.json icon_svg for registry/list icon');
  if (!json.color) fail(scope, file, 'missing app.json color');
  const brandedIcon = scope === 'echo-console' && json.icon_svg && json.icon_svg.includes('ec-ibg');
  if (json.icon_svg && !brandedIcon && !/stroke-width=['"]1\.6['"]/.test(json.icon_svg)) {
    fail(scope, file, 'app.json icon_svg must use 1.6 stroke width');
  }
  if (json.icon_svg && /transform=['"]translate\(/.test(json.icon_svg)) {
    fail(scope, file, 'app.json icon_svg must be centered in the host 24x24 viewBox without translate offsets');
  }
  if (scope === 'oar' && json.color !== '#2563eb') {
    fail(scope, file, 'OAR app.json color must use the unified blue theme #2563eb');
  }
  if (scope === 'oar') {
    requireText(scope, file, json.icon_svg || '', "circle cx='12' cy='12'", 'OAR app.json icon must be a centered SVG target');
    rejectPattern(scope, file, json.icon_svg || '', /M17 17l5 5/, 'OAR app.json icon must not use the old magnifier handle');
  }
  if (scope === 'echooffice') {
    requireText(scope, file, json.icon_svg || '', "path d='M6.5 3.8h8.2l3.8 3.8v12.6", 'EchoOffice app.json icon must show one clear document shape');
    requireText(scope, file, json.icon_svg || '', "M14.5 4v4h4", 'EchoOffice app.json icon must show a folded document corner');
    requireText(scope, file, json.icon_svg || '', "M13.5 16h3.2M13.5 18.5h3.2", 'EchoOffice app.json icon must show a simple table area without overlapping shapes');
  }
}

function auditSharedCss(scope, file, text) {
  requireText(scope, file, text, REQUIRED_STYLE_MARKER, 'missing shared design style marker');
  requireText(scope, file, text, REQUIRED_ASSISTANT_MARKER, 'missing shared assistant rail contract');
  requireText(scope, file, text, REQUIRED_ASSISTANT_HEADER_ALIGN_MARKER, 'missing assistant header alignment guard');
  requireText(scope, file, text, REQUIRED_INPUT_FOCUS_MARKER, 'missing rounded input focus contract');
  requireText(scope, file, text, REQUIRED_ASSISTANT_MESSAGE_MARKER, 'missing shared assistant message/bubble contract');
  requireText(scope, file, text, REQUIRED_ASSISTANT_MESSAGE_SPACING_MARKER, 'missing final assistant message spacing guard');
  requireText(scope, file, text, REQUIRED_PLATFORM_MODE_MARKER, 'missing platform-owned language/theme mode contract');
  requireText(scope, file, text, REQUIRED_DARK_READABILITY_MARKER, 'missing dark readability override contract');
  requireText(scope, file, text, 'input[type="file"]::file-selector-button', 'dark mode must explicitly style native file chooser buttons');
  requireText(scope, file, text, '.dropzone .primary', 'EchoOffice dropzone primary action must keep readable dark-mode contrast');
  requireText(scope, file, text, '.theme-toggle,', 'missing app-local theme toggle hide rule');
  rejectPattern(scope, file, text, /\.echo-i18n-toggle/, 'apps must not render a visible language toggle; platform owns locale switching');
  requireText(scope, file, text, '"PingFang SC"', 'missing macOS Chinese font');
  requireText(scope, file, text, '"Microsoft YaHei"', 'missing Windows Chinese font');
  requireText(scope, file, text, '.brand,', 'EchoREC/sidebar brand header is not bound to shared topbar contract');
  requireText(scope, file, text, '.tasks-hd,', 'EchoREC/right agent header is not bound to shared topbar contract');
  requireText(scope, file, text, 'height: var(--echo-titlebar) !important;', 'topbar must hard-lock to 52px');
  requireText(scope, file, text, '.topbar .stop-btn {\n  border-radius: var(--echo-radius-pill) !important;', 'EchoREC topbar mic/stop controls must be circular');
  requireText(scope, file, text, 'justify-content: center !important;', 'button/quota text must be centered');
  requireText(scope, file, text, 'box-shadow: var(--echo-shadow-sm) !important;', 'cards must use shared shadow');
  requireText(scope, file, text, '.page-hero-mono {\n  display: none !important;', 'xiaozhi home eyebrow must be removed');
  requireText(scope, file, text, '.page-hero {\n  text-align: left !important;', 'xiaozhi home hero must align to the search input left edge');
  requireText(scope, file, text, '.page-hero-title {\n  margin: 0 0 var(--echo-space-xs) !important;\n  text-align: left !important;\n  font-size: var(--echo-font-title) !important;', 'xiaozhi home hero title must not keep the oversized original clamp font');
  requireText(scope, file, text, '.page-hero-sub {\n  margin: 0 !important;', 'xiaozhi home hero copy must not be centered');
  requireText(scope, file, text, 'color: var(--echo-text-secondary) !important;', 'xiaozhi home hero copy must use shared readable secondary text color');
  requireText(scope, file, text, '.detail-tabs button.active::after {\n  content: none !important;', 'xiaozhi detail tabs must not draw an underline through the active label');
  requireText(scope, file, text, 'text-decoration: none !important;', 'navigation tabs must not show strike-through or underline decoration');
  requireText(scope, file, text, '#chat-panel .chat-head', 'xiaozhi assistant header must be bound to the shared assistant contract');
  requireText(scope, file, text, 'padding: 0 var(--echo-assistant-pad-x) var(--echo-assistant-title-pad-bottom) !important;', 'xiaozhi assistant header title must bottom-align with shared spacing');
  requireText(scope, file, text, REQUIRED_XIAOZHI_FLOATING_MARKER, 'xiaozhi floating assistant close/input contract is missing');
  requireText(scope, file, text, '#chat-panel[hidden]:not(:popover-open)', 'xiaozhi assistant must be hidden when closed');
  requireText(scope, file, text, '#chat-panel .chat-head-actions', 'xiaozhi assistant close actions must remain visible');
  requireText(scope, file, text, '#chat-panel #btn-chat-close::before', 'xiaozhi assistant close button must use SVG mask');
  requireText(scope, file, text, '#chat-panel .chat-input-row textarea::-webkit-scrollbar', 'xiaozhi multiline editor scrollbar must be visually hidden');
  requireText(scope, file, text, '#chat-panel .chat-input-row textarea::placeholder', 'xiaozhi placeholder size must be explicitly normalized');
  requireText(scope, file, text, '#chat-panel #btn-chat-send', 'xiaozhi send button must be normalized');
  requireText(scope, file, text, '#chat-mount::before', 'EchoOffice assistant header must be bound to the shared assistant contract');
  requireText(scope, file, text, '#chat-mount .echobraid-empty-state', 'EchoOffice assistant empty state must be normalized');
  requireText(scope, file, text, '#chat-mount .echobraid-input', 'EchoOffice assistant composer must be normalized');
  requireText(scope, file, text, REQUIRED_ECHOOFFICE_SDK_MARKER, 'EchoOffice SDK assistant hardening is missing');
  requireText(scope, file, text, '.app[data-testid="echooffice-shell"]', 'EchoOffice app grid must be normalized so assistant starts at top edge');
  requireText(scope, file, text, 'grid-row: 1 / span 2 !important;', 'EchoOffice assistant rail must span the tab bar and workspace rows');
  requireText(scope, file, text, '#chat-mount .echobraid-input textarea', 'EchoOffice SDK textarea must be locked to EchoREC composer size');
  requireText(scope, file, text, '#chat-mount .echobraid-input textarea::-webkit-scrollbar', 'EchoOffice SDK editor scrollbar must be visually hidden');
  requireText(scope, file, text, '#chat-mount .echobraid-input textarea::placeholder', 'EchoOffice SDK placeholder size must be explicitly normalized');
  requireText(scope, file, text, '#chat-mount .echobraid-input button', 'EchoOffice SDK send button must be locked to EchoREC composer size');
  requireText(scope, file, text, '--echo-assistant-title-pad-bottom: 12px;', 'assistant title must sit closer to the divider line');
  requireText(scope, file, text, 'align-items: flex-end !important;', 'assistant title must bottom-align inside the shared titlebar');
  requireText(scope, file, text, '.tasks > .tasks-hd', 'EchoREC assistant title must use the same left edge as the empty text');
  requireText(scope, file, text, REQUIRED_ECHOREC_SDK_MARKER, 'EchoREC SDK assistant hardening is missing');
  requireText(scope, file, text, '.tasks #agent-sdk-root .echobraid-chat-thread--empty > div', 'EchoREC SDK empty text must align with the shared assistant title');
  requireText(scope, file, text, '.tasks #agent-sdk-root .echobraid-input textarea', 'EchoREC SDK textarea must be locked to EchoREC composer size');
  requireText(scope, file, text, '.tasks #agent-sdk-root .echobraid-input textarea::placeholder', 'EchoREC SDK placeholder size must be explicitly normalized');
  requireText(scope, file, text, '.tasks #agent-sdk-root .echobraid-input button', 'EchoREC SDK send button must be locked to EchoREC composer size');
  requireText(scope, file, text, '--echo-assistant-editor-height: 104px;', 'assistant editor must support multiline input height');
  requireText(scope, file, text, '--echo-assistant-editor-radius: 24px;', 'assistant editor must use large rounded rectangle radius instead of pill');
  requireText(scope, file, text, '--echo-assistant-send-inner: 44px;', 'assistant send button must be the inner floating EchoREC size');
  requireText(scope, file, text, '--echo-assistant-placeholder-font: 14px;', 'assistant input placeholder font size must be unified');
  requireText(scope, file, text, '--echo-assistant-placeholder-line: 22px;', 'assistant input placeholder line height must be unified');
  requireText(scope, file, text, 'border-top: 0 !important;', 'assistant composer must not draw a footer divider behind the floating input');
  requireText(scope, file, text, 'position: absolute !important;', 'assistant send button must float inside the input pill');
  requireText(scope, file, text, ':focus-within', 'assistant editor focus must change the rounded container border');
  requireText(scope, file, text, 'outline: none !important;', 'inputs must not draw square focus outlines');
  requireText(scope, file, text, '.echo-ui-chat-has-messages', 'assistant empty state must hide after messages arrive');
  requireText(scope, file, text, '#chat-mount .echobraid-chat-thread:has(.echobraid-bubble-row)', 'EchoOffice message thread must keep side padding after app-specific overrides');
  requireText(scope, file, text, '.tasks #agent-sdk-root .echobraid-chat-thread:has(.echobraid-bubble-row)', 'EchoREC message thread must keep side padding after SDK overrides');
  requireText(scope, file, text, '#chat-panel .chat-messages:has(.chat-msg)', 'xiaozhi message thread must keep side padding after panel overrides');
  requireText(scope, file, text, '.echobraid-bubble-row--out', 'SDK outgoing bubbles must be normalized');
  requireText(scope, file, text, '.chat-msg.user .chat-bubble', 'xiaozhi outgoing bubbles must be normalized');
  requireText(scope, file, text, '.chat-typing-bubble', 'assistant typing bubble must use the shared three-dot contract');
  requireText(scope, file, text, '@keyframes echo-ui-typing-dot', 'assistant typing dots must share one animation');
  requireText(scope, file, text, '.oar-sdk-agent-actions', 'OAR assistant extra header actions must be normalized');
  requireText(scope, file, text, REQUIRED_OAR_THEME_MARKER, 'OAR must use the unified blue theme contract');
  requireText(scope, file, text, REQUIRED_OAR_HOME_MARKER, 'OAR home page must use the structured workbench contract');
  requireText(scope, file, text, '--echo-oar-accent: #2563eb;', 'OAR theme token must match the active blue navigation color');
  requireText(scope, file, text, '.v4-brand-mark,', 'OAR app logo must be bound to the blue theme contract');
  requireText(scope, file, text, '.app-logo-icon,', 'OAR legacy app logo container must be bound to the blue theme contract');
  requireText(scope, file, text, '.app-logo-icon:not(:has(svg))::before', 'OAR legacy app logo fallback must draw the SVG target');
  requireText(scope, file, text, '.v4-top-nav .v4-nav-item.active', 'OAR active navigation must be bound to the blue theme contract');
  requireText(scope, file, text, '.home-metric-card {', 'OAR home metrics must have an explicit left-aligned card layout');
  requireText(scope, file, text, '.home-feed-item {', 'OAR home activity must have an explicit left-aligned row layout');
  requireText(scope, file, text, 'grid-template-columns: minmax(0, 1fr)', 'OAR home activity rows must not reserve unclear icon space');
  requireText(scope, file, text, '.home-feed-icon {\n  display: none !important;', 'OAR home activity must not show unclear decorative icons');
  requireText(scope, file, text, '.feed-list {\n  padding: var(--echo-space-lg) var(--echo-space-xl) !important;', 'OAR full feed list must keep readable left padding after icon removal');
  requireText(scope, file, text, '#feed-back-home {', 'OAR full feed back control must be normalized as an icon button');
  requireText(scope, file, text, '#feed-back-home::before', 'OAR full feed back control must draw a centered SVG chevron');
  requireText(scope, file, text, '.detail-back {', 'xiaozhi detail back control must be normalized as an icon button');
  requireText(scope, file, text, '.detail-back::before', 'xiaozhi detail back control must draw a centered SVG chevron');
  requireText(scope, file, text, 'font-size: 0 !important;', 'page-level back controls must hide ugly text labels visually');
  requireText(scope, file, text, '.oar-sdk-agent-avatar,', 'OAR agent avatar must be bound to the blue theme contract');
  requireText(scope, file, text, REQUIRED_OAR_COMPOSER_MARKER, 'OAR assistant composer multiline contract is missing');
  requireText(scope, file, text, '.oar-agent-shell .echobraid-chat-thread', 'OAR chat body must own the composer spacing');
  requireText(scope, file, text, '.oar-agent-shell .echobraid-chat-thread:has(.echobraid-bubble-row)', 'OAR chat messages must keep side padding after the composer spacing override');
  requireText(scope, file, text, '.oar-sdk-agent-empty', 'OAR assistant empty state must align with the shared assistant title');
  requireText(scope, file, text, 'background: transparent !important;', 'OAR assistant composer must not render as a separate bottom footer');
  requireText(scope, file, text, '.oar-agent-input-shell', 'OAR assistant input shell must be normalized');
  requireText(scope, file, text, '.oar-agent-input-shell:focus-within', 'OAR assistant input focus must change rounded border');
  requireText(scope, file, text, '.oar-agent-input-shell textarea::-webkit-scrollbar', 'OAR assistant editor scrollbar must be visually hidden');
  requireText(scope, file, text, '.oar-agent-send', 'OAR assistant send button must be normalized');
  requireText(scope, file, text, 'border-radius: var(--echo-radius-pill) !important;', 'assistant composer controls must use pill radius');
  requireText(scope, file, text, '> *', 'assistant send buttons must hide app-local child glyphs/text before drawing the shared SVG arrow');
  rejectPattern(scope, file, text, /height:\s*72px;\s*padding:\s*0 var\(--ec-sp-xl\)/, 'legacy EchoREC 72px topbar rule remains');
  rejectPattern(scope, file, text, /stroke-width=["']1\.8["']/, 'visible SVG stroke width must be 1.6');
  rejectPattern(scope, file, text, /transform=['"]translate\(8 8\)['"]/, 'app list glyph must not be translated to the lower-right');
  rejectPattern(scope, file, text, /el\.style\.height\s*=\s*`\$\{next\}px`/, 'assistant textarea must not use dynamic inline height');
  rejectPattern(scope, file, text, /el\.scrollHeight\s*>\s*156/, 'assistant textarea must not restore legacy max-height scrolling');
}

function auditOarAppJs(root) {
  const file = path.join(root, 'code/app.js');
  if (!fs.existsSync(file)) return;
  const text = read(file);
  requireText('oar', file, text, 'viewBox="0 0 24 24"', 'OAR internal app logo must reuse the same 24x24 SVG as the app list icon');
  requireText('oar', file, text, 'cx="12" cy="12"', 'OAR internal app logo target must match the centered list icon geometry');
  requireText('oar', file, text, 'M12 2.8v3M12 18.2v3M2.8 12h3M18.2 12h3', 'OAR internal app logo must use the same crosshair path as the app list icon');
  requireText('oar', file, text, "function feedIconOf(t) {\n  return '';\n}", 'OAR feed icons must be CSS-drawn, not emoji text');
  rejectPattern('oar', file, text, /M40 40l17 17/, 'OAR internal app logo must not keep the old magnifier handle');
  rejectPattern('oar', file, text, /viewBox="0 0 64 64"/, 'OAR internal app logo must not use a separate hand-drawn 64x64 logo');
  rejectPattern('oar', file, text, /M32 8v8M32 48v8M8 32h8M48 32h8|M32 6v10M32 48v10M6 32h10M48 32h10/, 'OAR internal app logo must not use a second custom crosshair geometry');
  rejectPattern('oar', file, text, /class="oar-logo-node result"/, 'OAR internal app logo must not keep the old result-dot handle endpoint');
}

for (const target of TARGETS) {
  auditAppJson(target.slug);
  const root = unpack(target.slug);
  auditManifest(target.slug, JSON.parse(read(path.join(root, 'manifest.json'))), path.join(root, 'manifest.json'));
  auditIconFile(target.slug, path.join(root, 'icons/icon.svg'));
  if (target.slug === 'oar') auditOarAppJs(root);
  for (const rel of target.files) {
    const file = path.join(root, rel);
    if (!fs.existsSync(file)) continue;
    const text = read(file);
    auditSharedCss(target.slug, file, text);
    if (rel.endsWith('.html')) {
      rejectPattern(target.slug, file, text, /<button[^>]*(?:class=["'][^"']*\btheme-toggle\b|id=["']theme-toggle["']|data-theme-toggle)/, 'HTML shell must not render an app-local theme toggle button');
      rejectPattern(target.slug, file, text, /getElementById\(['"]theme-toggle['"]\)\.addEventListener/, 'HTML shell must not bind an app-local theme toggle button');
      requireText(target.slug, file, text, REQUIRED_CHAT_RUNTIME_MARKER, 'HTML shell must install the shared chat behavior runtime');
      requireText(target.slug, file, text, REQUIRED_THEME_RUNTIME_MARKER, 'HTML shell must install the platform theme runtime');
      requireText(target.slug, file, text, 'window.EchoTheme', 'HTML shell must expose EchoTheme for platform theme switching');
      requireText(target.slug, file, text, 'window.__echobraidSetTheme', 'HTML shell must expose the legacy EchoBraid theme setter');
      requireText(target.slug, file, text, 'echobraid:theme-request', 'HTML shell must listen for EchoBraid theme requests');
      requireText(target.slug, file, text, "'echo.ui.theme'", 'theme runtime must persist the selected theme');
      requireText(target.slug, file, text, REQUIRED_I18N_RUNTIME_MARKER, 'HTML shell must install the shared bilingual UI runtime');
      requireText(target.slug, file, text, 'window.EchoI18n', 'HTML shell must expose EchoI18n for runtime locale switching');
      requireText(target.slug, file, text, 'echobraid:locale-request', 'HTML shell must listen for EchoBraid locale requests');
      requireText(target.slug, file, text, 'userContentSelector', 'i18n runtime must protect user-authored messages without skipping UI labels');
      requireText(target.slug, file, text, "localStorage.getItem(STORE_KEY)", 'i18n runtime must persist the selected locale');
      requireText(target.slug, file, text, 'MutationObserver', 'i18n runtime must translate later dynamic DOM text');
      requireText(target.slug, file, text, 'function showTyping(source)', 'chat runtime must insert a visible typing bubble after send when the app has no native waiting state');
      requireText(target.slug, file, text, 'data-echo-ui-typing', 'chat runtime must mark generated typing bubbles so they can be removed after replies');
      requireText(target.slug, file, text, 'removeResolvedTyping(root)', 'chat runtime must remove generated typing bubbles after assistant replies arrive');
      requireText(target.slug, file, text, 'function insertUserMessage(source, text)', 'chat runtime must preserve the visible user message before showing the waiting state');
      requireText(target.slug, file, text, 'data-echo-ui-user', 'chat runtime must mark generated user bubbles so native duplicates can be removed');
      requireText(target.slug, file, text, 'removeDuplicateGeneratedUsers(root)', 'chat runtime must remove generated user bubbles when native rendering catches up');
      requireText(target.slug, file, text, 'function scheduleUserFallback(source, text)', 'chat runtime must delay fallback user bubbles until native rendering has a chance to appear');
      requireText(target.slug, file, text, 'function shouldHandleSend(source, text)', 'chat runtime must dedupe click/submit/enter send events');
      requireText(target.slug, file, text, 'removeEmptyWaitingPlaceholders(root)', 'chat runtime must remove empty assistant placeholders above the typing state');
      requireText(target.slug, file, text, '[data-role="user"]', 'chat runtime must recognize native SDK user messages for duplicate cleanup');
    }
  }
}

const browserManifest = JSON.parse(read(path.join(BROWSER_ROOT, 'manifest.json')));
auditManifest('browser', browserManifest, path.join(BROWSER_ROOT, 'manifest.json'));
auditIconFile('browser', path.join(BROWSER_ROOT, 'icons/icon.svg'));
const browserHtml = read(path.join(BROWSER_ROOT, 'index.html'));
requireText('browser', path.join(BROWSER_ROOT, 'index.html'), browserHtml, REQUIRED_ASSISTANT_MARKER, 'browser missing shared assistant rail contract');
requireText('browser', path.join(BROWSER_ROOT, 'index.html'), browserHtml, REQUIRED_ASSISTANT_MESSAGE_MARKER, 'browser missing shared assistant message/bubble contract');
requireText('browser', path.join(BROWSER_ROOT, 'index.html'), browserHtml, REQUIRED_CHAT_RUNTIME_MARKER, 'browser missing shared chat behavior runtime');
requireText('browser', path.join(BROWSER_ROOT, 'index.html'), browserHtml, 'function insertUserMessage(source, text)', 'browser shared chat runtime must preserve visible user messages');
requireText('browser', path.join(BROWSER_ROOT, 'index.html'), browserHtml, 'data-echo-ui-user', 'browser shared chat runtime must mark generated user bubbles');
requireText('browser', path.join(BROWSER_ROOT, 'index.html'), browserHtml, 'function scheduleUserFallback(source, text)', 'browser shared chat runtime must delay fallback user bubbles');
requireText('browser', path.join(BROWSER_ROOT, 'index.html'), browserHtml, 'function shouldHandleSend(source, text)', 'browser shared chat runtime must dedupe send events');
requireText('browser', path.join(BROWSER_ROOT, 'index.html'), browserHtml, 'removeEmptyWaitingPlaceholders(root)', 'browser shared chat runtime must remove empty assistant placeholders');
requireText('browser', path.join(BROWSER_ROOT, 'index.html'), browserHtml, REQUIRED_PLATFORM_MODE_MARKER, 'browser missing platform-owned language/theme mode contract');
requireText('browser', path.join(BROWSER_ROOT, 'index.html'), browserHtml, REQUIRED_THEME_RUNTIME_MARKER, 'browser missing platform theme runtime');
requireText('browser', path.join(BROWSER_ROOT, 'index.html'), browserHtml, 'window.EchoTheme', 'browser must expose EchoTheme for platform theme switching');
requireText('browser', path.join(BROWSER_ROOT, 'index.html'), browserHtml, 'window.__echobraidSetTheme', 'browser must expose the legacy EchoBraid theme setter');
requireText('browser', path.join(BROWSER_ROOT, 'index.html'), browserHtml, 'echobraid:theme-request', 'browser must listen for EchoBraid theme requests');
requireText('browser', path.join(BROWSER_ROOT, 'index.html'), browserHtml, "'echo.ui.theme'", 'browser theme runtime must persist the selected theme');
requireText('browser', path.join(BROWSER_ROOT, 'index.html'), browserHtml, REQUIRED_I18N_RUNTIME_MARKER, 'browser missing shared bilingual UI runtime');
requireText('browser', path.join(BROWSER_ROOT, 'index.html'), browserHtml, 'window.EchoI18n', 'browser must expose EchoI18n for runtime locale switching');
requireText('browser', path.join(BROWSER_ROOT, 'index.html'), browserHtml, 'echobraid:locale-request', 'browser must listen for EchoBraid locale requests');
requireText('browser', path.join(BROWSER_ROOT, 'index.html'), browserHtml, "localStorage.getItem(STORE_KEY)", 'browser i18n runtime must persist the selected locale');
rejectPattern('browser', path.join(BROWSER_ROOT, 'index.html'), browserHtml, /\.echo-i18n-toggle/, 'browser must not render a visible language toggle; platform owns locale switching');
requireText('browser', path.join(BROWSER_ROOT, 'index.html'), browserHtml, '"PingFang SC"', 'missing macOS Chinese font');
requireText('browser', path.join(BROWSER_ROOT, 'index.html'), browserHtml, '"Microsoft YaHei"', 'missing Windows Chinese font');
requireText('browser', path.join(BROWSER_ROOT, 'index.html'), browserHtml, 'height: 24px;', 'browser tab strip must be 24px');
requireText('browser', path.join(BROWSER_ROOT, 'index.html'), browserHtml, 'height: 28px;', 'browser toolbar must be 28px');
requireText('browser', path.join(BROWSER_ROOT, 'index.html'), browserHtml, '.tab-favicon', 'browser tab favicon must be styled');
requireText('browser', path.join(BROWSER_ROOT, 'index.html'), browserHtml, '.sidebar#sidebar .sidebar-tabs', 'browser assistant tabs must be normalized to the shared assistant contract');
requireText('browser', path.join(BROWSER_ROOT, 'index.html'), browserHtml, 'display: contents;', 'browser split children must join root grid so assistant starts at the top edge');
requireText('browser', path.join(BROWSER_ROOT, 'index.html'), browserHtml, 'grid-row: 1 / span 4;', 'browser assistant rail must span browser chrome rows');
requireText('browser', path.join(BROWSER_ROOT, 'index.html'), browserHtml, 'root.style.gridTemplateColumns = columns;', 'browser split JS must keep root columns aligned with sidebar width');
requireText('browser', path.join(BROWSER_ROOT, 'index.html'), browserHtml, '`1fr 1px ${split.sidebarPct}%`', 'browser split divider must be a 1px EchoREC-style separator');
requireText('browser', path.join(BROWSER_ROOT, 'index.html'), browserHtml, 'padding: 0 32px 12px !important;', 'browser assistant title must sit closer to the divider line');
requireText('browser', path.join(BROWSER_ROOT, 'index.html'), browserHtml, 'display: none !important;', 'browser assistant extra tabs/actions must be hidden by contract');
requireText('browser', path.join(BROWSER_ROOT, 'index.html'), browserHtml, '<textarea', 'browser assistant input must be a multiline textarea');
requireText('browser', path.join(BROWSER_ROOT, 'index.html'), browserHtml, 'height: 104px !important;', 'browser assistant editor must support multiline input');
requireText('browser', path.join(BROWSER_ROOT, 'index.html'), browserHtml, 'border-radius: 24px !important;', 'browser assistant editor must use a rounded rectangle, not a pill');
requireText('browser', path.join(BROWSER_ROOT, 'index.html'), browserHtml, 'bottom: 34px !important;', 'browser assistant send button must sit inside the editor lower-right corner');
requireText('browser', path.join(BROWSER_ROOT, 'index.html'), browserHtml, '.sidebar#sidebar .chat-input:focus-visible', 'browser assistant editor must use border focus instead of square outline');
requireText('browser', path.join(BROWSER_ROOT, 'index.html'), browserHtml, 'outline: 0 !important;', 'browser assistant editor must not draw square focus outline');
requireText('browser', path.join(BROWSER_ROOT, 'index.html'), browserHtml, 'font-size: 14px !important;', 'browser assistant placeholder font size must match other apps');
requireText('browser', path.join(BROWSER_ROOT, 'index.html'), browserHtml, 'line-height: 22px !important;', 'browser assistant placeholder line height must match other apps');
requireText('browser', path.join(BROWSER_ROOT, 'index.html'), browserHtml, '.sidebar#sidebar.echo-ui-chat-has-messages .chat-empty', 'browser empty state must hide after messages arrive');
requireText('browser', path.join(BROWSER_ROOT, 'index.html'), browserHtml, '.sidebar#sidebar #pane-chat .sidebar-body:has(.chat-message)', 'browser message thread must keep side padding even without runtime class');
requireText('browser', path.join(BROWSER_ROOT, 'index.html'), browserHtml, '.sidebar#sidebar .chat-message.user', 'browser outgoing bubbles must be normalized');
requireText('browser', path.join(BROWSER_ROOT, 'index.html'), browserHtml, '@keyframes echo-ui-typing-dot', 'browser typing dots must share the assistant animation');
requireText('browser', path.join(BROWSER_ROOT, 'index.html'), browserHtml, 'let chatPending = false;', 'browser must track pending assistant replies');
requireText('browser', path.join(BROWSER_ROOT, 'index.html'), browserHtml, 'function createTypingBubble()', 'browser must render a three-dot waiting bubble after send');
requireText('browser', path.join(BROWSER_ROOT, 'index.html'), browserHtml, 'chatPending = true;', 'browser must enable typing state immediately after send');
requireText('browser', path.join(BROWSER_ROOT, 'index.html'), browserHtml, 'chatPending = false;', 'browser must clear typing state when a reply arrives');
rejectPattern('browser', path.join(BROWSER_ROOT, 'index.html'), browserHtml, /content:\s*['"][+×]/, 'browser toolbar icons must be SVG/mask, not text glyphs');

if (errors.length) {
  for (const e of errors) {
    const loc = e.line ? `${e.file}:${e.line}` : e.file;
    console.error(`[${e.scope}] ${loc} ${e.message}`);
  }
  process.exit(1);
}

console.log(`Design audit passed for ${TARGETS.length + 1} apps`);
