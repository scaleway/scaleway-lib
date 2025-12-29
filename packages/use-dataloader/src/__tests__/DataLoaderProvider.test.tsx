import { render, renderHook, screen, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, test, vi } from 'vitest'
import DataLoaderProvider, { useDataLoaderContext } from '../DataLoaderProvider'
import { KEY_IS_NOT_STRING_ERROR, StatusEnum } from '../constants'

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

const wrapper = ({ children }: { children: ReactNode }) => (
  <DataLoaderProvider>{children}</DataLoaderProvider>
)

const wrapperWithCacheKey = ({ children }: { children?: ReactNode }) => (
  <DataLoaderProvider cacheKeyPrefix="sample">{children}</DataLoaderProvider>
)

const wrapperWith2ConcurrentRequests = ({
  children,
}: {
  children?: ReactNode
}) => (
  <DataLoaderProvider maxConcurrentRequests={2}>{children}</DataLoaderProvider>
)

describe('dataLoaderProvider', () => {
  test('should render correctly', () => {
    render(<DataLoaderProvider>Test</DataLoaderProvider>)
    expect(screen.getByText('Test')).toBeTruthy()
  })

  test('should add request', async () => {
    const method = vi.fn(fakePromise)
    const { result, rerender } = renderHook(useDataLoaderContext, {
      wrapper,
    })
    expect(result.current.getRequest(TEST_KEY)).toBeUndefined()

    result.current.addRequest(TEST_KEY, {
      method,
    })

    expect(Object.values(result.current.getReloads()).length).toBe(1)
    const testRequest = result.current.getRequest(TEST_KEY)
    testRequest.addObserver(rerender)

    expect(testRequest).toBeDefined()
    expect(testRequest.status).toBe(StatusEnum.IDLE)
    // oxlint-disable-next-line  @typescript-eslint/no-floating-promises
    testRequest.load().catch(undefined)
    expect(testRequest.status).toBe(StatusEnum.LOADING)
    expect(method).toBeCalledTimes(1)
    await waitFor(() => {
      expect(testRequest.status).toBe(StatusEnum.SUCCESS)
    })
    expect(result.current.getCachedData(TEST_KEY)).toBeTruthy()
    try {
      // @ts-expect-error Should throw an error
      await result.current.reload(3).catch(undefined)
      throw new Error('It should throw an error')
    } catch (error) {
      expect((error as Error).message).toBe(KEY_IS_NOT_STRING_ERROR)
    }
    // oxlint-disable-next-line  @typescript-eslint/no-floating-promises
    result.current.reload(TEST_KEY).catch(undefined)
    await waitFor(() => {
      expect(testRequest.status).toBe(StatusEnum.LOADING)
    })
    await waitFor(() => {
      expect(testRequest.status).toBe(StatusEnum.SUCCESS)
    })
    try {
      // @ts-expect-error Should throw an error
      result.current.clearCachedData(3)
      throw new Error('It should throw an error')
    } catch (error) {
      expect((error as Error).message).toBe(KEY_IS_NOT_STRING_ERROR)
      expect(result.current.getCachedData(TEST_KEY)).toBeTruthy()
    }
  })

  test('should add request with cache key prefix', async () => {
    const method = vi.fn(fakePromise)
    const { result } = renderHook(useDataLoaderContext, {
      wrapper: wrapperWithCacheKey,
    })
    expect(result.current.getRequest(TEST_KEY)).toBeUndefined()

    result.current.addRequest(TEST_KEY, {
      method,
    })

    const testRequest = result.current.getRequest(TEST_KEY)
    expect(Object.values(result.current.getReloads()).length).toBe(1)
    expect(testRequest).toBeDefined()
    expect(testRequest.status).toBe(StatusEnum.IDLE)
    // oxlint-disable-next-line  @typescript-eslint/no-floating-promises
    testRequest.load().catch(undefined)
    await waitFor(() => {
      expect(testRequest.status).toBe(StatusEnum.SUCCESS)
    })
    expect(method).toBeCalledTimes(1)
    expect(testRequest.data).toBeTruthy()
    expect(result.current.getCachedData(TEST_KEY)).toBeTruthy()
    // oxlint-disable-next-line  @typescript-eslint/no-floating-promises
    result.current.reload(TEST_KEY).catch(undefined)
    await waitFor(() => {
      expect(testRequest.status).toBe(StatusEnum.LOADING)
    })
    await waitFor(() => {
      expect(testRequest.status).toBe(StatusEnum.SUCCESS)
    })
  })

  test('should add request with result is null', async () => {
    const method = vi.fn(fakeNullPromise)
    const { result } = renderHook(useDataLoaderContext, {
      wrapper,
    })
    const request = result.current.getOrAddRequest(TEST_KEY, {
      method,
    })
    await request.load()
    expect(method).toBeCalledTimes(1)
    expect(result.current.getRequest(TEST_KEY).status).toBe(StatusEnum.SUCCESS)
    const reloads = result.current.getReloads()
    expect(reloads).toHaveProperty(TEST_KEY)
    const testReload = result.current.getReloads(TEST_KEY)
    expect(testReload).toBeDefined()
    if (testReload) {
      expect(await testReload()).toBeNull()
    } else {
      throw new Error('It shoulded be defined')
    }
    expect(result.current.getCachedData(TEST_KEY)).toBe(null)
    expect(result.current.getCachedData()).toStrictEqual({ test: null })
    expect(result.current.getRequest(TEST_KEY)).toBeDefined()
    const unknownReload = result.current.getReloads('unknown')
    expect(unknownReload).toBeUndefined()
    await reloads['test']?.()
    expect(method).toBeCalledTimes(3)
    await result.current.reloadAll()
    expect(method).toBeCalledTimes(4)
    result.current.clearCachedData(TEST_KEY)
    result.current.clearCachedData('unknown')
    expect(result.current.getCachedData(TEST_KEY)).toBeUndefined()
    result.current.clearAllCachedData()
    expect(result.current.getCachedData()).toStrictEqual({ test: undefined })
  })

  test('should add request with bad key', () => {
    const method = vi.fn(fakePromise)
    const { result } = renderHook(useDataLoaderContext, {
      wrapper,
    })
    try {
      // @ts-expect-error used because we test with bad key
      result.current.addRequest(3, {
        method,
      })
    } catch (error) {
      expect((error as Error).message).toBe(KEY_IS_NOT_STRING_ERROR)
    }
  })

  test('should delay max concurrent request', async () => {
    const method = vi.fn(
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
    ;[
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
    ].forEach(request => {
      // oxlint-disable-next-line  @typescript-eslint/no-floating-promises
      request.load().catch(undefined)
    })
    expect(method).toBeCalledTimes(2)
    await waitFor(() => {
      expect(method).toBeCalledTimes(4)
    })
    await waitFor(() => {
      expect(method).toBeCalledTimes(5)
    })
  })
})
