# use-countdown browser-mode pilot — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate `@scaleway/use-countdown` from testing-library/jsdom to Vitest browser mode (playwright/chromium) with component and hook testing, proving the pattern for the remaining 12 packages.

**Architecture:** Per-package override of the shared root `defaultConfig` enabling `browser.provider = playwright()`; tests rewritten from `@testing-library/react`'s `renderHook`/`act` to `vitest-browser-react`'s equivalents (near line-for-line), one test promoted to a `render` + locator `click` component test. CI gains a cached playwright browser install. Everything lands as **one PR, pushed once at the end** — intermediate commits must not be pushed, since CI would run browser-mode tests without browsers installed.

**Tech Stack:** vitest 4.1.12, `@vitest/browser-playwright` 4.1.12, `vitest-browser-react` 2.3.0, `playwright` 1.64.1 (chromium only).

**Spec:** `docs/superpowers/specs/2026-10-22-remove-testing-library-pilot-design.md`

## Global Constraints

- `@vitest/browser-playwright` pinned to `4.1.12` (exact match with vitest, per its peer range)
- Chromium single instance; headless only when `process.env.CI === 'true'`
- Turbo task names and scripts (`test:unit`, `test:unit:coverage`) unchanged
- Coverage must still emit `coverage/cobertura-coverage.xml` (codecov globs it)
- No changeset (test infra only, `dist/` unchanged)
- `pnpm install` must keep the lockfile consistent (`--frozen-lockfile` CI check)

## Review Focus

1. Countdown reaching 0 stops and never renders negative — test "should stop when time reaches 0" pins it (asserts `0` again after another second; a `-1` render fails `getByText('0')`).
2. Restart mid-countdown resets to duration — test "should reset to duration when startCountdown is called again" pins it (4 → click → 5).
3. Fake-timer advance must update the DOM synchronously for `expect.element` retry — tests 2–4 pin it.
4. Coverage parity — Task 4 verifies `packages/use-countdown/coverage/cobertura-coverage.xml` exists after `test:unit:coverage`.
5. CI without browsers fails every job — Task 5's verification is the PR's CI run being green.

---

### Task 1: Dependencies

**Files:**

- Modify: `pnpm-workspace.yaml` (catalog block)
- Modify: `packages/use-countdown/package.json`

**Interfaces:**

- Produces: catalog entries `@vitest/browser-playwright: 4.1.12`, `vitest-browser-react: 2.3.0`, `playwright: 1.64.1` for later tasks and the eventual sweep.

- [x] **Step 1: Add catalog entries in `pnpm-workspace.yaml`** (keep alphabetical order within the catalog)

```yaml
'@vitest/browser-playwright': 4.1.12
playwright: 1.64.1
vitest-browser-react: 2.3.0
```

- [x] **Step 2: Add to `packages/use-countdown/package.json` devDependencies** (it already has `react: catalog:`; keep key order consistent with the file)

```json
    "@vitest/browser-playwright": "catalog:",
    "playwright": "catalog:",
    "vitest-browser-react": "catalog:"
```

- [x] **Step 3: Install and verify lockfile consistency**

Run: `pnpm install`
Expected: lockfile updated, exit 0. Then `git diff --stat pnpm-lock.yaml` shows the three additions.

- [x] **Step 4: Commit**

```bash
git add pnpm-workspace.yaml pnpm-lock.yaml packages/use-countdown/package.json
git commit -m "chore(use-countdown): add vitest browser mode dependencies"
```

### Task 2: Browser config + first smoke test

**Files:**

- Modify: `packages/use-countdown/vitest.config.ts` (full replace)
- Delete: `packages/use-countdown/vitest.setup.ts`
- Modify: `packages/use-countdown/src/__tests__/index.test.ts` → renamed to `index.test.tsx` (first test only; the other four are Task 3)
- Modify: `packages/use-countdown/tsconfig.json` (add DOM lib, same as scouter)

**Interfaces:**

