import { describe, expect, it } from 'vitest'
import { renderHook } from 'vitest-browser-react'
import { useStateReset } from '..'

const sameValuesDeps = () =>
  Object.values({
    organizationId: '123',
    projectId: undefined,
    statuses: [],
  })

describe(useStateReset, () => {
  it('should return the initial value', async () => {
    const { result } = await renderHook(() => useStateReset(1, ['a']))

    expect(result.current[0]).toBe(1)
  })

  it('should update the value with setValue', async () => {
    const { result, act } = await renderHook(() => useStateReset(1, ['a']))

    await act(() => {
      result.current[1](2)
    })

    expect(result.current[0]).toBe(2)
  })

  it('should support functional updates', async () => {
    const { result, act } = await renderHook(() => useStateReset(1, ['a']))

    await act(() => {
      result.current[1](value => value + 1)
    })

    expect(result.current[0]).toBe(2)
  })

  it('should reset to the initial value when the deps change', async () => {
    const initProps = { deps: ['a'] }
    const { result, act, rerender } = await renderHook(
      (props: typeof initProps = initProps) => useStateReset(1, props.deps),
      { initialProps: initProps },
    )

    await act(() => {
      result.current[1](2)
    })
    expect(result.current[0]).toBe(2)

    await rerender({ deps: ['b'] })

    expect(result.current[0]).toBe(1)
  })

  it('should reset to a new initial value when both deps and initial value change', async () => {
    const initProps = { deps: ['a'], initialValue: 1 }
    const { result, rerender } = await renderHook(
      (props: typeof initProps = initProps) => useStateReset(props.initialValue, props.deps),
      { initialProps: initProps },
    )

    expect(result.current[0]).toBe(1)

    await rerender({ deps: ['b'], initialValue: 3 })

    expect(result.current[0]).toBe(3)
  })

  it('should not reset when the initial value changes but the deps stay the same', async () => {
    const initProps = { deps: ['a'], initialValue: 1 }
    const { result, act, rerender } = await renderHook(
      (props: typeof initProps = initProps) => useStateReset(props.initialValue, props.deps),
      { initialProps: initProps },
    )

    await act(() => {
      result.current[1](2)
    })

    await rerender({ deps: ['a'], initialValue: 3 })

    expect(result.current[0]).toBe(2)
  })

  it('should not reset when a new array with the same values, including undefined and empty arrays, is passed', async () => {
    const initProps = { nextDeps: sameValuesDeps() }
    const { result, act, rerender } = await renderHook(
      (props: typeof initProps = initProps) => useStateReset(1, props.nextDeps),
      { initialProps: initProps },
    )

    await act(() => {
      result.current[1](5)
    })

    await rerender({ nextDeps: sameValuesDeps() })

    expect(result.current[0]).toBe(5)
  })

  it('should not reset when a string[] dep is a new array with the same values', async () => {
    const initProps = { nextDeps: [['ready', 'deleting']] }
    const { result, act, rerender } = await renderHook(
      (props: typeof initProps = initProps) => useStateReset(1, props.nextDeps),
      { initialProps: initProps },
    )

    await act(() => {
      result.current[1](5)
    })

    await rerender({ nextDeps: [['ready', 'deleting']] })

    expect(result.current[0]).toBe(5)
  })

  it('should reset when a string[] dep is a new array with different values', async () => {
    const initProps = { nextDeps: [['ready', 'deleting']] }
    const { result, act, rerender } = await renderHook(
      (props: typeof initProps = initProps) => useStateReset(1, props.nextDeps),
      { initialProps: initProps },
    )

    await act(() => {
      result.current[1](5)
    })

    await rerender({ nextDeps: [['ready']] })

    expect(result.current[0]).toBe(1)
  })

  it('should reset when an undefined dep changes to a value', async () => {
    const initProps = { nextDeps: [undefined] as (string | undefined)[] }
    const { result, act, rerender } = await renderHook(
      (props: typeof initProps = initProps) => useStateReset(1, props.nextDeps),
      { initialProps: initProps },
    )

    await act(() => {
      result.current[1](5)
    })

    await rerender({ nextDeps: ['org-123'] })

    expect(result.current[0]).toBe(1)
  })

  it('should reset when an undefined dep changes to null', async () => {
    const initProps = { nextDeps: [undefined] as (string | undefined | null)[] }
    const { result, act, rerender } = await renderHook(
      (props: typeof initProps = initProps) => useStateReset(1, props.nextDeps),
      { initialProps: initProps },
    )

    await act(() => {
      result.current[1](5)
    })

    await rerender({ nextDeps: [null] })

    expect(result.current[0]).toBe(1)
  })

  it('should reset when an undefined dep changes to the literal "__undefined__" string', async () => {
    const initProps = { nextDeps: [undefined] as (string | undefined)[] }
    const { result, act, rerender } = await renderHook(
      (props: typeof initProps = initProps) => useStateReset(1, props.nextDeps),
      { initialProps: initProps },
    )

    await act(() => {
      result.current[1](5)
    })

    await rerender({ nextDeps: ['__undefined__'] })

    expect(result.current[0]).toBe(1)
  })

  it('should reset when a NaN dep changes to null', async () => {
    const initProps = { nextDeps: [Number.NaN] as (number | null)[] }
    const { result, act, rerender } = await renderHook(
      (props: typeof initProps = initProps) => useStateReset(1, props.nextDeps),
      { initialProps: initProps },
    )

    await act(() => {
      result.current[1](5)
    })

    await rerender({ nextDeps: [null] })

    expect(result.current[0]).toBe(1)
  })

  it('should reset when one of multiple dependencies changes', async () => {
    const initProps = { nextDeps: ['dep1', 'dep2'] }
    const { result, act, rerender } = await renderHook(
      (props: typeof initProps = initProps) => useStateReset(0, props.nextDeps),
      { initialProps: initProps },
    )

    await act(() => {
      result.current[1](3)
    })

    await rerender({ nextDeps: ['dep1', 'dep3'] })

    expect(result.current[0]).toBe(0)
  })

  it('should handle generic non-numeric state', async () => {
    const { result, act } = await renderHook(() => useStateReset('foo', ['a']))

    await act(() => {
      result.current[1]('bar')
    })

    expect(result.current[0]).toBe('bar')
  })
})
