import type { ReactNode } from 'react'
import { vi } from 'vitest'

export const init = vi.fn<() => Promise<void>>()
export const getAttributes = vi.fn<() => Record<string, unknown>>()
export const setAttributes = vi.fn<() => Promise<void>>()
export const loadFeatures = vi.fn<() => Promise<void>>()

export class MockGrowthBook {
  init = init
  getAttributes = getAttributes
  setAttributes = setAttributes
  loadFeatures = loadFeatures

  constructor() {
    this.init.mockResolvedValue(undefined)
    this.getAttributes.mockReturnValue({})
    this.setAttributes.mockResolvedValue(undefined)
    this.loadFeatures.mockResolvedValue(undefined)
  }
}

export const mockUseGrowthBook = vi.fn<() => MockGrowthBook>(() => new MockGrowthBook())

export const GrowthBook = MockGrowthBook

export const GrowthBookProvider = ({ children }: { children: ReactNode }): ReactNode => children

export const useGrowthBook = mockUseGrowthBook
