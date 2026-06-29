// eslint-disable-next-line no-abusive-eslint-disable
/* oxlint-disable */
import { API as ParentAPI } from '@scaleway/sdk-client'
import type {
  AddGroupMemberRequest,
  AddGroupMembersRequest,
  AddSamlCertificateRequest,
  APIKey,
  Application,
  ClonePolicyRequest,
  CommitLoginResponse,
  CreateAPIKeyRequest,
  CreateApplicationRequest,
  CreateGroupRequest,
  CreateJWTRequest,
  CreatePolicyRequest,
  CreateScimTokenRequest,
  CreateScimTokenResponse,
  CreateSSHKeyRequest,
  CreateUserMFAOTPRequest,
  CreateUserRequest,
  DeleteAPIKeyRequest,
  DeleteApplicationRequest,
  DeleteGroupRequest,
  DeleteJWTRequest,
  DeletePolicyRequest,
  DeleteSamlCertificateRequest,
  DeleteSamlRequest,
  DeleteScimRequest,
  DeleteScimTokenRequest,
  DeleteSSHKeyRequest,
  DeleteUserMFAOTPRequest,
  DeleteUserRequest,
  DeleteWebAuthnAuthenticatorRequest,
  EnableOrganizationSamlRequest,
  EnableOrganizationScimRequest,
  EncodedJWT,
  FinishUserWebAuthnRegistrationRequest,
  FinishUserWebAuthnRegistrationResponse,
  GetAPIKeyRequest,
  GetApplicationRequest,
  GetGroupRequest,
  GetJWTRequest,
  GetLogRequest,
  GetOrganizationRequest,
  GetOrganizationSamlRequest,
  GetOrganizationScimRequest,
  GetOrganizationSecuritySettingsRequest,
  GetPolicyRequest,
  GetSamlCertificateRequest,
  GetSSHKeyRequest,
  GetUserConnectionsRequest,
  GetUserConnectionsResponse,
  GetUserRequest,
  Group,
  InitiateOAuth2LoginResponse,
  InitiateSamlLoginResponse,
  InitiateUserConnectionRequest,
  InitiateUserConnectionResponse,
  JoinUserConnectionRequest,
  JWT,
  ListAPIKeysRequest,
  ListAPIKeysResponse,
  ListApplicationsRequest,
  ListApplicationsResponse,
  ListGracePeriodsRequest,
  ListGracePeriodsResponse,
  ListGroupsRequest,
  ListGroupsResponse,
  ListJWTsRequest,
  ListJWTsResponse,
  ListLogsRequest,
  ListLogsResponse,
  ListPermissionSetsRequest,
  ListPermissionSetsResponse,
  ListPoliciesRequest,
  ListPoliciesResponse,
  ListRulesRequest,
  ListRulesResponse,
  ListSamlCertificatesRequest,
  ListSamlCertificatesResponse,
  ListScimTokensRequest,
  ListScimTokensResponse,
  ListSSHKeysRequest,
  ListSSHKeysResponse,
  ListUsersRequest,
  ListUsersResponse,
  ListUserWebAuthnAuthenticatorsRequest,
  ListUserWebAuthnAuthenticatorsResponse,
  LockUserRequest,
  Log,
  Login,
  MFAOTP,
  Organization,
  OrganizationSecuritySettings,
  OrganizationSummary,
  ParseSamlMetadataRequest,
  ParseSamlMetadataResponse,
  Policy,
  RemoveGroupMemberRequest,
  RemoveUserConnectionRequest,
  Saml,
  SamlCertificate,
  Scim,
  SetGroupMembersRequest,
  SetOrganizationAliasRequest,
  SetRulesRequest,
  SetRulesResponse,
  SSHKey,
  StartLoginMFAWebAuthnResponse,
  StartUserWebAuthnRegistrationRequest,
  StartUserWebAuthnRegistrationResponse,
  UnauthenticatedApiCheckLoginMFAOTPRequest,
  UnauthenticatedApiCommitLoginRequest,
  UnauthenticatedApiCreateMagicCodeLoginRequest,
  UnauthenticatedApiCreateOAuth2LoginRequest,
  UnauthenticatedApiCreatePasswordLoginRequest,
  UnauthenticatedApiFinishLoginMFAWebAuthnRequest,
  UnauthenticatedApiGetSamlMetadataRequest,
  UnauthenticatedApiInitiateMagicCodeLoginRequest,
  UnauthenticatedApiInitiateOAuth2LoginRequest,
  UnauthenticatedApiInitiateSamlLoginRequest,
  UnauthenticatedApiRenewJWTRequest,
  UnauthenticatedApiSearchOrganizationRequest,
  UnauthenticatedApiStartLoginMFAWebAuthnRequest,
  UnlockUserRequest,
  UpdateAPIKeyRequest,
  UpdateApplicationRequest,
  UpdateGroupRequest,
  UpdateOrganizationLoginMethodsRequest,
  UpdateOrganizationSecuritySettingsRequest,
  UpdatePolicyRequest,
  UpdateSamlRequest,
  UpdateSSHKeyRequest,
  UpdateUserPasswordRequest,
  UpdateUserRequest,
  UpdateUserUsernameRequest,
  UpdateWebAuthnAuthenticatorRequest,
  User,
  ValidateUserMFAOTPRequest,
  ValidateUserMFAOTPResponse,
  WebAuthnAuthenticator,
} from './types'
/**
 * IAM API.

This API allows you to manage Identity and Access Management (IAM) across your Scaleway Organizations, Projects and resources.
 */
