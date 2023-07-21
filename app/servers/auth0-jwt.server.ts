import { redirect } from '@remix-run/server-runtime';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import { auth0Client } from '~/modules/auth0-jwt.server';

import type { Algorithm, VerifyOptions } from 'jsonwebtoken';
import type {
  Auth0Jwt,
  Auth0JwtAccessToken,
  Auth0JwtIdToken,
  Auth0JwtRefreshToken
} from '~/modules/auth0-jwt.server';
import { logout } from '~/servers/session.server';


async function verifyBaseJwtToken(
  token: string,
  options: VerifyOptions
): Promise<any> {
  const client: jwksClient.JwksClient = jwksClient({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: process.env.AUTH0_JWKS_URI!
  });

  const getKey = async (header: any, callback: Function) => {
    const key: jwksClient.SigningKey = await client.getSigningKey(header.kid);
    callback(null, key.getPublicKey());
  }

  try {
    return new Promise((resolve, reject) => {
      jwt.verify(token, getKey, options, (err, decoded) => {
        if (err) {
          reject(err);
        }
        resolve(decoded);
      });
    });
  } catch(err) {
    return Promise.reject(err);
  }
}

export async function verifyJwtTokens(jwt: Auth0Jwt): Promise<{
  accessToken: Auth0JwtAccessToken,
  idToken: Auth0JwtIdToken
}> {
  try {
    console.log('verifyTokens: jwt', jwt);

    const accessToken: Auth0JwtAccessToken = await verifyAccessToken(jwt);
    const idToken: Auth0JwtIdToken = await verifyIdToken(jwt);
    return Promise.resolve({
      accessToken,
      idToken
    });
  } catch (err) {
    throw ('verifyTokens: ' + err);
  }
};

export async function verifyIdToken({ id_token: idToken }: Auth0Jwt): Promise<Auth0JwtIdToken> {
  const verifyOpts: VerifyOptions = {
    audience: process.env.AUTH0_CLIENT_ID!,
    issuer: process.env.AUTH0_ISSUER!,
    algorithms: <Algorithm[]>(process.env.AUTH0_ALGORITHMS!.split(','))
  }

  try {
    return verifyBaseJwtToken(idToken, verifyOpts);
  } catch (err) {
    throw ('verifyBaseJwtToken: ' + err);
    // return throw (`verifyIdToken: ${err}`);
    // return err;
    // return redirect('/');
  }
}

export async function verifyAccessToken({ access_token: accessToken }: Auth0Jwt): Promise<Auth0JwtAccessToken> {
  const verifyOpts: VerifyOptions = {
    audience: [
      process.env.AUTH0_AUDIENCE!,
      "https://meltedspork.us.auth0.com/userinfo"
    ],
    issuer: process.env.AUTH0_ISSUER!,
    algorithms: <Algorithm[]>(process.env.AUTH0_ALGORITHMS!.split(','))
  }

  try {
    return verifyBaseJwtToken(accessToken, verifyOpts);
  } catch (err) {
    throw ('verifyAccessToken: ' + err);
  }
}

export async function refreshAccessToken({ refresh_token }: Auth0JwtRefreshToken) {
  console.log('trying refreshAccessToken: refresh_token', refresh_token);
  try {
    const result = await auth0Client({
      grant_type: 'refresh_token',
      refresh_token
    });
    console.log('result', result);
    return result;
  } catch (err) {
    console.log('refreshAccessToken: err', err);
    return false;
  }
}