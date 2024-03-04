import type { GrowthBook as GBType } from '@growthbook/growthbook-react'
import { jest } from '@jest/globals'
import type { ReactNode } from 'react'

const GrowthBook = jest.fn(() => ({
  loadFeatures: jest.fn<GBType['loadFeatures']>(),
  getAttributes: jest.fn<GBType['getAttributes']>(),
  setAttributes: jest.fn<GBType['setAttributes']>(() => Promise.resolve()),
}))
const GrowthBookProvider = ({ children }: { children: ReactNode }) => children

const useGrowthBook = jest.fn()

export { GrowthBook, GrowthBookProvider, useGrowthBook }
