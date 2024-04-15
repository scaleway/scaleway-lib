/* eslint-disable no-console */
import { describe, expect, jest, test } from '@jest/globals'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import DataLoaderProvider, { useDataLoaderContext } from '../DataLoaderProvider'
import type { KeyType, UseDataLoaderConfig } from '../types'
import { useDataLoader } from '../useDataLoader'

type UseDataLoaderHookProps = {
  config: UseDataLoaderConfig<unknown, unknown>
  key: KeyType
  method: () => Promise<unknown>
  children?: ReactNode
}

const PROMISE_TIMEOUT = 50

const fakeSuccessPromise = () =>
  new Promise(resolve => {
    setTimeout(() => resolve(true), PROMISE_TIMEOUT)
  })

const initialProps = {
  config: {
    enabled: true,
    keepPreviousData: true,
  },
  key: 'test',
  method: jest.fn(fakeSuccessPromise),
}
const wrapper = ({ children }: { children?: ReactNode }) => (
  <DataLoaderProvider>{children}</DataLoaderProvider>
)

const wrapperWithCacheKey = ({ children }: { children?: ReactNode }) => (
  <DataLoaderProvider cacheKeyPrefix="sample">{children}</DataLoaderProvider>
)

const wrapperWithOnError =
  (onError: (err: Error) => void) =>
  ({ children }: { children?: ReactNode }) => (
    <DataLoaderProvider onError={onError}>{children}</DataLoaderProvider>
  )

