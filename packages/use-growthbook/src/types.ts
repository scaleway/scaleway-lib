export type Attributes = Record<string, unknown>

export type GrowthBookType = {
  new (...args: unknown[]): GrowthBookType
  getAttributes: () => Attributes
  loadFeatures: ({
    autoRefresh,
    timeout,
  }: {
    autoRefresh: boolean
    timeout: number
  }) => Promise<null>
  setAttributes: (attributes: Attributes) => null
}
