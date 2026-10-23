# Remove testing-library/jsdom — pilot design

Approved in conversation, 2026-10-22.

## Intent

Kill the imitation-DOM dependency stack (`@testing-library/*`, `jsdom`, `happy-dom`,
`vitest-localstorage-mock`) in favor of Vitest browser mode with real browsers and its
component testing (`vitest-browser-react`). The driver is dependency removal, not test
fidelity.

## Goals (this pilot)

Prove the full migration pattern on `@scaleway/use-countdown` — the smallest package that
still exercises every risky part:

- per-package browser-mode config on top of the shared `defaultConfig`
- hook testing via `renderHook`/`act` from `vitest-browser-react`
- component testing via `render` + locators + CDP interaction (`click`)
- fake timers under browser mode (`use-countdown` ticks on `setInterval`)
- coverage parity (cobertura XML still produced for codecov)
- CI installs playwright browsers without changing turbo task names

## Non-goals (this pilot)

- Migrating the other 12 packages (follow-up sweep, same pattern)
- Deleting `@testing-library/*`, `jsdom`, `happy-dom` from catalog/root (only after the sweep)
- firefox/webkit instances, vitest major upgrade, visual regression testing

## Constraints

- `@vitest/browser-playwright` must match vitest exactly: `4.1.12`
- Provider: playwright, chromium only, headless in CI
- Turbo task names (`test:unit`, `test:unit:coverage`) and CI job structure stay
- CI runs ubuntu-26.04, node matrix 24/26
- No changeset: published output (`dist/`) is unaffected

## Decided

- Deps: `@vitest/browser-playwright@4.1.12`, `vitest-browser-react@2.3.0`,
  `playwright@1.64.1` — catalog entries, consumed as devDeps of `use-countdown`
- `headless: process.env.CI === 'true'` so local runs stay headful for debugging
- No setup files for `use-countdown`: `vitest-browser-react` cleans up before each test,
  browser matchers are built in (jest-dom setup dies)
- One of the five rewritten tests uses `render` + `click` (component-testing path) so the
  sweep's interaction pattern is also proven by the pilot

## Known risks with pre-agreed fallbacks

1. Fake timers may freeze CDP/iframe communication (vitest's documented weak spot).
   Fallback A: `vi.useFakeTimers({ shouldAdvanceTime: true })`.
   Fallback B: click before enabling fake timers.
   Fallback C: that one test stays `renderHook`-mechanical.
2. Root `defaultConfig` setupFile `vitest-localstorage-mock` is inherited via `mergeConfig`
   (arrays concatenate) and runs inside the browser iframe. If it breaks the iframe, move
   it to the only two packages whose tests touch storage (`use-storage`,
   `use-visual-persistence` — both already clear storage themselves).
