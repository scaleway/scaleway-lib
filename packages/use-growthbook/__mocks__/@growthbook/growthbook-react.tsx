import type { GrowthBook as GBType } from '@growthbook/growthbook-react'
import type { ReactNode } from 'react'
import { vi } from 'vitest'

export const getAttributes = vi.fn<[], ReturnType<GBType['getAttributes']>>()
export const setAttributes = vi.fn<[], ReturnType<GBType['setAttributes']>>(
  () => Promise.resolve(),
)

export const GrowthBook = vi.fn(() => ({
  loadFeatures: vi.fn<[], ReturnType<GBType['loadFeatures']>>(),
  getAttributes,
  setAttributes,
}))
export const GrowthBookProvider = ({ children }: { children: ReactNode }) =>
  children

export const useGrowthBook = vi.fn()

console.debug('GrowthBook Mock', GrowthBookProvider)
// export { GrowthBook, GrowthBookProvider, useGrowthBook }
