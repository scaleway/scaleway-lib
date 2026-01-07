import { act, renderHook } from '@testing-library/react'
import type { History } from 'history'
import { createMemoryHistory } from 'history'
import type { ComponentType, PropsWithChildren, ReactNode } from 'react'
import { useLayoutEffect, useState } from 'react'
import { MemoryRouter, Router } from 'react-router-dom'
import { describe, expect, it, test } from 'vitest'
import useQueryParams from '..'

type HistoryProps = {
  history: History
}
const HistoryRouter: ComponentType<PropsWithChildren<HistoryProps>> = ({
  history,
  children,
}) => {
  const [state, setState] = useState({
    action: history.action,
    location: history.location,
  })

  useLayoutEffect(() => history.listen(setState), [history])

  return (
    <Router
      location={state.location}
      navigationType={state.action}
      navigator={history}
    >
      {children}
    </Router>
  )
}

const wrapper =
  ({
    pathname = '/one',
    search,
    history,
  }: {
    pathname?: string
    search: string
    history?: History
  }) =>
  ({ children }: { children: ReactNode }) => {
    if (history) {
      return <HistoryRouter history={history}>{children}</HistoryRouter>
    }

    return (
      <MemoryRouter initialEntries={[{ pathname, search }]} initialIndex={0}>
        {children}
      </MemoryRouter>
    )
  }

