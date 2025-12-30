import type { ReactNode } from 'react'
import { vi } from 'vitest'

// Create mock functions
export const init = vi.fn()
export const getAttributes = vi.fn()
export const setAttributes = vi.fn()
export const loadFeatures = vi.fn()

// Create a mock class for GrowthBook
export class MockGrowthBook {
  init = init
  getAttributes = getAttributes
  setAttributes = setAttributes
  loadFeatures = loadFeatures

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
export const GrowthBookProvider = async ({
  children,
}: {
  children: ReactNode
}) => children

// Export hook
export const useGrowthBook = vi.fn(() => new MockGrowthBook())
