# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A Django 4.2 marketing/portfolio site for SKK Consultants, a construction and
engineering firm in Kenya. The site itself has no user-facing accounts flow in
use yet — `landing` renders the public pages and `gallery`/`accounts` back the
admin dashboard content.

The actual Django project lives in `skkconsultant/` (one level below this
file, i.e. `skkconsultant/skkconsultant/skkconsultant/settings.py`) — there are
three nested `skkconsultant` directories: repo root, Django project root, and
the settings package. Don't confuse them when constructing paths.

There is a separate static HTML prototype in `../theme/` (sibling to this repo,
outside git) with no build step — it's the design source that gets hand-ported
into the Django `templates/` and `static/` directories. When a design changes,
check whether `theme/` has the canonical version first.

## Commands

Run from `skkconsultant/` (the Django project root, containing `manage.py`):

```
python manage.py runserver          # dev server
python manage.py makemigrations     # after model changes
python manage.py migrate
python manage.py createsuperuser
python manage.py test               # run all tests
python manage.py test gallery       # run one app's tests
python manage.py collectstatic      # only meaningful when LOCAL_MODE is False
```

There is no linter, formatter, or CI config in this repo — none is configured.

## Local environment setup

Settings (`skkconsultant/skkconsultant/settings.py`) import all secrets and
environment-specific paths from a local `main_conf.py` sitting next to it
(`skkconsultant/skkconsultant/main_conf.py`), which is gitignored and **not
tracked**. A fresh checkout has no `main_conf.py` and the app will fail to
import settings until one is created. It must define:

- `DEBUG`, `LOCAL_MODE` (booleans)
- `MEDIA_ROOT`, `STATIC_ROOT` (filesystem paths)
- `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_STORAGE_BUCKET_NAME`, `AWS_S3_ENDPOINT_URL`, `AWS_S3_SIGNATURE_VERSION` (Cloudflare R2 / S3-compatible media storage, used via `django-storages`)
- `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT` (MySQL)

Never put real credentials into files that are committed — `main_conf.py` is
the intended place for that and is already ignored.

The DB is MySQL via `mysqlclient`; there's no SQLite fallback configured.
Media (uploaded images) is stored on S3-compatible storage
(`django-storages`) even in local dev — `DEFAULT_FILE_STORAGE` is hardcoded to
`S3Boto3Storage` regardless of `LOCAL_MODE`.

## Architecture

Three apps, each with a distinct role:

- **`landing`** — the public marketing pages (`index`, `about`, `services`,
  `contact`, `gallery`). No models of consequence besides `Review` (testimonials,
  managed only via admin). Views are function-free: every page is a subclass of
  `accounts.auth_views.AnonymousView` that just sets `self.html`. `urls.py` uses
  `namespace='landing'`.
- **`gallery`** — `Category`, `Image`, and `BeforeAfter` models for
  portfolio/before-after photo content, managed entirely through the admin
  dashboard. `views.py` is currently a stub — gallery content reaches templates
  through model queries elsewhere (check `landing` templates/views before
  assuming this app renders anything itself).
- **`accounts`** — custom `User` model (`AUTH_USER_MODEL = 'accounts.User'`),
  email-based login (`USERNAME_FIELD = 'email'`, no `username` field), plus the
  shared `AnonymousView` base class that `landing` (and presumably future apps)
  builds views on.

### The `AnonymousView` pattern

`accounts/auth_views.py` defines a `View` subclass used as the base for all
current page views: override `handle_get`/`handle_post` to set `self.html`,
`self.redirect`, or mutate `self.context`; `set_base_context()` is the hook for
injecting context shared across all pages. `post()` always returns
`JsonResponse` — pages that need to POST (e.g. contact form submission) are
expected to do so via AJAX, not a full form POST/redirect. There's no
`urls.py` in `accounts` yet — it currently only supplies this shared base
class and the `User` model, not its own routes.

### URL / template layout

- Root `skkconsultant/urls.py` wires: MySQL-served `/media/` (via
  `django.views.static.serve`, dev-only pattern still active), `/admin-dashboard/`
  (not `/admin/`), `landing.urls` at `/`, `/sitemap.xml`, and `/robots.txt`.
- Templates resolve from the project-level `templates/` dir first
  (`TEMPLATES[0]['DIRS']`), then app dirs. `landing/` templates live under
  `templates/landing/`; `templates/base.html` is the shared shell.
- Static assets live in the project-level `static/` dir (`STATICFILES_DIRS`),
  mirroring `theme/`'s `css/`/`js/` structure 1:1 by filename.

### Sitemap

`landing/sitemaps.py` lists named URLs manually (`StaticViewSitemap.items`) —
when adding a new public page to `landing/urls.py`, add its name here too or
it won't appear in `/sitemap.xml`.
