// use-analytics/src/__tests__/normalizeId.test.ts
import { it, expect, describe } from 'vitest'
import { normalizeId } from '../analytics/normalizeId'

describe('normalizeId', () => {
  it('should return undefined for null or undefined input', () => {
    expect(normalizeId(null)).toBeUndefined()
    expect(normalizeId(undefined)).toBeUndefined()
  })

  it('should return the same string for non-JSON inputs', () => {
    expect(normalizeId('user123')).toBe('user123')
    expect(normalizeId('hello world!')).toBe('hello world!')
  })

  it('should parse valid JSON strings to string', () => {
    expect(normalizeId('"user123"')).toBe('user123')
    expect(normalizeId('"12345"')).toBe('12345')
    expect(normalizeId(String.raw`"\"nested\" string"`)).toBe('"nested" string')
  })

  it('should ignore JSON strings that decode to non-strings', () => {
    expect(normalizeId('{"id": "user123"}')).toBe('{"id": "user123"}')
    expect(normalizeId('[1, 2, 3]')).toBe('[1, 2, 3]')
    expect(normalizeId('123')).toBe('123')
    expect(normalizeId('true')).toBe('true')
  })

  it('should convert numbers to strings', () => {
    expect(normalizeId(12_345)).toBe('12345')
    expect(normalizeId(123e45)).toBe('1.23e+47') // Might vary based on the string conversion
  })

  it('should handle string inputs with special characters', () => {
    expect(normalizeId('user!@#$%^&*()')).toBe('user!@#$%^&*()')
    expect(normalizeId('user"123"')).toBe('user"123"')
  })
})
