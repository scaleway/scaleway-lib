// oxlint-disable typescript/no-explicit-any
import { act, renderHook } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import { describe, expect, it, vi } from 'vitest'
import { z } from 'zod'
import { MemoryRouter, Route, useSafeQueryParams } from '../index'
import { Router } from '../Router'

describe('useSafeQueryParams', () => {
  const schema = z.object({
    name: z.string().optional(),
    age: z.string().optional(),
    tags: z.array(z.string()).optional(),
  })

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <MemoryRouter>
      <Route>{children}</Route>
    </MemoryRouter>
  )

  it('returns queryParams and setQueryParams', () => {
    const { result } = renderHook(() => useSafeQueryParams({ schema }), { wrapper })

    expect(result.current).toHaveProperty('queryParams')
    expect(result.current).toHaveProperty('setQueryParams')
    expect(typeof result.current.setQueryParams).toBe('function')
  })

  it('parses valid query params', () => {
    const { result } = renderHook(() => useSafeQueryParams({ schema }), {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={['/test?name=john&age=30']}>
          <Route>{children}</Route>
        </MemoryRouter>
      ),
    })

    expect(result.current.queryParams).toEqual({
      name: 'john',
      age: '30',
    })
  })

  it('setQueryParams with keepExisting=true (default)', () => {
    const history = createMemoryHistory({
      initialEntries: [
        {
          pathname: '/test',
          search: 'existing=value',
        },
      ],
    })

    const { result } = renderHook(() => useSafeQueryParams({ schema }), {
      wrapper: ({ children }) => (
        <Router history={history}>
          <Route>{children}</Route>
        </Router>
      ),
    })

    act(() => {
      result.current.setQueryParams({ name: 'john' }, { keepExisting: true })
    })

    expect(history.location.search).toContain('existing=value')
    expect(history.location.search).toContain('name=john')
  })

  it('setQueryParams with keepExisting=false', () => {
    const history = createMemoryHistory({ initialEntries: ['/test?existing=value'] })

    const { result } = renderHook(() => useSafeQueryParams({ schema }), {
      wrapper: ({ children }) => (
        <Router history={history}>
          <Route>{children}</Route>
        </Router>
      ),
    })

    act(() => {
      result.current.setQueryParams({ name: 'john' }, { keepExisting: false })
    })

    expect(history.location.search).not.toContain('existing=value')
    expect(history.location.search).toContain('name=john')
  })

  it('setQueryParams with push=true', () => {
    const history = createMemoryHistory({ initialEntries: ['/test'] })
    const pushSpy = vi.spyOn(history, 'push')
    const replaceSpy = vi.spyOn(history, 'replace')

    const { result } = renderHook(() => useSafeQueryParams({ schema }), {
      wrapper: ({ children }) => (
        <Router history={history}>
          <Route>{children}</Route>
        </Router>
      ),
    })

    act(() => {
      result.current.setQueryParams({ name: 'john' }, { push: true })
    })

    expect(pushSpy).toHaveBeenCalled()
    expect(replaceSpy).not.toHaveBeenCalled()
  })

  it('setQueryParams with push=false (default)', () => {
    const history = createMemoryHistory({ initialEntries: ['/test'] })
    const pushSpy = vi.spyOn(history, 'push')
    const replaceSpy = vi.spyOn(history, 'replace')

    const { result } = renderHook(() => useSafeQueryParams({ schema }), {
      wrapper: ({ children }) => (
        <Router history={history}>
          <Route>{children}</Route>
        </Router>
      ),
    })

    act(() => {
      result.current.setQueryParams({ name: 'john' })
    })

    expect(replaceSpy).toHaveBeenCalled()
    expect(pushSpy).not.toHaveBeenCalled()
  })

  it('handles array values in setQueryParams', () => {
    const history = createMemoryHistory({ initialEntries: ['/test'] })

    const arraySchema = z.object({
      tags: z.array(z.string()).optional(),
    })

    const { result } = renderHook(() => useSafeQueryParams({ schema: arraySchema }), {
      wrapper: ({ children }) => (
        <Router history={history}>
          <Route>{children}</Route>
        </Router>
      ),
    })

    act(() => {
      result.current.setQueryParams({ tags: ['admin', 'user'] })
    })

    expect(history.location.search).toContain('tags=admin')
    expect(history.location.search).toContain('tags=user')
  })

  it('handles null values by omitting them', () => {
    const history = createMemoryHistory({ initialEntries: ['/test?name=john'] })

    const { result } = renderHook(() => useSafeQueryParams({ schema }), {
      wrapper: ({ children }) => (
        <Router history={history}>
          <Route>{children}</Route>
        </Router>
      ),
    })

    act(() => {
      // oxlint-disable-next-line typescript/no-unsafe-assignment typescript/no-unsafe-type-assertion
      result.current.setQueryParams({ name: null as any })
    })

    expect(history.location.search).not.toContain('name=')
  })

  it('handles undefined values by omitting them', () => {
    const history = createMemoryHistory({ initialEntries: ['/test?name=john'] })

    const { result } = renderHook(() => useSafeQueryParams({ schema }), {
      wrapper: ({ children }) => (
        <Router history={history}>
          <Route>{children}</Route>
        </Router>
      ),
    })

    act(() => {
      result.current.setQueryParams({ name: undefined })
    })

    expect(history.location.search).not.toContain('name=')
  })

  it('deletes existing key before setting new value', () => {
    const history = createMemoryHistory({ initialEntries: ['/test?name=john'] })

    const { result } = renderHook(() => useSafeQueryParams({ schema }), {
      wrapper: ({ children }) => (
        <Router history={history}>
          <Route>{children}</Route>
        </Router>
      ),
    })

    act(() => {
      result.current.setQueryParams({ name: 'jane' })
    })

    const searchParams = new URLSearchParams(history.location.search)
    const nameValues = searchParams.getAll('name')
    expect(nameValues).toEqual(['jane'])
  })

  it('updates when location changes', () => {
    const { result } = renderHook(() => useSafeQueryParams({ schema }), {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={['/test?name=john']}>
          <Route>{children}</Route>
        </MemoryRouter>
      ),
    })

    expect(result.current.queryParams.name).toBe('john')

    act(() => {
      result.current.setQueryParams({ name: 'jane' })
    })

    expect(result.current.queryParams.name).toBe('jane')
  })

  it('handles empty schema', () => {
    const emptySchema = z.object({})

    const { result } = renderHook(() => useSafeQueryParams({ schema: emptySchema }), {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={['/test?name=john']}>
          <Route>{children}</Route>
        </MemoryRouter>
      ),
    })

    expect(result.current.queryParams).toEqual({})
  })

  it('handles complex nested schema validation', () => {
    const complexSchema = z.object({
      search: z.string().optional(),
      page: z.string().optional(),
      limit: z.string().optional(),
      filters: z.array(z.string()).optional(),
    })

    const { result } = renderHook(() => useSafeQueryParams({ schema: complexSchema }), {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={['/test?search=test&page=1&limit=10&filters=a&filters=b']}>
          <Route>{children}</Route>
        </MemoryRouter>
      ),
    })

    expect(result.current.queryParams).toEqual({
      search: 'test',
      page: '1',
      limit: '10',
      filters: ['a', 'b'],
    })
  })

  it('setQueryParams with all options combined', () => {
    const history = createMemoryHistory({ initialEntries: ['/test?existing=value'] })
    const pushSpy = vi.spyOn(history, 'push')

    const { result } = renderHook(() => useSafeQueryParams({ schema }), {
      wrapper: ({ children }) => (
        <Router history={history}>
          <Route>{children}</Route>
        </Router>
      ),
    })

    act(() => {
      result.current.setQueryParams({ name: 'john' }, { keepExisting: false, push: true })
    })

    expect(pushSpy).toHaveBeenCalled()
    expect(history.location.search).not.toContain('existing=value')
    expect(history.location.search).toContain('name=john')
  })
})
