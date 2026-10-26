// oxlint-disable max-lines
import { StrictMode } from 'react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render, renderHook } from 'vitest-browser-react'
import DataLoaderProvider, { useDataLoaderContext } from '../DataLoaderProvider'
import type { DataLoaderMethodFn, KeyType, UseDataLoaderConfig } from '../types'
import { useDataLoader } from '../useDataLoader'

type UseDataLoaderHookProps = {
  config: UseDataLoaderConfig<unknown, unknown>
  key: KeyType
  method: () => Promise<unknown>
  children?: ReactNode
}

const PROMISE_TIMEOUT = 50

const fakeSuccessPromise = async () =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(true)
    }, PROMISE_TIMEOUT)
  })

const createPollingPromise = (getFlag: () => boolean, value: unknown) => async () =>
  new Promise(resolve => {
    setInterval(() => {
      if (getFlag()) {
        resolve(value)
      }
    }, PROMISE_TIMEOUT)
  })

const createSuccessOrErrorPromise = async (getSuccess: () => boolean, error: Error) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (getSuccess()) {
        resolve(true)
      } else {
        reject(error)
      }
    }, PROMISE_TIMEOUT)
  })

const initialProps = {
  config: {
    enabled: true,
    keepPreviousData: true,
  },
  key: 'test',
  method: vi.fn<typeof fakeSuccessPromise>(fakeSuccessPromise),
}
const wrapper = ({ children }: { children?: ReactNode }) => <DataLoaderProvider>{children}</DataLoaderProvider>

const wrapperWithCacheKey = ({ children }: { children?: ReactNode }) => (
  <DataLoaderProvider cacheKeyPrefix="sample">{children}</DataLoaderProvider>
)

const wrapperWithOnError =
  (onError: (err: Error) => void) =>
  ({ children }: { children?: ReactNode }) => <DataLoaderProvider onError={onError}>{children}</DataLoaderProvider>

