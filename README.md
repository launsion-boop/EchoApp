# EchoApp

EchoApp is the GitHub update source for EchoBraid preinstalled apps.

First slice scope:

- Keep a small list of EchoBraid preinstalled apps.
- Store each app as `app.json` + `app.echo` + human-readable notes.
- Accept updates through pull requests.
- Let EchoBraid clients check installed preloaded apps for newer versions.

This is not an app store yet. There is no public browse/install marketplace in the first version.

## Layout

```text
preinstalled.json
apps/
  official/
    oar/
      app.json
      app.echo
      README.md
      changelog.md
scripts/
  validate.js
```

## Updating A Preinstalled App

1. Replace `apps/official/<app>/app.echo`.
2. Update `apps/official/<app>/app.json`.
3. Add a short entry to `changelog.md`.
4. Run `node scripts/validate.js`.
5. Open a pull request.

The client reads `update_source` from the app metadata and only caches local runtime state such as installed version and last check time.
