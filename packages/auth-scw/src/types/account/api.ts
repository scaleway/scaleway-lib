// eslint-disable-next-line no-abusive-eslint-disable
/* oxlint-disable */
import { API as ParentAPI } from '@scaleway/sdk-client'
import type {
  Account,
  ActiveSupportPlan,
  AutocompleteCompanyResponse,
  ChangeUserEmailResponse,
  CheckContractSignatureResponse,
  CompanyAdministrativeData,
  CompanyAdministrativeDataApiAutocompleteCompanyRequest,
  CompanyAdministrativeDataApiLookupCompanyAdministrativeDataRequest,
  ContractApiCheckContractSignatureRequest,
  ContractApiCreateContractSignatureRequest,
  ContractApiDownloadContractSignatureRequest,
  ContractApiListContractSignaturesRequest,
  ContractApiValidateContractSignatureRequest,
  ContractSignature,
  FinishWebAuthnAuthenticatorUpgradeResponse,
  FinishWebAuthnRegistrationResponse,
  InitiateAuthenticationCodeLoginResponse,
  InitiateOIDCLoginResponse,
  InitiateOIDCSignupResponse,
  IsoCodeApiListCountriesRequest,
  IsoCodeApiListCountrySubdivisionsRequest,
  ListContractSignaturesResponse,
  ListCountriesResponse,
  ListCountrySubdivisionsResponse,
  ListMailingListSubscriptionsResponse,
  ListMFAOTPsResponse,
  ListProjectsResponse,
  ListSupportPlansResponse,
  ListUserOrganizationsResponse,
  ListUserWebAuthnAuthenticatorsResponse,
  LogInOrganizationsResponse,
  LogInResponse,
  LoginSession,
  MFAOTP,
  ObserveKYCRateLimitResponse,
  Organization,
  OrganizationApiChangeSupportPlanRequest,
  OrganizationApiCloseOrganizationRequest,
  OrganizationApiGetActiveSupportPlanRequest,
  OrganizationApiGetOrganizationRequest,
  OrganizationApiListSupportPlansRequest,
  OrganizationApiSendMFAEnableReminderEmailRequest,
  OrganizationApiSetOrganizationUseCasesRequest,
  OrganizationApiSetPictureRequest,
  OrganizationApiSkipOnboardingBillingDetailsRequest,
  OrganizationApiUpdateOrganizationBillingDetailsRequest,
  OrganizationApiUpdateOrganizationDetailsRequest,
  PasswordStrength,
  PhoneValidation,
  Project,
  ProjectApiCreateProjectRequest,
  ProjectApiDeleteProjectRequest,
  ProjectApiGetProjectRequest,
  ProjectApiListProjectsRequest,
  ProjectApiSetProjectQualificationRequest,
  ProjectApiUpdateProjectRequest,
  ProjectQualification,
  RateLimitApiObserveKYCRateLimitRequest,
  SetMailingListSubscriptionsResponse,
  SetOrganizationUseCasesResponse,
  StartWebAuthnAuthenticationResponse,
  StartWebAuthnAuthenticatorUpgradeResponse,
  StartWebAuthnRegistrationResponse,
  SupportPlan,
  UnauthenticatedApiComputePasswordStrengthRequest,
  UnauthenticatedUserApiCreateAccountRequest,
  UnauthenticatedUserApiCreateLoginSessionRequest,
  UnauthenticatedUserApiFinishWebAuthnAuthenticationRequest,
  UnauthenticatedUserApiInitiateAuthenticationCodeLoginRequest,
  UnauthenticatedUserApiInitiateOIDCLoginRequest,
  UnauthenticatedUserApiInitiateOIDCSignupRequest,
  UnauthenticatedUserApiInitiatePasswordlessLoginRequest,
  UnauthenticatedUserApiLogInOrganizationsRequest,
  UnauthenticatedUserApiLogInRequest,
  UnauthenticatedUserApiNotifyAccountRequest,
  UnauthenticatedUserApiRejectEmailUpdateRequest,
  UnauthenticatedUserApiResendAuthenticationCodeRequest,
  UnauthenticatedUserApiResetPasswordRequest,
  UnauthenticatedUserApiSendResetPasswordEmailRequest,
  UnauthenticatedUserApiStartWebAuthnAuthenticationRequest,
  UnauthenticatedUserApiValidateAccountRequest,
  UnauthenticatedUserApiValidateAuthenticationCodeSignUpRequest,
  UnauthenticatedUserApiValidateEmailRequest,
  UnauthenticatedUserApiValidateEmailUpdateRequest,
  UnauthenticatedUserApiValidateOIDCSignupRequest,
  User,
  UserApiChangeUserEmailRequest,
  UserApiChangeUserPasswordRequest,
  UserApiConfirmPhoneValidationRequest,
  UserApiCreateMFAOTPRequest,
  UserApiDeleteMFAOTPRequest,
  UserApiDeleteWebAuthnAuthenticatorRequest,
  UserApiFinishWebAuthnAuthenticatorUpgradeRequest,
  UserApiFinishWebAuthnRegistrationRequest,
  UserApiGetUserPreferencesRequest,
  UserApiGetUserRequest,
  UserApiListMailingListSubscriptionsRequest,
  UserApiListMFAOTPsRequest,
  UserApiListUserOrganizationsRequest,
  UserApiListUserWebAuthnAuthenticatorsRequest,
  UserApiSendPhoneValidationRequest,
  UserApiSetMailingListSubscriptionsRequest,
  UserApiStartWebAuthnAuthenticatorUpgradeRequest,
  UserApiStartWebAuthnRegistrationRequest,
  UserApiUpdateUserPreferencesRequest,
  UserApiUpdateUserRequest,
  UserApiUpdateWebAuthnAuthenticatorRequest,
  UserApiValidateMFAOTPRequest,
  UserPreferences,
  ValidateAccountResponse,
  ValidateAuthenticationCodeSignUpResponse,
  ValidateMFAOTPResponse,
  ValidateOIDCSignupResponse,
  WebAuthnAuthenticator,
} from './types'
/**
 * Organization API.

Organization API The Organization API allows you to manage the personal data of an Organization.
 */
