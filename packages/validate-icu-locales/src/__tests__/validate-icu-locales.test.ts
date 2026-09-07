import { execa } from 'execa'
import { describe, expect, it } from 'vitest'

describe('validate-icu-locales CLI', () => {
  it('should detect ICU syntax errors in JavaScript files', async () => {
    const result = await execa('node', ['dist/index.mjs', 'src/__tests__/locales/*.js'], {
      cwd: process.cwd(),
    }).catch((error: unknown) => error)

    expect(result).toBeInstanceOf(Error)
    const errorMessage = (result as Error).toString()
    expect(errorMessage).toContain('errors')
    expect(errorMessage).toContain('EXPECT_ARGUMENT_CLOSING_BRACE')
  })

  it('should detect ICU syntax errors in TypeScript files', async () => {
    const result = await execa('node', ['dist/index.mjs', 'src/__tests__/locales/*.ts'], {
      cwd: process.cwd(),
    }).catch((error: unknown) => error)

    expect(result).toBeInstanceOf(Error)
    const errorMessage = (result as Error).toString()
    expect(errorMessage).toContain('errors')
    expect(errorMessage).toContain('EXPECT_ARGUMENT_CLOSING_BRACE')
  })

  it('should detect ICU syntax errors in JSON files', async () => {
    const result = await execa('node', ['dist/index.mjs', 'src/__tests__/locales/*.json'], {
      cwd: process.cwd(),
    }).catch((error: unknown) => error)

    expect(result).toBeInstanceOf(Error)
    const errorMessage = (result as Error).toString()
    expect(errorMessage).toContain('errors')
    expect(errorMessage).toContain('EXPECT_ARGUMENT_CLOSING_BRACE')
  })

  it('should fail when no pattern is provided', async () => {
    const result = await execa('node', ['dist/index.mjs'], {
      cwd: process.cwd(),
    }).catch((error: unknown) => error)

    expect(result).toBeInstanceOf(Error)
    const errorMessage = (result as Error).toString()
    expect(errorMessage).toContain('Missing pattern')
  })

  it('should correctly identify specific error types', async () => {
    const result = await execa('node', ['dist/index.mjs', 'src/__tests__/locales/en-ts.ts'], {
      cwd: process.cwd(),
    }).catch((error: unknown) => error)

    expect(result).toBeInstanceOf(Error)
    const errorMessage = (result as Error).toString()
    expect(errorMessage).toContain('EXPECT_ARGUMENT_CLOSING_BRACE')
    expect(errorMessage).toContain('UNCLOSED_TAG')
    expect(errorMessage).toContain('units.minutes.label')
    expect(errorMessage).toContain('units.chevron')
  })

  it('should succeed with valid ICU strings', async () => {
    // This should not throw an error as all ICU strings are valid
    const { stderr } = await execa('node', ['dist/index.mjs', 'src/__tests__/locales/valid.ts'], {
      cwd: process.cwd(),
    })

    // Should not contain any errors
    expect(stderr).not.toContain('errors')
  })

  it('should succeed with valid JSON ICU strings', async () => {
    // This should not throw an error as all ICU strings are valid
    const { stderr } = await execa('node', ['dist/index.mjs', 'src/__tests__/locales/valid.json'], {
      cwd: process.cwd(),
    })

    // Should not contain any errors
    expect(stderr).not.toContain('errors')
  })
})
