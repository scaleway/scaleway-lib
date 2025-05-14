import * as fs from 'fs'
import { describe, expect, it, vi } from 'vitest'
import { removeLocaleKeys } from '../remove'

vi.mock('fs')

describe('removeLocaleKeys', () => {
  it('should remove specified locale keys from the file', () => {
    const localePath = 'path/to/locale/en.js'
    const missingTranslations = ['key1', 'key4', 'key2']

    const fileContent = `export default {
  'key1': 'value1',
  'key2': 'value2',
  'key3': 'value3',
  'key4':
  'value4',
  'key5': 'value5',
} as const`

    const expectedContent = `
export default {
  'key3': 'value3',
  'key5': 'value5',
} as const`

    const fsMock = {
      readFileSync: vi.fn().mockReturnValue(fileContent),
      writeFileSync: vi.fn(),
    }

    vi.mocked(fs.readFileSync).mockImplementation(fsMock.readFileSync)
    vi.mocked(fs.writeFileSync).mockImplementation(fsMock.writeFileSync)

    removeLocaleKeys({ localePath, missingTranslations })

    expect(fs.readFileSync).toHaveBeenCalledWith(localePath, 'utf-8')
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      localePath,
      expectedContent.trim(),
      'utf-8',
    )
  })
  it('should remove specified locale keys from the file on multi line', () => {
    const localePath = 'path/to/locale/en.js'
    const missingTranslations = ['key1', 'key5']

    const fileContent = `export default {
  'key1': 'value1',
  'key2': 'value2',
  'key3': 'value3',
  'key4':
  'value4',
  'key5': 'value5',
} as const`

    const expectedContent = `
export default {
  'key2': 'value2',
  'key3': 'value3',
  'key4':
  'value4',
} as const`

    const fsMock = {
      readFileSync: vi.fn().mockReturnValue(fileContent),
      writeFileSync: vi.fn(),
    }

    vi.mocked(fs.readFileSync).mockImplementation(fsMock.readFileSync)
    vi.mocked(fs.writeFileSync).mockImplementation(fsMock.writeFileSync)

    removeLocaleKeys({ localePath, missingTranslations })

    expect(fs.readFileSync).toHaveBeenCalledWith(localePath, 'utf-8')
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      localePath,
      expectedContent.trim(),
      'utf-8',
    )
  })
})
