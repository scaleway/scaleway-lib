/**
 * A storage-agnostic backend used by {@link AuthStoreManager} to persist the
 * JWT and audienceId.
 *
 * Both backends (cookie, localStorage) round-trip values through
 * `JSON.stringify`/`JSON.parse`, so `Date` fields arrive as strings.
 * Tests comparing retrieved JWTs must use `JSON.parse(JSON.stringify(...))`
 * rather than `structuredClone(...)` to match this behaviour.
 */
export type StorageBackend = {
  delete: (key: string) => void
  deleteAllWithPrefix: (prefix: string) => void
  get: (key: string) => object | null
  set: (key: string, value: object, maxAge?: number) => void
}
