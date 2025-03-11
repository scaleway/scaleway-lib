import * as fs from 'fs'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { processTranslations } from '../index'
import { analyze } from '../lib/analyze'
import { searchFilesRecursively } from '../lib/search'
import { loadConfig } from '../utils/loadConfig'
import { getMissingTranslations } from '../utils/missingTranslations'
import { shouldExclude } from '../utils/shouldExclude'

// Mock dependencies
vi.mock('fs', () => ({
  existsSync: vi.fn(),
  readFileSync: vi.fn(),
  writeFileSync: vi.fn(),
}))

vi.mock('../utils/loadConfig', () => ({
  loadConfig: vi.fn(),
}))

vi.mock('../lib/search', () => ({
  searchFilesRecursively: vi.fn(),
}))

vi.mock('../lib/analyze', () => ({
  analyze: vi.fn(),
}))

vi.mock('../utils/shouldExclude', () => ({
  shouldExclude: vi.fn(),
}))

vi.mock('../utils/missingTranslations', () => ({
  getMissingTranslations: vi.fn(),
}))

describe('processTranslations', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should process translations correctly', async () => {
    const config = {
      paths: [
        {
          srcPath: ['srcPath'],
          localPath: 'localPath',
        },
      ],
      excludeKey: [],
      scopedNames: ['scopedT'],
      localesExtensions: 'ts',
      localesNames: 'en',
      ignorePaths: ['folder/file.ts'],
    }

    const files = ['file1.ts', 'folder/file.ts']
    const extractedTranslations = ['key1', 'key2']
    const localeContent = `
export default {
  'key1': 'value1',
  'key2': 'value2',
  'key3': 'value3',
  'key4': 'value4',
} as const
    `.trim()

    const expectedWriteContent = `
export default {
  'key1': 'value1',
  'key2': 'value2',
} as const
    `.trim()

    vi.mocked(loadConfig).mockResolvedValue(config)
    vi.mocked(searchFilesRecursively).mockReturnValue(files)
    vi.mocked(analyze).mockReturnValue(extractedTranslations)
    vi.mocked(shouldExclude).mockReturnValue(false)
    vi.mocked(getMissingTranslations).mockReturnValue(['key3', 'key4'])
    vi.mocked(fs.existsSync).mockReturnValue(true)
    vi.mocked(fs.readFileSync).mockReturnValue(localeContent)
    vi.mocked(fs.writeFileSync).mockImplementation(vi.fn())

    await processTranslations({ action: 'remove' })

    expect(fs.existsSync).toHaveBeenCalledWith('localPath/en.ts')
    expect(fs.readFileSync).toHaveBeenCalledWith('localPath/en.ts', 'utf-8')
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      'localPath/en.ts',
      expectedWriteContent,
      'utf-8',
    )
  })
})
