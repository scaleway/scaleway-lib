import { beforeEach, describe, expect, it, vi } from 'vitest'
import { globWithGitignore } from '../globWithGitignore.js'

const { execSyncMock, escapePathMock, globMock } = vi.hoisted(() => ({
  execSyncMock: vi.fn(() => 'node_modules/\ndist/\n'),
  escapePathMock: vi.fn((p: string) => p),
  globMock: vi.fn(),
}))

vi.mock('node:child_process', () => ({
  execSync: execSyncMock,
}))

vi.mock('tinyglobby', () => ({
  glob: globMock,
  escapePath: escapePathMock,
}))

describe('globWithGitignore', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(process, 'cwd').mockReturnValue('/mock/repo')
  })

  it('should merge git-ignored files with existing ignore patterns', async () => {
    globMock.mockResolvedValue(['packages/package-a/package.json'])

    const result = await globWithGitignore(['packages/*/package.json'], {
      expandDirectories: false,
      ignore: ['**/coverage'],
    })

    expect(execSyncMock).toHaveBeenCalledWith(
      'git ls-files --others --ignored --exclude-standard --directory',
      expect.objectContaining({ cwd: '/mock/repo' }),
    )
    expect(globMock).toHaveBeenCalledWith(['packages/*/package.json'], {
      expandDirectories: false,
      cwd: '/mock/repo',
      ignore: ['**/coverage', 'node_modules/', 'dist/'],
    })
    expect(result).toStrictEqual(['packages/package-a/package.json'])
  })

  it('should support a single string ignore pattern', async () => {
    globMock.mockResolvedValue([])

    await globWithGitignore(['**/*.ts'], { ignore: '**/generated' })

    expect(globMock).toHaveBeenCalledWith(['**/*.ts'], {
      cwd: '/mock/repo',
      ignore: ['**/generated', 'node_modules/', 'dist/'],
    })
  })

  it('should handle an undefined ignore option', async () => {
    globMock.mockResolvedValue([])

    await globWithGitignore(['**/*.ts'])

    expect(globMock).toHaveBeenCalledWith(['**/*.ts'], {
      cwd: '/mock/repo',
      ignore: ['node_modules/', 'dist/'],
    })
  })

  it('should escape git-ignored paths before passing them to glob', async () => {
    execSyncMock.mockReturnValue('node_modules/\ndist/\n')
    escapePathMock.mockImplementation((p: string) => `escaped:${p}`)
    globMock.mockResolvedValue([])

    await globWithGitignore(['**/*.ts'])

    expect(escapePathMock).toHaveBeenCalledWith('node_modules/')
    expect(escapePathMock).toHaveBeenCalledWith('dist/')
    expect(globMock).toHaveBeenCalledWith(['**/*.ts'], {
      cwd: '/mock/repo',
      ignore: ['escaped:node_modules/', 'escaped:dist/'],
    })
  })

  it('should filter out empty lines from git output', async () => {
    execSyncMock.mockReturnValue('node_modules/\n\n\ncoverage/\n')
    globMock.mockResolvedValue([])

    await globWithGitignore(['**/*.ts'])

    expect(escapePathMock).toHaveBeenCalledWith('node_modules/')
    expect(escapePathMock).toHaveBeenCalledWith('coverage/')
    expect(escapePathMock).not.toHaveBeenCalledWith('')
  })

  it('should use the provided cwd instead of process.cwd()', async () => {
    globMock.mockResolvedValue([])

    await globWithGitignore(['**/*.ts'], { cwd: '/custom/repo' })

    expect(execSyncMock).toHaveBeenCalledWith(
      'git ls-files --others --ignored --exclude-standard --directory',
      expect.objectContaining({ cwd: '/custom/repo' }),
    )
    expect(globMock).toHaveBeenCalledWith(['**/*.ts'], {
      cwd: '/custom/repo',
      ignore: ['node_modules/', 'dist/'],
    })
  })

  it('should fall back to plain glob when git command fails', async () => {
    execSyncMock.mockImplementation(() => {
      throw new Error('not a git repository')
    })
    globMock.mockResolvedValue(['src/foo.ts'])

    const result = await globWithGitignore(['src/**/*.ts'], { expandDirectories: false })

    expect(globMock).toHaveBeenCalledWith(['src/**/*.ts'], { expandDirectories: false })
    expect(result).toStrictEqual(['src/foo.ts'])
  })
})
