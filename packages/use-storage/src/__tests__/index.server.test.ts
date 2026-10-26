/**
 * @vitest-environment node
 */

import { describe, expect, it } from 'vitest'
import { renderHook } from 'vitest-browser-react'
import { useLocalStorage, useSessionStorage } from '..'

const KEY = 'test'

// renderHook does not yet support server side
describe.todo('useStorage - Server side', () => {
  describe(useLocalStorage, () => {
    it('works', async () => {
      const { result, act } = await renderHook(() => useLocalStorage<string>(KEY))
      expect(result.current[0]).toBeNull()

      await act(() => {
        result.current[1]('hello')
      })

      expect(result.current[0]).toBe('hello')

      await act(() => {
        result.current[1](undefined)
      })

      expect(result.current[0]).toBeNull()
    })

    it('works with initialValue', async () => {
      const { result } = await renderHook(() => useLocalStorage<string>(KEY, 'initial'))
      expect(result.current[0]).toBe('initial')
    })
  })

  describe(useSessionStorage, () => {
    it('works', async () => {
      const { result, act } = await renderHook(() => useSessionStorage<string>(KEY))
      expect(result.current[0]).toBeNull()

      await act(() => {
        result.current[1]('hello')
      })

      expect(globalThis.sessionStorage.getItem(KEY)).toBe('"hello"')
      expect(result.current[0]).toBe('hello')

      await act(() => {
        result.current[1](undefined)
      })

      expect(globalThis.sessionStorage.getItem(KEY)).toBeNull()
      expect(result.current[0]).toBeNull()
    })

    it('works with initialValue', async () => {
      const { result } = await renderHook(() => useSessionStorage<string>(KEY, 'initial'))
      expect(result.current[0]).toBe('initial')
    })
  })
})