export declare class OrganizationAPI extends ParentAPI {
  /**
   * Change the support plan for the Organization Change the support plan by supplying the level of support wanted and the Organization ID.. Change the support plan for the Organization Change the support plan by supplying the level of support wanted and the Organization ID.
   *
   * @param request - The request {@link OrganizationApiChangeSupportPlanRequest}
   * @returns A Promise of SupportPlan
   */
  changeSupportPlan: (request?: Readonly<OrganizationApiChangeSupportPlanRequest>) => Promise<SupportPlan>
  /**
   * Get the active support plan for the Organization Get the support plan for the Organization along with the Technical Account Manager contact information.. Get the active support plan for the Organization Get the support plan for the Organization along with the Technical Account Manager contact information.
   *
   * @param request - The request {@link OrganizationApiGetActiveSupportPlanRequest}
   * @returns A Promise of ActiveSupportPlan
   */
  getActiveSupportPlan: (request?: Readonly<OrganizationApiGetActiveSupportPlanRequest>) => Promise<ActiveSupportPlan>
  protected pageOfListSupportPlans: (
    request?: Readonly<OrganizationApiListSupportPlansRequest>,
  ) => Promise<ListSupportPlansResponse>
  /**
   * List the support plans for the Organization.
   *
   * @param request - The request {@link OrganizationApiListSupportPlansRequest}
   * @returns A Promise of ListSupportPlansResponse
   */
  listSupportPlans: (
    request?: Readonly<OrganizationApiListSupportPlansRequest>,
  ) => Promise<ListSupportPlansResponse> & {
    all: () => Promise<SupportPlan[]>
    [Symbol.asyncIterator]: () => AsyncGenerator<SupportPlan[], void, void>
  }
  /**
   * Close Organization Close the Organization associated with the given ID.. Close Organization Close the Organization associated with the given ID.
   *
   * @param request - The request {@link OrganizationApiCloseOrganizationRequest}
   */
  closeOrganization: (request?: Readonly<OrganizationApiCloseOrganizationRequest>) => Promise<void>
  setOrganizationUseCases: (
    request?: Readonly<OrganizationApiSetOrganizationUseCasesRequest>,
  ) => Promise<SetOrganizationUseCasesResponse>
  /**
   * Update the details of the Organization details with the given ID.
   *
   * @param request - The request {@link OrganizationApiUpdateOrganizationDetailsRequest}
   * @returns A Promise of Organization
   */
  updateOrganizationDetails: (
    request?: Readonly<OrganizationApiUpdateOrganizationDetailsRequest>,
  ) => Promise<Organization>
  /**
   * Update the billing details of the Organization with the given ID.
   *
   * @param request - The request {@link OrganizationApiUpdateOrganizationBillingDetailsRequest}
   * @returns A Promise of Organization
   */
  updateOrganizationBillingDetails: (
    request?: Readonly<OrganizationApiUpdateOrganizationBillingDetailsRequest>,
  ) => Promise<Organization>
  /**
   * Get the Organization with the given ID.
   *
   * @param request - The request {@link OrganizationApiGetOrganizationRequest}
   * @returns A Promise of Organization
   */
  getOrganization: (request?: Readonly<OrganizationApiGetOrganizationRequest>) => Promise<Organization>
  /**
   * Set picture Set a picture for the Organization.. Set picture Set a picture for the Organization.
   *
   * @param request - The request {@link OrganizationApiSetPictureRequest}
   */
  setPicture: (request?: Readonly<OrganizationApiSetPictureRequest>) => Promise<void>
  /**
   * Send MFA enable reminder email. Send an email to the specified user to remind them to enable MFA on their account. Useful for Organizations where MFA is enforced for members.
   *
   * @param request - The request {@link OrganizationApiSendMFAEnableReminderEmailRequest}
   */
  sendMFAEnableReminderEmail: (request: Readonly<OrganizationApiSendMFAEnableReminderEmailRequest>) => Promise<void>
  /**
   * Skip billing details during onboarding Skip the billing details step during the onboarding process. The onboarding step will be advanced to the next step.. Skip billing details during onboarding Skip the billing details step during the onboarding process. The onboarding step will be advanced to the next step.
   *
   * @param request - The request {@link OrganizationApiSkipOnboardingBillingDetailsRequest}
   * @returns A Promise of Organization
   */
  skipOnboardingBillingDetails: (
    request?: Readonly<OrganizationApiSkipOnboardingBillingDetailsRequest>,
  ) => Promise<Organization>
}
/**
 * Company Administrative Data API.

Company Administrative Data API The Company Administrative Data API allows you to retrieve company information for e-billing purposes. It provides autocomplete search and full company details lookup, automatically selecting the appropriate data provider based on the country.
 */
