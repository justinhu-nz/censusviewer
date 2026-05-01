# Census 2023 mode share map

This repo now serves a static web app that wraps an Observable notebook export in
a cleaner GitHub Pages-friendly shell.

## Local preview

Run any static file server from the repo root. For example:

```sh
python3 -m http.server 8765
```

Then open:

```text
http://127.0.0.1:8765/index.html
```

## GitHub Pages

This project is designed to work as a no-build static site:

- publish the repository root with GitHub Pages
- keep the generated notebook modules and `files/` assets alongside `index.html`
- all app imports and asset references are relative, so the site works from a
  project subpath such as `/repo-name/`

## Shareable state

The app stores the current view in the URL query string:

- `mode`
- `who`
- `reference`
- `density`

Example:

```text
?mode=walk&who=work&reference=all&density=300
```

## Data sources

- Stats NZ SA2 boundaries and 2023 census mode-share data
- OpenStreetMap-derived background streets and coastline

Original notebook source:

https://observablehq.com/d/2142852435976b90@1066
