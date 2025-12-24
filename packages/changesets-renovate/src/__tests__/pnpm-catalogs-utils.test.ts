import fs from 'node:fs'
import fg from 'fast-glob'
import * as yaml from 'js-yaml'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  findAffectedPackages,
  findChangedDependencies,
  loadCatalogFromFile,
  loadCatalogFromWorkspaceContent,
} from '../pnpm-catalogs-utils.js'

const { globSync } = fg

// Mock all external dependencies
vi.mock('node:fs')
vi.mock('js-yaml')
vi.mock('fast-glob')

describe('pnpm-catalogs-utils', () => {
  beforeEach(() => {
    // Clear all mocks
    vi.clearAllMocks()
  })

  describe('loadCatalogFromFile', () => {
    it('should load catalog from a YAML file', () => {
      const mockContent = `
catalog:
  test-package: 1.0.0
  another-package: 2.0.0
`
      vi.mocked(fs.readFileSync).mockReturnValue(mockContent)
      vi.mocked(yaml.load).mockReturnValue({
        catalog: {
          'test-package': '1.0.0',
          'another-package': '2.0.0',
        },
      })

      const result = loadCatalogFromFile('test-file.yaml')

      expect(fs.readFileSync).toHaveBeenCalledWith('test-file.yaml', 'utf8')
      expect(yaml.load).toHaveBeenCalledWith(mockContent)
      expect(result).toEqual({
        'test-package': '1.0.0',
        'another-package': '2.0.0',
      })
    })

    it('should return empty object if file reading fails', () => {
      vi.mocked(fs.readFileSync).mockImplementation((() => {
        throw new Error('File not found')
      }) as any)

      const result = loadCatalogFromFile('non-existent-file.yaml')

      expect(result).toEqual({})
    })

    it('should return empty object if YAML parsing fails', () => {
      vi.mocked(fs.readFileSync).mockReturnValue('invalid yaml' as any)
      vi.mocked(yaml.load).mockImplementation(() => {
        throw new Error('Invalid YAML')
      })

      const result = loadCatalogFromFile('invalid-file.yaml')

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
      vi.mocked(yaml.load).mockReturnValue({
        catalog: {
          'test-package': '1.0.0',
          'another-package': '2.0.0',
        },
      })

      const result = loadCatalogFromWorkspaceContent(mockContent)

      expect(yaml.load).toHaveBeenCalledWith(mockContent)
      expect(result).toEqual({
        'test-package': '1.0.0',
        'another-package': '2.0.0',
      })
    })

    it('should return empty object if parsing fails', () => {
      vi.mocked(yaml.load).mockImplementation(() => {
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

    it('should find packages affected by dependency changes', () => {
      // Mock file system reads for package.json files
      vi.mocked(fs.readFileSync).mockImplementation(((
        filePath: string | Buffer | number,
      ) => {
        if (filePath === 'packages/package-a/package.json') {
          return JSON.stringify({
            name: 'package-a',
            dependencies: {
              'changed-dep': 'catalog:',
            },
          })
        }
        if (filePath === 'packages/package-b/package.json') {
          return JSON.stringify({
            name: 'package-b',
            dependencies: {
              'unchanged-dep': 'catalog:',
            },
          })
        }

        return '{}'
      }) as any)

      const result = findAffectedPackages(['changed-dep'])

      expect(globSync).toHaveBeenCalledWith('packages/*/package.json')
      expect(result).toBeInstanceOf(Set)
      expect(result.size).toBe(1)
      expect(result).toContain('package-a')
      expect(result).not.toContain('package-b')
    })

    it('should handle packages with no affected dependencies', () => {
      vi.mocked(fs.readFileSync).mockImplementation(() =>
        JSON.stringify({
          name: 'package-a',
          dependencies: {
            'unchanged-dep': 'catalog:',
          },
        }),
      ) as any

      const result = findAffectedPackages(['non-existent-dep'])

      expect(result).toBeInstanceOf(Set)
      expect(result.size).toBe(0)
    })

    it('should handle empty dependency list', () => {
      const result = findAffectedPackages([])

      expect(globSync).not.toHaveBeenCalled()
      expect(result).toBeInstanceOf(Set)
      expect(result.size).toBe(0)
    })

    it('should handle file read errors gracefully', () => {
      vi.mocked(fs.readFileSync).mockImplementation((() => {
        throw new Error('File read error')
      }) as any)

      const result = findAffectedPackages(['changed-dep'])

      expect(result).toBeInstanceOf(Set)
      expect(result.size).toBe(0)
    })
  })
})