export declare class CompanyAdministrativeDataAPI extends ParentAPI {
  /**
   * Autocomplete company search Search for companies by name or registration number. The backend automatically selects the appropriate data provider (Pappers or Societe.com) based on the country code. Returns a list of matching companies with basic information.. Autocomplete company search Search for companies by name or registration number. The backend automatically selects the appropriate data provider (Pappers or Societe.com) based on the country code. Returns a list of matching companies with basic information.
   *
   * @param request - The request {@link CompanyAdministrativeDataApiAutocompleteCompanyRequest}
   * @returns A Promise of AutocompleteCompanyResponse
   */
  autocompleteCompany: (
    request: Readonly<CompanyAdministrativeDataApiAutocompleteCompanyRequest>,
  ) => Promise<AutocompleteCompanyResponse>
  /**
   * Lookup full company administrative data Retrieve complete company information including VAT number and full address. This method may trigger a paid search for some providers (e.g., Societe.com for France). Use this after the user selects a company from the autocomplete results.. Lookup full company administrative data Retrieve complete company information including VAT number and full address. This method may trigger a paid search for some providers (e.g., Societe.com for France). Use this after the user selects a company from the autocomplete results.
   *
   * @param request - The request {@link CompanyAdministrativeDataApiLookupCompanyAdministrativeDataRequest}
   * @returns A Promise of CompanyAdministrativeData
   */
  lookupCompanyAdministrativeData: (
    request: Readonly<CompanyAdministrativeDataApiLookupCompanyAdministrativeDataRequest>,
  ) => Promise<CompanyAdministrativeData>
}
/**
 * Contract API.

The Contract API allows you to manage contracts.
 */
