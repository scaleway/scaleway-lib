import { describe, expect, it, jest } from '@jest/globals'
import { renderHook, waitFor } from '@testing-library/react'
import { useSegmentIntegrations } from '../..'

globalThis.fetch = jest.fn<any>(() => Promise.reject(new Error('randomError')))

describe('CookieConsent - useSegmentIntegrations', () => {
  it('should call segment and return empty array if any error occurs in the fetch', async () => {
    const { result } = renderHook(() =>
      useSegmentIntegrations({
        segment: {
          cdnURL: 'https://segment.test',
          writeKey: 'sampleWriteKey',
        },
      }),
    )

    await waitFor(() => {
      expect(result.current).toStrictEqual([])
    })

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalled()
    })
  })
})
