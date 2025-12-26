import type { ReactNode } from 'react'
import { vi } from 'vitest'

export const getAttributes = vi.fn()
export const setAttributes = vi.fn(() => Promise.resolve())
export const loadFeatures = vi.fn()

// eslint-disable-next-line prefer-arrow-callback
export const GrowthBook = vi.fn(function mock() {
  return {
    loadFeatures,
    getAttributes,
    setAttributes,
  }
})

export const GrowthBookProvider = ({ children }: { children: ReactNode }) =>
  children

export const useGrowthBook = vi.fn()

console.debug('GrowthBook Mock', GrowthBookProvider)
