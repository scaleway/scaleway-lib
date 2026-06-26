// oxlint-disable eslint/max-statements
//
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { act } from 'react'
import { describe, expect, it, vi } from 'vitest'
import DataLoaderProvider from '../DataLoaderProvider'
import type { UseInfiniteDataLoaderConfig } from '../types'
import { useInfiniteDataLoader } from '../useInfiniteDataLoader'

const config: UseInfiniteDataLoaderConfig<{ nextPage: number; data: string }, Error, { page: number }, 'page'> = {
  enabled: true,
  getNextPage: result => result.nextPage,
}

const getPrerequisite = (key: string) => {
  let counter = 1
  let canResolve = false
  const getNextData = vi.fn(
    async () =>
      new Promise<{ nextPage: number; data: string }>(resolve => {
        const resolvePromise = () => {
          if (canResolve) {
            counter += 1
            resolve({ data: `Page ${counter - 1} data`, nextPage: counter })
          } else {
            setTimeout(() => {
              resolvePromise()
            }, 100)
          }
        }

        resolvePromise()
      }),
  )

  return {
    canResolve,
    counter,
    initialProps: {
      baseParams: {
        page: 1,
      },
      config: {
        enabled: true,
      },
      key,
      method: getNextData,
    },
    resetCounter: () => {
      counter = 1
    },
    setCanResolve: (newState: boolean) => {
      canResolve = newState
    },
  }
}
const wrapper = ({ children }: { children?: ReactNode }) => <DataLoaderProvider>{children}</DataLoaderProvider>
const wrapperWithLifetime =
  (lifetime: number) =>
  ({ children }: { children?: ReactNode }) => (
    <DataLoaderProvider defaultDatalifetime={lifetime}>{children}</DataLoaderProvider>
  )

