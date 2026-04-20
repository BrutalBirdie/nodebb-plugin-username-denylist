# nodebb-plugin-username-denylist

A NodeBB plugin that lets administrators block usernames at registration time using a configurable denylist of literal usernames and/or regular expression patterns.

## Compatibility

Tested against **NodeBB v4.10.3**. Declared compatibility range: `^4.0.0` (any NodeBB v4.x). Earlier major versions (v3 and below) are not supported because this plugin uses the v4 ACP module-loading pattern (`plugin.json → modules` with ES module syntax).

## Features

- Two-list ACP form: literal usernames (case-insensitive) and JavaScript regex patterns.
- Enforced on **every** username entry point:
  - standard registration form (`filter:register.check`),
  - OAuth/SSO interstitial username choice and any post-creation rename — admin-driven or self-service (`filter:username.check`).
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

Paste these into the **Denylisted patterns** field as a starting point. The `i` flag makes each rule case-insensitive, and the `^…$` anchors keep them from matching embedded substrings (so `cloudron-fan-42` wouldn't be blocked by `/^cloudron.*$/i` only when you anchor it tightly — adjust to taste). Remove or relax any rule that conflicts with legitimate users on your forum.

```regex
/^admin[._-]?\w*$/i
/^administrator$/i
/^root$/i
/^superuser$/i
/^sysop$/i
/^mod(erator)?[._-]?\w*$/i
/^staff[._-]?\w*$/i
/^support[._-]?\w*$/i
/^owner$/i
/^operator$/i
/^official[._-]?\w*$/i
/^team[._-]?\w*$/i
/^helpdesk$/i
/^webmaster$/i
/^postmaster$/i
/^hostmaster$/i
/^abuse$/i
/^security$/i
/^noreply$/i
/^no-reply$/i
/^anonymous$/i
/^guest$/i
/^null$/i
/^undefined$/i
/^system$/i
/^bot[._-]?\w*$/i
/^cloudron.*$/i
/^nodebb[._-]?\w*$/i
```

These patterns cover the most commonly abused impersonation handles (admin, mod, staff, support, root, etc.), reserved service accounts (noreply, abuse, postmaster), placeholder values (null, undefined, anonymous), and project/vendor names that should not be impersonated (cloudron, nodebb).

#### Combined single-line version (for testing on regex101)

If you want to validate the full set against sample usernames before deploying, paste the following single combined regex into [regex101.com](https://regex101.com/?regex=%5E%28%3F%3Aadmin%5B._-%5D%3F%5Cw*%7Cadministrator%7Croot%7Csuperuser%7Csysop%7Cmod%28%3F%3Aerator%29%3F%5B._-%5D%3F%5Cw*%7Cstaff%5B._-%5D%3F%5Cw*%7Csupport%5B._-%5D%3F%5Cw*%7Cowner%7Coperator%7Cofficial%5B._-%5D%3F%5Cw*%7Cteam%5B._-%5D%3F%5Cw*%7Chelpdesk%7Cwebmaster%7Cpostmaster%7Chostmaster%7Cabuse%7Csecurity%7Cnoreply%7Cno-reply%7Canonymous%7Cguest%7Cnull%7Cundefined%7Csystem%7Cbot%5B._-%5D%3F%5Cw*%7Ccloudron.*%7Cnodebb%5B._-%5D%3F%5Cw*%29%24&testString=&flags=gmi&flavor=javascript&delimiter=%2F) (set the flavor to **ECMAScript / JavaScript**):

```regex
/^(?:admin[._-]?\w*|administrator|root|superuser|sysop|mod(?:erator)?[._-]?\w*|staff[._-]?\w*|support[._-]?\w*|owner|operator|official[._-]?\w*|team[._-]?\w*|helpdesk|webmaster|postmaster|hostmaster|abuse|security|noreply|no-reply|anonymous|guest|null|undefined|system|bot[._-]?\w*|cloudron.*|nodebb[._-]?\w*)$/i
```

This is functionally equivalent to the line-by-line list above (the plugin OR-matches across all entries). Use the line-by-line form in the ACP — it is easier to maintain and a single bad pattern will not disable the rest.

Suggested test strings on regex101 that should **match** (be blocked): `Admin`, `admin_42`, `admin.team`, `Mod`, `mod-1`, `moderator`, `staff-johnny`, `Support`, `root`, `noreply`, `cloudron`, `cloudron-bot`, `nodebb-helper`.
Suggested test strings that should **not match** (be allowed): `alice`, `admiral_ackbar`, `rooted_tree`, `bob`, `charlie42`.

> **Heads up:** the `\w*` suffix in patterns like `^mod(erator)?[._-]?\w*$` is intentionally greedy, which means innocuous names such as `modest_mouse` or `staffan` will also be blocked. If your community has legitimate users matching these prefixes, replace `\w*` with a stricter separator-required form like `[._-]\w+` (forcing at least `mod-something` rather than any `mod…`).

## Local development

```bash
git clone https://github.com/brutalbirdie/nodebb-plugin-username-denylist
cd /path/to/nodebb
npm install /path/to/nodebb-plugin-username-denylist
./nodebb build && ./nodebb start
```

## License

MIT
