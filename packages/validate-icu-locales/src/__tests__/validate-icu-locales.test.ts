import { execa } from 'execa'
import { describe, expect, it } from 'vitest'

describe('validate-icu-locales CLI', () => {
  it('should detect ICU syntax errors in JavaScript files', async () => {
    try {
      await execa('node', ['dist/index.js', 'src/__tests__/locales/*.js'], {
        cwd: process.cwd(),
        reject: true,
      })
      // If we reach here, the command didn't fail as expected
      expect.fail('Expected command to fail with ICU errors')
    } catch (error) {
      // Check that the error contains information about ICU syntax errors
      if (error instanceof Error) {
        const errorMessage = error.toString()
        // The CLI outputs errors to stderr and exits with code 1
        expect(errorMessage).toContain('errors')
        expect(errorMessage).toContain('EXPECT_ARGUMENT_CLOSING_BRACE')
      }
    }
  })

  it('should detect ICU syntax errors in TypeScript files', async () => {
    try {
      await execa('node', ['dist/index.js', 'src/__tests__/locales/*.ts'], {
        cwd: process.cwd(),
        reject: true,
      })
      // If we reach here, the command didn't fail as expected
      expect.fail('Expected command to fail with ICU errors')
    } catch (error) {
      // Check that the error contains information about ICU syntax errors
      const errorMessage = (error as Error).toString()
      expect(errorMessage).toContain('errors')
      expect(errorMessage).toContain('EXPECT_ARGUMENT_CLOSING_BRACE')
    }
  })

  it('should detect ICU syntax errors in JSON files', async () => {
    try {
      await execa('node', ['dist/index.js', 'src/__tests__/locales/*.json'], {
        cwd: process.cwd(),
        reject: true,
      })
      // If we reach here, the command didn't fail as expected
      expect.fail('Expected command to fail with ICU errors')
    } catch (error) {
      // Check that the error contains information about ICU syntax errors
      const errorMessage = (error as Error).toString()
      expect(errorMessage).toContain('errors')
      expect(errorMessage).toContain('EXPECT_ARGUMENT_CLOSING_BRACE')
    }
  })

  it('should fail when no pattern is provided', async () => {
    try {
      await execa('node', ['dist/index.js'], {
        cwd: process.cwd(),
        reject: true,
      })
      // If we reach here, the command didn't fail as expected
      expect.fail('Expected command to fail with missing pattern error')
    } catch (error) {
      // Check that the error contains information about missing pattern
      const errorMessage = (error as Error).toString()
      expect(errorMessage).toContain('Missing pattern')
    }
  })

  it('should correctly identify specific error types', async () => {
    try {
      await execa('node', ['dist/index.js', 'src/__tests__/locales/en-ts.ts'], {
        cwd: process.cwd(),
        reject: true,
      })
      // If we reach here, the command didn't fail as expected
      expect.fail('Expected command to fail with ICU errors')
    } catch (error) {
      // Check that the error contains both types of errors we expect:
      // 1. EXPECT_ARGUMENT_CLOSING_BRACE for missing closing brace
      // 2. UNCLOSED_TAG for unclosed tag
      const errorMessage = (error as Error).toString()
      expect(errorMessage).toContain('EXPECT_ARGUMENT_CLOSING_BRACE')
      expect(errorMessage).toContain('UNCLOSED_TAG')
      expect(errorMessage).toContain('units.minutes.label')
      expect(errorMessage).toContain('units.chevron')
    }
  })

  it('should succeed with valid ICU strings', async () => {
    // This should not throw an error as all ICU strings are valid
    const { stderr } = await execa(
      'node',
      ['dist/index.js', 'src/__tests__/locales/valid.ts'],
      {
        cwd: process.cwd(),
      },
    )

    // Should not contain any errors
    expect(stderr).not.toContain('errors')
  })

  it('should succeed with valid JSON ICU strings', async () => {
    // This should not throw an error as all ICU strings are valid
    const { stderr } = await execa(
      'node',
      ['dist/index.js', 'src/__tests__/locales/valid.json'],
      {
        cwd: process.cwd(),
      },
    )

    // Should not contain any errors
    expect(stderr).not.toContain('errors')
  })
})
