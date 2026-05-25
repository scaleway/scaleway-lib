import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { getSafeQueryParams } from '../getSafeQueryParams'

function coerceToArray<Schema extends z.ZodArray<z.ZodTypeAny>>(schema: Schema) {
  // oxlint-disable-next-line no-unsafe-return
  return z.union([z.any().array(), z.any().transform(x => [x])]).pipe(schema)
}

const schema = z.object({
  aString: z.string(),
  aNumber: z.coerce.number(),
  tags: coerceToArray(z.string().array()),
  method: z.enum(['get', 'post']),
})

describe('getsafequeryparams', () => {
  it('should work with simple case', () => {
    expect(
      getSafeQueryParams({
        schema,
        search: 'aString=007&aNumber=007&tags=first&tags=second&method=get',
      }),
    ).toStrictEqual({
      queryParams: {
        aString: '007',
        aNumber: 7,
        tags: ['first', 'second'],
        method: 'get',
      },
      errors: null,
    })
  })

  it('should work with empty search string', () => {
    expect(
      getSafeQueryParams({
        schema,
        search: '',
      }),
    ).toStrictEqual({
      queryParams: {},
      errors: null,
    })
  })

  it('should return partial values', () => {
    expect(
      getSafeQueryParams({
        schema,
        search: 'aString=007&aNumber=007',
      }),
    ).toStrictEqual({
      queryParams: {
        aString: '007',
        aNumber: 7,
      },
      errors: null,
    })
  })

  it('should handle errors, returning only valid values', () => {
    expect(
      getSafeQueryParams({
        schema,
        search: 'aString=007&aNumber=007&tags=first&tags=second&method=unknown',
      }),
    ).toStrictEqual({
      queryParams: {
        aString: '007',
        aNumber: 7,
        tags: ['first', 'second'],
      },
      errors: [
        {
          message: 'Invalid option: expected one of "get"|"post"',
          path: 'method',
        },
      ],
    })
  })
})
