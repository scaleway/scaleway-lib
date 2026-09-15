export { EmptySession } from './constants'
export type { AudienceIdType, AuthScwContextType, EncodedJWT, StorageType } from './types'
export { AuthScwProvider, useAuthScw } from './useAuthScw'
export {
  AuthStoreManager,
  createAuthStoreManager,
  DEFAULT_AUTH_SUFFIX_KEY,
  COOKIE_AGE,
  DOMAIN,
  getUniqueHostnameString,
} from './useAuthScw/authStoreManager'
