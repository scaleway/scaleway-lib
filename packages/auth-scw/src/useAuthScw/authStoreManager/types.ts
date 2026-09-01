/**
 * A storage-agnostic backend used by {@link AuthStoreManager} to persist the
 * JWT and audienceId.
 */
export type StorageBackend = {
  delete: (key: string) => void
  deleteAllWithPrefix: (prefix: string) => void
  get: (key: string) => object | null
  set: (key: string, value: object, maxAge?: number) => void
}
