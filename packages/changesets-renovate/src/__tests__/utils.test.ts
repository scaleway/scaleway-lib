import { readFile } from 'node:fs/promises'
import * as changesetConfig from '@changesets/config'
import { glob } from 'tinyglobby'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { parse } from 'yaml'
import {
  findAffectedPackages,
  findChangedDependencies,
  getWorkspacePackageGlobs,
  loadCatalogFromFile,
  loadCatalogFromWorkspaceContent,
} from '../utils.js'

// Mock all external dependencies
vi.mock('node:fs/promises')
vi.mock('yaml')
vi.mock('tinyglobby')

vi.spyOn(changesetConfig, 'read').mockResolvedValue(changesetConfig.defaultConfig)

describe('pnpm-catalogs-utils', () => {
  beforeEach(() => {
    // Clear all mocks
    vi.clearAllMocks()
    delete process.env['EXCLUDE_DEVDEPS']
  })

  describe('loadCatalogFromFile', () => {
    it('should load catalog from a YAML file', async () => {
      const mockContent = `
catalog:
  test-package: 1.0.0
  another-package: 2.0.0
`
      vi.mocked(readFile).mockResolvedValue(mockContent)
      vi.mocked(parse).mockReturnValue({
        catalog: {
          'another-package': '2.0.0',
          'test-package': '1.0.0',
        },
      })

      const result = await loadCatalogFromFile('test-file.yaml')

      expect(readFile).toHaveBeenCalledWith('test-file.yaml', 'utf8')
      expect(parse).toHaveBeenCalledWith(mockContent)
      expect(result).toStrictEqual({
        'another-package': '2.0.0',
        'test-package': '1.0.0',
      })
    })

    it('should return empty object if file reading fails', async () => {
      vi.mocked(readFile).mockRejectedValue(new Error('File not found'))

      const result = await loadCatalogFromFile('non-existent-file.yaml')

      expect(result).toStrictEqual({})
    })

    it('should return empty object if YAML parsing fails', async () => {
      vi.mocked(readFile).mockResolvedValue('invalid yaml' as any)
      vi.mocked(parse).mockImplementation(() => {
        throw new Error('Invalid YAML')
      })

      const result = await loadCatalogFromFile('invalid-file.yaml')

      expect(result).toStrictEqual({})
    })
  })

  describe('loadCatalogFromWorkspaceContent', () => {
    it('should load catalog from workspace content', () => {
      const mockContent = `
catalog:
  test-package: 1.0.0
  another-package: 2.0.0
`
      vi.mocked(parse).mockReturnValue({
        catalog: {
          'another-package': '2.0.0',
          'test-package': '1.0.0',
        },
      })

      const result = loadCatalogFromWorkspaceContent(mockContent)

      expect(parse).toHaveBeenCalledWith(mockContent)
      expect(result).toStrictEqual({
        'another-package': '2.0.0',
        'test-package': '1.0.0',
      })
    })

    it('should return empty object if parsing fails', () => {
      vi.mocked(parse).mockImplementation(() => {
        throw new Error('Invalid YAML')
      })

      const result = loadCatalogFromWorkspaceContent('invalid content')

      expect(result).toStrictEqual({})
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

      expect(result).toStrictEqual([])
    })

    it('should handle empty catalogs', () => {
      const result = findChangedDependencies({}, {})

      expect(result).toStrictEqual([])
    })
  })

  describe('getWorkspacePackageGlobs', () => {
    it('should discover globs from pnpm-workspace.yaml', async () => {
      vi.mocked(readFile).mockImplementation((async (filePath: string) => {
        if (filePath === 'pnpm-workspace.yaml') {
          return 'packages:\n  - packages/*\n  - apps/*'
        }

        const error = new Error('not found') as NodeJS.ErrnoException
        error.code = 'ENOENT'
        throw error
      }) as any)
      vi.mocked(parse).mockReturnValue({ packages: ['packages/*', 'apps/*'] })

      const result = await getWorkspacePackageGlobs()

      expect(result).toStrictEqual(['packages/*/package.json', 'apps/*/package.json'])
    })

    it('should discover globs from root package.json workspaces', async () => {
      vi.mocked(readFile).mockImplementation((async (filePath: string) => {
        if (filePath === 'package.json') {
          return JSON.stringify({ workspaces: ['packages/*', 'tools/*'] })
        }

        const error = new Error('not found') as NodeJS.ErrnoException
        error.code = 'ENOENT'
        throw error
      }) as any)

      const result = await getWorkspacePackageGlobs()

      expect(result).toStrictEqual(['packages/*/package.json', 'tools/*/package.json'])
    })

    it('should support workspaces as { packages: [] } object', async () => {
      vi.mocked(readFile).mockImplementation((async (filePath: string) => {
        if (filePath === 'package.json') {
          return JSON.stringify({ workspaces: { packages: ['apps/*'] } })
        }

        const error = new Error('not found') as NodeJS.ErrnoException
        error.code = 'ENOENT'
        throw error
      }) as any)

      const result = await getWorkspacePackageGlobs()

      expect(result).toStrictEqual(['apps/*/package.json'])
    })

    it('should merge and deduplicate globs from both sources', async () => {
      vi.mocked(readFile).mockImplementation((async (filePath: string) => {
        if (filePath === 'pnpm-workspace.yaml') {
          return 'packages:\n  - packages/*'
        }
        if (filePath === 'package.json') {
          return JSON.stringify({ workspaces: ['packages/*', 'apps/*'] })
        }

        return '{}'
      }) as any)
      vi.mocked(parse).mockReturnValue({ packages: ['packages/*'] })

      const result = await getWorkspacePackageGlobs()

      expect(result).toStrictEqual(['packages/*/package.json', 'apps/*/package.json'])
    })

    it('should fall back to empty array when no workspace config exists', async () => {
      vi.mocked(readFile).mockImplementation((async () => {
        const error = new Error('not found') as NodeJS.ErrnoException
        error.code = 'ENOENT'
        throw error
      }) as any)

      const result = await getWorkspacePackageGlobs()

      expect(result).toStrictEqual([])
    })

    it('should strip trailing slashes from workspace patterns', async () => {
      vi.mocked(readFile).mockImplementation((async (filePath: string) => {
        if (filePath === 'pnpm-workspace.yaml') {
          return 'packages:\n  - packages/*/'
        }

        const error = new Error('not found') as NodeJS.ErrnoException
        error.code = 'ENOENT'
        throw error
      }) as any)
      vi.mocked(parse).mockReturnValue({ packages: ['packages/*/'] })

      const result = await getWorkspacePackageGlobs()

      expect(result).toStrictEqual(['packages/*/package.json'])
    })
  })

  describe('findAffectedPackages', () => {
    beforeEach(() => {
      // Default workspace discovery returns the legacy default glob
      vi.mocked(readFile).mockImplementation((async (filePath: string) => {
        if (filePath === 'pnpm-workspace.yaml') {
          return 'packages:\n  - packages/*'
        }

        const error = new Error('not found') as NodeJS.ErrnoException
        error.code = 'ENOENT'
        throw error
      }) as any)
      vi.mocked(parse).mockReturnValue({ packages: ['packages/*'] })
      vi.mocked(glob).mockResolvedValue([
        'packages/package-a/package.json',
        'packages/package-b/package.json',
        'packages/package-c/package.json',
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
            version: '1.0.0',
            name: 'package-a',
          })
        }
        if (filePath === 'packages/package-b/package.json') {
          return JSON.stringify({
            dependencies: {
              'unchanged-dep': 'catalog:',
            },
            version: '1.0.0',
            name: 'package-b',
          })
        }

        return '{}'
      }) as any)

      const result = await findAffectedPackages(['changed-dep'])

      expect(glob).toHaveBeenCalledWith(
        ['packages/*/package.json'],
        expect.objectContaining({ expandDirectories: false }),
      )
      expect(result).toBeInstanceOf(Set)
      expect(result.size).toBe(1)
      expect(result).toContain('package-a')
      expect(result).not.toContain('package-b')
    })

    it('should find packages affected by dependency changes and respect EXCLUDE_DEVDEPS', async () => {
      process.env['EXCLUDE_DEVDEPS'] = 'true'

      // Mock file system reads for package.json files
      vi.mocked(readFile).mockImplementation((async (filePath: string) => {
        if (filePath === 'packages/package-a/package.json') {
          return JSON.stringify({
            dependencies: {
              'changed-dep': 'catalog:',
            },
            version: '1.0.0',
            name: 'package-a',
          })
        }
        if (filePath === 'packages/package-b/package.json') {
          return JSON.stringify({
            devDependencies: {
              'changed-dep': 'catalog:',
            },
            version: '1.0.0',
            name: 'package-b',
          })
        }

        return '{}'
      }) as any)

      const result = await findAffectedPackages(['changed-dep'])

      expect(glob).toHaveBeenCalledWith(
        ['packages/*/package.json'],
        expect.objectContaining({ expandDirectories: false }),
      )
      expect(result).toBeInstanceOf(Set)
      expect(result.size).toBe(1)
      expect(result).toContain('package-a')
      expect(result).not.toContain('package-b')
    })

    it('should find packages affected by dependency changes and respect changeset ignore config', async () => {
      vi.spyOn(changesetConfig, 'read').mockResolvedValue({ ...changesetConfig.defaultConfig, ignore: ['package-c'] })

      // Mock file system reads for package.json files
      vi.mocked(readFile).mockImplementation((async (filePath: string) => {
        if (filePath === 'packages/package-a/package.json') {
          return JSON.stringify({
            dependencies: {
              'changed-dep': 'catalog:',
            },
            version: '1.0.0',
            name: 'package-a',
          })
        }
        if (filePath === 'packages/package-b/package.json') {
          return JSON.stringify({
            dependencies: {
              'unchanged-dep': 'catalog:',
            },
            version: '1.0.0',
            name: 'package-b',
          })
        }
        if (filePath === 'packages/package-c/package.json') {
          return JSON.stringify({
            dependencies: {
              'changed-dep': 'catalog:',
            },
            version: '1.0.0',
            name: 'package-c',
          })
        }

        return '{}'
      }) as any)

      const result = await findAffectedPackages(['changed-dep'])

      expect(glob).toHaveBeenCalledWith(
        ['packages/*/package.json'],
        expect.objectContaining({ expandDirectories: false }),
      )
      expect(result).toBeInstanceOf(Set)
      expect(result.size).toBe(1)
      expect(result).toContain('package-a')
      expect(result).not.toContain('package-b')
      expect(result).not.toContain('package-c')
    })

    it('should handle packages with no affected dependencies', async () => {
      vi.mocked(readFile).mockImplementation(async () =>
        JSON.stringify({
          dependencies: {
            'unchanged-dep': 'catalog:',
          },
          version: '1.0.0',
          name: 'package-a',
        }),
      ) as any

      const result = await findAffectedPackages(['non-existent-dep'])

      expect(result).toBeInstanceOf(Set)
      expect(result.size).toBe(0)
    })

    it('should handle empty dependency list', async () => {
      const result = await findAffectedPackages([])

      expect(glob).not.toHaveBeenCalled()
      expect(result).toBeInstanceOf(Set)
      expect(result.size).toBe(0)
    })

    it('should handle file read errors gracefully', async () => {
      vi.mocked(readFile).mockRejectedValue(new Error('File read error'))

      const result = await findAffectedPackages(['changed-dep'])

      expect(result).toBeInstanceOf(Set)
      expect(result.size).toBe(0)
    })

    it('should respect explicitly provided packageJsonGlobs over discovered ones', async () => {
      vi.mocked(glob).mockResolvedValue(['apps/app-a/package.json'])
      vi.mocked(readFile).mockImplementation((async (filePath: string) => {
        if (filePath === 'apps/app-a/package.json') {
          return JSON.stringify({
            dependencies: {
              'changed-dep': 'catalog:',
            },
            version: '1.0.0',
            name: 'app-a',
          })
        }

        return '{}'
      }) as any)

      const result = await findAffectedPackages(['changed-dep'], ['apps/*/package.json'])

      expect(glob).toHaveBeenCalledWith(['apps/*/package.json'], expect.objectContaining({ expandDirectories: false }))
      expect(result.size).toBe(1)
      expect(result).toContain('app-a')
    })

    it('should discover non-default workspace layouts (apps/*) from pnpm-workspace.yaml', async () => {
      vi.mocked(readFile).mockImplementation((async (filePath: string) => {
        if (filePath === 'pnpm-workspace.yaml') {
          return 'packages:\n  - apps/*'
        }
        if (filePath === 'apps/app-a/package.json') {
          return JSON.stringify({
            dependencies: {
              'changed-dep': 'catalog:',
            },
            version: '1.0.0',
            name: 'app-a',
          })
        }

        const error = new Error('not found') as NodeJS.ErrnoException
        error.code = 'ENOENT'
        throw error
      }) as any)
      vi.mocked(parse).mockReturnValue({ packages: ['apps/*'] })
      vi.mocked(glob).mockResolvedValue(['apps/app-a/package.json'])

      const result = await findAffectedPackages(['changed-dep'])

      expect(glob).toHaveBeenCalledWith(['apps/*/package.json'], expect.objectContaining({ expandDirectories: false }))
      expect(result.size).toBe(1)
      expect(result).toContain('app-a')
    })

    it('should fall back to packages/*/package.json when no workspace config is found', async () => {
      vi.mocked(readFile).mockRejectedValue(new Error('File read error'))
      vi.mocked(glob).mockResolvedValue(['packages/package-a/package.json'])

      const result = await findAffectedPackages(['changed-dep'])

      expect(glob).toHaveBeenCalledWith(
        ['packages/*/package.json'],
        expect.objectContaining({ expandDirectories: false }),
      )
      expect(result.size).toBe(0)
    })
  })
})
