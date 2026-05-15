import type { ReactNode } from 'react'
import { vi } from 'vitest'

// Create mock functions
export const init: ReturnType<typeof vi.fn> = vi.fn()
export const getAttributes: ReturnType<typeof vi.fn> = vi.fn()
export const setAttributes: ReturnType<typeof vi.fn> = vi.fn()
export const loadFeatures: ReturnType<typeof vi.fn> = vi.fn()

// Create a mock class for GrowthBook
export class MockGrowthBook {
  init: typeof init = init

  getAttributes: typeof getAttributes = getAttributes

  setAttributes: typeof setAttributes = setAttributes

  loadFeatures: typeof loadFeatures = loadFeatures

  constructor() {
    // Reset mocks for each instance
    this.init.mockResolvedValue(undefined)
    this.getAttributes.mockReturnValue({})
    this.setAttributes.mockResolvedValue(undefined)
    this.loadFeatures.mockResolvedValue(undefined)
  }
}

// Export the constructor
export const GrowthBook = MockGrowthBook

// Export the provider component
export const GrowthBookProvider = ({ children }: { children: ReactNode }): ReactNode => children

// Export hook
export const useGrowthBook = vi.fn(() => new MockGrowthBook())
