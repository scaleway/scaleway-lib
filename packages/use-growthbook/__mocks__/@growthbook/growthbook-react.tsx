import type { ReactNode } from 'react'
import { vi } from 'vitest'

export const getAttributes = vi.fn()
export const setAttributes = vi.fn(async () => Promise.resolve())
export const loadFeatures = vi.fn()

export const GrowthBook = vi.fn(function mockGrowthBook() {
  return {
    loadFeatures,
    getAttributes,
    setAttributes,
  }
})

export const GrowthBookProvider = async ({
  children,
}: {
  children: ReactNode
}) => children

export const useGrowthBook = vi.fn()
