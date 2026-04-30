#!/usr/bin/env node

const { execFileSync } = require('node:child_process');
const { existsSync, readFileSync, statSync } = require('node:fs');
const { dirname, join, resolve } = require('node:path');

const ROOT = resolve(__dirname, '..');
const REPO = 'launsion-boop/EchoApp';
const SEMVER_RE = /^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/;

function fail(message) {
  console.error(`error: ${message}`);
  process.exitCode = 1;
}

function readJson(path) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch (error) {
    fail(`${relative(path)} is not valid JSON: ${error.message}`);
    return null;
  }
}

function relative(path) {
  return path.startsWith(ROOT) ? path.slice(ROOT.length + 1) : path;
}

function requireString(object, field, context) {
  if (typeof object[field] !== 'string' || object[field].length === 0) {
    fail(`${context}.${field} must be a non-empty string`);
    return '';
  }
  return object[field];
}

function requireLocalizedString(object, field, context) {
  const value = object[field];
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    fail(`${context}.${field} must be a localized object`);
    return;
  }
  for (const locale of ['zh-CN', 'en']) {
    if (typeof value[locale] !== 'string' || value[locale].length === 0) {
      fail(`${context}.${field}.${locale} must be a non-empty string`);
    }
  }
}

function compareSemver(a, b) {
  const parse = (value) => value.split(/[+-]/)[0].split('.').map((part) => Number(part));
  const left = parse(a);
  const right = parse(b);
  for (let i = 0; i < 3; i += 1) {
    if (left[i] !== right[i]) return left[i] - right[i];
  }
  return 0;
}