export declare class ContractAPI extends ParentAPI {
  /**
   * Download a contract content.
   *
   * @param request - The request {@link ContractApiDownloadContractSignatureRequest}
   * @returns A Promise of Blob
   */
  downloadContractSignature: (request: Readonly<ContractApiDownloadContractSignatureRequest>) => Promise<Blob>
  /**
   * Create a signature for your Organization for the latest version of the requested contract.
   *
   * @param request - The request {@link ContractApiCreateContractSignatureRequest}
   * @returns A Promise of ContractSignature
   */
  createContractSignature: (request: Readonly<ContractApiCreateContractSignatureRequest>) => Promise<ContractSignature>
  /**
   * Sign a contract for your Organization.
   *
   * @param request - The request {@link ContractApiValidateContractSignatureRequest}
   * @returns A Promise of ContractSignature
   */
  validateContractSignature: (
    request: Readonly<ContractApiValidateContractSignatureRequest>,
  ) => Promise<ContractSignature>
  /**
   * Check if a contract is signed for your Organization.
   *
   * @param request - The request {@link ContractApiCheckContractSignatureRequest}
   * @returns A Promise of CheckContractSignatureResponse
   */
  checkContractSignature: (
    request: Readonly<ContractApiCheckContractSignatureRequest>,
  ) => Promise<CheckContractSignatureResponse>
  protected pageOfListContractSignatures: (
    request?: Readonly<ContractApiListContractSignaturesRequest>,
  ) => Promise<ListContractSignaturesResponse>
  /**
   * List contract signatures for an Organization.
   *
   * @param request - The request {@link ContractApiListContractSignaturesRequest}
   * @returns A Promise of ListContractSignaturesResponse
   */
  listContractSignatures: (
    request?: Readonly<ContractApiListContractSignaturesRequest>,
  ) => Promise<ListContractSignaturesResponse> & {
    all: () => Promise<ContractSignature[]>
    [Symbol.asyncIterator]: () => AsyncGenerator<ContractSignature[], void, void>
  }
}
/**
 * IsoCode API.

IsoCode API. The IsoCode API list countries or subdivisions of a country.
 */
export declare class IsoCodeAPI extends ParentAPI {
  /**
   * List countries. List all countries from ISO 3166-1 alpha-2.
   *
   * @param request - The request {@link IsoCodeApiListCountriesRequest}
   * @returns A Promise of ListCountriesResponse
   */
  listCountries: (request?: Readonly<IsoCodeApiListCountriesRequest>) => Promise<ListCountriesResponse>
  /**
   * List all subdivisions for a country code. Method to list all subdivisions (from ISO 3166-2 alpha-2) for a country code.
   *
   * @param request - The request {@link IsoCodeApiListCountrySubdivisionsRequest}
   * @returns A Promise of ListCountrySubdivisionsResponse
   */
  listCountrySubdivisions: (
    request: Readonly<IsoCodeApiListCountrySubdivisionsRequest>,
  ) => Promise<ListCountrySubdivisionsResponse>
}
/**
 * Account API.

This API allows you to manage your Scaleway Projects.
 */
export declare class ProjectAPI extends ParentAPI {
  /**
   * Create a new Project for an Organization. Generate a new Project for an Organization, specifying its configuration including name and description.
   *
   * @param request - The request {@link ProjectApiCreateProjectRequest}
   * @returns A Promise of Project
   */
  createProject: (request: Readonly<ProjectApiCreateProjectRequest>) => Promise<Project>
  protected pageOfListProjects: (request?: Readonly<ProjectApiListProjectsRequest>) => Promise<ListProjectsResponse>
  /**
   * List all Projects of an Organization. List all Projects of an Organization. The response will include the total number of Projects as well as their associated Organizations, names, and IDs. Other information includes the creation and update date of the Project.
   *
   * @param request - The request {@link ProjectApiListProjectsRequest}
   * @returns A Promise of ListProjectsResponse
   */
  listProjects: (request?: Readonly<ProjectApiListProjectsRequest>) => Promise<ListProjectsResponse> & {
    all: () => Promise<Project[]>
    [Symbol.asyncIterator]: () => AsyncGenerator<Project[], void, void>
  }
  /**
   * Get an existing Project. Retrieve information about an existing Project, specified by its Project ID. Its full details, including ID, name and description, are returned in the response object.
   *
   * @param request - The request {@link ProjectApiGetProjectRequest}
   * @returns A Promise of Project
   */
  getProject: (request?: Readonly<ProjectApiGetProjectRequest>) => Promise<Project>
  /**
   * Delete an existing Project. Delete an existing Project, specified by its Project ID. The Project needs to be empty (meaning there are no resources left in it) to be deleted effectively. Note that deleting a Project is permanent, and cannot be undone.
   *
   * @param request - The request {@link ProjectApiDeleteProjectRequest}
   */
  deleteProject: (request?: Readonly<ProjectApiDeleteProjectRequest>) => Promise<void>
  /**
   * Update Project. Update the parameters of an existing Project, specified by its Project ID. These parameters include the name and description.
   *
   * @param request - The request {@link ProjectApiUpdateProjectRequest}
   * @returns A Promise of Project
   */
  updateProject: (request?: Readonly<ProjectApiUpdateProjectRequest>) => Promise<Project>
  /**
   * Set project use case. Set the project use case for a new or existing Project, specified by its Project ID. You can customize the use case, sub use case, and architecture type you want to use in the Project.
   *
   * @param request - The request {@link ProjectApiSetProjectQualificationRequest}
   * @returns A Promise of ProjectQualification
   */
  setProjectQualification: (
    request?: Readonly<ProjectApiSetProjectQualificationRequest>,
  ) => Promise<ProjectQualification>
}
/**
 * Account Rate Limit API.
 */