export declare class API extends ParentAPI {
  protected pageOfListSSHKeys: (request?: Readonly<ListSSHKeysRequest>) => Promise<ListSSHKeysResponse>
  /**
   * List SSH keys. List SSH keys. By default, the SSH keys listed are ordered by creation date in ascending order. This can be modified via the `order_by` field. You can define additional parameters for your query such as `organization_id`, `name`, `project_id` and `disabled`.
   *
   * @param request - The request {@link ListSSHKeysRequest}
   * @returns A Promise of ListSSHKeysResponse
   */
  listSSHKeys: (request?: Readonly<ListSSHKeysRequest>) => Promise<ListSSHKeysResponse> & {
    all: () => Promise<SSHKey[]>
    [Symbol.asyncIterator]: () => AsyncGenerator<SSHKey[], void, void>
  }
  /**
   * Create an SSH key. Add a new SSH key to a Scaleway Project. You must specify the `name`, `public_key` and `project_id`.
   *
   * @param request - The request {@link CreateSSHKeyRequest}
   * @returns A Promise of SSHKey
   */
  createSSHKey: (request: Readonly<CreateSSHKeyRequest>) => Promise<SSHKey>
  /**
   * Get an SSH key. Retrieve information about a given SSH key, specified by the `ssh_key_id` parameter. The SSH key's full details, including `id`, `name`, `public_key`, and `project_id` are returned in the response.
   *
   * @param request - The request {@link GetSSHKeyRequest}
   * @returns A Promise of SSHKey
   */
  getSSHKey: (request: Readonly<GetSSHKeyRequest>) => Promise<SSHKey>
  /**
   * Update an SSH key. Update the parameters of an SSH key, including `name` and `disable`.
   *
   * @param request - The request {@link UpdateSSHKeyRequest}
   * @returns A Promise of SSHKey
   */
  updateSSHKey: (request: Readonly<UpdateSSHKeyRequest>) => Promise<SSHKey>
  /**
   * Delete an SSH key. Delete a given SSH key, specified by the `ssh_key_id`. Deleting an SSH is permanent, and cannot be undone. Note that you might need to update any configurations that used the SSH key.
   *
   * @param request - The request {@link DeleteSSHKeyRequest}
   */
  deleteSSHKey: (request: Readonly<DeleteSSHKeyRequest>) => Promise<void>
  protected pageOfListUsers: (request?: Readonly<ListUsersRequest>) => Promise<ListUsersResponse>
  /**
   * List users of an Organization. List the users of an Organization. By default, the users listed are ordered by creation date in ascending order. This can be modified via the `order_by` field. You must define the `organization_id` in the query path of your request. You can also define additional parameters for your query such as `user_ids`.
   *
   * @param request - The request {@link ListUsersRequest}
   * @returns A Promise of ListUsersResponse
   */
  listUsers: (request?: Readonly<ListUsersRequest>) => Promise<ListUsersResponse> & {
    all: () => Promise<User[]>
    [Symbol.asyncIterator]: () => AsyncGenerator<User[], void, void>
  }
  /**
   * Get a given user. Retrieve information about a user, specified by the `user_id` parameter. The user's full details, including `id`, `email`, `organization_id`, `status` and `mfa` are returned in the response.
   *
   * @param request - The request {@link GetUserRequest}
   * @returns A Promise of User
   */
  getUser: (request: Readonly<GetUserRequest>) => Promise<User>
  /**
   * Update a user. Update the parameters of a user, including `tags`.
   *
   * @param request - The request {@link UpdateUserRequest}
   * @returns A Promise of User
   */
  updateUser: (request: Readonly<UpdateUserRequest>) => Promise<User>
  /**
   * Delete a guest user from an Organization. Remove a user from an Organization in which they are a guest. You must define the `user_id` in your request. Note that removing a user from an Organization automatically deletes their API keys, and any policies directly attached to them become orphaned.
   *
   * @param request - The request {@link DeleteUserRequest}
   */
  deleteUser: (request: Readonly<DeleteUserRequest>) => Promise<void>
  /**
   * Create a new user. Create a new user. You must define the `organization_id` in your request. If you are adding a member, enter the member's details. If you are adding a guest, you must define the `email` and not add the member attribute.
   *
   * @param request - The request {@link CreateUserRequest}
   * @returns A Promise of User
   */
  createUser: (request?: Readonly<CreateUserRequest>) => Promise<User>
  /**
   * Update an user's username.. Update an user's username.
   *
   * @param request - The request {@link UpdateUserUsernameRequest}
   * @returns A Promise of User
   */
  updateUserUsername: (request: Readonly<UpdateUserUsernameRequest>) => Promise<User>
  /**
   * Update an user's password.. Update an user's password.
   *
   * @param request - The request {@link UpdateUserPasswordRequest}
   * @returns A Promise of User
   */
  updateUserPassword: (request: Readonly<UpdateUserPasswordRequest>) => Promise<User>
  /**
   * Create a MFA OTP.. Create a MFA OTP.
   *
   * @param request - The request {@link CreateUserMFAOTPRequest}
   * @returns A Promise of MFAOTP
   */
  createUserMFAOTP: (request: Readonly<CreateUserMFAOTPRequest>) => Promise<MFAOTP>
  /**
   * Validate a MFA OTP.. Validate a MFA OTP.
   *
   * @param request - The request {@link ValidateUserMFAOTPRequest}
   * @returns A Promise of ValidateUserMFAOTPResponse
   */
  validateUserMFAOTP: (request: Readonly<ValidateUserMFAOTPRequest>) => Promise<ValidateUserMFAOTPResponse>
  /**
   * Delete a MFA OTP.. Delete a MFA OTP.
   *
   * @param request - The request {@link DeleteUserMFAOTPRequest}
   */
  deleteUserMFAOTP: (request: Readonly<DeleteUserMFAOTPRequest>) => Promise<void>
  /**
   * Lock a member. Lock a member. A locked member cannot log in or use API keys until the locked status is removed.
   *
   * @param request - The request {@link LockUserRequest}
   * @returns A Promise of User
   */
  lockUser: (request: Readonly<LockUserRequest>) => Promise<User>
  /**
   * Unlock a member.
   *
   * @param request - The request {@link UnlockUserRequest}
   * @returns A Promise of User
   */
  unlockUser: (request: Readonly<UnlockUserRequest>) => Promise<User>
  /**
   * List grace periods of a member. List the grace periods of a member.
   *
   * @param request - The request {@link ListGracePeriodsRequest}
   * @returns A Promise of ListGracePeriodsResponse
   */
  listGracePeriods: (request?: Readonly<ListGracePeriodsRequest>) => Promise<ListGracePeriodsResponse>
  getUserConnections: (request: Readonly<GetUserConnectionsRequest>) => Promise<GetUserConnectionsResponse>
  initiateUserConnection: (request: Readonly<InitiateUserConnectionRequest>) => Promise<InitiateUserConnectionResponse>
  joinUserConnection: (request: Readonly<JoinUserConnectionRequest>) => Promise<void>
  removeUserConnection: (request: Readonly<RemoveUserConnectionRequest>) => Promise<void>
  protected pageOfListApplications: (request?: Readonly<ListApplicationsRequest>) => Promise<ListApplicationsResponse>
  /**
   * List applications of an Organization. List the applications of an Organization. By default, the applications listed are ordered by creation date in ascending order. This can be modified via the `order_by` field. You must define the `organization_id` in the query path of your request. You can also define additional parameters for your query such as `application_ids`.
   *
   * @param request - The request {@link ListApplicationsRequest}
   * @returns A Promise of ListApplicationsResponse
   */
  listApplications: (request?: Readonly<ListApplicationsRequest>) => Promise<ListApplicationsResponse> & {
    all: () => Promise<Application[]>
    [Symbol.asyncIterator]: () => AsyncGenerator<Application[], void, void>
  }
  /**
   * Create a new application. Create a new application. You must define the `name` parameter in the request.
   *
   * @param request - The request {@link CreateApplicationRequest}
   * @returns A Promise of Application
   */
  createApplication: (request: Readonly<CreateApplicationRequest>) => Promise<Application>
  /**
   * Get a given application. Retrieve information about an application, specified by the `application_id` parameter. The application's full details, including `id`, `email`, `organization_id`, `status` and `two_factor_enabled` are returned in the response.
   *
   * @param request - The request {@link GetApplicationRequest}
   * @returns A Promise of Application
   */
  getApplication: (request: Readonly<GetApplicationRequest>) => Promise<Application>
  /**
   * Update an application. Update the parameters of an application, including `name` and `description`.
   *
   * @param request - The request {@link UpdateApplicationRequest}
   * @returns A Promise of Application
   */
  updateApplication: (request: Readonly<UpdateApplicationRequest>) => Promise<Application>
  /**
   * Delete an application. Delete an application. Note that this action is irreversible and will automatically delete the application's API keys. Policies attached to users and applications via this group will no longer apply.
   *
   * @param request - The request {@link DeleteApplicationRequest}
   */
  deleteApplication: (request: Readonly<DeleteApplicationRequest>) => Promise<void>
  protected pageOfListGroups: (request?: Readonly<ListGroupsRequest>) => Promise<ListGroupsResponse>
  /**
   * List groups. List groups. By default, the groups listed are ordered by creation date in ascending order. This can be modified via the `order_by` field. You can define additional parameters to filter your query. Use `user_ids` or `application_ids` to list all groups certain users or applications belong to.
   *
   * @param request - The request {@link ListGroupsRequest}
   * @returns A Promise of ListGroupsResponse
   */
  listGroups: (request?: Readonly<ListGroupsRequest>) => Promise<ListGroupsResponse> & {
    all: () => Promise<Group[]>
    [Symbol.asyncIterator]: () => AsyncGenerator<Group[], void, void>
  }
  /**
   * Create a group. Create a new group. You must define the `name` and `organization_id` parameters in the request.
   *
   * @param request - The request {@link CreateGroupRequest}
   * @returns A Promise of Group
   */
  createGroup: (request: Readonly<CreateGroupRequest>) => Promise<Group>
  /**
   * Get a group. Retrieve information about a given group, specified by the `group_id` parameter. The group's full details, including `user_ids` and `application_ids` are returned in the response.
   *
   * @param request - The request {@link GetGroupRequest}
   * @returns A Promise of Group
   */
  getGroup: (request: Readonly<GetGroupRequest>) => Promise<Group>
  /**
   * Update a group. Update the parameters of group, including `name` and `description`.
   *
   * @param request - The request {@link UpdateGroupRequest}
   * @returns A Promise of Group
   */
  updateGroup: (request: Readonly<UpdateGroupRequest>) => Promise<Group>
  /**
   * Overwrite users and applications of a group. Overwrite users and applications configuration in a group. Any information that you add using this command will overwrite the previous configuration.
   *
   * @param request - The request {@link SetGroupMembersRequest}
   * @returns A Promise of Group
   */
  setGroupMembers: (request: Readonly<SetGroupMembersRequest>) => Promise<Group>
  /**
   * Add a user or an application to a group. Add a user or an application to a group. You can specify a `user_id` and `application_id` in the body of your request. Note that you can only add one of each per request.
   *
   * @param request - The request {@link AddGroupMemberRequest}
   * @returns A Promise of Group
   */
  addGroupMember: (request: Readonly<AddGroupMemberRequest>) => Promise<Group>
  /**
   * Add multiple users and applications to a group. Add multiple users and applications to a group in a single call. You can specify an array of `user_id`s and `application_id`s. Note that any existing users and applications in the group will remain. To add new users/applications and delete pre-existing ones, use the [Overwrite users and applications of a group](#path-groups-overwrite-users-and-applications-of-a-group) method.
   *
   * @param request - The request {@link AddGroupMembersRequest}
   * @returns A Promise of Group
   */
  addGroupMembers: (request: Readonly<AddGroupMembersRequest>) => Promise<Group>
  /**
   * Remove a user or an application from a group. Remove a user or an application from a group. You can specify a `user_id` and `application_id` in the body of your request. Note that you can only remove one of each per request. Removing a user from a group means that any permissions given to them via the group (i.e. from an attached policy) will no longer apply. Be sure you want to remove these permissions from the user before proceeding.
   *
   * @param request - The request {@link RemoveGroupMemberRequest}
   * @returns A Promise of Group
   */
  removeGroupMember: (request: Readonly<RemoveGroupMemberRequest>) => Promise<Group>
  /**
   * Delete a group. Delete a group. Note that this action is irreversible and could delete permissions for group members. Policies attached to users and applications via this group will no longer apply.
   *
   * @param request - The request {@link DeleteGroupRequest}
   */
  deleteGroup: (request: Readonly<DeleteGroupRequest>) => Promise<void>
  protected pageOfListPolicies: (request?: Readonly<ListPoliciesRequest>) => Promise<ListPoliciesResponse>
  /**
   * List policies of an Organization. List the policies of an Organization. By default, the policies listed are ordered by creation date in ascending order. This can be modified via the `order_by` field. You must define the `organization_id` in the query path of your request. You can also define additional parameters to filter your query, such as `user_ids`, `groups_ids`, `application_ids`, and `policy_name`.
   *
   * @param request - The request {@link ListPoliciesRequest}
   * @returns A Promise of ListPoliciesResponse
   */
  listPolicies: (request?: Readonly<ListPoliciesRequest>) => Promise<ListPoliciesResponse> & {
    all: () => Promise<Policy[]>
    [Symbol.asyncIterator]: () => AsyncGenerator<Policy[], void, void>
  }
  /**
   * Create a new policy. Create a new application. You must define the `name` parameter in the request. You can specify parameters such as `user_id`, `groups_id`, `application_id`, `no_principal`, `rules` and its child attributes.
   *
   * @param request - The request {@link CreatePolicyRequest}
   * @returns A Promise of Policy
   */
  createPolicy: (request: Readonly<CreatePolicyRequest>) => Promise<Policy>
  /**
   * Get an existing policy. Retrieve information about a policy, specified by the `policy_id` parameter. The policy's full details, including `id`, `name`, `organization_id`, `nb_rules` and `nb_scopes`, `nb_permission_sets` are returned in the response.
   *
   * @param request - The request {@link GetPolicyRequest}
   * @returns A Promise of Policy
   */
  getPolicy: (request: Readonly<GetPolicyRequest>) => Promise<Policy>
  /**
   * Update an existing policy. Update the parameters of a policy, including `name`, `description`, `user_id`, `group_id`, `application_id` and `no_principal`.
   *
   * @param request - The request {@link UpdatePolicyRequest}
   * @returns A Promise of Policy
   */
  updatePolicy: (request: Readonly<UpdatePolicyRequest>) => Promise<Policy>
  /**
   * Delete a policy. Delete a policy. You must define specify the `policy_id` parameter in your request. Note that when deleting a policy, all permissions it gives to its principal (user, group or application) will be revoked.
   *
   * @param request - The request {@link DeletePolicyRequest}
   */
  deletePolicy: (request: Readonly<DeletePolicyRequest>) => Promise<void>
  /**
   * Clone a policy. Clone a policy. You must define specify the `policy_id` parameter in your request.
   *
   * @param request - The request {@link ClonePolicyRequest}
   * @returns A Promise of Policy
   */
  clonePolicy: (request: Readonly<ClonePolicyRequest>) => Promise<Policy>
  /**
   * Set rules of a given policy. Overwrite the rules of a given policy. Any information that you add using this command will overwrite the previous configuration. If you include some of the rules you already had in your previous configuration in your new one, but you change their order, the new order of display will apply. While policy rules are ordered, they have no impact on the access logic of IAM because rules are allow-only.
   *
   * @param request - The request {@link SetRulesRequest}
   * @returns A Promise of SetRulesResponse
   */
  setRules: (request: Readonly<SetRulesRequest>) => Promise<SetRulesResponse>
  protected pageOfListRules: (request: Readonly<ListRulesRequest>) => Promise<ListRulesResponse>

