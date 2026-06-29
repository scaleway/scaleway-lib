// eslint-disable-next-line no-abusive-eslint-disable
/* oxlint-disable */
export type StdLanguageCode = 'unknown_language_code' | 'en_US' | 'fr_FR' | 'de_DE'
export type AccountType = 'unknown_type' | 'personal' | 'corporate' | 'startup' | 'consultant' | 'association'
export type CloseOrganizationRequestReason =
  | 'unknown_reason'
  | 'no_longer_needed'
  | 'too_expensive'
  | 'missing_feature'
  | 'technical_issue'
  | 'test_only'
  | 'difficult_to_use'
  | 'using_another_account'
  | 'other'
export type CompanyAdministrativeDataProvider =
  | 'unknown_company_administrative_data_provider'
  | 'pappers_company_administrative_data_provider'
  | 'societe_com_company_administrative_data_provider'
export type ContractType =
  | 'unknown_type'
  | 'global'
  | 'k8s'
  | 'instance'
  | 'container'
  | 'baremetal'
  | 'network'
  | 'core'
  | 'vps'
  | 'storage'
  | 'transactional_email'
export type CreateAccountRequestEmailValidationMethod =
  | 'unknown_email_validation_method'
  | 'magic_link'
  | 'authentication_code'
export type CreateAccountRequestOrganizationOrigin =
  | 'unknown_organization_origin'
  | 'direct'
  | 'dedibox'
  | 'web_cloud'
  | 'account'
export type ListContractSignaturesRequestOrderBy =
  | 'signed_at_asc'
  | 'signed_at_desc'
  | 'expires_at_asc'
  | 'expires_at_desc'
  | 'name_asc'
  | 'name_desc'
export type ListMFAOTPsRequestOrderBy = 'created_at_asc' | 'created_at_desc'
export type ListMailingListSubscriptionsRequestOrderBy = 'name_asc' | 'name_desc'
export type ListProjectsRequestOrderBy = 'created_at_asc' | 'created_at_desc' | 'name_asc' | 'name_desc'
export type ListSupportPlansRequestOrderBy = 'started_at_asc' | 'started_at_desc' | 'stopped_at_asc' | 'stopped_at_desc'
export type ListUserOrganizationsRequestOrderBy = 'name_asc' | 'name_desc'
export type ListUserWebAuthnAuthenticatorsRequestOrderBy =
  | 'created_at_asc'
  | 'created_at_desc'
  | 'uv_verified_asc'
  | 'uv_verified_desc'
  | 'name_asc'
  | 'name_desc'
  | 'last_login_at_asc'
  | 'last_login_at_desc'
export type MailingListSubscriptionType = 'unknown_type' | 'newsletter'
export type OIDCIdentityProvider = 'unknown_identity_provider' | 'google' | 'microsoft' | 'github'
export type OrganizationBadge = 'unknown_badge' | 'badge_hds'
export type OrganizationCorporateIndustry =
  | 'unknown_corporate_industry'
  | 'consulting_services'
  | 'cybersecurity_software'
  | 'ecommerce_retail'
  | 'education'
  | 'energy'
  | 'financial_services_insurance'
  | 'gaming_entertainment'
  | 'hospitality_leisure'
  | 'lifescience_healthcare_pharmaceuticals'
  | 'manufacturing'
  | 'media_press_tv'
  | 'public_sector'
  | 'telecommunications'
  | 'technology'
  | 'other'
export type OrganizationCurrency = 'unknown_currency' | 'eur'
export type OrganizationOnboardingStep =
  | 'unknown_onboarding_step'
  | 'account_details'
  | 'phone_details'
  | 'address_details'
  | 'billing_details'
  | 'default_project_details'
  | 'default_project_qualification'
  | 'completed'
export type OrganizationOrigin =
  | 'unknown_origin'
  | 'direct'
  | 'invitation'
  | 'origin_internal'
  | 'reseller'
  | 'dedibox'
  | 'dedibox_one_account'
  | 'web_cloud'
  | 'account'
  | 'book_my_name_one_account'
export type OrganizationPaymentMode = 'unknown_payment_mode' | 'card' | 'sepa'
export type OrganizationResellerCustomerConfig =
  | 'unknown_reseller_customer_config'
  | 'standard'
  | 'billing'
  | 'billing_support'
export type OrganizationSubType =
  | 'unknown_sub_type'
  | 'standard_sub_type'
  | 'startup_sub_type'
  | 'consultant_sub_type'
  | 'personal_sub_type'
  | 'association_sub_type'
export type OrganizationType = 'unknown_type' | 'individual' | 'professional' | 'internal'
export type OrganizationUseCase =
  | 'unknown_use_case'
  | 'host_private_or_hybrid_cloud'
  | 'build_and_host_saas_application'
  | 'host_web_apps_and_websites'
  | 'manage_infrastructure'
  | 'store_data_and_automate_processes'
  | 'train_ml_models_and_run_ai_inference'
  | 'dont_know_yet'
  | 'other_use_case'
export type OrganizationWarningReason =
  | 'unknown_reason'
  | 'security_concerns'
  | 'security_issue'
  | 'critical_security_issue'
  | 'locked_for_abuse'
  | 'network_abuse'
  | 'invoice_payment_failure'
  | 'got_chargeback'
  | 'validate_tos'
  | 'validate_kyc'
  | 'payment_info_missing'
  | 'billing_info_missing'
  | 'account_closed'
  | 'card_expired_or_soon'
  | 'confirm_email_change'
  | 'gdpr_delete'
  | 'rate_limiting'
  | 'trusted_level_security_check'
  | 'online_invoice_payment_failure'
  | 'validate_email'
  | 'ultra_security_issue'
  | 'missing_vat_number'
  | 'invalid_vat_number'
  | 'locked_by_reseller'
  | 'validate_phone'
  | 'e_invoicing_info_missing'
export type PasswordStrengthScore = 'unknown_score' | 'very_weak' | 'weak' | 'medium' | 'strong' | 'very_strong'
export type QualificationAiMachineSubUseCase = 'unknown_sub_use_case'
export type QualificationArchitectureType =
  | 'unknown_architecture_type'
  | 'object_storage'
  | 'web_hosting'
  | 'instance'
  | 'elastic'
  | 'kubernetes'
  | 'serverless'
  | 'dedicated_server'
  | 'other_architecture_type'
export type QualificationArchiveDataSubUseCase = 'unknown_sub_use_case'
export type QualificationContainerSubUseCase = 'unknown_sub_use_case'
export type QualificationDeploySoftwareSubUseCase = 'unknown_sub_use_case'
export type QualificationHostApplicationSubUseCase = 'unknown_sub_use_case' | 'saas_app' | 'government_app'
export type QualificationHostWebsiteSubUseCase =
  | 'unknown_sub_use_case'
  | 'information_website'
  | 'ecommerce_website'
  | 'high_website'
  | 'other_sub_use_case'
export type QualificationOtherUseCaseSubUseCase = 'unknown_sub_use_case'
export type QualificationSetScalewayEnvironmentSubUseCase = 'unknown_sub_use_case'
export type QualificationShareDataSubUseCase = 'unknown_sub_use_case'
export type ResendAuthenticationCodeRequestOperation = 'unknown_operation' | 'sign_up' | 'sign_in'
export type SupportPlanLevel =
  | 'unknown_level'
  | 'basic'
  | 'developer'
  | 'bronze'
  | 'silver'
  | 'gold'
  | 'platinum'
  | 'advanced'
  | 'business'
  | 'enterprise'
  | 'custom_lvmh'
