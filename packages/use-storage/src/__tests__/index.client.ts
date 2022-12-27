/**
 * @jest-environment jsdom
 */

import { act, renderHook } from '@testing-library/react'
import { useLocalStorage, useSessionStorage } from '..'

const KEY = 'test'

describe('useStorage - Client side', () => {
  afterEach(() => {
    window.localStorage.removeItem(KEY)
  })

  describe('useLocalStorage', () => {
    it('works', async () => {
      const { result } = renderHook(() => useLocalStorage<string>(KEY))
      expect(result.current[0]).toBeNull()

      await act(() => result.current[1]('hello'))

      expect(window.localStorage.getItem(KEY)).toBe('"hello"')
      expect(result.current[0]).toBe('hello')

      await act(() => result.current[1](undefined))

      expect(window.localStorage.getItem(KEY)).toBeNull()
      expect(result.current[0]).toBeNull()
    })

    it('works already set value', async () => {
      await act(() => window.localStorage.setItem(KEY, '"previous"'))

      const { result } = renderHook(() => useLocalStorage<string>(KEY))
      expect(result.current[0]).toBe('previous')
    })

    it('works already set invalid value', async () => {
      await act(() => window.localStorage.setItem(KEY, 'previous'))

      const { result } = renderHook(() => useLocalStorage<string>(KEY))
      expect(result.current[0]).toBeNull()
    })

    it('works with initialValue', () => {
      const { result } = renderHook(() =>
        useLocalStorage<string>(KEY, 'initial'),
      )
      expect(result.current[0]).toBe('initial')
    })

    it('works with initialValue and already set value', async () => {
      await act(() => window.localStorage.setItem(KEY, '"previous"'))

      const { result } = renderHook(() =>
        useLocalStorage<string>(KEY, 'initial'),
      )
      expect(result.current[0]).toBe('previous')
    })

    it('works with initialValue and already set invalid value', async () => {
      await act(() => window.localStorage.setItem(KEY, 'previous'))

      const { result } = renderHook(() =>
        useLocalStorage<string>(KEY, 'initial'),
      )
      expect(result.current[0]).toBe('initial')
    })
  })

  describe('useSessionStorage', () => {
    it('works', async () => {
      const { result } = renderHook(() => useSessionStorage<string>(KEY))
      expect(result.current[0]).toBeNull()

      await act(() => result.current[1]('hello'))

      expect(window.sessionStorage.getItem(KEY)).toBe('"hello"')
      expect(result.current[0]).toBe('hello')

      await act(() => result.current[1](undefined))

      expect(window.sessionStorage.getItem(KEY)).toBeNull()
      expect(result.current[0]).toBeNull()
    })

    it('works already set value', async () => {
      await act(() => window.sessionStorage.setItem(KEY, '"previous"'))

      const { result } = renderHook(() => useSessionStorage<string>(KEY))
      expect(result.current[0]).toBe('previous')
    })

    it('works already set invalid value', async () => {
      await act(() => window.sessionStorage.setItem(KEY, 'previous'))

      const { result } = renderHook(() => useSessionStorage<string>(KEY))
      expect(result.current[0]).toBeNull()
    })

    it('works with initialValue', () => {
      const { result } = renderHook(() =>
        useSessionStorage<string>(KEY, 'initial'),
      )
      expect(result.current[0]).toBe('initial')
    })

    it('works with initialValue and already set value', async () => {
      await act(() => window.sessionStorage.setItem(KEY, '"previous"'))

      const { result } = renderHook(() =>
        useSessionStorage<string>(KEY, 'initial'),
      )
      expect(result.current[0]).toBe('previous')
    })

    it('works with initialValue and already set invalid value', async () => {
      await act(() => window.sessionStorage.setItem(KEY, 'previous'))

      const { result } = renderHook(() =>
        useSessionStorage<string>(KEY, 'initial'),
      )
      expect(result.current[0]).toBe('initial')
    })
  })
})
