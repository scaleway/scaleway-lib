import { execSync } from 'node:child_process'
import { defaultConfig, readConfig } from '@changesets/config'
import { vol } from 'memfs'
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

const { escapePathMock, globMock } = vi.hoisted(() => ({
  escapePathMock: vi.fn<(p: string) => string>((p: string) => p),
  globMock: vi.fn<() => Promise<string[]>>(),
}))

// Mock all external dependencies
vi.mock(import('node:fs/promises'))
vi.mock(import('node:child_process'))
vi.mock(import('yaml'))
vi.mock(import('tinyglobby'), () => ({
  glob: globMock,
  escapePath: escapePathMock,
}))

vi.mock(import('@changesets/config'), async importOriginal => {
  const actual = await importOriginal()

  return {
    ...actual,
    readConfig: vi
      .fn<typeof readConfig>()
      .mockResolvedValue({ config: actual.defaultConfig, warnings: [], errors: undefined }),
  }
})

describe('pnpm-catalogs-utils', () => {
  beforeEach(() => {
    // Clear all mocks
    vi.clearAllMocks()
    vol.reset()
    vi.mocked(execSync).mockReturnValue('node_modules/\ndist/\n')
    vi.mocked(readConfig).mockResolvedValue({
      config: defaultConfig,
      warnings: [],
      errors: undefined,
    })
    vi.spyOn(process, 'cwd').mockReturnValue('/mock/repo')
    vi.stubEnv('EXCLUDE_DEVDEPS', undefined)
  })

  describe(loadCatalogFromFile, () => {
    it('should load catalog from a YAML file', async () => {
      const mockContent = `
catalog:
  test-package: 1.0.0
  another-package: 2.0.0
`
      vol.fromJSON({ 'test-file.yaml': mockContent })
      vi.mocked(parse).mockReturnValue({
        catalog: {
          'another-package': '2.0.0',
          'test-package': '1.0.0',
        },
      })

      const result = await loadCatalogFromFile('test-file.yaml')

      expect(parse).toHaveBeenCalledWith(mockContent)
      expect(result).toStrictEqual({
        'another-package': '2.0.0',
        'test-package': '1.0.0',
      })
    })

    it('should return empty object if file reading fails', async () => {
      const result = await loadCatalogFromFile('non-existent-file.yaml')

      expect(result).toStrictEqual({})
    })

    it('should return empty object if YAML parsing fails', async () => {
      vol.fromJSON({ 'invalid-file.yaml': 'invalid yaml' })
      vi.mocked(parse).mockImplementation(() => {
        throw new Error('Invalid YAML')
      })

      const result = await loadCatalogFromFile('invalid-file.yaml')

      expect(result).toStrictEqual({})
    })
  })

  describe(loadCatalogFromWorkspaceContent, () => {
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

  describe(findChangedDependencies, () => {
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

  describe(getWorkspacePackageGlobs, () => {
    it('should discover globs from pnpm-workspace.yaml', async () => {
      vol.fromJSON({
        'pnpm-workspace.yaml': 'packages:\n  - packages/*\n  - apps/*',
      })
      vi.mocked(parse).mockReturnValue({ packages: ['packages/*', 'apps/*'] })

      const result = await getWorkspacePackageGlobs()

      expect(result).toStrictEqual(['packages/*/package.json', 'apps/*/package.json'])
    })

    it('should discover globs from root package.json workspaces', async () => {
      vol.fromJSON({
        'package.json': JSON.stringify({ workspaces: ['packages/*', 'tools/*'] }),
      })

      const result = await getWorkspacePackageGlobs()

      expect(result).toStrictEqual(['packages/*/package.json', 'tools/*/package.json'])
    })

    it('should support workspaces as { packages: [] } object', async () => {
      vol.fromJSON({
        'package.json': JSON.stringify({ workspaces: { packages: ['apps/*'] } }),
      })

      const result = await getWorkspacePackageGlobs()

      expect(result).toStrictEqual(['apps/*/package.json'])
    })

    it('should merge and deduplicate globs from both sources', async () => {
      vol.fromJSON({
        'pnpm-workspace.yaml': 'packages:\n  - packages/*',
        'package.json': JSON.stringify({ workspaces: ['packages/*', 'apps/*'] }),
      })
      vi.mocked(parse).mockReturnValue({ packages: ['packages/*'] })

      const result = await getWorkspacePackageGlobs()

      expect(result).toStrictEqual(['packages/*/package.json', 'apps/*/package.json'])
    })

    it('should fall back to empty array when no workspace config exists', async () => {
      const result = await getWorkspacePackageGlobs()

      expect(result).toStrictEqual([])
    })

    it('should strip trailing slashes from workspace patterns', async () => {
      vol.fromJSON({
        'pnpm-workspace.yaml': 'packages:\n  - packages/*/',
      })
      vi.mocked(parse).mockReturnValue({ packages: ['packages/*/'] })

      const result = await getWorkspacePackageGlobs()

      expect(result).toStrictEqual(['packages/*/package.json'])
    })
  })

  describe(findAffectedPackages, () => {
    beforeEach(() => {
      // Default workspace discovery returns the legacy default glob
      vol.fromJSON({ 'pnpm-workspace.yaml': 'packages:\n  - packages/*' })
      vi.mocked(parse).mockReturnValue({ packages: ['packages/*'] })
      vi.mocked(glob).mockResolvedValue([
        'packages/package-a/package.json',
        'packages/package-b/package.json',
        'packages/package-c/package.json',
      ])
    })

    it('should find packages affected by dependency changes', async () => {
      vol.fromJSON({
        'packages/package-a/package.json': JSON.stringify({
          dependencies: {
            'changed-dep': 'catalog:',
          },
          version: '1.0.0',
          name: 'package-a',
        }),
        'packages/package-b/package.json': JSON.stringify({
          dependencies: {
            'unchanged-dep': 'catalog:',
          },
          version: '1.0.0',
          name: 'package-b',
        }),
      })

      const result = await findAffectedPackages(['changed-dep'])

      expect(vi.mocked(execSync)).toHaveBeenCalledWith(
        'git ls-files --others --ignored --exclude-standard --directory',
        expect.objectContaining({ cwd: process.cwd() }),
      )
      expect(glob).toHaveBeenCalledWith(['packages/*/package.json'], {
        expandDirectories: false,
        cwd: '/mock/repo',
        ignore: ['node_modules/', 'dist/'],
      })
      expect(result).toBeInstanceOf(Set)
      expect(result.size).toBe(1)
      expect(result).toContain('package-a')
      expect(result).not.toContain('package-b')
    })

    it('should find packages affected by dependency changes and respect EXCLUDE_DEVDEPS', async () => {
      vi.stubEnv('EXCLUDE_DEVDEPS', 'true')

      vol.fromJSON({
        'packages/package-a/package.json': JSON.stringify({
          dependencies: {
            'changed-dep': 'catalog:',
          },
          version: '1.0.0',
          name: 'package-a',
        }),
        'packages/package-b/package.json': JSON.stringify({
          devDependencies: {
            'changed-dep': 'catalog:',
          },
          version: '1.0.0',
          name: 'package-b',
        }),
      })

      const result = await findAffectedPackages(['changed-dep'])

      expect(glob).toHaveBeenCalledWith(['packages/*/package.json'], {
        expandDirectories: false,
        cwd: '/mock/repo',
        ignore: ['node_modules/', 'dist/'],
      })
      expect(result).toBeInstanceOf(Set)
      expect(result.size).toBe(1)
      expect(result).toContain('package-a')
      expect(result).not.toContain('package-b')
    })

    it('should find packages affected by dependency changes and respect changeset ignore config', async () => {
      vi.mocked(readConfig).mockResolvedValue({
        config: { ...defaultConfig, ignore: ['package-c'] },
        warnings: [],
        errors: undefined,
      })

      vol.fromJSON({
        'packages/package-a/package.json': JSON.stringify({
          dependencies: {
            'changed-dep': 'catalog:',
          },
          version: '1.0.0',
          name: 'package-a',
        }),
        'packages/package-b/package.json': JSON.stringify({
          dependencies: {
            'unchanged-dep': 'catalog:',
          },
          version: '1.0.0',
          name: 'package-b',
        }),
        'packages/package-c/package.json': JSON.stringify({
          dependencies: {
            'changed-dep': 'catalog:',
          },
          version: '1.0.0',
          name: 'package-c',
        }),
      })

      const result = await findAffectedPackages(['changed-dep'])

      expect(glob).toHaveBeenCalledWith(['packages/*/package.json'], {
        expandDirectories: false,
        cwd: '/mock/repo',
        ignore: ['node_modules/', 'dist/'],
      })
      expect(result).toBeInstanceOf(Set)
      expect(result.size).toBe(1)
      expect(result).toContain('package-a')
      expect(result).not.toContain('package-b')
      expect(result).not.toContain('package-c')
    })

    it('should handle packages with no affected dependencies', async () => {
      const packageJson = JSON.stringify({
        dependencies: {
          'unchanged-dep': 'catalog:',
        },
        version: '1.0.0',
        name: 'package-a',
      })
      vol.fromJSON({
        'packages/package-a/package.json': packageJson,
        'packages/package-b/package.json': packageJson,
        'packages/package-c/package.json': packageJson,
      })

      const result = await findAffectedPackages(['non-existent-dep'])

      expect(result).toBeInstanceOf(Set)
      expect(result.size).toBe(0)
    })

    it('should handle empty dependency list', async () => {
      const result = await findAffectedPackages([])

      expect(glob).not.toHaveBeenCalledTimes(1)
      expect(result).toBeInstanceOf(Set)
      expect(result.size).toBe(0)
    })

    it('should handle file read errors gracefully', async () => {
      const result = await findAffectedPackages(['changed-dep'])

      expect(result).toBeInstanceOf(Set)
      expect(result.size).toBe(0)
    })

    it('should respect explicitly provided packageJsonGlobs over discovered ones', async () => {
      vi.mocked(glob).mockResolvedValue(['apps/app-a/package.json'])
      vol.fromJSON({
        'apps/app-a/package.json': JSON.stringify({
          dependencies: {
            'changed-dep': 'catalog:',
          },
          version: '1.0.0',
          name: 'app-a',
        }),
      })

      const result = await findAffectedPackages(['changed-dep'], ['apps/*/package.json'])

      expect(glob).toHaveBeenCalledWith(['apps/*/package.json'], {
        expandDirectories: false,
        cwd: '/mock/repo',
        ignore: ['node_modules/', 'dist/'],
      })
      expect(result.size).toBe(1)
      expect(result).toContain('app-a')
    })

    it('should discover non-default workspace layouts (apps/*) from pnpm-workspace.yaml', async () => {
      vol.fromJSON({
        'pnpm-workspace.yaml': 'packages:\n  - apps/*',
        'apps/app-a/package.json': JSON.stringify({
          dependencies: {
            'changed-dep': 'catalog:',
          },
          version: '1.0.0',
          name: 'app-a',
        }),
      })
      vi.mocked(parse).mockReturnValue({ packages: ['apps/*'] })
      vi.mocked(glob).mockResolvedValue(['apps/app-a/package.json'])

      const result = await findAffectedPackages(['changed-dep'])

      expect(glob).toHaveBeenCalledWith(['apps/*/package.json'], {
        expandDirectories: false,
        cwd: '/mock/repo',
        ignore: ['node_modules/', 'dist/'],
      })
      expect(result.size).toBe(1)
      expect(result).toContain('app-a')
    })

    it('should fall back to packages/*/package.json when no workspace config is found', async () => {
      vol.reset()
      vi.mocked(glob).mockResolvedValue(['packages/package-a/package.json'])

      const result = await findAffectedPackages(['changed-dep'])

      expect(glob).toHaveBeenCalledWith(['packages/*/package.json'], {
        expandDirectories: false,
        cwd: '/mock/repo',
        ignore: ['node_modules/', 'dist/'],
      })
      expect(result.size).toBe(0)
    })
  })
})
