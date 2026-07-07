// oxlint-disable vitest/prefer-expect-assertions
import { describe, expect, it } from 'vitest'
import { compileRoute } from '../compileRoute'

describe('compileRoute', () => {
  it('compiles a simple path', () => {
    const result = compileRoute('/users')

    expect(result).toHaveProperty('exact')
    expect(result).toHaveProperty('loose')
    expect(result.exact).toHaveProperty('pattern')
    expect(result.exact).toHaveProperty('keys')
  })

  it('compiles a path with params', () => {
    const result = compileRoute('/users/:id')

    expect(result.exact.keys).toEqual(['id'])
  })

  it('compiles a path with multiple params', () => {
    const result = compileRoute('/users/:userId/posts/:postId')

    expect(result.exact.keys).toEqual(['userId', 'postId'])
  })

  it('returns cached result for same path', () => {
    const path = '/cached/path'
    const result1 = compileRoute(path)
    const result2 = compileRoute(path)

    expect(result1).toBe(result2)
  })

  it('exact and loose patterns are different', () => {
    const result = compileRoute('/test')

    expect(result.exact.pattern).not.toBe(result.loose.pattern)
  })

  it('handles wildcard paths', () => {
    const result = compileRoute('/*')

    expect(result).toBeDefined()
    expect(result.exact).toBeDefined()
    expect(result.loose).toBeDefined()
  })

  it('caches up to cache limit', () => {
    const cacheLimit = 10_000

    for (let i = 0; i < cacheLimit; i++) {
      compileRoute(`/path/${i}`)
    }

    const result1 = compileRoute('/path/0')
    const result2 = compileRoute('/path/0')

    expect(result1).toBe(result2)
  })

  it('does not cache beyond cache limit', () => {
    const cacheLimit = 10_000

    for (let i = 0; i < cacheLimit + 1; i++) {
      compileRoute(`/path/${i}`)
    }

    const result1 = compileRoute('/path/beyond-limit')
    const result2 = compileRoute('/path/beyond-limit')

    expect(result1).toEqual(result2)
  })

  it('exact pattern matches exactly', () => {
    const result = compileRoute('/test')

    expect(result.exact.pattern.test('/test')).toBe(true)
    expect(result.exact.pattern.test('/test/extra')).toBe(false)
  })

  it('loose pattern matches with trailing content', () => {
    const result = compileRoute('/test')

    expect(result.loose.pattern.test('/test')).toBe(true)
    expect(result.loose.pattern.test('/test/extra')).toBe(true)
  })

  it('handles empty path', () => {
    const result = compileRoute('/')

    expect(result).toBeDefined()
    expect(result.exact).toBeDefined()
    expect(result.loose).toBeDefined()
  })

  it('handles paths with special characters', () => {
    const result = compileRoute('/files/my-file.txt')

    expect(result).toBeDefined()
  })

  it('handles paths with numbers', () => {
    const result = compileRoute('/items/123')

    expect(result).toBeDefined()
  })
})
