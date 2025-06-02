export interface OneTimeAccessToken {
  code: string;
  grant_type: string;
}

export interface TokenWithGrantTypeAndScope {
  grant_type: string;
  scope: string;
}

export interface TokenWithScope {
  scope: string;
}
