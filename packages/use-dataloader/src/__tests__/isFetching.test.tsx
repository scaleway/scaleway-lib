import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import DataLoaderProvider from '../DataLoaderProvider'
import { useDataLoader } from '../useDataLoader'

const PROMISE_TIMEOUT = 10

const fakeSuccessPromise = async () =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(true)
    }, PROMISE_TIMEOUT)
  })

const fakeErrorPromise = async () =>
  new Promise((_resolve, reject) => {
    setTimeout(() => {
      reject(new Error('error'))
    }, PROMISE_TIMEOUT)
  })

const wrapper = ({ children }: { children?: ReactNode }) => <DataLoaderProvider>{children}</DataLoaderProvider>

describe('isFetching', () => {
  it('should be true while a mount-initiated load is in flight', async () => {
    const method = vi.fn<typeof fakeSuccessPromise>(fakeSuccessPromise)
    const { result } = renderHook(() => useDataLoader('isfetching-inflight', method), { wrapper })

    expect(result.current.isFetching).toBe(true)

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.isFetching).toBe(false)
  })

  it('should clear after a successful auto-load even when an onSuccess callback is provided', async () => {
    const method = vi.fn<typeof fakeSuccessPromise>(fakeSuccessPromise)
    const onSuccess = vi.fn<(data: unknown) => void>()
    const { result } = renderHook(() => useDataLoader('isfetching-onsuccess', method, { onSuccess }), {
      wrapper,
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
    expect(onSuccess).toHaveBeenCalledTimes(1)

    // The optimistic flag set on mount must be cleared by the load that
    // settles, not only when no onSuccess is provided
    expect(result.current.isFetching).toBe(false)
  })

  it('should clear after a failed auto-load even when an onError callback is provided', async () => {
    const method = vi.fn<typeof fakeErrorPromise>(fakeErrorPromise)
    const onError = vi.fn<(error: Error) => void>()
    const { result } = renderHook(() => useDataLoader('isfetching-onerror', method, { onError }), {
      wrapper,
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })
    expect(onError).toHaveBeenCalledTimes(1)

    expect(result.current.isFetching).toBe(false)
  })
})
