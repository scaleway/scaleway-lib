import { execSync } from 'node:child_process'
import type { glob as nodeGlob } from 'node:fs/promises'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { globWithGitignore } from '../globWithGitignore.js'

const mockGlobResult = (...files: string[]) =>
  // `glob` from node:fs/promises returns an AsyncIterator yielding strings
  // oxlint-disable-next-line require-await -- yields are consumed by `for await`
  (async function* glb(): AsyncGenerator<string, undefined> {
    yield* files
  })()

const { globMock } = vi.hoisted(() => ({
  globMock: vi.fn<(pattern: string | readonly string[], options?: unknown) => AsyncIterator<string>>(),
}))

vi.mock(import('node:child_process'))
vi.mock(import('node:fs/promises'), () => ({
  glob: globMock as unknown as typeof nodeGlob,
}))

describe(globWithGitignore, () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(execSync).mockReturnValue('node_modules/\ndist/\n')
    vi.spyOn(process, 'cwd').mockReturnValue('/mock/repo')
  })

  it('should merge git-ignored files with existing exclude patterns', async () => {
    globMock.mockReturnValue(mockGlobResult('packages/package-a/package.json'))

    const result = await globWithGitignore(['packages/*/package.json'], {
      exclude: ['**/coverage'],
    })

    expect(vi.mocked(execSync)).toHaveBeenCalledWith(
      'git ls-files --others --ignored --exclude-standard --directory',
      expect.objectContaining({ cwd: '/mock/repo' }),
    )
    expect(globMock).toHaveBeenCalledWith(['packages/*/package.json'], {
      cwd: '/mock/repo',
      exclude: ['**/coverage', 'node_modules/', 'dist/'],
    })
    expect(result).toStrictEqual(['packages/package-a/package.json'])
  })

  it('should support a single string exclude pattern', async () => {
    globMock.mockReturnValue(mockGlobResult())

    await globWithGitignore(['**/*.ts'], { exclude: '**/generated' })

    expect(globMock).toHaveBeenCalledWith(['**/*.ts'], {
      cwd: '/mock/repo',
      exclude: ['**/generated', 'node_modules/', 'dist/'],
    })
  })

  it('should handle an undefined exclude option', async () => {
    globMock.mockReturnValue(mockGlobResult())

    await globWithGitignore(['**/*.ts'])

    expect(globMock).toHaveBeenCalledWith(['**/*.ts'], {
      cwd: '/mock/repo',
      exclude: ['node_modules/', 'dist/'],
    })
  })

  it('should escape git-ignored paths before passing them to glob', async () => {
    vi.mocked(execSync).mockReturnValue('node_modules/\ndist/\ncoverage[name]/\n')
    globMock.mockReturnValue(mockGlobResult())

    await globWithGitignore(['**/*.ts'])

    expect(globMock).toHaveBeenCalledWith(['**/*.ts'], {
      cwd: '/mock/repo',
      exclude: ['node_modules/', 'dist/', String.raw`coverage\[name\]/`],
    })
  })

  it('should filter out empty lines from git output', async () => {
    vi.mocked(execSync).mockReturnValue('node_modules/\n\n\ncoverage/\n')
    globMock.mockReturnValue(mockGlobResult())

    await globWithGitignore(['**/*.ts'])

    expect(globMock).toHaveBeenCalledWith(['**/*.ts'], {
      cwd: '/mock/repo',
      exclude: ['node_modules/', 'coverage/'],
    })
  })

  it('should use the provided cwd instead of process.cwd()', async () => {
    globMock.mockReturnValue(mockGlobResult())

    await globWithGitignore(['**/*.ts'], { cwd: '/custom/repo' })

    expect(vi.mocked(execSync)).toHaveBeenCalledWith(
      'git ls-files --others --ignored --exclude-standard --directory',
      expect.objectContaining({ cwd: '/custom/repo' }),
    )
    expect(globMock).toHaveBeenCalledWith(['**/*.ts'], {
      cwd: '/custom/repo',
      exclude: ['node_modules/', 'dist/'],
    })
  })

  it('should fall back to plain glob when git command fails', async () => {
    vi.mocked(execSync).mockImplementation(() => {
      throw new Error('not a git repository')
    })
    globMock.mockReturnValue(mockGlobResult('src/foo.ts'))

    const result = await globWithGitignore(['src/**/*.ts'])

    expect(globMock).toHaveBeenCalledWith(['src/**/*.ts'], {
      cwd: '/mock/repo',
      exclude: [],
    })
    expect(result).toStrictEqual(['src/foo.ts'])
  })
})
