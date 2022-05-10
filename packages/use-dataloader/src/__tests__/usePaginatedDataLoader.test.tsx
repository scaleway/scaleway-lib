import { act } from '@testing-library/react'
import { renderHook } from '@testing-library/react-hooks'
import { ReactNode } from 'react'
import DataLoaderProvider from '../DataLoaderProvider'
import { KEY_IS_NOT_STRING_ERROR } from '../constants'
import {
  UsePaginatedDataLoaderConfig,
  UsePaginatedDataLoaderMethodParams,
  UsePaginatedDataLoaderResult,
} from '../types'
import usePaginatedDataLoader from '../usePaginatedDataLoader'

type UseDataLoaderHookProps = {
  config: UsePaginatedDataLoaderConfig<unknown>
  key: string
  method: (params: UsePaginatedDataLoaderMethodParams) => Promise<unknown>
  children?: ReactNode
}

const PROMISE_TIMEOUT = 5

const initialProps = {
  config: {
    enabled: true,
  },
  key: 'test',
  method: jest.fn(
    ({ page, perPage }: UsePaginatedDataLoaderMethodParams) =>
      new Promise(resolve => {
        setTimeout(() => resolve(`${page}-${perPage}`), PROMISE_TIMEOUT)
      }),
  ),
}
// eslint-disable-next-line react/prop-types
const wrapper = ({ children }: { children?: ReactNode }) => (
  <DataLoaderProvider>{children}</DataLoaderProvider>
)

describe('useDataLoader', () => {
  test('should render correctly without options', async () => {
    const { result, waitForNextUpdate } = renderHook<
      UseDataLoaderHookProps,
      UsePaginatedDataLoaderResult
    >(props => usePaginatedDataLoader(props.key, props.method), {
      initialProps,
      wrapper,
    })
    expect(result.current.data).toStrictEqual({})
    expect(result.current.pageData).toBe(undefined)
    expect(result.current.isLoading).toBe(true)
    await waitForNextUpdate()
    expect(initialProps.method).toBeCalledTimes(1)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.isSuccess).toBe(true)
    expect(result.current.data).toStrictEqual({ 1: '1-1' })
    expect(result.current.pageData).toBe('1-1')
  })

  test('should render correctly without request enabled then enable it', async () => {
    const method = jest.fn(
      () =>
        new Promise(resolve => {
          setTimeout(() => resolve(true), PROMISE_TIMEOUT)
        }),
    )
    let enabled = false
    const { rerender, result, waitForNextUpdate } = renderHook<
      UseDataLoaderHookProps,
      UsePaginatedDataLoaderResult
    >(
      props =>
        usePaginatedDataLoader(props.key, props.method, {
          enabled,
        }),
      {
        initialProps: {
          ...initialProps,
          key: 'test-not-enabled-then-reload',
          method,
        },
        wrapper,
      },
    )
    expect(result.current.pageData).toBe(undefined)
    expect(result.current.isLoading).toBe(false)
    expect(method).toBeCalledTimes(0)
    enabled = true
    rerender()
    expect(method).toBeCalledTimes(1)
    expect(result.current.pageData).toBe(undefined)
    expect(result.current.isLoading).toBe(true)
    await waitForNextUpdate()
    expect(result.current.isLoading).toBe(false)
    expect(result.current.isSuccess).toBe(true)
    expect(result.current.pageData).toBe(true)
  })

  test('should render correctly without valid key', () => {
    const { result } = renderHook<
      UseDataLoaderHookProps,
      UsePaginatedDataLoaderResult
    >(props => usePaginatedDataLoader(props.key, props.method), {
      initialProps: {
        ...initialProps,
        // @ts-expect-error used because we test with bad key
        key: 2,
      },
      wrapper,
    })
    expect(result.error?.message).toBe(KEY_IS_NOT_STRING_ERROR)
  })

  test('should render correctly with result null', async () => {
    const { result, waitForNextUpdate } = renderHook<
      UseDataLoaderHookProps,
      UsePaginatedDataLoaderResult
    >(props => usePaginatedDataLoader(props.key, props.method, props.config), {
      initialProps: {
        ...initialProps,
        key: 'test-3',
        method: () =>
          new Promise(resolve => {
            setTimeout(() => resolve(null), PROMISE_TIMEOUT)
          }),
      },
      wrapper,
    })
    expect(result.current.pageData).toBe(undefined)
    expect(result.current.isLoading).toBe(true)
    await waitForNextUpdate()
    expect(result.current.pageData).toBe(undefined)
    expect(result.current.isSuccess).toBe(true)
    expect(result.current.isLoading).toBe(false)
  })

  test('should render correctly then change page', async () => {
    const { result, waitForNextUpdate } = renderHook<
      UseDataLoaderHookProps,
      UsePaginatedDataLoaderResult
    >(props => usePaginatedDataLoader(props.key, props.method), {
      initialProps: {
        ...initialProps,
        key: 'test-4',
      },
      wrapper,
    })
    expect(result.current.data).toStrictEqual({})
    expect(result.current.pageData).toBe(undefined)
    expect(result.current.isLoading).toBe(true)
    await waitForNextUpdate()
    expect(result.current.isLoading).toBe(false)
    expect(result.current.isSuccess).toBe(true)
    expect(result.current.data).toStrictEqual({ 1: '1-1' })
    expect(result.current.pageData).toBe('1-1')

    act(() => {
      result.current.goToNextPage()
    })
    expect(result.current.page).toBe(2)
    expect(result.current.pageData).toBe(undefined)
    expect(result.current.isLoading).toBe(true)
    await waitForNextUpdate()
    expect(result.current.isLoading).toBe(false)
    expect(result.current.isSuccess).toBe(true)
    expect(result.current.data).toStrictEqual({ 1: '1-1', 2: '2-1' })
    expect(result.current.pageData).toBe('2-1')
    act(() => {
      result.current.goToPreviousPage()
      result.current.goToPreviousPage()
      result.current.goToPreviousPage()
      result.current.goToPreviousPage()
    })
    expect(result.current.page).toBe(1)
    expect(result.current.pageData).toBe('1-1')
    act(() => {
      result.current.goToPage(2)
      result.current.goToPage(-21)
      result.current.goToPage(0)
    })
    expect(result.current.page).toBe(1)
    expect(result.current.pageData).toBe('1-1')
  })

  test('should render correctly go to next page, change key and should be on page 1', async () => {
    const hookProps = {
      ...initialProps,
      key: 'test-5',
    }
    const { rerender, result, waitForNextUpdate } = renderHook<
      UseDataLoaderHookProps,
      UsePaginatedDataLoaderResult
    >(props => usePaginatedDataLoader(props.key, props.method), {
      initialProps: hookProps,
      wrapper,
    })
    await waitForNextUpdate()
    act(() => {
      result.current.goToNextPage()
    })
    await waitForNextUpdate()
    expect(result.current.data).toStrictEqual({ 1: '1-1', 2: '2-1' })
    hookProps.key = 'test-5-bis'
    rerender()
    expect(result.current.isLoading).toBe(true)
    expect(result.current.pageData).toBe(undefined)
    expect(result.current.data).toStrictEqual({})
    await waitForNextUpdate()
    expect(result.current.data).toStrictEqual({ 1: '1-1' })
    expect(result.current.pageData).toBe('1-1')
    expect(result.current.isSuccess).toBe(true)
    expect(result.current.isLoading).toBe(false)
  })
})
