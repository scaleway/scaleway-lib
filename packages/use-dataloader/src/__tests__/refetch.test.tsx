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

const wrapperWithDefaultRefetchOnFocus = ({ children }: { children?: ReactNode }) => (
  <DataLoaderProvider defaultRefetchOnFocus>{children}</DataLoaderProvider>
)

const wrapperWithoutRefetchOnReconnect = ({ children }: { children?: ReactNode }) => (
  <DataLoaderProvider defaultRefetchOnReconnect={false}>{children}</DataLoaderProvider>
)

const focusWindow = () => {
  globalThis.dispatchEvent(new Event('focus'))
}

const changeVisibility = () => {
  document.dispatchEvent(new Event('visibilitychange'))
}

const goOnline = () => {
  globalThis.dispatchEvent(new Event('online'))
}

describe('refetchOnFocus', () => {
  it('should not refetch on focus by default even when the data is stale', async () => {
    const method = vi.fn<typeof fakeSuccessPromise>(fakeSuccessPromise)
    const { result } = renderHook(() => useDataLoader('focus-default', method, { dataLifetime: 0 }), {
      wrapper,
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
    expect(method).toHaveBeenCalledTimes(1)

    focusWindow()

    expect(method).toHaveBeenCalledTimes(1)
  })

  it('should refetch stale data on focus when refetchOnFocus is true', async () => {
    const method = vi.fn<typeof fakeSuccessPromise>(fakeSuccessPromise)
    const { result } = renderHook(
      () => useDataLoader('focus-stale', method, { dataLifetime: 0, refetchOnFocus: true }),
      { wrapper },
    )

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
    expect(method).toHaveBeenCalledTimes(1)

    focusWindow()

    expect(method).toHaveBeenCalledTimes(2)
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
    expect(result.current.isFetching).toBe(false)
  })

  it('should not refetch fresh data on focus when refetchOnFocus is true', async () => {
    const method = vi.fn<typeof fakeSuccessPromise>(fakeSuccessPromise)
    const { result } = renderHook(
      () => useDataLoader('focus-fresh', method, { dataLifetime: 10_000, refetchOnFocus: true }),
      { wrapper },
    )

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    focusWindow()

    expect(method).toHaveBeenCalledTimes(1)
  })

  it('should refetch data on focus without dataLifetime when refetchOnFocus is true', async () => {
    const method = vi.fn<typeof fakeSuccessPromise>(fakeSuccessPromise)
    const { result } = renderHook(() => useDataLoader('focus-no-lifetime', method, { refetchOnFocus: true }), {
      wrapper,
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    focusWindow()

    expect(method).toHaveBeenCalledTimes(2)
  })

  it("should refetch fresh data on focus when refetchOnFocus is 'always'", async () => {
    const method = vi.fn<typeof fakeSuccessPromise>(fakeSuccessPromise)
    const { result } = renderHook(
      () => useDataLoader('focus-always', method, { dataLifetime: 10_000, refetchOnFocus: 'always' }),
      { wrapper },
    )

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    focusWindow()

    expect(method).toHaveBeenCalledTimes(2)
  })

  it('should refetch stale data when the document becomes visible', async () => {
    const method = vi.fn<typeof fakeSuccessPromise>(fakeSuccessPromise)
    const { result } = renderHook(
      () => useDataLoader('focus-visible', method, { dataLifetime: 0, refetchOnFocus: true }),
      { wrapper },
    )

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    changeVisibility()

    expect(method).toHaveBeenCalledTimes(2)
  })

  it('should not refetch when the document becomes hidden', async () => {
    const method = vi.fn<typeof fakeSuccessPromise>(fakeSuccessPromise)
    const { result } = renderHook(
      () => useDataLoader('focus-hidden', method, { dataLifetime: 0, refetchOnFocus: 'always' }),
      { wrapper },
    )

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    const visibilityStateSpy = vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('hidden')
    try {
      changeVisibility()

      expect(method).toHaveBeenCalledTimes(1)
    } finally {
      visibilityStateSpy.mockRestore()
    }
  })
})

describe('refetchOnReconnect', () => {
  it('should refetch data on reconnect by default', async () => {
    const method = vi.fn<typeof fakeSuccessPromise>(fakeSuccessPromise)
    const { result } = renderHook(() => useDataLoader('reconnect-default', method), {
      wrapper,
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
    expect(method).toHaveBeenCalledTimes(1)

    goOnline()

    expect(method).toHaveBeenCalledTimes(2)
    await waitFor(() => {
      expect(result.current.isFetching).toBe(false)
    })
  })

  it('should not refetch fresh data on reconnect', async () => {
    const method = vi.fn<typeof fakeSuccessPromise>(fakeSuccessPromise)
    const { result } = renderHook(() => useDataLoader('reconnect-fresh', method, { dataLifetime: 10_000 }), {
      wrapper,
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    goOnline()

    expect(method).toHaveBeenCalledTimes(1)
  })

  it('should retry an errored request on reconnect by default', async () => {
    const method = vi.fn<typeof fakeErrorPromise>(fakeErrorPromise)
    const { result } = renderHook(() => useDataLoader('reconnect-error', method), {
      wrapper,
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })
    expect(method).toHaveBeenCalledTimes(1)

    goOnline()

    expect(method).toHaveBeenCalledTimes(2)
    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })
  })

  it('should not refetch on reconnect when refetchOnReconnect is false', async () => {
    const method = vi.fn<typeof fakeSuccessPromise>(fakeSuccessPromise)
    const { result } = renderHook(
      () => useDataLoader('reconnect-disabled', method, { dataLifetime: 0, refetchOnReconnect: false }),
      { wrapper },
    )

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    goOnline()

    expect(method).toHaveBeenCalledTimes(1)
  })
})

describe('refetch defaults and overrides', () => {
  it('should use the provider defaultRefetchOnFocus when the hook does not define it', async () => {
    const method = vi.fn<typeof fakeSuccessPromise>(fakeSuccessPromise)
    const { result } = renderHook(() => useDataLoader('default-focus', method, { dataLifetime: 0 }), {
      wrapper: wrapperWithDefaultRefetchOnFocus,
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    focusWindow()

    expect(method).toHaveBeenCalledTimes(2)
  })

  it('should let the hook override the provider defaultRefetchOnFocus', async () => {
    const method = vi.fn<typeof fakeSuccessPromise>(fakeSuccessPromise)
    const { result } = renderHook(
      () => useDataLoader('default-focus-override', method, { dataLifetime: 0, refetchOnFocus: false }),
      { wrapper: wrapperWithDefaultRefetchOnFocus },
    )

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    focusWindow()

    expect(method).toHaveBeenCalledTimes(1)
  })

  it('should use the provider defaultRefetchOnReconnect when the hook does not define it', async () => {
    const method = vi.fn<typeof fakeSuccessPromise>(fakeSuccessPromise)
    const { result } = renderHook(() => useDataLoader('default-reconnect', method, { dataLifetime: 0 }), {
      wrapper: wrapperWithoutRefetchOnReconnect,
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    goOnline()

    expect(method).toHaveBeenCalledTimes(1)
  })

  it('should let the hook override the provider defaultRefetchOnReconnect', async () => {
    const method = vi.fn<typeof fakeSuccessPromise>(fakeSuccessPromise)
    const { result } = renderHook(
      () => useDataLoader('default-reconnect-override', method, { dataLifetime: 0, refetchOnReconnect: true }),
      { wrapper: wrapperWithoutRefetchOnReconnect },
    )

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    goOnline()

    expect(method).toHaveBeenCalledTimes(2)
  })
})

describe('refetch scoping', () => {
  it('should not refetch requests without mounted hooks', async () => {
    const method = vi.fn<typeof fakeSuccessPromise>(fakeSuccessPromise)
    const { result, unmount } = renderHook(
      () => useDataLoader('scope-unmounted', method, { dataLifetime: 0, refetchOnFocus: 'always' }),
      { wrapper },
    )

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
    expect(method).toHaveBeenCalledTimes(1)

    unmount()
    focusWindow()
    goOnline()

    expect(method).toHaveBeenCalledTimes(1)
  })

  it('should not refetch disabled hooks', () => {
    const method = vi.fn<typeof fakeSuccessPromise>(fakeSuccessPromise)
    const { result } = renderHook(
      () =>
        useDataLoader('scope-disabled', method, {
          enabled: false,
          refetchOnFocus: 'always',
          refetchOnReconnect: 'always',
        }),
      { wrapper },
    )

    expect(result.current.isIdle).toBe(true)
    expect(method).toHaveBeenCalledTimes(0)

    focusWindow()
    goOnline()

    expect(method).toHaveBeenCalledTimes(0)
  })

  it('should not launch an already in flight request twice on repeated focus', async () => {
    const method = vi.fn<typeof fakeSuccessPromise>(fakeSuccessPromise)
    const { result } = renderHook(
      () => useDataLoader('scope-in-flight', method, { dataLifetime: 0, refetchOnFocus: 'always' }),
      { wrapper },
    )

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
    expect(method).toHaveBeenCalledTimes(1)

    focusWindow()
    focusWindow()

    expect(method).toHaveBeenCalledTimes(2)
    await waitFor(() => {
      expect(result.current.isFetching).toBe(false)
    })
  })
})
