# EchoApp

EchoApp is an open GitHub catalog and update source for EchoBraid apps.

Scope:

- List installable EchoBraid apps in `catalog.json`.
- Store each app as `app.json` + `app.echo` + human-readable notes.
- Accept app additions and updates through pull requests.
- Let EchoBraid clients discover apps, install `.echo` artifacts, and later check installed apps for newer versions.

## Layout

```text
catalog.json
apps/
  oar/
    app.json
    app.echo
    README.md
    changelog.md
scripts/
  validate.js
```

## Adding Or Updating An App

1. Add or replace `apps/<app>/app.echo`.
2. Update `apps/<app>/app.json`.
3. Add a short entry to `changelog.md`.
4. Ensure `catalog.json` points to the app's `app.json`.
5. Run `node scripts/validate.js`.
6. Open a pull request.

The client reads `catalog.json` for discovery. After installation, it reads `update_source` from the app metadata and only caches local runtime state such as installed version and last check time.
