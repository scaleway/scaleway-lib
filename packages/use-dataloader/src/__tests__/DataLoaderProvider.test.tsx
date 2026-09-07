import { render, renderHook, screen, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { StatusEnum } from '../constants'
import DataLoaderProvider, { useDataLoaderContext } from '../DataLoaderProvider'

const TEST_KEY = 'test'
const PROMISE_TIMEOUT = 5
const fakePromise = async () =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(true)
    }, PROMISE_TIMEOUT)
  })

const fakeNullPromise = async () =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(null)
    }, PROMISE_TIMEOUT)
  })

const wrapper = ({ children }: { children: ReactNode }) => <DataLoaderProvider>{children}</DataLoaderProvider>

const wrapperWithCacheKey = ({ children }: { children?: ReactNode }) => (
  <DataLoaderProvider cacheKeyPrefix="sample">{children}</DataLoaderProvider>
)

const wrapperWith2ConcurrentRequests = ({ children }: { children?: ReactNode }) => (
  <DataLoaderProvider maxConcurrentRequests={2}>{children}</DataLoaderProvider>
)

describe('dataLoaderProvider', () => {
  it('should render correctly', () => {
    render(<DataLoaderProvider>Test</DataLoaderProvider>)
    expect(screen.getByText('Test')).toBeDefined()
  })

  it('should add request', async () => {
    const method = vi.fn<typeof fakePromise>(fakePromise)
    const { result, rerender } = renderHook(useDataLoaderContext, {
      wrapper,
    })
    expect(result.current.getRequest(TEST_KEY)).toBeUndefined()

    result.current.addRequest(TEST_KEY, {
      method,
    })

    expect(Object.values(result.current.getReloads())).toHaveLength(1)
    const testRequest = result.current.getRequest(TEST_KEY)
    testRequest.addObserver(rerender)

    expect(testRequest).toBeDefined()
    expect(testRequest.status).toBe(StatusEnum.IDLE)
    // oxlint-disable-next-line  @typescript-eslint/no-floating-promises
    testRequest.load().catch(undefined)
    expect(testRequest.status).toBe(StatusEnum.LOADING)
    expect(method).toHaveBeenCalledTimes(1)
    await waitFor(() => {
      expect(testRequest.status).toBe(StatusEnum.SUCCESS)
    })
    expect(result.current.getCachedData(TEST_KEY)).toBe(true)
    // oxlint-disable-next-line  @typescript-eslint/no-floating-promises
    result.current.reload(TEST_KEY).catch(undefined)
    await waitFor(() => {
      expect(testRequest.status).toBe(StatusEnum.LOADING)
    })
    await waitFor(() => {
      expect(testRequest.status).toBe(StatusEnum.SUCCESS)
    })
  })

  it('should add request with cache key prefix', async () => {
    const method = vi.fn<typeof fakePromise>(fakePromise)
    const { result } = renderHook(useDataLoaderContext, {
      wrapper: wrapperWithCacheKey,
    })
    expect(result.current.getRequest(TEST_KEY)).toBeUndefined()

    result.current.addRequest(TEST_KEY, {
      method,
    })

    const testRequest = result.current.getRequest(TEST_KEY)
    expect(Object.values(result.current.getReloads())).toHaveLength(1)
    expect(testRequest).toBeDefined()
    expect(testRequest.status).toBe(StatusEnum.IDLE)
    // oxlint-disable-next-line  @typescript-eslint/no-floating-promises
    testRequest.load().catch(undefined)
    await waitFor(() => {
      expect(testRequest.status).toBe(StatusEnum.SUCCESS)
    })
    expect(method).toHaveBeenCalledTimes(1)
    expect(testRequest.data).toBe(true)
    expect(result.current.getCachedData(TEST_KEY)).toBe(true)
    // oxlint-disable-next-line  @typescript-eslint/no-floating-promises
    result.current.reload(TEST_KEY).catch(undefined)
    await waitFor(() => {
      expect(testRequest.status).toBe(StatusEnum.LOADING)
    })
    await waitFor(() => {
      expect(testRequest.status).toBe(StatusEnum.SUCCESS)
    })
  })

  it('should add request with result is null', async () => {
    const method = vi.fn<typeof fakeNullPromise>(fakeNullPromise)
    const { result } = renderHook(useDataLoaderContext, {
      wrapper,
    })
    const request = result.current.getOrAddRequest(TEST_KEY, {
      method,
    })
    await request.load()
    expect(method).toHaveBeenCalledTimes(1)
    expect(result.current.getRequest(TEST_KEY).status).toBe(StatusEnum.SUCCESS)
    const reloads = result.current.getReloads()
    expect(reloads).toHaveProperty(TEST_KEY)
    const testReload = result.current.getReloads(TEST_KEY)
    expect(testReload).toBeDefined()
    expect(testReload).toBeDefined()
    await expect(testReload!()).resolves.toBeNull()
    expect(result.current.getCachedData(TEST_KEY)).toBeNull()
    expect(result.current.getCachedData()).toStrictEqual({ test: null })
    expect(result.current.getRequest(TEST_KEY)).toBeDefined()
    const unknownReload = result.current.getReloads('unknown')
    expect(unknownReload).toBeUndefined()
    await reloads['test']?.()
    expect(method).toHaveBeenCalledTimes(3)
    await result.current.reloadAll()
    expect(method).toHaveBeenCalledTimes(4)
    result.current.clearCachedData(TEST_KEY)
    result.current.clearCachedData('unknown')
    expect(result.current.getCachedData(TEST_KEY)).toBeUndefined()
    result.current.clearAllCachedData()
    expect(result.current.getCachedData()).toStrictEqual({ test: undefined })
  })

  it('should delay max concurrent request', async () => {
    const method = vi.fn<() => Promise<boolean>>(
      async () =>
        new Promise(resolve => {
          setTimeout(() => {
            resolve(true)
          }, 100)
        }),
    )
    const { result } = renderHook(useDataLoaderContext, {
      wrapper: wrapperWith2ConcurrentRequests,
    })
    const requests = [
      result.current.addRequest(TEST_KEY, {
        method,
      }),
      result.current.addRequest(`${TEST_KEY}-2`, {
        method,
      }),
      result.current.addRequest(`${TEST_KEY}-3`, {
        method,
      }),
      result.current.addRequest(`${TEST_KEY}-4`, {
        method,
      }),
      result.current.addRequest(`${TEST_KEY}-5`, {
        method,
      }),
    ]

    for (const request of requests) {
      request.load().catch(() => null)
    }

    expect(method).toHaveBeenCalledTimes(2)
    await waitFor(() => {
      expect(method).toHaveBeenCalledTimes(4)
    })
    await waitFor(() => {
      expect(method).toHaveBeenCalledTimes(5)
    })
  })

  it('should reload group', async () => {
    const method1 = vi.fn<typeof fakePromise>(fakePromise)
    const method2 = vi.fn<typeof fakePromise>(fakePromise)
    const method3 = vi.fn<typeof fakePromise>(fakePromise)

    const { result } = renderHook(useDataLoaderContext, {
      wrapper,
    })
    result.current.addRequest(TEST_KEY, {
      method: method1,
    })
    result.current.addRequest(`${TEST_KEY}-2`, {
      method: method2,
    })
    result.current.addRequest('other', {
      method: method3,
    })

    await result.current.reloadGroup(TEST_KEY)
    expect(method1).toHaveBeenCalledTimes(1)
    expect(method2).toHaveBeenCalledTimes(1)
    expect(method3).not.toHaveBeenCalledTimes(1)

    method1.mockClear()
    method2.mockClear()
    method3.mockClear()

    await result.current.reloadGroup('other')
    expect(method1).not.toHaveBeenCalledTimes(1)
    expect(method2).not.toHaveBeenCalledTimes(1)
    expect(method3).toHaveBeenCalledTimes(1)

    method1.mockClear()
    method2.mockClear()
    method3.mockClear()

    await result.current.reloadAll()
    expect(method1).toHaveBeenCalledTimes(1)
    expect(method2).toHaveBeenCalledTimes(1)
    expect(method3).toHaveBeenCalledTimes(1)
  })

  it('should reload all active requests', async () => {
    const method1 = vi.fn<typeof fakePromise>(fakePromise)
    const method2 = vi.fn<typeof fakePromise>(fakePromise)
    const method3 = vi.fn<typeof fakePromise>(fakePromise)

    const { result } = renderHook(useDataLoaderContext, {
      wrapper,
    })
    const request1 = result.current.addRequest(TEST_KEY, {
      method: method1,
    })
    result.current.addRequest(`${TEST_KEY}-2`, {
      method: method2,
    })
    result.current.addRequest('other', {
      method: method3,
    })

    request1.addObserver(() => undefined)

    await result.current.reloadAllActive()
    expect(method1).toHaveBeenCalledTimes(1)
    expect(method2).not.toHaveBeenCalledTimes(1)
    expect(method3).not.toHaveBeenCalledTimes(1)
  })

  it('should reload group active requests', async () => {
    const method1 = vi.fn<typeof fakePromise>(fakePromise)
    const method2 = vi.fn<typeof fakePromise>(fakePromise)
    const method3 = vi.fn<typeof fakePromise>(fakePromise)

    const { result } = renderHook(useDataLoaderContext, {
      wrapper,
    })
    const request1 = result.current.addRequest(TEST_KEY, {
      method: method1,
    })
    result.current.addRequest(`${TEST_KEY}-2`, {
      method: method2,
    })
    const request3 = result.current.addRequest('other', {
      method: method3,
    })

    request1.addObserver(() => undefined)
    request3.addObserver(() => undefined)

    await result.current.reloadGroupActive(TEST_KEY)
    expect(method1).toHaveBeenCalledTimes(1)
    expect(method2).not.toHaveBeenCalledTimes(1)
    expect(method3).not.toHaveBeenCalledTimes(1)

    method1.mockClear()
    method2.mockClear()
    method3.mockClear()

    await result.current.reloadGroupActive('other')
    expect(method1).not.toHaveBeenCalledTimes(1)
    expect(method2).not.toHaveBeenCalledTimes(1)
    expect(method3).toHaveBeenCalledTimes(1)
  })
})
