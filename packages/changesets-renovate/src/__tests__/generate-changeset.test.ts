import { readFile, writeFile } from 'node:fs/promises'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { defaultGitValues, mockSimpleGit } from '../../__mocks__/simple-git'
import { run } from '../cli.js'

// Mock all external dependencies
vi.mock('node:fs/promises')

const mockedWriteFile = vi.mocked(writeFile)
const mockedReadFile = vi.mocked(readFile)

beforeEach(() => {
  vi.spyOn(console, 'log')
  // Mock readFile to return empty config by default
  mockedReadFile.mockImplementation(async path => {
    if (path === '.changeset/config.json') {
      return '{}'
    }

    return '{}'
  })
})

describe('generate changeset file', () => {
  beforeEach(() => {
    // biome-ignore lint/performance/noDelete: error
    delete process.env['SKIP_BRANCH_CHECK']
    // biome-ignore lint/performance/noDelete: error
    delete process.env['SKIP_COMMIT']
    // biome-ignore lint/performance/noDelete: error
    delete process.env['BRANCH_PREFIX']
    // biome-ignore lint/performance/noDelete: error
    delete process.env['SORT_CHANGESETS']
  })

  it('should skip if not in renovate branch', async () => {
    mockSimpleGit.mockReturnValue({
      ...defaultGitValues,
      branch: () => ({
        current: 'main',
      }),
      diffSummary: () => undefined,
      show: () => undefined,
    })

    await run()

    expect(console.log).toHaveBeenCalledWith('Not a renovate branch, skipping')
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
      if (path === '.changeset/config.json') {
        return '{}'
      }
      if (path === 'test/package.json') {
        return `{"name":"packageName","version":"1.0.0"}`
      }

      return '{}'
    })

    process.env['BRANCH_PREFIX'] = 'dep-upgrade/'
    await run()

    expect(console.log).not.toHaveBeenCalledWith(
      'Not a renovate branch, skipping',
    )
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
      if (path === '.changeset/config.json') {
        return '{}'
      }
      if (path === 'test/package.json') {
        return `{"name":"packageName","version":"1.0.0"}`
      }

      return '{}'
    })

    process.env['SKIP_BRANCH_CHECK'] = 'TRUE'
    await run()

    expect(console.log).not.toHaveBeenCalledWith(
      'Not a renovate branch, skipping',
    )
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
      show: () => undefined,
    })

    await run()

    expect(console.log).toHaveBeenCalledWith(
      'Changeset already exists, skipping',
    )
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
      show: () => undefined,
    })

    await run()

    expect(console.log).toHaveBeenCalledWith(
      'No relevant changes detected, skipping',
    )
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
      if (path === '.changeset/config.json') {
        return '{}'
      }
      if (path === 'test/package.json') {
        return `{"name":"packageName","version":"1.0.0"}`
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
      if (path === '.changeset/config.json') {
        return '{}'
      }
      if (path === 'test/package.json') {
        return `{"name":"packageName","version":"1.0.0"}`
      }

      return '{}'
    })

    process.env['SKIP_COMMIT'] = 'TRUE'
    await run()

    expect(mockedReadFile).toHaveBeenCalledWith(file, 'utf8')
    expect(mockedWriteFile).toMatchSnapshot()
    expect(add).not.toHaveBeenCalledWith(fileName)
    expect(commit).not.toHaveBeenCalledWith(
      `chore: add changeset renovate-${rev}`,
    )
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
      if (path === '.changeset/config.json') {
        return '{}'
      }
      if (path === 'test-a/package.json') {
        return `{"name":"packageNameA","version":"1.0.0"}`
      }
      if (path === 'test-b/package.json') {
        return `{"name":"packageNameB","version":"1.1.1"}`
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
    expect(commit).not.toHaveBeenCalledWith(
      `chore: add changeset renovate-${rev}`,
    )
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
      if (path === '.changeset/config.json') {
        return '{}'
      }
      if (path === 'package.json') {
        return `{"name":"packageName","workspaces":[]}`
      }

      return '{}'
    })

    await run()

    expect(mockedReadFile).toHaveBeenCalledWith(file, 'utf8')
    expect(console.log).toHaveBeenCalledWith('No packages modified, skipping')
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
      if (path === '.changeset/config.json') {
        return '{}'
      }
      if (path === 'package.json') {
        return `{"name":"packageName"}`
      }

      return '{}'
    })

    await run()

    expect(mockedReadFile).toHaveBeenCalledWith(file, 'utf8')
    expect(console.log).toHaveBeenCalledWith('No packages modified, skipping')
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

    // Mock changeset config for this test
    mockedReadFile.mockImplementation(async path => {
      if (path === '.changeset/config.json') {
        return '{"ignore":["packageName"]}'
      }
      if (path === 'test/package.json') {
        return `{"name":"packageName","version":"1.0.0"}`
      }

      return '{}'
    })

    await run()

    expect(mockedReadFile).toHaveBeenCalledWith(file, 'utf8')
    expect(console.log).toHaveBeenCalledWith('No packages modified, skipping')
  })

  it('should ignore changeset ignored packages with star', async () => {
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

    // Mock changeset config for this test
    mockedReadFile.mockImplementation(async path => {
      if (path === '.changeset/config.json') {
        return '{"ignore":["@example/*"]}'
      }
      if (path === 'test/package.json') {
        return `{"name":"@example/test","version":"1.0.0"}`
      }

      return '{}'
    })

    await run()

    expect(mockedReadFile).toHaveBeenCalledWith(file, 'utf8')
    expect(console.log).toHaveBeenCalledWith('No packages modified, skipping')
  })
})
