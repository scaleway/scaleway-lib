// oxlint-disable eslint/max-statements
//
import { renderHook, waitFor } from '@testing-library/react'
import { act } from 'react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import DataLoaderProvider from '../DataLoaderProvider'
import type { UseInfiniteDataLoaderConfig } from '../types'
import { useInfiniteDataLoader } from '../useInfiniteDataLoader'

const config: UseInfiniteDataLoaderConfig<
  { nextPage: number; data: string },
  Error,
  { page: number },
  'page'
> = {
  getNextPage: result => result.nextPage,
  enabled: true,
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
            resolve({ nextPage: counter, data: `Page ${counter - 1} data` })
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
    setCanResolve: (newState: boolean) => {
      canResolve = newState
    },
    resetCounter: () => {
      counter = 1
    },
    canResolve,
    counter,
  }
}
const wrapper = ({ children }: { children?: ReactNode }) => (
  <DataLoaderProvider>{children}</DataLoaderProvider>
)

describe('useInfinitDataLoader', () => {
  it('should get the first page on mount while enabled', async () => {
    const { setCanResolve, initialProps } = getPrerequisite('test1')
    const { result } = renderHook(
      props =>
        useInfiniteDataLoader(
          props.key,
          props.method,
          props.baseParams,
          'page',
          config,
        ),
      {
        initialProps,
        wrapper,
      },
    )
    expect(result.current.data).toBe(undefined)
    expect(result.current.isLoading).toBeTruthy()
    expect(result.current.isFetching).toBeTruthy()
    expect(initialProps.method).toHaveBeenCalledTimes(1)
    setCanResolve(true)
    await waitFor(() => {
      expect(result.current.isSuccess).toBeTruthy()
    })
    expect(initialProps.method).toHaveBeenCalledTimes(1)
    expect(result.current.data).toStrictEqual([
      { nextPage: 2, data: 'Page 1 data' },
    ])
    expect(result.current.isLoading).toBeFalsy()
    expect(result.current.isLoading).toBeFalsy()
    expect(result.current.isFetching).toBeFalsy()
  })

  it('should get the first and loadMore one page on mount while enabled', async () => {
    const { setCanResolve, initialProps } = getPrerequisite('test2')
    const { result } = renderHook(
      props =>
        useInfiniteDataLoader(
          props.key,
          props.method,
          props.baseParams,
          'page',
          config,
        ),
      {
        initialProps,
        wrapper,
      },
    )
    expect(result.current.data).toBe(undefined)
    expect(result.current.isLoading).toBeTruthy()
    expect(result.current.isFetching).toBeTruthy()
    expect(result.current.isFetching).toBeTruthy()
    expect(initialProps.method).toHaveBeenCalledTimes(1)
    expect(initialProps.method).toHaveBeenCalledWith({
      page: 1,
    })
    setCanResolve(true)
    await waitFor(() => {
      expect(result.current.isSuccess).toBeTruthy()
    })
    expect(initialProps.method).toHaveBeenCalledTimes(1)
    expect(result.current.data).toStrictEqual([
      { nextPage: 2, data: 'Page 1 data' },
    ])
    expect(result.current.isLoading).toBeFalsy()
    expect(result.current.isFetching).toBeFalsy()
    setCanResolve(false)
    act(() => {
      result.current.loadMore()
    })
    expect(result.current.data).toStrictEqual([
      { nextPage: 2, data: 'Page 1 data' },
    ])
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
      { nextPage: 2, data: 'Page 1 data' },
      { nextPage: 3, data: 'Page 2 data' },
    ])
  })

  it('should get the first and loadMore one page on mount while enabled then reload', async () => {
    const { setCanResolve, initialProps, resetCounter } =
      getPrerequisite('test3')
    const { result } = renderHook(
      props =>
        useInfiniteDataLoader(
          props.key,
          props.method,
          props.baseParams,
          'page',
          config,
        ),
      {
        initialProps,
        wrapper,
      },
    )
    expect(result.current.data).toBe(undefined)
    expect(result.current.isLoading).toBeTruthy()
    expect(result.current.isFetching).toBeTruthy()
    expect(initialProps.method).toHaveBeenCalledTimes(1)
    expect(initialProps.method).toHaveBeenCalledWith({
      page: 1,
    })
    setCanResolve(true)
    await waitFor(() => {
      expect(result.current.isSuccess).toBeTruthy()
    })
    setCanResolve(false)
    expect(initialProps.method).toHaveBeenCalledTimes(1)
    expect(result.current.data).toStrictEqual([
      { nextPage: 2, data: 'Page 1 data' },
    ])
    expect(result.current.isLoading).toBeFalsy()
    expect(result.current.isFetching).toBeFalsy()
    act(() => {
      result.current.loadMore()
    })
    await waitFor(() => {
      expect(result.current.isFetching).toBeTruthy()
    })
    expect(result.current.data).toStrictEqual([
      { nextPage: 2, data: 'Page 1 data' },
    ])
    expect(initialProps.method).toHaveBeenCalledTimes(2)
    expect(initialProps.method).toHaveBeenCalledWith({
      page: 2,
    })
    setCanResolve(true)
    await waitFor(() => {
      expect(result.current.isSuccess).toBeTruthy()
    })
    expect(result.current.data).toStrictEqual([
      { nextPage: 2, data: 'Page 1 data' },
      { nextPage: 3, data: 'Page 2 data' },
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
      { nextPage: 2, data: 'Page 1 data' },
      { nextPage: 3, data: 'Page 2 data' },
    ])
  })

  it('should get the first and loadMore one page on mount while not enabled then enabled then reload', async () => {
    const { setCanResolve, initialProps, resetCounter } =
      getPrerequisite('test4')
    const localInitialProps = {
      ...initialProps,
      config: {
        ...config,
        enabled: false,
      },
    }
    const { result, rerender } = renderHook(
      props =>
        useInfiniteDataLoader(
          props.key,
          props.method,
          props.baseParams,
          'page',
          props.config,
        ),
      {
        initialProps: localInitialProps,
        wrapper,
      },
    )
    expect(result.current.data).toBe(undefined)
    expect(result.current.isLoading).toBeFalsy()
    expect(result.current.isFetching).toBeFalsy()
    expect(initialProps.method).toHaveBeenCalledTimes(0)
    rerender(localInitialProps)
    expect(result.current.data).toBe(undefined)
    expect(result.current.isLoading).toBeFalsy()
    expect(result.current.isFetching).toBeFalsy()
    expect(initialProps.method).toHaveBeenCalledTimes(0)
    rerender({ ...localInitialProps, config: { ...config, enabled: true } })
    expect(result.current.data).toBe(undefined)
    await waitFor(() => {
      expect(result.current.isFetching).toBeTruthy()
    })
    expect(initialProps.method).toHaveBeenCalledTimes(1)
    expect(initialProps.method).toHaveBeenCalledWith({
      page: 1,
    })
    setCanResolve(true)
    await waitFor(() => {
      expect(result.current.isSuccess).toBeTruthy()
    })
    setCanResolve(false)
    expect(initialProps.method).toHaveBeenCalledTimes(1)
    expect(result.current.data).toStrictEqual([
      { nextPage: 2, data: 'Page 1 data' },
    ])
    expect(result.current.isLoading).toBeFalsy()
    expect(result.current.isFetching).toBeFalsy()
    act(() => {
      result.current.loadMore()
    })
    await waitFor(() => {
      expect(result.current.isFetching).toBeTruthy()
    })
    expect(result.current.data).toStrictEqual([
      { nextPage: 2, data: 'Page 1 data' },
    ])
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
      { nextPage: 2, data: 'Page 1 data' },
      { nextPage: 3, data: 'Page 2 data' },
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
      { nextPage: 2, data: 'Page 1 data' },
      { nextPage: 3, data: 'Page 2 data' },
    ])
  })

  it('should differentiate between isLoading and isFetching', async () => {
    const { setCanResolve, initialProps } = getPrerequisite(
      'test-isLoading-vs-isFetching',
    )

    const { result } = renderHook(
      props =>
        useInfiniteDataLoader(
          props.key,
          props.method,
          props.baseParams,
          'page',
          config,
        ),
      {
        initialProps,
        wrapper,
      },
    )

    // Initially, isLoading should be true (first load with no cache)
    expect(result.current.isLoading).toBeTruthy()
    expect(result.current.isFetching).toBeTruthy()
    expect(result.current.data).toBe(undefined)

    // Resolve the first request
    setCanResolve(true)
    await waitFor(() => {
      expect(result.current.isSuccess).toBeTruthy()
    })

    // After first load, isLoading should be false but isFetching should also be false
    expect(result.current.isLoading).toBeFalsy()
    expect(result.current.isFetching).toBeFalsy()
    expect(result.current.data).toStrictEqual([
      { nextPage: 2, data: 'Page 1 data' },
    ])

    // Trigger a loadMore
    setCanResolve(false)
    act(() => {
      result.current.loadMore()
    })

    // During loadMore, isLoading should be false (we have cached data) but isFetching should be true
    await waitFor(() => {
      expect(result.current.isFetching).toBeTruthy()
    })
    expect(result.current.isLoading).toBeFalsy()
    expect(result.current.data).toStrictEqual([
      { nextPage: 2, data: 'Page 1 data' },
    ]) // Still have cached data

    // Resolve the loadMore
    setCanResolve(true)
    await waitFor(() => {
      expect(result.current.isSuccess).toBeTruthy()
    })

    // After loadMore, both should be false again
    expect(result.current.isLoading).toBeFalsy()
    expect(result.current.isFetching).toBeFalsy()
    expect(result.current.data).toStrictEqual([
      { nextPage: 2, data: 'Page 1 data' },
      { nextPage: 3, data: 'Page 2 data' },
    ])
  })
})
