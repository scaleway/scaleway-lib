import {
  addAsyncHeaderInterceptor,
  createAdvancedClient,
  withAdditionalInterceptors,
  withProfile,
  SESSION_HEADER_KEY,
} from '@scaleway/sdk-client'
import type { ConfigurationClientMethods, CreateTemporaryClientType, ConfigAuthProvider } from '../types'

type ClientSingletonType = {
  setAPIsAndSettings: (params: ConfigAuthProvider) => void
  createClient: (params: CreateTemporaryClientType) => ConfigurationClientMethods
} & Partial<ConfigAuthProvider>

export const clientSingleton: ClientSingletonType = {
  IamV1Alpha1: undefined,
  IamUnauthenticatedV1Alpha1: undefined,
  AccountV3UnauthenticatedUser: undefined,
  clientSettings: undefined,

  setAPIsAndSettings({ IamV1Alpha1, IamUnauthenticatedV1Alpha1, AccountV3UnauthenticatedUser, clientSettings }) {
    this.IamV1Alpha1 = IamV1Alpha1
    this.IamUnauthenticatedV1Alpha1 = IamUnauthenticatedV1Alpha1
    this.AccountV3UnauthenticatedUser = AccountV3UnauthenticatedUser
    this.clientSettings = clientSettings
  },

  createClient({ getAsyncToken }) {
    if (
      !this.IamV1Alpha1 ||
      !this.IamUnauthenticatedV1Alpha1 ||
      !this.AccountV3UnauthenticatedUser ||
      !this.clientSettings
    )
      throw 'You must set apis and client settings to use package: auth-scw'

    const client = createAdvancedClient(
      withProfile(this.clientSettings),
      withAdditionalInterceptors([
        ...this.clientSettings.interceptors,
        {
          request: async ({ request }) =>
            getAsyncToken ? addAsyncHeaderInterceptor(SESSION_HEADER_KEY, getAsyncToken)({ request }) : request,
        },
      ]),
    )

    const iamv1alpha1API = new this.IamV1Alpha1(client)
    const iamUnauthenticatedV1Alpha1API = new this.IamUnauthenticatedV1Alpha1(client)
    const accountV3UnauthenticatedUserAPI = new this.AccountV3UnauthenticatedUser(client)

    return {
      checkLoginMFAOTP: iamUnauthenticatedV1Alpha1API.checkLoginMFAOTP,
      commitLogin: iamUnauthenticatedV1Alpha1API.commitLogin,
      createMagicCodeLogin: iamUnauthenticatedV1Alpha1API.createMagicCodeLogin,
      createOAuth2Login: iamUnauthenticatedV1Alpha1API.createOAuth2Login,
      createPasswordLogin: iamUnauthenticatedV1Alpha1API.createPasswordLogin,
      deleteJWT: iamv1alpha1API.deleteJWT,
      initiateMagicCodeLogin: iamUnauthenticatedV1Alpha1API.initiateMagicCodeLogin,
      initiateOAuth2Login: iamUnauthenticatedV1Alpha1API.initiateOAuth2Login,
      initiateSamlLogin: iamUnauthenticatedV1Alpha1API.initiateSamlLogin,
      renewJWT: iamUnauthenticatedV1Alpha1API.renewJWT,
      searchOrganization: iamUnauthenticatedV1Alpha1API.searchOrganization,
      createLoginSession: accountV3UnauthenticatedUserAPI.createLoginSession,
      initiateAuthenticationCodeLogin: accountV3UnauthenticatedUserAPI.initiateAuthenticationCodeLogin,
      initiateOIDCLogin: accountV3UnauthenticatedUserAPI.initiateOIDCLogin,
      logInOrganizations: accountV3UnauthenticatedUserAPI.logInOrganizations,
      resendAuthenticationCode: accountV3UnauthenticatedUserAPI.resendAuthenticationCode,
      startWebAuthnAuthentication: accountV3UnauthenticatedUserAPI.startWebAuthnAuthentication,
    }
  },
}
