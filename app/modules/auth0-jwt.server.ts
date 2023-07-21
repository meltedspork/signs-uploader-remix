const axios = require('axios');

export interface Auth0Jwt {
  access_token: string;
  expires_in: number;
  id_token: string;
  refresh_token: string;
  scope: string;
  token_type: string;
}

export interface Auth0JwtAccessToken {
  'https://www.deafblind.dev/admin': boolean;
  iss: string;
  sub: string;
  aud: [string];
  iat: number;
  exp: number;
  azp: string;
  scope: string;
  permissions: [string];
}

export interface Auth0JwtIdToken {
  nickname: string;
  name: string; //email
  picture: string;
  updated_at: string;
  email: string;
  email_verified: boolean;
  iss: string;
  aud: string;
  iat: number;
  exp: number;
  sub: string;
  sid: string;
}

type GrantType = 'authorization_code' | 'refresh_token';

export interface Auth0JwtCode {
  grant_type: GrantType;
  code: string;
  redirect_uri: string;
}

export interface Auth0JwtRefreshToken {
  grant_type: GrantType;
  refresh_token: string;
}

export async function auth0Client(
  searchParams: Auth0JwtCode | Auth0JwtRefreshToken
): Promise<Auth0Jwt> {
  const options = {
    method: 'POST',
    url: `${process.env.AUTH0_DOMAIN!}/oauth/token`,
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: new URLSearchParams({
      client_id: process.env.AUTH0_CLIENT_ID!,
      client_secret: process.env.AUTH0_CLIENT_SECRET!,
      ...searchParams
    })
  };

  const result = await axios.request(options);
  console.log('auth0Client: result', result);
  return result;
}
