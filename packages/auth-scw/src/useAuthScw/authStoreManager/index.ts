import { LOCAL_STORAGE_JWTS_KEY } from '../../constants'
import type { AudienceIdType, EncodedJWT, StorageType } from '../../types'
import { audienceIdSchema, jwtSchema } from '../../zodSchemas'
import { COOKIE_AGE, DOMAIN, getUniqueHostnameString } from './constants'
import { cookieBackend } from './cookieBackend'
import { localStorageBackend } from './localStorageBackend'
import type { StorageBackend } from './types'

export { setCookieConfig } from './cookieBackend'
export { COOKIE_AGE, DOMAIN, getUniqueHostnameString } from './constants'
export type { StorageBackend } from './types'

const KEY_SESSION = '_scw_session'
const KEY_AUDIENCE_ID = '_scw_audience_id'
const DEFAULT_SUFFIX_KEY = ''

let currentStorageType: StorageType = 'cookie'
const backends: Record<StorageType, StorageBackend> = {
  cookie: cookieBackend,
  localStorage: localStorageBackend,
}

export const setStorageType = (storageType: StorageType) => {
  currentStorageType = storageType
}

export const getStorageType = () => currentStorageType

const getBackend = () => backends[currentStorageType]

export const AuthStoreManager = {
  COOKIE_AGE,
  DOMAIN,

  deleteAllJwts() {
    const prefix = AuthStoreManager.getKeySession('')
    getBackend().deleteAllWithPrefix(prefix)
  },
  deleteAudienceId() {
    getBackend().delete(AuthStoreManager.getKeyAudienceId())
  },

  deleteJwt(audienceId: string) {
    getBackend().delete(AuthStoreManager.getKeySession(audienceId))
  },

  getAudienceId(): string | null {
    const parsed = getBackend().get(AuthStoreManager.getKeyAudienceId())
    const resultParsed = audienceIdSchema.safeParse(parsed)
    if (resultParsed.success) {
      return resultParsed.data.audienceId
    }

    return null
  },
  getJwt(audienceId: string): EncodedJWT | null {
    const parsed = getBackend().get(AuthStoreManager.getKeySession(audienceId))
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
    return `${KEY_AUDIENCE_ID}${AuthStoreManager.SUFFIX_KEY}`
  },

  getKeySession(audienceId: string) {
    return `${KEY_SESSION}${AuthStoreManager.SUFFIX_KEY}_${audienceId}`
  },

  getUniqueHostnameString,
  SUFFIX_KEY: DEFAULT_SUFFIX_KEY,

  setAudienceId(audienceId: string) {
    getBackend().set(AuthStoreManager.getKeyAudienceId(), { audienceId })
  },

  setJwt({ jwtInfo, setAudienceId = true }: { jwtInfo: EncodedJWT; setAudienceId?: boolean }) {
    const audienceId = jwtInfo.jwt?.audienceId as string
    getBackend().set(AuthStoreManager.getKeySession(audienceId), jwtInfo)
    if (setAudienceId) {
      this.setAudienceId(audienceId)
    }
  },

  setSuffixKey(key: string) {
    AuthStoreManager.SUFFIX_KEY = key ? `_${key}` : DEFAULT_SUFFIX_KEY
  },

  typeGuardAudienceId(untypedObject: unknown): untypedObject is AudienceIdType {
    return audienceIdSchema.safeParse(untypedObject).success
  },

  typeGuardJWT(untypedObject: unknown): untypedObject is EncodedJWT {
    return jwtSchema.safeParse(untypedObject).success
  },
}

/**
 * Migrates any existing JWT and audienceId stored in cookies to localStorage,
 * then removes the cookie entries. Safe to call repeatedly — it is a no-op when
 * nothing is stored in cookies.
 *
 * This is meant to be called once, before reading the active storage, when the
 * application switches its `storageType` from 'cookie' to 'localStorage'.
 */
export const migrateCookieToLocalStorage = (): { migrated: boolean; audienceId?: string } => {
  const previousStorageType = currentStorageType
  // Force cookie backend to read existing data
  currentStorageType = 'cookie'

  try {
    const audienceId = AuthStoreManager.getAudienceId()
    if (!audienceId) {
      return { migrated: false }
    }

    const jwt = AuthStoreManager.getJwt(audienceId)
    if (!jwt) {
      // audienceId present but no jwt, still migrate audienceId
      currentStorageType = 'localStorage'
      AuthStoreManager.setAudienceId(audienceId)
      AuthStoreManager.deleteJwt(audienceId)
      cookieBackend.delete(AuthStoreManager.getKeyAudienceId())
      return { migrated: true, audienceId }
    }

    // Write to localStorage
    currentStorageType = 'localStorage'
    AuthStoreManager.setJwt({ jwtInfo: jwt, setAudienceId: true })

    // Clean up cookies
    currentStorageType = 'cookie'
    AuthStoreManager.deleteJwt(audienceId)
    cookieBackend.delete(AuthStoreManager.getKeyAudienceId())

    // Restore localStorage as the active backend
    currentStorageType = 'localStorage'

    return { migrated: true, audienceId }
  } finally {
    currentStorageType = previousStorageType
  }
}

// Re-exported for external reads (e.g. checks / debugging)
export const LOCAL_STORAGE_KEY = LOCAL_STORAGE_JWTS_KEY
