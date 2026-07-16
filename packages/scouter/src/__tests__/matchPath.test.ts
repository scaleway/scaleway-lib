import { describe, expect, it } from 'vitest'
import type { MaybeMatch } from '../matchPath'
import { matchPath, matchPaths } from '../matchPath'

describe('matchPath', () => {
  describe('without path property on params', () => {
    it("doesn't throw an exception", () => {
      expect(() => {
        matchPath('/milkyway/eridani', 'foo')
      }).not.toThrow()
    })
  })

  describe('with path=""', () => {
    it('returns correct url at "/"', () => {
      const path = ''
      const pathname = '/'
      const match = matchPath(pathname, path)
      expect(match).toBeNull()
    })

    it('returns correct url at "/somewhere/else"', () => {
      const path = ''
      const pathname = '/somewhere/else'
      const match = matchPath(pathname, path)
      expect(match).toBeNull()
    })
  })

  describe('with path="/"', () => {
    it('returns correct url at "/"', () => {
      const path = '/'
      const pathname = '/'
      const match = matchPath(pathname, path)
      expect(match).not.toBeNull()
    })

    it('returns correct url at "/somewhere/else"', () => {
      const path = '/'
      const pathname = '/somewhere/else'
      const match = matchPath(pathname, path)
      expect(match).not.toBeNull()
    })
  })

  describe('with path="/somewhere"', () => {
    it('returns correct url at "/somewhere"', () => {
      const path = '/somewhere'
      const pathname = '/somewhere'
      const match = matchPath(pathname, path)
      expect(match).not.toBeNull()
    })

    it('returns correct url at "/somewhere/else"', () => {
      const path = '/somewhere'
      const pathname = '/somewhere/else'
      const match = matchPath(pathname, path)
      expect(match).not.toBeNull()
    })
  })

  describe('path is case insensitive', () => {
    it('returns non-sensitive url', () => {
      const path = '/SomeWhere'
      const pathname = '/somewhere'
      const match = matchPath(pathname, path)
      expect(match).not.toBeNull()
    })

    it('returns non-sensitive url with exact', () => {
      const path = '/SomeWhere'
      const pathname = '/somewhere'
      const match = matchPath(pathname, path, { exact: true })
      expect(match).not.toBeNull()
    })
  })

  describe('exact option', () => {
    it('matches exact when exact=true', () => {
      const path = '/test'
      const pathname = '/test'
      const match = matchPath(pathname, path, { exact: true })
      expect(match).not.toBeNull()
      expect(match?.isExact).toBe(true)
    })

    it('does not match exact when pathname has extra segments', () => {
      const path = '/test'
      const pathname = '/test/extra'
      const match = matchPath(pathname, path, { exact: true })
      expect(match).toBeNull()
    })

    it('matches loose when exact=false', () => {
      const path = '/test'
      const pathname = '/test/extra'
      const match = matchPath(pathname, path, { exact: false })
      expect(match).not.toBeNull()
      expect(match?.isExact).toBe(false)
    })
  })

  describe('params extraction', () => {
    it('extracts dynamic params', () => {
      const path = '/users/:id'
      const pathname = '/users/123'
      const match = matchPath(pathname, path)
      expect(match).not.toBeNull()
      expect(match?.params).toEqual({ id: '123' })
    })

    it('extracts multiple dynamic params', () => {
      const path = '/users/:userId/posts/:postId'
      const pathname = '/users/123/posts/456'
      const match = matchPath(pathname, path)
      expect(match).not.toBeNull()
      expect(match?.params).toEqual({ userId: '123', postId: '456' })
    })

    it('decodes URL encoded params', () => {
      const path = '/:id'
      const pathname = '/a%20dynamic%20segment'
      const match = matchPath(pathname, path)
      expect(match).not.toBeNull()
      expect(match?.params).toEqual({ id: 'a dynamic segment' })
    })
  })

  describe('null/undefined handling', () => {
    it('returns null when pathname is undefined', () => {
      const match = matchPath(undefined, '/test')
      expect(match).toBeNull()
    })

    it('returns null when route is undefined', () => {
      const match = matchPath('/test', undefined)
      expect(match).toBeNull()
    })
  })
})

