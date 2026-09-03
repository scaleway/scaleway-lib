// oxlint-disable max-lines
import { readFile, writeFile } from 'node:fs/promises'
import { defaultConfig, readConfig } from '@changesets/config'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { MockInstance } from 'vitest'
import { defaultGitValues, mockSimpleGit } from '../../__mocks__/simple-git'
import { run } from '../generateChangeset.js'

// Mock all external dependencies
vi.mock(import('node:fs/promises'))

vi.mock(import('@changesets/config'), async importOriginal => {
  const actual = await importOriginal()

  return {
    ...actual,
    readConfig: vi.fn().mockResolvedValue({ config: actual.defaultConfig, warnings: [], errors: undefined }),
  }
})

const mockedWriteFile = vi.mocked(writeFile)
const mockedReadFile = vi.mocked(readFile)

describe('generate changeset file', () => {
  // oxlint-disable-next-line eslint/init-declarations -- assigned in beforeEach
  let consoleLogSpy: MockInstance<typeof console.log>

  beforeEach(() => {
    consoleLogSpy = vi.spyOn(console, 'log')
    vi.mocked(readConfig).mockResolvedValue({
      config: defaultConfig,
      warnings: [],
      errors: undefined,
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
    delete process.env['SKIP_BRANCH_CHECK']
    delete process.env['SKIP_COMMIT']
    delete process.env['BRANCH_PREFIX']
    delete process.env['SORT_CHANGESETS']
  })

  it('should skip if not in renovate branch', async () => {
    mockSimpleGit.mockReturnValue({
      ...defaultGitValues,
      branch: () => ({
        current: 'main',
      }),
      diffSummary: () => ({}),
      show: () => '',
    })

    await run()

    expect(consoleLogSpy).toHaveBeenCalledWith('Not a renovate branch, skipping')
  })

  it('should not skip if branch starts with custom branch prefix', async () => {
    const rev = 'test'
    const fileName = `.changeset/renovate-${rev}.md`
    const file = 'test/package.json'
    const revparse = vi.fn().mockReturnValue(rev)
    const add = vi.fn()
    const commit = vi.fn()
    const push = vi.fn()

    mockSimpleGit.mockReturnValue({
      add,
      branch: () => ({
        current: 'dep-upgrade/test',
      }),
      commit,
      diffSummary: () => ({
        files: [
          {
            file,
          },
        ],
      }),
      push,
      revparse,
      show: () => `
+ "package": "version"
+ "package2": "version2"
`,
    })

    // Mock changeset config for this test
    mockedReadFile.mockImplementation(async path => {
      if (path === 'test/package.json') {
        return `{"name":"packageName","version":"1.0.0","dependencies": { "package": "1.0.0", "package2": "1.2.2" }}`
      }

      return '{}'
    })

    process.env['BRANCH_PREFIX'] = 'dep-upgrade/'
    await run()

    expect(consoleLogSpy).not.toHaveBeenCalledWith('Not a renovate branch, skipping')
    expect(mockedReadFile).toHaveBeenCalledWith(file, 'utf8')
    expect(mockedWriteFile).toMatchSnapshot()
    expect(add).toHaveBeenCalledWith(fileName)
    expect(commit).toHaveBeenCalledWith(`chore: add ${fileName}`)
    expect(push).toHaveBeenCalledTimes(1)
  })

  it('should not skip if not in renovate branch, when branch check skip is true', async () => {
    const rev = 'test'
    const fileName = `.changeset/renovate-${rev}.md`
    const file = 'test/package.json'
    const revparse = vi.fn().mockReturnValue(rev)
    const add = vi.fn()
    const commit = vi.fn()
    const push = vi.fn()

    mockSimpleGit.mockReturnValue({
      add,
      branch: () => ({
        current: 'main',
      }),
      commit,
      diffSummary: () => ({
        files: [
          {
            file,
          },
        ],
      }),
      push,
      revparse,
      show: () => `
+ "package": "version"
+ "package2": "version2"
`,
    })

    // Mock changeset config for this test
    mockedReadFile.mockImplementation(async path => {
      if (path === 'test/package.json') {
        return `{"name":"packageName","version":"1.0.0","dependencies": { "package": "1.0.0", "package2": "1.2.2" }}`
      }

      return '{}'
    })

    process.env['SKIP_BRANCH_CHECK'] = 'TRUE'
    await run()

    expect(consoleLogSpy).not.toHaveBeenCalledWith('Not a renovate branch, skipping')
    expect(mockedReadFile).toHaveBeenCalledWith(file, 'utf8')
    expect(mockedWriteFile).toMatchSnapshot()
    expect(add).toHaveBeenCalledWith(fileName)
    expect(commit).toHaveBeenCalledWith(`chore: add ${fileName}`)
    expect(push).toHaveBeenCalledTimes(1)
  })

  it('should skip if .changeset is already modified', async () => {
    mockSimpleGit.mockReturnValue({
      ...defaultGitValues,
      branch: () => ({
        current: 'renovate/test',
      }),
      diffSummary: () => ({
        files: [
          {
            file: '.changeset/hello.yml',
          },
        ],
      }),
      show: () => '',
    })

    await run()

    expect(consoleLogSpy).toHaveBeenCalledWith('Changeset already exists, skipping')
  })

  it('should skip no package.json files have been modified', async () => {
    mockSimpleGit.mockReturnValue({
      ...defaultGitValues,
      branch: () => ({
        current: 'renovate/test',
      }),
      diffSummary: () => ({
        files: [],
      }),
      show: () => '',
    })

    await run()

    expect(consoleLogSpy).toHaveBeenCalledWith('No relevant changes detected, skipping')
  })

  it('should generate changeset file, commit and push', async () => {
    const rev = 'test'
    const fileName = `.changeset/renovate-${rev}.md`
    const file = 'test/package.json'
    const revparse = vi.fn().mockReturnValue(rev)
    const add = vi.fn()
    const commit = vi.fn()
    const push = vi.fn()

    mockSimpleGit.mockReturnValue({
      add,
      branch: () => ({
        current: 'renovate/test',
      }),
      commit,
      diffSummary: () => ({
        files: [
          {
            file,
          },
        ],
      }),
      push,
      revparse,
      show: () => `
+ "packagez": "version2"
+ "packagea": "version"
`,
    })

    // Mock changeset config for this test
    mockedReadFile.mockImplementation(async path => {
      if (path === 'test/package.json') {
        return `{"name":"packageName","version":"1.0.0","dependencies": { "packagez": "1.0.0", "package2": "1.2.2" }}`
      }

      return '{}'
    })

    await run()

    expect(mockedReadFile).toHaveBeenCalledWith(file, 'utf8')
    expect(mockedWriteFile).toMatchSnapshot()
    expect(add).toHaveBeenCalledWith(fileName)
    expect(commit).toHaveBeenCalledWith(`chore: add ${fileName}`)
    expect(push).toHaveBeenCalledTimes(1)
  })

  it('should generate changeset file, but skip commit and push', async () => {
    const rev = 'test'
    const fileName = `.changeset/renovate-${rev}.md`
    const file = 'test/package.json'
    const revparse = vi.fn().mockReturnValue(rev)
    const add = vi.fn()
    const commit = vi.fn()
    const push = vi.fn()

    mockSimpleGit.mockReturnValue({
      add,
      branch: () => ({
        current: 'renovate/test',
      }),
      commit,
      diffSummary: () => ({
        files: [
          {
            file,
          },
        ],
      }),
      push,
      revparse,
      show: () => `
+ "package": "version"
+ "package2": "version2"
`,
    })

    // Mock changeset config for this test
    mockedReadFile.mockImplementation(async path => {
      if (path === 'test/package.json') {
        return `{"name":"packageName","version":"1.0.0","dependencies": { "package": "1.0.0", "package2": "1.2.2" }}`
      }

      return '{}'
    })

    process.env['SKIP_COMMIT'] = 'TRUE'
    await run()

    expect(mockedReadFile).toHaveBeenCalledWith(file, 'utf8')
    expect(mockedWriteFile).toMatchSnapshot()
    expect(add).not.toHaveBeenCalledWith(fileName)
    expect(commit).not.toHaveBeenCalledWith(`chore: add changeset renovate-${rev}`)
    expect(push).not.toHaveBeenCalledTimes(1)
  })

  it('should generate sorted changeset file, but skip commit and push', async () => {
    const rev = 'test'
    const fileName = `.changeset/renovate-${rev}.md`
    const fileA = 'test-a/package.json'
    const fileB = 'test-b/package.json'
    const revparse = vi.fn().mockReturnValue(rev)
    const add = vi.fn()
    const commit = vi.fn()
    const push = vi.fn()

    mockSimpleGit.mockReturnValue({
      add,
      branch: () => ({
        current: 'renovate/test',
      }),
      commit,
      diffSummary: () => ({
        files: [
          {
            file: fileB,
          },
          {
            file: fileA,
          },
        ],
      }),
      push,
      revparse,
      show: () => `
+ "packagez": "version2"
+ "packagea": "version"
`,
    })

    // Mock changeset config for this test
    mockedReadFile.mockImplementation(async path => {
      if (path === 'test-a/package.json') {
        return `{"name":"packageNameA","version":"1.0.0","dependencies": { "packagez": "1.0.0" }}`
      }
      if (path === 'test-b/package.json') {
        return `{"name":"packageNameB","version":"1.0.0","dependencies": { "packagea": "1.0.0" }}`
      }

      return '{}'
    })

    process.env['SKIP_COMMIT'] = 'TRUE'
    process.env['SORT_CHANGESETS'] = 'TRUE'
    await run()

    expect(mockedReadFile).toHaveBeenCalledWith(fileA, 'utf8')
    expect(mockedReadFile).toHaveBeenCalledWith(fileB, 'utf8')
    expect(mockedWriteFile).toMatchSnapshot()
    expect(add).not.toHaveBeenCalledWith(fileName)
    expect(commit).not.toHaveBeenCalledWith(`chore: add changeset renovate-${rev}`)
    expect(push).not.toHaveBeenCalledTimes(1)
  })

  it('should ignore workspace package.json', async () => {
    const file = 'package.json'

    mockSimpleGit.mockReturnValue({
      ...defaultGitValues,
      branch: () => ({
        current: 'renovate/test',
      }),
      diffSummary: () => ({
        files: [
          {
            file,
          },
        ],
      }),
      show: () => `
+ "package": "version"
+ "package2": "version2"
`,
    })

    // Mock changeset config for this test
    mockedReadFile.mockImplementation(async path => {
      if (path === 'package.json') {
        return `{"name":"packageName","workspaces":[]}`
      }

      return '{}'
    })

    await run()

    expect(mockedReadFile).toHaveBeenCalledWith(file, 'utf8')
    expect(consoleLogSpy).toHaveBeenCalledWith('No packages modified, skipping')
  })

  it('should ignore version package.json', async () => {
    const file = 'package.json'

    mockSimpleGit.mockReturnValue({
      ...defaultGitValues,
      branch: () => ({
        current: 'renovate/test',
      }),
      diffSummary: () => ({
        files: [
          {
            file,
          },
        ],
      }),
      show: () => `
+ "package": "version"
+ "package2": "version2"
`,
    })

    // Mock changeset config for this test
    mockedReadFile.mockImplementation(async path => {
      if (path === 'package.json') {
        return `{"name":"packageName"}`
      }

      return '{}'
    })

    await run()

    expect(mockedReadFile).toHaveBeenCalledWith(file, 'utf8')
    expect(consoleLogSpy).toHaveBeenCalledWith('No packages modified, skipping')
  })

  it('should ignore changeset ignored packages', async () => {
    const file = 'test/package.json'

    mockSimpleGit.mockReturnValue({
      ...defaultGitValues,
      branch: () => ({
        current: 'renovate/test',
      }),
      diffSummary: () => ({
        files: [
          {
            file,
          },
        ],
      }),
      show: () => `
+ "package": "version"
+ "package2": "version2"
`,
    })

    vi.mocked(readConfig).mockResolvedValue({
      config: { ...defaultConfig, ignore: ['packageName'] },
      warnings: [],
      errors: undefined,
    })

    // Mock changeset config for this test
    mockedReadFile.mockImplementation(async path => {
      if (path === 'test/package.json') {
        return `{"name":"packageName","version":"1.0.0"}`
      }

      return '{}'
    })

    await run()

    expect(mockedReadFile).toHaveBeenCalledWith(file, 'utf8')
    expect(consoleLogSpy).toHaveBeenCalledWith('No packages modified, skipping')
  })

  it('should ignore private packages if config said so', async () => {
    const file = 'test/package.json'

    mockSimpleGit.mockReturnValue({
      ...defaultGitValues,
      branch: () => ({
        current: 'renovate/test',
      }),
      diffSummary: () => ({
        files: [
          {
            file,
          },
        ],
      }),
      show: () => `
+ "package": "version"
+ "package2": "version2"
`,
    })

    vi.mocked(readConfig).mockResolvedValue({
      config: {
        ...defaultConfig,
        privatePackages: { version: false, tag: false },
      },
      warnings: [],
      errors: undefined,
    })

    // Mock changeset config for this test
    mockedReadFile.mockImplementation(async path => {
      if (path === 'test/package.json') {
        return `{"name":"packageName","version":"1.0.0", "private": true }`
      }

      return '{}'
    })

    await run()

    expect(mockedReadFile).toHaveBeenCalledWith(file, 'utf8')
    expect(consoleLogSpy).toHaveBeenCalledWith('No packages modified, skipping')
  })
})
