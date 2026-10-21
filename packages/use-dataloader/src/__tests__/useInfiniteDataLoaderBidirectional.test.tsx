import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { act } from 'react'
import { describe, expect, it, vi } from 'vitest'
import DataLoaderProvider from '../DataLoaderProvider'
import { useInfiniteDataLoader } from '../useInfiniteDataLoader'

type FakePage = {
  data: string
  nextCursor?: string
  prevCursor?: string
}

// Ordered cursor chain c0..c(count - 1), like a cursor paginated API
const makePages = (count: number): Record<string, FakePage> => {
  const pages: Record<string, FakePage> = {}
  for (let index = 0; index < count; index += 1) {
    pages[`c${index}`] = {
      data: `Page ${index} data`,
      nextCursor: index + 1 < count ? `c${index + 1}` : undefined,
      prevCursor: index > 0 ? `c${index - 1}` : undefined,
    }
  }

  return pages
}

// API resolving pages by the cursor param, each call is manually resolved to control pending states
const makeDeferredApi = (pages: Record<string, FakePage>) => {
  const calls: { params: Record<string, unknown>; resolve: (page: FakePage) => void }[] = []
  const method = vi.fn<(params: Record<string, unknown>) => Promise<FakePage>>(
    async params =>
      new Promise(resolve => {
        calls.push({ params, resolve })
      }),
  )
  const pageForParams = (params: Record<string, unknown>): FakePage | undefined => {
    const cursor = params['cursor'] ?? params['after'] ?? params['before']

    return typeof cursor === 'string' ? pages[cursor] : undefined
  }
  // Resolving an already resolved promise is a no-op, so resolving twice is safe
  const resolveCall = (index: number) => {
    const call = calls[index]
    const page = call ? pageForParams(call.params) : undefined

    if (call && page) {
      call.resolve(page)
    }
  }
  const resolveAll = () => {
    for (const call of calls) {
      const page = pageForParams(call.params)

      if (page) {
        call.resolve(page)
      }
    }
  }

  return { method, resolveAll, resolveCall }
}

const wrapper = ({ children }: { children?: ReactNode }) => <DataLoaderProvider>{children}</DataLoaderProvider>

