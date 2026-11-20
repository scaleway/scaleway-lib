import { execFileSync, execSync } from 'node:child_process'
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createChangesetForPackages, publishPackages } from '../utils.js'

vi.mock(import('node:child_process'))

const mockedExecFileSync = vi.mocked(execFileSync)

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
    mockedExecFileSync.mockReturnValue('')
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

const mockedExecSync = vi.mocked(execSync)

const lastExecOpts = (): { env?: Record<string, string | undefined> } | undefined => {
  const lastCall = mockedExecSync.mock.calls.at(-1)
  expect(lastCall).toBeDefined()
  return lastCall?.[1]
}

const userconfigFrom = (opts: { env?: Record<string, string | undefined> } | undefined): string => {
  const userconfig = opts?.env?.['NPM_CONFIG_USERCONFIG']
  expect(userconfig).toBeDefined()
  return userconfig ?? ''
}

const makeWorkspaceRoot = (): string => mkdtempSync(path.join(tmpdir(), 'fake-workspace-'))

describe('publishPackages registry auth', () => {
  beforeEach(() => {
    mockedExecSync.mockClear()
    mockedExecSync.mockReturnValue('')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('writes registry auth to a temp file outside the repo and removes it after publish', () => {
    const root = makeWorkspaceRoot()
    writeFileSync(path.join(root, '.npmrc'), 'registry=https://registry.npmjs.org/\n')
    vi.stubEnv('NPM_REGISTRY_USER', 'deploy')
    vi.stubEnv('NPM_REGISTRY_PASSWD', 's3cret')

    let authContent: string | undefined = undefined
    mockedExecSync.mockImplementation((_cmd, opts) => {
      authContent = readFileSync(userconfigFrom(opts), 'utf8')
      return ''
    })

    publishPackages(root, { skipPublish: false, provenance: false, registry: 'https://registry.npmjs.org' })

    // (a) workspace .npmrc untouched
    expect(readFileSync(path.join(root, '.npmrc'), 'utf8')).toBe('registry=https://registry.npmjs.org/\n')
    // (b) auth line in a temp file outside the repo, passed via NPM_CONFIG_USERCONFIG
    const userconfig = userconfigFrom(lastExecOpts())
    expect(userconfig.startsWith(root)).toBe(false)
    expect(authContent).toBe(`//registry.npmjs.org/:_auth=${Buffer.from('deploy:s3cret').toString('base64')}\n`)
    // (c) temp file removed after publish
    expect(existsSync(userconfig)).toBe(false)
    expect(existsSync(path.dirname(userconfig))).toBe(false)
    rmSync(root, { recursive: true, force: true })
  })

  it('removes the temp auth file even when publish fails', () => {
    const root = makeWorkspaceRoot()
    vi.stubEnv('NPM_REGISTRY_USER', 'deploy')
    vi.stubEnv('NPM_REGISTRY_PASSWD', 's3cret')
    mockedExecSync.mockImplementation(() => {
      throw new Error('publish failed')
    })

    expect(() => {
      publishPackages(root, { skipPublish: false, provenance: false, registry: 'https://registry.npmjs.org' })
    }).toThrow('publish failed')

    expect(existsSync(userconfigFrom(lastExecOpts()))).toBe(false)
    rmSync(root, { recursive: true, force: true })
  })

  it('publishes without a userconfig override when registry credentials are not set', () => {
    const root = makeWorkspaceRoot()
    vi.stubEnv('NPM_REGISTRY_USER', undefined)
    vi.stubEnv('NPM_REGISTRY_PASSWD', undefined)

    publishPackages(root, { skipPublish: false, provenance: false, registry: 'https://registry.npmjs.org' })

    expect(mockedExecSync).toHaveBeenCalledTimes(1)
    expect(lastExecOpts()?.env?.['NPM_CONFIG_USERCONFIG']).toBeUndefined()
    rmSync(root, { recursive: true, force: true })
  })

  it('does not publish when skipPublish is set', () => {
    const root = makeWorkspaceRoot()
    publishPackages(root, { skipPublish: true, provenance: false, registry: 'https://registry.npmjs.org' })
    expect(mockedExecSync).not.toHaveBeenCalled()
    rmSync(root, { recursive: true, force: true })
  })
})
