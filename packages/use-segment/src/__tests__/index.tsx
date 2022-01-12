import { AnalyticsBrowser, Context } from '@segment/analytics-next'
import { renderHook } from '@testing-library/react-hooks'
import React, { ReactNode } from 'react'
import waitForExpect from 'wait-for-expect'
import SegmentProvider, { useSegment } from '..'
import type { Analytics, SegmentProviderProps } from '..'

const defaultEvents = {
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
    events = defaultEvents,
    cdn,
  }: Omit<SegmentProviderProps<DefaultEvents>, 'children'>) =>
  ({ children }: { children: ReactNode }) =>
    (
      <SegmentProvider
        settings={settings}
        initOptions={initOptions}
        onError={onError}
        events={events}
        cdn={cdn}
      >
        {children}
      </SegmentProvider>
    )

describe('segment hook', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
  })

  it('useSegment should not be defined without SegmentProvider', () => {
    const { result } = renderHook(() => useSegment(), {
      wrapper: ({ children }) => <div>{children}</div>,
    })
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

    const cdn = 'https://cdn.proxy'
    const settings = { writeKey: 'helloworld' }

    const { result, waitForNextUpdate } = renderHook(
      () => useSegment<DefaultEvents>(),
      {
        wrapper: wrapper({
          cdn,
          events: defaultEvents,
          settings,
        }),
      },
    )

    await waitForNextUpdate()
    expect(mock).toHaveBeenCalledTimes(1)
    expect(mock).toHaveBeenCalledWith(settings, undefined)
    expect(result.current.analytics).toStrictEqual({})
    expect(window.analytics).toStrictEqual({ _cdn: cdn })
  })

  it('Provider should load and call onError on analytics load error', async () => {
    const mock = jest
      .spyOn(AnalyticsBrowser, 'load')
      .mockRejectedValue(new Error('not good'))

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
      expect(onError).toHaveBeenCalledWith(new Error('not good'))
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

  it('useSegment should correctly set cdn into  windows.analitycs', async () => {
    // this test should be remove in the same time as this issues is solve
    // https://github.com/segmentio/analytics-next/issues/362

    const cdn = 'https://cdn.segment.com/analytics.js'

    const { result } = renderHook(() => useSegment<DefaultEvents>(), {
      wrapper: wrapper({
        cdn,
        events: defaultEvents,
        settings: undefined,
      }),
    })

    expect(result.current.analytics).not.toBeNull()
  })
})
