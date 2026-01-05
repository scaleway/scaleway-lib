/**
 * @vitest-environment jsdom
 */

import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { useLocalStorage, useSessionStorage } from '..'

const KEY = 'test'

describe('useStorage - Client side', () => {
  describe('useLocalStorage', () => {
    afterEach(() => {
      window.localStorage.removeItem(KEY)
    })

    it('works', () => {
      const { result } = renderHook(() => useLocalStorage<string>(KEY))
      expect(result.current[0]).toBeNull()

      act(() => {
        result.current[1]('hello')
      })

      expect(window.localStorage.getItem(KEY)).toBe('"hello"')
      expect(result.current[0]).toBe('hello')

      act(() => {
        result.current[1](undefined)
      })

      expect(window.localStorage.getItem(KEY)).toBeNull()
      expect(result.current[0]).toBeNull()
    })

    it('works with false value', () => {
      const { result } = renderHook(() => useLocalStorage<boolean>(KEY))
      expect(result.current[0]).toBeNull()

      act(() => {
        result.current[1](true)
      })

      expect(window.localStorage.getItem(KEY)).toBe('true')
      expect(result.current[0]).toBeTruthy()

      act(() => {
        result.current[1](false)
      })

      expect(window.localStorage.getItem(KEY)).toBe('false')
      expect(result.current[0]).toBeFalsy()
    })

    it('works with 0 value', () => {
      const { result } = renderHook(() => useLocalStorage<number>(KEY))
      expect(result.current[0]).toBeNull()

      act(() => {
        result.current[1](1)
      })

      expect(window.localStorage.getItem(KEY)).toBe('1')
      expect(result.current[0]).toBe(1)

      act(() => {
        result.current[1](0)
      })

      expect(window.localStorage.getItem(KEY)).toBe('0')
      expect(result.current[0]).toBe(0)
    })

    it('works already set value', () => {
      act(() => {
        window.localStorage.setItem(KEY, '"previous"')
      })

      const { result } = renderHook(() => useLocalStorage<string>(KEY))
      expect(result.current[0]).toBe('previous')
    })

    it('works already set invalid value', () => {
      act(() => {
        window.localStorage.setItem(KEY, 'previous')
      })

      const { result } = renderHook(() => useLocalStorage<string>(KEY))
      expect(result.current[0]).toBeNull()
    })

    it('works with initialValue', () => {
      const { result } = renderHook(() =>
        useLocalStorage<string>(KEY, 'initial'),
      )
      expect(result.current[0]).toBe('initial')
    })

    it('works with initialValue and already set value', () => {
      act(() => {
        window.localStorage.setItem(KEY, '"previous"')
      })

      const { result } = renderHook(() =>
        useLocalStorage<string>(KEY, 'initial'),
      )
      expect(result.current[0]).toBe('previous')
    })

    it('works with initialValue and already set invalid value', () => {
      act(() => {
        window.localStorage.setItem(KEY, 'previous')
      })

      const { result } = renderHook(() =>
        useLocalStorage<string>(KEY, 'initial'),
      )
      expect(result.current[0]).toBe('initial')
    })
  })

  describe('useSessionStorage', () => {
    afterEach(() => {
      window.sessionStorage.removeItem(KEY)
    })

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

    it('works with false value', () => {
      const { result } = renderHook(() => useSessionStorage<boolean>(KEY))
      expect(result.current[0]).toBeNull()

      act(() => {
        result.current[1](true)
      })

      expect(window.sessionStorage.getItem(KEY)).toBe('true')
      expect(result.current[0]).toBeTruthy()

      act(() => {
        result.current[1](false)
      })

      expect(window.sessionStorage.getItem(KEY)).toBe('false')
      expect(result.current[0]).toBeFalsy()
    })

    it('works with 0 value', () => {
      const { result } = renderHook(() => useSessionStorage<number>(KEY))
      expect(result.current[0]).toBeNull()

      act(() => {
        result.current[1](1)
      })

      expect(window.sessionStorage.getItem(KEY)).toBe('1')
      expect(result.current[0]).toBe(1)

      act(() => {
        result.current[1](0)
      })

      expect(window.sessionStorage.getItem(KEY)).toBe('0')
      expect(result.current[0]).toBe(0)
    })

    it('works already set value', () => {
      act(() => {
        window.sessionStorage.setItem(KEY, '"previous"')
      })

      const { result } = renderHook(() => useSessionStorage<string>(KEY))
      expect(result.current[0]).toBe('previous')
    })

    it('works already set invalid value', () => {
      act(() => {
        window.sessionStorage.setItem(KEY, 'previous')
      })

      const { result } = renderHook(() => useSessionStorage<string>(KEY))
      expect(result.current[0]).toBeNull()
    })

    it('works with initialValue', () => {
      const { result } = renderHook(() =>
        useSessionStorage<string>(KEY, 'initial'),
      )
      expect(result.current[0]).toBe('initial')
    })

    it('works with initialValue and already set value', () => {
      act(() => {
        window.sessionStorage.setItem(KEY, '"previous"')
      })

      const { result } = renderHook(() =>
        useSessionStorage<string>(KEY, 'initial'),
      )
      expect(result.current[0]).toBe('previous')
    })

    it('works with initialValue and already set invalid value', () => {
      act(() => {
        window.sessionStorage.setItem(KEY, 'previous')
      })

      const { result } = renderHook(() =>
        useSessionStorage<string>(KEY, 'initial'),
      )
      expect(result.current[0]).toBe('initial')
    })
  })
})