  protected pageOfListPermissionSets: (
    request?: Readonly<ListPermissionSetsRequest>,
  ) => Promise<ListPermissionSetsResponse>

  protected pageOfListAPIKeys: (request?: Readonly<ListAPIKeysRequest>) => Promise<ListAPIKeysResponse>
  /**
   * List API keys. List API keys. By default, the API keys listed are ordered by creation date in ascending order. This can be modified via the `order_by` field. You can define additional parameters for your query such as `editable`, `expired`, `access_key` and `bearer_id`.
   *
   * @param request - The request {@link ListAPIKeysRequest}
   * @returns A Promise of ListAPIKeysResponse
   */
  listAPIKeys: (request?: Readonly<ListAPIKeysRequest>) => Promise<ListAPIKeysResponse> & {
    all: () => Promise<APIKey[]>
    [Symbol.asyncIterator]: () => AsyncGenerator<APIKey[], void, void>
  }
  /**
   * Create an API key. Create an API key. You must specify the `application_id` or the `user_id` and the description. You can also specify the `default_project_id`, which is the Project ID of your preferred Project, to use with Object Storage. The `access_key` and `secret_key` values are returned in the response. Note that the secret key is only shown once. Make sure that you copy and store both keys somewhere safe.
   *
   * @param request - The request {@link CreateAPIKeyRequest}
   * @returns A Promise of APIKey
   */
  createAPIKey: (request: Readonly<CreateAPIKeyRequest>) => Promise<APIKey>
  /**
   * Get an API key. Retrieve information about an API key, specified by the `access_key` parameter. The API key's details, including either the `user_id` or `application_id` of its bearer are returned in the response. Note that the string value for the `secret_key` is nullable, and therefore is not displayed in the response. The `secret_key` value is only displayed upon API key creation.
   *
   * @param request - The request {@link GetAPIKeyRequest}
   * @returns A Promise of APIKey
   */
  getAPIKey: (request: Readonly<GetAPIKeyRequest>) => Promise<APIKey>
  /**
   * Update an API key. Update the parameters of an API key, including `default_project_id` and `description`.
   *
   * @param request - The request {@link UpdateAPIKeyRequest}
   * @returns A Promise of APIKey
   */
  updateAPIKey: (request: Readonly<UpdateAPIKeyRequest>) => Promise<APIKey>
  /**
   * Delete an API key. Delete an API key. Note that this action is irreversible and cannot be undone. Make sure you update any configurations using the API keys you delete.
   *
   * @param request - The request {@link DeleteAPIKeyRequest}
   */
  deleteAPIKey: (request: Readonly<DeleteAPIKeyRequest>) => Promise<void>
  protected pageOfListJWTs: (request: Readonly<ListJWTsRequest>) => Promise<ListJWTsResponse>
  /**
   * List JWTs.
   *
   * @param request - The request {@link ListJWTsRequest}
   * @returns A Promise of ListJWTsResponse
   */
  listJWTs: (request: Readonly<ListJWTsRequest>) => Promise<ListJWTsResponse> & {
    all: () => Promise<JWT[]>
    [Symbol.asyncIterator]: () => AsyncGenerator<JWT[], void, void>
  }
  /**
   * Create a JWT.
   *
   * @param request - The request {@link CreateJWTRequest}
   * @returns A Promise of EncodedJWT
   */
  createJWT: (request: Readonly<CreateJWTRequest>) => Promise<EncodedJWT>
  /**
   * Get a JWT.
   *
   * @param request - The request {@link GetJWTRequest}
   * @returns A Promise of JWT
   */
  getJWT: (request: Readonly<GetJWTRequest>) => Promise<JWT>
  /**
   * Delete a JWT.
   *
   * @param request - The request {@link DeleteJWTRequest}
   */
  deleteJWT: (request: Readonly<DeleteJWTRequest>) => Promise<void>
  protected pageOfListLogs: (request?: Readonly<ListLogsRequest>) => Promise<ListLogsResponse>
  /**
   * List logs. List logs available for given Organization. You must define the `organization_id` in the query path of your request.
   *
   * @param request - The request {@link ListLogsRequest}
   * @returns A Promise of ListLogsResponse
   */
  listLogs: (request?: Readonly<ListLogsRequest>) => Promise<ListLogsResponse> & {
    all: () => Promise<Log[]>
    [Symbol.asyncIterator]: () => AsyncGenerator<Log[], void, void>
  }
  /**
   * Get a log. Retrieve information about a log, specified by the `log_id` parameter. The log's full details, including `id`, `ip`, `user_agent`, `action`, `bearer_id`, `resource_type` and `resource_id` are returned in the response.
   *
   * @param request - The request {@link GetLogRequest}
   * @returns A Promise of Log
   */
  getLog: (request: Readonly<GetLogRequest>) => Promise<Log>
  /**
   * Get security settings of an Organization. Retrieve information about the security settings of an Organization, specified by the `organization_id` parameter.
   *
   * @param request - The request {@link GetOrganizationSecuritySettingsRequest}
   * @returns A Promise of OrganizationSecuritySettings
   */
  getOrganizationSecuritySettings: (
    request?: Readonly<GetOrganizationSecuritySettingsRequest>,
  ) => Promise<OrganizationSecuritySettings>
  /**
   * Update the security settings of an Organization.
   *
   * @param request - The request {@link UpdateOrganizationSecuritySettingsRequest}
   * @returns A Promise of OrganizationSecuritySettings
   */
  updateOrganizationSecuritySettings: (
    request?: Readonly<UpdateOrganizationSecuritySettingsRequest>,
  ) => Promise<OrganizationSecuritySettings>
  /**
   * Set your Organization's alias.. This will fail if an alias has already been defined. Please contact support if you need to change your Organization's alias.
   *
   * @param request - The request {@link SetOrganizationAliasRequest}
   * @returns A Promise of Organization
   */
  setOrganizationAlias: (request: Readonly<SetOrganizationAliasRequest>) => Promise<Organization>
  /**
   * Get your Organization's IAM information.
   *
   * @param request - The request {@link GetOrganizationRequest}
   * @returns A Promise of Organization
   */
  getOrganization: (request?: Readonly<GetOrganizationRequest>) => Promise<Organization>
  /**
   * Set your Organization's allowed login methods.. Set your Organization's allowed login methods.
   *
   * @param request - The request {@link UpdateOrganizationLoginMethodsRequest}
   * @returns A Promise of Organization
   */
  updateOrganizationLoginMethods: (request?: Readonly<UpdateOrganizationLoginMethodsRequest>) => Promise<Organization>
  /**
   * Get SAML Identity Provider configuration of an Organization.
   *
   * @param request - The request {@link GetOrganizationSamlRequest}
   * @returns A Promise of Saml
   */
  getOrganizationSaml: (request?: Readonly<GetOrganizationSamlRequest>) => Promise<Saml>
  /**
   * Enable SAML Identity Provider for an Organization.
   *
   * @param request - The request {@link EnableOrganizationSamlRequest}
   * @returns A Promise of Saml
   */
  enableOrganizationSaml: (request?: Readonly<EnableOrganizationSamlRequest>) => Promise<Saml>
  /**
   * Update SAML Identity Provider configuration.
   *
   * @param request - The request {@link UpdateSamlRequest}
   * @returns A Promise of Saml
   */
  updateSaml: (request: Readonly<UpdateSamlRequest>) => Promise<Saml>
  /**
   * Disable SAML Identity Provider for an Organization.
   *
   * @param request - The request {@link DeleteSamlRequest}
   */
  deleteSaml: (request: Readonly<DeleteSamlRequest>) => Promise<void>
  /**
   * Parse SAML xml metadata file.
   *
   * @param request - The request {@link ParseSamlMetadataRequest}
   * @returns A Promise of ParseSamlMetadataResponse
   */
  parseSamlMetadata: (request: Readonly<ParseSamlMetadataRequest>) => Promise<ParseSamlMetadataResponse>
  /**
   * List SAML certificates.
   *
   * @param request - The request {@link ListSamlCertificatesRequest}
   * @returns A Promise of ListSamlCertificatesResponse
   */
  listSamlCertificates: (request: Readonly<ListSamlCertificatesRequest>) => Promise<ListSamlCertificatesResponse>
  /**
   * Add a SAML certificate.
   *
   * @param request - The request {@link AddSamlCertificateRequest}
   * @returns A Promise of SamlCertificate
   */
  addSamlCertificate: (request: Readonly<AddSamlCertificateRequest>) => Promise<SamlCertificate>
  /**
   * Get a SAML certificate.
   *
   * @param request - The request {@link GetSamlCertificateRequest}
   * @returns A Promise of SamlCertificate
   */
  getSamlCertificate: (request: Readonly<GetSamlCertificateRequest>) => Promise<SamlCertificate>
  /**
   * Delete a SAML certificate.
   *
   * @param request - The request {@link DeleteSamlCertificateRequest}
   */
  deleteSamlCertificate: (request: Readonly<DeleteSamlCertificateRequest>) => Promise<void>
  /**
   * Get SCIM configuration of an Organization.
   *
   * @param request - The request {@link GetOrganizationScimRequest}
   * @returns A Promise of Scim
   */
  getOrganizationScim: (request?: Readonly<GetOrganizationScimRequest>) => Promise<Scim>
  /**
   * Enable SCIM for an Organization.
   *
   * @param request - The request {@link EnableOrganizationScimRequest}
   * @returns A Promise of Scim
   */
  enableOrganizationScim: (request?: Readonly<EnableOrganizationScimRequest>) => Promise<Scim>
  /**
   * Disable SCIM for an Organization.
   *
   * @param request - The request {@link DeleteScimRequest}
   */
  deleteScim: (request: Readonly<DeleteScimRequest>) => Promise<void>
  protected pageOfListScimTokens: (request: Readonly<ListScimTokensRequest>) => Promise<ListScimTokensResponse>
  /**
   * Create a SCIM token.
   *
   * @param request - The request {@link CreateScimTokenRequest}
   * @returns A Promise of CreateScimTokenResponse
   */
  createScimToken: (request: Readonly<CreateScimTokenRequest>) => Promise<CreateScimTokenResponse>
  /**
   * Delete a SCIM token.
   *
   * @param request - The request {@link DeleteScimTokenRequest}
   */
  deleteScimToken: (request: Readonly<DeleteScimTokenRequest>) => Promise<void>
  /**
   * Start registering a WebAuthn authenticator.
   *
   * @param request - The request {@link StartUserWebAuthnRegistrationRequest}
   * @returns A Promise of StartUserWebAuthnRegistrationResponse
   */
  startUserWebAuthnRegistration: (
    request: Readonly<StartUserWebAuthnRegistrationRequest>,
  ) => Promise<StartUserWebAuthnRegistrationResponse>
  /**
   * Complete a WebAuthen authenticator registration.
   *
   * @param request - The request {@link FinishUserWebAuthnRegistrationRequest}
   * @returns A Promise of FinishUserWebAuthnRegistrationResponse
   */
  finishUserWebAuthnRegistration: (
    request: Readonly<FinishUserWebAuthnRegistrationRequest>,
  ) => Promise<FinishUserWebAuthnRegistrationResponse>
  protected pageOfListUserWebAuthnAuthenticators: (
    request: Readonly<ListUserWebAuthnAuthenticatorsRequest>,
  ) => Promise<ListUserWebAuthnAuthenticatorsResponse>
  /**
   * List all of a user's WebAuthn Authenticators.
   *
   * @param request - The request {@link ListUserWebAuthnAuthenticatorsRequest}
   * @returns A Promise of ListUserWebAuthnAuthenticatorsResponse
   */
  listUserWebAuthnAuthenticators: (
    request: Readonly<ListUserWebAuthnAuthenticatorsRequest>,
  ) => Promise<ListUserWebAuthnAuthenticatorsResponse> & {
    all: () => Promise<WebAuthnAuthenticator[]>
    [Symbol.asyncIterator]: () => AsyncGenerator<WebAuthnAuthenticator[], void, void>
  }
  /**
   * Update a WebAuthn authenticator.
   *
   * @param request - The request {@link UpdateWebAuthnAuthenticatorRequest}
   * @returns A Promise of WebAuthnAuthenticator
   */
  updateWebAuthnAuthenticator: (request: Readonly<UpdateWebAuthnAuthenticatorRequest>) => Promise<WebAuthnAuthenticator>
  /**
   * Delete a WebAuthn authenticator.
   *
   * @param request - The request {@link DeleteWebAuthnAuthenticatorRequest}
   */
  deleteWebAuthnAuthenticator: (request: Readonly<DeleteWebAuthnAuthenticatorRequest>) => Promise<void>
}
/**
 * Unauthenticated API.
 */