export declare class RateLimitAPI extends ParentAPI {
  /**
   * Observe rate limit status for KYC without consuming token.
   *
   * @param request - The request {@link RateLimitApiObserveKYCRateLimitRequest}
   * @returns A Promise of ObserveKYCRateLimitResponse
   */
  observeKYCRateLimit: (
    request?: Readonly<RateLimitApiObserveKYCRateLimitRequest>,
  ) => Promise<ObserveKYCRateLimitResponse>
}
/**
 * Unauthenticated API.
 */
export declare class UnauthenticatedAPI extends ParentAPI {
  computePasswordStrength: (
    request: Readonly<UnauthenticatedApiComputePasswordStrengthRequest>,
  ) => Promise<PasswordStrength>
}
/**
 * User API.

User API. The User API allows you to manage the personal data of a user.
 */
export declare class UserAPI extends ParentAPI {
  protected pageOfListMailingListSubscriptions: (
    request: Readonly<UserApiListMailingListSubscriptionsRequest>,
  ) => Promise<ListMailingListSubscriptionsResponse>

  /**
   * Set mailing list subscriptions.
   *
   * @param request - The request {@link UserApiSetMailingListSubscriptionsRequest}
   * @returns A Promise of SetMailingListSubscriptionsResponse
   */
  setMailingListSubscriptions: (
    request: Readonly<UserApiSetMailingListSubscriptionsRequest>,
  ) => Promise<SetMailingListSubscriptionsResponse>
  /**
   * Send a phone number for validation.
   *
   * @param request - The request {@link UserApiSendPhoneValidationRequest}
   * @returns A Promise of PhoneValidation
   */
  sendPhoneValidation: (request: Readonly<UserApiSendPhoneValidationRequest>) => Promise<PhoneValidation>
  /**
   * Confirm the phone number validation.
   *
   * @param request - The request {@link UserApiConfirmPhoneValidationRequest}
   */
  confirmPhoneValidation: (request: Readonly<UserApiConfirmPhoneValidationRequest>) => Promise<void>
  /**
   * Get User Preferences.
   *
   * @param request - The request {@link UserApiGetUserPreferencesRequest}
   * @returns A Promise of UserPreferences
   */
  getUserPreferences: (request: Readonly<UserApiGetUserPreferencesRequest>) => Promise<UserPreferences>
  /**
   * Update User Preferences.
   *
   * @param request - The request {@link UserApiUpdateUserPreferencesRequest}
   * @returns A Promise of UserPreferences
   */
  updateUserPreferences: (request: Readonly<UserApiUpdateUserPreferencesRequest>) => Promise<UserPreferences>
  /**
   * Create MFA OTP.
   *
   * @param request - The request {@link UserApiCreateMFAOTPRequest}
   * @returns A Promise of MFAOTP
   */
  createMFAOTP: (request: Readonly<UserApiCreateMFAOTPRequest>) => Promise<MFAOTP>
  /**
   * Delete MFA OTP.
   *
   * @param request - The request {@link UserApiDeleteMFAOTPRequest}
   */
  deleteMFAOTP: (request: Readonly<UserApiDeleteMFAOTPRequest>) => Promise<void>
  protected pageOfListMFAOTPs: (request: Readonly<UserApiListMFAOTPsRequest>) => Promise<ListMFAOTPsResponse>
  /**
   * List MFA OTPs.
   *
   * @param request - The request {@link UserApiListMFAOTPsRequest}
   * @returns A Promise of ListMFAOTPsResponse
   */
  listMFAOTPs: (request: Readonly<UserApiListMFAOTPsRequest>) => Promise<ListMFAOTPsResponse> & {
    all: () => Promise<MFAOTP[]>
    [Symbol.asyncIterator]: () => AsyncGenerator<MFAOTP[], void, void>
  }
  /**
   * Validate MFA OTP.
   *
   * @param request - The request {@link UserApiValidateMFAOTPRequest}
   * @returns A Promise of ValidateMFAOTPResponse
   */
  validateMFAOTP: (request: Readonly<UserApiValidateMFAOTPRequest>) => Promise<ValidateMFAOTPResponse>
  /**
   * Get user information. Get the user associated with the given ID.
   *
   * @param request - The request {@link UserApiGetUserRequest}
   * @returns A Promise of User
   */
  getUser: (request: Readonly<UserApiGetUserRequest>) => Promise<User>
  /**
   * Update user information. Patch the user associated with the given ID.
   *
   * @param request - The request {@link UserApiUpdateUserRequest}
   * @returns A Promise of User
   */
  updateUser: (request: Readonly<UserApiUpdateUserRequest>) => Promise<User>
  /**
   * Update user email. Update the user email associated with the given ID.
   *
   * @param request - The request {@link UserApiChangeUserEmailRequest}
   * @returns A Promise of ChangeUserEmailResponse
   */
  changeUserEmail: (request: Readonly<UserApiChangeUserEmailRequest>) => Promise<ChangeUserEmailResponse>
  /**
   * Update user password. Update the user password associated with the given ID.
   *
   * @param request - The request {@link UserApiChangeUserPasswordRequest}
   */
  changeUserPassword: (request: Readonly<UserApiChangeUserPasswordRequest>) => Promise<void>
  protected pageOfListUserOrganizations: (
    request: Readonly<UserApiListUserOrganizationsRequest>,
  ) => Promise<ListUserOrganizationsResponse>

