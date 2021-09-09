/* eslint-disable no-console */
import { act, renderHook } from '@testing-library/react-hooks'
import React from 'react'
import DataLoaderProvider, { useDataLoaderContext } from '../DataLoaderProvider'
import useDataLoader, {
  PromiseType,
  UseDataLoaderConfig,
  UseDataLoaderResult,
} from '../useDataLoader'

type UseDataLoaderHookProps = {
  config: UseDataLoaderConfig<unknown>
  key: string
  method: () => Promise<unknown>
}

const PROMISE_TIMEOUT = 100

const initialProps = {
  config: {
    enabled: true,
    keepPreviousData: true,
  },
  key: 'test',
  method: () =>
    new Promise(resolve => {
      setTimeout(() => resolve(true), PROMISE_TIMEOUT)
    }),
}
// eslint-disable-next-line react/prop-types
const wrapper = ({ children }: { children?: React.ReactNode }) => (
  <DataLoaderProvider>{children}</DataLoaderProvider>
)

const wrapperWithCacheKey = ({ children }: { children?: React.ReactNode }) => (
  <DataLoaderProvider cacheKeyPrefix="sample">{children}</DataLoaderProvider>
)

const wrapperWithOnError =
  (onError: (err: Error) => void) =>
  // eslint-disable-next-line react/require-default-props
  ({ children }: { children?: React.ReactNode }) =>
    <DataLoaderProvider onError={onError}>{children}</DataLoaderProvider>

