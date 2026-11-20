import { execFileSync, execSync } from 'node:child_process'
import { vol } from 'memfs'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createChangesetForPackages, createTags, findWorkspaceRoot } from '../utils.js'

vi.mock(import('node:child_process'))

// findWorkspaceRoot reads through memfs so its tests stay hermetic
vi.mock(import('node:fs'), async importOriginal => {
  const actual = await importOriginal()
  const memfs = await import('memfs')
  return {
    ...actual,
    // memfs' option types allow null, node:fs' do not
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion
    readFileSync: memfs.vol.readFileSync as typeof actual.readFileSync,
  }
})

const mockedExecFileSync = vi.mocked(execFileSync)
const mockedExecSync = vi.mocked(execSync)

const basePackage = {
  name: '@scaleway/sdk-instance',
  path: '/fake/path',
  version: '1.0.0',
  relativePath: 'packages/sdk-instance',
}

const getLastCallArgs = (): string[] => {
  const lastCall = mockedExecFileSync.mock.calls.at(-1)
  expect(lastCall).toBeDefined()
  const args = lastCall?.[1]
  expect(Array.isArray(args)).toBe(true)
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  return (args as readonly unknown[]).map(v => (typeof v === 'string' ? v : String(v)))
}

const getSummaryFromLastCall = (): string => {
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
    mockedExecSync.mockClear()
    mockedExecFileSync.mockReturnValue('')
    vol.reset()
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

describe(createTags, () => {
  it('runs git tag commands via execFile with metacharacters kept in one argv element', () => {
    const name = 'evil" ; echo pwned; #'
    const tag = `${name}@1.0.0`
    const pkg = { ...basePackage, name }
    const newPkg = { ...basePackage, name, version: '1.0.0' }

    mockedExecFileSync.mockImplementationOnce(() => {
      throw new Error('refs/tags does not exist')
    })

    const newTags = createTags({
      root: '/fake/path',
      affectedPackages: [pkg],
      updatedPackages: [newPkg],
    })

    expect(mockedExecSync).not.toHaveBeenCalled()
    expect(newTags).toStrictEqual([tag])
    const gitArgs = mockedExecFileSync.mock.calls.map(call => {
      expect(call[0]).toBe('git')
      const [, args] = call
      expect(Array.isArray(args)).toBe(true)
      // oxlint-disable-next-line typescript/no-unsafe-type-assertion
      return args as readonly string[]
    })
    expect(gitArgs).toStrictEqual([
      ['rev-parse', '-q', '--verify', `refs/tags/${tag}`],
      ['ls-remote', '--tags', 'origin', `refs/tags/${tag}`],
      ['tag', tag, '-m', tag],
    ])
  })
})

describe(findWorkspaceRoot, () => {
  it('walks up from a nested directory to the one holding pnpm-workspace.yaml', () => {
    vol.fromJSON({ '/repo/pnpm-workspace.yaml': 'packages:\n', '/repo/packages/a/src': null })

    expect(findWorkspaceRoot('/repo/packages/a/src')).toBe('/repo')
  })

  it('terminates the walk and returns the start when no root is found', () => {
    expect(findWorkspaceRoot('/nowhere/deep/dir')).toBe('/nowhere/deep/dir')
  })
})
