import type { AudienceIdType, CookieConfigType, EncodedJWT, StorageType } from '../../types'
import { audienceIdSchema, jwtSchema } from '../../zodSchemas'
import { COOKIE_AGE, DOMAIN, getUniqueHostnameString } from './constants'
import { createCookieBackend } from './cookieBackend'
import { createLocalStorageBackend } from './localStorageBackend'
import type { StorageBackend } from './types'

export { setCookieConfig, setCookieAge } from './cookieBackend'
export { COOKIE_AGE, DOMAIN, getUniqueHostnameString } from './constants'
export type { StorageBackend } from './types'

const KEY_SESSION = '_scw_session'
const KEY_AUDIENCE_ID = '_scw_audience_id'
const DEFAULT_SUFFIX_KEY = ''

export type CreateAuthStoreManagerOptions = {
  storageType?: StorageType
  cookieConfig?: CookieConfigType
  cookieAge?: number
}

export type AuthStoreManagerInstance = ReturnType<typeof createAuthStoreManager>

const buildBackends = (options: CreateAuthStoreManagerOptions): Record<StorageType, StorageBackend> => ({
  cookie: createCookieBackend({
    cookieConfig: options.cookieConfig,
    cookieAge: options.cookieAge,
  }),
  localStorage: createLocalStorageBackend(),
})

const normalizeOptions = (param?: StorageType | CreateAuthStoreManagerOptions): CreateAuthStoreManagerOptions =>
  typeof param === 'string' ? { storageType: param } : (param ?? {})

/**
 * Factory that creates an isolated AuthStoreManager instance with its own
 * `storageType`, `suffixKey`, and cookie config (`cookieConfig`/`cookieAge`).
 *
 * Each instance owns its own backends, so multiple providers can coexist
 * without clobbering each other's config — unlike the module-level
 * `setCookieConfig`/`setCookieAge` setters which mutate shared singleton state.
 *
 * Accepts either an options object `{ storageType, cookieConfig, cookieAge }`
 * or, for backward compatibility, a bare `StorageType` string.
 *
 * For backward compatibility, a default singleton `AuthStoreManager` is also
 * exported below.
 */
export const createAuthStoreManager = (param?: StorageType | CreateAuthStoreManagerOptions) => {
  const options = normalizeOptions(param)
  let storageType = options.storageType ?? 'cookie'
  let suffixKey = DEFAULT_SUFFIX_KEY

  const backends = buildBackends(options)
  const getBackend = () => backends[storageType]

  const instance = {
    COOKIE_AGE,
    DOMAIN,

    deleteAllJwts() {
      const prefix = instance.getKeySession('')
      getBackend().deleteAllWithPrefix(prefix)
    },
    deleteAudienceId() {
      getBackend().delete(instance.getKeyAudienceId())
    },

    deleteJwt(audienceId: string) {
      getBackend().delete(instance.getKeySession(audienceId))
    },

    getAudienceId(): string | null {
      const parsed = getBackend().get(instance.getKeyAudienceId())
      const resultParsed = audienceIdSchema.safeParse(parsed)
      if (resultParsed.success) {
        return resultParsed.data.audienceId
      }

      return null
    },
    getJwt(audienceId: string): EncodedJWT | null {
      const parsed = getBackend().get(instance.getKeySession(audienceId))
      const resultParsed = jwtSchema.safeParse(parsed)

      if (resultParsed.success) {
        return resultParsed.data
      }

      if (resultParsed.error) {
        // TODO: we can handle this error with a logout ?
      }

      return null
    },

    getKeyAudienceId() {
      return `${KEY_AUDIENCE_ID}${suffixKey}`
    },

    getKeySession(audienceId: string) {
      return `${KEY_SESSION}${suffixKey}_${audienceId}`
    },

    getStorageType() {
      return storageType
    },

    getUniqueHostnameString,

    setAudienceId(audienceId: string) {
      getBackend().set(instance.getKeyAudienceId(), { audienceId })
    },

    setJwt({ jwtInfo, setAudienceId = true }: { jwtInfo: EncodedJWT; setAudienceId?: boolean }) {
      const audienceId = jwtInfo.jwt?.audienceId as string
      getBackend().set(instance.getKeySession(audienceId), jwtInfo)
      if (setAudienceId) {
        instance.setAudienceId(audienceId)
      }
    },

    setStorageType(nextStorageType: StorageType) {
      storageType = nextStorageType
    },

    setSuffixKey(key: string) {
      suffixKey = key ? `_${key}` : DEFAULT_SUFFIX_KEY
    },

    get SUFFIX_KEY() {
      return suffixKey
    },

    typeGuardAudienceId(untypedObject: unknown): untypedObject is AudienceIdType {
      return audienceIdSchema.safeParse(untypedObject).success
    },

    typeGuardJWT(untypedObject: unknown): untypedObject is EncodedJWT {
      return jwtSchema.safeParse(untypedObject).success
    },
  }

  return instance
}

// --- Backward-compatible singleton ---

export const AuthStoreManager = createAuthStoreManager()

export const setStorageType = (storageType: StorageType) => {
  AuthStoreManager.setStorageType(storageType)
}

export const getStorageType = () => AuthStoreManager.getStorageType()

/**
 * Migrates any existing JWT and audienceId stored in cookies to localStorage,
 * then removes the cookie entries. Safe to call repeatedly — it is a no-op when
 * nothing is stored in cookies.
 *
 * Pass a `storeManager` created via {@link createAuthStoreManager} to migrate
 * that instance's data; otherwise the default singleton is used.
 */
export const migrateCookieToLocalStorage = (
  storeManager: AuthStoreManagerInstance = AuthStoreManager,
): { migrated: boolean; audienceId?: string } => {
  const previousStorageType = storeManager.getStorageType()
  // Force cookie backend to read existing data
  storeManager.setStorageType('cookie')

  try {
    const audienceId = storeManager.getAudienceId()
    if (!audienceId) {
      return { migrated: false }
    }

    const jwt = storeManager.getJwt(audienceId)
    if (!jwt) {
      // audienceId present but no jwt, still migrate audienceId
      storeManager.setStorageType('localStorage')
      storeManager.setAudienceId(audienceId)
      storeManager.setStorageType('cookie')
      storeManager.deleteAudienceId()
      return { migrated: true, audienceId }
    }

    // Write to localStorage
    storeManager.setStorageType('localStorage')
    storeManager.setJwt({ jwtInfo: jwt, setAudienceId: true })

    // Clean up cookies
    storeManager.setStorageType('cookie')
    storeManager.deleteJwt(audienceId)
    storeManager.deleteAudienceId()

    // Restore localStorage as the active backend
    storeManager.setStorageType('localStorage')

    return { migrated: true, audienceId }
  } finally {
    storeManager.setStorageType(previousStorageType)
  }
}