describe('useDataLoader', () => {
  test('should render correctly without options', async () => {
    const { result, waitForNextUpdate, rerender } = renderHook<
      UseDataLoaderHookProps,
      UseDataLoaderResult
    >(props => useDataLoader(props.key, props.method), {
      initialProps,
      wrapper,
    })
    expect(result.current.data).toBe(undefined)
    expect(result.current.isLoading).toBe(true)
    rerender()
    await waitForNextUpdate()
    expect(result.current.data).toBe(true)
    expect(result.current.isSuccess).toBe(true)
    expect(result.current.isLoading).toBe(false)
  })

  test('should render correctly without valid key', async () => {
    const { result, waitForNextUpdate } = renderHook<
      UseDataLoaderHookProps,
      UseDataLoaderResult
    >(props => useDataLoader(props.key, props.method), {
      initialProps: {
        ...initialProps,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        key: 2,
      },
      wrapper,
    })
    expect(result.current.data).toBe(undefined)
    expect(result.current.isLoading).toBe(true)
    await waitForNextUpdate()
    expect(result.current.data).toBe(undefined)
    expect(result.current.isSuccess).toBe(true)
    expect(result.current.isLoading).toBe(false)
  })

  test('should render correctly without keepPreviousData', async () => {
    const { result, waitForNextUpdate } = renderHook<
      UseDataLoaderHookProps,
      UseDataLoaderResult
    >(props => useDataLoader(props.key, props.method, props.config), {
      initialProps: {
        ...initialProps,
        config: {
          keepPreviousData: false,
        },
      },
      wrapper,
    })
    expect(result.current.data).toBe(undefined)
    expect(result.current.isLoading).toBe(true)
    await waitForNextUpdate()
    expect(result.current.data).toBe(true)
    expect(result.current.isSuccess).toBe(true)
    expect(result.current.isLoading).toBe(false)
  })

  test('should render correctly with result null', async () => {
    const { result, waitForNextUpdate } = renderHook<
      UseDataLoaderHookProps,
      UseDataLoaderResult
    >(props => useDataLoader(props.key, props.method, props.config), {
      initialProps: {
        ...initialProps,
        method: () =>
          new Promise(resolve =>
            setTimeout(() => resolve(null), PROMISE_TIMEOUT),
          ),
      },
      wrapper,
    })
    expect(result.current.data).toBe(undefined)
    expect(result.current.isLoading).toBe(true)
    await waitForNextUpdate()
    expect(result.current.data).toBe(undefined)
    expect(result.current.isSuccess).toBe(true)
    expect(result.current.isLoading).toBe(false)
  })

  test('should render and cache correctly with cacheKeyPrefix', async () => {
    const { result, waitForNextUpdate } = renderHook<
      UseDataLoaderHookProps,
      ReturnType<typeof useDataLoader>[]
    >(
      props => [
        useDataLoader(props.key, props.method, props.config),
        useDataLoader(props.key, props.method, {
          ...props.config,
          enabled: false,
        }),
      ],
      {
        initialProps,
        wrapper: wrapperWithCacheKey,
      },
    )

    expect(result.current[0].data).toBe(undefined)
    expect(result.current[0].isLoading).toBe(true)
    expect(result.current[1].data).toBe(undefined)
    expect(result.current[1].isIdle).toBe(true)
    await waitForNextUpdate()
    expect(result.current[0].data).toBe(true)
    expect(result.current[0].isSuccess).toBe(true)

    act((): void => {
      // eslint-disable-next-line no-void
      void result.current[1].reload()
    })

    expect(result.current[1].data).toBe(true)
    expect(result.current[1].isLoading).toBe(true)

    await waitForNextUpdate()
    expect(result.current[1].isSuccess).toBe(true)
  })

  test('should render correctly with enabled true', async () => {
    const { result, waitForNextUpdate } = renderHook<
      UseDataLoaderHookProps,
      ReturnType<typeof useDataLoader>
    >(props => useDataLoader(props.key, props.method, props.config), {
      initialProps,
      wrapper,
    })
    expect(result.current.data).toBe(undefined)
    expect(result.current.isLoading).toBe(true)
    await waitForNextUpdate()
    expect(result.current.data).toBe(true)
    expect(result.current.isSuccess).toBe(true)
    expect(result.current.isLoading).toBe(false)

    act(() => {
      // eslint-disable-next-line no-void
      void result.current.reload()
    })
    act(() => {
      // eslint-disable-next-line no-void
      void result.current.reload()
    })

    expect(result.current.data).toBe(true)
    expect(result.current.isLoading).toBe(true)
    await waitForNextUpdate()
    expect(result.current.data).toBe(true)
    expect(result.current.isSuccess).toBe(true)
    expect(result.current.isLoading).toBe(false)
  })

  test('should render correctly with key update', async () => {
    const propsToPass = {
      ...initialProps,
      key: 'test',
    }
    const { result, waitForNextUpdate, rerender } = renderHook<
      UseDataLoaderHookProps,
      UseDataLoaderResult
    >(
      () =>
        useDataLoader(propsToPass.key, propsToPass.method, propsToPass.config),
      {
        wrapper,
      },
    )

    expect(result.current.data).toBe(undefined)
    expect(result.current.isLoading).toBe(true)
    await waitForNextUpdate()
    expect(result.current.isSuccess).toBe(true)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.data).toBe(true)

    propsToPass.key = 'key-2'
    rerender()
    expect(result.current.isLoading).toBe(true)
    expect(result.current.data).toBe(undefined)
    await waitForNextUpdate()
    expect(result.current.data).toBe(true)
    expect(result.current.isSuccess).toBe(true)
    expect(result.current.isLoading).toBe(false)
  })

  test('should render correctly with pooling', async () => {
    const pollingProps = {
      config: {
        pollingInterval: PROMISE_TIMEOUT,
      },
      key: 'test',
      method: jest.fn(
        () =>
          new Promise(resolve => {
            setTimeout(() => resolve(true), PROMISE_TIMEOUT)
          }),
      ),
    }

    const method2 = jest.fn(
      () =>
        new Promise(resolve => {
          setTimeout(() => resolve(2), PROMISE_TIMEOUT)
        }),
    )

    const { result, waitForNextUpdate, rerender } = renderHook<
      UseDataLoaderHookProps,
      ReturnType<typeof useDataLoader>
    >(props => useDataLoader(props.key, props.method, props.config), {
      initialProps: pollingProps,
      wrapper,
    })
    expect(result.current.data).toBe(undefined)
    expect(result.current.isPolling).toBe(true)
    expect(result.current.isLoading).toBe(true)
    expect(pollingProps.method).toBeCalledTimes(1)
    await waitForNextUpdate()
    expect(result.current.data).toBe(true)
    expect(result.current.isSuccess).toBe(true)
    expect(result.current.isPolling).toBe(true)
    await waitForNextUpdate()
    expect(pollingProps.method).toBeCalledTimes(2)
    expect(result.current.isPolling).toBe(true)
    expect(result.current.isLoading).toBe(true)
    await waitForNextUpdate()
    expect(result.current.data).toBe(true)
    expect(result.current.isSuccess).toBe(true)
    expect(result.current.isLoading).toBe(false)
    rerender({
      ...pollingProps,
      config: {
        pollingInterval: 800,
      },
      method: method2,
    })
    act(() => {
      // eslint-disable-next-line no-void
      void result.current.reload()
    })
    expect(result.current.data).toBe(true)
    expect(result.current.isPolling).toBe(true)
    expect(result.current.isLoading).toBe(true)
    expect(result.current.isSuccess).toBe(false)
    await waitForNextUpdate()
    expect(method2).toBeCalledTimes(1)
    expect(result.current.isPolling).toBe(true)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.isSuccess).toBe(true)
    expect(result.current.data).toBe(2)

    rerender({
      ...pollingProps,
      config: {
        pollingInterval: PROMISE_TIMEOUT,
      },
      method: method2,
    })
    await waitForNextUpdate()
    expect(result.current.data).toBe(2)
    expect(result.current.isPolling).toBe(true)
    expect(result.current.isLoading).toBe(true)
    expect(result.current.isSuccess).toBe(false)
    expect(method2).toBeCalledTimes(2)
    await waitForNextUpdate()
    expect(result.current.isPolling).toBe(true)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.isSuccess).toBe(true)
    expect(result.current.data).toBe(2)
  })

  test('should render correctly with enabled off', async () => {
    const { result, waitForNextUpdate } = renderHook<
      UseDataLoaderHookProps,
      ReturnType<typeof useDataLoader>
    >(props => useDataLoader(props.key, props.method, props.config), {
      initialProps: {
        ...initialProps,
        config: {
          enabled: false,
        },
      },
      wrapper,
    })
    expect(result.current.data).toBe(undefined)
    expect(result.current.isIdle).toBe(true)

    act(() => {
      // eslint-disable-next-line no-void
      void result.current.reload()
    })

    expect(result.current.data).toBe(undefined)
    expect(result.current.isLoading).toBe(true)

    await waitForNextUpdate()

    expect(result.current.data).toBe(true)
    expect(result.current.isSuccess).toBe(true)
  })

  test('should call onSuccess', async () => {
    const onSuccess = jest.fn()
    const { result, waitForNextUpdate } = renderHook<
      UseDataLoaderHookProps,
      UseDataLoaderResult
    >(props => useDataLoader(props.key, props.method, props.config), {
      initialProps: {
        ...initialProps,
        config: {
          onSuccess,
        },
      },
      wrapper,
    })
    expect(result.current.data).toBe(undefined)
    expect(result.current.isLoading).toBe(true)
    await waitForNextUpdate()
    expect(result.current.data).toBe(true)
    expect(result.current.isSuccess).toBe(true)
    expect(onSuccess).toBeCalledTimes(1)
  })

  test('should call onError', async () => {
    const onSuccess = jest.fn()
    const onError = jest.fn()
    const error = new Error('Test error')
    const { result, waitForNextUpdate } = renderHook<
      UseDataLoaderHookProps,
      UseDataLoaderResult
    >(props => useDataLoader(props.key, props.method, props.config), {
      initialProps: {
        config: {
          onError,
          onSuccess,
        },
        key: 'test',
        method: () =>
          new Promise((resolve, reject) => {
            setTimeout(() => {
              reject(error)
            }, PROMISE_TIMEOUT)
          }),
      },
      wrapper,
    })
    expect(result.current.data).toBe(undefined)
    expect(result.current.isLoading).toBe(true)
    await waitForNextUpdate()
    expect(result.current.data).toBe(undefined)
    expect(result.current.error).toBe(error)
    expect(result.current.isError).toBe(true)

    expect(onError).toBeCalledTimes(1)
    expect(onError).toBeCalledWith(error)
    expect(onSuccess).toBeCalledTimes(0)
  })

  test('should override onError from Provider', async () => {
    const onSuccess = jest.fn()
    const onError = jest.fn()
    const error = new Error('Test error')
    const onErrorProvider = jest.fn()
    const { result, waitForNextUpdate } = renderHook<
      UseDataLoaderHookProps,
      UseDataLoaderResult
    >(props => useDataLoader(props.key, props.method, props.config), {
      initialProps: {
        config: {
          onError,
          onSuccess,
        },
        key: 'test',
        method: () =>
          new Promise((_, reject) => {
            setTimeout(() => {
              reject(error)
            }, PROMISE_TIMEOUT)
          }),
      },
      wrapper: wrapperWithOnError(onErrorProvider),
    })
    expect(result.current.data).toBe(undefined)
    expect(result.current.isLoading).toBe(true)
    await waitForNextUpdate()
    expect(result.current.data).toBe(undefined)
    expect(result.current.error).toBe(error)
    expect(result.current.isError).toBe(true)

    expect(onError).toBeCalledTimes(1)
    expect(onError).toBeCalledWith(error)
    expect(onErrorProvider).toBeCalledTimes(0)
    expect(onSuccess).toBeCalledTimes(0)
  })

  test('should call onError from Provider', async () => {
    const onSuccess = jest.fn()
    const error = new Error('Test error')
    const onErrorProvider = jest.fn()
    const { result, waitForNextUpdate } = renderHook<
      UseDataLoaderHookProps,
      UseDataLoaderResult
    >(props => useDataLoader(props.key, props.method, props.config), {
      initialProps: {
        config: {
          onSuccess,
        },
        key: 'test',
        method: () =>
          new Promise((_, reject) => {
            setTimeout(() => {
              reject(error)
            }, PROMISE_TIMEOUT)
          }),
      },
      wrapper: wrapperWithOnError(onErrorProvider),
    })

    expect(result.current.data).toBe(undefined)
    expect(result.current.isLoading).toBe(true)
    await waitForNextUpdate()
    expect(result.current.data).toBe(undefined)
    expect(result.current.error).toBe(error)
    expect(result.current.isError).toBe(true)

    expect(onErrorProvider).toBeCalledTimes(1)
    expect(onErrorProvider).toBeCalledWith(error)
    expect(onSuccess).toBeCalledTimes(0)
  })

  test('should clear error on new response', async () => {
    let success = false
    const onSuccess = jest.fn()
    const onError = jest.fn(() => {
      success = true
    })
    const error = new Error('Test error')
    const { result, waitForNextUpdate } = renderHook<
      UseDataLoaderHookProps,
      UseDataLoaderResult
    >(props => useDataLoader(props.key, props.method, props.config), {
      initialProps: {
        config: {
          onError,
          onSuccess,
        },
        key: 'test',
        method: () =>
          new Promise((resolve, reject) => {
            setTimeout(() => {
              if (success) {
                resolve(true)
              } else {
                reject(error)
              }
            }, PROMISE_TIMEOUT)
          }),
      },
      wrapper,
    })
    expect(result.current.data).toBe(undefined)
    expect(result.current.isLoading).toBe(true)
    await waitForNextUpdate()
    expect(result.current.data).toBe(undefined)
    expect(result.current.error).toBe(error)
    expect(result.current.isError).toBe(true)

    expect(onError).toBeCalledTimes(1)
    expect(onSuccess).toBeCalledTimes(0)

    act(() => {
      // eslint-disable-next-line no-void
      void result.current.reload()
    })

    await waitForNextUpdate()

    expect(result.current.data).toBe(true)
    expect(result.current.error).toBe(undefined)
    expect(result.current.isError).toBe(false)
    expect(result.current.isSuccess).toBe(true)
  })

  test('should use cached data', async () => {
    const { result, waitForNextUpdate } = renderHook<
      UseDataLoaderHookProps,
      UseDataLoaderResult[]
    >(
      props => [
        useDataLoader(props.key, props.method, props.config),
        useDataLoader(props.key, props.method, {
          ...props.config,
          enabled: false,
        }),
      ],
      {
        initialProps,
        wrapper,
      },
    )

    expect(result.current[0].data).toBe(undefined)
    expect(result.current[0].isLoading).toBe(true)
    expect(result.current[1].data).toBe(undefined)
    expect(result.current[1].isIdle).toBe(true)
    await waitForNextUpdate()
    expect(result.current[0].data).toBe(true)
    expect(result.current[0].isSuccess).toBe(true)

    act(() => {
      // eslint-disable-next-line no-void
      void result.current[1].reload()
    })

    expect(result.current[1].data).toBe(true)
    expect(result.current[1].isLoading).toBe(true)

    await waitForNextUpdate()
    expect(result.current[1].isSuccess).toBe(true)
  })

  test('should be reloaded from dataloader context', async () => {
    const mockedFn = jest.fn(
      () =>
        new Promise(resolve => {
          setTimeout(() => {
            resolve(true)
          }, PROMISE_TIMEOUT)
        }),
    )
    const { result, waitForNextUpdate } = renderHook<
      UseDataLoaderHookProps,
      [
        ReturnType<typeof useDataLoader>,
        ReturnType<typeof useDataLoaderContext>,
      ]
    >(
      props => [
        useDataLoader(props.key, props.method, props.config),
        useDataLoaderContext(),
      ],
      {
        initialProps: {
          ...initialProps,
          method: mockedFn,
        },
        wrapper,
      },
    )

    expect(result.current[0].data).toBe(undefined)
    expect(result.current[0].isLoading).toBe(true)
    expect(Object.values(result.current[1].getReloads()).length).toBe(1)
    await waitForNextUpdate()
    expect(result.current[0].data).toBe(true)
    expect(result.current[0].isSuccess).toBe(true)
    expect(mockedFn).toBeCalledTimes(1)

    act(() => {
      // eslint-disable-next-line no-void
      void result.current[1].reloadAll()
    })

    expect(result.current[0].data).toBe(true)
    expect(Object.values(result.current[1].getReloads()).length).toBe(1)
    expect(result.current[0].isLoading).toBe(true)

    await waitForNextUpdate()
    expect(result.current[0].isSuccess).toBe(true)
    expect(mockedFn).toBeCalledTimes(2)
  })

  test('should cancel request', async () => {
    const originalError = console.error
    console.error = jest.fn()
    const onCancel = jest.fn()
    const { result, unmount } = renderHook<
      UseDataLoaderHookProps,
      UseDataLoaderResult
    >(
      props =>
        useDataLoader(
          props.key,
          () => {
            const promise = new Promise(resolve => {
              setTimeout(() => resolve(true), PROMISE_TIMEOUT)
            }) as PromiseType
            promise.cancel = onCancel

            return promise
          },
          props.config,
        ),
      {
        initialProps,
        wrapper,
      },
    )
    expect(result.current.data).toBe(undefined)
    expect(result.current.isLoading).toBe(true)
    unmount()
    await act(result.current.reload)
    expect(onCancel).toHaveBeenCalledTimes(1)
    expect(result.current.data).toBe(undefined)
    expect(result.current.isSuccess).toBe(false)
    expect(result.current.isError).toBe(false)
    console.error = originalError
  })

  test('should cancel request with Error', async () => {
    const originalError = console.error
    console.error = jest.fn()
    const onCancel = jest.fn()
    const { result, unmount } = renderHook<
      UseDataLoaderHookProps,
      UseDataLoaderResult
    >(
      props =>
        useDataLoader(
          props.key,
          () => {
            const promise = new Promise((_, reject) => {
              setTimeout(() => reject(new Error('Test')), PROMISE_TIMEOUT)
            }) as PromiseType
            promise.cancel = onCancel

            return promise
          },
          props.config,
        ),
      {
        initialProps,
        wrapper,
      },
    )
    expect(result.current.data).toBe(undefined)
    expect(result.current.isLoading).toBe(true)
    unmount()
    await act(result.current.reload)
    expect(onCancel).toHaveBeenCalledTimes(1)
    expect(result.current.data).toBe(undefined)
    expect(result.current.error).toBe(undefined)
    expect(result.current.isSuccess).toBe(false)
    expect(result.current.isError).toBe(false)
    console.error = originalError
  })
})
