/**
 * @vitest-environment node
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mockSimpleGit } from '../../__mocks__/simple-git'
import { createChangeset } from '../createChangeset.js'
import {
  findAffectedPackages,
  findChangedDependenciesFromGit,
  handleChangesetFile,
} from '../git-utils.js'
import { handleCatalogChanges } from '../handle-catalog.js'

// Mock all external dependencies
vi.mock('simple-git')
vi.mock('../createChangeset.js')
vi.mock('../git-utils.js')

describe('handle-catalog', () => {
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

  it('should return early if no workspace files are found', async () => {
    const diffFiles = ['package.json', 'README.md']

    await handleCatalogChanges(diffFiles)

    // Should not call any of the main functions
    expect(findChangedDependenciesFromGit).not.toHaveBeenCalled()
    expect(findAffectedPackages).not.toHaveBeenCalled()
    expect(createChangeset).not.toHaveBeenCalled()
  })

  it('should handle case with no catalog dependency changes', async () => {
    const diffFiles = ['pnpm-workspace.yaml']

    // Mock findChangedDependenciesFromGit to return empty set
    vi.mocked(findChangedDependenciesFromGit).mockResolvedValue(new Map())

    await handleCatalogChanges(diffFiles)

    expect(findChangedDependenciesFromGit).toHaveBeenCalledWith(
      'HEAD~1',
      'HEAD',
      'pnpm-workspace.yaml',
    )
    expect(findAffectedPackages).not.toHaveBeenCalled()
    expect(createChangeset).not.toHaveBeenCalled()
  })

  it('should handle case with catalog changes but no affected packages', async () => {
    const diffFiles = ['pnpm-workspace.yaml']

    // Mock findChangedDependenciesFromGit to return some changes
    const changedDeps = new Map([['dep-a', '1.1.0']])
    vi.mocked(findChangedDependenciesFromGit).mockResolvedValue(changedDeps)

    // Mock findAffectedPackages to return empty set
    vi.mocked(findAffectedPackages).mockResolvedValue(new Set())

    await handleCatalogChanges(diffFiles)

    expect(findChangedDependenciesFromGit).toHaveBeenCalledWith(
      'HEAD~1',
      'HEAD',
      'pnpm-workspace.yaml',
    )
    expect(findAffectedPackages).toHaveBeenCalledWith(['dep-a'])
    expect(createChangeset).not.toHaveBeenCalled()
  })

  it('should create changeset when there are affected packages', async () => {
    const diffFiles = ['pnpm-workspace.yaml']

    // Mock findChangedDependenciesFromGit to return some changes
    const changedDeps = new Map([['dep-a', '1.1.0']])
    vi.mocked(findChangedDependenciesFromGit).mockResolvedValue(changedDeps)

    // Mock findAffectedPackages to return some packages
    vi.mocked(findAffectedPackages).mockResolvedValue(
      new Set(['pkg-1', 'pkg-2']),
    )

    // Mock simpleGit to return a short hash
    mockSimpleGit.mockReturnValue({
      revparse: vi.fn().mockResolvedValue('abc123\n'),
    } as any)

    // Mock createChangeset and handleChangesetFile
    vi.mocked(createChangeset).mockResolvedValue(undefined)
    vi.mocked(handleChangesetFile).mockResolvedValue(undefined)

    await handleCatalogChanges(diffFiles)

    expect(findChangedDependenciesFromGit).toHaveBeenCalledWith(
      'HEAD~1',
      'HEAD',
      'pnpm-workspace.yaml',
    )
    expect(findAffectedPackages).toHaveBeenCalledWith(['dep-a'])
    expect(mockSimpleGit().revparse).toHaveBeenCalledWith(['--short', 'HEAD'])
    expect(createChangeset).toHaveBeenCalledWith(
      '.changeset/renovate-abc123.md',
      changedDeps,
      ['pkg-1', 'pkg-2'],
    )
    expect(handleChangesetFile).toHaveBeenCalledWith(
      '.changeset/renovate-abc123.md',
    )
  })
})
