import { render, screen } from '@testing-library/react'
import { act, renderHook } from '@testing-library/react-hooks'
import React from 'react'
import DataLoaderProvider, { useDataLoaderContext } from '../DataLoaderProvider'

const wrapper = ({ children }) => (
  <DataLoaderProvider>{children}</DataLoaderProvider>
)

const wrapperWithCacheKey = ({ children }) => (
  <DataLoaderProvider cacheKeyPrefix="sample">{children}</DataLoaderProvider>
)

describe('DataLoaderProvider', () => {
  test('should render correctly', async () => {
    render(<DataLoaderProvider>Test</DataLoaderProvider>)
    expect(screen.getByText('Test')).toBeTruthy()
  })
  test('should add cached data', async () => {
    const { result } = renderHook(useDataLoaderContext, { wrapper })
    expect(result.current.getCachedData()).toStrictEqual({})

    act(() => {
      result.current.addCachedData('test', 'test')
      result.current.addCachedData(3, 'testWrong')
    })

    expect(Object.values(result.current.getCachedData()).length).toBe(1)
    expect(result.current.getCachedData().test).toBe('test')
  })

  test('should add cached data with cacheKeyPrefix', async () => {
    const { result } = renderHook(useDataLoaderContext, {
      wrapper: wrapperWithCacheKey,
    })
    expect(result.current.getCachedData()).toStrictEqual({})

    act(() => {
      result.current.addCachedData('test', 'test')
      result.current.addCachedData(3, 'testWrong')
    })

    expect(Object.values(result.current.getCachedData()).length).toBe(1)
    expect(result.current.getCachedData()['sample-test']).toBe('test')
  })

  test('should delete cached data', async () => {
    const { result } = renderHook(useDataLoaderContext, { wrapper })

    act(() => {
      result.current.addCachedData('testA', 'testA')
      result.current.addCachedData('testB', 'testB')
      result.current.addCachedData('testC', 'testC')
      result.current.addCachedData('testD', 'testD')
      result.current.addCachedData('testE', 'testE')
    })
    expect(result.current.getCachedData('testA')).toBe('testA')

    act(() => {
      result.current.clearCachedData()
      result.current.clearCachedData('testA')
    })
    expect(Object.values(result.current.getCachedData()).length).toBe(4)
    expect(result.current.getCachedData().testA).toBe(undefined)

    act(() => {
      result.current.clearAllCachedData()
    })
    expect(Object.values(result.current.getCachedData()).length).toBe(0)
    expect(result.current.getCachedData()).toStrictEqual({})
  })

  test('should delete cached data with cacheKeyPrefix', async () => {
    const { result } = renderHook(useDataLoaderContext, {
      wrapper: wrapperWithCacheKey,
    })

    act(() => {
      result.current.addCachedData('testA', 'testA')
      result.current.addCachedData('testB', 'testB')
      result.current.addCachedData('testC', 'testC')
      result.current.addCachedData('testD', 'testD')
      result.current.addCachedData('testE', 'testE')
    })
    expect(result.current.getCachedData('testA')).toBe('testA')

    act(() => {
      result.current.clearCachedData()
      result.current.clearCachedData('testA')
    })
    expect(Object.values(result.current.getCachedData()).length).toBe(4)
    expect(result.current.getCachedData().testA).toBe(undefined)

    act(() => {
      result.current.clearAllCachedData()
    })
    expect(Object.values(result.current.getCachedData()).length).toBe(0)
    expect(result.current.getCachedData()).toStrictEqual({})
  })

  test('should get cached data', async () => {
    const { result } = renderHook(useDataLoaderContext, { wrapper })
    expect(result.current.getCachedData()).toStrictEqual({})

    act(() => {
      result.current.addCachedData('test', 'test')
    })

    expect(Object.values(result.current.getCachedData()).length).toBe(1)
    expect(result.current.getCachedData('test')).toBe('test')
    expect(result.current.getCachedData()).toStrictEqual({ test: 'test' })
    expect(result.current.getCachedData('scaleway')).toBe(undefined)
  })

  test('should add reload', async () => {
    const fn = () => new Promise(resolve => resolve(true))
    const { result } = renderHook(useDataLoaderContext, { wrapper })
    expect(result.current.getCachedData()).toStrictEqual({})

    act(() => {
      result.current.addReload('test', fn)
      result.current.addReload(1, () => new Promise(resolve => resolve(true)))
    })

    expect(Object.values(result.current.getReloads()).length).toBe(1)
    expect(result.current.getReloads('test')).toBe(fn)
    expect(result.current.getReloads('testWrong')).toBe(undefined)
    expect(await result.current.getReloads().test()).toBe(true)
  })

  test('should clear reload', async () => {
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
    expect(result.current.getReloads().testA).toBe(undefined)

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
    expect(Object.values(result.current.getReloads('testA'))).toBeDefined()
    await result.current.reload()
    await result.current.reload('testA')
    expect(reloadFn).toBeCalledTimes(1)

    act(() => {
      result.current.clearReload()
    })
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
})
