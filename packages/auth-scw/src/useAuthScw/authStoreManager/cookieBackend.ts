import { parseCookie, stringifySetCookie } from 'cookie'
import { COOKIE_CONFIG } from '../../constants'
import type { CookieConfigType } from '../../types'
import { COOKIE_AGE, DOMAIN } from './constants'
import type { StorageBackend } from './types'

let cookieConfig: CookieConfigType = COOKIE_CONFIG

export const setCookieConfig = (cookieConfigParam: CookieConfigType) => {
  cookieConfig = cookieConfigParam
}

export const getCookieConfig = () => cookieConfig

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

export const cookieBackend: StorageBackend = {
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
  set(key, value, maxAge = COOKIE_AGE) {
    setCookie(value, key, maxAge)
  },
}
