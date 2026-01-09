import { readFile } from 'node:fs/promises'
import fg from 'fast-glob'
import { load } from 'js-yaml'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  findAffectedPackages,
  findChangedDependencies,
  loadCatalogFromFile,
  loadCatalogFromWorkspaceContent,
} from '../utils.js'

const { globSync } = fg

// Mock all external dependencies
vi.mock('node:fs/promises')
vi.mock('js-yaml')
vi.mock('fast-glob')

describe('pnpm-catalogs-utils', () => {
  beforeEach(() => {
    // Clear all mocks
    vi.clearAllMocks()
  })

  describe('loadCatalogFromFile', () => {
    it('should load catalog from a YAML file', async () => {
      const mockContent = `
catalog:
  test-package: 1.0.0
  another-package: 2.0.0
`
      vi.mocked(readFile).mockResolvedValue(mockContent)
      vi.mocked(load).mockReturnValue({
        catalog: {
          'another-package': '2.0.0',
          'test-package': '1.0.0',
        },
      })

      const result = await loadCatalogFromFile('test-file.yaml')

      expect(readFile).toHaveBeenCalledWith('test-file.yaml', 'utf8')
      expect(load).toHaveBeenCalledWith(mockContent)
      expect(result).toEqual({
        'another-package': '2.0.0',
        'test-package': '1.0.0',
      })
    })

    it('should return empty object if file reading fails', async () => {
      vi.mocked(readFile).mockRejectedValue(new Error('File not found'))

      const result = await loadCatalogFromFile('non-existent-file.yaml')

      expect(result).toEqual({})
    })

    it('should return empty object if YAML parsing fails', async () => {
      vi.mocked(readFile).mockResolvedValue('invalid yaml' as any)
      vi.mocked(load).mockImplementation(() => {
        throw new Error('Invalid YAML')
      })

      const result = await loadCatalogFromFile('invalid-file.yaml')

      expect(result).toEqual({})
    })
  })

  describe('loadCatalogFromWorkspaceContent', () => {
    it('should load catalog from workspace content', () => {
      const mockContent = `
catalog:
  test-package: 1.0.0
  another-package: 2.0.0
`
      vi.mocked(load).mockReturnValue({
        catalog: {
          'another-package': '2.0.0',
          'test-package': '1.0.0',
        },
      })

      const result = loadCatalogFromWorkspaceContent(mockContent)

      expect(load).toHaveBeenCalledWith(mockContent)
      expect(result).toEqual({
        'another-package': '2.0.0',
        'test-package': '1.0.0',
      })
    })

    it('should return empty object if parsing fails', () => {
      vi.mocked(load).mockImplementation(() => {
        throw new Error('Invalid YAML')
      })

      const result = loadCatalogFromWorkspaceContent('invalid content')

      expect(result).toEqual({})
    })
  })

  describe('findChangedDependencies', () => {
    it('should find dependencies that have changed versions', () => {
      const oldCatalog = {
        'package-a': '1.0.0',
        'package-b': '2.0.0',
        'package-c': '3.0.0',
      }

      const newCatalog = {
        'package-a': '1.1.0', // Changed
        'package-b': '2.0.0', // Same
        'package-c': '3.1.0', // Changed
        'package-d': '4.0.0', // New
      }

      const result = findChangedDependencies(oldCatalog, newCatalog)

      expect(result).toHaveLength(2)
      expect(result).toContain('package-a')
      expect(result).toContain('package-c')
      expect(result).not.toContain('package-b') // Unchanged
      expect(result).not.toContain('package-d') // New package
    })

    it('should return empty array when no dependencies have changed', () => {
      const oldCatalog = {
        'package-a': '1.0.0',
        'package-b': '2.0.0',
      }

      const newCatalog = {
        'package-a': '1.0.0',
        'package-b': '2.0.0',
      }

      const result = findChangedDependencies(oldCatalog, newCatalog)

      expect(result).toEqual([])
    })

    it('should handle empty catalogs', () => {
      const result = findChangedDependencies({}, {})

      expect(result).toEqual([])
    })
  })

  describe('findAffectedPackages', () => {
    beforeEach(() => {
      vi.mocked(globSync).mockReturnValue([
        'packages/package-a/package.json',
        'packages/package-b/package.json',
      ])
    })

    it('should find packages affected by dependency changes', async () => {
      // Mock file system reads for package.json files
      vi.mocked(readFile).mockImplementation((async (filePath: string) => {
        if (filePath === 'packages/package-a/package.json') {
          return JSON.stringify({
            dependencies: {
              'changed-dep': 'catalog:',
            },
            name: 'package-a',
          })
        }
        if (filePath === 'packages/package-b/package.json') {
          return JSON.stringify({
            dependencies: {
              'unchanged-dep': 'catalog:',
            },
            name: 'package-b',
          })
        }

        return '{}'
      }) as any)

      const result = await findAffectedPackages(['changed-dep'])

      expect(globSync).toHaveBeenCalledWith('packages/*/package.json')
      expect(result).toBeInstanceOf(Set)
      expect(result.size).toBe(1)
      expect(result).toContain('package-a')
      expect(result).not.toContain('package-b')
    })

    it('should handle packages with no affected dependencies', async () => {
      vi.mocked(readFile).mockImplementation(async () =>
        JSON.stringify({
          dependencies: {
            'unchanged-dep': 'catalog:',
          },
          name: 'package-a',
        }),
      ) as any

      const result = await findAffectedPackages(['non-existent-dep'])

      expect(result).toBeInstanceOf(Set)
      expect(result.size).toBe(0)
    })

    it('should handle empty dependency list', async () => {
      const result = await findAffectedPackages([])

      expect(globSync).not.toHaveBeenCalled()
      expect(result).toBeInstanceOf(Set)
      expect(result.size).toBe(0)
    })

    it('should handle file read errors gracefully', async () => {
      vi.mocked(readFile).mockRejectedValue(new Error('File read error'))

      const result = await findAffectedPackages(['changed-dep'])

      expect(result).toBeInstanceOf(Set)
      expect(result.size).toBe(0)
    })
  })
})
