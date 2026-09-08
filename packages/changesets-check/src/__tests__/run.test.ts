/**
 * @vitest-environment node
 */

import { describe, expect, it, vi } from 'vitest'

vi.mock(import('@changesets/assemble-release-plan'))
vi.mock(import('@changesets/config'))
vi.mock(import('@changesets/pre'))
vi.mock(import('@changesets/read'))
vi.mock(import('@manypkg/get-packages'))

describe('changesets-check CLI', () => {
  it('should export a run function', async () => {
    const { run } = await import('../run')
    expect(run).toBeTypeOf('function')
  })
})
