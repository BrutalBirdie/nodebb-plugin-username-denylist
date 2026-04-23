# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-04-23

Initial public release.

### Added
- Admin Control Panel page (`Admin → Plugins → Username Denylist`) with two fields:
  - **Denylisted usernames** – one per line, case-insensitive literal match.
  - **Denylisted patterns** – one JavaScript regular expression per line. Both bare form (`^mod[0-9]+$`) and slash-delimited form with flags (`/staff/i`) are accepted.
- Enforcement across every username entry point so the list cannot be bypassed:
  - standard registration form via `filter:register.check`,
  - OAuth/SSO interstitial username picker and any post-creation rename (admin-driven or self-service) via `filter:username.check`,
  - direct programmatic user creation, including the OAuth "email as username" path that skips the picker, via `filter:user.create`. This path also catches NodeBB's auto-disambiguated variants (e.g. `admin 0`, `admin 1`, …) when a chosen base name collides.
- Invalid regex patterns are logged via `winston.warn` and skipped so a single bad entry cannot disable the rest of the list.
- i18n-ready rejection message (`[[username-denylist:error.username-not-allowed]]`) with an English (en-GB) translation bundled.
- README with configuration guide and a starter pack of regexes covering impersonation handles (admin, mod, staff, support, root, …), reserved service accounts (noreply, abuse, postmaster), placeholders (null, undefined, anonymous), and vendor names.

### Compatibility
- NodeBB `^4.0.0` (tested against v4.10.3). NodeBB v3 and below are not supported: the ACP module is loaded through the v4 `plugin.json → modules` mechanism using ES module syntax.

[1.0.0]: https://github.com/brutalbirdie/nodebb-plugin-username-denylist/releases/tag/v1.0.0
