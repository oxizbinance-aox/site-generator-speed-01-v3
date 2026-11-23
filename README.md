# site-generator-speed-01-v3

A native Go engine for the [site-generator-speed-01](https://make.fun/bounty/site-generator-speed-01-run-20261122) bounty (make.fun).

[![make.fun bounty](https://make.fun/bounty/site-generator-speed-01-run-20261122/badge)](https://make.fun/bounty/site-generator-speed-01-run-20261122)

## What it is

A from-scratch reimplementation of the `makefun-site` static site generator
(the reference program) in Go, compiled to a single statically linked binary
(`sitegen`). It produces byte-identical output to the reference on every
practice case, at a fraction of the CPU time.

## Layout

- `main.ts` — the harness driver. It hands the whole case set to `./sitegen`
  in one call, so no JSON is parsed or stringified in Node at all.
- `solve.js` — `run(input)`, the single-case equivalent through the same
  binary (the driver contract).
- `sitegen` — the native engine (Go, `CGO_ENABLED=0`, statically linked).
  Reads a cases file, builds each site, writes the answers.
- `NOTICE` — upstream credits.

## How it was built

The engine is a direct port of the reference `makefun-site` program
(`program/generator/vendor/makefun-site/` in the bounty kit): the same
front-matter subset, the same line-based Markdown dialect, the same template
dialect (`{{ }}`, `{{{ }}}`, `{% for %}`, `{% if %}`, `{% include %}` with the
standalone-tag line rule), and the same build pipeline
(readSources → frontMatter → permalinks → markdown → collections → tags →
layouts → report). Verified byte-identical against the kit's practice
expected answers (3/3 cases).

Build (Go 1.23+):

```sh
cd native && CGO_ENABLED=0 go build -o ../entry/sitegen .
```

## Bounty

- Competition: `site-generator-speed-01-run-20261122`
- Entry: native Go binary + thin Node driver
