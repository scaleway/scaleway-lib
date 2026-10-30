import { act, render, renderHook, waitFor } from '@testing-library/react'
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

const wrapper = ({ children }: { children?: ReactNode }) => <DataLoaderProvider>{children}</DataLoaderProvider>

describe('dataUpdatedAt', () => {
  it('should be undefined before the first success then set to the fetch timestamp', async () => {
    const method = vi.fn<typeof fakeSuccessPromise>(fakeSuccessPromise)
    const { result } = renderHook(() => useDataLoader('dataUpdatedAt-basic', method), { wrapper })

    expect(result.current.dataUpdatedAt).toBeUndefined()

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.dataUpdatedAt).toBeGreaterThan(0)
  })

  it('should be updated on reload', async () => {
    const method = vi.fn<typeof fakeSuccessPromise>(fakeSuccessPromise)
    const { result } = renderHook(() => useDataLoader('dataUpdatedAt-reload', method), { wrapper })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    const beforeReload = Date.now()

    await act(async () => {
      await result.current.reload()
    })

    expect(result.current.dataUpdatedAt).toBeGreaterThanOrEqual(beforeReload)
  })

  it('should keep the timestamp of the cached data when remounting with fresh data', async () => {
    const method = vi.fn<typeof fakeSuccessPromise>(fakeSuccessPromise)
    const last: { current?: { dataUpdatedAt?: number } } = {}

    const Probe = () => {
      const { dataUpdatedAt } = useDataLoader('dataUpdatedAt-remount', method, { dataLifetime: 10_000 })
      last.current = { dataUpdatedAt }

      return null
    }

    const { rerender } = render(
      <DataLoaderProvider>
        <Probe />
      </DataLoaderProvider>,
    )

    await waitFor(() => {
      expect(last.current?.dataUpdatedAt).toBeGreaterThan(0)
    })
    const firstTimestamp = last.current?.dataUpdatedAt
    expect(method).toHaveBeenCalledTimes(1)

    // Unmount, then remount while the data is still fresh per dataLifetime:
    // the hook must serve the cache without refetching, and the exposed
    // timestamp must still be the one of the original fetch
    rerender(<DataLoaderProvider>{null}</DataLoaderProvider>)
    rerender(
      <DataLoaderProvider>
        <Probe />
      </DataLoaderProvider>,
    )

    expect(method).toHaveBeenCalledTimes(1)
    expect(last.current?.dataUpdatedAt).toBeGreaterThan(0)
    expect(last.current?.dataUpdatedAt).toBe(firstTimestamp)
  })
})
