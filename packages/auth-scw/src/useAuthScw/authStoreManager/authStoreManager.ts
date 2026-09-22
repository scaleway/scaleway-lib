import type { AudienceIdType, EncodedJWT, StorageType } from '../../types'
import { audienceIdSchema, jwtSchema } from '../../zodSchemas'
import { COOKIE_AGE, DOMAIN, getUniqueHostnameString } from './constants'
import { createCookieBackend } from './cookieBackend'
import { createLocalStorageBackend } from './localStorageBackend'
import type { CreateAuthStoreManagerOptions, StorageBackend } from './types'

export { COOKIE_AGE, DOMAIN, getUniqueHostnameString, DEFAULT_AUTH_SUFFIX_KEY } from './constants'

const KEY_SESSION = '_scw_session'
const KEY_AUDIENCE_ID = '_scw_audience_id'
const DEFAULT_SUFFIX_KEY = ''

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
 * immutable `storageType`, `suffixKey`, and cookie config (`cookieConfig`/`cookieAge`).
 *
 * Each instance owns its own backends, so multiple providers can coexist
 * without clobbering each other's config. The `storageType` is set at creation
 * time and cannot be changed afterwards — use {@link createAuthStoreManager}
 * to create a new instance with a different storage type.
 *
 * Accepts either an options object `{ storageType, cookieConfig, cookieAge }`
 * or, for backward compatibility, a bare `StorageType` string.
 *
 * For backward compatibility, a default singleton `AuthStoreManager` is also
 * exported below.
 */
export const createAuthStoreManager = (param?: StorageType | CreateAuthStoreManagerOptions) => {
  const options = normalizeOptions(param)
  const storageType = options.storageType ?? 'cookie'
  const suffixKey = options.suffixKey ? `_${options.suffixKey}` : DEFAULT_SUFFIX_KEY

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

      if (resultParsed.error.issues.length > 0) {
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

    /**
     * Migrates any existing JWT and audienceId stored in cookies to localStorage,
     * then removes the cookie entries. Safe to call repeatedly — it is a no-op when
     * nothing is stored in cookies.
     *
     * Accesses the cookie and localStorage backends directly without changing
     * the instance's active `storageType`.
     */
    migrateCookieToLocalStorage(): { migrated: boolean; audienceId?: string } {
      const cookieBackend = backends.cookie
      const localStorageBackend = backends.localStorage

      const audienceIdRaw = cookieBackend.get(instance.getKeyAudienceId())
      const audienceIdParsed = audienceIdSchema.safeParse(audienceIdRaw)
      if (!audienceIdParsed.success) {
        return { migrated: false }
      }
      const { audienceId } = audienceIdParsed.data

      const jwtRaw = cookieBackend.get(instance.getKeySession(audienceId))
      const jwtParsed = jwtSchema.safeParse(jwtRaw)

      if (!jwtParsed.success) {
        // audienceId present but no jwt, still migrate audienceId
        localStorageBackend.set(instance.getKeyAudienceId(), { audienceId })
        cookieBackend.delete(instance.getKeyAudienceId())
        return { migrated: true, audienceId }
      }

      // Write to localStorage
      localStorageBackend.set(instance.getKeySession(audienceId), jwtParsed.data)
      localStorageBackend.set(instance.getKeyAudienceId(), { audienceId })

      // Clean up cookies
      cookieBackend.delete(instance.getKeySession(audienceId))
      cookieBackend.delete(instance.getKeyAudienceId())

      return { migrated: true, audienceId }
    },

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

// --- Backward-compatible singleton (deprecated) ---

let authStoreManagerSingletonWarned = false

const warnSingletonUsage = () => {
  if (authStoreManagerSingletonWarned) {
    return
  }
  authStoreManagerSingletonWarned = true
  console.warn(
    '`AuthStoreManager` singleton is deprecated. It uses shared global state that bypasses the provider. ' +
      'Use `useAuthScw().storeManager` to access the instance managed by `<AuthScwProvider>` instead. ' +
      'If you need a standalone instance, create one via `createAuthStoreManager()`.',
  )
}

/**
 * @deprecated Use `useAuthScw().storeManager` or `createAuthStoreManager()` instead.
 * The singleton bypasses the provider's configuration and shares global state across all providers.
 */
export const AuthStoreManager: AuthStoreManagerInstance = new Proxy(createAuthStoreManager(), {
  get(target, prop, receiver) {
    warnSingletonUsage()
    return Reflect.get(target, prop, receiver) as unknown
  },
})
