import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals'
import fs from 'node:fs/promises'
import { simpleGit } from 'simple-git'
import { run } from '..'

jest.mock('simple-git')
jest.mock('node:fs/promises')

beforeEach(() => {
  jest.spyOn(console, 'log')
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('generate changeset file', () => {
  it('should skip if not in renovate branch', async () => {
    ;(simpleGit as jest.Mock).mockReturnValue({
      branch: () => ({
        current: 'main',
      }),
    })

    await run()

    expect(console.log).toHaveBeenCalledWith('Not a renovate branch, skipping')
  })

  it('should skip if .changeset is already modified', async () => {
    ;(simpleGit as jest.Mock).mockReturnValue({
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
    })

    await run()

    expect(console.log).toHaveBeenCalledWith(
      'Changeset already exists, skipping',
    )
  })

  it('should skip no package.json files have been modified', async () => {
    ;(simpleGit as jest.Mock).mockReturnValue({
      branch: () => ({
        current: 'renovate/test',
      }),
      diffSummary: () => ({
        files: [],
      }),
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
    const revparse = jest.fn().mockReturnValue(rev)
    const add = jest.fn()
    const commit = jest.fn()
    const push = jest.fn()

    ;(simpleGit as jest.Mock).mockReturnValue({
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

    fs.readFile = jest
      .fn<any>()
      .mockResolvedValue(`{"name":"packageName","version":"1.0.0"}`)
    fs.writeFile = jest.fn<any>()

    await run()

    expect(fs.readFile).toHaveBeenCalledWith(file, 'utf8')
    expect(fs.writeFile).toMatchSnapshot()
    expect(add).toHaveBeenCalledWith(fileName)
    expect(commit).toHaveBeenCalledWith(`chore: add changeset renovate-${rev}`)
    expect(push).toHaveBeenCalledTimes(1)
  })

  it('should ignore workspace package.json', async () => {
    const file = 'package.json'

    ;(simpleGit as jest.Mock).mockReturnValue({
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

    fs.readFile = jest
      .fn<any>()
      .mockResolvedValue(`{"name":"packageName","workspaces":[]}`)
    fs.writeFile = jest.fn<any>()

    await run()

    expect(fs.readFile).toHaveBeenCalledWith(file, 'utf8')
    expect(console.log).toHaveBeenCalledWith('No packages modified, skipping')
  })

  it('should ignore version package.json', async () => {
    const file = 'package.json'

    ;(simpleGit as jest.Mock).mockReturnValue({
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

    fs.readFile = jest.fn<any>().mockResolvedValue(`{"name":"packageName"}`)
    fs.writeFile = jest.fn<any>()

    await run()

    expect(fs.readFile).toHaveBeenCalledWith(file, 'utf8')
    expect(console.log).toHaveBeenCalledWith('No packages modified, skipping')
  })
})
