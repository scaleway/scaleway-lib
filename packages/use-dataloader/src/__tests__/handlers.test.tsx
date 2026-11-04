import { act, renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import DataLoaderProvider, { useDataLoaderContext } from '../DataLoaderProvider'
import { useDataLoader } from '../useDataLoader'

const PROMISE_TIMEOUT = 10

const fakeSuccessPromise = async () =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve('success-data')
    }, PROMISE_TIMEOUT)
  })

const fakeErrorPromise = async () =>
  new Promise((_resolve, reject) => {
    setTimeout(() => {
      reject(new Error('test-error'))
    }, PROMISE_TIMEOUT)
  })

const wrapper = ({ children }: { children?: ReactNode }) => <DataLoaderProvider>{children}</DataLoaderProvider>

describe('onSuccess/onError handlers', () => {
  it('should fire onSuccess on mount load', async () => {
    const onSuccess = vi.fn<(data: unknown) => void>()
    const method = vi.fn<typeof fakeSuccessPromise>(fakeSuccessPromise)
    const { result } = renderHook(() => useDataLoader('handlers-mount', method, { onSuccess }), { wrapper })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(onSuccess).toHaveBeenCalledTimes(1)
    expect(onSuccess).toHaveBeenCalledWith('success-data')
  })

  it('should fire onError on mount load error', async () => {
    const onError = vi.fn<(error: Error) => void>()
    const method = vi.fn<typeof fakeErrorPromise>(fakeErrorPromise)
    const { result } = renderHook(() => useDataLoader('handlers-mount-error', method, { onError }), { wrapper })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(onError).toHaveBeenCalledTimes(1)
    expect(onError).toHaveBeenCalledWith(new Error('test-error'))
  })

  it('should fire onSuccess on reload', async () => {
    const onSuccess = vi.fn<(data: unknown) => void>()
    const method = vi.fn<typeof fakeSuccessPromise>(fakeSuccessPromise)
    const { result } = renderHook(() => useDataLoader('handlers-reload', method, { onSuccess }), { wrapper })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
    expect(onSuccess).toHaveBeenCalledTimes(1)

    await act(async () => {
      await result.current.reload()
    })

    expect(onSuccess).toHaveBeenCalledTimes(2)
  })

  it('should fire onSuccess on polling tick', async () => {
    const onSuccess = vi.fn<(data: unknown) => void>()
    const method = vi.fn<typeof fakeSuccessPromise>(fakeSuccessPromise)
    const { result } = renderHook(
      () => useDataLoader('handlers-polling', method, { onSuccess, pollingInterval: 50, needPolling: true }),
      { wrapper },
    )

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
    expect(onSuccess).toHaveBeenCalledTimes(1)

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledTimes(2)
    })
  })

  it('should fire onSuccess on focus refetch', async () => {
    const onSuccess = vi.fn<(data: unknown) => void>()
    const method = vi.fn<typeof fakeSuccessPromise>(fakeSuccessPromise)
    const { result } = renderHook(
      () => useDataLoader('handlers-refetch', method, { onSuccess, refetchOnFocus: 'always', dataLifetime: 10_000 }),
      { wrapper },
    )

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
    expect(onSuccess).toHaveBeenCalledTimes(1)

    globalThis.dispatchEvent(new Event('focus'))

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledTimes(2)
    })
  })

  it('should fire onError on focus refetch error', async () => {
    const onError = vi.fn<(error: Error) => void>()
    const method = vi.fn<typeof fakeErrorPromise>(fakeErrorPromise)
    const { result } = renderHook(
      () => useDataLoader('handlers-refetch-error', method, { onError, refetchOnFocus: 'always', dataLifetime: 0 }),
      { wrapper },
    )

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })
    expect(onError).toHaveBeenCalledTimes(1)

    globalThis.dispatchEvent(new Event('focus'))

    await waitFor(() => {
      expect(onError).toHaveBeenCalledTimes(2)
    })
  })

  it('should fire handler errors are swallowed (do not affect request state)', async () => {
    const throwingOnSuccess = vi.fn<(data: unknown) => void>(() => {
      throw new Error('handler-error')
    })
    const method = vi.fn<typeof fakeSuccessPromise>(fakeSuccessPromise)
    const { result } = renderHook(() => useDataLoader('handlers-swallow', method, { onSuccess: throwingOnSuccess }), {
      wrapper,
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    // Request succeeded despite handler throwing
    expect(result.current.data).toBe('success-data')
    expect(throwingOnSuccess).toHaveBeenCalledTimes(1)
  })

  it('should fire handlers for provider reloadAllActive', async () => {
    const onSuccess = vi.fn<(data: unknown) => void>()
    const method = vi.fn<typeof fakeSuccessPromise>(fakeSuccessPromise)

    // Render both the dataloader hook and context hook in the same tree
    const { result } = renderHook(
      () => ({
        dataLoader: useDataLoader('handlers-provider', method, { onSuccess }),
        context: useDataLoaderContext(),
      }),
      { wrapper },
    )

    await waitFor(() => {
      expect(result.current.dataLoader.isSuccess).toBe(true)
    })
    expect(onSuccess).toHaveBeenCalledTimes(1)

    await act(async () => {
      await result.current.context.reloadAllActive()
    })

    expect(onSuccess).toHaveBeenCalledTimes(2)
  })

  it('should fire handlers for provider reload (single key)', async () => {
    const onSuccess = vi.fn<(data: unknown) => void>()
    const method = vi.fn<typeof fakeSuccessPromise>(fakeSuccessPromise)

    const { result } = renderHook(
      () => ({
        dataLoader: useDataLoader('handlers-reload-key', method, { onSuccess }),
        context: useDataLoaderContext(),
      }),
      { wrapper },
    )

    await waitFor(() => {
      expect(result.current.dataLoader.isSuccess).toBe(true)
    })
    expect(onSuccess).toHaveBeenCalledTimes(1)

    await act(async () => {
      await result.current.context.reload('handlers-reload-key')
    })

    expect(onSuccess).toHaveBeenCalledTimes(2)
  })

  it('should not fire handlers for unmounted hooks', async () => {
    const onSuccess = vi.fn<(data: unknown) => void>()
    const method = vi.fn<typeof fakeSuccessPromise>(fakeSuccessPromise)
    const { result, unmount } = renderHook(() => useDataLoader('handlers-unmount', method, { onSuccess }), {
      wrapper,
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
    expect(onSuccess).toHaveBeenCalledTimes(1)

    unmount()

    // Trigger a refetch after unmount - handler should not fire
    globalThis.dispatchEvent(new Event('focus'))

    // Wait a bit to ensure no handler call
    await new Promise<void>(resolve => {
      setTimeout(() => resolve(), 50)
    })
    expect(onSuccess).toHaveBeenCalledTimes(1)
  })

  it('should fire once per observing hook (no double-fire)', async () => {
    const onSuccess = vi.fn<(data: unknown) => void>()
    const method = vi.fn<typeof fakeSuccessPromise>(fakeSuccessPromise)
    // Two hooks on the same key
    const { result: result1 } = renderHook(
      () => useDataLoader('handlers-double', method, { onSuccess, dataLifetime: 10_000 }),
      { wrapper },
    )
    const { result: result2 } = renderHook(
      () => useDataLoader('handlers-double', method, { onSuccess, dataLifetime: 10_000 }),
      { wrapper },
    )

    await waitFor(() => {
      expect(result1.current.isSuccess).toBe(true)
    })
    await waitFor(() => {
      expect(result2.current.isSuccess).toBe(true)
    })

    // Each hook's handler fires once
    expect(onSuccess).toHaveBeenCalledTimes(2)
  })
})
