import { beforeEach, describe, expect, it, vi } from 'vitest'
import { parse } from 'yaml'
import { mockSimpleGit } from '../../__mocks__/simple-git'
import { findChangedDependenciesFromGit, loadCatalogFromGit } from '../git-utils.js'

// Mock all external dependencies
vi.mock('yaml')
vi.mock('tinyglobby')
vi.mock('node:fs/promises')

const mockParseCatalog = (content: string) =>
  content.includes('1.0.0')
    ? {
        catalog: {
          'package-a': '1.0.0',
          'package-b': '2.0.0',
          'package-c': '3.0.0',
        },
      }
    : {
        catalog: {
          'package-a': '1.1.0',
          'package-b': '2.0.0',
          'package-c': '3.1.0',
          'package-d': '4.0.0',
        },
      }

describe('pnpm-catalogs-git-utils', () => {
  beforeEach(() => {
    // Clear all mocks
    vi.clearAllMocks()
  })

  describe(loadCatalogFromGit, () => {
    it('should load catalog from git at specific revision', async () => {
      const mockContent = `
catalog:
  test-package: 1.0.0
  another-package: 2.0.0
`
      mockSimpleGit.mockReturnValue({
        add: vi.fn<() => void>(),
        branch: vi.fn<() => { current: string }>(),
        commit: vi.fn<() => void>(),
        diffSummary: vi.fn<() => Record<string, unknown>>(),
        push: vi.fn<() => void>(),
        revparse: vi.fn<() => string>(),
        show: vi.fn<() => any>().mockResolvedValue(mockContent),
      })
      vi.mocked(parse).mockReturnValue({
        catalog: {
          'another-package': '2.0.0',
          'test-package': '1.0.0',
        },
      })

      const result = await loadCatalogFromGit('abc123', 'pnpm-workspace.yaml')

      expect(mockSimpleGit().show).toHaveBeenCalledWith(['abc123:pnpm-workspace.yaml'])
      expect(parse).toHaveBeenCalledWith(mockContent)
      expect(result).toStrictEqual({
        'another-package': '2.0.0',
        'test-package': '1.0.0',
      })
    })

    it('should return empty object if git operation fails', async () => {
      mockSimpleGit.mockReturnValue({
        add: vi.fn<() => void>(),
        branch: vi.fn<() => { current: string }>(),
        commit: vi.fn<() => void>(),
        diffSummary: vi.fn<() => Record<string, unknown>>(),
        push: vi.fn<() => void>(),
        revparse: vi.fn<() => string>(),
        show: vi.fn<() => any>().mockRejectedValue(new Error('File not found')),
      })

      const result = await loadCatalogFromGit('nonexistent', 'pnpm-workspace.yaml')

      expect(result).toStrictEqual({})
    })

    it('should return empty object if revision is empty', async () => {
      const result = await loadCatalogFromGit('', 'pnpm-workspace.yaml')

      expect(result).toStrictEqual({})
    })
  })

  describe(findChangedDependenciesFromGit, () => {
    it('should find dependencies that have changed between git revisions', async () => {
      // Mock the git operations
      mockSimpleGit.mockReturnValue({
        add: vi.fn<() => void>(),
        branch: vi.fn<() => { current: string }>(),
        commit: vi.fn<() => void>(),
        diffSummary: vi.fn<() => Record<string, unknown>>(),
        push: vi.fn<() => void>(),
        revparse: vi.fn<() => string>(),
        show: vi.fn<() => any>().mockResolvedValueOnce(`
catalog:
  package-a: 1.0.0
  package-b: 2.0.0
  package-c: 3.0.0
`).mockResolvedValueOnce(`
catalog:
  package-a: 1.1.0
  package-b: 2.0.0
  package-c: 3.1.0
  package-d: 4.0.0
`),
      })

      vi.mocked(parse).mockImplementation(mockParseCatalog)

      const result = await findChangedDependenciesFromGit('abc123', 'def456')

      const packages = [...result.keys()]
      expect(packages).toHaveLength(2)
      expect(packages).toContain('package-a')
      expect(packages).toContain('package-c')
      expect(packages).not.toContain('package-b') // Unchanged
      expect(packages).not.toContain('package-d') // New package
    })
  })
})
