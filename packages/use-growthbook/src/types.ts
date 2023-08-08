export type Attributes = Record<string, string | number | undefined>

/**
 * @param {boolean} [autoRefresh] - false.
 * @param {number} [timeout] - 500.
 */
export type LoadConfig = {
  autoRefresh: boolean
  timeout: number
}

export type GrowthBookType = {
  new (...args: unknown[]): GrowthBookType
  getAttributes: () => Attributes
  loadFeatures: ({ autoRefresh, timeout }: LoadConfig) => Promise<void>
  setAttributes: (attributes: Attributes) => void
}