- Produces: the package browser config consumed by every test file; `renderHook`/`act`/`render` from `vitest-browser-react` used by Task 3.

- [x] **Step 1: Replace `packages/use-countdown/vitest.config.ts`**

```ts
import { playwright } from '@vitest/browser-playwright'
import { mergeConfig } from 'vitest/config'
import { defaultConfig } from '../../vitest.config'

export default mergeConfig(defaultConfig, {
  test: {
    browser: {
      provider: playwright(),
      enabled: true,
      headless: process.env.CI === 'true',
      instances: [{ browser: 'chromium' }],
    },
  },
})
```

Note: `mergeConfig` concatenates setupFiles, so root's `vitest-localstorage-mock` still runs in the iframe — expected to be harmless here; spec risk #2 has the fallback if the iframe errors on it.

- [x] **Step 2: Delete `packages/use-countdown/vitest.setup.ts`** (the cleanup it performed is built into `vitest-browser-react`)

- [x] **Step 3: Add DOM lib to `packages/use-countdown/tsconfig.json`** — same shape as `packages/scouter/tsconfig.json`:

```json
{
  "extends": "@scaleway/tsconfig",
  "compilerOptions": {
    "lib": ["ESNext", "DOM"],
    "skipLibCheck": true
  },
  "include": ["src/**/*.ts", "src/**/*.tsx"]
}
```

- [x] **Step 4: Install the browser locally (one-time download)**

Run: `pnpm --filter @scaleway/use-countdown exec playwright install chromium`
Expected: chromium downloaded into `~/.cache/ms-playwright`, exit 0.

- [x] **Step 5: Rewrite the first test in `index.test.tsx`** — rename `index.test.ts` to `index.test.tsx`, replace the testing-library import and first test, leave the other four tests untouched (they still import testing-library helpers for now — they will fail to run, which is expected until Task 3):

```tsx
import { describe, expect, it, vi } from 'vitest'
import { renderHook } from 'vitest-browser-react'
import { useCountdown } from '../'

describe('useCountdown', () => {
  it('should initialize with the provided duration', async () => {
    const { result } = await renderHook(() => useCountdown({ duration: 5 }))

    expect(result.current.timeLeft).toBe(5)
  })
```

- [x] **Step 6: Run and verify the smoke test**

Run: `pnpm --filter @scaleway/use-countdown exec vitest --run -t "should initialize with the provided duration"`
Expected: chromium launches (headful locally), the one test PASSES, browser mode banner in output. If the iframe fails on `vitest-localstorage-mock`, apply spec risk-#2 fallback (move it from root `vitest.config.ts` setupFiles to `use-storage` + `use-visual-persistence` configs) and rerun.

- [x] **Step 7: Commit**

```bash
git add packages/use-countdown
git commit -m "test(use-countdown): enable vitest browser mode"
```

### Task 3: Migrate the remaining tests (fake timers + component test)

**Files:**

- Modify: `packages/use-countdown/src/__tests__/index.test.tsx`

**Interfaces:**

- Consumes: `render`, `renderHook`, `act` from `vitest-browser-react`; `vi.useFakeTimers`/`vi.advanceTimersByTime` from vitest.

- [x] **Step 1: Replace the four remaining tests.** Assertions keep their exact original values (5 → 4 → 3, 1 → 0, reset to 5). The last one becomes the pilot's component-testing proof (`render` + locator `click`):

