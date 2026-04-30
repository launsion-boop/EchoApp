# EchoApp

EchoApp is an open GitHub catalog and update source for EchoBraid apps.

EchoBraid reads this repository to discover apps, install `.echo` packages, and check whether installed apps have newer versions.

## Repository Layout

```text
catalog.json
apps/
  <app-slug>/
    app.json
    app.echo
    README.md
    changelog.md
scripts/
  validate.js
```

Each app lives in one directory under `apps/`. The directory name is a stable slug, such as `oar`, `echorec`, or `mathviz`.

## Quick Rules

- Submit only the final selected app package, not every AI-generated experiment.
- Keep a published app's `id` stable.
- Keep a published app's `apps/<app-slug>/app.json` path stable.
- Increase `version` when publishing an update.
- Keep `app.json` and the `.echo` package manifest in sync.
- Run `node scripts/validate.js` before opening a pull request.

## Add A New App

1. Create a new directory:

   ```text
   apps/<app-slug>/
   ```

2. Add these files:

   ```text
   apps/<app-slug>/app.echo
   apps/<app-slug>/app.json
   apps/<app-slug>/README.md
   apps/<app-slug>/changelog.md
   ```

3. Add the app to `catalog.json`:

   ```json
   {
     "id": "app.example.my-app",
     "path": "apps/my-app/app.json"
   }
   ```

4. Run validation:

   ```bash
   node scripts/validate.js
   ```

5. Open a pull request.

## Update An Existing App

1. Replace `apps/<app-slug>/app.echo` with the new package.
2. Update `apps/<app-slug>/app.json`.
3. Increase `version`.
4. Add a short entry to `apps/<app-slug>/changelog.md`.
5. Run:

   ```bash
   node scripts/validate.js
   ```

6. Open a pull request.

For an existing app, do not change `id` or `apps/<app-slug>/app.json` unless you intentionally want EchoBraid to treat it as a different app.

Pull request validation rejects an update when an existing `apps/<app-slug>/app.json` changes its `id`. To publish a different app identity, create a new app directory and catalog entry instead.

## app.json Template

```json
{
  "schema": "echoapp-app/v1",
  "id": "app.example.my-app",
  "name": {
    "zh-CN": "我的应用",
    "en": "My App"
  },
  "version": "1.0.0",
  "category": "productivity",
  "summary": {
    "zh-CN": "一句话介绍应用",
    "en": "A one-line app summary"
  },
  "description": {
    "zh-CN": "更完整的中文应用说明。",
    "en": "A fuller English app description."
  },
  "tags": [
    "productivity",
    "ai"
  ],
  "echo_file": "app.echo",
  "update_source": {
    "type": "github",
    "repo": "launsion-boop/EchoApp",
    "app_path": "apps/my-app/app.json"
  },
  "min_echobraid": "2.0.0",
  "capabilities": [
    "ui"
  ],
  "updated_at": "2026-04-28T00:00:00Z",
  "changelog": "changelog.md"
}
```

## update_source Rules

Every published app must point back to this repository:

```json
{
  "type": "github",
  "repo": "launsion-boop/EchoApp",
  "app_path": "apps/<app-slug>/app.json"
}
```

The same `update_source` must also exist inside the `.echo` package manifest. Validation fails if the package manifest and `app.json` disagree.

## Version Rules

Use semantic versions:

```text
1.0.0
1.0.1
1.1.0
2.0.0
```

Pre-release/build suffixes are allowed when needed:

```text
1.2.0-beta.1
1.2.0+build.3
```

Do not publish a version lower than the version already on `main`.

## Working With AI-Generated Apps

It is normal to use Claude, Codex, or another AI tool to create many local versions before choosing one.

When submitting to EchoApp:

- Do not submit draft attempts.
- Do not submit temporary files, screenshots, logs, `.env`, API keys, or local machine paths.
- Submit the final `app.echo` only.
- Make sure `app.json.version` equals the `.echo` manifest version.
- Make sure `app.json.id` equals the `.echo` manifest id.
- Make sure `app.json.update_source` equals the `.echo` manifest update source.

Think of this repository as the release shelf, not the workshop.

## Validation

Run this before every pull request:

```bash
node scripts/validate.js
```

The validator checks:

- `catalog.json` schema and app paths.
- Required `app.json` fields.
- Localized `name`, `summary`, and `description`.
- Semver-compatible versions.
- Existing app versions do not go backwards.
- Existing app IDs do not change for the same `app.json` path.
- `README.md` and `changelog.md` exist.
- `app.echo` exists and is not empty.
- `.echo` manifest `id`, `version`, and `update_source` match `app.json`.

## Common Mistakes

- Forgot to add a new app to `catalog.json`.
- Changed an existing app's `id`.
- Changed an existing app's `app_path`.
- Updated `app.json.version` but forgot to rebuild or replace `app.echo`.
- Rebuilt `app.echo` but forgot to update `app.json.version`.
- Used the wrong `update_source.app_path`.
- Submitted an older version than the one already on `main`.
