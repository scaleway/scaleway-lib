// oxlint-disable typescript/no-unsafe-type-assertion typescript/no-unsafe-argument
import { describe, expect, it } from 'vitest'
import { buildQueryString, createRoute, isRoute } from '../helpers/route'

describe('route helpers', () => {
  describe('createRoute', () => {
    it('creates route object', () => {
      const route = createRoute('/users')
      expect(route).toBeDefined()
      expect(typeof route.path).toBe('string')
      expect(typeof route.link).toBe('function')
      expect(typeof route.withQueryParams).toBe('function')
    })

    it('route.path returns path string', () => {
      const route = createRoute('/users/:id')
      expect(route.path).toBe('/users/:id')
    })

    it('route.link generates correct path without params', () => {
      const route = createRoute('/users')
      expect(route.link()).toBe('/users')
    })

    it('route.link with params', () => {
      const route = createRoute('/users/:id')
      expect(route.link({ id: '123' })).toBe('/users/123')
    })

    it('route.link with multiple params', () => {
      const route = createRoute('/users/:userId/posts/:postId')
      expect(route.link({ userId: '123', postId: '456' })).toBe('/users/123/posts/456')
    })

    it('route.link with queryParams', () => {
      const route = createRoute('/users').withQueryParams<{ filter?: string }>()
      expect(route.link(undefined, { filter: 'active' })).toBe('/users?filter=active')
    })

    it('route.link with hash', () => {
      const route = createRoute('/users')
      expect(route.link(undefined, undefined, 'section')).toBe('/users#section')
    })

    it('route.link with params and queryParams and hash', () => {
      const route = createRoute('/users/:id').withQueryParams<{ tab?: string }>()
      expect(route.link({ id: '123' }, { tab: 'profile' }, 'bio')).toBe('/users/123?tab=profile#bio')
    })

    it('route.link with array query params', () => {
      const route = createRoute('/users').withQueryParams<{ tags?: string[] }>()
      const result = route.link(undefined, { tags: ['admin', 'active'] })
      expect(result).toContain('tags=admin')
      expect(result).toContain('tags=active')
    })

    it('route.link handles null/undefined query param values', () => {
      const route = createRoute('/users').withQueryParams<{ filter?: string }>()
      expect(route.link(undefined, {})).toBe('/users')
      expect(route.link(undefined, { filter: undefined })).toBe('/users')
    })

    it('route.link with optional params', () => {
      const route = createRoute('/users/:id?')
      expect(route.link()).toBe('/users')
      expect(route.link({ id: '123' })).toBe('/users/123')
    })

    it('route.link return as is for missing params', () => {
      const route = createRoute('/users/:id')
      // oxlint-disable-next-line typescript/no-explicit-any
      expect(route.link(undefined as any)).toBe('/users/:id')
    })

    it('route.withQueryParams returns new route type', () => {
      const route = createRoute('/users')
      const routeWithQueryParams = route.withQueryParams<{ filter?: string }>()
      expect(routeWithQueryParams.path).toBe('/users')
      expect(typeof routeWithQueryParams.link).toBe('function')
    })
  })

  describe('isRoute', () => {
    it('returns true for route objects', () => {
      const route = createRoute('/users')
      expect(isRoute(route)).toBe(true)
    })

    it('returns false for non-route objects', () => {
      expect(isRoute(null)).toBe(false)
      expect(isRoute(undefined)).toBe(false)
      expect(isRoute({})).toBe(false)
      expect(isRoute({ path: '/users' })).toBe(false)
      expect(isRoute({ link: () => '/users' })).toBe(false)
      expect(isRoute({ path: '/users', link: 'not-a-function' })).toBe(false)
    })

    it('returns true for route-like objects', () => {
      const fakeRoute = {
        path: '/users',
        link: () => '/users',
      }
      expect(isRoute(fakeRoute)).toBe(true)
    })
  })

  describe('buildQueryString', () => {
    it('with string', () => {
      expect(buildQueryString('foo=bar')).toBe('foo=bar')
    })

    it('with object', () => {
      expect(buildQueryString({ foo: 'bar', baz: 'qux' })).toBe('foo=bar&baz=qux')
    })

    it('with array values', () => {
      const result = buildQueryString({ tags: ['admin', 'user'] })
      expect(result).toBe('tags=admin&tags=user')
    })

    it('handles null/undefined values', () => {
      // oxlint-disable-next-line typescript/no-explicit-any
      const result = buildQueryString({ foo: 'bar', baz: null, qux: undefined } as any)
      expect(result).toBe('foo=bar')
    })

    it('handles empty string values', () => {
      const result = buildQueryString({ foo: '' })
      expect(result).toBe('foo=')
    })

    it('encodes special characters', () => {
      const result = buildQueryString({ q: 'hello world' })
      expect(result).toBe('q=hello+world')
    })
  })
})
