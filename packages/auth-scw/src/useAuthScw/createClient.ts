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
  clientSettings: undefined,

  setAPIsAndSettings({ IamV1Alpha1, IamUnauthenticatedV1Alpha1, clientSettings }) {
    this.IamV1Alpha1 = IamV1Alpha1
    this.IamUnauthenticatedV1Alpha1 = IamUnauthenticatedV1Alpha1
    this.clientSettings = clientSettings
  },

  createClient({ getAsyncToken }) {
    if (!this.IamV1Alpha1 || !this.IamUnauthenticatedV1Alpha1 || !this.clientSettings)
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

    return {
      deleteJWT: iamv1alpha1API.deleteJWT,
      renewJWT: iamUnauthenticatedV1Alpha1API.renewJWT,
    }
  },
}
