import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useStateReset } from '..'

const sameValuesDeps = () =>
  Object.values({
    organizationId: '123',
    projectId: undefined,
    statuses: [],
  })

describe(useStateReset, () => {
  it('should return the initial value', () => {
    const { result } = renderHook(() => useStateReset(1, ['a']))

    expect(result.current[0]).toBe(1)
  })

  it('should update the value with setValue', () => {
    const { result } = renderHook(() => useStateReset(1, ['a']))

    act(() => {
      result.current[1](2)
    })

    expect(result.current[0]).toBe(2)
  })

  it('should support functional updates', () => {
    const { result } = renderHook(() => useStateReset(1, ['a']))

    act(() => {
      result.current[1](value => value + 1)
    })

    expect(result.current[0]).toBe(2)
  })

  it('should reset to the initial value when the deps change', () => {
    const { result, rerender } = renderHook(({ deps }) => useStateReset(1, deps), {
      initialProps: { deps: ['a'] },
    })

    act(() => {
      result.current[1](2)
    })
    expect(result.current[0]).toBe(2)

    rerender({ deps: ['b'] })

    expect(result.current[0]).toBe(1)
  })

  it('should reset to a new initial value when both deps and initial value change', () => {
    const { result, rerender } = renderHook(({ deps, initialValue }) => useStateReset(initialValue, deps), {
      initialProps: { deps: ['a'], initialValue: 1 },
    })

    expect(result.current[0]).toBe(1)

    rerender({ deps: ['b'], initialValue: 3 })

    expect(result.current[0]).toBe(3)
  })

  it('should not reset when the initial value changes but the deps stay the same', () => {
    const { result, rerender } = renderHook(({ deps, initialValue }) => useStateReset(initialValue, deps), {
      initialProps: { deps: ['a'], initialValue: 1 },
    })

    act(() => {
      result.current[1](2)
    })

    rerender({ deps: ['a'], initialValue: 3 })

    expect(result.current[0]).toBe(2)
  })

  it('should not reset when a new array with the same values, including undefined and empty arrays, is passed', () => {
    const { result, rerender } = renderHook(({ nextDeps }) => useStateReset(1, nextDeps), {
      initialProps: { nextDeps: sameValuesDeps() },
    })

    act(() => {
      result.current[1](5)
    })

    rerender({ nextDeps: sameValuesDeps() })

    expect(result.current[0]).toBe(5)
  })

  it('should not reset when a string[] dep is a new array with the same values', () => {
    const { result, rerender } = renderHook(({ nextDeps }) => useStateReset(1, nextDeps), {
      initialProps: { nextDeps: [['ready', 'deleting']] },
    })

    act(() => {
      result.current[1](5)
    })

    rerender({ nextDeps: [['ready', 'deleting']] })

    expect(result.current[0]).toBe(5)
  })

  it('should reset when a string[] dep is a new array with different values', () => {
    const { result, rerender } = renderHook(({ nextDeps }) => useStateReset(1, nextDeps), {
      initialProps: { nextDeps: [['ready', 'deleting']] },
    })

    act(() => {
      result.current[1](5)
    })

    rerender({ nextDeps: [['ready']] })

    expect(result.current[0]).toBe(1)
  })

  it('should reset when an undefined dep changes to a value', () => {
    const { result, rerender } = renderHook(({ nextDeps }) => useStateReset(1, nextDeps), {
      initialProps: { nextDeps: [undefined] as (string | undefined)[] },
    })

    act(() => {
      result.current[1](5)
    })

    rerender({ nextDeps: ['org-123'] })

    expect(result.current[0]).toBe(1)
  })

  it('should reset when an undefined dep changes to null', () => {
    const { result, rerender } = renderHook(({ nextDeps }) => useStateReset(1, nextDeps), {
      initialProps: { nextDeps: [undefined] as (string | undefined | null)[] },
    })

    act(() => {
      result.current[1](5)
    })

    rerender({ nextDeps: [null] })

    expect(result.current[0]).toBe(1)
  })

  it('should reset when an undefined dep changes to the literal "__undefined__" string', () => {
    const { result, rerender } = renderHook(({ nextDeps }) => useStateReset(1, nextDeps), {
      initialProps: { nextDeps: [undefined] as (string | undefined)[] },
    })

    act(() => {
      result.current[1](5)
    })

    rerender({ nextDeps: ['__undefined__'] })

    expect(result.current[0]).toBe(1)
  })

  it('should reset when a NaN dep changes to null', () => {
    const { result, rerender } = renderHook(({ nextDeps }) => useStateReset(1, nextDeps), {
      initialProps: { nextDeps: [Number.NaN] as (number | null)[] },
    })

    act(() => {
      result.current[1](5)
    })

    rerender({ nextDeps: [null] })

    expect(result.current[0]).toBe(1)
  })

  it('should reset when one of multiple dependencies changes', () => {
    const { result, rerender } = renderHook(({ nextDeps }) => useStateReset(0, nextDeps), {
      initialProps: { nextDeps: ['dep1', 'dep2'] },
    })

    act(() => {
      result.current[1](3)
    })

    rerender({ nextDeps: ['dep1', 'dep3'] })

    expect(result.current[0]).toBe(0)
  })

  it('should handle generic non-numeric state', () => {
    const { result } = renderHook(() => useStateReset('foo', ['a']))

    act(() => {
      result.current[1]('bar')
    })

    expect(result.current[0]).toBe('bar')
  })
})
