# nodebb-plugin-username-denylist

A NodeBB plugin that lets administrators block usernames at registration time using a configurable denylist of literal usernames and/or regular expression patterns.

## Features

- Two-list ACP form: literal usernames (case-insensitive) and JavaScript regex patterns.
- Hooks into `filter:register.check` so blocked sign-ups never reach user creation.
- Invalid regex patterns are skipped and logged via `winston.warn`; valid patterns continue to apply.
- i18n-ready error message shown directly on the registration form.

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

## Local development

```bash
git clone https://github.com/brutalbirdie/nodebb-plugin-username-denylist
cd /path/to/nodebb
npm install /path/to/nodebb-plugin-username-denylist
./nodebb build && ./nodebb start
```

## License

MIT
