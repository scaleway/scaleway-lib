import { parseCookie, stringifySetCookie } from 'cookie'
import { COOKIE_CONFIG } from '../../constants'
import type { CookieConfigType } from '../../types'
import { COOKIE_AGE, DOMAIN } from './constants'
import type { StorageBackend } from './types'

// --- Backward-compatible module-level state ---

let cookieConfig: CookieConfigType = COOKIE_CONFIG
let cookieAge: number = COOKIE_AGE

export const setCookieConfig = (cookieConfigParam: CookieConfigType) => {
  cookieConfig = cookieConfigParam
}

export const getCookieConfig = () => cookieConfig

export const setCookieAge = (cookieAgeParam: number) => {
  cookieAge = cookieAgeParam
}

export const getCookieAge = () => cookieAge

// --- Factory ---

export type CookieBackendOptions = {
  cookieConfig?: CookieConfigType
  cookieAge?: number
}

export const createCookieBackend = (options: CookieBackendOptions = {}): StorageBackend => {
  const config = options.cookieConfig ?? cookieConfig
  const maxAgeDefault = options.cookieAge ?? cookieAge

  const setCookie = (value: object, key: string, maxAge = maxAgeDefault) => {
    document.cookie = stringifySetCookie({
      name: key,
      value: JSON.stringify(value),
      domain: DOMAIN,
      httpOnly: config.httpOnly,
      maxAge,
      path: config.path,
      sameSite: config.sameSite,
      secure: config.secure,
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
      httpOnly: config.httpOnly,
      maxAge: -1,
      path: config.path,
      sameSite: config.sameSite,
      secure: config.secure,
    })
  }

  return {
    delete(key) {
      deleteCookie(key)
    },
    deleteAllWithPrefix(prefix) {
      document.cookie.split(';').forEach(cookieParam => {
        let [audienceId] = cookieParam.split('=')
        if (audienceId) {
          audienceId = audienceId.trim()
          if (audienceId.startsWith(prefix)) {
            deleteCookie(audienceId)
          }
        }
      })
    },
    get(key) {
      return getCookie(key)
    },
    set(key, value, maxAge = maxAgeDefault) {
      setCookie(value, key, maxAge)
    },
  }
}

// --- Backward-compatible singleton ---

export const cookieBackend: StorageBackend = createCookieBackend()
