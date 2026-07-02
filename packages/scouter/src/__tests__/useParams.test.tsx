import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MemoryRouter, Route, useParams } from '../index'

describe('when the path has no params', () => {
  it('returns an empty object', () => {
    expect.hasAssertions()

    const { result } = renderHook(() => useParams(), {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={['/home']}>
          <Route path="/home">{children}</Route>
        </MemoryRouter>
      ),
    })

    expect(typeof result.current).toBe('object')
    expect(Object.keys(result.current)).toHaveLength(0)
  })
})

describe('when the path has some params', () => {
  it('returns a hash of the URL params and their values', () => {
    expect.hasAssertions()

    const { result } = renderHook(() => useParams(), {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={['/blog/cupcakes']}>
          <Route path="/blog/:slug">{children}</Route>
        </MemoryRouter>
      ),
    })

    expect(typeof result.current).toBe('object')
    expect(result.current).toMatchObject({
      slug: 'cupcakes',
    })
  })

  describe('a child route', () => {
    it('returns a combined hash of the parent and child params', () => {
      expect.hasAssertions()

      const { result } = renderHook(() => useParams(), {
        wrapper: ({ children }) => (
          <MemoryRouter initialEntries={['/users/mjackson/courses/react-router']}>
            <Route path="/users/:username">
              <Route path="/users/:username/courses/:course">{children}</Route>
            </Route>
          </MemoryRouter>
        ),
      })

      expect(typeof result.current).toBe('object')
      expect(result.current).toMatchObject({
        username: 'mjackson',
        course: 'react-router',
      })
    })
  })
})

describe('with typed params', () => {
  it('returns typed params', () => {
    expect.hasAssertions()

    const { result } = renderHook(() => useParams<{ id: string; name: string }>(), {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={['/item/123/john']}>
          <Route path="/item/:id/:name">{children}</Route>
        </MemoryRouter>
      ),
    })

    expect(result.current).toMatchObject({
      id: '123',
      name: 'john',
    })
  })
})

describe('updates when params change', () => {
  it('reflects new params when navigating', () => {
    expect.hasAssertions()

    const { result } = renderHook(() => useParams(), {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={['/user/first']}>
          <Route path="/user/:id">{children}</Route>
        </MemoryRouter>
      ),
    })

    expect(result.current['id']).toBe('first')
  })
})

describe('when match is undefined', () => {
  it('returns empty object when no Route context provides match', () => {
    expect.hasAssertions()

    const { result } = renderHook(() => useParams(), {
      wrapper: ({ children }) => <MemoryRouter initialEntries={['/home']}>{children}</MemoryRouter>,
    })

    expect(result.current).toEqual({})
  })
})
