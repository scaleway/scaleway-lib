import { useCallback } from 'react'
import type { LoginOrganizationsInputsType } from '../types'
import type { Accountv3 } from '../types/account'
import { clientSingleton } from './createClient'

export const useLoginMethods = () => {
  const {
    initiateOIDCLogin: initiateOidcLogin,
    initiateAuthenticationCodeLogin,
    resendAuthenticationCode,
    startWebAuthnAuthentication,
    createLoginSession: loginSession,
    logInOrganizations,
  } = clientSingleton.createClient({})

  const loginOrganizations = useCallback(
    async ({
      loginSessionId,
      otp,
      webauthn,
      callback,
    }: LoginOrganizationsInputsType): Promise<Accountv3.LogInOrganizationsResponse> => {
      const organizationsArray = await logInOrganizations({
        loginSessionId,
        otp,
        webauthn,
      })

      // if we want to perform some action when login is successful and not yet updated into cookies
      // like sent event or clean up actions
      await callback?.(organizationsArray)

      return organizationsArray
    },
    [logInOrganizations],
  )

  return {
    initiateAuthenticationCodeLogin,
    initiateOidcLogin,
    loginOrganizations,
    loginSession,
    resendAuthenticationCode,
    startWebAuthnAuthentication,
  }
}
