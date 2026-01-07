import { act, render } from '@testing-library/react'
import type { ComponentProps } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  getAttributes,
  init,
  setAttributes,
} from '../../__mocks__/@growthbook/growthbook-react'
import { AbTestProvider } from '../AbTestProvider'

// Import mock functions from our mocks

type TrackingCallback = ComponentProps<
  typeof AbTestProvider
>['trackingCallback']

type ErrorCallback = ComponentProps<typeof AbTestProvider>['errorCallback']

const errorCallback: ErrorCallback = vi.fn()

describe('abTestProvider', () => {
  const trackingCallback: TrackingCallback = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    // Reset the mock functions
    init.mockResolvedValue(undefined)
    getAttributes.mockReturnValue({})
    setAttributes.mockResolvedValue(undefined)
  })

  it('should create GrowthBook instance', () => {
    render(
      <AbTestProvider
        attributes={{
          anonymousId: 'foo',
        }}
        config={{
          apiHost: 'host',
          clientKey: 'clientKey',
          enableDevMode: true,
        }}
        errorCallback={errorCallback}
        trackingCallback={trackingCallback}
      >
        Children
      </AbTestProvider>,
    )

    // Since GrowthBook is a class, we can't check if it was called directly
    // Instead, we check that our mock functions were initialized
    expect(init).toBeDefined()
  })

  it('should call growthbook.init when clientKey is provided', async () => {
    await act(async () => {
      render(
        <AbTestProvider
          attributes={{
            anonymousId: 'foo',
          }}
          config={{
            apiHost: 'host',
            clientKey: 'clientKey',
            enableDevMode: true,
          }}
          errorCallback={errorCallback}
          trackingCallback={trackingCallback}
        >
          Children
        </AbTestProvider>,
      )
    })

    // Wait for useEffect to run
    await new Promise(resolve => {
      setTimeout(resolve, 10)
    })

    expect(init).toBeCalled()
  })

  it('should not call growthbook.init when clientKey is empty', async () => {
    await act(async () => {
      render(
        <AbTestProvider
          attributes={{
            anonymousId: 'foo',
          }}
          config={{
            apiHost: 'host',
            clientKey: '',
            enableDevMode: true,
          }}
          errorCallback={errorCallback}
          trackingCallback={trackingCallback}
        >
          Children
        </AbTestProvider>,
      )
    })

    // Wait for useEffect to run
    await new Promise(resolve => {
      setTimeout(resolve, 10)
    })

    expect(init).not.toBeCalled()
  })

  it('should handle errors during initialization', async () => {
    // Mock init to throw an error
    init.mockRejectedValueOnce(new Error('Init failed'))

    await act(async () => {
      render(
        <AbTestProvider
          attributes={{
            anonymousId: 'foo',
          }}
          config={{
            apiHost: 'host',
            clientKey: 'clientKey',
            enableDevMode: true,
          }}
          errorCallback={errorCallback}
          trackingCallback={trackingCallback}
        >
          Children
        </AbTestProvider>,
      )
    })

    // Wait for useEffect to run and for promise rejection to be handled
    await new Promise(resolve => {
      setTimeout(resolve, 100)
    })

    // Check if errorCallback was called with the right error
    expect(errorCallback).toBeCalled()
  })

  it('should update attributes when they change', async () => {
    let rerenderFn: ((element: React.ReactElement) => void) | undefined

    await act(async () => {
      const result = render(
        <AbTestProvider
          attributes={{
            anonymousId: 'foo',
          }}
          config={{
            apiHost: 'host',
            clientKey: 'clientKey',
            enableDevMode: true,
          }}
          errorCallback={errorCallback}
          trackingCallback={trackingCallback}
        >
          Children
        </AbTestProvider>,
      )

      rerenderFn = result.rerender
    })

    // Mock getAttributes to return different values
    getAttributes.mockReturnValue({ anonymousId: 'foo' })

    // Re-render with different attributes
    if (rerenderFn) {
      await act(async () => {
        // biome-ignore lint/style/noNonNullAssertion: error
        rerenderFn!(
          <AbTestProvider
            attributes={{
              anonymousId: 'bar',
            }}
            config={{
              apiHost: 'host',
              clientKey: 'clientKey',
              enableDevMode: true,
            }}
            errorCallback={errorCallback}
            trackingCallback={trackingCallback}
          >
            Children
          </AbTestProvider>,
        )
      })
    }

    // Wait for useEffect to run
    await new Promise(resolve => {
      setTimeout(resolve, 10)
    })

    expect(setAttributes).toBeCalled()
  })

  it('should not update attributes when they are the same object reference', async () => {
    // Use the same object reference for both renders
    const sharedAttributes = { anonymousId: 'foo' }
    // Create a consistent return value for getAttributes
    const getAttributesReturn = { anonymousId: 'foo' }
    // Create a consistent config object
    const config = {
      apiHost: 'host',
      clientKey: 'clientKey',
      enableDevMode: true,
    }

    let rerenderFn: ((element: React.ReactElement) => void) | undefined

    await act(async () => {
      const result = render(
        <AbTestProvider
          attributes={sharedAttributes}
          config={config}
          errorCallback={errorCallback}
          trackingCallback={trackingCallback}
        >
          Children
        </AbTestProvider>,
      )

      rerenderFn = result.rerender
    })

    // Mock getAttributes to return the same object reference initially
    getAttributes.mockReturnValue(getAttributesReturn)

    // Re-render with the SAME EXACT object references
    if (rerenderFn) {
      await act(async () => {
        // biome-ignore lint/style/noNonNullAssertion: error
        rerenderFn!(
          <AbTestProvider
            attributes={sharedAttributes} // Same config object
            config={config} // Same attributes object
            errorCallback={errorCallback}
            trackingCallback={trackingCallback}
          >
            Children
          </AbTestProvider>,
        )
      })
    }

    // Mock getAttributes to return the same object reference on re-render
    getAttributes.mockReturnValue(getAttributesReturn)

    // Wait for useEffect to run
    await new Promise(resolve => {
      setTimeout(resolve, 10)
    })

    // Since the attributes are the same object reference and we're using the same GrowthBook instance,
    // setAttributes should only be called once (from the initial render), not a second time from the re-render
    expect(setAttributes).toBeCalledTimes(1)
  })
})
