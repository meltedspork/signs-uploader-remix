import { redirect } from '@remix-run/server-runtime';
import type { Algorithm, VerifyOptions } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import type { Auth0JwtAccessToken, Auth0JwtIdToken } from '~/modules/auth0-jwt.server';
import { auth0Client } from '~/modules/auth0-jwt.server';

import { logout } from '~/servers/session.server';


async function verifyBaseJwtToken(
  token: string,
  options: VerifyOptions
): Promise<Auth0JwtIdToken | Auth0JwtAccessToken> {
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

export async function verifyTokens(jwt: any) {
  try {
    console.log('verifyTokens: jwt', jwt);

    await verifyAccessToken(jwt);
    await verifyIdToken(jwt);

    return refreshAccessToken(jwt);
  } catch (err) {
    throw ('verifyTokens: ' + err);
  }
};

export async function verifyIdToken({ id_token: idToken }: any) {
  const verifyOpts: VerifyOptions = {
    audience: process.env.AUTH0_CLIENT_ID!,
    issuer: process.env.AUTH0_ISSUER!,
    algorithms: <Algorithm[]>(process.env.AUTH0_ALGORITHMS!.split(','))
  }

  try {
    const idTokenVerified: Auth0JwtIdToken = await verifyBaseJwtToken(idToken, verifyOpts);
    /*
    {
      nickname: string;
      name: string; //email
      picture: string;
      updated_at: string;
      iss: string;
      aud: string;
      iat: number; //1684036188,
      exp: number; // 1684072188,
      sub: string;
      sid: string;
    }
    */
    console.log('verifyIdToken: idTokenVerified:', idTokenVerified);
    return idTokenVerified;
  } catch (err) {
    throw (`verifyIdToken: ${err}`);
    // return err;
    // return redirect('/');
  }
}

export async function verifyAccessToken({ access_token: accessToken }: any) {
  const verifyOpts: VerifyOptions = {
    audience: [
      process.env.AUTH0_AUDIENCE!,
      "https://meltedspork.us.auth0.com/userinfo"
    ],
    issuer: process.env.AUTH0_ISSUER!,
    algorithms: <Algorithm[]>(process.env.AUTH0_ALGORITHMS!.split(','))
  }

  try {
    return await verifyBaseJwtToken(accessToken, verifyOpts);
  } catch (err) {
    throw ('verifyAccessToken: ' + err);
  }
}

export async function refreshAccessToken({ refresh_token }: any) {
  try {
    const result = await auth0Client({
      grant_type: 'refresh_token',
      refresh_token
    })
    console.log('result', result);
    return result;
  } catch (err) {
    return false;
  }
}