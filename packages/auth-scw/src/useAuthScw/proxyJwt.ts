import { subMinutes, subSeconds } from 'date-fns'
import type { EncodedJWT } from '../types'

type UpdateJWT =
  | {
      /**
       * default false
       */
      shouldOutdated: boolean
      /**
       * default 59 minutes
       */
      subMinuteOfExpires: number
      subSecondesOfExpires: number
    }
  | undefined

const defaultUpdateValue = {
  shouldOutdated: false,
  subMinuteOfExpires: 59,
  subSecondesOfExpires: 20,
} as const

/**
 * This function is only use for Development purpose only !!!
 * internal only
 * @param jwtInfoParam
 * @param shouldOutdatedJWT
 * @returns jwt
 */
export const proxyJwt = (jwtInfoParam: EncodedJWT, updateJwt: UpdateJWT = defaultUpdateValue) => {
  if (updateJwt.shouldOutdated) {
    const oldJwt = {
      ...jwtInfoParam.jwt,
      expiresAt: jwtInfoParam.jwt?.expiresAt
        ? subSeconds(
            subMinutes(new Date(jwtInfoParam.jwt.expiresAt), updateJwt.subMinuteOfExpires),
            updateJwt.subSecondesOfExpires,
          )
        : undefined,
    }

    const expiredJWT = {
      ...jwtInfoParam,
      jwt: oldJwt,
    } as EncodedJWT

    return expiredJWT
  }

  return jwtInfoParam
}
