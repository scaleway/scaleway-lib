import { AnalyticsBrowser, Context } from '@segment/analytics-next'
import { renderHook } from '@testing-library/react-hooks'
import { ReactNode } from 'react'
import waitForExpect from 'wait-for-expect'
import SegmentProvider, { useSegment } from '..'
import type { Analytics, OnEventError, SegmentProviderProps } from '..'

const eventError = new Error('Error Event')

const defaultEvents = {
  errorEvent: (_?: Analytics, onEventError?: OnEventError) => async () => {
    try {
      await new Promise((resolve, reject) => {
        reject(eventError)
      })
    } catch (error) {
      await onEventError?.(error as Error)
    }
  },
  pageVisited:
    (analytics?: Analytics) =>
    async (
      pageType: 'Docs' | 'Blog' | 'Main',
      organizationId: string,
      productCategory?: 'Dedibox' | 'Elements' | 'Datacenter',
    ): Promise<void> => {
      await analytics?.page(
        {
          page_type: pageType,
          product_category: productCategory,
        },
        {
          context: {
            groupId: organizationId,
          },
        },
      )
    },
}

type DefaultEvents = typeof defaultEvents

const wrapper =
  ({
    settings,
    initOptions,
    onError,
    onEventError,
    events = defaultEvents,
  }: Omit<SegmentProviderProps<DefaultEvents>, 'children'>) =>
  ({ children }: { children: ReactNode }) =>
    (
      <SegmentProvider
        settings={settings}
        initOptions={initOptions}
        onError={onError}
        onEventError={onEventError}
        events={events}
      >
        {children}
      </SegmentProvider>
    )

describe('segment hook', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
  })

  it('useSegment should not be defined without SegmentProvider', () => {
    const { result } = renderHook(() => useSegment())
    expect(() => {
      expect(result.current).toBe(undefined)
    }).toThrow(Error('useSegment must be used within a SegmentProvider'))
  })

  it('useSegment should not load without settings', () => {
    const { result } = renderHook(() => useSegment<DefaultEvents>(), {
      wrapper: wrapper({
        events: defaultEvents,
        settings: undefined,
      }),
    })
    expect(result.current.analytics).not.toBeNull()
  })

  it('Provider should load with key', async () => {
    const mock = jest
      .spyOn(AnalyticsBrowser, 'load')
      .mockResolvedValue([{} as Analytics, {} as Context])

    const settings = { writeKey: 'helloworld' }

    const { result, waitForNextUpdate } = renderHook(
      () => useSegment<DefaultEvents>(),
      {
        wrapper: wrapper({
          events: defaultEvents,
          settings,
        }),
      },
    )

    await waitForNextUpdate()
    expect(mock).toHaveBeenCalledTimes(1)
    expect(mock).toHaveBeenCalledWith(settings, undefined)
    expect(result.current.analytics).toStrictEqual({})
  })

  it('Provider should load with key and cdn', async () => {
    const mock = jest
      .spyOn(AnalyticsBrowser, 'load')
      .mockResolvedValue([{} as Analytics, {} as Context])

    const settings = { cdn: 'https://cdn.proxy', writeKey: 'helloworld' }

    const { result, waitForNextUpdate } = renderHook(
      () => useSegment<DefaultEvents>(),
      {
        wrapper: wrapper({
          events: defaultEvents,
          settings,
        }),
      },
    )

    await waitForNextUpdate()
    expect(mock).toHaveBeenCalledTimes(1)
    expect(mock).toHaveBeenCalledWith(settings, undefined)
    expect(result.current.analytics).toStrictEqual({})
  })

  it('Provider should load and call onError on analytics load error', async () => {
    const error = new Error('not good')
    const mock = jest.spyOn(AnalyticsBrowser, 'load').mockRejectedValue(error)

    const onError = jest.fn()
    const settings = { writeKey: 'pleasethrow' }

    renderHook(() => useSegment<DefaultEvents>(), {
      wrapper: wrapper({
        events: defaultEvents,
        onError,
        settings,
      }),
    })

    expect(mock).toHaveBeenCalledTimes(1)
    expect(mock).toHaveBeenCalledWith(settings, undefined)

    await waitForExpect(() => {
      expect(onError).toHaveBeenCalledTimes(1)
      expect(onError).toHaveBeenCalledWith(error)
    })
  })

  it('Provider call onEventError when an event is trigger with an error', async () => {
    const mock = jest
      .spyOn(AnalyticsBrowser, 'load')
      .mockResolvedValue([{} as Analytics, {} as Context])

    const onEventError = jest.fn()
    const onError = jest.fn()

    const settings = { writeKey: 'pleasethrow' }

    const { result, waitForNextUpdate } = renderHook(
      () => useSegment<DefaultEvents>(),
      {
        wrapper: wrapper({
          events: defaultEvents,
          onError,
          onEventError,
          settings,
        }),
      },
    )

    expect(mock).toHaveBeenCalledTimes(1)

    await waitForNextUpdate()

    await result.current.events.errorEvent()

    await waitForExpect(() => {
      expect(onEventError).toHaveBeenCalledTimes(1)
      expect(onEventError).toHaveBeenCalledWith(eventError)
    })
  })

  it('Provider should load with settings and initOptions', async () => {
    const mock = jest
      .spyOn(AnalyticsBrowser, 'load')
      .mockResolvedValue([{} as Analytics, {} as Context])

    const settings = { writeKey: 'helloworld' }
    const initOptions = {
      initialPageview: false,
    }

    const { result, waitForNextUpdate } = renderHook(
      () => useSegment<DefaultEvents>(),
      {
        wrapper: wrapper({
          events: defaultEvents,
          initOptions,
          settings,
        }),
      },
    )

    await waitForNextUpdate()
    expect(mock).toHaveBeenCalledTimes(1)
    expect(mock).toHaveBeenCalledWith(settings, initOptions)
    expect(result.current.analytics).toStrictEqual({})
  })

  it('useSegment should correctly infer types', async () => {
    const { result } = renderHook(() => useSegment<DefaultEvents>(), {
      wrapper: wrapper({
        events: defaultEvents,
        settings: undefined,
      }),
    })

    // @ts-expect-error if type infering works this should be an error
    expect(await result.current.events.pageVisited()).toBe(undefined)
  })
})
