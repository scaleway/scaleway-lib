import type { JWT } from '../iam/types'
// eslint-disable-next-line no-abusive-eslint-disable
/* oxlint-disable */

export declare namespace Accountv3 {
  export type LogInResponse = {
    /**
     * Data of the JWT created by the login request.
     */
    jwt?: JWT
    /**
     * Encoded JWT token.
     */
    token: string
    /**
     * Encoded JWT renew token.
     */
    renewToken: string
  }
}
