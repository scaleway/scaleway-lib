import { jest } from '@jest/globals'
import type { ReactNode } from 'react'

const GrowthBook = jest.fn(() => ({
  loadFeatures: jest.fn(),
  getAttributes: jest.fn(),
  setAttributes: jest.fn(),
}))
const GrowthBookProvider = ({ children }: { children: ReactNode }) => children

const useGrowthBook = jest.fn()

export { GrowthBook, GrowthBookProvider, useGrowthBook }
