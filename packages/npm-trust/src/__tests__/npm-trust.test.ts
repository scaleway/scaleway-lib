import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { main } from '../index.js'
import { exec, findWorkspaceRoot, hasExistingTrust, isPackagePublished, listPublicWorkspacePackages } from '../utils'

vi.mock(import('../utils'), () => ({
  exec: vi.fn<(cmd: string, opts?: { cwd?: string; stdio?: 'pipe' | 'inherit' }) => string>(),
  findWorkspaceRoot: vi.fn<(start: string) => string>(),
  hasExistingTrust: vi.fn<(pkgName: string) => boolean>(),
  isPackagePublished: vi.fn<(pkgName: string) => boolean>(),
  listPublicWorkspacePackages: vi.fn<(root: string) => { name: string; path: string; version: string }[]>(),
}))

describe('npm-trust exit code', () => {
  const originalArgv = process.argv

  beforeEach(() => {
    process.argv = ['node', 'npm-trust', '--repo', 'scaleway/scaleway-lib']
    vi.mocked(findWorkspaceRoot).mockReturnValue('/workspace')
    vi.mocked(listPublicWorkspacePackages).mockReturnValue([
      { name: '@scaleway/pkg-a', path: '/workspace/packages/a', version: '1.0.0' },
    ])
    vi.mocked(isPackagePublished).mockReturnValue(true)
    vi.mocked(hasExistingTrust).mockReturnValue(false)
  })

  afterEach(() => {
    process.argv = originalArgv
    process.exitCode = 0
  })

  it('exits non-zero when every trust command fails', async () => {
    vi.mocked(exec).mockImplementation(() => {
      throw new Error('exec failed')
    })

    await main()

    expect(exec).toHaveBeenCalledTimes(1)
    expect(process.exitCode).toBe(1)
  })

  it('exits clean when trust commands succeed', async () => {
    vi.mocked(exec).mockReturnValue('')

    await main()

    expect(process.exitCode).toBe(0)
  })
})
