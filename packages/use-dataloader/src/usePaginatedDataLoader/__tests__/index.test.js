import { act, renderHook } from '@testing-library/react-hooks'
import React from 'react'
import usePaginatedDataLoader from '..'
import DataLoaderProvider, {
  useDataLoaderContext,
} from '../../DataLoaderProvider'

const generateFakeData = length =>
  Array.from({ length }, (v, i) => i).map(i => i)

const fakeData = generateFakeData(100)

const fakePromise = (pageSize, page) =>
  new Promise(resolve => {
    setTimeout(() => {
      const result = []
      result.push(...fakeData.slice((page - 1) * pageSize, page * pageSize))
      resolve(result)
    }, 500)
  })
const initialProps = {
  key: 'test',
  method: ({ pageSize, currentPage }) => fakePromise(pageSize, currentPage),
  config: {
    enabled: true,
    pageSize: 25,
    initialPage: 1,
  },
}
// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <DataLoaderProvider>{children}</DataLoaderProvider>
)

describe('usePaginatedDataLoader', () => {
  test('should render correctly with enable true', async () => {
    const { result, waitFor } = renderHook(
      props => usePaginatedDataLoader(props.key, props.method, props.config),
      {
        wrapper,
        initialProps,
      },
    )
    act(() => {
      result.current.reload()
      result.current.reload()
      result.current.reload()
    })
    expect(result.current.data).toStrictEqual([])
    expect(result.current.isLoading).toBe(true)
    expect(result.current.isPolling).toBe(false)
    expect(result.current.currentPage).toBe(1)
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toStrictEqual(fakeData.slice(0, 25))
    expect(result.current.currentPage).toBe(1)
    expect(Object.keys(result.current.paginatedData).length).toBe(1)
    expect(result.current.pageData).toStrictEqual(fakeData.slice(0, 25))
    expect(result.current.isLoading).toBe(false)
    expect(result.current.hasNextPage).toBe(true)
  })

  test('should render correctly with enable true and change pageSize', async () => {
    const { result, waitFor, waitForNextUpdate, rerender } = renderHook(
      props => usePaginatedDataLoader(props.key, props.method, props.config),
      {
        wrapper,
        initialProps,
      },
    )
    await waitForNextUpdate()
    expect(result.current.data).toStrictEqual(fakeData.slice(0, 25))
    act(() => {
      result.current.goToNextPage()
    })
    await waitFor(() => expect(result.current.currentPage).toBe(2))
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toStrictEqual(fakeData.slice(0, 50))
    expect(Object.keys(result.current.paginatedData).length).toBe(2)
    expect(result.current.pageData).toStrictEqual(fakeData.slice(25, 50))
    expect(result.current.hasNextPage).toBe(true)

    rerender({ ...initialProps, config: { pageSize: 50 } })
    expect(result.current.data).toStrictEqual(fakeData.slice(0, 50))
    expect(result.current.currentPage).toBe(1)
    expect(Object.keys(result.current.paginatedData).length).toBe(1)
    expect(result.current.pageData).toStrictEqual(fakeData.slice(0, 50))
    expect(result.current.isLoading).toBe(false)
    expect(result.current.hasNextPage).toBe(true)
  })

  test('should render correctly with enable true and no key', async () => {
    const { result, waitFor } = renderHook(
      props => usePaginatedDataLoader(undefined, props.method, props.config),
      {
        wrapper,
        initialProps,
      },
    )
    expect(result.current.data).toStrictEqual([])
    expect(result.current.isLoading).toBe(true)
    expect(result.current.currentPage).toBe(1)
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toStrictEqual(fakeData.slice(0, 25))
    expect(result.current.currentPage).toBe(1)
    expect(Object.keys(result.current.paginatedData).length).toBe(1)
    expect(result.current.pageData).toStrictEqual(fakeData.slice(0, 25))
    expect(result.current.isLoading).toBe(false)
    expect(result.current.hasNextPage).toBe(true)
  })

  test('should render correctly with enable false', async () => {
    const { result } = renderHook(
      props => usePaginatedDataLoader(props.key, props.method, props.config),
      {
        wrapper,
        initialProps: {
          ...initialProps,
          config: {
            enabled: false,
          },
        },
      },
    )
    expect(result.current.data).toStrictEqual([])
    expect(result.current.isLoading).toBe(false)
    expect(result.current.currentPage).toBe(1)
    expect(Object.keys(result.current.paginatedData).length).toBe(0)
    expect(result.current.pageData).toStrictEqual(undefined)
    expect(result.current.isIdle).toBe(true)
  })

  test('should render correctly with update data', async () => {
    const { result } = renderHook(
      props => usePaginatedDataLoader(props.key, props.method, props.config),
      {
        wrapper,
        initialProps: {
          ...initialProps,
          config: {
            enabled: false,
          },
        },
      },
    )
    expect(result.current.data).toStrictEqual([])
    expect(result.current.isLoading).toBe(false)
    expect(result.current.currentPage).toBe(1)
    expect(Object.keys(result.current.paginatedData).length).toBe(0)
    expect(result.current.pageData).toStrictEqual(undefined)
    expect(result.current.isIdle).toBe(true)

    act(() => {
      result.current.updatePageData([])
      result.current.updateData([])
      result.current.updateData(fakeData.slice(0, 25))
      result.current.updateData(fakeData.slice(0, 25), true)
      result.current.updateData(fakeData.slice(0, 25), false)
    })
  })

  test('should render correctly with onSuccess', async () => {
    const onSuccess = jest.fn()
    const { result, waitFor } = renderHook(
      props => usePaginatedDataLoader(props.key, props.method, props.config),
      {
        wrapper,
        initialProps: {
          ...initialProps,
          config: {
            onSuccess,
          },
        },
      },
    )
    expect(result.current.data).toStrictEqual([])
    expect(result.current.isLoading).toBe(true)
    expect(result.current.currentPage).toBe(1)
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(onSuccess).toBeCalledTimes(1)
  })

  test('should render correctly with onError', async () => {
    const onError = jest.fn()
    const { result, waitFor } = renderHook(
      props => usePaginatedDataLoader(props.key, props.method, props.config),
      {
        wrapper,
        initialProps: {
          ...initialProps,
          method: () =>
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error('Test error')), 200),
            ),
          config: {
            onError,
          },
        },
      },
    )
    expect(result.current.data).toStrictEqual([])
    expect(result.current.isLoading).toBe(true)
    expect(result.current.currentPage).toBe(1)
    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(onError).toBeCalledTimes(1)
  })

  test('should render correctly with empty data', async () => {
    const { result, waitForNextUpdate } = renderHook(
      props => usePaginatedDataLoader(props.key, props.method, props.config),
      {
        wrapper,
        initialProps: {
          ...initialProps,
          method: () =>
            new Promise(resolve => setTimeout(() => resolve([]), 200)),
          config: {
            enabled: false,
          },
        },
      },
    )
    act(() => {
      result.current.reloadPage()
    })
    expect(result.current.data).toStrictEqual([])
    expect(result.current.isLoading).toBe(true)
    expect(result.current.currentPage).toBe(1)
    expect(Object.keys(result.current.paginatedData).length).toBe(0)
    expect(result.current.pageData).toStrictEqual(undefined)
    expect(result.current.isIdle).toBe(false)
    await waitForNextUpdate()
  })

  test('should render correctly with error', async () => {
    const error = new Error('Test error')
    const { result, waitFor } = renderHook(
      props => usePaginatedDataLoader(props.key, props.method, props.config),
      {
        wrapper,
        initialProps: {
          ...initialProps,
          method: jest.fn(
            () =>
              new Promise((_, reject) => {
                setTimeout(() => reject(error), 500)
              }),
          ),
        },
      },
    )
    expect(result.current.data).toStrictEqual([])
    expect(result.current.isLoading).toBe(true)
    expect(result.current.currentPage).toBe(1)
    expect(Object.keys(result.current.paginatedData).length).toBe(0)
    expect(result.current.pageData).toStrictEqual(undefined)
    await waitFor(() => result.current.isError === true)
    expect(result.current.data).toStrictEqual([])
    expect(result.current.isLoading).toBe(false)
    expect(result.current.currentPage).toBe(1)
    expect(Object.keys(result.current.paginatedData).length).toBe(0)
    expect(result.current.pageData).toStrictEqual(undefined)
  })

  test('should render correctly with multiples pages', async () => {
    const { result, waitForNextUpdate } = renderHook(
      props => usePaginatedDataLoader(props.key, props.method, props.config),
      {
        wrapper,
        initialProps,
      },
    )
    expect(result.current.data).toStrictEqual([])
    expect(result.current.isLoading).toBe(true)
    await waitForNextUpdate()

    act(() => {
      result.current.goToNextPage()
    })
    expect(result.current.currentPage).toBe(2)
    expect(result.current.isLoadingMore).toBe(true)
    await waitForNextUpdate()
    expect(result.current.isSuccess).toBe(true)
    expect(result.current.data).toStrictEqual(fakeData.slice(0, 50))
    expect(result.current.pageData).toStrictEqual(fakeData.slice(25, 50))
    expect(Object.keys(result.current.paginatedData).length).toBe(2)
    act(() => {
      result.current.goToNextPage()
    })
    expect(result.current.currentPage).toBe(3)
    expect(result.current.isLoadingMore).toBe(true)
    await waitForNextUpdate()
    expect(result.current.isSuccess).toBe(true)
    expect(result.current.data).toStrictEqual(fakeData.slice(0, 75))
    expect(result.current.pageData).toStrictEqual(fakeData.slice(50, 75))
    expect(Object.keys(result.current.paginatedData).length).toBe(3)
    act(() => {
      result.current.goToNextPage()
    })
    expect(result.current.currentPage).toBe(4)
    expect(result.current.isLoadingMore).toBe(true)
    await waitForNextUpdate()
    expect(result.current.isSuccess).toBe(true)
    expect(result.current.data).toStrictEqual(fakeData)
    expect(result.current.pageData).toStrictEqual(fakeData.slice(75, 100))
    expect(Object.keys(result.current.paginatedData).length).toBe(4)
    act(() => {
      result.current.goToNextPage()
    })
    expect(result.current.currentPage).toBe(5)
    expect(result.current.isLoadingMore).toBe(true)
    await waitForNextUpdate()
    expect(result.current.currentPage).toBe(4)
    expect(result.current.hasNextPage).toBe(false)
    expect(result.current.isSuccess).toBe(true)
    expect(result.current.data).toStrictEqual(fakeData)
    expect(result.current.pageData).toStrictEqual(fakeData.slice(75, 100))
    expect(Object.keys(result.current.paginatedData).length).toBe(4)
  })
  test('should render correctly with multiples pages and partial result for last page', async () => {
    const { result, waitForNextUpdate, waitFor } = renderHook(
      props => usePaginatedDataLoader(props.key, props.method, props.config),
      {
        wrapper,
        initialProps: {
          ...initialProps,
          method: ({ pageSize, currentPage }) =>
            fakePromise(pageSize, currentPage),
          config: {
            pageSize: 42,
          },
        },
      },
    )
    expect(result.current.data).toStrictEqual([])
    expect(result.current.isLoading).toBe(true)
    await waitForNextUpdate()

    act(() => {
      result.current.goToNextPage()
    })
    expect(result.current.currentPage).toBe(2)
    expect(result.current.isLoadingMore).toBe(true)
    await waitForNextUpdate()
    expect(result.current.currentPage).toBe(2)
    expect(result.current.hasNextPage).toBe(true)
    expect(result.current.isSuccess).toBe(true)
    expect(result.current.data).toStrictEqual(fakeData.slice(0, 84))
    expect(result.current.pageData).toStrictEqual(fakeData.slice(42, 84))
    expect(Object.keys(result.current.paginatedData).length).toBe(2)

    act(() => {
      result.current.goToNextPage()
    })
    expect(result.current.currentPage).toBe(3)
    expect(result.current.isLoadingMore).toBe(true)
    await waitForNextUpdate()
    expect(result.current.currentPage).toBe(3)
    expect(result.current.hasNextPage).toBe(false)
    expect(result.current.isSuccess).toBe(true)
    expect(result.current.data).toStrictEqual(fakeData.slice(0, 100))
    expect(result.current.pageData).toStrictEqual(fakeData.slice(84, 100))
    expect(Object.keys(result.current.paginatedData).length).toBe(3)
    act(() => {
      result.current.goToPreviousPage()
    })
    act(() => {
      result.current.goToNextPage()
      result.current.goToPage(-1)
      result.current.goToPage(1)
      result.current.goToPage(2)
      result.current.goToPage(3)
      result.current.goToPage(2)
      result.current.goToPage(3)
      result.current.goToPage(4)
    })
    // Because page 4 doesn't exist it need to go back to page 3
    expect(result.current.currentPage).toBe(3)
    act(() => {
      result.current.reload()
    })
    expect(result.current.data).toStrictEqual([])
    expect(result.current.isLoading).toBe(false)
    expect(result.current.currentPage).toBe(3)
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toStrictEqual(fakeData.slice(84, 100))
    expect(Object.keys(result.current.paginatedData).length).toBe(1)
    expect(result.current.pageData).toStrictEqual(fakeData.slice(84, 100))
    expect(result.current.isLoading).toBe(false)
    expect(result.current.hasNextPage).toBe(false)
    act(() => {
      result.current.goToPage(1)
    })
  })

  test('should render correctly with two pages get first page go to second then first', async () => {
    const { result, waitForNextUpdate } = renderHook(
      props => usePaginatedDataLoader(props.key, props.method, props.config),
      {
        wrapper,
        initialProps,
      },
    )
    expect(result.current.data).toStrictEqual([])
    expect(result.current.isLoading).toBe(true)
    await waitForNextUpdate()

    act(() => {
      result.current.goToNextPage()
    })
    expect(result.current.currentPage).toBe(2)
    expect(result.current.isLoadingMore).toBe(true)
    await waitForNextUpdate()
    expect(result.current.isSuccess).toBe(true)
    expect(result.current.data).toStrictEqual(fakeData.slice(0, 50))
    expect(result.current.pageData).toStrictEqual(fakeData.slice(25, 50))
    expect(Object.keys(result.current.paginatedData).length).toBe(2)

    act(() => {
      result.current.goToPreviousPage()
    })
    expect(result.current.currentPage).toBe(1)
    expect(result.current.isLoadingMore).toBe(false)
  })

  test('should be reloaded from dataloader context', async () => {
    const mockedFn = jest.fn(
      () =>
        new Promise(resolve => {
          setTimeout(() => {
            resolve(fakeData.slice(0, 25))
          }, 500)
        }),
    )
    const { result, waitForNextUpdate } = renderHook(
      props => [
        usePaginatedDataLoader(props.key, props.method, props.config),
        useDataLoaderContext(),
      ],
      {
        wrapper,
        initialProps: {
          ...initialProps,
          method: mockedFn,
        },
      },
    )

    expect(result.current[0].data).toStrictEqual([])
    expect(result.current[0].isLoading).toBe(true)
    expect(Object.values(result.current[1].getReloads()).length).toBe(1)
    await waitForNextUpdate()
    expect(result.current[0].data).toStrictEqual(fakeData.slice(0, 25))
    expect(result.current[0].isSuccess).toBe(true)
    expect(mockedFn).toBeCalledTimes(1)

    act(() => {
      result.current[1].reload()
    })

    expect(result.current[0].data).toStrictEqual(fakeData.slice(0, 25))
    expect(Object.values(result.current[1].getReloads()).length).toBe(1)
    await waitForNextUpdate()
    expect(result.current[0].isSuccess).toBe(true)
    expect(mockedFn).toBeCalledTimes(2)
  })

  test('should render correctly with pooling', async () => {
    const pollingProps = {
      key: 'test',
      method: jest.fn(
        () =>
          new Promise(resolve => {
            setTimeout(() => resolve(fakeData.slice(0, 25)), 250)
          }),
      ),
      config: {
        pollingInterval: 500,
      },
    }

    const method2 = jest.fn(
      () =>
        new Promise(resolve => {
          setTimeout(() => resolve(fakeData.slice(25, 50)), 250)
        }),
    )

    const { result, waitForNextUpdate, waitFor, rerender } = renderHook(
      props => usePaginatedDataLoader(props.key, props.method, props.config),
      {
        wrapper,
        initialProps: pollingProps,
      },
    )
    expect(result.current.data).toStrictEqual([])
    expect(result.current.isLoading).toBe(true)
    expect(result.current.isPolling).toBe(true)
    expect(pollingProps.method).toBeCalledTimes(1)
    await waitForNextUpdate()
    expect(result.current.data).toStrictEqual(fakeData.slice(0, 25))
    expect(result.current.isSuccess).toBe(true)
    expect(result.current.isPolling).toBe(true)
    await waitFor(() => expect(pollingProps.method).toBeCalledTimes(2))
    await waitFor(() => expect(result.current.isLoadingMore).toBe(true), {
      timeout: 3000,
    })
    expect(result.current.isLoadingMore).toBe(true)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.isPolling).toBe(true)
    await waitForNextUpdate()
    expect(result.current.data).toStrictEqual(fakeData.slice(0, 25))
    expect(result.current.isSuccess).toBe(true)
    expect(result.current.isLoading).toBe(false)

    rerender({
      ...pollingProps,
      method: method2,
      config: {
        pollingInterval: 800,
      },
    })
    expect(result.current.isPolling).toBe(true)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.isLoadingMore).toBe(false)
    expect(result.current.isSuccess).toBe(true)
    expect(method2).toBeCalledTimes(0)
    await waitForNextUpdate()
    expect(method2).toBeCalledTimes(1)
    expect(result.current.isPolling).toBe(true)
    await waitForNextUpdate()
    expect(result.current.isSuccess).toBe(true)
    expect(result.current.data).toStrictEqual(fakeData.slice(25, 50))

    rerender({
      ...pollingProps,
      method: method2,
      config: {
        pollingInterval: 500,
      },
    })
    await waitForNextUpdate()
    expect(result.current.data).toStrictEqual(fakeData.slice(25, 50))
    expect(result.current.isPolling).toBe(true)
    expect(result.current.isLoadingMore).toBe(true)
    expect(result.current.isSuccess).toBe(false)
    expect(method2).toBeCalledTimes(2)
    await waitForNextUpdate()
    expect(result.current.isPolling).toBe(true)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.isSuccess).toBe(true)
    expect(result.current.data).toStrictEqual(fakeData.slice(25, 50))
  })
})
