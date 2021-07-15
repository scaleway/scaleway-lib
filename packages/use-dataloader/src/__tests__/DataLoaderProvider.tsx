import { render, screen } from '@testing-library/react'
import { act, renderHook } from '@testing-library/react-hooks'
import React from 'react'
import DataLoaderProvider, { useDataLoaderContext } from '../DataLoaderProvider'

const wrapper = ({ children }) => (
  <DataLoaderProvider>{children}</DataLoaderProvider>
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
      result.current.addCachedData('test', 'test')
      result.current.addCachedData(3, 'testWrong')
    })

    expect(Object.values(result.current.getCachedData()).length).toBe(1)
    expect(result.current.getCachedData().test).toBe('test')
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

  test('should get cached data', () => {
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
    const fn = (): Promise<boolean> => new Promise(resolve => resolve(true))
    const { result } = renderHook(useDataLoaderContext, { wrapper })
    expect(result.current.getCachedData()).toStrictEqual({})

    act(() => {
      result.current.addReload('test', fn)
      result.current.addReload(1, (): Promise<void> => new Promise(resolve => resolve()))
    })

    expect(Object.values(result.current.getReloads()).length).toBe(1)
    expect(result.current.getReloads('test')).toBe(fn)
    expect(result.current.getReloads('testWrong')).toBe(undefined)
    expect(await (result.current.getReloads() as () => Promise<boolean>).test()).toBe(true)
  })

  test('should clear reload', () => {
    const { result } = renderHook(useDataLoaderContext, { wrapper })
    expect(result.current.getCachedData()).toStrictEqual({})

    act(() => {
      result.current.addReload(
        'testA',
        (): Promise<void> => new Promise(resolve => resolve()),
      )
      result.current.addReload(
        'testB',
        (): Promise<void> => new Promise(resolve => resolve()),
      )
      result.current.addReload(
        'testC',
        (): Promise<void> => new Promise(resolve => resolve()),
      )
      result.current.addReload(
        'testD',
        (): Promise<void> => new Promise(resolve => resolve()),
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