describe(useDataLoader, () => {
  it('should render correctly without options', async () => {
    const { result } = await renderHook(
      (props: typeof initialProps = initialProps) => useDataLoader(props.key, props.method),
      {
        initialProps,
        wrapper,
      },
    )
    expect(result.current.data).toBeUndefined()
    expect(result.current.isLoading).toBe(true)
    expect(result.current.previousData).toBeUndefined()
    expect(initialProps.method).toHaveBeenCalledTimes(1)
    await vi.waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
    expect(initialProps.method).toHaveBeenCalledTimes(1)
    expect(result.current.data).toBe(true)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.previousData).toBeUndefined()
  })

  it('should render correctly with a complexe key', async () => {
    const key = ['baseKey', ['null', null], ['boolean', false], ['number', 10]].flat()

    const initProps = {
      ...initialProps,
      key,
    }

    const { result, rerender } = await renderHook(
      (props: typeof initProps = initProps) => useDataLoader(props.key, props.method),
      {
        initialProps: initProps,
        wrapper,
      },
    )
    expect(result.current.data).toBeUndefined()
    expect(result.current.isLoading).toBe(true)
    expect(result.current.previousData).toBeUndefined()
    await vi.waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
    expect(initialProps.method).toHaveBeenCalledTimes(1)
    expect(result.current.data).toBe(true)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.previousData).toBeUndefined()

    await rerender({ ...initProps })

    expect(initialProps.method).toHaveBeenCalledTimes(1)
    expect(result.current.data).toBe(true)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.previousData).toBeUndefined()
  })

  it('should render correctly without request enabled then enable it', async () => {
    let resolveIt = false
    const method = vi.fn<() => Promise<unknown>>(createPollingPromise(() => resolveIt, true))
    const testProps = {
      config: {
        enabled: false,
      },
      key: 'test-not-enabled-then-reload',
      method,
    }
    const { rerender, result } = await renderHook(
      (props: typeof testProps = testProps) => useDataLoader(props.key, props.method, props.config),
      {
        initialProps: testProps,
        wrapper,
      },
    )
    expect(result.current.data).toBeUndefined()
    expect(result.current.isLoading).toBe(false)
    expect(method).toHaveBeenCalledTimes(0)
    testProps.config.enabled = true
    await rerender({ ...testProps })
    await vi.waitFor(() => {
      expect(result.current.isLoading).toBe(true)
    })
    expect(result.current.data).toBeUndefined()
    resolveIt = true
    expect(method).toHaveBeenCalledTimes(1)
    await vi.waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
    expect(result.current.isLoading).toBe(false)
    expect(result.current.previousData).toBeUndefined()
    expect(result.current.data).toBe(true)
  })

  it('should render correctly without keepPreviousData', async () => {
    const testProps = {
      ...initialProps,
      config: {
        keepPreviousData: false,
      },
      key: 'test-2',
    }
    const { result } = await renderHook(
      (props: typeof testProps = testProps) => useDataLoader(props.key, props.method, props.config),
      {
        initialProps: testProps,
        wrapper,
      },
    )
    expect(result.current.data).toBeUndefined()
    expect(result.current.isLoading).toBe(true)
    await vi.waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
    expect(result.current.data).toBe(true)
    expect(result.current.isLoading).toBe(false)
  })

  it('should render correctly with result null', async () => {
    const testProps = {
      ...initialProps,
      key: 'test-3',
      method: async () =>
        new Promise(resolve => {
          setTimeout(() => {
            resolve(null)
          }, PROMISE_TIMEOUT)
        }),
    }
    const { result } = await renderHook(
      (props: typeof testProps = testProps) => useDataLoader(props.key, props.method, props.config),
      {
        initialProps: testProps,
        wrapper,
      },
    )
    expect(result.current.data).toBeUndefined()
    expect(result.current.isLoading).toBe(true)
    await vi.waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
    expect(result.current.data).toBeNull()
    expect(result.current.isLoading).toBe(false)
  })

  it('should render and cache correctly with cacheKeyPrefix', async () => {
    let resolveIt = false
    const method = vi.fn<() => Promise<unknown>>(createPollingPromise(() => resolveIt, true))

    const initProps = {
      ...initialProps,
      method,
    }
    const { result } = await renderHook(
      (props: typeof initProps = initProps) => [
        useDataLoader(props.key, props.method, props.config),
        useDataLoader('test-4', props.method, {
          ...props.config,
          enabled: false,
        }),
      ],
      {
        initialProps: initProps,
        wrapper: wrapperWithCacheKey,
      },
    )

    expect(result.current[0]?.data).toBeUndefined()
    expect(result.current[0]?.isLoading).toBe(true)
    resolveIt = true
    expect(result.current[1]?.data).toBeUndefined()
    expect(result.current[1]?.isIdle).toBe(true)
    await vi.waitFor(() => {
      expect(result.current[0]?.isSuccess).toBe(true)
    })
    expect(result.current[0]?.data).toBe(true)

    resolveIt = false
    result.current[1]?.reload().catch(() => null)
    await vi.waitFor(() => {
      expect(result.current[1]?.isLoading).toBe(true)
    })
    expect(result.current[1]?.data).toBeUndefined()
    resolveIt = true

    await vi.waitFor(() => {
      expect(result.current[1]?.isSuccess).toBe(true)
    })
    expect(result.current[1]?.data).toBe(true)
  })

  it('should render correctly with enabled true', async () => {
    const testProps = {
      ...initialProps,
      key: 'test-5',
    }
    const { result } = await renderHook(
      (props: typeof testProps = testProps) => useDataLoader(props.key, props.method, props.config),
      {
        initialProps: testProps,
        wrapper,
      },
    )
    expect(result.current.data).toBeUndefined()
    expect(result.current.isLoading).toBe(true)
    await vi.waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
    expect(result.current.data).toBe(true)
    expect(result.current.isLoading).toBe(false)
    result.current.reload().catch(() => null)
    result.current.reload().catch(() => null)
    await vi.waitFor(() => {
      expect(result.current.isFetching).toBe(true)
    })
    expect(result.current.data).toBe(true)
    await vi.waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
    expect(result.current.data).toBe(true)
    expect(result.current.isSuccess).toBe(true)
    expect(result.current.isLoading).toBe(false)
  })

  it('should render correctly with key update', async () => {
    const propsToPass = {
      ...initialProps,
      key: 'test-key-update',
    }
    const { result, rerender } = await renderHook(
      () => useDataLoader(propsToPass.key, propsToPass.method, propsToPass.config),
      {
        wrapper,
      },
    )

    expect(result.current.data).toBeUndefined()
    expect(result.current.isLoading).toBe(true)
    await vi.waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
    expect(result.current.isSuccess).toBe(true)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.data).toBe(true)

    propsToPass.key = 'key-2'
    await rerender()
    expect(result.current.isLoading).toBe(true)
    expect(result.current.data).toBeUndefined()
    await vi.waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
    expect(result.current.data).toBe(true)
    expect(result.current.isSuccess).toBe(true)
    expect(result.current.isLoading).toBe(false)
  })

  it('should render correctly with pooling', { retry: 3 }, async () => {
    const pollingProps = {
      config: {
        needPolling: () => true,
        pollingInterval: 1000,
      },
      key: 'test-6',
      method: vi.fn<() => Promise<boolean>>(
        async () =>
          new Promise(resolve => {
            setTimeout(() => {
              resolve(true)
            }, PROMISE_TIMEOUT)
          }),
      ),
    } as UseDataLoaderHookProps

    const method2 = vi.fn<() => Promise<number>>(
      async () =>
        new Promise(resolve => {
          setTimeout(() => {
            resolve(2)
          }, PROMISE_TIMEOUT)
        }),
    )

    const { result, rerender } = await renderHook(
      (props: typeof pollingProps = pollingProps) => useDataLoader(props.key, props.method, props.config),
      {
        initialProps: pollingProps,
        wrapper,
      },
    )
    expect(result.current.data).toBeUndefined()
    expect(result.current.isPolling).toBe(true)
    expect(result.current.isFetching).toBe(true)
    expect(pollingProps.method).toHaveBeenCalledTimes(1)
    await vi.waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
    expect(result.current.data).toBe(true)
    expect(result.current.isSuccess).toBe(true)
    expect(result.current.isPolling).toBe(true)
    await vi.waitFor(() => {
      expect(result.current.isFetching).toBe(true)
    })
    expect(pollingProps.method).toHaveBeenCalledTimes(2)
    expect(result.current.isPolling).toBe(true)

    await vi.waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
    expect(result.current.data).toBe(true)
    expect(result.current.isPolling).toBe(true)
    expect(result.current.isSuccess).toBe(true)
    expect(result.current.isFetching).toBe(false)
    await rerender({
      ...pollingProps,
      config: {
        pollingInterval: 1000,
      },
      method: method2,
    })
    expect(result.current.data).toBe(true)
    expect(result.current.isPolling).toBe(true)
    expect(result.current.isSuccess).toBe(true)
    expect(result.current.isFetching).toBe(false)
    await vi.waitFor(() => {
      expect(result.current.isFetching).toBe(true)
      expect(result.current.isSuccess).toBe(false)
    })
    await vi.waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
    expect(method2).toHaveBeenCalledTimes(1)
    expect(result.current.isSuccess).toBe(true)
    expect(result.current.isFetching).toBe(false)
    expect(result.current.data).toBe(2)

    await rerender({
      ...pollingProps,
      config: {
        pollingInterval: 1000,
      },
      method: method2,
    })
    await vi.waitFor(() => {
      expect(result.current.isFetching).toBe(true)
      expect(result.current.isSuccess).toBe(false)
    })
    expect(result.current.data).toBe(2)
    expect(result.current.isPolling).toBe(true)
    expect(method2).toHaveBeenCalledTimes(2)
    await vi.waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
    expect(result.current.isPolling).toBe(true)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.data).toBe(2)
  })

  it('should render correctly without pooling and needPolling', async () => {
    const pollingProps = {
      config: {
        needPolling: () => true,
        pollingInterval: undefined,
      },
      key: 'test-needpolling-no-interval',
      method: vi.fn<() => Promise<boolean>>(
        async () =>
          new Promise(resolve => {
            setTimeout(() => {
              resolve(true)
            }, PROMISE_TIMEOUT)
          }),
      ),
    } as UseDataLoaderHookProps

    const { result } = await renderHook(
      (props: typeof pollingProps = pollingProps) => useDataLoader(props.key, props.method, props.config),
      {
        initialProps: pollingProps,
        wrapper,
      },
    )
    expect(result.current.data).toBeUndefined()
    expect(result.current.isPolling).toBe(false)
    expect(result.current.isLoading).toBe(true)
    expect(pollingProps.method).toHaveBeenCalledTimes(1)
    await vi.waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
    expect(result.current.data).toBe(true)
    expect(result.current.isSuccess).toBe(true)
  })

  it('should render correctly with pooling and needPolling true', async () => {
    const pollingProps: UseDataLoaderHookProps = {
      config: {
        needPolling: true,
        pollingInterval: 1000,
      },
      key: 'test-needpolling-no-interval',
      method: vi.fn<() => Promise<boolean>>(
        async () =>
          new Promise(resolve => {
            setTimeout(() => {
              resolve(true)
            }, PROMISE_TIMEOUT)
          }),
      ),
    }

    const { result } = await renderHook(
      (props: typeof pollingProps = pollingProps) => useDataLoader(props.key, props.method, props.config),
      {
        initialProps: pollingProps,
        wrapper,
      },
    )
    expect(result.current.data).toBeUndefined()
    expect(result.current.isPolling).toBe(true)
    expect(result.current.isLoading).toBe(true)
    expect(pollingProps.method).toHaveBeenCalledTimes(1)
    await vi.waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
    expect(result.current.data).toBe(true)
    expect(result.current.isSuccess).toBe(true)
  })

  it('should render correctly with pooling and needPolling false', async () => {
    const pollingProps = {
      config: {
        needPolling: false,
        pollingInterval: PROMISE_TIMEOUT,
      },
      key: 'test-needpolling-no-interval',
      method: vi.fn<() => Promise<boolean>>(
        async () =>
          new Promise(resolve => {
            setTimeout(() => {
              resolve(true)
            }, PROMISE_TIMEOUT)
          }),
      ),
    } as UseDataLoaderHookProps

    const { result } = await renderHook(
      (props: typeof pollingProps = pollingProps) => useDataLoader(props.key, props.method, props.config),
      {
        initialProps: pollingProps,
        wrapper,
      },
    )
    expect(result.current.data).toBeUndefined()
    expect(result.current.isPolling).toBe(false)
    expect(result.current.isLoading).toBe(true)
    expect(pollingProps.method).toHaveBeenCalledTimes(1)
    await vi.waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
    expect(result.current.data).toBe(true)
    expect(result.current.isSuccess).toBe(true)
  })

  it('should render correctly with pooling and needPolling function false', async () => {
    const pollingProps = {
      config: {
        needPolling: () => false,
        pollingInterval: PROMISE_TIMEOUT,
      },
      key: 'test-needpolling-no-interval',
      method: vi.fn<() => Promise<boolean>>(
        async () =>
          new Promise(resolve => {
            setTimeout(() => {
              resolve(true)
            }, PROMISE_TIMEOUT)
          }),
      ),
    } as UseDataLoaderHookProps

    const { result } = await renderHook(
      (props: typeof pollingProps = pollingProps) => useDataLoader(props.key, props.method, props.config),
      {
        initialProps: pollingProps,
        wrapper,
      },
    )
    expect(result.current.data).toBeUndefined()
    expect(result.current.isPolling).toBe(true)
    expect(result.current.isLoading).toBe(true)
    expect(pollingProps.method).toHaveBeenCalledTimes(1)
    await vi.waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
    expect(result.current.data).toBe(true)
    expect(result.current.isPolling).toBe(false)
    expect(result.current.isSuccess).toBe(true)
  })

  it('should render correctly with enabled off', async () => {
    let resolveIt = false
    const method = vi.fn<() => Promise<unknown>>(createPollingPromise(() => resolveIt, true))

    const initProps = {
      ...initialProps,
      method,
    }
    const testProps = {
      ...initProps,
      config: {
        enabled: false,
      },
      key: 'test-7',
    }
    const { result } = await renderHook(
      (props: typeof testProps = testProps) => useDataLoader(props.key, props.method, props.config),
      {
        initialProps: testProps,
        wrapper,
      },
    )
    expect(result.current.data).toBeUndefined()
    expect(result.current.isIdle).toBe(true)
    result.current.reload().catch(() => null)
    await vi.waitFor(() => {
      expect(result.current.isLoading).toBe(true)
    })
    expect(result.current.data).toBeUndefined()
    resolveIt = true
    await vi.waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
    expect(result.current.data).toBe(true)
  })

  it('should call onSuccess', async () => {
    const onSuccess = vi.fn<() => void>()
    const testProps = {
      ...initialProps,
      config: {
        onSuccess,
      },
      key: 'test-8',
    }
    const { result } = await renderHook(
      (props: typeof testProps = testProps) => useDataLoader(props.key, props.method, props.config),
      {
        initialProps: testProps,
        wrapper,
      },
    )
    expect(result.current.data).toBeUndefined()
    expect(result.current.isLoading).toBe(true)
    await vi.waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
    expect(result.current.data).toBe(true)
    expect(onSuccess).toHaveBeenCalledTimes(1)
  })

  it('should call onError', async () => {
    const onSuccess = vi.fn<() => void>()
    const onError = vi.fn<() => void>()
    const error = new Error('Test error')
    const testProps = {
      config: {
        onError,
        onSuccess,
      },
      key: 'test-9',
      method: async () =>
        new Promise((_, reject) => {
          setTimeout(() => {
            reject(error)
          }, PROMISE_TIMEOUT)
        }),
    }
    const { result } = await renderHook(
      (props: typeof testProps = testProps) => useDataLoader(props.key, props.method, props.config),
      {
        initialProps: testProps,
        wrapper,
      },
    )
    expect(result.current.data).toBeUndefined()
    expect(result.current.isLoading).toBe(true)
    await vi.waitFor(() => {
      expect(result.current.isError).toBe(true)
    })
    expect(result.current.error).toBe(error)
    expect(result.current.data).toBeUndefined()

    expect(onError).toHaveBeenCalledTimes(1)
    expect(onError).toHaveBeenCalledWith(error)
    expect(onSuccess).toHaveBeenCalledTimes(0)
  })

  it('should override onError from Provider', async () => {
    const onSuccess = vi.fn<() => void>()
    const onError = vi.fn<() => void>()
    const error = new Error('Test error')
    const onErrorProvider = vi.fn<() => void>()
    const testProps = {
      config: {
        onError,
        onSuccess,
      },
      key: 'test-10',
      method: async () =>
        new Promise((_, reject) => {
          setTimeout(() => {
            reject(error)
          }, PROMISE_TIMEOUT)
        }),
    }
    const { result } = await renderHook(
      (props: typeof testProps = testProps) => useDataLoader(props.key, props.method, props.config),
      {
        initialProps: testProps,
        wrapper: wrapperWithOnError(onErrorProvider),
      },
    )
    expect(result.current.data).toBeUndefined()
    expect(result.current.isLoading).toBe(true)
    await vi.waitFor(() => {
      expect(result.current.isError).toBe(true)
    })
    expect(result.current.data).toBeUndefined()
    expect(result.current.error).toBe(error)

    expect(onError).toHaveBeenCalledTimes(1)
    expect(onError).toHaveBeenCalledWith(error)
    expect(onErrorProvider).toHaveBeenCalledTimes(0)
    expect(onSuccess).toHaveBeenCalledTimes(0)
  })

  it('should call onError from Provider', async () => {
    const onSuccess = vi.fn<() => void>()
    const error = new Error('Test error')
    const onErrorProvider = vi.fn<() => void>()
    const testProps = {
      config: {
        onSuccess,
      },
      key: 'test-11',
      method: async () =>
        new Promise((_, reject) => {
          setTimeout(() => {
            reject(error)
          }, PROMISE_TIMEOUT)
        }),
    }
    const { result } = await renderHook(
      (props: typeof testProps = testProps) => useDataLoader(props.key, props.method, props.config),
      {
        initialProps: testProps,
        wrapper: wrapperWithOnError(onErrorProvider),
      },
    )

    expect(result.current.data).toBeUndefined()
    expect(result.current.isLoading).toBe(true)
    await vi.waitFor(() => {
      expect(result.current.isError).toBe(true)
    })
    expect(result.current.data).toBeUndefined()
    expect(result.current.error).toBe(error)
    expect(result.current.isError).toBe(true)

    expect(onErrorProvider).toHaveBeenCalledTimes(1)
    expect(onErrorProvider).toHaveBeenCalledWith(error)
    expect(onSuccess).toHaveBeenCalledTimes(0)
  })

  it('should clear error on new response', async () => {
    let success = false
    const onSuccess = vi.fn<() => void>()
    const onError = vi.fn<() => void>(() => {
      success = true
    })
    const error = new Error('Test error')
    const testProps = {
      config: {
        onError,
        onSuccess,
      },
      key: 'test-12',
      method: async () => createSuccessOrErrorPromise(() => success, error),
    }
    const { result } = await renderHook(
      (props: typeof testProps = testProps) => useDataLoader(props.key, props.method, props.config),
      {
        initialProps: testProps,
        wrapper,
      },
    )
    expect(result.current.data).toBeUndefined()
    expect(result.current.isLoading).toBe(true)
    await vi.waitFor(() => {
      expect(result.current.isError).toBe(true)
    })
    expect(result.current.error).toBe(error)
    expect(result.current.isError).toBe(true)
    expect(result.current.data).toBeUndefined()

    expect(onError).toHaveBeenCalledTimes(1)
    expect(onSuccess).toHaveBeenCalledTimes(0)

    result.current.reload().catch(() => null)
    await vi.waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
    expect(result.current.data).toBe(true)
    expect(result.current.error).toBeUndefined()
    expect(result.current.isError).toBe(false)
  })

  it('should use cached data', async () => {
    const fakePromise = vi.fn<typeof initialProps.method>(initialProps.method)
    const testDate = new Date()
    const testProps = {
      ...initialProps,

      key: ['test-13', false, testDate],
      method: fakePromise,
    }
    const { result } = await renderHook(
      (props: typeof testProps = testProps) => [
        useDataLoader(props.key, props.method, props.config),
        useDataLoader(props.key, props.method, {
          ...props.config,
          enabled: false,
        }),

        useDataLoader(['test-13', '', testDate], props.method, props.config),
        useDataLoader(['test-13', null, testDate], props.method, props.config),
      ],
      {
        initialProps: testProps,
        wrapper,
      },
    )

    expect(result.current[0]?.data).toBeUndefined()
    expect(result.current[0]?.isLoading).toBe(true)
    expect(result.current[0]?.isIdle).toBe(false)
    expect(result.current[0]?.isSuccess).toBe(false)
    expect(result.current[1]?.data).toBeUndefined()
    expect(result.current[1]?.isIdle).toBe(false)
    expect(result.current[1]?.isSuccess).toBe(false)
    expect(result.current[1]?.isLoading).toBe(true)
    await vi.waitFor(() => {
      expect(result.current[0]?.isSuccess).toBe(true)
    })
    expect(result.current[0]?.data).toBe(true)

    result.current[1]?.reload().catch(() => null)
    await vi.waitFor(() => {
      expect(result.current[1]?.isFetching).toBe(true)
    })
    expect(result.current[1]?.data).toBe(true)

    await vi.waitFor(() => {
      expect(result.current[1]?.isSuccess).toBe(true)
    })
    expect(result.current[1]?.isSuccess).toBe(true)

    await vi.waitFor(() => {
      expect(result.current[2]?.isSuccess).toBe(true)
    })
    expect(result.current[2]?.data).toBe(true)
    expect(fakePromise).toHaveBeenCalledTimes(4)
  })

  it('should be reloaded from dataloader context', async () => {
    const mockedFn = vi.fn<() => Promise<boolean>>(
      async () =>
        new Promise(resolve => {
          setTimeout(() => {
            resolve(true)
          }, PROMISE_TIMEOUT)
        }),
    )
    const testProps: UseDataLoaderHookProps = {
      ...initialProps,
      key: 'test-15',
      method: mockedFn,
    }
    const { result } = await renderHook<
      UseDataLoaderHookProps,
      [ReturnType<typeof useDataLoader>, ReturnType<typeof useDataLoaderContext>]
    >(
      (props: UseDataLoaderHookProps = testProps) => [
        useDataLoader(props.key, props.method, props.config),
        useDataLoaderContext(),
      ],
      {
        initialProps: testProps,
        wrapper,
      },
    )

    expect(result.current[0].data).toBeUndefined()
    expect(result.current[0].isLoading).toBe(true)
    expect(Object.values(result.current[1].getReloads())).toHaveLength(1)
    await vi.waitFor(() => {
      expect(result.current[0].isSuccess).toBe(true)
    })
    expect(result.current[0].data).toBe(true)
    expect(mockedFn).toHaveBeenCalledTimes(1)

    result.current[1].reloadAll().catch(() => null)
    await vi.waitFor(() => {
      expect(result.current[0].isFetching).toBe(true)
    })
    expect(result.current[0].data).toBe(true)
    expect(Object.values(result.current[1].getReloads())).toHaveLength(1)

    await vi.waitFor(() => {
      expect(result.current[0].isSuccess).toBe(true)
    })
    expect(mockedFn).toHaveBeenCalledTimes(2)
  })

  it('should render correctly with dataLifetime prevent double call', async () => {
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
      method: vi.fn<typeof fakeSuccessPromise>(fakeSuccessPromise),
    }
    const { result, rerender } = await renderHook(
      (props: typeof testingProps = testingProps) => [
        useDataLoader(props.key, props.method, props.config),
        useDataLoader(props.key, props.method, props.config2),
      ],
      {
        initialProps: testingProps,
        wrapper,
      },
    )
    expect(result.current[0]?.data).toBeUndefined()
    expect(result.current[0]?.isLoading).toBe(true)
    expect(result.current[0]?.previousData).toBeUndefined()
    expect(testingProps.method).toHaveBeenCalledTimes(1)
    await vi.waitFor(() => {
      expect(result.current[0]?.isSuccess).toBe(true)
    })
    testingProps.config2.enabled = true
    await rerender(testingProps)
    expect(testingProps.method).toHaveBeenCalledTimes(1)
    expect(result.current[0]?.data).toBe(true)
    expect(result.current[1]?.data).toBe(true)
    expect(result.current[0]?.isLoading).toBe(false)
    expect(result.current[1]?.isLoading).toBe(false)
    expect(result.current[0]?.previousData).toBeUndefined()
    expect(result.current[1]?.previousData).toBeUndefined()
  })

  it('should render correctly with dataLifetime dont prevent double call', async () => {
    const method = vi.fn<() => Promise<boolean>>(
      async () =>
        new Promise(resolve => {
          setTimeout(() => {
            resolve(true)
          }, PROMISE_TIMEOUT + 10)
        }),
    )

    const testingProps = {
      config: {
        enabled: true,
      },
      config2: {
        enabled: false,
      },
      key: 'test-no-datalifetime',
      method,
    }
    const { result, rerender } = await renderHook(
      (props: typeof testingProps = testingProps) => [
        useDataLoader(props.key, props.method, props.config),
        useDataLoader(props.key, props.method, props.config2),
      ],
      {
        initialProps: testingProps,
        wrapper,
      },
    )
    expect(result.current[0]?.data).toBeUndefined()
    expect(result.current[0]?.isLoading).toBe(true)
    expect(result.current[0]?.previousData).toBeUndefined()
    expect(testingProps.method).toHaveBeenCalledTimes(1)
    await vi.waitFor(() => {
      expect(result.current[0]?.isSuccess).toBe(true)
    })
    testingProps.config2.enabled = true
    await rerender(testingProps)
    await vi.waitFor(() => {
      expect(result.current[0]?.isFetching).toBe(true)
    })
    await vi.waitFor(() => {
      expect(result.current[1]?.isFetching).toBe(true)
    })
    expect(testingProps.method).toHaveBeenCalledTimes(2)
    expect(result.current[0]?.data).toBe(true)
    expect(result.current[0]?.previousData).toBeUndefined()
    expect(result.current[1]?.data).toBe(true)
    expect(result.current[1]?.previousData).toBeUndefined()
    await vi.waitFor(() => {
      expect(result.current[0]?.isSuccess).toBe(true)
    })
    await vi.waitFor(() => {
      expect(result.current[1]?.isSuccess).toBe(true)
    })
  })

  it('should differentiate between isLoading and isFetching', async () => {
    let resolveIt = false
    const method = vi.fn<() => Promise<unknown>>(createPollingPromise(() => resolveIt, { id: 1, name: 'test' }))

    const testProps = {
      config: {
        enabled: true,
      },
      key: 'test-isLoading-vs-isFetching',
      method,
    }

    const { result } = await renderHook(
      (props: typeof testProps = testProps) => useDataLoader(props.key, props.method, props.config),
      {
        initialProps: testProps,
        wrapper,
      },
    )

    // Initially, isLoading should be true (first load with no cache)
    expect(result.current.isLoading).toBe(true)
    expect(result.current.isFetching).toBe(true)
    expect(result.current.data).toBeUndefined()

    // Resolve the first request
    resolveIt = true
    await vi.waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    // After first load, both should be false
    expect(result.current.isLoading).toBe(false)
    expect(result.current.isFetching).toBe(false)
    expect(result.current.data).toStrictEqual({ id: 1, name: 'test' })

    // Trigger a reload
    resolveIt = false
    result.current.reload().catch(() => null)

    // During reload, isLoading should be false (we have cached data) but isFetching should be true
    await vi.waitFor(() => {
      expect(result.current.isFetching).toBe(true)
    })
    expect(result.current.isLoading).toBe(false)
    expect(result.current.data).toStrictEqual({ id: 1, name: 'test' }) // Still have cached data

    // Resolve the reload
    resolveIt = true
    await vi.waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    // After reload, both should be false again
    expect(result.current.isLoading).toBe(false)
    expect(result.current.isFetching).toBe(false)
    expect(result.current.data).toStrictEqual({ id: 1, name: 'test' })
  })

  it('should cancel the in-flight request when unmounted', async () => {
    const signalRef: { current: AbortSignal | undefined } = { current: undefined }
    const slowMethod = vi.fn<(options: { signal?: AbortSignal }) => Promise<boolean>>(
      async ({ signal }) =>
        new Promise<boolean>(resolve => {
          signalRef.current = signal
          signal?.addEventListener('abort', () => {
            resolve(false)
          })
          setTimeout(() => {
            resolve(true)
          }, 2000)
        }),
    )

    const testProps = {
      ...initialProps,
      method: slowMethod,
    }

    const { result, unmount } = await renderHook(
      (props: typeof testProps = testProps) => useDataLoader(props.key, props.method),
      {
        initialProps: testProps,
        wrapper,
      },
    )

    await vi.waitFor(() => {
      expect(result.current.isLoading).toBe(true)
    })
    expect(signalRef.current).toBeDefined()
    expect(signalRef.current?.aborted).toBe(false)

    // Unmount while the request is still in-flight
    await unmount()

    // The cleanup must cancel the request, aborting its signal
    expect(signalRef.current?.aborted).toBe(true)
    expect(slowMethod).toHaveBeenCalledTimes(1)
  })
})

