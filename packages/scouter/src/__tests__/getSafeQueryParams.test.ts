import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { getSafeQueryParams } from '../helpers/getSafeQueryParams'

describe('getSafeQueryParams', () => {
  const schema = z.object({
    name: z.string().optional(),
    age: z.string().optional(),
    tags: z.array(z.string()).optional(),
  })

  it('with valid params', () => {
    const result = getSafeQueryParams({
      search: '?name=john&age=30',
      schema,
    })

    expect(result.errors).toBeNull()
    expect(result.queryParams).toEqual({
      name: 'john',
      age: '30',
    })
  })

  it('with missing params', () => {
    const result = getSafeQueryParams({
      search: '',
      schema,
    })

    expect(result.errors).toBeNull()
    expect(result.queryParams).toEqual({})
  })

  it('with array params', () => {
    const result = getSafeQueryParams({
      search: '?tags=admin&tags=user',
      schema,
    })

    expect(result.errors).toBeNull()
    expect(result.queryParams).toEqual({
      tags: ['admin', 'user'],
    })
  })

  it('with partial valid params', () => {
    const result = getSafeQueryParams({
      search: '?name=john&invalid=value',
      schema,
    })

    // Invalid params should be filtered out
    expect(result.queryParams).toEqual({
      name: 'john',
    })
  })

  it('removes error keys from result', () => {
    const schemaWithTypes = z.object({
      valid: z.string().optional(),
      invalid: z.number().optional(), // This will fail with string value
    })

    const result = getSafeQueryParams({
      search: '?valid=john&invalid=not-a-number',
      schema: schemaWithTypes,
    })

    // The invalid param should be removed from result
    expect(result.queryParams).toEqual({
      valid: 'john',
    })
  })

  it('returns empty object on complete failure', () => {
    const schemaWithRequired = z.object({
      required: z.string(),
    })

    const result = getSafeQueryParams({
      search: '',
      schema: schemaWithRequired,
    })

    // Should have errors and empty/partial queryParams
    expect(result.errors).toBeDefined()
  })

  it('handles complex schema', () => {
    const complexSchema = z.object({
      search: z.string().optional(),
      page: z.string().optional(),
      limit: z.string().optional(),
      sort: z.string().optional(),
      order: z.string().optional(),
    })

    const result = getSafeQueryParams({
      search: '?search=test&page=1&limit=10&sort=name&order=asc',
      schema: complexSchema,
    })

    expect(result.errors).toBeNull()
    expect(result.queryParams).toEqual({
      search: 'test',
      page: '1',
      limit: '10',
      sort: 'name',
      order: 'asc',
    })
  })

  it('handles multiple validation errors', () => {
    const schemaWithMultipleErrors = z.object({
      valid: z.string().optional(),
      invalid1: z.number().optional(),
      invalid2: z.number().optional(),
    })

    const result = getSafeQueryParams({
      search: '?valid=john&invalid1=not-a-number&invalid2=also-not-a-number',
      schema: schemaWithMultipleErrors,
    })

    expect(result.errors).toBeDefined()
    expect(result.errors).toHaveLength(2)
    expect(result.queryParams).toEqual({
      valid: 'john',
    })
  })

  it('returns empty object when all params fail validation', () => {
    const schemaWithAllInvalid = z.object({
      field1: z.number().optional(),
      field2: z.number().optional(),
    })

    const result = getSafeQueryParams({
      search: '?field1=not-a-number&field2=also-not-a-number',
      schema: schemaWithAllInvalid,
    })

    expect(result.errors).toBeDefined()
    expect(result.queryParams).toEqual({})
  })

  it('handles array validation errors', () => {
    const schemaWithArray = z.object({
      tags: z.array(z.number()).optional(),
    })

    const result = getSafeQueryParams({
      search: '?tags=a&tags=b&tags=c',
      schema: schemaWithArray,
    })

    expect(result.errors).toBeDefined()
    expect(result.queryParams).toEqual({})
  })

  it('handles mixed valid and invalid array items', () => {
    const schemaWithArray = z.object({
      tags: z.array(z.string()).optional(),
      count: z.number().optional(),
    })

    const result = getSafeQueryParams({
      search: '?tags=valid&tags=other&count=not-a-number',
      schema: schemaWithArray,
    })

    expect(result.errors).toBeDefined()
    expect(result.queryParams).toEqual({
      tags: ['valid', 'other'],
    })
  })
})
