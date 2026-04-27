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
  if (isZip) return;

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

function validateApp(appEntry) {
  const appJsonPath = join(ROOT, appEntry.path);
  if (!existsSync(appJsonPath)) {
    fail(`preinstalled path does not exist: ${appEntry.path}`);
    return;
  }

  const app = readJson(appJsonPath);
  if (!app) return;

  const context = appEntry.path;
  const id = requireString(app, 'id', context);
  requireString(app, 'name', context);
  const version = requireString(app, 'version', context);
  requireString(app, 'owner', context);
  requireString(app, 'description', context);
  requireString(app, 'echo_file', context);
  requireString(app, 'min_echobraid', context);
  requireString(app, 'updated_at', context);
  requireString(app, 'changelog', context);

  if (app.schema !== 'echoapp-app/v1') fail(`${context}.schema must be echoapp-app/v1`);
  if (id !== appEntry.id) fail(`${context}.id must match preinstalled id ${appEntry.id}`);
  if (app.owner !== appEntry.owner) fail(`${context}.owner must match preinstalled owner ${appEntry.owner}`);
  if (!SEMVER_RE.test(version)) fail(`${context}.version must be semver, got ${version}`);
  if (!Array.isArray(app.capabilities)) fail(`${context}.capabilities must be an array`);

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
  if (previous && previous.version && compareSemver(version, previous.version) < 0) {
    fail(`${context}.version (${version}) must not be lower than origin/main (${previous.version})`);
  }
}

function main() {
  const indexPath = join(ROOT, 'preinstalled.json');
  const index = readJson(indexPath);
  if (!index) return;

  if (index.schema !== 'echoapp-preinstalled/v1') fail('preinstalled.json schema must be echoapp-preinstalled/v1');
  if (typeof index.updated_at !== 'string' || index.updated_at.length === 0) fail('preinstalled.json updated_at is required');
  if (!Array.isArray(index.apps)) {
    fail('preinstalled.json apps must be an array');
    return;
  }

  const seen = new Set();
  for (const entry of index.apps) {
    if (!entry || typeof entry !== 'object') {
      fail('preinstalled apps entries must be objects');
      continue;
    }
    const id = requireString(entry, 'id', 'preinstalled app');
    requireString(entry, 'owner', `preinstalled app ${id}`);
    const path = requireString(entry, 'path', `preinstalled app ${id}`);
    if (seen.has(id)) fail(`duplicate preinstalled app id: ${id}`);
    seen.add(id);
    validateApp(entry);
  }

  if (process.exitCode) {
    console.error('EchoApp validation failed');
    process.exit(process.exitCode);
  }
  console.log(`EchoApp validation passed (${index.apps.length} app${index.apps.length === 1 ? '' : 's'})`);
}

main();