describe('useInfinitDataLoader', () => {
  it('should get the first page on mount while enabled', async () => {
    const { setCanResolve, initialProps } = getPrerequisite('test1')
    const { result } = renderHook(
      props => useInfiniteDataLoader(props.key, props.method, props.baseParams, 'page', config),
      {
        initialProps,
        wrapper,
      },
    )
    expect(result.current.data).toBeUndefined()
    expect(result.current.isLoading).toBeTruthy()
    expect(result.current.isFetching).toBeTruthy()
    expect(initialProps.method).toHaveBeenCalledOnce()
    setCanResolve(true)
    await waitFor(() => {
      expect(result.current.isSuccess).toBeTruthy()
    })
    expect(initialProps.method).toHaveBeenCalledOnce()
    expect(result.current.data).toStrictEqual([{ data: 'Page 1 data', nextPage: 2 }])
    expect(result.current.isLoading).toBeFalsy()
    expect(result.current.isLoading).toBeFalsy()
    expect(result.current.isFetching).toBeFalsy()
  })

  it('should get the first and loadMore one page on mount while enabled', async () => {
    const { setCanResolve, initialProps } = getPrerequisite('test2')
    const { result } = renderHook(
      props => useInfiniteDataLoader(props.key, props.method, props.baseParams, 'page', config),
      {
        initialProps,
        wrapper,
      },
    )
    expect(result.current.data).toBeUndefined()
    expect(result.current.isLoading).toBeTruthy()
    expect(result.current.isFetching).toBeTruthy()
    expect(result.current.isFetching).toBeTruthy()
    expect(initialProps.method).toHaveBeenCalledOnce()
    expect(initialProps.method).toHaveBeenCalledWith({
      page: 1,
    })
    setCanResolve(true)
    await waitFor(() => {
      expect(result.current.isSuccess).toBeTruthy()
    })
    expect(initialProps.method).toHaveBeenCalledOnce()
    expect(result.current.data).toStrictEqual([{ data: 'Page 1 data', nextPage: 2 }])
    expect(result.current.isLoading).toBeFalsy()
    expect(result.current.isFetching).toBeFalsy()
    setCanResolve(false)
    act(() => {
      result.current.loadMore()
    })
    expect(result.current.data).toStrictEqual([{ data: 'Page 1 data', nextPage: 2 }])
    await waitFor(() => {
      expect(result.current.isFetching).toBeTruthy()
    })
    expect(initialProps.method).toHaveBeenCalledTimes(2)
    expect(initialProps.method).toHaveBeenCalledWith({
      page: 2,
    })
    setCanResolve(true)
    await waitFor(() => {
      expect(result.current.isFetching).toBeTruthy()
    })
    await waitFor(() => {
      expect(result.current.isSuccess).toBeTruthy()
    })
    await waitFor(() => {
      expect(result.current.isFetching).toBeFalsy()
    })
    expect(result.current.data).toStrictEqual([
      { data: 'Page 1 data', nextPage: 2 },
      { data: 'Page 2 data', nextPage: 3 },
    ])
  })

  it('should get the first and loadMore one page on mount while enabled then reload', async () => {
    const { setCanResolve, initialProps, resetCounter } = getPrerequisite('test3')
    const { result } = renderHook(
      props => useInfiniteDataLoader(props.key, props.method, props.baseParams, 'page', config),
      {
        initialProps,
        wrapper,
      },
    )
    expect(result.current.data).toBeUndefined()
    expect(result.current.isLoading).toBeTruthy()
    expect(result.current.isFetching).toBeTruthy()
    expect(initialProps.method).toHaveBeenCalledOnce()
    expect(initialProps.method).toHaveBeenCalledWith({
      page: 1,
    })
    setCanResolve(true)
    await waitFor(() => {
      expect(result.current.isSuccess).toBeTruthy()
    })
    setCanResolve(false)
    expect(initialProps.method).toHaveBeenCalledOnce()
    expect(result.current.data).toStrictEqual([{ data: 'Page 1 data', nextPage: 2 }])
    expect(result.current.isLoading).toBeFalsy()
    expect(result.current.isFetching).toBeFalsy()
    act(() => {
      result.current.loadMore()
    })
    await waitFor(() => {
      expect(result.current.isFetching).toBeTruthy()
    })
    expect(result.current.data).toStrictEqual([{ data: 'Page 1 data', nextPage: 2 }])
    expect(initialProps.method).toHaveBeenCalledTimes(2)
    expect(initialProps.method).toHaveBeenCalledWith({
      page: 2,
    })
    setCanResolve(true)
    await waitFor(() => {
      expect(result.current.isSuccess).toBeTruthy()
    })
    expect(result.current.data).toStrictEqual([
      { data: 'Page 1 data', nextPage: 2 },
      { data: 'Page 2 data', nextPage: 3 },
    ])
    setCanResolve(false)
    resetCounter()
    act(() => {
      result.current.reload().catch(() => null)
    })
    await waitFor(() => {
      expect(result.current.isFetching).toBeTruthy()
    })
    setCanResolve(true)
    await waitFor(() => {
      expect(result.current.isSuccess).toBeTruthy()
    })
    expect(result.current.data).toStrictEqual([
      { data: 'Page 1 data', nextPage: 2 },
      { data: 'Page 2 data', nextPage: 3 },
    ])
  })

  it('should get the first and loadMore one page on mount while not enabled then enabled then reload', async () => {
    const { setCanResolve, initialProps, resetCounter } = getPrerequisite('test4')
    const localInitialProps = {
      ...initialProps,
      config: {
        ...config,
        enabled: false,
      },
    }
    const { result, rerender } = renderHook(
      props => useInfiniteDataLoader(props.key, props.method, props.baseParams, 'page', props.config),
      {
        initialProps: localInitialProps,
        wrapper,
      },
    )
    expect(result.current.data).toBeUndefined()
    expect(result.current.isLoading).toBeFalsy()
    expect(result.current.isFetching).toBeFalsy()
    expect(initialProps.method).toHaveBeenCalledTimes(0)
    rerender(localInitialProps)
    expect(result.current.data).toBeUndefined()
    expect(result.current.isLoading).toBeFalsy()
    expect(result.current.isFetching).toBeFalsy()
    expect(initialProps.method).toHaveBeenCalledTimes(0)
    rerender({ ...localInitialProps, config: { ...config, enabled: true } })
    expect(result.current.data).toBeUndefined()
    await waitFor(() => {
      expect(result.current.isFetching).toBeTruthy()
    })
    expect(initialProps.method).toHaveBeenCalledOnce()
    expect(initialProps.method).toHaveBeenCalledWith({
      page: 1,
    })
    setCanResolve(true)
    await waitFor(() => {
      expect(result.current.isSuccess).toBeTruthy()
    })
    setCanResolve(false)
    expect(initialProps.method).toHaveBeenCalledOnce()
    expect(result.current.data).toStrictEqual([{ data: 'Page 1 data', nextPage: 2 }])
    expect(result.current.isLoading).toBeFalsy()
    expect(result.current.isFetching).toBeFalsy()
    act(() => {
      result.current.loadMore()
    })
    await waitFor(() => {
      expect(result.current.isFetching).toBeTruthy()
    })
    expect(result.current.data).toStrictEqual([{ data: 'Page 1 data', nextPage: 2 }])
    expect(initialProps.method).toHaveBeenCalledTimes(2)
    expect(initialProps.method).toHaveBeenCalledWith({
      page: 2,
    })
    setCanResolve(true)
    await waitFor(() => {
      expect(result.current.isFetching).toBeTruthy()
    })
    await waitFor(() => {
      expect(result.current.isSuccess).toBeTruthy()
    })
    await waitFor(() => {
      expect(result.current.isLoading).toBeFalsy()
    })
    // After loadMore completes, we should still have only 2 calls
    // (initial load + loadMore), not 3, because reload reuses existing requests
    expect(initialProps.method).toHaveBeenCalledTimes(2)
    expect(result.current.data).toStrictEqual([
      { data: 'Page 1 data', nextPage: 2 },
      { data: 'Page 2 data', nextPage: 3 },
    ])
    setCanResolve(false)
    resetCounter()
    act(() => {
      result.current.reload().catch(() => null)
    })
    await waitFor(() => {
      expect(result.current.isFetching).toBeTruthy()
    })
    setCanResolve(true)
    await waitFor(() => {
      expect(result.current.isFetching).toBeFalsy()
    })
    expect(result.current.data).toStrictEqual([
      { data: 'Page 1 data', nextPage: 2 },
      { data: 'Page 2 data', nextPage: 3 },
    ])
  })

  it('should differentiate between isLoading and isFetching', async () => {
    const { setCanResolve, initialProps } = getPrerequisite('test-isLoading-vs-isFetching')

    const { result } = renderHook(
      props => useInfiniteDataLoader(props.key, props.method, props.baseParams, 'page', config),
      {
        initialProps,
        wrapper,
      },
    )

    expect(result.current.isLoading).toBeTruthy()
    expect(result.current.isFetching).toBeTruthy()
    expect(result.current.data).toBeUndefined()

    setCanResolve(true)
    await waitFor(() => {
      expect(result.current.isSuccess).toBeTruthy()
    })

    expect(result.current.isLoading).toBeFalsy()
    expect(result.current.isFetching).toBeFalsy()
    expect(result.current.data).toStrictEqual([{ data: 'Page 1 data', nextPage: 2 }])

    setCanResolve(false)
    act(() => {
      result.current.loadMore()
    })

    await waitFor(() => {
      expect(result.current.isFetching).toBeTruthy()
    })
    expect(result.current.isLoading).toBeFalsy()
    expect(result.current.data).toStrictEqual([{ data: 'Page 1 data', nextPage: 2 }])

    setCanResolve(true)
    await waitFor(() => {
      expect(result.current.isSuccess).toBeTruthy()
    })

    expect(result.current.isLoading).toBeFalsy()
    expect(result.current.isFetching).toBeFalsy()
    expect(result.current.data).toStrictEqual([
      { data: 'Page 1 data', nextPage: 2 },
      { data: 'Page 2 data', nextPage: 3 },
    ])
  })

  it('should call onError callback when request fails', async () => {
    const onErrorMock = vi.fn()
    const { initialProps } = getPrerequisite('test-error')
    const localConfig = {
      ...config,
      onError: onErrorMock,
    }

    const failingMethod = vi.fn(async () => {
      throw new Error('Network error')
    })

    const localInitialProps = {
      ...initialProps,
      method: failingMethod,
    }

    const { result } = renderHook(
      props => useInfiniteDataLoader(props.key, props.method, props.baseParams, 'page', localConfig),
      {
        initialProps: localInitialProps,
        wrapper,
      },
    )

    await waitFor(
      () => {
        expect(result.current.isError).toBeTruthy()
      },
      { timeout: 2000 },
    )

    expect(onErrorMock).toHaveBeenCalled()
  })

  it('should call onSuccess callback when request succeeds', async () => {
    const onSuccessMock = vi.fn()
    const { setCanResolve, initialProps } = getPrerequisite('test-success')
    const localConfig = {
      ...config,
      onSuccess: onSuccessMock,
    }

    const { result } = renderHook(
      props => useInfiniteDataLoader(props.key, props.method, props.baseParams, 'page', localConfig),
      {
        initialProps,
        wrapper,
      },
    )

    setCanResolve(true)
    await waitFor(() => {
      expect(result.current.isSuccess).toBeTruthy()
    })

    expect(onSuccessMock).toHaveBeenCalledWith({ data: 'Page 1 data', nextPage: 2 })
  })

  it('should use initialData when provided', async () => {
    const { setCanResolve, initialProps } = getPrerequisite('test-initial-data')
    const localInitialProps = {
      ...initialProps,
      config: {
        ...config,
        initialData: [{ data: 'Initial data', nextPage: 1 }],
      },
    }

    const { result } = renderHook(
      props => useInfiniteDataLoader(props.key, props.method, props.baseParams, 'page', props.config),
      {
        initialProps: localInitialProps,
        wrapper,
      },
    )

    expect(result.current.data).toStrictEqual([{ data: 'Initial data', nextPage: 1 }])
    expect(result.current.isLoading).toBeFalsy()

    setCanResolve(true)
    await waitFor(() => {
      expect(result.current.isSuccess).toBeTruthy()
    })

    expect(result.current.data).toStrictEqual([{ data: 'Page 1 data', nextPage: 2 }])
  })

  it('should return hasNextPage false when getNextPage returns undefined', async () => {
    const noNextPageConfig: UseInfiniteDataLoaderConfig<
      { nextPage: number | undefined; data: string },
      Error,
      { page: number | undefined },
      'page'
    > = {
      enabled: true,
      getNextPage: () => undefined,
    }

    const { setCanResolve, initialProps } = getPrerequisite('test-no-next-page')
    const localMethod = vi.fn(
      async () =>
        new Promise<{ nextPage: number | undefined; data: string }>(resolve => {
          resolve({ data: 'Last page', nextPage: undefined })
        }),
    )

    const localInitialProps = {
      ...initialProps,
      method: localMethod,
    }

    const { result } = renderHook(
      props => useInfiniteDataLoader(props.key, props.method, props.baseParams, 'page', noNextPageConfig),
      {
        initialProps: localInitialProps,
        wrapper,
      },
    )

    setCanResolve(true)
    await waitFor(() => {
      expect(result.current.isSuccess).toBeTruthy()
    })

    expect(result.current.hasNextPage).toBeFalsy()
    expect(result.current.data).toStrictEqual([{ data: 'Last page', nextPage: undefined }])
  })

  it('should reset page when baseKey changes', async () => {
    const { setCanResolve, initialProps } = getPrerequisite('test-key-change')

    const { result, rerender } = renderHook(
      props => useInfiniteDataLoader(props.key, props.method, props.baseParams, 'page', config),
      {
        initialProps,
        wrapper,
      },
    )

    setCanResolve(true)
    await waitFor(() => {
      expect(result.current.isSuccess).toBeTruthy()
    })

    act(() => {
      result.current.loadMore()
    })
    await waitFor(() => {
      expect(result.current.isFetching).toBeTruthy()
    })
    setCanResolve(true)
    await waitFor(() => {
      expect(result.current.isSuccess).toBeTruthy()
    })

    expect(result.current.data).toHaveLength(2)

    const newInitialProps = {
      ...initialProps,
      key: 'test-key-change-new',
      baseParams: { page: 1 },
    }

    rerender(newInitialProps)

    // Page should be reset
    await waitFor(() => {
      expect(result.current.isFetching).toBeTruthy()
    })
    setCanResolve(true)
    await waitFor(() => {
      expect(result.current.isSuccess).toBeTruthy()
    })

    expect(result.current.data).toHaveLength(1)
  })

  it('should set isIdle when enabled is false', async () => {
    const { initialProps } = getPrerequisite('test-idle')
    const localInitialProps = {
      ...initialProps,
      config: {
        ...config,
        enabled: false,
      },
    }

    const { result } = renderHook(
      props => useInfiniteDataLoader(props.key, props.method, props.baseParams, 'page', props.config),
      {
        initialProps: localInitialProps,
        wrapper,
      },
    )

    expect(result.current.isIdle).toBeTruthy()
    expect(result.current.isLoading).toBeFalsy()
    expect(result.current.isFetching).toBeFalsy()
    expect(initialProps.method).not.toHaveBeenCalled()
  })

  it('should handle multiple loadMore calls in sequence', async () => {
    const { setCanResolve, initialProps } = getPrerequisite('test-multiple-load-more')

    const { result } = renderHook(
      props => useInfiniteDataLoader(props.key, props.method, props.baseParams, 'page', config),
      {
        initialProps,
        wrapper,
      },
    )

    setCanResolve(true)
    await waitFor(() => {
      expect(result.current.isSuccess).toBeTruthy()
    })

    // Load multiple pages
    setCanResolve(false)
    act(() => {
      result.current.loadMore()
    })
    await waitFor(() => {
      expect(result.current.isFetching).toBeTruthy()
    })
    setCanResolve(true)
    await waitFor(() => {
      expect(result.current.isSuccess).toBeTruthy()
    })

    setCanResolve(false)
    act(() => {
      result.current.loadMore()
    })
    await waitFor(() => {
      expect(result.current.isFetching).toBeTruthy()
    })
    setCanResolve(true)
    await waitFor(() => {
      expect(result.current.isSuccess).toBeTruthy()
    })

    expect(result.current.data).toHaveLength(3)
    expect(result.current.data?.[0]).toEqual({ data: 'Page 1 data', nextPage: 2 })
    expect(result.current.data?.[1]).toEqual({ data: 'Page 2 data', nextPage: 3 })
    expect(result.current.data?.[2]).toEqual({ data: 'Page 3 data', nextPage: 4 })
  })

  it('should handle reload after error', async () => {
    const { setCanResolve, initialProps, resetCounter } = getPrerequisite('test-reload-error')

    const { result } = renderHook(
      props => useInfiniteDataLoader(props.key, props.method, props.baseParams, 'page', config),
      {
        initialProps,
        wrapper,
      },
    )

    setCanResolve(true)
    await waitFor(() => {
      expect(result.current.isSuccess).toBeTruthy()
    })

    expect(result.current.data).toStrictEqual([{ data: 'Page 1 data', nextPage: 2 }])

    resetCounter()
    setCanResolve(false)
    act(() => {
      result.current.reload().catch(() => {})
    })

    await waitFor(() => {
      expect(result.current.isFetching).toBeTruthy()
    })

    setCanResolve(true)
    await waitFor(() => {
      expect(result.current.isSuccess).toBeTruthy()
    })

    expect(result.current.data).toStrictEqual([{ data: 'Page 1 data', nextPage: 2 }])
  })

  it('should use keepPreviousData option', async () => {
    const { setCanResolve, initialProps } = getPrerequisite('test-keep-previous')
    const localConfig = {
      ...config,
      keepPreviousData: true,
    }

    const { result } = renderHook(
      props => useInfiniteDataLoader(props.key, props.method, props.baseParams, 'page', localConfig),
      {
        initialProps,
        wrapper,
      },
    )

    setCanResolve(true)
    await waitFor(() => {
      expect(result.current.isSuccess).toBeTruthy()
    })

    const firstData = result.current.data

    setCanResolve(false)
    act(() => {
      result.current.loadMore()
    })

    expect(result.current.data).toEqual(firstData)

    await waitFor(() => {
      expect(result.current.isFetching).toBeTruthy()
    })
    setCanResolve(true)
    await waitFor(() => {
      expect(result.current.isSuccess).toBeTruthy()
    })

    expect(result.current.data).toHaveLength(2)
  })

  it('should handle stale page scenario when baseKey changes', async () => {
    const { setCanResolve, initialProps, resetCounter } = getPrerequisite('test-stale-page')

    const { result, rerender } = renderHook(
      props => useInfiniteDataLoader(props.key, props.method, props.baseParams, 'page', config),
      {
        initialProps,
        wrapper,
      },
    )

    setCanResolve(true)
    await waitFor(() => {
      expect(result.current.isSuccess).toBeTruthy()
    })

    expect(result.current.data).toStrictEqual([{ data: 'Page 1 data', nextPage: 2 }])
    expect(result.current.hasNextPage).toBeTruthy()

    setCanResolve(false)
    act(() => {
      result.current.loadMore()
    })
    await waitFor(() => {
      expect(result.current.isFetching).toBeTruthy()
    })
    setCanResolve(true)
    await waitFor(() => {
      expect(result.current.isSuccess).toBeTruthy()
    })

    expect(result.current.data).toHaveLength(2)
    expect(result.current.hasNextPage).toBeTruthy()

    resetCounter()

    const newInitialProps = {
      ...initialProps,
      key: 'test-stale-page-new-key',
      baseParams: { page: 1 },
    }

    rerender(newInitialProps)

    await waitFor(() => {
      expect(result.current.isFetching).toBeTruthy()
    })

    expect(result.current.data).toBeUndefined()
    expect(result.current.isLoading).toBeTruthy()

    // Resolve the new first page
    setCanResolve(true)
    await waitFor(() => {
      expect(result.current.isSuccess).toBeTruthy()
    })

    // Should only have one page (the new first page)
    expect(result.current.data).toHaveLength(1)
    expect(result.current.data?.[0]).toEqual({ data: 'Page 1 data', nextPage: 2 })
  })

  it('should restore nextPageRef on remount and allow loadMore', async () => {
    const { setCanResolve, initialProps, resetCounter } = getPrerequisite('test-remount-load-more')

    // First mount - load page 1 then loadMore page 2
    const { result, unmount } = renderHook(
      props => useInfiniteDataLoader(props.key, props.method, props.baseParams, 'page', config),
      {
        initialProps,
        wrapper,
      },
    )

    setCanResolve(true)
    await waitFor(() => {
      expect(result.current.isSuccess).toBeTruthy()
    })

    setCanResolve(false)
    act(() => {
      result.current.loadMore()
    })
    await waitFor(() => {
      expect(result.current.isFetching).toBeTruthy()
    })
    setCanResolve(true)
    await waitFor(() => {
      expect(result.current.isSuccess).toBeTruthy()
    })

    expect(result.current.data).toHaveLength(2)
    expect(result.current.hasNextPage).toBeTruthy()

    // Unmount the hook (simulates navigating away)
    unmount()

    // Reset counter to simulate fresh data for the remount
    resetCounter()

    // Second mount - should restore nextPageRef from cached data
    const { result: result2 } = renderHook(
      props => useInfiniteDataLoader(props.key, props.method, props.baseParams, 'page', config),
      {
        initialProps,
        wrapper,
      },
    )

    // Should have cached data restored
    await waitFor(() => {
      expect(result2.current.isSuccess).toBeTruthy()
    })

    // nextPageRef should be restored - hasNextPage should be true
    expect(result2.current.hasNextPage).toBeTruthy()

    // loadMore should work - it should trigger a new method call
    const callsBeforeLoadMore = initialProps.method.mock.calls.length
    setCanResolve(false)
    act(() => {
      result2.current.loadMore()
    })
    await waitFor(() => {
      expect(result2.current.isFetching).toBeTruthy()
    })

    // Should have made one more call (for the next page)
    expect(initialProps.method.mock.calls.length).toBe(callsBeforeLoadMore + 1)
  })

  it('should restore nextPage from cached data on remount without reload when data is fresh', async () => {
    const { setCanResolve, initialProps } = getPrerequisite('test-remount-fresh-cache')
    const wrapperFresh = wrapperWithLifetime(10_000)

    const { result, unmount } = renderHook(
      props => useInfiniteDataLoader(props.key, props.method, props.baseParams, 'page', config),
      {
        initialProps,
        wrapper: wrapperFresh,
      },
    )

    setCanResolve(true)
    await waitFor(() => {
      expect(result.current.isSuccess).toBeTruthy()
    })

    act(() => {
      result.current.loadMore()
    })
    await waitFor(() => {
      expect(result.current.data).toHaveLength(2)
    })

    expect(result.current.hasNextPage).toBeTruthy()

    unmount()

    // Remount with fresh cache (within 10s lifetime) - nextPage should be restored from cached data
    const { result: result2 } = renderHook(
      props => useInfiniteDataLoader(props.key, props.method, props.baseParams, 'page', config),
      {
        initialProps,
        wrapper: wrapperFresh,
      },
    )

    await waitFor(() => {
      expect(result2.current.isSuccess).toBeTruthy()
    })

    expect(result2.current.hasNextPage).toBeTruthy()

    // loadMore should trigger exactly one new method call for the next page
    const callsBeforeLoadMore = initialProps.method.mock.calls.length
    act(() => {
      result2.current.loadMore()
    })
    await waitFor(() => {
      expect(result2.current.isFetching).toBeTruthy()
    })

    expect(initialProps.method.mock.calls.length).toBe(callsBeforeLoadMore + 1)
  })

  it('should keep hasNextPage accurate after remount with fresh cache (no stale useMemo)', async () => {
    const { setCanResolve, initialProps } = getPrerequisite('test-remount-hasNextPage-accurate')
    const wrapperFresh = wrapperWithLifetime(10_000)

    const { result, unmount } = renderHook(
      props => useInfiniteDataLoader(props.key, props.method, props.baseParams, 'page', config),
      {
        initialProps,
        wrapper: wrapperFresh,
      },
    )

    setCanResolve(true)
    await waitFor(() => {
      expect(result.current.isSuccess).toBeTruthy()
    })

    expect(result.current.hasNextPage).toBeTruthy()
    unmount()

    const { result: result2 } = renderHook(
      props => useInfiniteDataLoader(props.key, props.method, props.baseParams, 'page', config),
      {
        initialProps,
        wrapper: wrapperFresh,
      },
    )

    await waitFor(() => {
      expect(result2.current.isSuccess).toBeTruthy()
    })

    // hasNextPage must be true (not stale false from useMemo)
    expect(result2.current.hasNextPage).toBeTruthy()
  })
})
