import { render, screen } from '@testing-library/react'
import { act, renderHook } from '@testing-library/react-hooks'
import React, { ReactNode } from 'react'
import DataLoaderProvider, { useDataLoaderContext } from '../DataLoaderProvider'
import { KEY_IS_NOT_STRING_ERROR, StatusEnum } from '../constants'

const wrapper = ({ children }: { children: ReactNode }) => (
  <DataLoaderProvider>{children}</DataLoaderProvider>
)

const wrapperWithCacheKey = ({ children }: { children?: React.ReactNode }) => (
  <DataLoaderProvider cacheKeyPrefix="sample">{children}</DataLoaderProvider>
)

describe('DataLoaderProvider', () => {
  test('should render correctly', () => {
    render(<DataLoaderProvider>Test</DataLoaderProvider>)
    expect(screen.getByText('Test')).toBeTruthy()
  })
  test('should add cached data', () => {
    const { result } = renderHook(useDataLoaderContext, { wrapper })
    expect(result.current.getCachedData()).toStrictEqual({})

    act(() => {
      result.current.addCachedData('test', undefined)
      result.current.addCachedData('test', 'test')
    })

    try {
      // @ts-expect-error used because we test with bad key
      result.current.addCachedData(3, 'testWrong')
      throw new Error('It should throw an error before')
    } catch (err) {
      expect((err as Error).message).toBe(KEY_IS_NOT_STRING_ERROR)
    }

    expect(
      Object.values(result.current.getCachedData() as Record<string, unknown>)
        .length,
    ).toBe(1)
    expect(
      (result.current.getCachedData() as Record<string, unknown>).test,
    ).toBe('test')
  })

  test('should delete cached data', () => {
    const { result } = renderHook(useDataLoaderContext, { wrapper })

    act(() => {
      result.current.addCachedData('testA', 'testA')
      result.current.addCachedData('testB', 'testB')
      result.current.addCachedData('testC', 'testC')
      result.current.addCachedData('testD', 'testD')
      result.current.addCachedData('testE', 'testE')
    })
    expect(result.current.getCachedData('testA')).toBe('testA')

    try {
      result.current.clearCachedData()
      throw new Error('It should throw an error before')
    } catch (err) {
      expect((err as Error).message).toBe(KEY_IS_NOT_STRING_ERROR)
    }

    act(() => {
      result.current.clearCachedData('testA')
    })
    expect(
      Object.values(result.current.getCachedData() as Record<string, unknown>)
        .length,
    ).toBe(4)
    expect(
      (result.current.getCachedData() as Record<string, unknown>).testA,
    ).toBe(undefined)

    act(() => {
      result.current.clearAllCachedData()
    })
    expect(
      Object.values(result.current.getCachedData() as Record<string, unknown>)
        .length,
    ).toBe(0)
    expect(result.current.getCachedData()).toStrictEqual({})
  })

  test('should get cached data', () => {
    const { result } = renderHook(useDataLoaderContext, { wrapper })
    expect(result.current.getCachedData()).toStrictEqual({})

    act(() => {
      result.current.addCachedData('test', 'test')
    })

    expect(
      Object.values(result.current.getCachedData() as Record<string, unknown>)
        .length,
    ).toBe(1)
    expect(result.current.getCachedData('test')).toBe('test')
    expect(result.current.getCachedData()).toStrictEqual({ test: 'test' })
    expect(result.current.getCachedData('scaleway')).toBe(undefined)
  })

  test('should add reload', async () => {
    const fn = () => new Promise(resolve => resolve(true))
    const { result } = renderHook(useDataLoaderContext, { wrapper })
    expect(result.current.getCachedData()).toStrictEqual({})

    act(() => {
      // @ts-expect-error used because we test with bad method
      result.current.addReload('test', undefined)
      result.current.addReload('test', fn)
    })

    try {
      // @ts-expect-error used because we test with bad key
      result.current.addReload(1, () => new Promise(resolve => resolve(true)))
      throw new Error('It should throw an error before')
    } catch (err) {
      expect((err as Error).message).toBe(KEY_IS_NOT_STRING_ERROR)
    }

    expect(Object.values(result.current.getReloads()).length).toBe(1)
    expect(result.current.getReloads('test')).toBe(fn)
    expect(result.current.getReloads('testWrong')).toBe(undefined)
    expect(
      await (
        result.current.getReloads() as unknown as {
          test: () => Promise<boolean>
        }
      ).test(),
    ).toBe(true)
  })

  test('should clear reload', () => {
    const { result } = renderHook(useDataLoaderContext, { wrapper })
    expect(result.current.getCachedData()).toStrictEqual({})

    act(() => {
      result.current.addReload(
        'testA',
        () => new Promise(resolve => resolve('testA')),
      )
      result.current.addReload(
        'testB',
        () => new Promise(resolve => resolve('testB')),
      )
      result.current.addReload(
        'testC',
        () => new Promise(resolve => resolve('testC')),
      )
      result.current.addReload(
        'testD',
        () => new Promise(resolve => resolve('testD')),
      )
    })

    expect(Object.values(result.current.getReloads()).length).toBe(4)

    act(() => {
      result.current.clearReload('testA')
    })
    expect(Object.values(result.current.getReloads()).length).toBe(3)
    expect((result.current.getReloads() as Record<string, unknown>).testA).toBe(
      undefined,
    )

    act(() => {
      result.current.clearAllReloads()
    })
    expect(Object.values(result.current.getReloads()).length).toBe(0)
  })

  test('should trigger reload', async () => {
    const reloadFn = jest.fn()
    const { result } = renderHook(useDataLoaderContext, { wrapper })
    expect(result.current.getCachedData()).toStrictEqual({})

    act(() => {
      result.current.addReload('testA', reloadFn)
      result.current.addReload('testB', reloadFn)
    })

    expect(Object.values(result.current.getReloads()).length).toBe(2)
    expect(
      Object.values(
        result.current.getReloads('testA') as () => Promise<unknown>,
      ),
    ).toBeDefined()
    try {
      await result.current.reload()
      throw new Error('It should throw an error before')
    } catch (err) {
      expect((err as Error).message).toBe(KEY_IS_NOT_STRING_ERROR)
    }
    await result.current.reload('testA')
    expect(reloadFn).toBeCalledTimes(1)

    try {
      result.current.clearReload()
      throw new Error('It should throw an error before')
    } catch (err) {
      expect((err as Error).message).toBe(KEY_IS_NOT_STRING_ERROR)
    }
    expect(Object.values(result.current.getReloads()).length).toBe(2)

    const multipleReloads = jest.fn()

    act(() => {
      result.current.clearAllReloads()
      result.current.addReload('testA', multipleReloads)
      result.current.addReload('testB', multipleReloads)
      result.current.addReload('testC', multipleReloads)
      result.current.addReload('testD', multipleReloads)
    })

    await result.current.reloadAll()
    expect(multipleReloads).toBeCalledTimes(4)
  })

  test('should add request', async () => {
    const method = jest.fn(() => Promise.resolve(true))
    const { result, waitForNextUpdate } = renderHook(useDataLoaderContext, {
      wrapper,
    })
    expect(result.current.getRequest('test')).toBeUndefined()

    act(() => {
      result.current.addRequest('test', {
        key: 'test',
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
  })

  test('should add request with result is null thus no data is cached', async () => {
    const method = jest.fn(() => Promise.resolve(null))
    const { result, waitForNextUpdate } = renderHook(useDataLoaderContext, {
      wrapper,
    })
    act(() => {
      // eslint-disable-next-line no-void
      void result.current
        .addRequest('test', {
          enabled: true,
          key: 'test',
          method,
        })
        .launch()
    })
    await waitForNextUpdate()
    expect(method).toBeCalledTimes(1)
    expect(result.current.getCachedData('test')).toBe(undefined)
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
          key: 'test',
          method,
        })
      })
    } catch (e) {
      expect((e as Error).message).toBe(KEY_IS_NOT_STRING_ERROR)
    }
  })

  test('should add cached data with prefix', () => {
    const { result } = renderHook(useDataLoaderContext, {
      wrapper: wrapperWithCacheKey,
    })
    act(() => {
      result.current.addCachedData('test', 'test')
    })
    expect(result.current.getCachedData('test')).toBeDefined()
  })
})
