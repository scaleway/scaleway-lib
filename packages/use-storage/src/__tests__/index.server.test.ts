/**
 * @vitest-environment node
 */

import { act, renderHook } from '@testing-library/react/pure'
import { describe, expect, it } from 'vitest'
import { useLocalStorage, useSessionStorage } from '..'

const KEY = 'test'

// renderHook does not yet support server side
// https://github.com/testing-library/react-testing-library/issues/1120
describe.skip('useStorage - Server side', () => {
  describe('useLocalStorage', () => {
    it('works', () => {
      const { result } = renderHook(() => useLocalStorage<string>(KEY))
      expect(result.current[0]).toBeNull()

      act(() => {
        result.current[1]('hello')
      })

      expect(result.current[0]).toBe('hello')

      act(() => {
        result.current[1](undefined)
      })

      expect(result.current[0]).toBeNull()
    })

    it('works with initialValue', () => {
      const { result } = renderHook(() =>
        useLocalStorage<string>(KEY, 'initial'),
      )
      expect(result.current[0]).toBe('initial')
    })
  })

  describe('useSessionStorage', () => {
    it('works', () => {
      const { result } = renderHook(() => useSessionStorage<string>(KEY))
      expect(result.current[0]).toBeNull()

      act(() => {
        result.current[1]('hello')
      })

      expect(window.sessionStorage.getItem(KEY)).toBe('"hello"')
      expect(result.current[0]).toBe('hello')

      act(() => {
        result.current[1](undefined)
      })

      expect(window.sessionStorage.getItem(KEY)).toBeNull()
      expect(result.current[0]).toBeNull()
    })

    it('works with initialValue', () => {
      const { result } = renderHook(() =>
        useSessionStorage<string>(KEY, 'initial'),
      )
      expect(result.current[0]).toBe('initial')
    })
  })
})
