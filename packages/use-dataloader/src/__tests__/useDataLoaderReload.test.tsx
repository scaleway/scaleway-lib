import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, test, vi } from 'vitest'
import DataLoaderProvider from '../DataLoaderProvider'
import { useDataLoaderReload } from '../useDataLoaderReload'
import { useDataLoader } from '../useDataLoader'
import type { UseDataLoaderConfig } from '../types'

const PROMISE_TIMEOUT = 50

const fakeSuccessPromise = async () =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(true)
    }, PROMISE_TIMEOUT)
  })

const wrapper = ({ children }: { children?: ReactNode }) => (
  <DataLoaderProvider>{children}</DataLoaderProvider>
)

describe('useDataLoaderReload', () => {
  test('should reload functions work with actual data loaders', async () => {
    const method1 = vi.fn(fakeSuccessPromise)
    const method2 = vi.fn(fakeSuccessPromise)
    const method3 = vi.fn(fakeSuccessPromise)
    const method4 = vi.fn(fakeSuccessPromise)

    const config: UseDataLoaderConfig<unknown, unknown> = {
      enabled: true,
    }

    const { result } = renderHook(
      () => {
        const dataLoaderReload = useDataLoaderReload()
        const loader1 = useDataLoader('test-key-1', method1, config)
        const loader2 = useDataLoader('test-key-2', method2, config)
        const loader3 = useDataLoader(['group', 'value', 1], method3, config)
        const loader4 = useDataLoader(['group', 'value', 2], method4, config)

        return {
          ...dataLoaderReload,
          loader1,
          loader2,
          loader3,
          loader4,
        }
      },
      {
        wrapper,
      },
    )

    await waitFor(() => {
      expect(result.current.loader1.isSuccess).toBeTruthy()
      expect(result.current.loader2.isSuccess).toBeTruthy()
      expect(result.current.loader3.isSuccess).toBeTruthy()
      expect(result.current.loader4.isSuccess).toBeTruthy()
    })

    method1.mockClear()
    method2.mockClear()
    method3.mockClear()
    method4.mockClear()

    await result.current.reload('test-key-1').catch(() => null)
    await waitFor(() => {
      expect(method1).toHaveBeenCalledOnce()
      expect(method2).not.toHaveBeenCalled()
      expect(method3).not.toHaveBeenCalled()
      expect(method4).not.toHaveBeenCalled()
    })

    method1.mockClear()
    method2.mockClear()
    method3.mockClear()
    method4.mockClear()

    await result.current.reloadAll().catch(() => null)
    await waitFor(() => {
      expect(method1).toHaveBeenCalledOnce()
      expect(method2).toHaveBeenCalledOnce()
      expect(method3).toHaveBeenCalledOnce()
      expect(method4).toHaveBeenCalledOnce()
    })

    method1.mockClear()
    method2.mockClear()
    method3.mockClear()
    method4.mockClear()

    await result.current.reloadGroup(['group']).catch(() => null)
    await waitFor(() => {
      expect(method1).not.toHaveBeenCalled()
      expect(method2).not.toHaveBeenCalled()
      expect(method3).toHaveBeenCalledOnce()
      expect(method4).toHaveBeenCalledOnce()
    })
  })
})
