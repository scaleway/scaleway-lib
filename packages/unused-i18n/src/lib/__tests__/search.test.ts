import * as fs from 'fs'
import * as path from 'path'
import { describe, expect, it, vi } from 'vitest'
import { searchFilesRecursively } from '../search'

vi.mock('fs')

describe('searchFilesRecursively', () => {
  it('should find files where content matches the regex pattern', () => {
    const baseDir = 'testDir'
    const regex = /use-i18n/

    const fsMock = {
      readdirSync: vi.fn(dir => {
        if (dir === baseDir) return ['file1.js', 'file2.js', 'subdir']
        if (dir === path.join(baseDir, 'subdir')) return ['file3.js']

        return []
      }),
      lstatSync: vi.fn(filePath => ({
        isDirectory: () => filePath === path.join(baseDir, 'subdir'),
      })),
      readFileSync: vi.fn(filePath => {
        if (filePath === path.join(baseDir, 'file1.js')) {
          return `
        import { useI18n } from '@scaleway/use-i18n'
        `
        }
        if (filePath === path.join(baseDir, 'file2.js')) return 'no match here'
        if (filePath === path.join(baseDir, 'subdir', 'file3.js')) {
          return `
        import { useI18n } from '@scaleway/use-i18n'
        `
        }

        return ''
      }),
    }

    vi.mocked(fs.readFileSync).mockImplementation(fsMock.readFileSync)
    // @ts-expect-error mockImplementation no function
    vi.mocked(fs.lstatSync).mockImplementation(fsMock.lstatSync)
    // @ts-expect-error mockImplementation no function
    vi.mocked(fs.readdirSync).mockImplementation(fsMock.readdirSync)

    const expected = [
      path.join(baseDir, 'file1.js'),
      path.join(baseDir, 'subdir', 'file3.js'),
    ]

    const result = searchFilesRecursively({
      baseDir,
      regex,
      excludePatterns: [],
    })

    expect(result).toEqual(expect.arrayContaining(expected))
    expect(expected).toEqual(expect.arrayContaining(result))
  })
})