export type UserPreferencesConsoleTheme = 'unknown_console_theme' | 'light' | 'dark' | 'system' | 'darker'
export type UserPreferencesSideBarTemplate = 'unknown_side_bar_template' | 'default_template' | 'web_cloud'
export type UserVerificationRequirement =
  | 'user_verification_requirement_unknown'
  | 'user_verification_requirement_required'
  | 'user_verification_requirement_preferred'
  | 'user_verification_requirement_discouraged'
export type QualificationAiMachine = {
  subUseCase: QualificationAiMachineSubUseCase
}
export type QualificationArchiveData = {
  subUseCase: QualificationArchiveDataSubUseCase
}
export type QualificationContainer = {
  subUseCase: QualificationContainerSubUseCase
}
export type QualificationDeploySoftware = {
  subUseCase: QualificationDeploySoftwareSubUseCase
}
export type QualificationHostApplication = {
  subUseCase: QualificationHostApplicationSubUseCase
}
export type QualificationHostWebsite = {
  subUseCase: QualificationHostWebsiteSubUseCase
}
export type QualificationOtherUseCase = {
  subUseCase: QualificationOtherUseCaseSubUseCase
}
export type QualificationSetScalewayEnvironment = {
  subUseCase: QualificationSetScalewayEnvironmentSubUseCase
}
export type QualificationShareData = {
  subUseCase: QualificationShareDataSubUseCase
}
/**
 * Authenticator Assertion Response (subset of https://www.w3.org/TR/webauthn-3/#dictdef-authenticatorassertionresponsejson).
 */
export type AuthenticatorAssertionResponse = {
  /**
   * JSON representation of the client data.
   */
  clientDataJson: string
  /**
   * Data about the authenticator that performed the authentication.
   */
  authenticatorData: string
  /**
   * Signature by the authenticator key of the authentication ceremony data.
   */
  signature: string
}
/**
 * Authenticator Attestation Response (subset of https://www.w3.org/TR/webauthn-3/#dom-authenticatorattestationresponsejson-attestationobject).
 */
export type AuthenticatorAttestationResponse = {
  /**
   * JSON representation of the client data.
   */
  clientDataJson: string
  /**
   * Data about the authenticator that performed the authentication.
   */
  authenticatorData: string
  /**
   * Public key that allows to verify signature.
   */
  publicKey: string
  /**
   * Algorithm used for the signature (see https://www.iana.org/assignments/cose/cose.xhtml#algorithms).
   */
  publicKeyAlgorithm: number
  /**
   * Attestation Object.
   */
  attestationObject: string
}
export type Contract = {
  /**
   * ID of the contract.
   */
  id: string
  /**
   * The type of the contract.
   */
  type: ContractType
  /**
   * The name of the contract.
   */
  name: string
  /**
   * The version of the contract.
   */
  version: number
  /**
   * The creation date of the contract.
   */
  createdAt?: Date
  /**
   * The last modification date of the contract.
   */
  updatedAt?: Date
}
export type Qualification = {
  /**
   * Architecture type of the qualification.
   */
  architectureType: QualificationArchitectureType
  /**
   *
   * One-of ('useCase'): at most one of 'hostWebsite', 'hostApplication', 'deploySoftware', 'setScalewayEnvironment', 'aiMachine', 'container', 'archiveData', 'shareData', 'otherUseCase' could be set.
   */
  hostWebsite?: QualificationHostWebsite
  /**
   *
   * One-of ('useCase'): at most one of 'hostWebsite', 'hostApplication', 'deploySoftware', 'setScalewayEnvironment', 'aiMachine', 'container', 'archiveData', 'shareData', 'otherUseCase' could be set.
   */
  hostApplication?: QualificationHostApplication
  /**
   *
   * One-of ('useCase'): at most one of 'hostWebsite', 'hostApplication', 'deploySoftware', 'setScalewayEnvironment', 'aiMachine', 'container', 'archiveData', 'shareData', 'otherUseCase' could be set.
   */
  deploySoftware?: QualificationDeploySoftware
  /**
   *
   * One-of ('useCase'): at most one of 'hostWebsite', 'hostApplication', 'deploySoftware', 'setScalewayEnvironment', 'aiMachine', 'container', 'archiveData', 'shareData', 'otherUseCase' could be set.
   */
  setScalewayEnvironment?: QualificationSetScalewayEnvironment
  /**
   *
   * One-of ('useCase'): at most one of 'hostWebsite', 'hostApplication', 'deploySoftware', 'setScalewayEnvironment', 'aiMachine', 'container', 'archiveData', 'shareData', 'otherUseCase' could be set.
   */
  aiMachine?: QualificationAiMachine
  /**
   *
   * One-of ('useCase'): at most one of 'hostWebsite', 'hostApplication', 'deploySoftware', 'setScalewayEnvironment', 'aiMachine', 'container', 'archiveData', 'shareData', 'otherUseCase' could be set.
   */
  container?: QualificationContainer
  /**
   *
   * One-of ('useCase'): at most one of 'hostWebsite', 'hostApplication', 'deploySoftware', 'setScalewayEnvironment', 'aiMachine', 'container', 'archiveData', 'shareData', 'otherUseCase' could be set.
   */
  archiveData?: QualificationArchiveData
  /**
   *
   * One-of ('useCase'): at most one of 'hostWebsite', 'hostApplication', 'deploySoftware', 'setScalewayEnvironment', 'aiMachine', 'container', 'archiveData', 'shareData', 'otherUseCase' could be set.
   */
  shareData?: QualificationShareData
  /**
   *
   * One-of ('useCase'): at most one of 'hostWebsite', 'hostApplication', 'deploySoftware', 'setScalewayEnvironment', 'aiMachine', 'container', 'archiveData', 'shareData', 'otherUseCase' could be set.
   */
  otherUseCase?: QualificationOtherUseCase
}
/**
 * Authentication Response (subset of https://www.w3.org/TR/webauthn-3/#dictdef-authenticationresponsejson).
 */
export type AuthenticationResponse = {
  /**
   * Unique identifier of the key used by the authenticator.
   */
  rawId: string
  /**
   * Response provided by the authenticator to the authentication challenge.
   */
  response?: AuthenticatorAssertionResponse
}
export type JWT = {
  /**
   * JTI of the JWT.
   */
  jti: string
  /**
   * IAM user ID of the JWT issuer.
   */
  issuerId: string
  /**
   * IAM user ID of the JWT audience.
   */
  audienceId: string
  /**
   * Creation date of the JWT.
   */
  createdAt?: Date
  /**
   * Renewal date of the JWT.
   */
  updatedAt?: Date
  /**
   * Expiration date of the JWT.
   */
  expiresAt?: Date
  /**
   * Source IP address for the JWT creation.
   */
  ip: string
  /**
   * User agent for the JWT creation.
   */
  userAgent: string
}
/**
 * Public Key Credential Descriptor (subset of https://www.w3.org/TR/webauthn-3/#dictdef-publickeycredentialdescriptorjson).
 */
export type PublicKeyCredentialDescriptor = {
  /**
   * Unique identifier of the key.
   */
  id: string
}
/**
 * Public Key Credential Parameters (subset of https://www.w3.org/TR/webauthn-3/#dictdef-publickeycredentialparameters).
 */
