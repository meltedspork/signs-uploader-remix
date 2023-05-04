import { verify, Algorithm, VerifyOptions } from 'node-jsonwebtoken';
import jwksClient from 'jwks-rsa';

import { logout } from '~/session.server';

export const USER_JWT_KEY = 'userJwt';

export async function getJwt(request: Request) {
  const jwtVerifyOpts: VerifyOptions = {
    audience: process.env.AUTH0_CLIENT_AUDIENCE!,
    issuer: process.env.AUTH0_SERVER_ISSUER!,
    algorithms: <Algorithm[]>(process.env.AUTH0_SERVER_ALGORITHMS!.split(','))
  }
  const client: jwksClient.JwksClient = jwksClient({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: process.env.AUTH0_SERVER_JWKS_URI!
  });
  async function getKey(header: any) {
    const key: jwksClient.SigningKey = await client.getSigningKey(header.kid);
    return key.getPublicKey();
  }

  try {
    const jwtVerifed = verify('token', getKey, jwtVerifyOpts);
    console.log('jwt: ', jwtVerifed);
    return jwtVerifed
  } catch(err) {
    console.log('jwt NOOOOOOOOOOO: ', err);
    return request;// logout(request);
  }
}
