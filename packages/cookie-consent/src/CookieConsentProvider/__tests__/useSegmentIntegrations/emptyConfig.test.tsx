import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useSegmentIntegrations } from '../../useSegmentIntegrations'

describe('CookieConsent - useSegmentIntegrations', () => {
  it('should not call segment if config is empty and return empty array', async () => {
    const { result } = renderHook(() =>
      useSegmentIntegrations({ segment: null }),
    )

    await waitFor(() => {
      expect(result.current.integrations).toStrictEqual([])
    })
    expect(result.current.isLoaded).toBe(true)
  })
})
