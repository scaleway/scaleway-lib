import { renderHook } from '@testing-library/react-hooks'
import React, { ReactNode } from 'react'
import SegmentProvider, { useSegment } from '..'
import type { SegmentProviderProps } from '..'
import * as defaultEvents from './events'

const { log } = console

const wrapper =
  ({
    writeKey,
    onError = e => log(e),
    events = defaultEvents,
  }: SegmentProviderProps<typeof defaultEvents>) =>
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
    const { result } = renderHook(() => useSegment(), {
      wrapper: wrapper({
        events: defaultEvents,
        onError: e => log(e),
        writeKey: undefined,
      }),
    })
    console.log(result.current)
    expect(result.current.analytics).toBe(undefined)
  })
})
