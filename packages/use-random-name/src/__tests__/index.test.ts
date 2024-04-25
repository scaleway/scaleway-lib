import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import useRandomName from '..'

describe('useRandomName', () => {
  it('useRandomName should not be undefined', () => {
    const { result } = renderHook(() => useRandomName())
    expect(result.current).not.toBeUndefined()
  })
})
