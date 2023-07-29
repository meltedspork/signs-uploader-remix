//const axios = require('axios');
import axios, { AxiosError } from 'axios';

export interface Auth0Jwt {
  access_token: string;
  expires_in: number;
  id_token: string;
  refresh_token: string;
  scope: string;
  token_type: string;
}

const AUTH0_ACCESS_TOKEN_DOMAIN: unique symbol = Symbol(process.env.AUTH0_ACCESS_TOKEN_DOMAIN);

export interface Auth0JwtAccessToken {
  [AUTH0_ACCESS_TOKEN_DOMAIN]: boolean;
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
): Promise<any> {
  try {
    const { data }: any = await axios({
      method: 'POST',
      url: `${process.env.AUTH0_DOMAIN}/oauth/token`,
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: new URLSearchParams({
        client_id: process.env.AUTH0_CLIENT_ID,
        client_secret: process.env.AUTH0_CLIENT_SECRET,
        ...searchParams
      })
    }).catch((error) => {
      return error.response;
    });

    console.log('auth0Client: data', data);
    if (data.error) {
      console.log('auth0Client: error');
      return Promise.reject(data);
    }
    return Promise.resolve(data);
  } catch (exception) {
    console.log('auth0Client: exception', exception);
    return Promise.reject(exception);
  }
}
