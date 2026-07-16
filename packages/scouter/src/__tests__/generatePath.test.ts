// oxlint-disable typescript/no-unsafe-argument typescript/no-unsafe-type-assertion typescript/no-explicit-any
import { describe, expect, it } from 'vitest'
import { generatePath } from '../index'

describe('generatePath', () => {
  it('with no parameters', () => {
    const path = '/test'
    const result = generatePath(path, {})
    expect(result).toBe('/test')
  })

  it('with parameters that match', () => {
    const path = '/users/:id'
    const result = generatePath(path, { id: '123' })
    expect(result).toBe('/users/123')
  })

  it('with multiple parameters', () => {
    const path = '/users/:userId/posts/:postId'
    const result = generatePath(path, { userId: '123', postId: '456' })
    expect(result).toBe('/users/123/posts/456')
  })

  it('with parameters that do not match (return as is)', () => {
    const path = '/users/:id'
    const result = generatePath(path, {} as any)
    expect(result).toBe('/users/:id')
  })

  it('with optional parameters', () => {
    const path = '/users/:id?'
    const result = generatePath(path, {})
    expect(result).toBe('/users')
  })

  it('with optional parameters provided', () => {
    const path = '/users/:id?'
    const result = generatePath(path, { id: '123' })
    expect(result).toBe('/users/123')
  })

  it('with extra parameters (ignores)', () => {
    const path = '/users/:id'
    const result = generatePath(path, { id: '123', extra: 'ignored' } as any)
    expect(result).toBe('/users/123')
  })

  it('with wildcard', () => {
    const path = '/files/*'
    const result = generatePath(path, { '*': 'path/to/file.txt' })
    expect(result).toBe('/files/path/to/file.txt')
  })

  it('with root path', () => {
    const path = '/'
    const result = generatePath(path, {})
    expect(result).toBe('/')
  })

  it('decodes URL encoded parameters', () => {
    const path = '/users/:name'
    const result = generatePath(path, { name: 'john doe' })
    expect(result).toBe('/users/john doe')
  })
})