describe('useQueryParam', () => {
  it('should correctly push instead of replacing history', () => {
    const history = createMemoryHistory({
      initialEntries: ['/one?user=john'],
      initialIndex: 1,
    })

    const { result } = renderHook(() => useQueryParams(), {
      wrapper: wrapper({ history, search: '' }),
    })

    act(() => {
      result.current.setQueryParams({ user: 'John' })
    })
    expect(result.current.queryParams).toEqual({ user: 'John' })
    expect(history.index).toBe(0)
    act(() => {
      result.current.setQueryParams({ user: 'Jack' })
    })
    expect(result.current.queryParams).toEqual({ user: 'Jack' })
    expect(history.index).toBe(0)
    act(() => {
      result.current.setQueryParams({ user: 'Jerry' }, { push: true })
    })
    expect(result.current.queryParams).toEqual({ user: 'Jerry' })
    expect(history.index).toBe(1)
  })

  it('should set one object', () => {
    const { result } = renderHook(() => useQueryParams(), {
      wrapper: wrapper({ search: 'user=john' }),
    })

    act(() => {
      result.current.setQueryParams({ user: 'John' })
    })

    expect(result.current.queryParams).toEqual({ user: 'John' })
  })

  it('should correctly set with different value', () => {
    const { result } = renderHook(() => useQueryParams(), {
      wrapper: wrapper({ search: 'user=john' }),
    })

    act(() => {
      result.current.setQueryParams({ user: 'John' })
    })
    expect(result.current.queryParams).toEqual({ user: 'John' })

    act(() => {
      result.current.setQueryParams({
        name: 'Doe',
        user: 'Doe',
      })
    })
    expect(result.current.queryParams).toEqual({
      name: 'Doe',
      user: 'Doe',
    })

    act(() => {
      result.current.setQueryParams({ user: 'Scaleway' })
    })
    expect(result.current.queryParams).toEqual({
      name: 'Doe',
      user: 'Scaleway',
    })
  })

  it('should set one complexe object', () => {
    const { result } = renderHook(() => useQueryParams(), {
      wrapper: wrapper({ search: 'user=john' }),
    })

    act(() => {
      result.current.setQueryParams({
        lastName: 'Doe',
        lib: 'useQueryParams',
        name: 'John',
        user: 'John Doe',
        version: 1234,
      })
    })
    expect(result.current.queryParams).toEqual({
      lastName: 'Doe',
      lib: 'useQueryParams',
      name: 'John',
      user: 'John Doe',
      version: 1234,
    })
  })

  it('should get queryParams from existing location', () => {
    const { result } = renderHook(() => useQueryParams(), {
      wrapper: wrapper({ search: 'user=john' }),
    })

    expect(result.current.queryParams).toEqual({ user: 'john' })
  })

  it('should should handle array, boolean, number and string from existing location', () => {
    const { result } = renderHook(() => useQueryParams(), {
      wrapper: wrapper({
        search: 'string=john&boolean=true&number=123&array=handle,array,format',
      }),
    })

    expect(result.current.queryParams).toEqual({
      array: ['handle', 'array', 'format'],
      boolean: true,
      number: 123,
      string: 'john',
    })
  })

  it('should get queryParams from existing location and set new params', () => {
    const { result } = renderHook(() => useQueryParams(), {
      wrapper: wrapper({ search: 'user=john' }),
    })

    expect(result.current.queryParams).toEqual({ user: 'john' })

    act(() => {
      result.current.setQueryParams({
        lastName: 'Doe',
        lib: 'useQueryParams',
        version: 1234,
      })
    })

    expect(result.current.queryParams).toEqual({
      lastName: 'Doe',
      lib: 'useQueryParams',
      user: 'john',
      version: 1234,
    })
  })

  it('should correctly set different objects before rerender', () => {
    const { result, rerender } = renderHook(() => useQueryParams(), {
      wrapper: wrapper({ search: '' }),
    })

    act(() => {
      result.current.setQueryParams({ name: 'JOHN' })
    })

    act(() => {
      result.current.setQueryParams({ lastName: 'Doe' })
    })
    expect(result.current.queryParams).toEqual({
      lastName: 'Doe',
      name: 'JOHN',
    })

    rerender()

    act(() => {
      result.current.setQueryParams({ name: 'john' })
    })

    act(() => {
      result.current.setQueryParams({ test: 'Scaleway' })
    })

    expect(result.current.queryParams).toEqual({
      lastName: 'Doe',
      name: 'john',
      test: 'Scaleway',
    })
  })

  it('should render good params with parallel changes', () => {
    const { result } = renderHook(() => useQueryParams(), {
      wrapper: wrapper({ search: '' }),
    })
    act(() => {
      result.current.setQueryParams({ name: 'John' })
    })
    act(() => {
      result.current.setQueryParams({ lastName: 'Doe' })
    })
    act(() => {
      result.current.setQueryParams({ compagny: 'Scaleway' })
    })

    expect(result.current.queryParams).toEqual({
      compagny: 'Scaleway',
      lastName: 'Doe',
      name: 'John',
    })

    act(() => {
      result.current.setQueryParams({ name: 'John' })
    })

    expect(result.current.queryParams).toEqual({
      compagny: 'Scaleway',
      lastName: 'Doe',
      name: 'John',
    })
  })

  test('should erase params', () => {
    const { result } = renderHook(() => useQueryParams(), {
      wrapper: wrapper({ search: '' }),
    })

    act(() => {
      result.current.setQueryParams({ name: 'John' })
    })
    expect(result.current.queryParams).toEqual({
      name: 'John',
    })
    act(() => {
      result.current.setQueryParams({ lastName: 'Doe' })
    })
    expect(result.current.queryParams).toEqual({
      lastName: 'Doe',
      name: 'John',
    })
    act(() => {
      result.current.replaceQueryParams({ compagny: 'Scaleway' })
    })
    expect(result.current.queryParams).toEqual({
      compagny: 'Scaleway',
    })
  })

  test('should correctly set query params with array', () => {
    const { result, rerender } = renderHook(() => useQueryParams(), {
      wrapper: wrapper({ search: '' }),
    })

    act(() => {
      result.current.setQueryParams({
        names: ['John', null, 'Jane', null, undefined, ''],
      })
    })
    expect(result.current.queryParams).toEqual({
      names: ['John', 'Jane'],
    })
    rerender()
  })

  test('should correctly with existing array', () => {
    const { result } = renderHook(() => useQueryParams(), {
      wrapper: wrapper({ search: 'names=John,,Jane,,,' }),
    })

    expect(result.current.queryParams).toEqual({
      names: ['John', '', 'Jane', '', '', ''],
    })
  })

  test('should work correctly when search is empty', () => {
    const { result } = renderHook(() => useQueryParams(), {
      wrapper: wrapper({ search: '' }),
    })

    act(() => {
      result.current.setQueryParams({ name: 'John' })
    })
    expect(result.current.queryParams).toEqual({
      name: 'John',
    })

    act(() => {
      result.current.replaceQueryParams({})
    })
    expect(result.current.queryParams).toEqual({})
  })

  test('should work correctly when have multiple useQueryParams', () => {
    const { result } = renderHook(
      () => ({
        qp1: useQueryParams(),
        qp2: useQueryParams(),
      }),
      {
        wrapper: wrapper({ search: '' }),
      },
    )

    act(() => {
      result.current.qp1.setQueryParams({ name: 'John' })
    })
    expect(result.current.qp2.queryParams).toEqual({
      name: 'John',
    })
    expect(result.current.qp1.queryParams).toEqual({
      name: 'John',
    })

    act(() => {
      result.current.qp2.replaceQueryParams({})
    })

    expect(result.current.qp1.queryParams).toEqual({})
    expect(result.current.qp2.queryParams).toEqual({})

    act(() => {
      result.current.qp1.setQueryParams({ user: 'John' })
    })
    act(() => {
      result.current.qp2.setQueryParams({ compagny: 'Scaleway' })
    })

    expect(result.current.qp1.queryParams).toEqual({
      compagny: 'Scaleway',
      user: 'John',
    })
    expect(result.current.qp2.queryParams).toEqual({
      compagny: 'Scaleway',
      user: 'John',
    })
  })
})
