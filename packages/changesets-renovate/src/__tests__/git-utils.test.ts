import fs from 'node:fs/promises'
import fg from 'fast-glob'
import * as yaml from 'js-yaml'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mockSimpleGit } from '../../__mocks__/simple-git'
import {
  findAffectedPackages,
  findChangedDependenciesFromGit,
  loadCatalogFromGit,
} from '../git-utils.js'

const { globSync } = fg

// Mock all external dependencies
vi.mock('js-yaml')
vi.mock('fast-glob')
vi.mock('node:fs/promises')

describe('pnpm-catalogs-git-utils', () => {
  beforeEach(() => {
    // Clear all mocks
    vi.clearAllMocks()
  })

  describe('loadCatalogFromGit', () => {
    it('should load catalog from git at specific revision', async () => {
      const mockContent = `
catalog:
  test-package: 1.0.0
  another-package: 2.0.0
`
      mockSimpleGit.mockReturnValue({
        add: vi.fn(),
        branch: vi.fn(),
        commit: vi.fn(),
        diffSummary: vi.fn(),
        push: vi.fn(),
        revparse: vi.fn(),
        show: vi.fn().mockResolvedValue(mockContent),
      })
      vi.mocked(yaml.load).mockReturnValue({
        catalog: {
          'another-package': '2.0.0',
          'test-package': '1.0.0',
        },
      })

      const result = await loadCatalogFromGit('abc123', 'pnpm-workspace.yaml')

      expect(mockSimpleGit().show).toHaveBeenCalledWith([
        'abc123:pnpm-workspace.yaml',
      ])
      expect(yaml.load).toHaveBeenCalledWith(mockContent)
      expect(result).toEqual({
        'another-package': '2.0.0',
        'test-package': '1.0.0',
      })
    })

    it('should return empty object if git operation fails', async () => {
      mockSimpleGit.mockReturnValue({
        add: vi.fn(),
        branch: vi.fn(),
        commit: vi.fn(),
        diffSummary: vi.fn(),
        push: vi.fn(),
        revparse: vi.fn(),
        show: vi.fn().mockRejectedValue(new Error('File not found')),
      })

      const result = await loadCatalogFromGit(
        'nonexistent',
        'pnpm-workspace.yaml',
      )

      expect(result).toEqual({})
    })

    it('should return empty object if revision is empty', async () => {
      const result = await loadCatalogFromGit('', 'pnpm-workspace.yaml')

      expect(result).toEqual({})
    })
  })

  describe('findChangedDependenciesFromGit', () => {
    it('should find dependencies that have changed between git revisions', async () => {
      // Mock the git operations
      mockSimpleGit.mockReturnValue({
        add: vi.fn(),
        branch: vi.fn(),
        commit: vi.fn(),
        diffSummary: vi.fn(),
        push: vi.fn(),
        revparse: vi.fn(),
        show: vi
          .fn()
          .mockResolvedValueOnce(`
catalog:
  package-a: 1.0.0
  package-b: 2.0.0
  package-c: 3.0.0
`)
          .mockResolvedValueOnce(`
catalog:
  package-a: 1.1.0
  package-b: 2.0.0
  package-c: 3.1.0
  package-d: 4.0.0
`),
      })

      // Mock yaml parsing
      vi.mocked(yaml.load).mockImplementation((content: string) => {
        if (content.includes('1.0.0')) {
          return {
            catalog: {
              'package-a': '1.0.0',
              'package-b': '2.0.0',
              'package-c': '3.0.0',
            },
          }
        }

        return {
          catalog: {
            'package-a': '1.1.0',
            'package-b': '2.0.0',
            'package-c': '3.1.0',
            'package-d': '4.0.0',
          },
        }
      })

      const result = await findChangedDependenciesFromGit('abc123', 'def456')

      const packages = [...result.keys()]
      expect(packages).toHaveLength(2)
      expect(packages).toContain('package-a')
      expect(packages).toContain('package-c')
      expect(packages).not.toContain('package-b') // Unchanged
      expect(packages).not.toContain('package-d') // New package
    })
  })

  describe('findAffectedPackages', () => {
    it('should find packages affected by dependency changes', async () => {
      // Mock file system reads for package.json files
      vi.mocked(globSync).mockReturnValue([
        'packages/package-a/package.json',
        'packages/package-b/package.json',
      ])

      // oxlint-disable @typescript-eslint/require-await
      // oxlint-disable typescript-eslint/no-unsafe-argument
      vi.mocked(fs.readFile).mockImplementation((async (filePath: any) => {
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
  })
})