export declare class UnauthenticatedAPI extends ParentAPI {
  /**
   * Renew a JWT.
   *
   * @param request - The request {@link UnauthenticatedApiRenewJWTRequest}
   * @returns A Promise of EncodedJWT
   */
  renewJWT: (request: Readonly<UnauthenticatedApiRenewJWTRequest>) => Promise<EncodedJWT>
  /**
   * Create a Login object via Password authentication.
   *
   * @param request - The request {@link UnauthenticatedApiCreatePasswordLoginRequest}
   * @returns A Promise of Login
   */
  createPasswordLogin: (request: Readonly<UnauthenticatedApiCreatePasswordLoginRequest>) => Promise<Login>
  /**
   * Initiate a Magic Code login attempt and send an email with the code to the user.
   *
   * @param request - The request {@link UnauthenticatedApiInitiateMagicCodeLoginRequest}
   */
  initiateMagicCodeLogin: (request: Readonly<UnauthenticatedApiInitiateMagicCodeLoginRequest>) => Promise<void>
  /**
   * Create a Login object via Magic Code authentication.
   *
   * @param request - The request {@link UnauthenticatedApiCreateMagicCodeLoginRequest}
   * @returns A Promise of Login
   */
  createMagicCodeLogin: (request: Readonly<UnauthenticatedApiCreateMagicCodeLoginRequest>) => Promise<Login>
  initiateOAuth2Login: (
    request: Readonly<UnauthenticatedApiInitiateOAuth2LoginRequest>,
  ) => Promise<InitiateOAuth2LoginResponse>
  createOAuth2Login: (request: Readonly<UnauthenticatedApiCreateOAuth2LoginRequest>) => Promise<Login>
  /**
   * Initiate a SAML login attempt.
   *
   * @param request - The request {@link UnauthenticatedApiInitiateSamlLoginRequest}
   * @returns A Promise of InitiateSamlLoginResponse
   */
  initiateSamlLogin: (
    request: Readonly<UnauthenticatedApiInitiateSamlLoginRequest>,
  ) => Promise<InitiateSamlLoginResponse>
  /**
   * Create a Login object via SAML authentication.
   *
   * @param request - The request {@link unknown}
   * @returns A Promise of unknown
   */
  createSamlLogin: (request?: Readonly<unknown>) => Promise<unknown>
  /**
   * Check MFA OTP for this login.
   *
   * @param request - The request {@link UnauthenticatedApiCheckLoginMFAOTPRequest}
   */
  checkLoginMFAOTP: (request: Readonly<UnauthenticatedApiCheckLoginMFAOTPRequest>) => Promise<void>
  /**
   * Start a MFA Webauthn ceremony on this login.
   *
   * @param request - The request {@link UnauthenticatedApiStartLoginMFAWebAuthnRequest}
   * @returns A Promise of StartLoginMFAWebAuthnResponse
   */
  startLoginMFAWebAuthn: (
    request: Readonly<UnauthenticatedApiStartLoginMFAWebAuthnRequest>,
  ) => Promise<StartLoginMFAWebAuthnResponse>
  /**
   * Finish a MFA Webauthn ceremony on this login.
   *
   * @param request - The request {@link UnauthenticatedApiFinishLoginMFAWebAuthnRequest}
   */
  finishLoginMFAWebAuthn: (request: Readonly<UnauthenticatedApiFinishLoginMFAWebAuthnRequest>) => Promise<void>
  /**
   * Finalize a login attempt.
   *
   * @param request - The request {@link UnauthenticatedApiCommitLoginRequest}
   * @returns A Promise of CommitLoginResponse
   */
  commitLogin: (request: Readonly<UnauthenticatedApiCommitLoginRequest>) => Promise<CommitLoginResponse>
  /**
   * Search for an organization.
   *
   * @param request - The request {@link UnauthenticatedApiSearchOrganizationRequest}
   * @returns A Promise of OrganizationSummary
   */
  searchOrganization: (request?: Readonly<UnauthenticatedApiSearchOrganizationRequest>) => Promise<OrganizationSummary>
  /**
   * Get the SAML metadata XML file for a given SAML ID.
   *
   * @param request - The request {@link UnauthenticatedApiGetSamlMetadataRequest}
   * @returns A Promise of Blob
   */
  getSamlMetadata: (request: Readonly<UnauthenticatedApiGetSamlMetadataRequest>) => Promise<Blob>
}
