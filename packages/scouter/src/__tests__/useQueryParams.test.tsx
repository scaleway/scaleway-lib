// oxlint-disable typescript/no-deprecated
import { act, renderHook } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import { describe, expect, it, vi } from 'vitest'
import { MemoryRouter, Route, useQueryParams } from '../index'
import { Router } from '../Router'

describe('useQueryParams', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <MemoryRouter>
      <Route>{children}</Route>
    </MemoryRouter>
  )

  it('returns queryParams, replaceQueryParams, and setQueryParams', () => {
    const { result } = renderHook(() => useQueryParams(), { wrapper })

    expect(result.current).toHaveProperty('queryParams')
    expect(result.current).toHaveProperty('replaceQueryParams')
    expect(result.current).toHaveProperty('setQueryParams')
    expect(typeof result.current.replaceQueryParams).toBe('function')
    expect(typeof result.current.setQueryParams).toBe('function')
  })

  it('parses query params from URL', () => {
    const { result } = renderHook(() => useQueryParams(), {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={['/test?name=john&age=30']}>
          <Route>{children}</Route>
        </MemoryRouter>
      ),
    })

    expect(result.current.queryParams).toEqual({
      name: 'john',
      age: 30,
    })
  })

  it('parses comma-separated arrays', () => {
    const { result } = renderHook(() => useQueryParams(), {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={['/test?tags=admin,user,mod']}>
          <Route>{children}</Route>
        </MemoryRouter>
      ),
    })

    expect(result.current.queryParams).toEqual({
      tags: ['admin', 'user', 'mod'],
    })
  })

  it('parses boolean values', () => {
    const { result } = renderHook(() => useQueryParams(), {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={['/test?active=true&disabled=false']}>
          <Route>{children}</Route>
        </MemoryRouter>
      ),
    })

    expect(result.current.queryParams).toEqual({
      active: true,
      disabled: false,
    })
  })

  it('parses number values', () => {
    const { result } = renderHook(() => useQueryParams(), {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={['/test?count=42&price=19.99']}>
          <Route>{children}</Route>
        </MemoryRouter>
      ),
    })

    expect(result.current.queryParams).toEqual({
      count: 42,
      price: 19.99,
    })
  })

  it('handles empty query string', () => {
    const { result } = renderHook(() => useQueryParams(), {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={['/test']}>
          <Route>{children}</Route>
        </MemoryRouter>
      ),
    })

    expect(result.current.queryParams).toEqual({})
  })

  it('setQueryParams merges with existing params', () => {
    const { result } = renderHook(() => useQueryParams(), {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={['/test?name=john&age=30']}>
          <Route>{children}</Route>
        </MemoryRouter>
      ),
    })

    act(() => {
      result.current.setQueryParams({ age: 31, city: 'paris' })
    })

    expect(result.current.queryParams).toEqual({
      name: 'john',
      age: 31,
      city: 'paris',
    })
  })

  it('replaceQueryParams replaces all params', () => {
    const { result } = renderHook(() => useQueryParams(), {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={['/test?name=john&age=30']}>
          <Route>{children}</Route>
        </MemoryRouter>
      ),
    })

    act(() => {
      result.current.replaceQueryParams({ city: 'paris' })
    })

    expect(result.current.queryParams).toEqual({
      city: 'paris',
    })
  })

  it('push option uses history.push', () => {
    const history = createMemoryHistory({ initialEntries: ['/test?name=john'] })
    const pushSpy = vi.spyOn(history, 'push')
    const replaceSpy = vi.spyOn(history, 'replace')

    const { result } = renderHook(() => useQueryParams(), {
      wrapper: ({ children }) => (
        <Router history={history}>
          <Route>{children}</Route>
        </Router>
      ),
    })

    act(() => {
      result.current.setQueryParams({ name: 'jane' }, { push: true })
    })

    expect(pushSpy).toHaveBeenCalled()
    expect(replaceSpy).not.toHaveBeenCalled()
  })

  it('default option uses history.replace', () => {
    const history = createMemoryHistory({ initialEntries: ['/test?name=john'] })
    const pushSpy = vi.spyOn(history, 'push')
    const replaceSpy = vi.spyOn(history, 'replace')

    const { result } = renderHook(() => useQueryParams(), {
      wrapper: ({ children }) => (
        <Router history={history}>
          <Route>{children}</Route>
        </Router>
      ),
    })

    act(() => {
      result.current.setQueryParams({ name: 'jane' })
    })

    expect(replaceSpy).toHaveBeenCalled()
    expect(pushSpy).not.toHaveBeenCalled()
  })

  it('does not update URL when params have not changed', () => {
    const history = createMemoryHistory({ initialEntries: ['/test?name=john'] })
    const pushSpy = vi.spyOn(history, 'push')
    const replaceSpy = vi.spyOn(history, 'replace')

    const { result } = renderHook(() => useQueryParams(), {
      wrapper: ({ children }) => (
        <Router history={history}>
          <Route>{children}</Route>
        </Router>
      ),
    })

    act(() => {
      result.current.setQueryParams({ name: 'john' })
    })

    expect(pushSpy).not.toHaveBeenCalled()
    expect(replaceSpy).not.toHaveBeenCalled()
  })

  it('handles null values by omitting them', () => {
    const { result } = renderHook(() => useQueryParams(), {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={['/test?name=john']}>
          <Route>{children}</Route>
        </MemoryRouter>
      ),
    })

    act(() => {
      result.current.setQueryParams({ name: null })
    })

    expect(result.current.queryParams).toEqual({})
  })

  it('handles undefined values by omitting them', () => {
    const { result } = renderHook(() => useQueryParams(), {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={['/test?name=john']}>
          <Route>{children}</Route>
        </MemoryRouter>
      ),
    })

    act(() => {
      result.current.setQueryParams({ name: undefined })
    })

    expect(result.current.queryParams).toEqual({})
  })

  it('updates when location changes', () => {
    const { result } = renderHook(() => useQueryParams(), {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={['/test?name=john']}>
          <Route>{children}</Route>
        </MemoryRouter>
      ),
    })

    expect(result.current.queryParams['name']).toBe('john')

    act(() => {
      result.current.setQueryParams({ name: 'jane' })
    })

    expect(result.current.queryParams['name']).toBe('jane')
  })

  it('handles array params correctly', () => {
    const { result } = renderHook(() => useQueryParams(), {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={['/test?tags=admin']}>
          <Route>{children}</Route>
        </MemoryRouter>
      ),
    })

    act(() => {
      result.current.setQueryParams({ tags: ['admin', 'user'] })
    })

    expect(result.current.queryParams['tags']).toEqual(['admin', 'user'])
  })

  it('setQueryParams with push option', () => {
    const history = createMemoryHistory({ initialEntries: ['/test'] })
    const pushSpy = vi.spyOn(history, 'push')

    const { result } = renderHook(() => useQueryParams(), {
      wrapper: ({ children }) => (
        <Router history={history}>
          <Route>{children}</Route>
        </Router>
      ),
    })

    act(() => {
      result.current.setQueryParams({ name: 'john' }, { push: true })
    })

    expect(pushSpy).toHaveBeenCalledWith('/test?name=john')
  })

  it('replaceQueryParams with push option', () => {
    const history = createMemoryHistory({ initialEntries: ['/test'] })
    const pushSpy = vi.spyOn(history, 'push')

    const { result } = renderHook(() => useQueryParams(), {
      wrapper: ({ children }) => (
        <Router history={history}>
          <Route>{children}</Route>
        </Router>
      ),
    })

    act(() => {
      result.current.replaceQueryParams({ name: 'john' }, { push: true })
    })

    expect(pushSpy).toHaveBeenCalledWith('/test?name=john')
  })

  it('replaceQueryParams with replace option', () => {
    const history = createMemoryHistory({ initialEntries: ['/test'] })
    const replaceSpy = vi.spyOn(history, 'replace')

    const { result } = renderHook(() => useQueryParams(), {
      wrapper: ({ children }) => (
        <Router history={history}>
          <Route>{children}</Route>
        </Router>
      ),
    })

    act(() => {
      result.current.replaceQueryParams({ name: 'john' }, { push: false })
    })

    expect(replaceSpy).toHaveBeenCalledWith('/test?name=john')
  })
})
