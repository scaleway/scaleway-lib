import { jest } from '@jest/globals'
import type { ReactNode } from 'react'

const GrowthBook = jest.fn(() => ({
  loadFeatures: jest.fn(),
}))

const GrowthBookProvider = ({ children }: { children: ReactNode }) => children

export { GrowthBook, GrowthBookProvider }
