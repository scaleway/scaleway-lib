import type { Mock } from 'vitest'

declare module '@growthbook/growthbook-react' {
  export const init: Mock
  export const getAttributes: Mock
  export const setAttributes: Mock
  export const loadFeatures: Mock

  export class MockGrowthBook {
    public init: typeof init
    public getAttributes: typeof getAttributes
    public setAttributes: typeof setAttributes
    public loadFeatures: typeof loadFeatures
  }
}