describe('useDataLoader', () => {
  test('should render correctly without options', async () => {
    const { result } = renderHook(
      props => useDataLoader(props.key, props.method),
      {
        initialProps,
        wrapper,
      },
    )
    expect(result.current.data).toBe(undefined)
    expect(result.current.isLoading).toBe(true)
    expect(result.current.previousData).toBe(undefined)
    expect(initialProps.method).toBeCalledTimes(1)
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(initialProps.method).toBeCalledTimes(1)
    expect(result.current.data).toBe(true)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.previousData).toBe(undefined)
  })

  test('should render correctly with a complexe key', async () => {
    const key = [
      'baseKey',
      ['null', null],
      ['boolean', false],
      ['number', 10],
    ].flat()

    const method = jest.fn(
      () =>
        new Promise(resolve => {
          setTimeout(() => resolve(true), PROMISE_TIMEOUT + 150)
        }),
    )

    const initProps = {
      ...initialProps,
      key,
      method,
    }

    const { result, rerender } = renderHook(
      props => useDataLoader(props.key, props.method),
      {
        initialProps: initProps,
        wrapper,
      },
    )
    expect(result.current.data).toBe(undefined)
    expect(result.current.isLoading).toBe(true)
    expect(result.current.previousData).toBe(undefined)
    expect(initialProps.method).toBeCalledTimes(1)
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(initialProps.method).toBeCalledTimes(1)
    expect(result.current.data).toBe(true)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.previousData).toBe(undefined)

    rerender({ ...initProps })

    expect(initialProps.method).toBeCalledTimes(1)
    expect(result.current.data).toBe(true)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.previousData).toBe(undefined)
  })

  test('should render correctly without request enabled then enable it', async () => {
    const method = jest.fn(
      () =>
        new Promise(resolve => {
          setTimeout(() => resolve(true), PROMISE_TIMEOUT)
        }),
    )
    const testProps = {
      config: {
        enabled: false,
      },
      key: 'test-not-enabled-then-reload',
      method,
    }
    const { rerender, result } = renderHook(
      props => useDataLoader(props.key, props.method, props.config),
      {
        initialProps: testProps,
        wrapper,
      },
    )
    expect(result.current.data).toBe(undefined)
    expect(result.current.isLoading).toBe(false)
    expect(method).toBeCalledTimes(0)
    testProps.config.enabled = true
    rerender({ ...testProps })
    await waitFor(() => expect(result.current.isLoading).toBe(true))
    expect(method).toBeCalledTimes(1)
    expect(result.current.data).toBe(undefined)
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.isLoading).toBe(false)
    expect(result.current.previousData).toBe(undefined)
    expect(result.current.data).toBe(true)
  })

  test('should render correctly without keepPreviousData', async () => {
    const { result } = renderHook(
      props => useDataLoader(props.key, props.method, props.config),
      {
        initialProps: {
          ...initialProps,
          config: {
            keepPreviousData: false,
          },
          key: 'test-2',
        },
        wrapper,
      },
    )
    expect(result.current.data).toBe(undefined)
    expect(result.current.isLoading).toBe(true)
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toBe(true)
    expect(result.current.isLoading).toBe(false)
  })

  test('should render correctly with result null', async () => {
    const { result } = renderHook(
      props => useDataLoader(props.key, props.method, props.config),
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
    expect(result.current.data).toBe(undefined)
    expect(result.current.isLoading).toBe(true)
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toBe(null)
    expect(result.current.isLoading).toBe(false)
  })

  test('should render and cache correctly with cacheKeyPrefix', async () => {
    const { result } = renderHook(
      props => [
        useDataLoader(props.key, props.method, props.config),
        useDataLoader('test-4', props.method, {
          ...props.config,
          enabled: false,
        }),
      ],
      {
        initialProps,
        wrapper: wrapperWithCacheKey,
      },
    )

    expect(result.current[0]?.data).toBe(undefined)
    expect(result.current[0]?.isLoading).toBe(true)
    expect(result.current[1]?.data).toBe(undefined)
    expect(result.current[1]?.isIdle).toBe(true)
    await waitFor(() => expect(result.current[0]?.isSuccess).toBe(true))
    expect(result.current[0]?.data).toBe(true)

    result.current[1]?.reload().catch(undefined)
    await waitFor(() => expect(result.current[1]?.isLoading).toBe(true))
    expect(result.current[1]?.data).toBe(undefined)

    await waitFor(() => expect(result.current[1]?.isSuccess).toBe(true))
    expect(result.current[1]?.data).toBe(true)
  })

  test('should render correctly with enabled true', async () => {
    const { result } = renderHook(
      props => useDataLoader(props.key, props.method, props.config),
      {
        initialProps: {
          ...initialProps,
          key: 'test-5',
        },
        wrapper,
      },
    )
    expect(result.current.data).toBe(undefined)
    expect(result.current.isLoading).toBe(true)
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toBe(true)
    expect(result.current.isLoading).toBe(false)
    result.current.reload().catch(undefined)
    result.current.reload().catch(undefined)
    await waitFor(() => expect(result.current.isLoading).toBe(true))
    expect(result.current.data).toBe(true)
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toBe(true)
    expect(result.current.isSuccess).toBe(true)
    expect(result.current.isLoading).toBe(false)
  })

  test('should render correctly with key update', async () => {
    const propsToPass = {
      ...initialProps,
      key: 'test-key-update',
    }
    const { result, rerender } = renderHook(
      () =>
        useDataLoader(propsToPass.key, propsToPass.method, propsToPass.config),
      {
        wrapper,
      },
    )

    expect(result.current.data).toBe(undefined)
    expect(result.current.isLoading).toBe(true)
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.isSuccess).toBe(true)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.data).toBe(true)

    propsToPass.key = 'key-2'
    rerender()
    expect(result.current.isLoading).toBe(true)
    expect(result.current.data).toBe(undefined)
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toBe(true)
    expect(result.current.isSuccess).toBe(true)
    expect(result.current.isLoading).toBe(false)
  })

  test('should render correctly with pooling', async () => {
    const pollingProps = {
      config: {
        needPolling: () => true,
        pollingInterval: 1000,
      },
      key: 'test-6',
      method: jest.fn(
        () =>
          new Promise(resolve => {
            setTimeout(() => resolve(true), PROMISE_TIMEOUT)
          }),
      ),
    } as UseDataLoaderHookProps

    const method2 = jest.fn(
      () =>
        new Promise(resolve => {
          setTimeout(() => resolve(2), PROMISE_TIMEOUT)
        }),
    )

    const { result, rerender } = renderHook(
      props => useDataLoader(props.key, props.method, props.config),
      {
        initialProps: pollingProps,
        wrapper,
      },
    )
    expect(result.current.data).toBe(undefined)
    expect(result.current.isPolling).toBe(true)
    expect(result.current.isLoading).toBe(true)
    expect(pollingProps.method).toBeCalledTimes(1)
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toBe(true)
    expect(result.current.isSuccess).toBe(true)
    expect(result.current.isPolling).toBe(true)
    await waitFor(() => expect(result.current.isLoading).toBe(true))
    expect(pollingProps.method).toBeCalledTimes(2)
    expect(result.current.isPolling).toBe(true)

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toBe(true)
    expect(result.current.isSuccess).toBe(true)
    expect(result.current.isLoading).toBe(false)
    rerender({
      ...pollingProps,
      config: {
        pollingInterval: 1000,
      },
      method: method2,
    })
    expect(result.current.data).toBe(true)
    expect(result.current.isPolling).toBe(true)
    expect(result.current.isSuccess).toBe(true)
    expect(result.current.isLoading).toBe(false)
    await waitFor(() => expect(result.current.isLoading).toBe(true))
    expect(result.current.isSuccess).toBe(false)
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(method2).toBeCalledTimes(1)
    expect(result.current.isPolling).toBe(true)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.data).toBe(2)

    rerender({
      ...pollingProps,
      config: {
        pollingInterval: 1000,
      },
      method: method2,
    })
    await waitFor(() => expect(result.current.isLoading).toBe(true))
    expect(result.current.data).toBe(2)
    expect(result.current.isPolling).toBe(true)
    expect(result.current.isSuccess).toBe(false)
    expect(method2).toBeCalledTimes(2)
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.isPolling).toBe(true)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.data).toBe(2)
  })

  test('should render correctly without pooling and needPolling', async () => {
    const pollingProps = {
      config: {
        needPolling: () => true,
        pollingInterval: undefined,
      },
      key: 'test-needpolling-no-interval',
      method: jest.fn(
        () =>
          new Promise(resolve => {
            setTimeout(() => resolve(true), PROMISE_TIMEOUT)
          }),
      ),
    } as UseDataLoaderHookProps

    const { result } = renderHook(
      props => useDataLoader(props.key, props.method, props.config),
      {
        initialProps: pollingProps,
        wrapper,
      },
    )
    expect(result.current.data).toBe(undefined)
    expect(result.current.isPolling).toBe(false)
    expect(result.current.isLoading).toBe(true)
    expect(pollingProps.method).toBeCalledTimes(1)
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toBe(true)
    expect(result.current.isSuccess).toBe(true)
  })
  test('should render correctly with pooling and needPolling true', async () => {
    const pollingProps = {
      config: {
        needPolling: true,
        pollingInterval: 1000,
      },
      key: 'test-needpolling-no-interval',
      method: jest.fn(
        () =>
          new Promise(resolve => {
            setTimeout(() => resolve(true), PROMISE_TIMEOUT)
          }),
      ),
    } as UseDataLoaderHookProps

    const { result } = renderHook(
      props => useDataLoader(props.key, props.method, props.config),
      {
        initialProps: pollingProps,
        wrapper,
      },
    )
    expect(result.current.data).toBe(undefined)
    expect(result.current.isPolling).toBe(true)
    expect(result.current.isLoading).toBe(true)
    expect(pollingProps.method).toBeCalledTimes(1)
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toBe(true)
    expect(result.current.isSuccess).toBe(true)
  })

  test('should render correctly with pooling and needPolling false', async () => {
    const pollingProps = {
      config: {
        needPolling: false,
        pollingInterval: PROMISE_TIMEOUT,
      },
      key: 'test-needpolling-no-interval',
      method: jest.fn(
        () =>
          new Promise(resolve => {
            setTimeout(() => resolve(true), PROMISE_TIMEOUT)
          }),
      ),
    } as UseDataLoaderHookProps

    const { result } = renderHook(
      props => useDataLoader(props.key, props.method, props.config),
      {
        initialProps: pollingProps,
        wrapper,
      },
    )
    expect(result.current.data).toBe(undefined)
    expect(result.current.isPolling).toBe(false)
    expect(result.current.isLoading).toBe(true)
    expect(pollingProps.method).toBeCalledTimes(1)
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toBe(true)
    expect(result.current.isSuccess).toBe(true)
  })

  test('should render correctly with pooling and needPolling function false', async () => {
    const pollingProps = {
      config: {
        needPolling: () => false,
        pollingInterval: PROMISE_TIMEOUT,
      },
      key: 'test-needpolling-no-interval',
      method: jest.fn(
        () =>
          new Promise(resolve => {
            setTimeout(() => resolve(true), PROMISE_TIMEOUT)
          }),
      ),
    } as UseDataLoaderHookProps

    const { result } = renderHook(
      props => useDataLoader(props.key, props.method, props.config),
      {
        initialProps: pollingProps,
        wrapper,
      },
    )
    expect(result.current.data).toBe(undefined)
    expect(result.current.isPolling).toBe(true)
    expect(result.current.isLoading).toBe(true)
    expect(pollingProps.method).toBeCalledTimes(1)
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toBe(true)
    expect(result.current.isPolling).toBe(false)
    expect(result.current.isSuccess).toBe(true)
  })

  test('should render correctly with enabled off', async () => {
    const { result } = renderHook(
      props => useDataLoader(props.key, props.method, props.config),
      {
        initialProps: {
          ...initialProps,
          config: {
            enabled: false,
          },
          key: 'test-7',
        },
        wrapper,
      },
    )
    expect(result.current.data).toBe(undefined)
    expect(result.current.isIdle).toBe(true)
    result.current.reload().catch(undefined)
    await waitFor(() => expect(result.current.isLoading).toBe(true))
    expect(result.current.data).toBe(undefined)
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toBe(true)
  })

  test('should call onSuccess', async () => {
    const onSuccess = jest.fn<any>()
    const { result } = renderHook(
      props => useDataLoader(props.key, props.method, props.config),
      {
        initialProps: {
          ...initialProps,
          config: {
            onSuccess,
          },
          key: 'test-8',
        },
        wrapper,
      },
    )
    expect(result.current.data).toBe(undefined)
    expect(result.current.isLoading).toBe(true)
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toBe(true)
    expect(onSuccess).toBeCalledTimes(1)
  })

  test('should call onError', async () => {
    const onSuccess = jest.fn<any>()
    const onError = jest.fn<any>()
    const error = new Error('Test error')
    const { result } = renderHook(
      props => useDataLoader(props.key, props.method, props.config),
      {
        initialProps: {
          config: {
            onError,
            onSuccess,
          },
          key: 'test-9',
          method: () =>
            new Promise((_, reject) => {
              setTimeout(() => {
                reject(error)
              }, PROMISE_TIMEOUT)
            }),
        },
        wrapper,
      },
    )
    expect(result.current.data).toBe(undefined)
    expect(result.current.isLoading).toBe(true)
    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.error).toBe(error)
    expect(result.current.data).toBe(undefined)

    expect(onError).toBeCalledTimes(1)
    expect(onError).toBeCalledWith(error)
    expect(onSuccess).toBeCalledTimes(0)
  })

  test('should override onError from Provider', async () => {
    const onSuccess = jest.fn<any>()
    const onError = jest.fn<any>()
    const error = new Error('Test error')
    const onErrorProvider = jest.fn()
    const { result } = renderHook(
      props => useDataLoader(props.key, props.method, props.config),
      {
        initialProps: {
          config: {
            onError,
            onSuccess,
          },
          key: 'test-10',
          method: () =>
            new Promise((_, reject) => {
              setTimeout(() => {
                reject(error)
              }, PROMISE_TIMEOUT)
            }),
        },
        wrapper: wrapperWithOnError(onErrorProvider),
      },
    )
    expect(result.current.data).toBe(undefined)
    expect(result.current.isLoading).toBe(true)
    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.data).toBe(undefined)
    expect(result.current.error).toBe(error)

    expect(onError).toBeCalledTimes(1)
    expect(onError).toBeCalledWith(error)
    expect(onErrorProvider).toBeCalledTimes(0)
    expect(onSuccess).toBeCalledTimes(0)
  })

  test('should call onError from Provider', async () => {
    const onSuccess = jest.fn<any>()
    const error = new Error('Test error')
    const onErrorProvider = jest.fn()
    const { result } = renderHook(
      props => useDataLoader(props.key, props.method, props.config),
      {
        initialProps: {
          config: {
            onSuccess,
          },
          key: 'test-11',
          method: () =>
            new Promise((_, reject) => {
              setTimeout(() => {
                reject(error)
              }, PROMISE_TIMEOUT)
            }),
        },
        wrapper: wrapperWithOnError(onErrorProvider),
      },
    )

    expect(result.current.data).toBe(undefined)
    expect(result.current.isLoading).toBe(true)
    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.data).toBe(undefined)
    expect(result.current.error).toBe(error)
    expect(result.current.isError).toBe(true)

    expect(onErrorProvider).toBeCalledTimes(1)
    expect(onErrorProvider).toBeCalledWith(error)
    expect(onSuccess).toBeCalledTimes(0)
  })

  test('should clear error on new response', async () => {
    let success = false
    const onSuccess = jest.fn<any>()
    const onError = jest.fn(() => {
      success = true
    })
    const error = new Error('Test error')
    const { result } = renderHook(
      props => useDataLoader(props.key, props.method, props.config),
      {
        initialProps: {
          config: {
            onError,
            onSuccess,
          },
          key: 'test-12',
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
      },
    )
    expect(result.current.data).toBe(undefined)
    expect(result.current.isLoading).toBe(true)
    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.error).toBe(error)
    expect(result.current.isError).toBe(true)
    expect(result.current.data).toBe(undefined)

    expect(onError).toBeCalledTimes(1)
    expect(onSuccess).toBeCalledTimes(0)

    result.current.reload().catch(undefined)
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toBe(true)
    expect(result.current.error).toBe(undefined)
    expect(result.current.isError).toBe(false)
  })

  test('should use cached data', async () => {
    const fakePromise = jest.fn(initialProps.method)
    const testDate = new Date()
    const { result } = renderHook(
      props => [
        useDataLoader(props.key, props.method, props.config),
        useDataLoader(props.key, props.method, {
          ...props.config,
          enabled: false,
        }),
        // eslint-disable-next-line no-sparse-arrays
        useDataLoader(['test-13', , testDate], props.method, props.config),
        useDataLoader(['test-13', null, testDate], props.method, props.config),
      ],
      {
        initialProps: {
          ...initialProps,
          // eslint-disable-next-line no-sparse-arrays
          key: ['test-13', false, testDate],
          method: fakePromise,
        },
        wrapper,
      },
    )

    expect(result.current[0]?.data).toBe(undefined)
    expect(result.current[0]?.isLoading).toBe(true)
    expect(result.current[0]?.isIdle).toBe(false)
    expect(result.current[0]?.isSuccess).toBe(false)
    expect(result.current[1]?.data).toBe(undefined)
    expect(result.current[1]?.isIdle).toBe(false)
    expect(result.current[1]?.isSuccess).toBe(false)
    expect(result.current[1]?.isLoading).toBe(true)
    await waitFor(() => expect(result.current[0]?.isSuccess).toBe(true))
    expect(result.current[0]?.data).toBe(true)

    result.current[1]?.reload().catch(undefined)
    await waitFor(() => expect(result.current[1]?.isLoading).toBe(true))
    expect(result.current[1]?.data).toBe(true)

    await waitFor(() => expect(result.current[1]?.isSuccess).toBe(true))
    expect(result.current[1]?.isSuccess).toBe(true)

    await waitFor(() => expect(result.current[2]?.isSuccess).toBe(true))
    expect(result.current[2]?.data).toBe(true)
    expect(fakePromise).toBeCalledTimes(3)
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
    const { result } = renderHook<
      [
        ReturnType<typeof useDataLoader>,
        ReturnType<typeof useDataLoaderContext>,
      ],
      UseDataLoaderHookProps
    >(
      props => [
        useDataLoader(props.key, props.method, props.config),
        useDataLoaderContext(),
      ],
      {
        initialProps: {
          ...initialProps,
          key: 'test-15',
          method: mockedFn,
        },
        wrapper,
      },
    )

    expect(result.current[0].data).toBe(undefined)
    expect(result.current[0].isLoading).toBe(true)
    expect(Object.values(result.current[1].getReloads()).length).toBe(1)
    await waitFor(() => expect(result.current[0].isSuccess).toBe(true))
    expect(result.current[0].data).toBe(true)
    expect(mockedFn).toBeCalledTimes(1)

    result.current[1].reloadAll().catch(undefined)
    await waitFor(() => expect(result.current[0].isLoading).toBe(true))
    expect(result.current[0].data).toBe(true)
    expect(Object.values(result.current[1].getReloads()).length).toBe(1)

    await waitFor(() => expect(result.current[0].isSuccess).toBe(true))
    expect(mockedFn).toBeCalledTimes(2)
  })

  test('should render correctly with dataLifetime prevent double call', async () => {
    const testingProps = {
      config: {
        dataLifetime: 1000,
        enabled: true,
      },
      config2: {
        dataLifetime: 1000,
        enabled: false,
      },
      key: 'test-datalifetime',
      method: jest.fn(fakeSuccessPromise),
    }
    const { result, rerender } = renderHook(
      props => [
        useDataLoader(props.key, props.method, props.config),
        useDataLoader(props.key, props.method, props.config2),
      ],
      {
        initialProps: testingProps,
        wrapper,
      },
    )
    expect(result.current[0]?.data).toBe(undefined)
    expect(result.current[0]?.isLoading).toBe(true)
    expect(result.current[0]?.previousData).toBe(undefined)
    expect(testingProps.method).toBeCalledTimes(1)
    await waitFor(() => expect(result.current[0]?.isSuccess).toBe(true))
    testingProps.config2.enabled = true
    rerender(testingProps)
    expect(testingProps.method).toBeCalledTimes(1)
    expect(result.current[0]?.data).toBe(true)
    expect(result.current[1]?.data).toBe(true)
    expect(result.current[0]?.isLoading).toBe(false)
    expect(result.current[1]?.isLoading).toBe(false)
    expect(result.current[0]?.previousData).toBe(undefined)
    expect(result.current[1]?.previousData).toBe(undefined)
  })

  test('should render correctly with dataLifetime dont prevent double call', async () => {
    const testingProps = {
      config: {
        enabled: true,
      },
      config2: {
        enabled: false,
      },
      key: 'test-no-datalifetime',
      method: jest.fn(fakeSuccessPromise),
    }
    const { result, rerender } = renderHook(
      props => [
        useDataLoader(props.key, props.method, props.config),
        useDataLoader(props.key, props.method, props.config2),
      ],
      {
        initialProps: testingProps,
        wrapper,
      },
    )
    expect(result.current[0]?.data).toBe(undefined)
    expect(result.current[0]?.isLoading).toBe(true)
    expect(result.current[0]?.previousData).toBe(undefined)
    expect(testingProps.method).toBeCalledTimes(1)
    await waitFor(() => expect(result.current[0]?.isSuccess).toBe(true))
    testingProps.config2.enabled = true
    rerender(testingProps)
    await waitFor(() => expect(result.current[0]?.isLoading).toBe(true))
    await waitFor(() => expect(result.current[1]?.isLoading).toBe(true))
    expect(testingProps.method).toBeCalledTimes(2)
    expect(result.current[0]?.data).toBe(true)
    expect(result.current[0]?.previousData).toBe(undefined)
    expect(result.current[1]?.data).toBe(true)
    expect(result.current[1]?.previousData).toBe(undefined)
    await waitFor(() => expect(result.current[0]?.isSuccess).toBe(true))
    await waitFor(() => expect(result.current[1]?.isSuccess).toBe(true))
  })
})
/* eslint-enable no-console */
