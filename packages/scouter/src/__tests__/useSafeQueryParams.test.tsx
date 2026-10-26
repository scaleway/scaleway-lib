import { createMemoryHistory } from 'history'
import { describe, expect, it, vi } from 'vitest'
import { renderHook } from 'vitest-browser-react'
import { z } from 'zod'
import { MemoryRouter, Route, useSafeQueryParams } from '../index'
import { Router } from '../Router'

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter>
    <Route>{children}</Route>
  </MemoryRouter>
)

describe(useSafeQueryParams, () => {
  const schema = z.object({
    name: z.string().optional(),
    age: z.string().optional(),
    tags: z.array(z.string()).optional(),
  })

  it('returns queryParams and setQueryParams', async () => {
    const { result } = await renderHook(() => useSafeQueryParams({ schema }), { wrapper })

    expect(result.current).toHaveProperty('queryParams')
    expect(result.current).toHaveProperty('setQueryParams')
    expect(result.current.setQueryParams).toBeTypeOf('function')
  })

  it('parses valid query params', async () => {
    const { result } = await renderHook(() => useSafeQueryParams({ schema }), {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={['/test?name=john&age=30']}>
          <Route>{children}</Route>
        </MemoryRouter>
      ),
    })

    expect(result.current.queryParams).toStrictEqual({
      name: 'john',
      age: '30',
    })
  })

  it('setQueryParams with keepExisting=true (default)', async () => {
    const history = createMemoryHistory({
      initialEntries: [
        {
          pathname: '/test',
          search: 'existing=value',
        },
      ],
    })

    const { result, act } = await renderHook(() => useSafeQueryParams({ schema }), {
      wrapper: ({ children }) => (
        <Router history={history}>
          <Route>{children}</Route>
        </Router>
      ),
    })

    await act(() => {
      result.current.setQueryParams({ name: 'john' }, { keepExisting: true })
    })

    expect(history.location.search).toContain('existing=value')
    expect(history.location.search).toContain('name=john')
  })

  it('setQueryParams with keepExisting=false', async () => {
    const history = createMemoryHistory({ initialEntries: ['/test?existing=value'] })

    const { result, act } = await renderHook(() => useSafeQueryParams({ schema }), {
      wrapper: ({ children }) => (
        <Router history={history}>
          <Route>{children}</Route>
        </Router>
      ),
    })

    await act(() => {
      result.current.setQueryParams({ name: 'john' }, { keepExisting: false })
    })

    expect(history.location.search).not.toContain('existing=value')
    expect(history.location.search).toContain('name=john')
  })

  it('setQueryParams with push=true', async () => {
    const history = createMemoryHistory({ initialEntries: ['/test'] })
    const pushSpy = vi.spyOn(history, 'push')
    const replaceSpy = vi.spyOn(history, 'replace')

    const { result, act } = await renderHook(() => useSafeQueryParams({ schema }), {
      wrapper: ({ children }) => (
        <Router history={history}>
          <Route>{children}</Route>
        </Router>
      ),
    })

    await act(() => {
      result.current.setQueryParams({ name: 'john' }, { push: true })
    })

    expect(pushSpy).toHaveBeenCalledTimes(1)
    expect(replaceSpy).not.toHaveBeenCalledTimes(1)
  })

  it('setQueryParams with push=false (default)', async () => {
    const history = createMemoryHistory({ initialEntries: ['/test'] })
    const pushSpy = vi.spyOn(history, 'push')
    const replaceSpy = vi.spyOn(history, 'replace')

    const { result, act } = await renderHook(() => useSafeQueryParams({ schema }), {
      wrapper: ({ children }) => (
        <Router history={history}>
          <Route>{children}</Route>
        </Router>
      ),
    })

    await act(() => {
      result.current.setQueryParams({ name: 'john' })
    })

    expect(replaceSpy).toHaveBeenCalledTimes(1)
    expect(pushSpy).not.toHaveBeenCalledTimes(1)
  })

  it('handles array values in setQueryParams', async () => {
    const history = createMemoryHistory({ initialEntries: ['/test'] })

    const arraySchema = z.object({
      tags: z.array(z.string()).optional(),
    })

    const { result, act } = await renderHook(() => useSafeQueryParams({ schema: arraySchema }), {
      wrapper: ({ children }) => (
        <Router history={history}>
          <Route>{children}</Route>
        </Router>
      ),
    })

    await act(() => {
      result.current.setQueryParams({ tags: ['admin', 'user'] })
    })

    expect(history.location.search).toContain('tags=admin')
    expect(history.location.search).toContain('tags=user')
  })

  it('handles null values by omitting them', async () => {
    const history = createMemoryHistory({ initialEntries: ['/test?name=john'] })

    const { result, act } = await renderHook(() => useSafeQueryParams({ schema }), {
      wrapper: ({ children }) => (
        <Router history={history}>
          <Route>{children}</Route>
        </Router>
      ),
    })

    await act(() => {
      // @ts-expect-error we try with null
      result.current.setQueryParams({ name: null })
    })

    expect(history.location.search).not.toContain('name=')
  })

  it('handles undefined values by omitting them', async () => {
    const history = createMemoryHistory({ initialEntries: ['/test?name=john'] })

    const { result, act } = await renderHook(() => useSafeQueryParams({ schema }), {
      wrapper: ({ children }) => (
        <Router history={history}>
          <Route>{children}</Route>
        </Router>
      ),
    })

    await act(() => {
      result.current.setQueryParams({ name: undefined })
    })

    expect(history.location.search).not.toContain('name=')
  })

  it('deletes existing key before setting new value', async () => {
    const history = createMemoryHistory({ initialEntries: ['/test?name=john'] })

    const { result, act } = await renderHook(() => useSafeQueryParams({ schema }), {
      wrapper: ({ children }) => (
        <Router history={history}>
          <Route>{children}</Route>
        </Router>
      ),
    })

    await act(() => {
      result.current.setQueryParams({ name: 'jane' })
    })

    const searchParams = new URLSearchParams(history.location.search)
    const nameValues = searchParams.getAll('name')
    expect(nameValues).toStrictEqual(['jane'])
  })

  it('updates when location changes', async () => {
    const { result, act } = await renderHook(() => useSafeQueryParams({ schema }), {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={['/test?name=john']}>
          <Route>{children}</Route>
        </MemoryRouter>
      ),
    })

    expect(result.current.queryParams.name).toBe('john')

    await act(() => {
      result.current.setQueryParams({ name: 'jane' })
    })

    expect(result.current.queryParams.name).toBe('jane')
  })

  it('handles empty schema', async () => {
    const emptySchema = z.object({})

    const { result } = await renderHook(() => useSafeQueryParams({ schema: emptySchema }), {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={['/test?name=john']}>
          <Route>{children}</Route>
        </MemoryRouter>
      ),
    })

    expect(result.current.queryParams).toStrictEqual({})
  })

  it('handles complex nested schema validation', async () => {
    const complexSchema = z.object({
      search: z.string().optional(),
      page: z.string().optional(),
      limit: z.string().optional(),
      filters: z.array(z.string()).optional(),
    })

    const { result } = await renderHook(() => useSafeQueryParams({ schema: complexSchema }), {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={['/test?search=test&page=1&limit=10&filters=a&filters=b']}>
          <Route>{children}</Route>
        </MemoryRouter>
      ),
    })

    expect(result.current.queryParams).toStrictEqual({
      search: 'test',
      page: '1',
      limit: '10',
      filters: ['a', 'b'],
    })
  })

  it('setQueryParams with all options combined', async () => {
    const history = createMemoryHistory({ initialEntries: ['/test?existing=value'] })
    const pushSpy = vi.spyOn(history, 'push')

    const { result, act } = await renderHook(() => useSafeQueryParams({ schema }), {
      wrapper: ({ children }) => (
        <Router history={history}>
          <Route>{children}</Route>
        </Router>
      ),
    })

    await act(() => {
      result.current.setQueryParams({ name: 'john' }, { keepExisting: false, push: true })
    })

    expect(pushSpy).toHaveBeenCalledTimes(1)
    expect(history.location.search).not.toContain('existing=value')
    expect(history.location.search).toContain('name=john')
  })
})