```tsx
  it('should start countdown when startcountdown is called', async () => {
    vi.useFakeTimers()
    const { result, act } = await renderHook(() =>
      useCountdown({ duration: 5, start: false }),
    )

    await act(() => {
      result.current.startCountdown()
    })
    expect(result.current.timeLeft).toBe(5)

    await act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(result.current.timeLeft).toBe(4)
    vi.useRealTimers()
  })

  it('should decrement time every second when started', async () => {
    vi.useFakeTimers()
    const { result, act } = await renderHook(() =>
      useCountdown({ duration: 5, start: true }),
    )

    await act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(result.current.timeLeft).toBe(4)

    await act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(result.current.timeLeft).toBe(3)
    vi.useRealTimers()
  })

  it('should stop when time reaches 0', async () => {
    vi.useFakeTimers()
    const { result, act } = await renderHook(() =>
      useCountdown({ duration: 1, start: true }),
    )

    await act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(result.current.timeLeft).toBe(0)

    await act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(result.current.timeLeft).toBe(0)
    vi.useRealTimers()
  })

  it('should reset to duration when startcountdown is called again', async () => {
    vi.useFakeTimers()
    const screen = await render(<Countdown duration={5} start />)

    await act(() => {
      vi.advanceTimersByTime(1000)
    })
    await expect.element(screen.getByText('4')).toBeInTheDocument()

    await screen.getByRole('button').click()
    await expect.element(screen.getByText('5')).toBeInTheDocument()
    vi.useRealTimers()
  })
})
```

And the harness component above the `describe` (renders hook state as DOM, start button wired to `startCountdown`):

```tsx
function Countdown({ duration, start = false }: { duration: number; start?: boolean }) {
  const { startCountdown, timeLeft } = useCountdown({ duration, start })

  return (
    <>
      <p>{timeLeft}</p>
      <button type="button" onClick={startCountdown}>
        start
      </button>
    </>
  )
}
```

(The harness is a pure renderer: initial render shows `5`, after 1s `4`, after click `5` again.)

- [x] **Step 2: Run all tests**

Run: `pnpm --filter @scaleway/use-countdown test:unit`
Expected: 5/5 PASS in chromium. If the click test hangs under fake timers, apply spec risk-#1 fallbacks in order: `shouldAdvanceTime: true` → click before `useFakeTimers` → revert that test to the `renderHook`/`act` mechanical form.

- [x] **Step 3: Verify no testing-library import remains**

Run: `grep -r "testing-library" packages/use-countdown || true`
Expected: no output.

- [x] **Step 4: Commit**

```bash
git add packages/use-countdown/src/__tests__/index.test.tsx
git commit -m "test(use-countdown): migrate tests to browser mode component testing"
```

### Task 4: Repo checks + coverage parity

**Files:** none new — runs checks only.

- [x] **Step 1: Format and lint**

Run: `pnpm format && pnpm lint`
Expected: exit 0.

- [x] **Step 2: Typecheck**

Run: `pnpm --filter @scaleway/use-countdown typecheck`
Expected: exit 0.

- [x] **Step 3: Coverage parity**

Run: `pnpm --filter @scaleway/use-countdown test:unit:coverage`
Expected: 5/5 PASS and `packages/use-countdown/coverage/cobertura-coverage.xml` exists (`ls` it).

- [x] **Step 4: Commit any formatting fixes** (if none, skip)

```bash
git add -A && git commit -m "style: format browser-mode pilot"
```

### Task 5: CI playwright install

**Files:**

- Modify: `.github/workflows/ci.yml` (test job only)

- [x] **Step 1: Add browser cache + install steps** in the `test` job, between the bootstrap step and the `pnpm run test:unit:coverage` step (pin `actions/cache` to the digest already used elsewhere in the repo if present, else latest v5):

```yaml
- uses: actions/cache@<pinned-digest>
  with:
    path: ~/.cache/ms-playwright
    key: playwright-chromium-${{ hashFiles('pnpm-workspace.yaml') }}
- run: pnpm --filter @scaleway/use-countdown exec playwright install chromium --with-deps
```

- [x] **Step 2: Verify locally what CI will run** — the exact command from Step 1 without `--with-deps` already ran green in Task 2/3; nothing else is locally verifiable.

- [x] **Step 3: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "ci: install chromium for browser mode tests"
```

- [x] **Step 4: Push the branch once (first push) and open the pilot PR; watch the CI `test` job** — both node matrix legs must pass. This run is the plan's final verification (Review Focus #5).
