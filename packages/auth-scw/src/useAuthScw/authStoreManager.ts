import { parseCookie, stringifySetCookie } from 'cookie'
import { COOKIE_CONFIG } from '../constants'
import type { AudienceIdType, EncodedJWT, CookieConfigType } from '../types'
import { audienceIdSchema, jwtSchema } from '../zodSchemas'

const KEY_SESSION = '_scw_session'
const KEY_AUDIENCE_ID = '_scw_audience_id'
const DEFAULT_SUFFIX_KEY = ''
const COOKIE_AGE = 3600 * 24 * 31 // 31 days
let cookieConfig: CookieConfigType = COOKIE_CONFIG

// location.host will include the port number, so we need to keep it on local case..
// const DOMAIN = typeof window !== 'undefined' ? globalThis.location.host : ''
// keep window as we used this package into e2e node execution
const DOMAIN = typeof window !== 'undefined' ? globalThis.location.hostname : ''

const getUniqueHostnameString = (inputString: string) => inputString.replaceAll('.', '_').replaceAll('-', '_')

export const setCookieConfig = (COOKIE_CONFIG_PARAM: CookieConfigType) => (cookieConfig = COOKIE_CONFIG_PARAM)

const setCookie = (value: object, key: string, maxAge = COOKIE_AGE) => {
  document.cookie = stringifySetCookie({
    name: key,
    value: JSON.stringify(value),
    domain: DOMAIN,
    httpOnly: cookieConfig.httpOnly,
    maxAge,
    path: cookieConfig.path,
    sameSite: cookieConfig.sameSite,
    secure: cookieConfig.secure,
  })
}

const getCookie = (key: string) => {
  const cookies = parseCookie(document.cookie)
  if (key in cookies && cookies[key]) {
    const cookieSessionString = cookies[key]

    if (cookieSessionString) {
      return JSON.parse(cookieSessionString) as object
    }

    return null
  }

  return null
}

const deleteCookie = (key: string) => {
  document.cookie = stringifySetCookie({
    name: key,
    value: '',
    domain: DOMAIN,
    httpOnly: cookieConfig.httpOnly,
    maxAge: -1,
    path: cookieConfig.path,
    sameSite: cookieConfig.sameSite,
    secure: cookieConfig.secure,
  })
}

export const AuthStoreManager = {
  COOKIE_AGE,
  DOMAIN,

  deleteAllJwts() {
    const prefix = AuthStoreManager.getKeySession('')

    document.cookie.split(';').forEach(cookieParam => {
      let [audienceId] = cookieParam.split('=')
      if (audienceId) {
        audienceId = audienceId.trim()
        if (audienceId.startsWith(prefix)) {
          this.deleteJwt(audienceId)
        }
      }
    })
  },
  deleteAudienceId() {
    deleteCookie(AuthStoreManager.getKeyAudienceId())
  },

  deleteJwt(audienceId: string) {
    deleteCookie(AuthStoreManager.getKeySession(audienceId))
  },
  deleteOldJwt() {
    deleteCookie(AuthStoreManager.getOldKeySession())
  },

  getAudienceId(): string | null {
    const cookieParsed = getCookie(AuthStoreManager.getKeyAudienceId())
    const resultCookieParsed = audienceIdSchema.safeParse(cookieParsed)
    if (resultCookieParsed.success) {
      return resultCookieParsed.data.audienceId
    }

    return null
  },
  getJwt(audienceId: string): EncodedJWT | null {
    const cookieParsed = getCookie(AuthStoreManager.getKeySession(audienceId))
    const resultCookieParsed = jwtSchema.safeParse(cookieParsed)

    if (resultCookieParsed.success) {
      return resultCookieParsed.data
    }

    if (resultCookieParsed.error) {
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

  getOldJwt(): EncodedJWT | null {
    const cookieParsed = getCookie(AuthStoreManager.getOldKeySession())
    if (cookieParsed && AuthStoreManager.typeGuardJWT(cookieParsed)) {
      return cookieParsed
    }

    return null
  },

  getOldKeySession() {
    return `${KEY_SESSION}${AuthStoreManager.SUFFIX_KEY}`
  },

  getUniqueHostnameString,
  SUFFIX_KEY: DEFAULT_SUFFIX_KEY,

  setAudienceId(audienceId: string) {
    setCookie({ audienceId }, AuthStoreManager.getKeyAudienceId())
  },

  setJwt({ jwtInfo, setAudienceId = true }: { jwtInfo: EncodedJWT; setAudienceId?: boolean }) {
    const audienceId = jwtInfo.jwt?.audienceId as string
    setCookie(jwtInfo, AuthStoreManager.getKeySession(audienceId))
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