export type PublicKeyCredentialParameters = {
  /**
   * COSE identifier of the algorithm (see https://www.iana.org/assignments/cose/cose.xhtml#algorithms).
   */
  alg: number
}
export type UserMFAMethods = {
  /**
   * True if the user has setup a TOTP.
   */
  totp: boolean
  /**
   * True if the user has at least one WebAuthn authenticator.
   */
  webAuthn: boolean
}
export type SupportPlan = {
  /**
   * ID of the support plan.
   */
  id: string
  /**
   * Level of the support plan.
   */
  level: SupportPlanLevel
  /**
   * Creation date of the support plan.
   */
  startedAt?: Date
  /**
   * End date of the support plan.
   */
  stoppedAt?: Date
  /**
   * ID of the Organization.
   */
  organizationId: string
}
export type TechnicalAccountManager = {
  /**
   * ID of the TAM.
   */
  id: string
  /**
   * Last name of the TAM.
   */
  lastName: string
  /**
   * First name of the TAM.
   */
  firstName: string
  /**
   * Email address of the TAM.
   */
  email: string
  /**
   * Phone number of the TAM.
   */
  phoneNumber: string
}
export type AutocompleteCompanyResponseSuggestion = {
  legalName: string
  companyRegistrationNumber: string
  zipCode?: string
  vatNumber?: string
  provider: CompanyAdministrativeDataProvider
  establishmentRegistrationNumber?: string
}
export type OrganizationAddress = {
  line1: string
  line2: string
  cityName: string
  zipCode: string
  subdivisionCode: string
  countryCode: string
}
export type CreateAccountRequestOIDC = {
  identityProvider: OIDCIdentityProvider
  accessToken: string
}
export type CreateAccountRequestPersonalOrganization = {}
export type CreateAccountRequestProfessionalOrganization = {}
export type CreateLoginSessionRequestAuthenticationCode = {
  /**
   * Email of the user.
   */
  email: string
  /**
   * 6 digits code sent by email.
   */
  code: string
}
export type CreateLoginSessionRequestOIDC = {
  /**
   * Code received from the identity provider.
   */
  code: string
  /**
   * Identity provider to connect with.
   */
  identityProvider: OIDCIdentityProvider
  /**
   * URI to which the identity provider will redirect after the authentication phase.
   */
  accountRedirectUri: string
}
export type CreateLoginSessionRequestPassword = {
  /**
   * Email of the user.
   */
  email: string
  /**
   * Password of the user.
   */
  password: string
  /**
   * Origin of the login request.
   */
  redirectUrl: string
  /**
   * Captcha response.
   */
  captcha?: string
}
export type CreateLoginSessionRequestPasswordless = {
  /**
   * Email of the user.
   */
  email: string
  /**
   * Token of the magic link.
   */
  token: string
}
/**
 * Registration Response (subset of https://www.w3.org/TR/webauthn-3/#dictdef-registrationresponsejson).
 */
