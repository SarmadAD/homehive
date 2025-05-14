export interface OneTimeAccessToken {
  code: string;
  grant_type: string;
}

export interface CreateUserToken {
  grant_type: string;
  scope: string;
}
