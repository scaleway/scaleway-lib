import { render, screen } from '@testing-library/react'
import { act, renderHook } from '@testing-library/react-hooks'
import React, { ReactNode } from 'react'
import DataLoaderProvider, { useDataLoaderContext } from '../DataLoaderProvider'
import { KEY_IS_NOT_STRING_ERROR, StatusEnum } from '../constants'

const PROMISE_TIMEOUT = 100
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
    const method = jest.fn(() => Promise.resolve(true))
    const { result, waitForNextUpdate } = renderHook(useDataLoaderContext, {
      wrapper,
    })
    expect(result.current.getRequest('test')).toBeUndefined()

    act(() => {
      result.current.addRequest('test', {
        method,
      })
    })

    expect(Object.values(result.current.getReloads()).length).toBe(1)
    expect(result.current.getRequest('test')).toBeDefined()
    expect(result.current.getRequest('test')?.status).toBe(StatusEnum.IDLE)
    act(() => {
      result.current.getRequest('test')?.launch()
    })
    expect(method).toBeCalledTimes(1)
    await waitForNextUpdate()
    expect(result.current.getCachedData('test')).toBe(true)
    await act(async () => {
      await result.current.reload('test')
    })
  })

  test('should add request with cache key prefix', async () => {
    const method = jest.fn(() => Promise.resolve(true))
    const { result, waitForNextUpdate } = renderHook(useDataLoaderContext, {
      wrapper: wrapperWithCacheKey,
    })
    expect(result.current.getRequest('test')).toBeUndefined()

    act(() => {
      result.current.addRequest('test', {
        method,
      })
    })

    expect(Object.values(result.current.getReloads()).length).toBe(1)
    expect(result.current.getRequest('test')).toBeDefined()
    expect(result.current.getRequest('test')?.status).toBe(StatusEnum.IDLE)
    act(() => {
      result.current.getRequest('test')?.launch()
    })
    expect(method).toBeCalledTimes(1)
    await waitForNextUpdate()
    expect(result.current.getCachedData('test')).toBe(true)
    await act(async () => {
      await result.current.reload('test')
    })
  })

  test('should add request with result is null', async () => {
    const method = jest.fn(() => Promise.resolve(null))
    const { result, waitForNextUpdate } = renderHook(useDataLoaderContext, {
      wrapper,
    })
    act(() => {
      result.current.addRequest('test', {
        enabled: true,
        method,
      })
    })
    await waitForNextUpdate()
    expect(method).toBeCalledTimes(1)
    const reloads = result.current.getReloads()
    expect(reloads).toHaveProperty('test')
    const testReload = result.current.getReloads('test')
    expect(testReload).toBeDefined()
    expect(result.current.getCachedData('test')).toBe(null)
    expect(result.current.getCachedData()).toStrictEqual({ test: null })
    await act(async () => {
      await reloads.test()
      await testReload?.()
      await result.current.reloadAll()
      result.current.clearCachedData('test')
      result.current.clearAllCachedData()
      result.current.clearRequest('test')
    })
    try {
      // @ts-expect-error Should throw an error
      result.current.clearCachedData(3)
    } catch (e) {
      expect((e as Error).message).toBe(KEY_IS_NOT_STRING_ERROR)
    }
    expect(result.current.getReloads()).not.toHaveProperty('test')
    expect(result.current.getReloads('test')).not.toBeDefined()
    expect(result.current.getCachedData('test')).toBe(undefined)
    expect(result.current.getCachedData()).not.toStrictEqual({
      test: undefined,
    })
    try {
      // @ts-expect-error Should throw an error
      result.current.clearRequest(3)
    } catch (e) {
      expect((e as Error).message).toBe(KEY_IS_NOT_STRING_ERROR)
    }
    try {
      // @ts-expect-error Should throw an error
      await result.current.reload(3)
    } catch (e) {
      expect((e as Error).message).toBe(KEY_IS_NOT_STRING_ERROR)
    }
  })

  test('should add request with bad key', () => {
    const method = jest.fn(() => Promise.resolve(true))
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
      () =>
        new Promise(resolve =>
          setTimeout(() => resolve(true), PROMISE_TIMEOUT),
        ),
    )
    const { result } = renderHook(useDataLoaderContext, {
      wrapper: wrapperWith2ConcurrentRequests,
    })
    act(() => {
      result.current.addRequest('test', {
        enabled: true,
        method,
      })
      result.current.addRequest('test-2', {
        enabled: true,
        method,
      })
      result.current.addRequest('test-3', {
        enabled: true,
        method,
      })
      result.current.addRequest('test-4', {
        enabled: true,
        method,
      })
      result.current.addRequest('test-5', {
        enabled: true,
        method,
      })
    })
    expect(method).toBeCalledTimes(2)
    await new Promise(resolve => {
      setTimeout(resolve, PROMISE_TIMEOUT * 2)
    })
    expect(method).toBeCalledTimes(4)
    await new Promise(resolve => {
      setTimeout(resolve, PROMISE_TIMEOUT * 2)
    })
    expect(method).toBeCalledTimes(5)
  })
})
