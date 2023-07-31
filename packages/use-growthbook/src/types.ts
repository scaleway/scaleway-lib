export type GrowthBookType = {
  getAttributes: () => Record<string, unknown>
  loadFeatures: ({
    autoRefresh,
    timeout,
  }: {
    autoRefresh: boolean
    timeout: number
  }) => Promise<null>
  setAttributes: (attributes: Record<string, unknown>) => null
}
