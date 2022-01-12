import { AnalyticsBrowser, Context } from '@segment/analytics-next'
import { renderHook } from '@testing-library/react-hooks'
import React, { ReactNode } from 'react'
import waitForExpect from 'wait-for-expect'
import SegmentProvider, { useSegment } from '..'
import type { Analytics, SegmentProviderProps } from '..'

const { log } = console

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
    onError = e => log(e),
    events = defaultEvents,
  }: Omit<SegmentProviderProps<DefaultEvents>, 'children'>) =>
  ({ children }: { children: ReactNode }) =>
    (
      <SegmentProvider
        settings={settings}
        initOptions={initOptions}
        onError={onError}
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
    const { result } = renderHook(() => useSegment(), {
      wrapper: ({ children }) => <div>{children}</div>,
    })
    expect(() => {
      expect(result.current).toBe(undefined)
    }).toThrow(Error('useSegment must be used within a SegmentProvider'))
  })

  it('useSegment should not load without settings', () => {
    const onError = jest.fn()
    const { result } = renderHook(() => useSegment<DefaultEvents>(), {
      wrapper: wrapper({
        events: defaultEvents,
        onError,
        settings: undefined,
      }),
    })
    expect(result.current.analytics).not.toBeNull()
  })

  it('useSegment should correctly infer types', async () => {
    const onError = jest.fn()
    const { result } = renderHook(() => useSegment<DefaultEvents>(), {
      wrapper: wrapper({
        events: defaultEvents,
        onError,
        settings: undefined,
      }),
    })

    // @ts-expect-error if type infering works this should be an error
    expect(await result.current.events.pageVisited()).toBe(undefined)
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

  it('Provider should load and call onError on analytics load error', async () => {
    const mock = jest
      .spyOn(AnalyticsBrowser, 'load')
      .mockRejectedValue(new Error('not good'))

    const onError = jest.fn()
    const settings= { writeKey: 'pleasethrow' }

    renderHook(() => useSegment<DefaultEvents>(), {
      wrapper: wrapper({
        events: defaultEvents,
        onError,
        settings
      }),
    })

    expect(mock).toHaveBeenCalledTimes(1)
    expect(mock).toHaveBeenCalledWith(
      settings,
      undefined,
    )

    await waitForExpect(() => {
      expect(onError).toHaveBeenCalledTimes(1)
      expect(onError).toHaveBeenCalledWith(new Error('not good'))
    })
  })
})