export type RegistrationResponse = {
  /**
   * Unique identifier of the key used by the authenticator.
   */
  rawId: string
  /**
   * Response provided by the authenticator to the authentication challenge.
   */
  response?: AuthenticatorAttestationResponse
}
export type ContractSignature = {
  /**
   * ID of the contract signature.
   */
  id: string
  /**
   * The Organization ID which signed the contract.
   */
  organizationId: string
  /**
   * The creation date of the contract signature.
   */
  createdAt?: Date
  /**
   * The signing date of the contract signature.
   */
  signedAt?: Date
  /**
   * The expiration date of the contract signature.
   */
  expiresAt?: Date
  /**
   * The contract signed.
   */
  contract?: Contract
}
export type ListCountriesResponseCountry = {
  /**
   * Name of the country.
   */
  name: string
  /**
   * Two letters representing the country.
   */
  code: string
  /**
   * Flag representation of the country.
   */
  flag: string
  /**
   * True if the country should have a VAT identification number, false otherwise.
   */
  vatNumberRequired: boolean
}
export type ListCountrySubdivisionsResponseSubdivision = {
  /**
   * Subdivision name.
   */
  name: string
  /**
   * Subdivision code is a few numbers and/or letters completing the ISO 3166-1 code of the country.
   */
  code: string
}
export type MFAOTP = {
  /**
   * ID of the MFA OTP.
   */
  id: string
  /**
   * Secret of the MFA OTP.
   */
  secret?: string
}
export type MailingListSubscription = {
  /**
   * ID of the mailing list.
   */
  id: string
  /**
   * Name of the mailing list.
   */
  name: string
  /**
   * Description of the mailing list.
   */
  description: string
  /**
   * Status of the subscription.
   */
  subscribed: boolean
  /**
   * Type of the subscription.
   */
  type: MailingListSubscriptionType
}
export type Project = {
  /**
   * ID of the Project.
   */
  id: string
  /**
   * Name of the Project.
   */
  name: string
  /**
   * Organization ID of the Project.
   */
  organizationId: string
  /**
   * Creation date of the Project.
   */
  createdAt?: Date
  /**
   * Update date of the Project.
   */
  updatedAt?: Date
  /**
   * Description of the Project.
   */
  description: string
  /**
   * Qualification of the Project.
   */
  qualification?: Qualification
}
export type OrganizationSummary = {
  /**
   * ID of the Organization.
   */
  id: string
  /**
   * Name of the Organization.
   */
  name: string
  /**
   * Defines whether the user_id created the Organization.
   */
  owner: boolean
  /**
   * Defines whether we have locking warnings.
   */
  locked: boolean
  /**
   * Defines whether MFA is required for the Organization.
   */
  mfaEnforced: boolean
  /**
   * Organization's picture URL.
   */
  pictureLink?: string
  /**
   * Organization Type.
   */
  organizationType: OrganizationType
  /**
   * Organization Corporate Industry.
   */
  corporateIndustry: OrganizationCorporateIndustry
  /**
   * @deprecated Deprecated. Defines whether the organization is a startup.
   */
  isStartup?: boolean
}
export type WebAuthnAuthenticator = {
  /**
   * ID of the WebAuthn Authenticator.
   */
  id: string
  /**
   * Name of the WebAuthn Authenticator.
   */
  name: string
  /**
   * Date the WebAuthn Authenticator was created.
   */
  createdAt?: Date
  /**
   * Date the WebAuthn Authenticator was last successfully used for a LogIn, will be omitted if the WebAuthn Authenticator has never been used.
   */
  lastLoginAt?: Date
  /**
   * This flag prevents an attack where a lost, non-UV authenticator (e.g., a PIN-less hardware key used only as a second factor) is found by an attacker who then adds a PIN to it to bypass MFA via a passwordless login. To mitigate this, the system will not trust the authenticator for single-factor (passwordless) login until it successfully performs UV in conjunction with another trusted factor.
   */
  uvVerified: boolean
}
export type FinishWebAuthnAuthenticationRequest = {
  /**
   * ID of the authentication ceremony to finish.
   */
  ceremonyId: string
  /**
   * WebAuthn response to the authentication ceremony.
   */
  authenticationResponse?: AuthenticationResponse
  /**
   * The domain on which the authentication is occurring.
   */
  origin: string
}
export type LogInOrganizationsResponseWebAuthnMetadata = {
  uvVerifiedSet: boolean
}
export type OrganizationLogin = {
  /**
   * ID of the organization.
   */
  organizationId: string
  /**
   * Name of the organization.
   */
  organizationName: string
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
export type OrganizationDediboxAccount = {
  id: number
  linkedAt?: Date
  migratedAt?: Date
}
export type OrganizationWarning = {
  id: string
  reason: OrganizationWarningReason
  locking: boolean
  closed: boolean
  openedAt?: Date
}
/**
 * Public Key Credential Request Options (subset of https://www.w3.org/TR/webauthn-3/#dictdef-publickeycredentialrequestoptionsjson).
 */
export type PublicKeyCredentialRequestOptions = {
  /**
   * Random bytes constituting the challenge to solve for the credentials assertion.
   */
  challenge: string
  /**
   * Maximum duration of the authentication ceremony (milliseconds).
   */
  timeout: number
  /**
   * List of credentials, if any, which can be used to perform the ceremony.
   */
  allowCredentials: PublicKeyCredentialDescriptor[]
  /**
   * User verification requirement for this authentication ceremony.
   */
  userVerification: UserVerificationRequirement
}
/**
 * Public Key Credential Creation Options (subset of https://www.w3.org/TR/webauthn-3/#dictdef-publickeycredentialcreationoptionsjson).
 */
export type PublicKeyCredentialCreationOptions = {
  /**
   * Random bytes constituting the challenge to solve for the credentials creation.
   */
  challenge: string
  /**
   * List of algorithms supported by the relying party.
   */
  pubKeyCredParams: PublicKeyCredentialParameters[]
  /**
   * Maximum duration of the registration ceremony (milliseconds).
   */
  timeout: number
  /**
   * List of credentials that cannot be used to fulfill the ceremony.
   */
  excludeCredentials: PublicKeyCredentialDescriptor[]
}
export type PersonalOrganization = {
  /**
   * Defines whether the user wants to be subscribed to the Scaleway mailing list.
   */
  newsletterSubscription: boolean
}
export type ProfessionalOrganization = {
  /**
   * Main industry the organization is associated with.
   */
  corporateIndustry: OrganizationCorporateIndustry
}
export type UserPreferencesProductsToDisplay = {
  productsId: Record<string, boolean>
}
export type User = {
  /**
   * ID of the user.
   */
  id: string
  /**
   * First name of the user.
   */
  firstName: string
  /**
   * Last name of the user.
   */
  lastName: string
  /**
   * Email of the user.
   */
  email: string
  /**
   * Phone number of the user.
   */
  phoneNumber: string
  /**
   * Date the user was created.
   */
  createdAt?: Date
  /**
   * Date the user was updated.
   */
  updatedAt?: Date
  /**
   * Defines whether multi-factor authentication is enabled for the user.
   */
  mfa: boolean
  /**
   * Defines for each multi-factor authentication method whether the user has it enabled or not.
   */
  mfaMethods?: UserMFAMethods
  /**
   * Locale of the user.
   */
  locale: StdLanguageCode
  /**
   * Defines whether the user has a password set.
   */
  hasPassword: boolean
  /**
   * Defines whether the user has a professional email or not.
   */
  isProfessionalEmail: boolean
}
export type Account = {
  /**
   * Request creation id.
   */
  id: string
  /**
   * Email used for the account request.
   */
  email: string
  /**
   * Token used to validate the account without email validation.
   */
  token?: string
}
export type ActiveSupportPlan = {
  /**
   * Active support plan information.
   */
  supportPlan?: SupportPlan
  /**
   * Support id of the Organization.
   */
  supportId: string
  /**
   * Support pin of the Organization.
   */
  supportPin: string
  /**
   * Technical account manager attached to the Organization.
   */
  technicalAccountManager?: TechnicalAccountManager
}
export type AutocompleteCompanyResponse = {
  /**
   * List of company suggestions List of companies matching the search query.
   */
  suggestions: AutocompleteCompanyResponseSuggestion[]
}
export type ChangeUserEmailResponse = {
  /**
   * Email address for an already pending change request.
   */
  pendingEmail: string
}
export type CheckContractSignatureResponse = {
  /**
   * Whether a signature has been requested for this contract.
   */
  created: boolean
  /**
   * Whether the signature for this contract has been validated.
   */
  validated: boolean
}
export type CompanyAdministrativeData = {
  /**
   * Company legal name The official legal name of the company.
   */
  legalName: string
  /**
   * Company registration number The company registration number (SIREN for French companies, 9 digits).
   */
  companyRegistrationNumber: string
  /**
   * Establishment registration number The establishment registration number (SIRET for French companies, 14 digits). Only available when looking up by SIRET or when the provider returns establishment-level data.
   */
  establishmentRegistrationNumber?: string
  /**
   * VAT number VAT number for tax purposes.
   */
  vatNumber?: string
  /**
   * Company address Full postal address of the company.
   */
  address?: OrganizationAddress
  /**
   * Data provider The data provider used to fetch this company information.
   */
  provider: CompanyAdministrativeDataProvider
}
export type CompanyAdministrativeDataApiAutocompleteCompanyRequest = {
  /**
   * Search query The search query, which can be a company name or registration number.
   */
  query: string
  /**
   * Country code ISO 3166-1 alpha-2 country code (e.g., "FR" for France, "IT" for Italy). Determines which data provider will be used.
   */
  countryCode: string
  /**
   * Organization on behalf of which data should be queried.
   */
  organizationId?: string
}
export type CompanyAdministrativeDataApiLookupCompanyAdministrativeDataRequest = {
  /**
   * Company registration number The company registration number (SIREN for French companies, 9 digits). Use this to retrieve the main establishment.
   *
   * One-of ('query'): at most one of 'companyRegistrationNumber', 'establishmentRegistrationNumber' could be set.
   */
  companyRegistrationNumber?: string
  /**
   * Establishment registration number The establishment registration number (SIRET for French companies, 14 digits). Use this to retrieve a specific establishment.
   *
   * One-of ('query'): at most one of 'companyRegistrationNumber', 'establishmentRegistrationNumber' could be set.
   */
  establishmentRegistrationNumber?: string
  /**
   * Country code ISO 3166-1 alpha-2 country code (e.g., "FR" for France, "IT" for Italy).
   */
  countryCode: string
  /**
   * Organization on behalf of which data should be queried.
   */
  organizationId?: string
}
export type ContractApiCheckContractSignatureRequest = {
  /**
   * ID of the Organization to check the contract signature for.
   */
  organizationId?: string
  /**
   * Filter on contract type.
   */
  contractType?: ContractType
  /**
   * Filter on contract name.
   */
  contractName: string
}
export type ContractApiCreateContractSignatureRequest = {
  /**
   * The type of the contract.
   */
  contractType?: ContractType
  /**
   * The name of the contract.
   */
  contractName: string
  /**
   * Whether the contract is validated at creation.
   */
  validated: boolean
  /**
   * ID of the Organization.
   */
  organizationId?: string
}
export type ContractApiDownloadContractSignatureRequest = {
  /**
   * The contract signature ID.
   */
  contractSignatureId: string
  /**
   * The locale requested for the content of the contract.
   */
  locale?: StdLanguageCode
}
export type ContractApiListContractSignaturesRequest = {
  /**
   * The page number for the returned contracts.
   */
  page?: number
  /**
   * The maximum number of contracts per page.
   */
  pageSize?: number
  /**
   * How the contracts are ordered in the response.
   */
  orderBy?: ListContractSignaturesRequestOrderBy
  /**
   * Filter on Organization ID.
   */
  organizationId?: string
}
export type ContractApiValidateContractSignatureRequest = {
  /**
   * The contract linked to your Organization you want to sign.
   */
  contractSignatureId: string
}
export type FinishWebAuthnAuthenticatorUpgradeResponse = {}
export type FinishWebAuthnRegistrationResponse = {
  /**
   * ID of the WebAuthn authenticator.
   */
  authenticatorId: string
  /**
   * This indicates that the authenticator supports user verification and was verified during registration.
   */
  uvVerified: boolean
}
export type InitiateAuthenticationCodeLoginResponse = {}
export type InitiateOIDCLoginResponse = {
  /**
   * URL to redirect the user to.
   */
  url: string
  /**
   * Security token to check when receiving a code from the identity provider.
   */
  securityToken: string
}
export type InitiateOIDCSignupResponse = {
  /**
   * URL to redirect the user to.
   */
  url: string
  /**
   * Security token to check when receiving a code from the identity provider.
   */
  securityToken: string
}
export type IsoCodeApiListCountriesRequest = Record<string, never>
export type IsoCodeApiListCountrySubdivisionsRequest = {
  /**
   * The country code.
   */
  countryCode: string
}
export type ListContractSignaturesResponse = {
  /**
   * The total number of contract signatures.
   */
  totalCount: number
  /**
   * The paginated returned contract signatures.
   */
  contractSignatures: ContractSignature[]
}
export type ListCountriesResponse = {
  /**
   * List of countries.
   */
  countries: ListCountriesResponseCountry[]
}
export type ListCountrySubdivisionsResponse = {
  /**
   * List of subdivisions for a country code.
   */
  subdivisions: ListCountrySubdivisionsResponseSubdivision[]
}
export type ListMFAOTPsResponse = {
  /**
   * Total number of MFA OTPs.
   */
  totalCount: number
  /**
   * Paginated returned MFA OTPs.
   */
  mfaOtps: MFAOTP[]
}
export type ListMailingListSubscriptionsResponse = {
  /**
   * Number of mailing list subscriptions.
   */
  totalCount: number
  /**
   * List of mailing list subscriptions.
   */
  mailingListSubscriptions: MailingListSubscription[]
}
export type ListProjectsResponse = {
  /**
   * Total number of Projects.
   */
  totalCount: number
  /**
   * Paginated returned Projects.
   */
  projects: Project[]
}
export type ListSupportPlansResponse = {
  /**
   * List of support plans.
   */
  supportPlans: SupportPlan[]
  /**
   * Total count of support plans.
   */
  totalCount: number
}
export type ListUserOrganizationsResponse = {
  /**
   * List of user's Organization summaries.
   */
  organizations: OrganizationSummary[]
  /**
   * Total count of Organization summaries.
   */
  totalCount: number
}
export type ListUserWebAuthnAuthenticatorsResponse = {
  /**
   * List of the user's WebAuthn Authenticators.
   */
  authenticators: WebAuthnAuthenticator[]
  /**
   * Total count of WebAuthn Authenticators.
   */
  totalCount: number
}
export type LogInOrganizationsResponse = {
  /**
   * List of organizations and their associated login information.
   */
  organizationsLoginInformation: OrganizationLogin[]
  /**
   *
   * One-of ('methodMetadata'): at most one of 'webauthn' could be set.
   */
  webauthn?: LogInOrganizationsResponseWebAuthnMetadata
}
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
export type LoginSession = {
  /**
   * ID of the login session.
   */
  id: string
}
export type ObserveKYCRateLimitResponse = {
  /**
   * Returns true if the action is currently rate limited.
   */
  isRateLimited: boolean
  /**
   * Suggested waiting time in seconds before next retry.
   */
  retryAfterSeconds: number
}
export type Organization = {
  /**
   * ID of the Organization.
   */
  id: string
  /**
   * Name of the Organization.
   */
  name: string
  /**
   * Creation date of the Organization.
   */
  createdAt?: Date
  /**
   * Last modification date of the Organization.
   */
  updatedAt?: Date
  /**
   * Postal address of the Organization.
   */
  address?: OrganizationAddress
  /**
   * VAT number for tax exemption.
   */
  vatNumber?: string
  /**
   * Type of this Organization (personal or professional).
   */
  type: OrganizationType
  /**
   * Subtype of this Organization.
   */
  subType: OrganizationSubType
  /**
   * Currency defined in the signed Terms of Service.
   */
  currency: OrganizationCurrency
  /**
   * All warnings attached to this Organization.
   */
  warnings: OrganizationWarning[]
  /**
   * @deprecated Deprecated, use payment API instead.
   */
  paymentMode?: OrganizationPaymentMode
  /**
   * @deprecated Email on which invoices are sent Email to which invoices are sent. If empty, the Owner's email is used. Replaced by the Notification manager.
   */
  billingEmail?: string
  /**
   * Set to true if MFA is required for the Organization.
   */
  mfaEnforced: boolean
  /**
   * Contains ID and link creation date if a dedibox account is linked.
   */
  dediboxAccount?: OrganizationDediboxAccount
  /**
   * @deprecated Deprecated. Set to true if the Organization is identified as a startup.
   */
  isStartup?: boolean
  /**
   * Corporate industry of the Organization.
   */
  corporateIndustry: OrganizationCorporateIndustry
  /**
   * DUNS number.
   */
  dunsNumber?: string
  /**
   * Use cases of the Organization.
   */
  useCases: OrganizationUseCase[]
  /**
   * Link to the Organization's picture.
   */
  pictureLink?: string
  /**
   * @deprecated Reseller customer profile.
   */
  resellerCustomerProfile?: string
  /**
   * All badges attached to this Organization.
   */
  badges: OrganizationBadge[]
  /**
   * Reseller customer config.
   */
  resellerCustomerConfig: OrganizationResellerCustomerConfig
  /**
   * Organization onboarding process step.
   */
  onboardingStep: OrganizationOnboardingStep
  /**
   * Organization origin.
   */
  origin: OrganizationOrigin
  /**
   * Tax code for if required for your country.
   */
  taxCode?: string
  /**
   * Certified email address if required for your country.
   */
  certifiedEmailAddress?: string
  /**
   * Recipient Code if required for your country (e.g SDI, PPF).
   */
  recipientCode?: string
  /**
   * Legal name of the organization.
   */
  legalName?: string
  /**
   * The primary identification number for the legal entity.
   */
  companyRegistrationNumber?: string
  /**
   * The identification number for a specific branch, operating unit, or physical location of the company.
   */
  establishmentRegistrationNumber?: string
}
export type OrganizationApiChangeSupportPlanRequest = {
  /**
   * ID of the Organization.
   */
  organizationId?: string
  /**
   * Level of support plan The level of support plan. Can only be basic, silver or gold.
   */
  level?: SupportPlanLevel
}
export type OrganizationApiCloseOrganizationRequest = {
  /**
   * ID of the Organization.
   */
  organizationId?: string
  /**
   * Reasons to close the Organization.
   */
  reasons?: CloseOrganizationRequestReason[]
  /**
   * More details about why the Organization is being closed.
   */
  details?: string
}
export type OrganizationApiGetActiveSupportPlanRequest = {
  /**
   * ID of the Organization.
   */
  organizationId?: string
}
export type OrganizationApiGetOrganizationRequest = {
  /**
   * ID of the Organization.
   */
  organizationId?: string
}
export type OrganizationApiListSupportPlansRequest = {
  /**
   * Filter by Organization ID.
   */
  organizationId?: string
  /**
   * Sort order of support plans.
   */
  orderBy?: ListSupportPlansRequestOrderBy
  /**
   * Requested page number. Value must be greater or equals to 1.
   */
  page?: number
  /**
   * Number of items per page. Value must be between 1 and 1000.
   */
  pageSize?: number
}
export type OrganizationApiSendMFAEnableReminderEmailRequest = {
  /**
   * ID of the Organization.
   */
  organizationId?: string
  /**
   * ID of the user sending the email.
   */
  senderAccountRootUserId: string
  /**
   * ID of the user receiving the email.
   */
  accountRootUserId: string
}
export type OrganizationApiSetOrganizationUseCasesRequest = {
  organizationId?: string
  useCases?: OrganizationUseCase[]
}
export type OrganizationApiSetPictureRequest = {
  /**
   * ID of the Organization.
   */
  organizationId?: string
  /**
   * Picture to upload.
   */
  file?: Blob
}
export type OrganizationApiSkipOnboardingBillingDetailsRequest = {
  /**
   * ID of the Organization.
   */
  organizationId?: string
}
export type OrganizationApiUpdateOrganizationBillingDetailsRequest = {
  /**
   * ID of the Organization.
   */
  organizationId?: string
  /**
   * VAT number for tax exemption.
   */
  vatNumber?: string
  /**
   * Address object.
   */
  address?: OrganizationAddress
  /**
   * DUNS number.
   */
  dunsNumber?: string
  /**
   * Tax code for if required for your country.
   */
  taxCode?: string
  /**
   * Certified email address if required for your country.
   */
  certifiedEmailAddress?: string
  /**
   * Legal name of the organization.
   */
  legalName?: string
  /**
   * Recipient Code if required for your country (e.g SDI, PPF).
   */
  recipientCode?: string
  /**
   * The primary identification number for the legal entity.
   */
  companyRegistrationNumber?: string
  /**
   * The identification number for a specific branch, operating unit, or physical location of the company.
   */
  establishmentRegistrationNumber?: string
}
export type OrganizationApiUpdateOrganizationDetailsRequest = {
  /**
   * ID of the Organization.
   */
  organizationId?: string
  /**
   * Name of the Organization.
   */
  name?: string
  /**
   * Organization type.
   */
  type?: OrganizationType
  /**
   * Set to true to ensure MFA is required for the Organization.
   */
  mfaEnforced?: boolean
}
export type PasswordStrength = {
  score: PasswordStrengthScore
  timeToCrack?: string
}
export type PhoneValidation = {
  /**
   * ID of the phone validation.
   */
  id: string
}
export type ProjectApiCreateProjectRequest = {
  /**
   * Name of the Project.
   */
  name?: string
  /**
   * Organization ID of the Project.
   */
  organizationId?: string
  /**
   * Description of the Project.
   */
  description: string
}
export type ProjectApiDeleteProjectRequest = {
  /**
   * Project ID of the Project.
   */
  projectId?: string
}
export type ProjectApiGetProjectRequest = {
  /**
   * Project ID of the Project.
   */
  projectId?: string
}
export type ProjectApiListProjectsRequest = {
  /**
   * Organization ID of the Project.
   */
  organizationId?: string
  /**
   * Name of the Project.
   */
  name?: string
  /**
   * Page number for the returned Projects.
   */
  page?: number
  /**
   * Maximum number of Project per page.
   */
  pageSize?: number
  /**
   * Sort order of the returned Projects.
   */
  orderBy?: ListProjectsRequestOrderBy
  /**
   * Project IDs to filter for. The results will be limited to any Projects with an ID in this array.
   */
  projectIds?: string[]
}
export type ProjectApiSetProjectQualificationRequest = {
  /**
   * Project ID.
   */
  projectId?: string
  /**
   * Use case chosen for the Project.
   */
  qualification?: Qualification
}
export type ProjectApiUpdateProjectRequest = {
  /**
   * Project ID of the Project.
   */
  projectId?: string
  /**
   * Name of the Project.
   */
  name?: string
  /**
   * Description of the Project.
   */
  description?: string
}
export type ProjectQualification = {
  /**
   * Project ID.
   */
  projectId: string
  /**
   * Qualification of the Project.
   */
  qualification?: Qualification
}
export type RateLimitApiObserveKYCRateLimitRequest = {
  /**
   * The organization ID to check rate limit.
   */
  organizationId?: string
}
export type SetMailingListSubscriptionsResponse = {
  /**
   * List of mailing list subscriptions.
   */
  mailingListSubscriptions: MailingListSubscription[]
}
export type SetOrganizationUseCasesResponse = {
  useCases: OrganizationUseCase[]
}
export type StartWebAuthnAuthenticationResponse = {
  /**
   * ID of the ceremony which will be needed for completion.
   */
  id: string
  /**
   * WebAuthn challenge to solve to finish the ceremony.
   */
  publicKeyCredentialRequest?: PublicKeyCredentialRequestOptions
}
export type StartWebAuthnAuthenticatorUpgradeResponse = {
  /**
   * ID of the upgrade ceremony.
   */
  ceremonyId: string
  /**
   * Challenge details for the upgrade.
   */
  publicKeyCredentialRequestOptions?: PublicKeyCredentialRequestOptions
}
export type StartWebAuthnRegistrationResponse = {
  /**
   * ID of the ceremony.
   */
  id: string
  /**
   * Challenge details for registration.
   */
  publicKeyCredentialCreationOptions?: PublicKeyCredentialCreationOptions
}
export type UnauthenticatedApiComputePasswordStrengthRequest = {
  password: string
  userInputs?: string[]
}
export type UnauthenticatedUserApiCreateAccountRequest = {
  /**
   * Email of the user.
   *
   * One-of ('method'): at most one of 'email', 'oidc' could be set.
   */
  email?: string
  /**
   * If this field is used, the `email` field must not be set.
   *
   * One-of ('method'): at most one of 'email', 'oidc' could be set.
   */
  oidc?: CreateAccountRequestOIDC
  /**
   * Captcha validation code. This is required as an anti-fraud measure.
   */
  captcha: string
  /**
   * @deprecated Type of account to create.
   */
  type?: AccountType
  /**
   * By default a magic_link will be sent.
   */
  emailValidationMethod?: CreateAccountRequestEmailValidationMethod
  /**
   * @deprecated
   *
   * One-of ('organizationType'): at most one of 'personalOrganization', 'professionalOrganization' could be set.
   */
  personalOrganization?: CreateAccountRequestPersonalOrganization
  /**
   * Origin of the organization creation request.
   */
  origin?: CreateAccountRequestOrganizationOrigin
  /**
   * @deprecated
   *
   * One-of ('organizationType'): at most one of 'personalOrganization', 'professionalOrganization' could be set.
   */
  professionalOrganization?: CreateAccountRequestProfessionalOrganization
  /**
   * First name of the user.
   */
  firstName: string
  /**
   * Last name of the user.
   */
  lastName: string
}
export type UnauthenticatedUserApiCreateLoginSessionRequest = {
  /**
   * Log in with password.
   *
   * One-of ('method'): at most one of 'password', 'passwordless', 'oidc', 'authenticationCode' could be set.
   */
  password?: CreateLoginSessionRequestPassword
  /**
   * Log in with passwordless.
   *
   * One-of ('method'): at most one of 'password', 'passwordless', 'oidc', 'authenticationCode' could be set.
   */
  passwordless?: CreateLoginSessionRequestPasswordless
  /**
   * Log in with OpenID Connect.
   *
   * One-of ('method'): at most one of 'password', 'passwordless', 'oidc', 'authenticationCode' could be set.
   */
  oidc?: CreateLoginSessionRequestOIDC
  /**
   *
   * One-of ('method'): at most one of 'password', 'passwordless', 'oidc', 'authenticationCode' could be set.
   */
  authenticationCode?: CreateLoginSessionRequestAuthenticationCode
}
export type UnauthenticatedUserApiFinishWebAuthnAuthenticationRequest = {
  /**
   * ID of the authentication ceremony to finish.
   */
  ceremonyId: string
  /**
   * WebAuthn response to the authentication ceremony.
   */
  authenticationResponse?: AuthenticationResponse
  /**
   * The domain on which the authentication is occurring.
   */
  origin: string
}
export type UnauthenticatedUserApiInitiateAuthenticationCodeLoginRequest = {
  /**
   * Email of the user to login.
   */
  email: string
}
export type UnauthenticatedUserApiInitiateOIDCLoginRequest = {
  /**
   * Identity provider to connect with.
   */
  identityProvider?: OIDCIdentityProvider
  /**
   * URL to redirect to after login.
   */
  redirectUrl: string
  /**
   * URI to which the identity provider will redirect after the authentication phase.
   */
  accountRedirectUri: string
}
export type UnauthenticatedUserApiInitiateOIDCSignupRequest = {
  /**
   * Identity provider to connect with.
   */
  identityProvider?: OIDCIdentityProvider
  /**
   * @deprecated Type of account to create.
   */
  accountType?: AccountType
  /**
   * URL to redirect the user to after login.
   */
  redirectUrl: string
  /**
   * URI to which the identity provider will redirect after the authentication phase.
   */
  accountRedirectUri: string
}
export type UnauthenticatedUserApiInitiatePasswordlessLoginRequest = {
  /**
   * Email of the user.
   */
  email: string
  /**
   * Origin of the login request.
   */
  redirectUrl: string
}
export type UnauthenticatedUserApiLogInOrganizationsRequest = {
  /**
   * ID of the login session.
   */
  loginSessionId: string
  /**
   * OTP of the user.
   *
   * One-of ('mfa'): at most one of 'otp', 'webauthn' could be set.
   */
  otp?: string
  /**
   * WebAuthn response to the authentication ceremony.
   *
   * One-of ('mfa'): at most one of 'otp', 'webauthn' could be set.
   */
  webauthn?: FinishWebAuthnAuthenticationRequest
}
export type UnauthenticatedUserApiLogInRequest = {
  /**
   * ID of the login session.
   */
  loginSessionId: string
  /**
   * OTP of the user.
   *
   * One-of ('mfa'): at most one of 'otp', 'webauthn' could be set.
   */
  otp?: string
  /**
   * Optional organization_id to specify the organization we want to log in.
   */
  organizationId?: string
  /**
   * WebAuthn response to the authentication ceremony.
   *
   * One-of ('mfa'): at most one of 'otp', 'webauthn' could be set.
   */
  webauthn?: FinishWebAuthnAuthenticationRequest
}
export type UnauthenticatedUserApiNotifyAccountRequest = {
  /**
   * Email associated to the user account.
   */
  email: string
}
export type UnauthenticatedUserApiRejectEmailUpdateRequest = {
  /**
   * ID of the user.
   */
  accountRootUserId: string
  /**
   * Token received to reject the email update.
   */
  token: string
}
export type UnauthenticatedUserApiResendAuthenticationCodeRequest = {
  /**
   * Email of the user.
   */
  email: string
  /**
   * Sign up or sign in operation.
   */
  operation?: ResendAuthenticationCodeRequestOperation
}
export type UnauthenticatedUserApiResetPasswordRequest = {
  /**
   * Token received to reset the password.
   */
  token: string
  /**
   * New password.
   */
  password: string
}
export type UnauthenticatedUserApiSendResetPasswordEmailRequest = {
  /**
   * Email associated to the user account.
   */
  email: string
  /**
   * Captcha response.
   */
  captcha?: string
}
export type UnauthenticatedUserApiStartWebAuthnAuthenticationRequest = {
  /**
   * ID of the login session. Use canary UUID `00000000-0000-0000-0000-000000000000` for passkey flows without email (treated as null during migration).
   */
  loginSessionId: string
  /**
   * The domain on which the authentication is occurring.
   */
  origin: string
}
export type UnauthenticatedUserApiValidateAccountRequest = {
  /**
   * Email used for the account request.
   */
  email: string
  /**
   * Token received to validate the account.
   */
  token: string
  /**
   * Details of the professional organization.
   *
   * One-of ('organizationType'): at most one of 'professionalOrganization', 'personalOrganization' could be set.
   */
  professionalOrganization?: ProfessionalOrganization
  /**
   * Details of the personal organization.
   *
   * One-of ('organizationType'): at most one of 'professionalOrganization', 'personalOrganization' could be set.
   */
  personalOrganization?: PersonalOrganization
  /**
   * @deprecated First name of the user.
   */
  firstName: string
  /**
   * @deprecated Last name of the user.
   */
  lastName: string
  /**
   * Type of the account.
   */
  accountType?: AccountType
  /**
   * Name of the organization.
   */
  organizationName: string
  /**
   * Country code of the organization (ISO 3166-2).
   */
  countryCode?: string
}
export type UnauthenticatedUserApiValidateAuthenticationCodeSignUpRequest = {
  /**
   * Email of the user.
   */
  email: string
  /**
   * Authentication code sent by email.
   */
  code: string
}
export type UnauthenticatedUserApiValidateEmailRequest = {
  /**
   * Email address to validate.
   */
  email: string
  /**
   * Token received to validate the email address.
   */
  token: string
}
export type UnauthenticatedUserApiValidateEmailUpdateRequest = {
  /**
   * ID of the user.
   */
  accountRootUserId: string
  /**
   * Token received to validate the email update.
   */
  token: string
}
export type UnauthenticatedUserApiValidateOIDCSignupRequest = {
  /**
   * Identity provider to connect with.
   */
  identityProvider?: OIDCIdentityProvider
  /**
   * @deprecated Type of account to create.
   */
  accountType?: AccountType
  /**
   * Authorization code returned initially by the identity provider.
   */
  code: string
  /**
   * URI to which the identity provider will redirect after the authentication phase.
   */
  accountRedirectUri: string
}
export type UserApiChangeUserEmailRequest = {
  /**
   * ID of the user.
   */
  userId: string
  /**
   * New user email to update.
   */
  email: string
}
export type UserApiChangeUserPasswordRequest = {
  /**
   * ID of the user.
   */
  userId: string
  /**
   * Used to set or update a new password.
   */
  newPassword: string
  /**
   * Current user password to check.
   */
  currentPassword?: string
}
export type UserApiConfirmPhoneValidationRequest = {
  /**
   * ID of the phone validation.
   */
  phoneValidationId: string
  /**
   * Code required to validate the phone number.
   */
  code: string
}
export type UserApiCreateMFAOTPRequest = {
  /**
   * User ID of the MFA OTP.
   */
  userId: string
}
export type UserApiDeleteMFAOTPRequest = {
  /**
   * ID of the MFA OTP.
   */
  mfaOtpId: string
}
export type UserApiDeleteWebAuthnAuthenticatorRequest = {
  /**
   * ID of the WebAuthn Authenticator to delete.
   */
  authenticatorId: string
}
export type UserApiFinishWebAuthnAuthenticatorUpgradeRequest = {
  /**
   * ID of the user.
   */
  userId: string
  /**
   * ID of the WebAuthn authenticator to upgrade.
   */
  authenticatorId: string
  /**
   * ID of the upgrade ceremony.
   */
  ceremonyId: string
  /**
   * Response to the upgrade challenge.
   */
  authenticationResponse?: AuthenticationResponse
  /**
   * The domain on which the upgrade is occurring.
   */
  origin: string
}
export type UserApiFinishWebAuthnRegistrationRequest = {
  /**
   * ID of the user.
   */
  userId: string
  /**
   * ID of the ceremony.
   */
  ceremonyId: string
  /**
   * Response to the challenge.
   */
  registrationResponse?: RegistrationResponse
  /**
   * Name of the WebAuthn Authenticator to create.
   */
  authenticatorName: string
  /**
   * The domain on which the registration is occurring.
   */
  origin: string
}
export type UserApiGetUserPreferencesRequest = {
  /**
   * ID of the user.
   */
  userId: string
}
export type UserApiGetUserRequest = {
  /**
   * ID of the user.
   */
  userId: string
}
export type UserApiListMFAOTPsRequest = {
  /**
   * Page number for the returned MFA OTPs.
   */
  page?: number
  /**
   * Maximum number of MFA OTP per page.
   */
  pageSize?: number
  /**
   * Sort order of the returned MFA OTPs.
   */
  orderBy?: ListMFAOTPsRequestOrderBy
  /**
   * Filter out by a user ID.
   */
  userId: string
}
export type UserApiListMailingListSubscriptionsRequest = {
  /**
   * ID of the user.
   */
  userId: string
  /**
   * @deprecated ID of the organization. Must be defined if you want to list mailing lists subscriptions related to the organization.
   */
  organizationId?: string
  /**
   * Page number to return, from the paginated results.
   */
  page?: number
  /**
   * Number of mailing list subscriptions to return.
   */
  pageSize?: number
  /**
   * Sort order of mailing list subscriptions in the response.
   */
  orderBy?: ListMailingListSubscriptionsRequestOrderBy
}
export type UserApiListUserOrganizationsRequest = {
  /**
   * ID of the user.
   */
  userId: string
  /**
   * Page number to return, from the paginated results.
   */
  page?: number
  /**
   * Number of Organization summaries to return.
   */
  pageSize?: number
  /**
   * Sort order of Organization summaries in the response.
   */
  orderBy?: ListUserOrganizationsRequestOrderBy
}
export type UserApiListUserWebAuthnAuthenticatorsRequest = {
  /**
   * ID of the user.
   */
  userId: string
  /**
   * Page number to return.
   */
  page?: number
  /**
   * Number of WebAuthn Authenticators to return.
   */
  pageSize?: number
  /**
   * Sort order of WebAuthn Authenticators in the response.
   */
  orderBy?: ListUserWebAuthnAuthenticatorsRequestOrderBy
  /**
   * If set, filters authenticators by uv verified status.
   */
  uvVerified?: boolean
}
export type UserApiSendPhoneValidationRequest = {
  /**
   * ID of the user.
   */
  userId: string
  /**
   * Phone number to validate. Must be in international format (E.164).
   */
  phoneNumber: string
}
export type UserApiSetMailingListSubscriptionsRequest = {
  /**
   * ID of the user.
   */
  userId: string
  /**
   * Map of mailing list subscriptions IDs with their subscription status.
   */
  mailingListSubscribed?: Record<string, boolean>
  /**
   * @deprecated ID of the organization. Must be defined if you want to set mailing list subscriptions related to the organization.
   */
  organizationId?: string
}
export type UserApiStartWebAuthnAuthenticatorUpgradeRequest = {
  /**
   * ID of the user.
   */
  userId: string
  /**
   * ID of the WebAuthn authenticator to upgrade.
   */
  authenticatorId: string
  /**
   * The domain on which the upgrade is occurring.
   */
  origin: string
}
export type UserApiStartWebAuthnRegistrationRequest = {
  /**
   * ID of the user.
   */
  userId: string
  /**
   * The domain on which the registration is occurring.
   */
  origin: string
}
export type UserApiUpdateUserPreferencesRequest = {
  /**
   * ID of the user.
   */
  userId: string
  /**
   * Console theme preference.
   */
  consoleTheme?: UserPreferencesConsoleTheme
  /**
   * Pinned products.
   */
  pinnedProducts?: string[]
  /**
   * Send SMS on login from a new IP.
   */
  sendSmsNewIpLogin?: boolean
  /**
   * Receive SMS notifications.
   */
  receiveSmsNotifications?: boolean
  /**
   * Pick a predefined sibe bar template.
   *
   * One-of ('preferredSideBar'): at most one of 'predefinedTemplate', 'customTemplate' could be set.
   */
  predefinedTemplate?: UserPreferencesSideBarTemplate
  /**
   * Define a custom side bar.
   *
   * One-of ('preferredSideBar'): at most one of 'predefinedTemplate', 'customTemplate' could be set.
   */
  customTemplate?: UserPreferencesProductsToDisplay
}
export type UserApiUpdateUserRequest = {
  /**
   * ID of the user.
   */
  userId: string
  /**
   * First name of the user.
   */
  firstName?: string
  /**
   * Last name of the user.
   */
  lastName?: string
  /**
   * Locale of the user.
   */
  locale?: StdLanguageCode
}
export type UserApiUpdateWebAuthnAuthenticatorRequest = {
  /**
   * ID of the WebAuthn Authenticator to update.
   */
  authenticatorId: string
  /**
   * New name for the WebAuthn Authenticator.
   */
  authenticatorName?: string
}
export type UserApiValidateMFAOTPRequest = {
  /**
   * ID of the MFA OTP.
   */
  mfaOtpId: string
  /**
   * One time password of the MFA OTP.
   */
  otp: string
}
export type UserPreferences = {
  /**
   * ID of the user.
   */
  userId: string
  /**
   * Console theme preference.
   */
  consoleTheme: UserPreferencesConsoleTheme
  /**
   * Pinned products.
   */
  pinnedProducts: string[]
  /**
   * Send SMS on login from a new IP.
   */
  sendSmsNewIpLogin: boolean
  /**
   * Receive SMS notifications.
   */
  receiveSmsNotifications: boolean
  /**
   * Selected sidebar template (e.g. default, web_cloud).
   *
   * One-of ('preferredSideBar'): at most one of 'predefinedTemplate', 'customTemplate' could be set.
   */
  predefinedTemplate?: UserPreferencesSideBarTemplate
  /**
   * Custom sidebar configuration defining which products are visible.
   *
   * One-of ('preferredSideBar'): at most one of 'predefinedTemplate', 'customTemplate' could be set.
   */
  customTemplate?: UserPreferencesProductsToDisplay
}
export type ValidateAccountResponse = {
  /**
   * User created.
   */
  user?: User
  /**
   * Summary of the organization created for the user.
   */
  organizationSummary?: OrganizationSummary
  /**
   * Secret authenticating the user.
   */
  secret: string
}
export type ValidateAuthenticationCodeSignUpResponse = {
  /**
   * Secret authenticating the user.
   */
  secret: string
  /**
   * @deprecated Type of account validated.
   */
  accountType: AccountType
  /**
   * First name of the user.
   */
  firstName: string
  /**
   * Last name of the user.
   */
  lastName: string
}
export type ValidateMFAOTPResponse = {
  /**
   * Backup codes of the MFA OTP.
   */
  backupCodes: string[]
}
export type ValidateOIDCSignupResponse = {
  /**
   * Email to sign-up.
   */
  email: string
  /**
   * Access token to get user's protected resources.
   */
  accessToken: string
}
