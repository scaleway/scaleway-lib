import { execFileSync } from 'node:child_process'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createChangesetForPackages } from '../utils.js'

// @ts-expect-error vi.fn return type is narrower than execFileSync overloads
vi.mock(import('node:child_process'), () => ({
  execFileSync: vi.fn<() => string>(),
}))

const mockedExecFileSync = vi.mocked(execFileSync)

const basePackage = {
  name: '@scaleway/sdk-instance',
  path: '/fake/path',
  version: '1.0.0',
  relativePath: 'packages/sdk-instance',
}

function getLastCallArgs(): string[] {
  const lastCall = mockedExecFileSync.mock.calls.at(-1)
  expect(lastCall).toBeDefined()
  const args = lastCall?.[1]
  expect(Array.isArray(args)).toBe(true)
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  return (args as readonly unknown[]).map(v => (typeof v === 'string' ? v : String(v)))
}

function getSummaryFromLastCall(): string {
  const args = getLastCallArgs()
  const idx = args.indexOf('--summary')
  expect(idx).not.toBe(-1)
  const value = args[idx + 1]
  expect(value).toBeTypeOf('string')
  return value ?? ''
}

describe('pnpm-auto-release utils', () => {
  beforeEach(() => {
    mockedExecFileSync.mockClear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('passes a summary with double quotes without shell injection', () => {
    const summary = 'fix(instance/v1): revert "remove field export_uri on the Instance API" (#2673)'

    createChangesetForPackages('/tmp', [basePackage], summary)

    expect(mockedExecFileSync).toHaveBeenCalledTimes(1)
    expect(getLastCallArgs()[0]).toBe('change')
    expect(getSummaryFromLastCall()).toBe(summary)
    expect(getLastCallArgs()).toContain('@scaleway/sdk-instance')
  })

  it('passes a summary with backticks and $ signs without injection', () => {
    const summary = 'feat: add `$VAR` expansion in `config.ts`'

    createChangesetForPackages('/tmp', [basePackage], summary)

    expect(getSummaryFromLastCall()).toBe(summary)
  })

  it('passes a summary with single quotes without injection', () => {
    const summary = "fix: handle user's input with 'special' chars"

    createChangesetForPackages('/tmp', [basePackage], summary)

    expect(getSummaryFromLastCall()).toBe(summary)
  })

  it('passes a summary with semicolons and pipes without injection', () => {
    const summary = 'fix: prevent ; rm -rf / | cat /etc/passwd'

    createChangesetForPackages('/tmp', [basePackage], summary)

    expect(getSummaryFromLastCall()).toBe(summary)
  })

  it('passes multiple package names as separate args', () => {
    const pkg2 = { ...basePackage, name: '@scaleway/sdk-iam' }

    createChangesetForPackages('/tmp', [basePackage, pkg2], 'test summary')

    expect(getLastCallArgs()).toContain('@scaleway/sdk-instance')
    expect(getLastCallArgs()).toContain('@scaleway/sdk-iam')
  })
})
