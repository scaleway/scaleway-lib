import fs from 'node:fs/promises'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { run } from '..'
import { defaultGitValues, mockSimpleGit } from '../../__mocks__/simple-git'

vi.mock('node:fs/promises')

beforeEach(() => {
  vi.spyOn(console, 'log')
})

describe('generate changeset file', () => {
  beforeEach(() => {
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
      show: () => undefined,
      diffSummary: () => undefined,
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
      branch: () => ({
        current: 'dep-upgrade/test',
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
      revparse,
      add,
      commit,
      push,
    })

    fs.readFile = vi
      .fn()
      .mockResolvedValueOnce('{}')
      .mockResolvedValueOnce(`{"name":"packageName","version":"1.0.0"}`)
    fs.writeFile = vi.fn()

    process.env['BRANCH_PREFIX'] = 'dep-upgrade/'
    await run()

    expect(console.log).not.toHaveBeenCalledWith(
      'Not a renovate branch, skipping',
    )
    expect(fs.readFile).toHaveBeenCalledWith(file, 'utf8')
    expect(fs.writeFile).toMatchSnapshot()
    expect(add).toHaveBeenCalledWith(fileName)
    expect(commit).toHaveBeenCalledWith(`chore: add changeset renovate-${rev}`)
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
      branch: () => ({
        current: 'main',
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
      revparse,
      add,
      commit,
      push,
    })

    fs.readFile = vi
      .fn()
      .mockResolvedValueOnce('{}')
      .mockResolvedValueOnce(`{"name":"packageName","version":"1.0.0"}`)
    fs.writeFile = vi.fn()

    process.env['SKIP_BRANCH_CHECK'] = 'TRUE'
    await run()

    expect(console.log).not.toHaveBeenCalledWith(
      'Not a renovate branch, skipping',
    )
    expect(fs.readFile).toHaveBeenCalledWith(file, 'utf8')
    expect(fs.writeFile).toMatchSnapshot()
    expect(add).toHaveBeenCalledWith(fileName)
    expect(commit).toHaveBeenCalledWith(`chore: add changeset renovate-${rev}`)
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
      'No package.json changes to published packages, skipping',
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
+ "packagez": "version2"
+ "packagea": "version"
`,
      revparse,
      add,
      commit,
      push,
    })

    fs.readFile = vi
      .fn()
      .mockResolvedValueOnce('{}')
      .mockResolvedValueOnce(`{"name":"packageName","version":"1.0.0"}`)
    fs.writeFile = vi.fn()

    await run()

    expect(fs.readFile).toHaveBeenCalledWith(file, 'utf8')
    expect(fs.writeFile).toMatchSnapshot()
    expect(add).toHaveBeenCalledWith(fileName)
    expect(commit).toHaveBeenCalledWith(`chore: add changeset renovate-${rev}`)
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
      revparse,
      add,
      commit,
      push,
    })

    fs.readFile = vi
      .fn()
      .mockResolvedValueOnce('{}')
      .mockResolvedValueOnce(`{"name":"packageName","version":"1.0.0"}`)
    fs.writeFile = vi.fn()

    process.env['SKIP_COMMIT'] = 'TRUE'
    await run()

    expect(fs.readFile).toHaveBeenCalledWith(file, 'utf8')
    expect(fs.writeFile).toMatchSnapshot()
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
      branch: () => ({
        current: 'renovate/test',
      }),
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
      show: () => `
+ "packagez": "version2"
+ "packagea": "version"
`,
      revparse,
      add,
      commit,
      push,
    })

    fs.readFile = vi
      .fn()
      .mockResolvedValueOnce('{}')
      .mockResolvedValueOnce(`{"name":"packageNameB","version":"1.1.1"}`)
      .mockResolvedValueOnce(`{"name":"packageNameA","version":"1.0.0"}`)
    fs.writeFile = vi.fn()

    process.env['SKIP_COMMIT'] = 'TRUE'
    process.env['SORT_CHANGESETS'] = 'TRUE'
    await run()

    expect(fs.readFile).toHaveBeenCalledWith(fileA, 'utf8')
    expect(fs.readFile).toHaveBeenCalledWith(fileB, 'utf8')
    expect(fs.writeFile).toMatchSnapshot()
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

    fs.readFile = vi
      .fn()
      .mockResolvedValueOnce('{}')
      .mockResolvedValueOnce(`{"name":"packageName","workspaces":[]}`)
    fs.writeFile = vi.fn()

    await run()

    expect(fs.readFile).toHaveBeenCalledWith(file, 'utf8')
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

    fs.readFile = vi
      .fn()
      .mockResolvedValueOnce('{}')
      .mockResolvedValueOnce(`{"name":"packageName"}`)
    fs.writeFile = vi.fn()

    await run()

    expect(fs.readFile).toHaveBeenCalledWith(file, 'utf8')
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

    fs.readFile = vi
      .fn()
      .mockResolvedValueOnce(`{"ignore":["packageName"]}`)
      .mockResolvedValueOnce(`{"name":"packageName","version":"1.0.0"}`)
    fs.writeFile = vi.fn()

    await run()

    expect(fs.readFile).toHaveBeenCalledWith(file, 'utf8')
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

    fs.readFile = vi
      .fn()
      .mockResolvedValueOnce(`{"ignore":["@example/*"]}`)
      .mockResolvedValueOnce(`{"name":"@example/test","version":"1.0.0"}`)
    fs.writeFile = vi.fn()

    await run()

    expect(fs.readFile).toHaveBeenCalledWith(file, 'utf8')
    expect(console.log).toHaveBeenCalledWith('No packages modified, skipping')
  })
})
