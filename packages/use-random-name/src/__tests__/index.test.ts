import { describe, expect, it } from 'vitest'
import { renderHook } from 'vitest-browser-react'
import { useRandomName } from '..'

describe(useRandomName, () => {
  it('useRandomName should not be undefined', async () => {
    const { result } = await renderHook(() => useRandomName())
    expect(result.current).toBeDefined()
  })
})
