import { render, screen } from '@testing-library/react'
import { act, renderHook } from '@testing-library/react-hooks'
import React, { ReactNode } from 'react'
import DataLoaderProvider, { useDataLoaderContext } from '../DataLoaderProvider'
import { KEY_IS_NOT_STRING_ERROR, StatusEnum } from '../constants'

const TEST_KEY = 'test'
const PROMISE_TIMEOUT = 5
const fakePromise = () =>
  new Promise(resolve => setTimeout(() => resolve(true), PROMISE_TIMEOUT))

const fakeNullPromise = () =>
  new Promise(resolve => setTimeout(() => resolve(null), PROMISE_TIMEOUT))

const wrapper = ({ children }: { children: ReactNode }) => (
  <DataLoaderProvider>{children}</DataLoaderProvider>
)

const wrapperWithCacheKey = ({ children }: { children?: React.ReactNode }) => (
  <DataLoaderProvider cacheKeyPrefix="sample">{children}</DataLoaderProvider>
)

const wrapperWith2ConcurrentRequests = ({
  children,
}: {
  children?: React.ReactNode
}) => (
  <DataLoaderProvider maxConcurrentRequests={2}>{children}</DataLoaderProvider>
)

describe('DataLoaderProvider', () => {
  test('should render correctly', () => {
    render(<DataLoaderProvider>Test</DataLoaderProvider>)
    expect(screen.getByText('Test')).toBeTruthy()
  })

  test('should add request', async () => {
    const method = jest.fn(fakePromise)
    const { result, waitFor } = renderHook(useDataLoaderContext, {
      wrapper,
    })
    expect(result.current.getRequest(TEST_KEY)).toBeUndefined()

    act(() => {
      result.current.addRequest(TEST_KEY, {
        method,
      })
    })

    expect(Object.values(result.current.getReloads()).length).toBe(1)
    const testRequest = result.current.getRequest(TEST_KEY)
    expect(testRequest).toBeDefined()
    expect(testRequest?.status).toBe(StatusEnum.IDLE)
    act(() => {
      testRequest?.launch()
    })
    expect(method).toBeCalledTimes(1)
    expect(testRequest.status).toBe(StatusEnum.LOADING)
    await waitFor(() => expect(testRequest.status).toBe(StatusEnum.SUCCESS))
    expect(result.current.getCachedData(TEST_KEY)).toBe(true)
    await act(async () => {
      await result.current.reload(TEST_KEY)
    })

    const observer = jest.fn()
    act(() => {
      const request = result.current.getRequest(TEST_KEY)
      request.addObserver(observer)
      expect(request.getObserversCount()).toBe(1)
    })
  })

  test('should add request with cache key prefix', async () => {
    const method = jest.fn(fakePromise)
    const { result, waitFor } = renderHook(useDataLoaderContext, {
      wrapper: wrapperWithCacheKey,
    })
    expect(result.current.getRequest(TEST_KEY)).toBeUndefined()

    act(() => {
      result.current.addRequest(TEST_KEY, {
        method,
      })
    })

    const testRequest = result.current.getRequest(TEST_KEY)
    expect(Object.values(result.current.getReloads()).length).toBe(1)
    expect(testRequest).toBeDefined()
    expect(testRequest?.status).toBe(StatusEnum.IDLE)
    act(() => {
      testRequest?.launch()
    })
    expect(method).toBeCalledTimes(1)
    await waitFor(() => expect(testRequest.getData()).toBe(true))
    expect(result.current.getCachedData(TEST_KEY)).toBe(true)
    await act(async () => {
      await result.current.reload(TEST_KEY)
    })
  })

  test('should add request with result is null', async () => {
    const method = jest.fn(fakeNullPromise)
    const { result, waitFor } = renderHook(useDataLoaderContext, {
      wrapper,
    })
    act(() => {
      result.current.addRequest(TEST_KEY, {
        enabled: true,
        method,
      })
    })
    expect(method).toBeCalledTimes(1)
    await waitFor(() =>
      expect(result.current.getRequest(TEST_KEY).status).toBe(
        StatusEnum.SUCCESS,
      ),
    )
    const reloads = result.current.getReloads()
    expect(reloads).toHaveProperty(TEST_KEY)
    const testReload = result.current.getReloads(TEST_KEY)
    expect(result.current.getCachedData(TEST_KEY)).toBe(undefined)
    expect(result.current.getCachedData()).toStrictEqual({ test: undefined })
    expect(result.current.getRequest(TEST_KEY)).toBeDefined()
    await act(async () => {
      await reloads.test()
    })
    expect(method).toBeCalledTimes(2)
    expect(testReload).toBeDefined()
    await act(async () => {
      await (testReload as () => Promise<unknown>)()
    })
    expect(method).toBeCalledTimes(3)
    await act(result.current.reloadAll)
    expect(method).toBeCalledTimes(4)
    act(() => result.current.clearCachedData(TEST_KEY))
    act(() => result.current.clearCachedData('unknown'))
    expect(result.current.getCachedData(TEST_KEY)).toBeUndefined()
    act(() => result.current.clearAllCachedData())
    expect(result.current.getCachedData()).toStrictEqual({ test: undefined })
    await waitFor(() =>
      expect(result.current.getRequest(TEST_KEY)).toBeUndefined(),
    )

    try {
      // @ts-expect-error Should throw an error
      result.current.clearCachedData(3)
    } catch (e) {
      expect((e as Error).message).toBe(KEY_IS_NOT_STRING_ERROR)
    }
    expect(result.current.getReloads()).not.toHaveProperty(TEST_KEY)
    expect(result.current.getReloads(TEST_KEY)).not.toBeDefined()
    expect(result.current.getCachedData(TEST_KEY)).toBe(undefined)
    expect(result.current.getCachedData()).not.toStrictEqual({
      test: undefined,
    })
    try {
      // @ts-expect-error Should throw an error
      await result.current.reload(3)
    } catch (e) {
      expect((e as Error).message).toBe(KEY_IS_NOT_STRING_ERROR)
    }
  })

  test('should add request with bad key', () => {
    const method = jest.fn(fakePromise)
    const { result } = renderHook(useDataLoaderContext, {
      wrapper,
    })
    try {
      act(() => {
        // @ts-expect-error used because we test with bad key
        result.current.addRequest(3, {
          method,
        })
      })
    } catch (e) {
      expect((e as Error).message).toBe(KEY_IS_NOT_STRING_ERROR)
    }
  })

  test('should delay max concurrent request', async () => {
    const method = jest.fn(
      () => new Promise(resolve => setTimeout(() => resolve(true), 100)),
    )
    const { result, waitFor } = renderHook(useDataLoaderContext, {
      wrapper: wrapperWith2ConcurrentRequests,
    })
    act(() => {
      result.current.addRequest(TEST_KEY, {
        enabled: true,
        method,
      })
      result.current.addRequest(`${TEST_KEY}-2`, {
        enabled: true,
        method,
      })
      result.current.addRequest(`${TEST_KEY}-3`, {
        enabled: true,
        method,
      })
      result.current.addRequest(`${TEST_KEY}-4`, {
        enabled: true,
        method,
      })
      result.current.addRequest(`${TEST_KEY}-5`, {
        enabled: true,
        method,
      })
    })
    expect(method).toBeCalledTimes(2)
    await waitFor(() => expect(method).toBeCalledTimes(4))
    await waitFor(() => expect(method).toBeCalledTimes(5))
  })
})
