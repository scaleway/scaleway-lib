import { defaultConfig, readConfig } from '@changesets/config'
import { vol } from 'memfs'
import type { SimpleGit } from 'simple-git'
import { simpleGit } from 'simple-git'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { run } from '../generateChangeset.js'

// Mock all external dependencies
vi.mock(import('node:fs/promises'))
vi.mock(import('@changesets/config'), async importOriginal => {
  const actual = await importOriginal()

  return {
    ...actual,
    readConfig: vi
      .fn<typeof readConfig>()
      .mockResolvedValue({ config: actual.defaultConfig, warnings: [], errors: undefined }),
  }
})

describe('generate changeset file', () => {
  beforeEach(() => {
    vol.reset()
    vol.mkdirSync('/.changeset', { recursive: true })
    vi.spyOn(console, 'log')
    vi.mocked(readConfig).mockResolvedValue({
      config: defaultConfig,
      warnings: [],
      errors: undefined,
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.stubEnv('SKIP_BRANCH_CHECK', undefined)
    vi.stubEnv('SKIP_COMMIT', undefined)
    vi.stubEnv('BRANCH_PREFIX', undefined)
    vi.stubEnv('SORT_CHANGESETS', undefined)
  })

  it('should skip if not in renovate branch', async () => {
    vi.mocked(simpleGit).mockReturnValue({
      branch: () => ({
        current: 'main',
      }),
      diffSummary: () => ({}),
      show: () => '',
    } as unknown as SimpleGit)

    await run()

    expect(console.log).toHaveBeenCalledWith('Not a renovate branch, skipping')
  })

  it('should not skip if branch starts with custom branch prefix', async () => {
    const rev = 'test'
    const fileName = `.changeset/renovate-${rev}.md`
    const file = 'test/package.json'
    const revparse = vi.fn<() => string>().mockReturnValue(rev)
    const add = vi.fn<() => void>()
    const commit = vi.fn<() => void>()
    const push = vi.fn<() => void>()

    vi.mocked(simpleGit).mockReturnValue({
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
    } as unknown as SimpleGit)

    vol.fromJSON({
      'test/package.json': `{"name":"packageName","version":"1.0.0","dependencies": { "package": "1.0.0", "package2": "1.2.2" }}`,
    })

    vi.stubEnv('BRANCH_PREFIX', 'dep-upgrade/')
    await run()

    expect(console.log).not.toHaveBeenCalledWith('Not a renovate branch, skipping')
    expect(vol.readFileSync(fileName, 'utf8')).toMatchSnapshot()
    expect(add).toHaveBeenCalledWith(fileName)
    expect(commit).toHaveBeenCalledWith(`chore: add ${fileName}`)
    expect(push).toHaveBeenCalledTimes(1)
  })

  it('should not skip if not in renovate branch, when branch check skip is true', async () => {
    const rev = 'test'
    const fileName = `.changeset/renovate-${rev}.md`
    const file = 'test/package.json'
    const revparse = vi.fn<() => string>().mockReturnValue(rev)
    const add = vi.fn<() => void>()
    const commit = vi.fn<() => void>()
    const push = vi.fn<() => void>()

    vi.mocked(simpleGit).mockReturnValue({
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
    } as unknown as SimpleGit)

    vol.fromJSON({
      'test/package.json': `{"name":"packageName","version":"1.0.0","dependencies": { "package": "1.0.0", "package2": "1.2.2" }}`,
    })

    vi.stubEnv('SKIP_BRANCH_CHECK', 'true')
    await run()

    expect(console.log).not.toHaveBeenCalledWith('Not a renovate branch, skipping')
    expect(vol.readFileSync(fileName, 'utf8')).toMatchSnapshot()
    expect(add).toHaveBeenCalledWith(fileName)
    expect(commit).toHaveBeenCalledWith(`chore: add ${fileName}`)
    expect(push).toHaveBeenCalledTimes(1)
  })

  it('should skip if .changeset is already modified', async () => {
    vi.mocked(simpleGit).mockReturnValue({
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
    } as unknown as SimpleGit)

    await run()

    expect(console.log).toHaveBeenCalledWith('Changeset already exists, skipping')
  })

  it('should skip no package.json files have been modified', async () => {
    vi.mocked(simpleGit).mockReturnValue({
      branch: () => ({
        current: 'renovate/test',
      }),
      diffSummary: () => ({
        files: [],
      }),
      show: () => '',
    } as unknown as SimpleGit)

    await run()

    expect(console.log).toHaveBeenCalledWith('No relevant changes detected, skipping')
  })

  it('should generate changeset file, commit and push', async () => {
    const rev = 'test'
    const fileName = `.changeset/renovate-${rev}.md`
    const file = 'test/package.json'
    const revparse = vi.fn<() => string>().mockReturnValue(rev)
    const add = vi.fn<() => void>()
    const commit = vi.fn<() => void>()
    const push = vi.fn<() => void>()

    vi.mocked(simpleGit).mockReturnValue({
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
    } as unknown as SimpleGit)

    vol.fromJSON({
      'test/package.json': `{"name":"packageName","version":"1.0.0","dependencies": { "packagez": "1.0.0", "package2": "1.2.2" }}`,
    })

    await run()

    expect(vol.readFileSync(fileName, 'utf8')).toMatchSnapshot()
    expect(add).toHaveBeenCalledWith(fileName)
    expect(commit).toHaveBeenCalledWith(`chore: add ${fileName}`)
    expect(push).toHaveBeenCalledTimes(1)
  })

  it('should generate changeset file, but skip commit and push', async () => {
    const rev = 'test'
    const fileName = `.changeset/renovate-${rev}.md`
    const file = 'test/package.json'
    const revparse = vi.fn<() => string>().mockReturnValue(rev)
    const add = vi.fn<() => void>()
    const commit = vi.fn<() => void>()
    const push = vi.fn<() => void>()

    vi.mocked(simpleGit).mockReturnValue({
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
    } as unknown as SimpleGit)

    vol.fromJSON({
      'test/package.json': `{"name":"packageName","version":"1.0.0","dependencies": { "package": "1.0.0", "package2": "1.2.2" }}`,
    })

    vi.stubEnv('SKIP_COMMIT', 'true')
    await run()

    expect(vol.readFileSync(fileName, 'utf8')).toMatchSnapshot()
    expect(add).not.toHaveBeenCalledWith(fileName)
    expect(commit).not.toHaveBeenCalledWith(`chore: add changeset renovate-${rev}`)
    expect(push).not.toHaveBeenCalledTimes(1)
  })

  it('should generate sorted changeset file, but skip commit and push', async () => {
    const rev = 'test'
    const fileName = `.changeset/renovate-${rev}.md`
    const fileA = 'test-a/package.json'
    const fileB = 'test-b/package.json'
    const revparse = vi.fn<() => string>().mockReturnValue(rev)
    const add = vi.fn<() => void>()
    const commit = vi.fn<() => void>()
    const push = vi.fn<() => void>()

    vi.mocked(simpleGit).mockReturnValue({
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
    } as unknown as SimpleGit)

    vol.fromJSON({
      'test-a/package.json': `{"name":"packageNameA","version":"1.0.0","dependencies": { "packagez": "1.0.0" }}`,
      'test-b/package.json': `{"name":"packageNameB","version":"1.0.0","dependencies": { "packagea": "1.0.0" }}`,
    })

    vi.stubEnv('SKIP_COMMIT', 'true')
    vi.stubEnv('SORT_CHANGESETS', 'true')
    await run()

    expect(vol.readFileSync(fileName, 'utf8')).toMatchSnapshot()
    expect(add).not.toHaveBeenCalledWith(fileName)
    expect(commit).not.toHaveBeenCalledWith(`chore: add changeset renovate-${rev}`)
    expect(push).not.toHaveBeenCalledTimes(1)
  })

  it('should ignore workspace package.json', async () => {
    const file = 'package.json'

    vi.mocked(simpleGit).mockReturnValue({
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
    } as unknown as SimpleGit)

    vol.fromJSON({
      'package.json': `{"name":"packageName","workspaces":[]}`,
    })

    await run()

    expect(console.log).toHaveBeenCalledWith('No packages modified, skipping')
  })

  it('should ignore version package.json', async () => {
    const file = 'package.json'

    vi.mocked(simpleGit).mockReturnValue({
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
    } as unknown as SimpleGit)

    vol.fromJSON({
      'package.json': `{"name":"packageName"}`,
    })

    await run()

    expect(console.log).toHaveBeenCalledWith('No packages modified, skipping')
  })

  it('should ignore changeset ignored packages', async () => {
    const file = 'test/package.json'

    vi.mocked(simpleGit).mockReturnValue({
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
    } as unknown as SimpleGit)

    vi.mocked(readConfig).mockResolvedValue({
      config: { ...defaultConfig, ignore: ['packageName'] },
      warnings: [],
      errors: undefined,
    })

    vol.fromJSON({
      'test/package.json': `{"name":"packageName","version":"1.0.0"}`,
    })

    await run()

    expect(console.log).toHaveBeenCalledWith('No packages modified, skipping')
  })

  it('should ignore private packages if config said so', async () => {
    const file = 'test/package.json'

    vi.mocked(simpleGit).mockReturnValue({
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
    } as unknown as SimpleGit)

    vi.mocked(readConfig).mockResolvedValue({
      config: {
        ...defaultConfig,
        privatePackages: { version: false, tag: false },
      },
      warnings: [],
      errors: undefined,
    })

    vol.fromJSON({
      'test/package.json': `{"name":"packageName","version":"1.0.0", "private": true }`,
    })

    await run()

    expect(console.log).toHaveBeenCalledWith('No packages modified, skipping')
  })
})
