import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useSegmentIntegrations } from '../../useSegmentIntegrations'

globalThis.fetch = vi.fn(() => Promise.reject(new Error('randomError')))

describe('cookieConsent - useSegmentIntegrations', () => {
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
      expect(result.current.integrations).toStrictEqual([])
    })

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalled()
    })
    expect(result.current.isLoaded).toBeTruthy()
  })
})