describe('useInfiniteDataLoader bidirectional', () => {
  it('should fetch the previous page with loadPrevious and prepend it before current data', async () => {
    const pages = makePages(5)
    const { method, resolveCall } = makeDeferredApi(pages)
    const { result } = renderHook(
      () =>
        useInfiniteDataLoader<FakePage, Error, Record<string, unknown>, string>(
          'bi-prepend',
          method,
          { cursor: 'c2' },
          'cursor',
          {
            getNextPage: res => res.nextCursor,
            getPreviousPage: res => res.prevCursor,
          },
        ),
      { wrapper },
    )

    await waitFor(() => {
      expect(result.current.isFetching).toBe(true)
    })
    expect(result.current.isFetchingNextPage).toBe(false)
    expect(result.current.isFetchingPreviousPage).toBe(false)
    resolveCall(0)
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toStrictEqual([pages['c2']])
    expect(result.current.hasNextPage).toBe(true)
    expect(result.current.hasPreviousPage).toBe(true)

    act(() => {
      result.current.loadPrevious()
    })

    expect(result.current.hasPreviousPage).toBe(true)
    expect(result.current.isFetchingPreviousPage).toBe(true)
    expect(result.current.isFetchingNextPage).toBe(false)
    // The pending previous page is not in data yet
    expect(result.current.data).toStrictEqual([pages['c2']])
    expect(method).toHaveBeenCalledWith({ cursor: 'c1' }, expect.anything())
    resolveCall(1)
    await waitFor(() => {
      expect(result.current.isFetchingPreviousPage).toBe(false)
    })

    // Previous pages are prepended before current ones
    expect(result.current.data).toStrictEqual([pages['c1'], pages['c2']])

    act(() => {
      result.current.loadPrevious()
    })
    expect(method).toHaveBeenCalledWith({ cursor: 'c0' }, expect.anything())
    resolveCall(2)
    await waitFor(() => {
      expect(result.current.data).toStrictEqual([pages['c0'], pages['c1'], pages['c2']])
    })

    // c0 is the first page, and the forward tail is unchanged
    expect(result.current.hasPreviousPage).toBe(false)
    expect(result.current.hasNextPage).toBe(true)
  })

  it('should not expose hasPreviousPage nor fetch previous pages without getPreviousPage', async () => {
    const pages = makePages(5)
    const { method, resolveCall } = makeDeferredApi(pages)
    const { result } = renderHook(
      () =>
        useInfiniteDataLoader<FakePage, Error, Record<string, unknown>, string>(
          'bi-no-config',
          method,
          { cursor: 'c2' },
          'cursor',
          {
            getNextPage: res => res.nextCursor,
          },
        ),
      { wrapper },
    )

    resolveCall(0)
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.hasPreviousPage).toBe(false)

    act(() => {
      result.current.loadPrevious()
    })

    // loadPrevious is a no-op without getPreviousPage
    expect(method).toHaveBeenCalledTimes(1)
    expect(result.current.isFetching).toBe(false)
    expect(result.current.data).toStrictEqual([pages['c2']])
  })

  it('should expose which direction is currently fetching', async () => {
    const pages = makePages(5)
    const { method, resolveAll, resolveCall } = makeDeferredApi(pages)
    const { result } = renderHook(
      () =>
        useInfiniteDataLoader<FakePage, Error, Record<string, unknown>, string>(
          'bi-direction',
          method,
          { cursor: 'c2' },
          'cursor',
          {
            getNextPage: res => res.nextCursor,
            getPreviousPage: res => res.prevCursor,
          },
        ),
      { wrapper },
    )

    // Initial fetch has no direction
    await waitFor(() => {
      expect(result.current.isFetching).toBe(true)
    })
    expect(result.current.isFetchingNextPage).toBe(false)
    expect(result.current.isFetchingPreviousPage).toBe(false)
    resolveCall(0)
    await waitFor(() => {
      expect(result.current.isFetching).toBe(false)
    })

    act(() => {
      result.current.loadMore()
    })
    expect(result.current.isFetchingNextPage).toBe(true)
    expect(result.current.isFetchingPreviousPage).toBe(false)
    expect(result.current.isLoading).toBe(false)
    resolveCall(1)
    await waitFor(() => {
      expect(result.current.isFetchingNextPage).toBe(false)
    })

    act(() => {
      result.current.loadPrevious()
    })
    expect(result.current.isFetchingPreviousPage).toBe(true)
    expect(result.current.isFetchingNextPage).toBe(false)
    resolveAll()
    await waitFor(() => {
      expect(result.current.isFetching).toBe(false)
    })
  })

  it('should trim pages outside maxPages like a sliding window and reuse cached ones', async () => {
    const pages = makePages(5)
    const { method, resolveCall } = makeDeferredApi(pages)
    const { result } = renderHook(
      () =>
        useInfiniteDataLoader<FakePage, Error, Record<string, unknown>, string>(
          'bi-max-pages',
          method,
          { cursor: 'c2' },
          'cursor',
          {
            dataLifetime: 10_000,
            maxPages: 2,
            getNextPage: res => res.nextCursor,
            getPreviousPage: res => res.prevCursor,
          },
        ),
      { wrapper },
    )

    resolveCall(0)
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
    expect(result.current.data).toStrictEqual([pages['c2']])

    act(() => {
      result.current.loadMore()
    })
    resolveCall(1)
    await waitFor(() => {
      expect(result.current.data).toStrictEqual([pages['c2'], pages['c3']])
    })

    // Window is full, fetching forward trims the oldest page
    act(() => {
      result.current.loadMore()
    })
    resolveCall(2)
    await waitFor(() => {
      expect(result.current.data).toStrictEqual([pages['c3'], pages['c4']])
    })

    // The previous page c2 is still in cache within dataLifetime, so it is reused without a new request
    act(() => {
      result.current.loadPrevious()
    })
    expect(result.current.data).toStrictEqual([pages['c2'], pages['c3']])
    expect(method).toHaveBeenCalledTimes(3)

    // c1 was never fetched, so it is requested and the window slides again
    act(() => {
      result.current.loadPrevious()
    })
    expect(method).toHaveBeenCalledWith({ cursor: 'c1' }, expect.anything())
    resolveCall(3)
    await waitFor(() => {
      expect(result.current.data).toStrictEqual([pages['c1'], pages['c2']])
    })
  })

  it('should send the previous token under previousPageParamKey and omit pageParamKey', async () => {
    const pages = makePages(5)
    const { method, resolveCall } = makeDeferredApi(pages)
    const { result } = renderHook(
      () =>
        useInfiniteDataLoader<FakePage, Error, Record<string, unknown>, string>(
          'bi-dual-key',
          method,
          { after: 'c2' },
          'after',
          {
            getNextPage: res => res.nextCursor,
            getPreviousPage: res => res.prevCursor,
            previousPageParamKey: 'before',
          },
        ),
      { wrapper },
    )

    resolveCall(0)
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
    expect(method).toHaveBeenCalledWith({ after: 'c2' }, expect.anything())
    expect(result.current.hasPreviousPage).toBe(true)

    act(() => {
      result.current.loadMore()
    })
    expect(method).toHaveBeenCalledWith({ after: 'c3' }, expect.anything())
    resolveCall(1)
    await waitFor(() => {
      expect(result.current.data).toStrictEqual([pages['c2'], pages['c3']])
    })

    act(() => {
      result.current.loadPrevious()
    })
    // The previous token goes under `before` and `after` is omitted, two-token APIs reject both at once
    expect(method).toHaveBeenCalledWith({ before: 'c1' }, expect.anything())
    resolveCall(2)
    await waitFor(() => {
      expect(result.current.data).toStrictEqual([pages['c1'], pages['c2'], pages['c3']])
    })
    expect(result.current.hasNextPage).toBe(true)
    expect(result.current.hasPreviousPage).toBe(true)
  })

  it('should append forward pages after loadPrevious fetched ones', async () => {
    const pages = makePages(5)
    const { method, resolveCall } = makeDeferredApi(pages)
    const { result } = renderHook(
      () =>
        useInfiniteDataLoader<FakePage, Error, Record<string, unknown>, string>(
          'bi-forward-after-previous',
          method,
          { cursor: 'c2' },
          'cursor',
          {
            getNextPage: res => res.nextCursor,
            getPreviousPage: res => res.prevCursor,
          },
        ),
      { wrapper },
    )

    resolveCall(0)
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    act(() => {
      result.current.loadPrevious()
    })
    resolveCall(1)
    await waitFor(() => {
      expect(result.current.data).toStrictEqual([pages['c1'], pages['c2']])
    })

    // After a backward navigation, loadMore targets the page after the last loaded one
    act(() => {
      result.current.loadMore()
    })
    expect(result.current.isFetchingNextPage).toBe(true)
    expect(result.current.isFetchingPreviousPage).toBe(false)
    expect(method).toHaveBeenCalledWith({ cursor: 'c3' }, expect.anything())
    resolveCall(2)
    await waitFor(() => {
      expect(result.current.data).toStrictEqual([pages['c1'], pages['c2'], pages['c3']])
    })
    expect(result.current.hasPreviousPage).toBe(true)
    expect(result.current.hasNextPage).toBe(true)
  })

  it('should reset stacked previous pages when baseKey changes', async () => {
    const pages = makePages(5)
    const { method, resolveCall } = makeDeferredApi(pages)
    const initialProps = {
      baseParams: { cursor: 'c2' } as Record<string, unknown>,
      key: 'bi-key-change',
    }
    const { result, rerender } = renderHook(
      props =>
        useInfiniteDataLoader<FakePage, Error, Record<string, unknown>, string>(
          props.key,
          method,
          props.baseParams,
          'cursor',
          {
            getNextPage: res => res.nextCursor,
            getPreviousPage: res => res.prevCursor,
          },
        ),
      { initialProps, wrapper },
    )

    resolveCall(0)
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    act(() => {
      result.current.loadPrevious()
    })
    resolveCall(1)
    await waitFor(() => {
      expect(result.current.data).toStrictEqual([pages['c1'], pages['c2']])
    })

    rerender({ baseParams: { cursor: 'c3' }, key: 'bi-key-change-new' })

    // Previous pages of the old key are dropped, only the new first page remains
    await waitFor(() => {
      expect(result.current.isFetching).toBe(true)
    })
    resolveCall(2)
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
    expect(result.current.data).toStrictEqual([pages['c3']])

    // loadPrevious now targets the new key first page, not the old stacked ones
    act(() => {
      result.current.loadPrevious()
    })
    expect(method).toHaveBeenCalledWith({ cursor: 'c2' }, expect.anything())
    resolveCall(3)
    await waitFor(() => {
      expect(result.current.data).toStrictEqual([pages['c2'], pages['c3']])
    })
  })

  it('should reload all loaded pages including previous ones without direction', async () => {
    const pages = makePages(5)
    const { method, resolveAll, resolveCall } = makeDeferredApi(pages)
    const { result } = renderHook(
      () =>
        useInfiniteDataLoader<FakePage, Error, Record<string, unknown>, string>(
          'bi-reload',
          method,
          { cursor: 'c2' },
          'cursor',
          {
            getNextPage: res => res.nextCursor,
            getPreviousPage: res => res.prevCursor,
          },
        ),
      { wrapper },
    )

    resolveCall(0)
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    act(() => {
      result.current.loadPrevious()
    })
    resolveCall(1)
    await waitFor(() => {
      expect(result.current.data).toStrictEqual([pages['c1'], pages['c2']])
    })

    const callsBeforeReload = method.mock.calls.length
    act(() => {
      result.current.reload().catch(() => undefined)
    })
    await waitFor(() => {
      expect(result.current.isFetching).toBe(true)
    })
    // A refetch has no direction, like React Query
    expect(result.current.isFetchingNextPage).toBe(false)
    expect(result.current.isFetchingPreviousPage).toBe(false)

    // Every loaded page is reloaded with its own params, previous ones included
    await waitFor(() => {
      expect(method).toHaveBeenCalledTimes(callsBeforeReload + 2)
    })
    expect(method).toHaveBeenCalledWith({ cursor: 'c1' }, expect.anything())
    expect(method).toHaveBeenCalledWith({ cursor: 'c2' }, expect.anything())
    resolveAll()
    await waitFor(() => {
      expect(result.current.isFetching).toBe(false)
    })

    // Order is preserved after reload
    expect(result.current.data).toStrictEqual([pages['c1'], pages['c2']])
    expect(result.current.hasNextPage).toBe(true)
    expect(result.current.hasPreviousPage).toBe(true)
  })
})
