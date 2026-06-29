import { useCallback } from 'react'
import type { IamMemberCommitLoginInputsType } from '../types'
import type { Iamv1alpha1 } from '../types/iam'
import { clientSingleton } from './createClient'

export const useMemberLoginMethods = () => {
  const {
    searchOrganization: iamMemberSearchOrganization,
    initiateOAuth2Login: iamMemberInitiateOAuth2Login,
    initiateSamlLogin: iamMemberInitiateSamlLogin,
    createOAuth2Login: iamMemberCreateOAuth2Login,
    createPasswordLogin: iamMemberCreatePasswordLogin,
    initiateMagicCodeLogin: iamMemberInitiateMagicCodeLogin,
    createMagicCodeLogin: iamMemberCreateMagicCodeLogin,
    checkLoginMFAOTP: iamMemberCheckLoginMFAOTP,
    commitLogin,
  } = clientSingleton.createClient({})

  const iamMemberCommitLogin = useCallback(
    async ({ loginId, callback }: IamMemberCommitLoginInputsType): Promise<Iamv1alpha1.CommitLoginResponse> => {
      const jwtRes = await commitLogin({
        loginId,
      })

      // if we want to perform some action when login is successful and not yet updated into cookies
      // like sent event or clean up actions
      await callback?.(jwtRes)

      return jwtRes
    },
    [commitLogin],
  )

  return {
    iamMemberCheckLoginMFAOTP,
    iamMemberCommitLogin,
    iamMemberCreateMagicCodeLogin,
    iamMemberCreateOAuth2Login,
    iamMemberCreatePasswordLogin,
    iamMemberInitiateMagicCodeLogin,
    iamMemberInitiateOAuth2Login,
    iamMemberInitiateSamlLogin,
    iamMemberSearchOrganization,
  }
}
