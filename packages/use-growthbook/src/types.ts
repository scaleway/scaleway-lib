export type Attributes = Record<string, string | number | undefined>

/**
 * @param {boolean} [autoRefresh] - false.
 * @param {number} [timeout] - 500.
 */
export type LoadConfig = {
  autoRefresh: boolean
  timeout: number
}
