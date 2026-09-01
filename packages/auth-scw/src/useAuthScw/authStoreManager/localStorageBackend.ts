import type { StorageBackend } from './types'

/**
 * localStorage-based storage backend.
 *
 * Reads/writes are wrapped in try/catch because `localStorage` can throw in
 * restricted environments (e.g. sandboxed iframes, private mode in some
 * browsers, or when the quota is exceeded).
 */
export const localStorageBackend: StorageBackend = {
  delete(key) {
    try {
      globalThis.localStorage.removeItem(key)
    } catch {
      // ignore
    }
  },
  deleteAllWithPrefix(prefix) {
    try {
      const keysToRemove: string[] = []
      for (let i = 0; i < globalThis.localStorage.length; i++) {
        const key = globalThis.localStorage.key(i)
        if (key && key.startsWith(prefix)) {
          keysToRemove.push(key)
        }
      }
      keysToRemove.forEach(key => globalThis.localStorage.removeItem(key))
    } catch {
      // ignore
    }
  },
  get(key) {
    try {
      const raw = globalThis.localStorage.getItem(key)
      if (!raw) return null
      return JSON.parse(raw) as object
    } catch {
      return null
    }
  },
  set(key, value) {
    try {
      globalThis.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // ignore quota / restricted environments
    }
  },
}