describe('matchPaths', () => {
  it('accepts an array as 2nd argument', () => {
    const path = ['/somewhere', '/elsewhere']
    const pathname = '/elsewhere'
    const match = matchPaths(pathname, path)
    expect(match).not.toBeNull()
  })

  it('returns correct url at "/elsewhere"', () => {
    const path = ['/somewhere', '/elsewhere']
    const pathname = '/elsewhere'
    const match = matchPaths(pathname, path)
    expect(match).not.toBeNull()
  })

  it('returns correct url at "/elsewhere/else"', () => {
    const path = ['/somewhere', '/elsewhere']
    const pathname = '/elsewhere/else'
    const match = matchPaths(pathname, path)
    expect(match).not.toBeNull()
  })

  it('returns correct url at "/elsewhere/else" with path "/" in array', () => {
    const path = ['/somewhere', '/']
    const pathname = '/elsewhere/else'
    const match = matchPaths(pathname, path)
    expect(match).not.toBeNull()
  })

  it('returns correct url at "/somewhere" with path "/" in array', () => {
    const path = ['/somewhere', '/']
    const pathname = '/somewhere'
    const match = matchPaths(pathname, path)
    expect(match).not.toBeNull()
  })
})

const TEST_CASES: Record<string, Record<string, MaybeMatch>> = {
  '/': {
    '': null,
    '/': { isExact: true, params: {} },
    '/foo': { isExact: false, params: {} },
    '/foo/': { isExact: false, params: {} },
  },
  '/static': {
    '': null,
    '/': null,
    '/foo': null,
    '/static': { isExact: true, params: {} },
    '/static/': { isExact: true, params: {} },
    '/static/foo': { isExact: false, params: {} },
    '/static/foo/': { isExact: false, params: {} },
    '/static/foo/bar': { isExact: false, params: {} },
  },
  '/users/:id': {
    '': null,
    '/': null,
    '/users': null,
    '/users/': null,
    '/users/123': { isExact: true, params: { id: '123' } },
    '/users/123/': { isExact: true, params: { id: '123' } },
    '/users/123/profile': { isExact: false, params: { id: '123' } },
    '/users/abc': { isExact: true, params: { id: 'abc' } },
    '/users/12345': { isExact: true, params: { id: '12345' } },
  },
  '/users/:userId/posts/:postId': {
    '': null,
    '/': null,
    '/users': null,
    '/users/123': null,
    '/users/123/posts': null,
    '/users/123/posts/': null,
    '/users/123/posts/456': { isExact: true, params: { userId: '123', postId: '456' } },
    '/users/123/posts/456/': { isExact: true, params: { userId: '123', postId: '456' } },
    '/users/123/posts/456/comments': { isExact: false, params: { userId: '123', postId: '456' } },
    '/users/abc/posts/def': { isExact: true, params: { userId: 'abc', postId: 'def' } },
  },
  '/files/*': {
    '': null,
    '/': null,
    '/files': null,
    '/files/': { isExact: true, params: { '*': '' } },
    '/files/document.pdf': { isExact: true, params: { '*': 'document.pdf' } },
    '/files/folder/document.pdf': { isExact: true, params: { '*': 'folder/document.pdf' } },
    '/files/a/b/c': { isExact: true, params: { '*': 'a/b/c' } },
    '/files/a/b/c/': { isExact: true, params: { '*': 'a/b/c/' } },
  },
  '/files/*?': {
    '': null,
    '/': null,
    '/files': { isExact: true, params: {} },
    '/files/': { isExact: true, params: { '*': '' } },
    '/files/foo': { isExact: true, params: { '*': 'foo' } },
    '/files/document.pdf': { isExact: true, params: { '*': 'document.pdf' } },
    '/files/folder/document.pdf': { isExact: true, params: { '*': 'folder/document.pdf' } },
    '/files/a/b/c': { isExact: true, params: { '*': 'a/b/c' } },
    '/files/a/b/c/': { isExact: true, params: { '*': 'a/b/c/' } },
  },
  '/api/:version/:resource': {
    '': null,
    '/': null,
    '/api': null,
    '/api/': null,
    '/api/v1': null,
    '/api/v1/': null,
    '/api/v1/users': { isExact: true, params: { version: 'v1', resource: 'users' } },
    '/api/v2/posts': { isExact: true, params: { version: 'v2', resource: 'posts' } },
    '/api/v1/users/123': { isExact: false, params: { version: 'v1', resource: 'users' } },
  },
  '/:lang/products': {
    '': null,
    '/': null,
    '/products': null,
    '/en/products': { isExact: true, params: { lang: 'en' } },
    '/fr/products': { isExact: true, params: { lang: 'fr' } },
    '/zh-CN/products': { isExact: true, params: { lang: 'zh-CN' } },
    '/en/products/': { isExact: true, params: { lang: 'en' } },
    '/en/products/123': { isExact: false, params: { lang: 'en' } },
  },
  '/movies/:title.(mp4|mov)': {
    '': null,
    '/': null,
    '/movies': null,
    '/movies/narnia': null,
    '/movies/narnia.mp3': null,
    '/movies/narnia.mp4': { isExact: true, params: { title: 'narnia' } },
    '/movies/narnia.mov': { isExact: true, params: { title: 'narnia' } },
    '/movies/goosebumps.mp4': { isExact: true, params: { title: 'goosebumps' } },
    '/movies/test.mp4/extra': { isExact: false, params: { title: 'test' } },
  },
  '/books/:genre/:title?': {
    '': null,
    '/': null,
    '/books': null,
    '/books/': null,
    '/books/horror': { isExact: true, params: { genre: 'horror' } },
    '/books/horror/': { isExact: true, params: { genre: 'horror' } },
    '/books/horror/goosebumps': { isExact: true, params: { genre: 'horror', title: 'goosebumps' } },
    '/books/scifi/dune': { isExact: true, params: { genre: 'scifi', title: 'dune' } },
    '/books/horror/goosebumps/chapter1': { isExact: false, params: { genre: 'horror', title: 'goosebumps' } },
  },
  '/posts/:slug/*': {
    '': null,
    '/': null,
    '/posts': null,
    '/posts/hello': null,
    '/posts/hello/': { isExact: true, params: { slug: 'hello', '*': '' } },
    '/posts/hello/world': { isExact: true, params: { slug: 'hello', '*': 'world' } },
    '/posts/hello/a/b/c': { isExact: true, params: { slug: 'hello', '*': 'a/b/c' } },
  },
  '/posts/:slug/*?': {
    '': null,
    '/': null,
    '/posts': null,
    '/posts/hello': { isExact: true, params: { slug: 'hello' } },
    '/posts/hello/': { isExact: true, params: { slug: 'hello', '*': '' } },
    '/posts/hello/world': { isExact: true, params: { slug: 'hello', '*': 'world' } },
    '/posts/hello/a/b/c': { isExact: true, params: { slug: 'hello', '*': 'a/b/c' } },
  },
  '/optional/:id?': {
    '': null,
    '/': null,
    '/optional': { isExact: true, params: {} },
    '/optional/': { isExact: true, params: {} },
    '/optional/123': { isExact: true, params: { id: '123' } },
    '/optional/abc': { isExact: true, params: { id: 'abc' } },
    '/optional/123/extra': { isExact: false, params: { id: '123' } },
  },
}

describe.each(Object.entries(TEST_CASES))('path "%s"', (path, cases) => {
  it.each(Object.entries(cases))('pathname "%s" returns %o', (pathname, result) => {
    expect(matchPath(pathname, path)).toEqual(result)
  })
})
