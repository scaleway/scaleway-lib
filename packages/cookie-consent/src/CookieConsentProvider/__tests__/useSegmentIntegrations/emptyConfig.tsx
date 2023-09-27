import { describe, expect, it } from '@jest/globals'
import { renderHook, waitFor } from '@testing-library/react'
import { useSegmentIntegrations } from '../..'

describe('CookieConsent - useSegmentIntegrations', () => {
  it('should not call segment if config is empty and return empty array', async () => {
    const { result } = renderHook(() =>
      useSegmentIntegrations({ segment: null }),
    )

    await waitFor(() => {
      expect(result.current).toStrictEqual([])
    })
  })
})