  /**
   * Start WebAuthn Registration. Start a WebAuthn registration ceremony for the given user ID.
   *
   * @param request - The request {@link UserApiStartWebAuthnRegistrationRequest}
   * @returns A Promise of StartWebAuthnRegistrationResponse
   */
  startWebAuthnRegistration: (
    request: Readonly<UserApiStartWebAuthnRegistrationRequest>,
  ) => Promise<StartWebAuthnRegistrationResponse>
  /**
   * Finish WebAuthn Registration. Finish a WebAuthn registration ceremony for the given user and ceremony IDs.
   *
   * @param request - The request {@link UserApiFinishWebAuthnRegistrationRequest}
   * @returns A Promise of FinishWebAuthnRegistrationResponse
   */
  finishWebAuthnRegistration: (
    request: Readonly<UserApiFinishWebAuthnRegistrationRequest>,
  ) => Promise<FinishWebAuthnRegistrationResponse>
  protected pageOfListUserWebAuthnAuthenticators: (
    request: Readonly<UserApiListUserWebAuthnAuthenticatorsRequest>,
  ) => Promise<ListUserWebAuthnAuthenticatorsResponse>
  listUserWebAuthnAuthenticators: (
    request: Readonly<UserApiListUserWebAuthnAuthenticatorsRequest>,
  ) => Promise<ListUserWebAuthnAuthenticatorsResponse> & {
    all: () => Promise<WebAuthnAuthenticator[]>
    [Symbol.asyncIterator]: () => AsyncGenerator<WebAuthnAuthenticator[], void, void>
  }
  /**
   * Update WebAuthn Authenticator. Update the WebAuthn authenticator with the given ID.
   *
   * @param request - The request {@link UserApiUpdateWebAuthnAuthenticatorRequest}
   * @returns A Promise of WebAuthnAuthenticator
   */
  updateWebAuthnAuthenticator: (
    request: Readonly<UserApiUpdateWebAuthnAuthenticatorRequest>,
  ) => Promise<WebAuthnAuthenticator>
  /**
   * Delete WebAuthn Authenticator. Delete the WebAuthn authenticator with the given ID.
   *
   * @param request - The request {@link UserApiDeleteWebAuthnAuthenticatorRequest}
   */
  deleteWebAuthnAuthenticator: (request: Readonly<UserApiDeleteWebAuthnAuthenticatorRequest>) => Promise<void>
  /**
   * Start WebAuthn Authenticator Upgrade. Start a WebAuthn authenticator upgrade ceremony to add user verification (UV) to an existing authenticator.
   *
   * @param request - The request {@link UserApiStartWebAuthnAuthenticatorUpgradeRequest}
   * @returns A Promise of StartWebAuthnAuthenticatorUpgradeResponse
   */
  startWebAuthnAuthenticatorUpgrade: (
    request: Readonly<UserApiStartWebAuthnAuthenticatorUpgradeRequest>,
  ) => Promise<StartWebAuthnAuthenticatorUpgradeResponse>
  /**
   * Finish WebAuthn Authenticator Upgrade. Finish a WebAuthn authenticator upgrade ceremony. On success, the authenticator's UV status is upgraded.
   *
   * @param request - The request {@link UserApiFinishWebAuthnAuthenticatorUpgradeRequest}
   * @returns A Promise of FinishWebAuthnAuthenticatorUpgradeResponse
   */
  finishWebAuthnAuthenticatorUpgrade: (
    request: Readonly<UserApiFinishWebAuthnAuthenticatorUpgradeRequest>,
  ) => Promise<FinishWebAuthnAuthenticatorUpgradeResponse>
}
/**
 * Unauthenticated User API.

Unauthenticated user api. This API allows to manage a user without authentication.
 */
