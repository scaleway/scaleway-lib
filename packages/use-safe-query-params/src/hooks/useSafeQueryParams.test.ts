import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { z } from 'zod'
import { useSafeQueryParams } from './useSafeQueryParams'

function coerceToArray<Schema extends z.ZodArray<z.ZodTypeAny>>(schema: Schema) {
  // oxlint-disable-next-line no-unsafe-return
  return z.union([z.any().array(), z.any().transform(x => [x])]).pipe(schema)
}

const mockHistoryReplace = vi.fn()
vi.mock('react-router-dom', () => ({
  useLocation: vi.fn(() => ({
    search: 'aNumber=007&tags=prod',
  })),
  useHistory: vi.fn(() => ({
    replace: mockHistoryReplace,
  })),
}))

const schema = z.object({
  aNumber: z.coerce.number(),
  tags: coerceToArray(z.string().array()),
})

const { location } = globalThis

describe('usesafequeryparams', () => {
  beforeEach(() => {
    // Allow reset of the url, as globalThis.replaceState is not trully mocked
    // the type force is due to typescript bug
    globalThis.location = location as string & Location
  })

  it('should get queryparams from location', () => {
    const { result } = renderHook(() => useSafeQueryParams({ schema }))

    expect(result.current.queryParams).toStrictEqual({
      aNumber: 7,
      tags: ['prod'],
    })
  })

  it('should handle setqueryparams', () => {
    globalThis.location.search = '?existingParam=test'

    const { result } = renderHook(() => useSafeQueryParams({ schema }))

    result.current.setQueryParams({ aNumber: 10, tags: ['prod', 'staging'] })
    expect(mockHistoryReplace).toHaveBeenCalledWith({
      search: 'existingParam=test&aNumber=10&tags=prod&tags=staging',
    })
  })

  it('should handle setqueryparams without keeping existing values', () => {
    globalThis.location.search = '?existingParam=test'

    const { result } = renderHook(() => useSafeQueryParams({ schema }))

    result.current.setQueryParams({ aNumber: 10, tags: ['prod', 'staging'] }, { keepExisting: false })
    expect(mockHistoryReplace).toHaveBeenCalledWith({
      search: 'aNumber=10&tags=prod&tags=staging',
    })
  })
})
