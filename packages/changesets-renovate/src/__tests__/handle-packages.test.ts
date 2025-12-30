/**
 * @vitest-environment node
 */

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mockSimpleGit } from '../../__mocks__/simple-git'
import { createChangeset } from '../createChangeset.js'
import { getBumpsFromGit, handleChangesetFile } from '../git-utils.js'
import { handlePackageChanges } from '../handle-packages.js'
import { getPackagesNames } from '../utils.js'

// Mock all external dependencies
vi.mock('simple-git')
vi.mock('../createChangeset.js')
vi.mock('../git-utils.js')
vi.mock('../utils.js')

describe('handle-packages', () => {
  beforeEach(() => {
    // Clear all mocks
    vi.clearAllMocks()

    // Mock console.log to avoid noisy output
    vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    // Restore console.log
    vi.restoreAllMocks()
  })

  it('should return early if no package.json files are found', async () => {
    const diffFiles = ['README.md', 'pnpm-workspace.yaml']

    await handlePackageChanges(diffFiles)

    // Should not call any of the main functions
    expect(getPackagesNames).not.toHaveBeenCalled()
    expect(getBumpsFromGit).not.toHaveBeenCalled()
    expect(createChangeset).not.toHaveBeenCalled()
  })

  it('should handle case with no package names', async () => {
    const diffFiles = ['package.json']

    // Mock getPackagesNames to return empty array
    vi.mocked(getPackagesNames).mockResolvedValue([])

    await handlePackageChanges(diffFiles)

    expect(getPackagesNames).toHaveBeenCalledWith(['package.json'])
    expect(getBumpsFromGit).not.toHaveBeenCalled()
    expect(createChangeset).not.toHaveBeenCalled()
  })

  it('should create changeset when there are package changes', async () => {
    const diffFiles = [
      'packages/pkg-a/package.json',
      'packages/pkg-b/package.json',
    ]

    // Mock getPackagesNames to return some package names
    vi.mocked(getPackagesNames).mockResolvedValue(['pkg-a', 'pkg-b'])

    // Mock simpleGit to return a short hash
    mockSimpleGit.mockReturnValue({
      revparse: vi.fn().mockResolvedValue('def456\n'),
    } as any)

    // Mock getBumpsFromGit to return some bumps
    const packageBumps = new Map([
      ['pkg-a', 'patch'],
      ['pkg-b', 'minor'],
    ])
    vi.mocked(getBumpsFromGit).mockResolvedValue(packageBumps)

    // Mock createChangeset and handleChangesetFile
    vi.mocked(createChangeset).mockResolvedValue(undefined)
    vi.mocked(handleChangesetFile).mockResolvedValue(undefined)

    await handlePackageChanges(diffFiles)

    expect(getPackagesNames).toHaveBeenCalledWith([
      'packages/pkg-a/package.json',
      'packages/pkg-b/package.json',
    ])
    expect(mockSimpleGit().revparse).toHaveBeenCalledWith(['--short', 'HEAD'])
    expect(getBumpsFromGit).toHaveBeenCalledWith([
      'packages/pkg-a/package.json',
      'packages/pkg-b/package.json',
    ])
    expect(createChangeset).toHaveBeenCalledWith(
      '.changeset/renovate-def456.md',
      packageBumps,
      ['pkg-a', 'pkg-b'],
    )
    expect(handleChangesetFile).toHaveBeenCalledWith(
      '.changeset/renovate-def456.md',
    )
  })
})
