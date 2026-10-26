// oxlint-disable typescript/no-deprecated
import { createMemoryHistory } from 'history'
import { describe, expect, it, vi } from 'vitest'
import { renderHook } from 'vitest-browser-react'
import { MemoryRouter, Route, useQueryParams } from '../index'
import { Router } from '../Router'

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter>
    <Route>{children}</Route>
  </MemoryRouter>
)

describe(useQueryParams, () => {
  it('returns queryParams, replaceQueryParams, and setQueryParams', async () => {
    const { result } = await renderHook(() => useQueryParams(), { wrapper })

    expect(result.current).toHaveProperty('queryParams')
    expect(result.current).toHaveProperty('replaceQueryParams')
    expect(result.current).toHaveProperty('setQueryParams')
    expect(result.current.replaceQueryParams).toBeTypeOf('function')
    expect(result.current.setQueryParams).toBeTypeOf('function')
  })

  it('parses query params from URL', async () => {
    const { result } = await renderHook(() => useQueryParams(), {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={['/test?name=john&age=30']}>
          <Route>{children}</Route>
        </MemoryRouter>
      ),
    })

    expect(JSON.stringify(result.current.queryParams)).toStrictEqual(
      JSON.stringify({
        age: 30,
        name: 'john',
      }),
    )
  })

  it('parses comma-separated arrays', async () => {
    const { result } = await renderHook(() => useQueryParams(), {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={['/test?tags=admin,user,mod']}>
          <Route>{children}</Route>
        </MemoryRouter>
      ),
    })

    expect(JSON.stringify(result.current.queryParams)).toStrictEqual(
      JSON.stringify({
        tags: ['admin', 'user', 'mod'],
      }),
    )
  })

  it('parses boolean values', async () => {
    const { result } = await renderHook(() => useQueryParams(), {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={['/test?active=true&disabled=false']}>
          <Route>{children}</Route>
        </MemoryRouter>
      ),
    })

    expect(JSON.stringify(result.current.queryParams)).toStrictEqual(
      JSON.stringify({
        active: true,
        disabled: false,
      }),
    )
  })

  it('parses number values', async () => {
    const { result } = await renderHook(() => useQueryParams(), {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={['/test?count=42&price=19.99']}>
          <Route>{children}</Route>
        </MemoryRouter>
      ),
    })

    expect(JSON.stringify(result.current.queryParams)).toStrictEqual(
      JSON.stringify({
        count: 42,
        price: 19.99,
      }),
    )
  })

  it('handles empty query string', async () => {
    const { result } = await renderHook(() => useQueryParams(), {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={['/test']}>
          <Route>{children}</Route>
        </MemoryRouter>
      ),
    })

    expect(JSON.stringify(result.current.queryParams)).toBe('{}')
  })

  it('setQueryParams merges with existing params', async () => {
    const { result, act } = await renderHook(() => useQueryParams(), {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={['/test?name=john&age=30']}>
          <Route>{children}</Route>
        </MemoryRouter>
      ),
    })

    await act(() => {
      result.current.setQueryParams({ age: 31, city: 'paris' })
    })

    expect(JSON.stringify(result.current.queryParams)).toStrictEqual(
      JSON.stringify({
        age: 31,
        city: 'paris',
        name: 'john',
      }),
    )
  })

  it('replaceQueryParams replaces all params', async () => {
    const { result, act } = await renderHook(() => useQueryParams(), {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={['/test?name=john&age=30']}>
          <Route>{children}</Route>
        </MemoryRouter>
      ),
    })

    await act(() => {
      result.current.replaceQueryParams({ city: 'paris' })
    })

    expect(JSON.stringify(result.current.queryParams)).toStrictEqual(
      JSON.stringify({
        city: 'paris',
      }),
    )
  })

  it('push option uses history.push', async () => {
    const history = createMemoryHistory({ initialEntries: ['/test?name=john'] })
    const pushSpy = vi.spyOn(history, 'push')
    const replaceSpy = vi.spyOn(history, 'replace')

    const { result, act } = await renderHook(() => useQueryParams(), {
      wrapper: ({ children }) => (
        <Router history={history}>
          <Route>{children}</Route>
        </Router>
      ),
    })

    await act(() => {
      result.current.setQueryParams({ name: 'jane' }, { push: true })
    })

    expect(pushSpy).toHaveBeenCalledTimes(1)
    expect(replaceSpy).not.toHaveBeenCalledTimes(1)
  })

  it('default option uses history.replace', async () => {
    const history = createMemoryHistory({ initialEntries: ['/test?name=john'] })
    const pushSpy = vi.spyOn(history, 'push')
    const replaceSpy = vi.spyOn(history, 'replace')

    const { result, act } = await renderHook(() => useQueryParams(), {
      wrapper: ({ children }) => (
        <Router history={history}>
          <Route>{children}</Route>
        </Router>
      ),
    })

    await act(() => {
      result.current.setQueryParams({ name: 'jane' })
    })

    expect(replaceSpy).toHaveBeenCalledTimes(1)
    expect(pushSpy).not.toHaveBeenCalledTimes(1)
  })

  it('does not update URL when params have not changed', async () => {
    const history = createMemoryHistory({ initialEntries: ['/test?name=john'] })
    const pushSpy = vi.spyOn(history, 'push')
    const replaceSpy = vi.spyOn(history, 'replace')

    const { result, act } = await renderHook(() => useQueryParams(), {
      wrapper: ({ children }) => (
        <Router history={history}>
          <Route>{children}</Route>
        </Router>
      ),
    })

    await act(() => {
      result.current.setQueryParams({ name: 'john' })
    })

    expect(pushSpy).not.toHaveBeenCalledTimes(1)
    expect(replaceSpy).not.toHaveBeenCalledTimes(1)
  })

  it('handles null values by omitting them', async () => {
    const { result, act } = await renderHook(() => useQueryParams(), {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={['/test?name=john']}>
          <Route>{children}</Route>
        </MemoryRouter>
      ),
    })

    await act(() => {
      result.current.setQueryParams({ name: null })
    })

    expect(JSON.stringify(result.current.queryParams)).toBe('{}')
  })

  it('handles undefined values by omitting them', async () => {
    const { result, act } = await renderHook(() => useQueryParams(), {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={['/test?name=john']}>
          <Route>{children}</Route>
        </MemoryRouter>
      ),
    })

    await act(() => {
      result.current.setQueryParams({ name: undefined })
    })

    expect(JSON.stringify(result.current.queryParams)).toBe('{}')
  })

  it('updates when location changes', async () => {
    const { result, act } = await renderHook(() => useQueryParams(), {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={['/test?name=john']}>
          <Route>{children}</Route>
        </MemoryRouter>
      ),
    })

    expect(result.current.queryParams['name']).toBe('john')

    await act(() => {
      result.current.setQueryParams({ name: 'jane' })
    })

    expect(result.current.queryParams['name']).toBe('jane')
  })

  it('handles array params correctly', async () => {
    const { result, act } = await renderHook(() => useQueryParams(), {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={['/test?tags=admin']}>
          <Route>{children}</Route>
        </MemoryRouter>
      ),
    })

    await act(() => {
      result.current.setQueryParams({ tags: ['admin', 'user'] })
    })

    expect(result.current.queryParams['tags']).toStrictEqual(['admin', 'user'])
  })

  it('setQueryParams with push option', async () => {
    const history = createMemoryHistory({ initialEntries: ['/test'] })
    const pushSpy = vi.spyOn(history, 'push')

    const { result, act } = await renderHook(() => useQueryParams(), {
      wrapper: ({ children }) => (
        <Router history={history}>
          <Route>{children}</Route>
        </Router>
      ),
    })

    await act(() => {
      result.current.setQueryParams({ name: 'john' }, { push: true })
    })

    expect(pushSpy).toHaveBeenCalledWith('/test?name=john')
  })

  it('replaceQueryParams with push option', async () => {
    const history = createMemoryHistory({ initialEntries: ['/test'] })
    const pushSpy = vi.spyOn(history, 'push')

    const { result, act } = await renderHook(() => useQueryParams(), {
      wrapper: ({ children }) => (
        <Router history={history}>
          <Route>{children}</Route>
        </Router>
      ),
    })

    await act(() => {
      result.current.replaceQueryParams({ name: 'john' }, { push: true })
    })

    expect(pushSpy).toHaveBeenCalledWith('/test?name=john')
  })

  it('replaceQueryParams with replace option', async () => {
    const history = createMemoryHistory({ initialEntries: ['/test'] })
    const replaceSpy = vi.spyOn(history, 'replace')

    const { result, act } = await renderHook(() => useQueryParams(), {
      wrapper: ({ children }) => (
        <Router history={history}>
          <Route>{children}</Route>
        </Router>
      ),
    })

    await act(() => {
      result.current.replaceQueryParams({ name: 'john' }, { push: false })
    })

    expect(replaceSpy).toHaveBeenCalledWith('/test?name=john')
  })
})
