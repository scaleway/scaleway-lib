import { rmSync, symlinkSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { run } from '../validate'
import type { ErrorsICU } from '../validate'

// a missing message is "not this error code", hence the explicit ?? false
const hasErrorWith = (errors: ErrorsICU, code: string): boolean =>
  errors.some(error => error.message?.includes(code) ?? false)

describe('validate', () => {
  it('should detect ICU syntax errors in JavaScript files', async () => {
    const { errors } = await run('src/__tests__/locales/*.js')

    expect(hasErrorWith(errors, 'EXPECT_ARGUMENT_CLOSING_BRACE')).toBe(true)
  })

  it('should detect ICU syntax errors in TypeScript files', async () => {
    const { errors } = await run('src/__tests__/locales/*.ts')

    expect(hasErrorWith(errors, 'EXPECT_ARGUMENT_CLOSING_BRACE')).toBe(true)
  })

  it('should detect ICU syntax errors in JSON files', async () => {
    const { errors } = await run('src/__tests__/locales/*.json')

    expect(hasErrorWith(errors, 'EXPECT_ARGUMENT_CLOSING_BRACE')).toBe(true)
    expect(hasErrorWith(errors, 'UNCLOSED_TAG')).toBe(true)
  })

  it('should correctly identify specific error types', async () => {
    const { errors } = await run('src/__tests__/locales/en-ts.ts')

    expect(hasErrorWith(errors, 'EXPECT_ARGUMENT_CLOSING_BRACE')).toBe(true)
    expect(hasErrorWith(errors, 'UNCLOSED_TAG')).toBe(true)
    expect(errors.map(error => error.key)).toContain('units.minutes.label')
    expect(errors.map(error => error.key)).toContain('units.chevron')
  })

  it('should ignore ICU tags when ignoreTag is enabled', async () => {
    const { errors } = await run('src/__tests__/locales/en-ts.ts', { ignoreTag: true })

    expect(hasErrorWith(errors, 'UNCLOSED_TAG')).toBe(false)
    expect(hasErrorWith(errors, 'EXPECT_ARGUMENT_CLOSING_BRACE')).toBe(true)
  })

  it('should ignore ICU tags in JSON files when ignoreTag is enabled', async () => {
    const { errors } = await run('src/__tests__/locales/en-tag.json', { ignoreTag: true })

    expect(hasErrorWith(errors, 'UNCLOSED_TAG')).toBe(false)
    expect(hasErrorWith(errors, 'EXPECT_ARGUMENT_CLOSING_BRACE')).toBe(true)
  })

  it('should succeed with valid ICU strings', async () => {
    const { errors, files } = await run('src/__tests__/locales/valid.ts')

    // files must actually match, else "no errors" would pass vacuously
    expect(files.length).toBeGreaterThan(0)
    expect(errors).toStrictEqual([])
  })

  it('should succeed with valid JSON ICU strings', async () => {
    const { errors, files } = await run('src/__tests__/locales/valid.json')

    expect(files.length).toBeGreaterThan(0)
    expect(errors).toStrictEqual([])
  })

  it.skipIf(process.platform === 'win32')('should validate locale files reached through a symlink', async () => {
    const link = 'src/__tests__/locales/linked-en.js'
    symlinkSync('en.js', link)

    try {
      const { errors } = await run('src/__tests__/locales/linked*.js')

      expect(hasErrorWith(errors, 'EXPECT_ARGUMENT_CLOSING_BRACE')).toBe(true)
    } finally {
      rmSync(link)
    }
  })

  it('should exclude gitignored paths from the pattern', async () => {
    const { files } = await run('dist/**')

    expect(files).toStrictEqual([])
  })
})
