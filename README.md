# nodebb-plugin-username-denylist

A NodeBB plugin that lets administrators block usernames at registration time using a configurable denylist of literal usernames and/or regular expression patterns.

## Compatibility

Tested against **NodeBB v4.10.3**. Declared compatibility range: `^4.0.0` (any NodeBB v4.x). Earlier major versions (v3 and below) are not supported because this plugin uses the v4 ACP module-loading pattern (`plugin.json → modules` with ES module syntax).

## Features

- Two-list ACP form: literal usernames (case-insensitive) and JavaScript regex patterns.
- Enforced on **every** username entry point:
  - standard registration form (`filter:register.check`),
  - OAuth/SSO interstitial username choice and any post-creation rename — admin-driven or self-service (`filter:username.check`),
  - direct programmatic user creation, including the OAuth/SSO "use email as username" path that bypasses the picker (`filter:user.create`). Also catches NodeBB's auto-disambiguated variants such as `admin 0`, `admin 1`, … when the chosen base name collides.
- Invalid regex patterns are skipped and logged via `winston.warn`; valid patterns continue to apply.
- i18n-ready error message shown directly on the form that triggered the rejection.

## Install

From your NodeBB install directory:

```bash
npm install nodebb-plugin-username-denylist
./nodebb build
./nodebb restart
```

Then activate the plugin under `Admin → Extend → Plugins` and rebuild/restart once more.

## Configure

Open `Admin → Plugins → Username Denylist` and fill in either or both lists:

- **Denylisted usernames** – one per line, case-insensitive literal match (e.g. `admin`, `root`).
- **Denylisted patterns** – one JavaScript regular expression per line. Both bare form (`^mod[0-9]+$`) and slash-delimited form with flags (`/staff/i`) are supported.

Click **Save**. Changes apply immediately to subsequent registration attempts.

### Example regex starter pack

Paste these into the **Denylisted patterns** field as a starting point. The `i` flag makes each rule case-insensitive, the `^…$` anchors keep them from matching embedded substrings, and the trailing `( \d+)?` catches NodeBB's auto-disambiguation suffix (when a username collides, NodeBB appends ` 0`, ` 1`, ` 2`, … — so without this tail, blocking `admin` would still allow an OAuth/SSO user to land on `admin 0`). Remove or relax any rule that conflicts with legitimate users on your forum.

```regex
/^admin[._-]?\w*( \d+)?$/i
/^administrator( \d+)?$/i
/^root( \d+)?$/i
/^superuser( \d+)?$/i
/^sysop( \d+)?$/i
/^mod(erator)?[._-]?\w*( \d+)?$/i
/^staff[._-]?\w*( \d+)?$/i
/^support[._-]?\w*( \d+)?$/i
/^owner( \d+)?$/i
/^operator( \d+)?$/i
/^official[._-]?\w*( \d+)?$/i
/^team[._-]?\w*( \d+)?$/i
/^helpdesk( \d+)?$/i
/^webmaster( \d+)?$/i
/^postmaster( \d+)?$/i
/^hostmaster( \d+)?$/i
/^abuse( \d+)?$/i
/^security( \d+)?$/i
/^noreply( \d+)?$/i
/^no-reply( \d+)?$/i
/^anonymous( \d+)?$/i
/^guest( \d+)?$/i
/^null( \d+)?$/i
/^undefined( \d+)?$/i
/^system( \d+)?$/i
/^bot[._-]?\w*( \d+)?$/i
/^cloudron.*$/i
/^nodebb[._-]?\w*( \d+)?$/i
```

These patterns cover the most commonly abused impersonation handles (admin, mod, staff, support, root, etc.), reserved service accounts (noreply, abuse, postmaster), placeholder values (null, undefined, anonymous), and project/vendor names that should not be impersonated (cloudron, nodebb). The trailing `( \d+)?` is omitted from `/^cloudron.*$/i` because the leading `.*` already matches any suffix including ` 0`, ` 1`, ….

#### Combined single-line version (for testing on regex101)

If you want to validate the full set against sample usernames before deploying, paste the following single combined regex into [regex101.com](https://regex101.com/?flavor=javascript) (set the flavor to **ECMAScript / JavaScript**):

```regex
/^(?:admin[._-]?\w*|administrator|root|superuser|sysop|mod(?:erator)?[._-]?\w*|staff[._-]?\w*|support[._-]?\w*|owner|operator|official[._-]?\w*|team[._-]?\w*|helpdesk|webmaster|postmaster|hostmaster|abuse|security|noreply|no-reply|anonymous|guest|null|undefined|system|bot[._-]?\w*|cloudron.*|nodebb[._-]?\w*)( \d+)?$/i
```

This is functionally equivalent to the line-by-line list above (the plugin OR-matches across all entries). Use the line-by-line form in the ACP — it is easier to maintain and a single bad pattern will not disable the rest.

Suggested test strings on regex101 that should **match** (be blocked): `Admin`, `admin_42`, `admin.team`, `admin 0`, `admin 12`, `Mod`, `mod-1`, `moderator`, `moderator 3`, `staff-johnny`, `staff 7`, `Support`, `root`, `root 0`, `noreply`, `noreply 1`, `cloudron`, `cloudron-bot`, `cloudron 4`, `nodebb-helper`.
Suggested test strings that should **not match** (be allowed): `alice`, `admiral_ackbar`, `rooted_tree`, `bob`, `charlie42`.

> **Heads up — aggressive prefix matching:** the `\w*` in patterns like `^mod(erator)?[._-]?\w*( \d+)?$` is intentionally greedy, which means innocuous names such as `modest_mouse` or `staffan` will also be blocked. If your community has legitimate users matching these prefixes, replace `\w*` with a stricter separator-required form like `[._-]\w+` (forcing at least `mod-something` rather than any `mod…`).
>
> **Heads up — UX on direct-create paths (OAuth "email as username"):** if an OAuth/SSO strategy is configured to derive the username from email and is **not** using the username picker, a denied username aborts the OAuth callback with an error and the user has no way to choose a different name. To get a graceful retry experience, enable the username picker on those strategies (in `nodebb-plugin-sso-oauth2-multiple` set **Allow username choice** for the strategy) — the denylist still applies, but rejections show inside the picker form so the user can correct and continue.

## Local development

```bash
git clone https://github.com/brutalbirdie/nodebb-plugin-username-denylist
cd /path/to/nodebb
npm install /path/to/nodebb-plugin-username-denylist
./nodebb build && ./nodebb start
```

## License

MIT
