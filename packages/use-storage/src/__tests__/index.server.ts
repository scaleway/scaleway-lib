/**
 * @jest-environment node
 */

import { act, renderHook } from '@testing-library/react/pure'
import { useLocalStorage, useSessionStorage } from '..'

// renderHook does not yet support server side
// https://github.com/testing-library/react-testing-library/issues/1120
describe.skip('useStorage - Server side', () => {
  describe('useLocalStorage', () => {
    it('works', () => {
      const { result } = renderHook(() => useLocalStorage<string>('test'))
      expect(result.current[0]).toBeNull()

      act(() => result.current[1]('hello'))

      expect(result.current[0]).toBe('hello')

      act(() => result.current[1](undefined))

      expect(result.current[0]).toBeNull()
    })

    it('works with initialValue', () => {
      const { result } = renderHook(() =>
        useLocalStorage<string>('test', 'initial'),
      )
      expect(result.current[0]).toBe('initial')
    })
  })

  describe('useSessionStorage', () => {
    it('works', () => {
      const { result } = renderHook(() => useSessionStorage<string>('test'))
      expect(result.current[0]).toBeNull()

      act(() => result.current[1]('hello'))

      expect(window.sessionStorage.getItem('test')).toBe('"hello"')
      expect(result.current[0]).toBe('hello')

      act(() => result.current[1](undefined))

      expect(window.sessionStorage.getItem('test')).toBeNull()
      expect(result.current[0]).toBeNull()
    })
  })
})