describe('useDataLoader in StrictMode', () => {
  // NOTE: StrictMode must be inline here — in this test environment, nesting
  // StrictMode inside a component wrapper disables its effect re-invocation.

  type CapturedLaunch = { signal?: AbortSignal; resolve: (value: string) => void; reject: (error: Error) => void }

  const createIgnoringAbortMethod = () => {
    const launches: CapturedLaunch[] = []
    const method: DataLoaderMethodFn<string> = async ({ signal }) =>
      new Promise<string>((resolve, reject) => {
        launches.push({ signal, resolve, reject })
      })
    return { launches, method: vi.fn<typeof method>(method) }
  }

  const createRespectingAbortMethod = () => {
    const launches: CapturedLaunch[] = []
    const method: DataLoaderMethodFn<string> = async ({ signal }) =>
      new Promise<string>((resolve, reject) => {
        launches.push({ signal, resolve, reject })
        signal?.addEventListener('abort', () => {
          const error = new Error('Aborted')
          error.name = 'AbortError'
          reject(error)
        })
      })
    return { launches, method: vi.fn<typeof method>(method) }
  }

  it('should not apply data from the cancelled first mount', async () => {
    const { launches, method } = createIgnoringAbortMethod()
    const onSuccess = vi.fn<(data: string) => void>()
    const last: { current?: { data?: string; isSuccess: boolean } } = {}

    const Probe = () => {
      const { data, isSuccess } = useDataLoader('strict-ignore', method, { onSuccess })
      last.current = { data, isSuccess }
      return null
    }

    await render(
      <StrictMode>
        <DataLoaderProvider>
          <Probe />
        </DataLoaderProvider>
      </StrictMode>,
    )

    // StrictMode double-mounts: two launches, the first one cancelled
    await vi.waitFor(() => {
      expect(method).toHaveBeenCalledTimes(2)
    })
    expect(launches[0]?.signal?.aborted).toBe(true)

    // The fresh launch resolves first
    launches[1]?.resolve('fresh-data')
    await vi.waitFor(() => {
      expect(last.current?.isSuccess).toBe(true)
    })
    expect(last.current?.data).toBe('fresh-data')
    expect(onSuccess).toHaveBeenCalledTimes(1)

    // The cancelled launch resolves last with stale data — it must be ignored
    launches[0]?.resolve('stale-data')
    await vi.waitFor(() => {
      expect(onSuccess).toHaveBeenCalledTimes(1)
    })
    expect(last.current?.data).toBe('fresh-data')
  })

  it('should not call onError for the cancelled first mount', async () => {
    const { launches, method } = createRespectingAbortMethod()
    const onError = vi.fn<(error: Error) => void>()
    const onSuccess = vi.fn<(data: string) => void>()
    const last: { current?: { isSuccess: boolean } } = {}

    const Probe = () => {
      const { isSuccess } = useDataLoader('strict-abort', method, { onError, onSuccess })
      last.current = { isSuccess }
      return null
    }

    await render(
      <StrictMode>
        <DataLoaderProvider>
          <Probe />
        </DataLoaderProvider>
      </StrictMode>,
    )

    await vi.waitFor(() => {
      expect(method).toHaveBeenCalledTimes(2)
    })
    expect(launches[0]?.signal?.aborted).toBe(true)

    // Let the aborted first launch settle: its AbortError must not reach onError
    await vi.waitFor(() => {
      expect(onError).not.toHaveBeenCalled()
    })

    // The fresh launch completes normally and fires onSuccess once
    launches[1]?.resolve('fresh-data')
    await vi.waitFor(() => {
      expect(onSuccess).toHaveBeenCalledTimes(1)
    })
    await vi.waitFor(() => {
      expect(last.current?.isSuccess).toBe(true)
    })
    expect(onError).not.toHaveBeenCalled()
  })
})
