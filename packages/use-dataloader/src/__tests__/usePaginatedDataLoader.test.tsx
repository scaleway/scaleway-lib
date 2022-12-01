/* eslint-disable no-console */
import { act, renderHook, waitFor } from '@testing-library/react'
import { ReactNode } from 'react'
import DataLoaderProvider from '../DataLoaderProvider'
import { UsePaginatedDataLoaderMethodParams } from '../types'
import usePaginatedDataLoader from '../usePaginatedDataLoader'

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

describe('usePaginatedDataLoader', () => {
  test('should render correctly without options', async () => {
    const { result } = renderHook(
      props => usePaginatedDataLoader(props.key, props.method),
      {
        initialProps,
        wrapper,
      },
    )
    expect(result.current.data).toStrictEqual({})
    expect(result.current.pageData).toBe(undefined)
    expect(result.current.isLoading).toBe(true)
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(initialProps.method).toBeCalledTimes(1)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.data).toStrictEqual({ 1: '1-1' })
    expect(result.current.pageData).toBe('1-1')
  })

  test('should render correctly without request enabled then enable it', async () => {
    const method = jest.fn(
      () =>
        new Promise(resolve => {
          setTimeout(() => resolve(true), 500)
        }),
    )
    const testProps = {
      ...initialProps,
      config: {
        enabled: false,
      },
      key: 'test-not-enabled-then-reload',
      method,
    }

    const { rerender, result } = renderHook(
      props => usePaginatedDataLoader(props.key, props.method, props.config),
      {
        initialProps: testProps,
        wrapper,
      },
    )

    expect(result.current.pageData).toBe(undefined)
    expect(result.current.isLoading).toBe(false)
    expect(method).toBeCalledTimes(0)
    testProps.config.enabled = true

    rerender({ ...testProps })
    expect(method).toBeCalledTimes(1)
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.isLoading).toBe(false)
    expect(result.current.pageData).toBe(true)
  })

  test('should render correctly with result null', async () => {
    const { result } = renderHook(
      props => usePaginatedDataLoader(props.key, props.method, props.config),
      {
        initialProps: {
          ...initialProps,
          key: 'test-3',
          method: () =>
            new Promise(resolve => {
              setTimeout(() => resolve(null), PROMISE_TIMEOUT)
            }),
        },
        wrapper,
      },
    )
    expect(result.current.pageData).toBe(undefined)
    expect(result.current.isLoading).toBe(true)
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.pageData).toBe(null)
    expect(result.current.isLoading).toBe(false)
  })

  test('should render correctly then change page', async () => {
    const { result } = renderHook(
      props => usePaginatedDataLoader(props.key, props.method),
      {
        initialProps: {
          ...initialProps,
          key: 'test-4',
        },
        wrapper,
      },
    )
    expect(result.current.data).toStrictEqual({})
    expect(result.current.pageData).toBe(undefined)
    expect(result.current.isLoading).toBe(true)
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.isLoading).toBe(false)
    expect(result.current.isSuccess).toBe(true)
    expect(result.current.data).toStrictEqual({ 1: '1-1' })
    expect(result.current.pageData).toBe('1-1')

    await act(() => {
      result.current.goToNextPage()
    })
    expect(result.current.page).toBe(2)
    expect(result.current.pageData).toBe(undefined)
    expect(result.current.isLoading).toBe(true)
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.isLoading).toBe(false)
    expect(result.current.data).toStrictEqual({ 1: '1-1', 2: '2-1' })
    expect(result.current.pageData).toBe('2-1')
    await act(() => {
      result.current.goToPreviousPage()
      result.current.goToPreviousPage()
      result.current.goToPreviousPage()
      result.current.goToPreviousPage()
    })
    expect(result.current.page).toBe(1)
    expect(result.current.pageData).toBe('1-1')
    await act(() => {
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
    const { rerender, result } = renderHook(
      props => usePaginatedDataLoader(props.key, props.method),
      {
        initialProps: hookProps,
        wrapper,
      },
    )
    await waitFor(() => expect(result.current.data).toStrictEqual({ 1: '1-1' }))
    await act(() => {
      result.current.goToNextPage()
    })
    await waitFor(() =>
      expect(result.current.data).toStrictEqual({ 1: '1-1', 2: '2-1' }),
    )
    hookProps.key = 'test-5-bis'
    rerender(hookProps)
    expect(result.current.isLoading).toBe(true)
    expect(result.current.pageData).toBe(undefined)
    expect(result.current.data).toStrictEqual({})
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toStrictEqual({ 1: '1-1' })
    expect(result.current.pageData).toBe('1-1')
    expect(result.current.isLoading).toBe(false)
  })
})
/* eslint-enable no-console */
