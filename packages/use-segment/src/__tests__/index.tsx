import { renderHook } from '@testing-library/react-hooks'
import React, { ReactNode } from 'react'
import SegmentProvider, { useSegment } from '..'
import type { Analytics, SegmentProviderProps } from '..'

const { log } = console

const defaultEvents = {
  pageVisited: (analytics?: Analytics) => async (
    pageType: 'Docs' | 'Blog' | 'Main',
    organizationId: string,
    productCategory?: 'Dedibox' | 'Elements' | 'Datacenter'
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
  }
}

type DefaultEvents = typeof defaultEvents

const wrapper =
  ({
    writeKey,
    onError = e => log(e),
    events = defaultEvents,
  }: Omit<SegmentProviderProps<DefaultEvents>, 'children'>) =>
  ({ children }: { children: ReactNode }) =>
    (
      <SegmentProvider writeKey={writeKey} onError={onError} events={events}>
        {children}
      </SegmentProvider>
    )

describe('segment hook', () => {
  it('useSegment should not be defined without SegmentProvider', () => {
    const { result } = renderHook(() => useSegment(), {
      wrapper: ({ children }) => <div>{children}</div>,
    })
    expect(() => {
      expect(result.current).toBe(undefined)
    }).toThrow(Error('useSegment must be used within a SegmentProvider'))
  })

  it('useSegment should not load without key', () => {
    const { result } = renderHook(() => useSegment<DefaultEvents>(), {
      wrapper: wrapper({
        events: defaultEvents,
        onError: e => log(e),
        writeKey: undefined,
      }),
    })
    expect(result.current.analytics).not.toBeNull()
  })

  it('useSegment should correctly infer types', async () => {
    const { result } = renderHook(() => useSegment<DefaultEvents>(), {
      wrapper: wrapper({
        events: defaultEvents,
        onError: e => log(e),
        writeKey: undefined,
      }),
    })

    // @ts-expect-error if type infering works this should be an error
    expect(await result.current.events.pageVisited()).toBe(undefined)
  })
})
