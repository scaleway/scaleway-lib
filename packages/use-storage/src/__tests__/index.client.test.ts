import { afterEach, describe, expect, it } from 'vitest'
import { renderHook } from 'vitest-browser-react'
import { useLocalStorage, useSessionStorage } from '..'

const KEY = 'test'

describe('useStorage - Client side', () => {
  describe(useLocalStorage, () => {
    afterEach(() => {
      globalThis.localStorage.removeItem(KEY)
    })

    it('works', async () => {
      const { result, act } = await renderHook(() => useLocalStorage<string>(KEY))
      expect(result.current[0]).toBeNull()

      await act(() => {
        result.current[1]('hello')
      })

      expect(globalThis.localStorage.getItem(KEY)).toBe('"hello"')
      expect(result.current[0]).toBe('hello')

      await act(() => {
        result.current[1](undefined)
      })

      expect(globalThis.localStorage.getItem(KEY)).toBeNull()
      expect(result.current[0]).toBeNull()
    })

    it('works with false value', async () => {
      const { result, act } = await renderHook(() => useLocalStorage<boolean>(KEY))
      expect(result.current[0]).toBeNull()

      await act(() => {
        result.current[1](true)
      })

      expect(globalThis.localStorage.getItem(KEY)).toBe('true')
      expect(result.current[0]).toBe(true)

      await act(() => {
        result.current[1](false)
      })

      expect(globalThis.localStorage.getItem(KEY)).toBe('false')
      expect(result.current[0]).toBe(false)
    })

    it('works with 0 value', async () => {
      const { result, act } = await renderHook(() => useLocalStorage<number>(KEY))
      expect(result.current[0]).toBeNull()

      await act(() => {
        result.current[1](1)
      })

      expect(globalThis.localStorage.getItem(KEY)).toBe('1')
      expect(result.current[0]).toBe(1)

      await act(() => {
        result.current[1](0)
      })

      expect(globalThis.localStorage.getItem(KEY)).toBe('0')
      expect(result.current[0]).toBe(0)
    })

    it('works already set value', async () => {
      globalThis.localStorage.setItem(KEY, '"previous"')

      const { result } = await renderHook(() => useLocalStorage<string>(KEY))
      expect(result.current[0]).toBe('previous')
    })

    it('works already set invalid value', async () => {
      globalThis.localStorage.setItem(KEY, 'previous')

      const { result } = await renderHook(() => useLocalStorage<string>(KEY))
      expect(result.current[0]).toBeNull()
    })

    it('works with initialValue', async () => {
      const { result } = await renderHook(() => useLocalStorage<string>(KEY, 'initial'))
      expect(result.current[0]).toBe('initial')
    })

    it('works with initialValue and already set value', async () => {
      globalThis.localStorage.setItem(KEY, '"previous"')

      const { result } = await renderHook(() => useLocalStorage<string>(KEY, 'initial'))
      expect(result.current[0]).toBe('previous')
    })

    it('works with initialValue and already set invalid value', async () => {
      globalThis.localStorage.setItem(KEY, 'previous')

      const { result } = await renderHook(() => useLocalStorage<string>(KEY, 'initial'))
      expect(result.current[0]).toBe('initial')
    })
  })

  describe(useSessionStorage, () => {
    afterEach(() => {
      globalThis.sessionStorage.removeItem(KEY)
    })

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

    it('works with false value', async () => {
      const { result, act } = await renderHook(() => useSessionStorage<boolean>(KEY))
      expect(result.current[0]).toBeNull()

      await act(() => {
        result.current[1](true)
      })

      expect(globalThis.sessionStorage.getItem(KEY)).toBe('true')
      expect(result.current[0]).toBe(true)

      await act(() => {
        result.current[1](false)
      })

      expect(globalThis.sessionStorage.getItem(KEY)).toBe('false')
      expect(result.current[0]).toBe(false)
    })

    it('works with 0 value', async () => {
      const { result, act } = await renderHook(() => useSessionStorage<number>(KEY))
      expect(result.current[0]).toBeNull()

      await act(() => {
        result.current[1](1)
      })

      expect(globalThis.sessionStorage.getItem(KEY)).toBe('1')
      expect(result.current[0]).toBe(1)

      await act(() => {
        result.current[1](0)
      })

      expect(globalThis.sessionStorage.getItem(KEY)).toBe('0')
      expect(result.current[0]).toBe(0)
    })

    it('works already set value', async () => {
      globalThis.sessionStorage.setItem(KEY, '"previous"')

      const { result } = await renderHook(() => useSessionStorage<string>(KEY))
      expect(result.current[0]).toBe('previous')
    })

    it('works already set invalid value', async () => {
      globalThis.sessionStorage.setItem(KEY, 'previous')

      const { result } = await renderHook(() => useSessionStorage<string>(KEY))
      expect(result.current[0]).toBeNull()
    })

    it('works with initialValue', async () => {
      const { result } = await renderHook(() => useSessionStorage<string>(KEY, 'initial'))
      expect(result.current[0]).toBe('initial')
    })

    it('works with initialValue and already set value', async () => {
      globalThis.sessionStorage.setItem(KEY, '"previous"')

      const { result } = await renderHook(() => useSessionStorage<string>(KEY, 'initial'))
      expect(result.current[0]).toBe('previous')
    })

    it('works with initialValue and already set invalid value', async () => {
      globalThis.sessionStorage.setItem(KEY, 'previous')

      const { result } = await renderHook(() => useSessionStorage<string>(KEY, 'initial'))
      expect(result.current[0]).toBe('initial')
    })
  })
})
