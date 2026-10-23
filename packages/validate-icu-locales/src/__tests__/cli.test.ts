import { spawnSync } from 'node:child_process'
import { describe, expect, it } from 'vitest'

// In-process behavior is covered by validate.test.ts; this single exec test
// pins the built bin itself: bundling, argv parsing and exit codes.
describe('validate-icu-locales CLI', () => {
  it('should run the built CLI end-to-end', () => {
    const invalid = spawnSync('node', ['dist/index.mjs', 'src/__tests__/locales/en-ts.ts'], { encoding: 'utf8' })

    expect(invalid.status).toBe(1)
    expect(invalid.stderr).toContain('EXPECT_ARGUMENT_CLOSING_BRACE')

    const valid = spawnSync('node', ['dist/index.mjs', 'src/__tests__/locales/valid.ts'], { encoding: 'utf8' })

    expect(valid.status).toBe(0)
    expect(valid.stderr).not.toContain('errors')

    const missing = spawnSync('node', ['dist/index.mjs'], { encoding: 'utf8' })

    expect(missing.status).toBe(1)
    expect(missing.stderr).toContain('Missing pattern')

    const ignored = spawnSync('node', ['dist/index.mjs', 'dist/**'], { encoding: 'utf8' })

    expect(ignored.status).toBe(1)
    expect(ignored.stderr).toContain('There is no files matching this pattern')
  })

  it('should ignore ICU tags with --ignoreTag', () => {
    const result = spawnSync('node', ['dist/index.mjs', '--ignoreTag', 'src/__tests__/locales/en-ts.ts'], {
      encoding: 'utf8',
    })

    // tag errors are skipped, but other ICU errors still fail the run
    expect(result.status).toBe(1)
    expect(result.stderr).not.toContain('UNCLOSED_TAG')
    expect(result.stderr).toContain('EXPECT_ARGUMENT_CLOSING_BRACE')
  })
})
