# Testing-library removal sweep — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Migrate the remaining 11 testing-library packages to Vitest browser mode, then delete the entire imitation-DOM stack (`@testing-library/*`, `jsdom`, `happy-dom`, `vitest-localstorage-mock`) from the repo.

**Architecture:** The pilot PR (#4049, green on both CI legs) proved the recipe; this plan applies it per package, then removes the stack. Each package gets the same config/deps/test-port changes; per-package quirks are listed in each task. Stack deletion happens only after every consumer has migrated.

**Tech Stack:** vitest 4.1.12, `@vitest/browser-playwright` 4.1.12, `vitest-browser-react` 2.3.0, `playwright` 1.64.1 (chromium, headless under CI).

**Spec:** `docs/superpowers/specs/2026-10-22-remove-testing-library-pilot-design.md` (pilot design; sweep was its stated non-goal, now in scope by user request)

## The Recipe (every package task follows this — pilot-proven)

1. `package.json` devDependencies += `"@vitest/browser-playwright": "catalog:"`, `"playwright": "catalog:"`, `"react-dom": "catalog:"`, `"vitest-browser-react": "catalog:"` (alphabetical order).
2. `vitest.config.ts`: drop `environment` + `setupFiles` overrides; add the browser block:

```ts
import { playwright } from '@vitest/browser-playwright'
import { mergeConfig } from 'vitest/config'
import { defaultConfig } from '../../vitest.config'

export default mergeConfig(defaultConfig, {
  test: {
    browser: {
      provider: playwright(),
      enabled: true,
      // headless defaults to process.env.CI, so local runs stay headful for debugging
      instances: [{ browser: 'chromium' }],
    },
  },
})
```

3. Delete `vitest.setup.ts` (auto-cleanup is built into vitest-browser-react).
4. `tsconfig.json`: add `"lib": ["ESNext", "DOM"]`, `"skipLibCheck": true` (scouter shape) if not already present.
5. Port tests:
   - `renderHook`/`act` from `@testing-library/react` → same names from `vitest-browser-react`; `renderHook(...)`/`act(...)` are awaited; `act` comes from the `renderHook` result.
   - `render`/`screen` → `render` from `vitest-browser-react`; queries on the returned `screen`; assert with `await expect.element(locator).toHaveTextContent/toBeVisible/...` (built-in matchers; auto-retry replaces `waitFor`).
   - `userEvent` from `@testing-library/user-event` → locator methods (`.click()`, `.fill()`) or `userEvent` from `vitest/browser`.
   - Remove `import '@testing-library/jest-dom/vitest'` lines.
   - `waitFor` from vitest does NOT exist as a runtime export in 4.1.12 — non-DOM `waitFor` uses become `vi.waitFor` (same signature/behavior); DOM ones become `expect.element` auto-retry.
   - Fake timers work as-is (pilot-proven; timers may advance bare outside `act` when asserted via `expect.element`).
   - Lint rules that bit in the pilot: arrow-function components, `describe(fn)` not `describe('fn')`, no `process.env`.
6. Remove `vitest-localstorage-mock` from setupFiles where present — real localStorage; tests must clear storage themselves (add `beforeEach(() => localStorage.clear())` where they don't).
7. Verify: `pnpm --filter <pkg> test:unit` green; `rg "testing-library" packages/<pkg>` empty; `pnpm --filter <pkg> typecheck` clean.
8. Commit: `test(<pkg>): migrate to vitest browser mode`.

## Global Constraints

- Catalog versions fixed by the pilot; `@vitest/browser-playwright` stays exactly 4.1.12
- Turbo task names unchanged; no changesets (test infra only)
- Every package must be verified green BEFORE the stack-deletion task runs
- Never push intermediate states where a package is mid-migration (pre-commit gates enforce green lint/typecheck anyway)

## Review Focus

1. **Storage leakage between tests**: browser iframes share real localStorage within a file — migrated storage tests must clear state (they mostly do; verify per package).
2. **auth-scw `globalThis.location.href = ...`**: a real assignment navigates the iframe and kills the runner — must be stubbed (`delete (globalThis as any).location` + `vi.stubGlobal`, or rewrite to memory-history).
3. **use-clipboard `navigator.clipboard`**: real clipboard in headless chromium needs permissions — must stay mocked.
4. **Stack-deletion completeness**: any lingering testing-library/jsdom reference fails lint/typecheck after removal — `rg` repo-wide is the check.
5. **12 parallel chromium instances on CI**: first multi-browser CI run is the final gate; `--concurrency` on the turbo invocation is the contingency.

---

### Task 1: Root + CI generalization

**Files:** `package.json` (root), `.github/workflows/ci.yml`

- [x] Add `"playwright": "catalog:"` to root devDependencies; run `pnpm install`.
- [x] CI step: `pnpm --filter @scaleway/use-countdown exec playwright install chromium --with-deps` → `pnpm exec playwright install chromium --with-deps`.
- [x] Verify `pnpm --filter @scaleway/use-countdown test:unit` still green; commit `ci: install chromium at root for browser mode tests`.

### Tasks 2–6: mechanical hook-test packages

**Files per package:** package.json, vitest.config.ts, (delete vitest.setup.ts), tsconfig.json, `src/__tests__/*`

Quirks beyond the recipe:

- [x] **Task 2 — use-clipboard**: fake timers (pilot-proven); check how `navigator.clipboard` is mocked and keep the mock (real clipboard needs permissions).
- [x] **Task 3 — use-interval**: fake timers.
- [x] **Task 4 — use-random-name**: none.
- [x] **Task 5 — use-visual-persistence**: real localStorage (clears in `afterEach` — verified); remove mock setupFile.
- [x] **Task 6 — use-growthbook**: `renderHook` + one `render` suite; growthbook lib is plain JS — should port mechanically.

### Tasks 7–9: medium packages

- [x] **Task 7 — use-analytics** (3 files): `waitFor` → `expect.element` retry; survey analytics-lib mocks and keep them (network calls must not hit anything real).
- [x] **Task 8 — use-dataloader** (5 files): heavy `waitFor`/`screen` usage; `dataloader.test.ts` is node-ish — survey what it renders; keep fetch/SWR mocks.
- [x] **Task 9 — use-i18n** (3 files, 780 tests): fake timers; `vi.spyOn(globalThis, 'localStorage', 'get')` — should work on chromium's configurable accessor, verify early in the file; `waitFor` → `expect.element`.

### Tasks 10–12: high-risk packages

- [x] **Task 10 — use-storage** (2 files): client test uses real localStorage now (remove mock setupFile; tests clear via removeItem/beforeEach); **server test** is `describe.todo` with `@vitest-environment node` + TL/pure imports — replace imports with `vitest-browser-react` and keep `describe.todo` if the browser runner accepts it, else delete the file (ledger the ruling; it never ran).
- [x] **Task 11 — auth-scw** (4 files): **must stub `globalThis.location.href` assignments** (2 sites in AuthScwProvider.test.tsx) — real navigation kills the iframe; the node-env storage failures from the pilot disappear in a real browser (real localStorage); cookie tests get real `document.cookie`; `waitFor` → `expect.element`.
- [x] **Task 12 — scouter** (28 files): `history.push/replace` calls are on the memory-history lib object — safe; remove the 2 direct `@testing-library/jest-dom/vitest` imports; `userEvent` (useBlockNavigation) → locator methods; survey for any `window.location` writes (none found in survey — reads are fine).

### Task 13: Delete the stack

**Files:** root `package.json`, `pnpm-workspace.yaml` catalog, `packages/validate-icu-locales/vitest.config.ts`

- [x] Remove from root devDependencies + catalog: `@testing-library/dom`, `@testing-library/jest-dom`, `@testing-library/react`, `@testing-library/user-event`, `happy-dom`, `jsdom`, `vitest-localstorage-mock`.
- [x] `validate-icu-locales/vitest.config.ts`: remove the `@testing-library/jest-dom/vitest` setupFile (it never imported testing-library in tests).
- [x] `rg -i "testing-library|jsdom|happy-dom|vitest-localstorage-mock" packages/ --glob '!node_modules'` → empty.
- [x] `pnpm install` clean; `pnpm turbo test:unit --concurrency=4` green (26 tasks); commit `chore: remove testing-library, jsdom and happy-dom`.

### Task 14: Final verification + PR update

- [ ] `pnpm format` + full lint on changed files; `pnpm turbo test:unit:coverage --concurrency=4` green (CI parity); push; update PR #4049 title/description to cover the full migration.
- [ ] Watch both CI legs (first multi-chromium CI run — Review Focus #5).