function readGitJson(refPath) {
  try {
    const out = execFileSync('git', ['show', `origin/main:${refPath}`], {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    return JSON.parse(out);
  } catch {
    return null;
  }
}

function validateEchoFile(appDir, app, context) {
  const echoPath = join(appDir, app.echo_file);
  if (!existsSync(echoPath)) {
    fail(`${context}.echo_file does not exist: ${app.echo_file}`);
    return;
  }
  if (!statSync(echoPath).isFile()) {
    fail(`${context}.echo_file is not a file: ${app.echo_file}`);
    return;
  }

  const bytes = readFileSync(echoPath);
  if (bytes.length === 0) {
    fail(`${relative(echoPath)} must not be empty`);
    return;
  }

  const isZip = bytes.length >= 4 && bytes[0] === 0x50 && bytes[1] === 0x4b && bytes[2] === 0x03 && bytes[3] === 0x04;
  if (isZip) {
    validateZipEchoFile(echoPath, app);
    return;
  }

  let parsed;
  try {
    parsed = JSON.parse(bytes.toString('utf8'));
  } catch (error) {
    fail(`${relative(echoPath)} must be a V2 ZIP or legacy JSON .echo: ${error.message}`);
    return;
  }

  const manifest = parsed && parsed.manifest;
  if (!manifest || typeof manifest !== 'object') {
    fail(`${relative(echoPath)} legacy JSON .echo must contain manifest`);
    return;
  }
  if (manifest.id !== app.id) {
    fail(`${relative(echoPath)} manifest.id (${manifest.id}) must match app.json id (${app.id})`);
  }
  if (manifest.version !== app.version) {
    fail(`${relative(echoPath)} manifest.version (${manifest.version}) must match app.json version (${app.version})`);
  }

  const source = manifest.update_source;
  if (!source || source.type !== 'github' || source.repo !== REPO || source.app_path !== app.update_source.app_path) {
    fail(`${relative(echoPath)} manifest.update_source must match app.json update_source`);
  }
}

function validateZipEchoFile(echoPath, app) {
  let manifest;
  try {
    const raw = execFileSync('unzip', ['-p', echoPath, 'manifest.json'], {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    manifest = JSON.parse(raw);
  } catch (error) {
    fail(`${relative(echoPath)} V2 ZIP must contain valid manifest.json: ${error.message}`);
    return;
  }

  if (!manifest || typeof manifest !== 'object') {
    fail(`${relative(echoPath)} V2 ZIP manifest.json must be a JSON object`);
    return;
  }
  if (manifest.id !== app.id) {
    fail(`${relative(echoPath)} manifest.id (${manifest.id}) must match app.json id (${app.id})`);
  }
  if (manifest.version !== app.version) {
    fail(`${relative(echoPath)} manifest.version (${manifest.version}) must match app.json version (${app.version})`);
  }

  const source = manifest.update_source;
  if (!source || source.type !== 'github' || source.repo !== REPO || source.app_path !== app.update_source.app_path) {
    fail(`${relative(echoPath)} manifest.update_source must match app.json update_source`);
  }
}

function validateApp(appEntry) {
  const appJsonPath = join(ROOT, appEntry.path);
  if (!existsSync(appJsonPath)) {
    fail(`catalog path does not exist: ${appEntry.path}`);
    return;
  }

  const app = readJson(appJsonPath);
  if (!app) return;

  const context = appEntry.path;
  const id = requireString(app, 'id', context);
  requireLocalizedString(app, 'name', context);
  const version = requireString(app, 'version', context);
  requireString(app, 'category', context);
  requireLocalizedString(app, 'summary', context);
  requireLocalizedString(app, 'description', context);
  requireString(app, 'echo_file', context);
  requireString(app, 'min_echobraid', context);
  requireString(app, 'updated_at', context);
  requireString(app, 'changelog', context);

  if (app.schema !== 'echoapp-app/v1') fail(`${context}.schema must be echoapp-app/v1`);
  if (id !== appEntry.id) fail(`${context}.id must match catalog id ${appEntry.id}`);
  if (!SEMVER_RE.test(version)) fail(`${context}.version must be semver, got ${version}`);
  if (!Array.isArray(app.capabilities)) fail(`${context}.capabilities must be an array`);
  if (!Array.isArray(app.tags) || app.tags.some((tag) => typeof tag !== 'string' || tag.length === 0)) {
    fail(`${context}.tags must be an array of non-empty strings`);
  }

  const source = app.update_source;
  if (!source || typeof source !== 'object') {
    fail(`${context}.update_source is required`);
  } else {
    if (source.type !== 'github') fail(`${context}.update_source.type must be github`);
    if (source.repo !== REPO) fail(`${context}.update_source.repo must be ${REPO}`);
    if (source.app_path !== appEntry.path) fail(`${context}.update_source.app_path must equal ${appEntry.path}`);
  }

  const appDir = dirname(appJsonPath);
  if (!existsSync(join(appDir, app.changelog))) fail(`${context}.changelog does not exist: ${app.changelog}`);
  if (!existsSync(join(appDir, 'README.md'))) fail(`${relative(join(appDir, 'README.md'))} is required`);

  validateEchoFile(appDir, app, context);

  const previous = readGitJson(appEntry.path);
  if (previous && previous.id && id !== previous.id) {
    fail(`${context}.id (${id}) must not change from origin/main (${previous.id}); publish a new app path if this is a different app`);
  }
  if (previous && previous.version && compareSemver(version, previous.version) < 0) {
    fail(`${context}.version (${version}) must not be lower than origin/main (${previous.version})`);
  }
}

function main() {
  const indexPath = join(ROOT, 'catalog.json');
  const index = readJson(indexPath);
  if (!index) return;

  if (index.schema !== 'echoapp-catalog/v1') fail('catalog.json schema must be echoapp-catalog/v1');
  if (typeof index.updated_at !== 'string' || index.updated_at.length === 0) fail('catalog.json updated_at is required');
  if (!Array.isArray(index.apps)) {
    fail('catalog.json apps must be an array');
    return;
  }

  const seen = new Set();
  for (const entry of index.apps) {
    if (!entry || typeof entry !== 'object') {
      fail('catalog apps entries must be objects');
      continue;
    }
    const id = requireString(entry, 'id', 'catalog app');
    const path = requireString(entry, 'path', `catalog app ${id}`);
    if (seen.has(id)) fail(`duplicate catalog app id: ${id}`);
    seen.add(id);
    validateApp(entry);
  }

  if (process.exitCode) {
    console.error('EchoApp validation failed');
    process.exit(process.exitCode);
  }
  console.log(`EchoApp catalog validation passed (${index.apps.length} app${index.apps.length === 1 ? '' : 's'})`);
}

main();