export declare class UnauthenticatedUserAPI extends ParentAPI {
  /**
   * Create a new user request.
   *
   * @param request - The request {@link UnauthenticatedUserApiCreateAccountRequest}
   * @returns A Promise of Account
   */
  createAccount: (request: Readonly<UnauthenticatedUserApiCreateAccountRequest>) => Promise<Account>
  /**
   * Send the validation email for the user request.
   *
   * @param request - The request {@link UnauthenticatedUserApiNotifyAccountRequest}
   */
  notifyAccount: (request: Readonly<UnauthenticatedUserApiNotifyAccountRequest>) => Promise<void>
  /**
   * Validate the email address of an existing user.
   *
   * @param request - The request {@link UnauthenticatedUserApiValidateEmailRequest}
   */
  validateEmail: (request: Readonly<UnauthenticatedUserApiValidateEmailRequest>) => Promise<void>
  /**
   * Validate the user request.
   *
   * @param request - The request {@link UnauthenticatedUserApiValidateAccountRequest}
   * @returns A Promise of ValidateAccountResponse
   */
  validateAccount: (request: Readonly<UnauthenticatedUserApiValidateAccountRequest>) => Promise<ValidateAccountResponse>
  /**
   * Send reset password link as an email.
   *
   * @param request - The request {@link UnauthenticatedUserApiSendResetPasswordEmailRequest}
   */
  sendResetPasswordEmail: (request: Readonly<UnauthenticatedUserApiSendResetPasswordEmailRequest>) => Promise<void>
  /**
   * Reset password.
   *
   * @param request - The request {@link UnauthenticatedUserApiResetPasswordRequest}
   */
  resetPassword: (request: Readonly<UnauthenticatedUserApiResetPasswordRequest>) => Promise<void>
  /**
   * Send a magic link for passwordless login.
   *
   * @param request - The request {@link UnauthenticatedUserApiInitiatePasswordlessLoginRequest}
   */
  initiatePasswordlessLogin: (
    request: Readonly<UnauthenticatedUserApiInitiatePasswordlessLoginRequest>,
  ) => Promise<void>
  /**
   * Initiate a OpenID connect login.
   *
   * @param request - The request {@link UnauthenticatedUserApiInitiateOIDCLoginRequest}
   * @returns A Promise of InitiateOIDCLoginResponse
   */
  initiateOIDCLogin: (
    request: Readonly<UnauthenticatedUserApiInitiateOIDCLoginRequest>,
  ) => Promise<InitiateOIDCLoginResponse>
  /**
   * Initiate an authentication code login attempt and send an email with the code to the user.
   *
   * @param request - The request {@link UnauthenticatedUserApiInitiateAuthenticationCodeLoginRequest}
   * @returns A Promise of InitiateAuthenticationCodeLoginResponse
   */
  initiateAuthenticationCodeLogin: (
    request: Readonly<UnauthenticatedUserApiInitiateAuthenticationCodeLoginRequest>,
  ) => Promise<InitiateAuthenticationCodeLoginResponse>
  /**
   * Validate an authentication code during a sign up workflow.
   *
   * @param request - The request {@link UnauthenticatedUserApiValidateAuthenticationCodeSignUpRequest}
   * @returns A Promise of ValidateAuthenticationCodeSignUpResponse
   */
  validateAuthenticationCodeSignUp: (
    request: Readonly<UnauthenticatedUserApiValidateAuthenticationCodeSignUpRequest>,
  ) => Promise<ValidateAuthenticationCodeSignUpResponse>
  /**
   * Resend an authentication code for sign in or sign up operation.
   *
   * @param request - The request {@link UnauthenticatedUserApiResendAuthenticationCodeRequest}
   */
  resendAuthenticationCode: (request: Readonly<UnauthenticatedUserApiResendAuthenticationCodeRequest>) => Promise<void>
  /**
   * Create a login session.
   *
   * @param request - The request {@link UnauthenticatedUserApiCreateLoginSessionRequest}
   * @returns A Promise of LoginSession
   */
  createLoginSession: (request?: Readonly<UnauthenticatedUserApiCreateLoginSessionRequest>) => Promise<LoginSession>
  /**
   * Log in with a session.
   *
   * @param request - The request {@link UnauthenticatedUserApiLogInRequest}
   * @returns A Promise of LogInResponse
   */
  logIn: (request: Readonly<UnauthenticatedUserApiLogInRequest>) => Promise<LogInResponse>
  /**
   * Log in to retrieve all organizations.
   *
   * @param request - The request {@link UnauthenticatedUserApiLogInOrganizationsRequest}
   * @returns A Promise of LogInOrganizationsResponse
   */
  logInOrganizations: (
    request: Readonly<UnauthenticatedUserApiLogInOrganizationsRequest>,
  ) => Promise<LogInOrganizationsResponse>
  /**
   * Validate email update.
   *
   * @param request - The request {@link UnauthenticatedUserApiValidateEmailUpdateRequest}
   */
  validateEmailUpdate: (request: Readonly<UnauthenticatedUserApiValidateEmailUpdateRequest>) => Promise<void>
  /**
   * Reject email update.
   *
   * @param request - The request {@link UnauthenticatedUserApiRejectEmailUpdateRequest}
   */
  rejectEmailUpdate: (request: Readonly<UnauthenticatedUserApiRejectEmailUpdateRequest>) => Promise<void>
  /**
   * Initiate an OpenID sign-up.
   *
   * @param request - The request {@link UnauthenticatedUserApiInitiateOIDCSignupRequest}
   * @returns A Promise of InitiateOIDCSignupResponse
   */
  initiateOIDCSignup: (
    request: Readonly<UnauthenticatedUserApiInitiateOIDCSignupRequest>,
  ) => Promise<InitiateOIDCSignupResponse>
  /**
   * Validate an OpenID connect during sign-up.
   *
   * @param request - The request {@link UnauthenticatedUserApiValidateOIDCSignupRequest}
   * @returns A Promise of ValidateOIDCSignupResponse
   */
  validateOIDCSignup: (
    request: Readonly<UnauthenticatedUserApiValidateOIDCSignupRequest>,
  ) => Promise<ValidateOIDCSignupResponse>
  /**
     * Start a WebAuthn authentication ceremony to use MFA for the LogIn API request.. The `login_session_id` field needs to be nullable for passkey flows without email, but its position in the URL path prevents this.
  During migration, provide the canary UUID `00000000-0000-0000-0000-000000000000` which will be treated as null.
     *
     * @param request - The request {@link UnauthenticatedUserApiStartWebAuthnAuthenticationRequest}
     * @returns A Promise of StartWebAuthnAuthenticationResponse
     */
  startWebAuthnAuthentication: (
    request: Readonly<UnauthenticatedUserApiStartWebAuthnAuthenticationRequest>,
  ) => Promise<StartWebAuthnAuthenticationResponse>
  /**
   * Finish a WebAuthn authentication ceremony and log in. Supports passkey authentication without email.. Finish a WebAuthn authentication ceremony and log in. Supports passkey authentication without email.
   *
   * @param request - The request {@link UnauthenticatedUserApiFinishWebAuthnAuthenticationRequest}
   * @returns A Promise of LogInOrganizationsResponse
   */
  finishWebAuthnAuthentication: (
    request: Readonly<UnauthenticatedUserApiFinishWebAuthnAuthenticationRequest>,
  ) => Promise<LogInOrganizationsResponse>
}
