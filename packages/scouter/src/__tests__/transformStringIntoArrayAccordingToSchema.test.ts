import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { transformStringIntoArrayAccordingToSchema } from '../helpers/transformStringIntoArrayAccordingToSchema'

describe(transformStringIntoArrayAccordingToSchema, () => {
  it('wraps a single string value in an array for an array field', () => {
    const result = transformStringIntoArrayAccordingToSchema({
      schema: z.object({ tags: z.array(z.string()) }),
      values: { tags: 'admin' },
    })

    expect(result).toStrictEqual({ tags: ['admin'] })
  })

  it('wraps a single string value in an array for an optional array field', () => {
    const result = transformStringIntoArrayAccordingToSchema({
      schema: z.object({ tags: z.array(z.string()).optional() }),
      values: { tags: 'admin' },
    })

    expect(result).toStrictEqual({ tags: ['admin'] })
  })

  it('leaves an already array value untouched for an array field', () => {
    const result = transformStringIntoArrayAccordingToSchema({
      schema: z.object({ tags: z.array(z.string()) }),
      values: { tags: ['admin', 'user'] },
    })

    expect(result).toStrictEqual({ tags: ['admin', 'user'] })
  })

  it('leaves a string value untouched for a string field', () => {
    const result = transformStringIntoArrayAccordingToSchema({
      schema: z.object({ name: z.string(), age: z.string().optional() }),
      values: { name: 'john', age: '30' },
    })

    expect(result).toStrictEqual({ name: 'john', age: '30' })
  })

  it('wraps an empty string value for an array field', () => {
    const result = transformStringIntoArrayAccordingToSchema({
      schema: z.object({ tags: z.array(z.string()) }),
      values: { tags: '' },
    })

    expect(result).toStrictEqual({ tags: [''] })
  })

  it('keeps undefined values', () => {
    const result = transformStringIntoArrayAccordingToSchema({
      schema: z.object({ tags: z.array(z.string()), name: z.string() }),
      values: { tags: undefined, name: undefined },
    })

    expect(result).toStrictEqual({ tags: undefined, name: undefined })
  })

  it('drops keys that are not present in the schema', () => {
    const result = transformStringIntoArrayAccordingToSchema({
      schema: z.object({ name: z.string() }),
      values: { name: 'john', unknown: 'value', tags: 'admin' },
    })

    expect(result).toStrictEqual({ name: 'john' })
  })

  it('handles a mix of array and non-array fields', () => {
    const result = transformStringIntoArrayAccordingToSchema({
      schema: z.object({
        name: z.string(),
        tags: z.array(z.string()).optional(),
        ids: z.array(z.string()),
      }),
      values: { name: 'john', tags: 'admin', ids: ['1', '2'] },
    })

    expect(result).toStrictEqual({ name: 'john', tags: ['admin'], ids: ['1', '2'] })
  })

  it('returns an empty object when there are no values', () => {
    const result = transformStringIntoArrayAccordingToSchema({
      schema: z.object({ tags: z.array(z.string()) }),
      values: {},
    })

    expect(result).toStrictEqual({})
  })
})
