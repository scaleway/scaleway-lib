import { act, renderHook } from '@testing-library/react-hooks'
import React from 'react'
import DataLoaderProvider, { useDataLoaderContext } from '../DataLoaderProvider'
import useDataLoader from '../useDataLoader'

const initialProps = {
  key: 'test',
  method: () =>
    new Promise(resolve => {
      setTimeout(() => resolve(true), 500)
    }),
  config: {
    enabled: true,
    reloadOnKeyChange: false,
  },
}
// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <DataLoaderProvider>{children}</DataLoaderProvider>
)

describe('useDataLoader', () => {
  test('should render correctly with enabled true', async () => {
    const { result, waitForNextUpdate, rerender } = renderHook(
      props => useDataLoader(props.key, props.method, props.config),
      {
        wrapper,
        initialProps,
      },
    )
    expect(result.current.data).toBe(undefined)
    expect(result.current.isLoading).toBe(true)
    rerender()
    await waitForNextUpdate()
    expect(result.current.data).toBe(true)
    expect(result.current.isSuccess).toBe(true)
    expect(result.current.isLoading).toBe(false)

    act(() => {
      result.current.reload()
    })
    act(() => {
      result.current.reload()
    })

    expect(result.current.data).toBe(true)
    expect(result.current.isLoading).toBe(true)
    await waitForNextUpdate()
    expect(result.current.data).toBe(true)
    expect(result.current.isSuccess).toBe(true)
    expect(result.current.isLoading).toBe(false)
  })

  test('should render correctly with bad key', async () => {
    const { result, waitForNextUpdate } = renderHook(
      props => useDataLoader(undefined, props.method, props.config),
      {
        wrapper,
        initialProps,
      },
    )
    expect(result.current.data).toBe(undefined)
    expect(result.current.isLoading).toBe(true)
    await waitForNextUpdate()
    expect(result.current.data).toBe(true)
    expect(result.current.isSuccess).toBe(true)
    expect(result.current.isLoading).toBe(false)

    act(() => {
      result.current.reload()
    })
    act(() => {
      result.current.reload()
    })

    expect(result.current.data).toBe(true)
    expect(result.current.isLoading).toBe(true)
    await waitForNextUpdate()
    expect(result.current.data).toBe(true)
    expect(result.current.isSuccess).toBe(true)
    expect(result.current.isLoading).toBe(false)
  })

  test('should render correctly with key update', async () => {
    let key = 'test'
    const propsToPass = {
      ...initialProps,
      key,
      config: {
        reloadOnKeyChange: true,
      },
    }
    const { result, waitForNextUpdate, rerender } = renderHook(
      props => useDataLoader(key, props.method, props.config),
      {
        wrapper,
        initialProps: propsToPass,
      },
    )

    expect(result.current.data).toBe(undefined)
    expect(result.current.isLoading).toBe(true)
    await waitForNextUpdate()
    expect(result.current.data).toBe(true)
    expect(result.current.isSuccess).toBe(true)
    expect(result.current.isLoading).toBe(false)

    key = 'new-test'
    rerender()

    expect(result.current.data).toBe(undefined)
    expect(result.current.isLoading).toBe(true)
    key = 'new-new-test'
    rerender()
    expect(result.current.data).toBe(undefined)
    expect(result.current.isLoading).toBe(true)
    await waitForNextUpdate()
    expect(result.current.data).toBe(true)
    expect(result.current.isSuccess).toBe(true)
    expect(result.current.isLoading).toBe(false)
  })

  test('should render correctly with pooling', async () => {
    const pollingProps = {
      key: 'test',
      method: jest.fn(
        () =>
          new Promise(resolve => {
            setTimeout(() => resolve(true), 250)
          }),
      ),
      config: {
        pollingInterval: 500,
      },
    }

    const method2 = jest.fn(
      () =>
        new Promise(resolve => {
          setTimeout(() => resolve(2), 250)
        }),
    )

    const { result, waitForNextUpdate, rerender } = renderHook(
      props => useDataLoader(props.key, props.method, props.config),
      {
        wrapper,
        initialProps: pollingProps,
      },
    )
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
      method: method2,
      config: {
        pollingInterval: 800,
      },
    })
    act(() => {
      result.current.reload()
    })
    expect(result.current.data).toBe(true)
    expect(result.current.isPolling).toBe(true)
    expect(result.current.isLoading).toBe(true)
    expect(result.current.isSuccess).toBe(false)
    expect(method2).toBeCalledTimes(1)
    await waitForNextUpdate()
    expect(result.current.isPolling).toBe(true)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.isSuccess).toBe(true)
    expect(result.current.data).toBe(2)

    rerender({
      ...pollingProps,
      method: method2,
      config: {
        pollingInterval: 500,
      },
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
    const { result, waitForNextUpdate } = renderHook(
      props => useDataLoader(props.key, props.method, props.config),
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
    expect(result.current.data).toBe(undefined)
    expect(result.current.isIdle).toBe(true)

    act(() => {
      result.current.reload()
    })

    expect(result.current.data).toBe(undefined)
    expect(result.current.isLoading).toBe(true)

    await waitForNextUpdate()

    expect(result.current.data).toBe(true)
    expect(result.current.isSuccess).toBe(true)
  })

  test('should call onSuccess', async () => {
    const onSuccess = jest.fn()
    const { result, waitForNextUpdate } = renderHook(
      props => useDataLoader(props.key, props.method, props.config),
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
    const { result, waitForNextUpdate } = renderHook(
      props => useDataLoader(props.key, props.method, props.config),
      {
        wrapper,
        initialProps: {
          key: 'test',
          method: () =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                reject(error)
              }, 500)
            }),
          config: {
            onError,
            onSuccess,
          },
        },
      },
    )
    expect(result.current.data).toBe(undefined)
    expect(result.current.isLoading).toBe(true)
    await waitForNextUpdate()
    expect(result.current.data).toBe(undefined)
    expect(result.current.error).toBe(error)
    expect(result.current.isError).toBe(true)

    expect(onError).toBeCalledTimes(1)
    expect(onSuccess).toBeCalledTimes(0)
  })

  test('should clear error on new response', async () => {
    let success = false
    const onSuccess = jest.fn()
    const onError = jest.fn(() => {
      success = true
    })
    const error = new Error('Test error')
    const { result, waitForNextUpdate } = renderHook(
      props => useDataLoader(props.key, props.method, props.config),
      {
        wrapper,
        initialProps: {
          key: 'test',
          method: () =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                if (success) {
                  resolve(true)
                } else {
                  reject(error)
                }
              }, 500)
            }),
          config: {
            onError,
            onSuccess,
          },
        },
      },
    )
    expect(result.current.data).toBe(undefined)
    expect(result.current.isLoading).toBe(true)
    await waitForNextUpdate()
    expect(result.current.data).toBe(undefined)
    expect(result.current.error).toBe(error)
    expect(result.current.isError).toBe(true)

    expect(onError).toBeCalledTimes(1)
    expect(onSuccess).toBeCalledTimes(0)

    act(() => {
      result.current.reload()
    })

    await waitForNextUpdate()

    expect(result.current.data).toBe(true)
    expect(result.current.error).toBe(undefined)
    expect(result.current.isError).toBe(false)
    expect(result.current.isSuccess).toBe(true)
  })

  test('should use cached data', async () => {
    const { result, waitForNextUpdate } = renderHook(
      props => [
        useDataLoader(props.key, props.method, props.config),
        useDataLoader(props.key, props.method, {
          ...props.config,
          enabled: false,
        }),
      ],
      {
        wrapper,
        initialProps,
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
      result.current[1].reload()
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
          }, 500)
        }),
    )
    const { result, waitForNextUpdate } = renderHook(
      props => [
        useDataLoader(props.key, props.method, props.config),
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

    expect(result.current[0].data).toBe(undefined)
    expect(result.current[0].isLoading).toBe(true)
    expect(Object.values(result.current[1].getReloads()).length).toBe(1)
    await waitForNextUpdate()
    expect(result.current[0].data).toBe(true)
    expect(result.current[0].isSuccess).toBe(true)
    expect(mockedFn).toBeCalledTimes(1)

    act(() => {
      result.current[1].reloadAll()
    })

    expect(result.current[0].data).toBe(true)
    expect(Object.values(result.current[1].getReloads()).length).toBe(1)
    expect(result.current[0].isLoading).toBe(true)

    await waitForNextUpdate()
    expect(result.current[0].isSuccess).toBe(true)
    expect(mockedFn).toBeCalledTimes(2)
  })
})
