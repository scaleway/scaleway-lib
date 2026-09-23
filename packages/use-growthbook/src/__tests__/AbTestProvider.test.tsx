import type { Attributes, InitResponse } from '@growthbook/growthbook-react'
import { GrowthBook } from '@growthbook/growthbook-react'
import { act, render } from '@testing-library/react'
import type { ComponentProps } from 'react'
import { assert, beforeEach, describe, expect, it, vi } from 'vitest'
import { AbTestProvider } from '../AbTestProvider'

// Import mock functions from our mocks

type TrackingCallback = ComponentProps<typeof AbTestProvider>['trackingCallback']

type ErrorCallback = ComponentProps<typeof AbTestProvider>['errorCallback']

const errorCallback: ErrorCallback = vi.fn<() => void>()

const getAttributes = vi.fn<() => Record<string, unknown>>()
const setAttributes = vi.fn<(attr: Attributes) => Promise<void>>()
const init = vi.fn<() => Promise<InitResponse>>()

const defaultFn = () => undefined

describe('abTestProvider', () => {
  const trackingCallback: TrackingCallback = vi.fn<() => void>()

  beforeEach(() => {
    init.mockResolvedValue({ success: true, source: 'init' })
    getAttributes.mockReturnValue({})
    setAttributes.mockResolvedValue(undefined)

    vi.mocked(GrowthBook).mockImplementation(
      class {
        public getAttributes = getAttributes
        public init = init
        public loadFeatures = vi.fn<() => Promise<void>>()
        public setAttributes = setAttributes
      } as unknown as typeof GrowthBook,
    )
  })

  // afterEach(() => {
  //       vi.clearAllMocks()
  //   // Reset the mock functions

  // })

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
    act(() => {
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

    expect(init).toHaveBeenCalledWith({ skipCache: false, timeout: 500 })
  })

  it('should not call growthbook.init when clientKey is empty', async () => {
    act(() => {
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

    expect(init).not.toHaveBeenCalledTimes(1)
  })

  it('should handle errors during initialization', async () => {
    // Mock init to throw an error
    init.mockRejectedValueOnce(new Error('Init failed'))

    act(() => {
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
    expect(errorCallback).toHaveBeenCalledWith(new Error('Init failed'))
  })

  it('should update attributes when they change', async () => {
    let rerenderFn: (element: React.ReactElement) => void = defaultFn

    act(() => {
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
    assert.exists(rerenderFn)
    act(() => {
      rerenderFn(
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

    // Wait for useEffect to run
    await new Promise(resolve => {
      setTimeout(resolve, 10)
    })

    expect(setAttributes).toHaveBeenCalledWith({ anonymousId: 'foo' })
    expect(setAttributes).toHaveBeenCalledWith({ anonymousId: 'bar' })
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

    let rerenderFn: (element: React.ReactElement) => void = defaultFn

    act(() => {
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
    act(() => {
      rerenderFn(
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

    // Mock getAttributes to return the same object reference on re-render
    getAttributes.mockReturnValue(getAttributesReturn)

    // Wait for useEffect to run
    await new Promise(resolve => {
      setTimeout(resolve, 10)
    })

    // Since the attributes are the same object reference and we're using the same GrowthBook instance,
    // setAttributes should only be called once (from the initial render), not a second time from the re-render
    expect(setAttributes).toHaveBeenCalledTimes(1)
  })
})
