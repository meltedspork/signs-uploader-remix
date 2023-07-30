import { SessionData, TypedResponse, redirect } from '@remix-run/node';
import { TokenExpiredError } from 'jsonwebtoken';

import invariant from 'tiny-invariant';
import { getUserById } from '~/models/user.server';
import {
  refreshAccessToken,
  verifyIdToken,
  verifyAccessToken,
  verifyJwtTokens
} from '~/servers/auth0-jwt.server';
import { idTokenSerialized } from '~/modules/user.module';
import firebaseCookieSessionStorage from '~/servers/firebase-cookie-session-storage.server';

import { LOGOUT_REDIRECT_URL, ROOT_REDIRECT_URL } from '~/constants';

import type { Users } from '~/models/user.server';
import type {
  Auth0Jwt,
  Auth0JwtAccessToken,
  Auth0JwtIdToken
} from '~/modules/auth0-jwt.module';
import type { UserSession } from '~/modules/session.module';

invariant(process.env.SESSION_SECRET, 'SESSION_SECRET must be set');

export const sessionStorage = firebaseCookieSessionStorage({
  cookie: {
    name: process.env.SESSION_NAME,
    httpOnly: true,
    path: ROOT_REDIRECT_URL,
    sameSite: 'lax',
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === 'production',
  }
});

const SESSION_USER_ID_KEY = '__userId';
const SESSION_JWT_TOKEN_KEY = '__jwtToken';

export async function getSession(request: Request) {
  const cookie = request.headers.get('Cookie');
  return sessionStorage.getSession(cookie);
}

export async function getUserId(request: Request): Promise<User['id'] | undefined> {
  const session = await getSession(request);
  const jwtToken = await session.get(SESSION_JWT_TOKEN_KEY);

  try {
    const { sub }: Auth0JwtIdToken = await verifyIdToken(jwtToken);
    console.log('getUserId: sub', sub);
    return sub;
  } catch (e) {
    if (!!jwtToken && (new URL(request.url).pathname !== ROOT_REDIRECT_URL)) {
      throw await logout(request);
    }
  }
}

export async function getUser(request: Request, refreshedAccessToken: Auth0Jwt | null = null): Promise<UserSession> {
  const notAuthenticatedUserData: Promise<UserSession> = Promise.resolve({
    userData: null,
    isAuthenticated: false
  });

  const hasRefreshAccessToken = !!refreshedAccessToken;

  try {
    const session: SessionData = await getSession(request);
    const jwtToken: Auth0Jwt = hasRefreshAccessToken ? refreshedAccessToken : await session.get(SESSION_JWT_TOKEN_KEY);

    // const userId = await getUserId(request);
    // console.log('!!!!!userId', userId);
    // if (userId === undefined) return null;
    console.log('!!!!!------!!!!!!!');
    console.log('jwtToken: ', jwtToken);
    // const user = await getUserById(userId);
    // console.log('!!!!!user', user);
    const user = true;

    if (!!user && !!jwtToken) {
      const { idToken } = await verifyJwtTokens(jwtToken);

     // const user = await getUserBySub(idToken.sub);

      if (idToken) {
        return Promise.resolve({
          userData: idTokenSerialized(idToken),
          isAuthenticated: true
        });
      }
    };

    return notAuthenticatedUserData;
  } catch (exception) {
    if (exception instanceof TokenExpiredError) {
      console.log('getUser: TokenExpiredError');
      if (!hasRefreshAccessToken) {
        // NOTE: we only want to try refresh token
        return await updateUserSession(request);
      }
    }
    console.log('getUser: exception');
    throw redirect(LOGOUT_REDIRECT_URL);
  }
}

export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const userId = await getUserId(request);
  // if (!userId) {
  //   const searchParams = new URLSearchParams([['redirectTo', redirectTo]]);
  //   throw redirect(`/login?${searchParams}`);
  // }
  return userId;
}

export async function requireUser(request: Request) {
  const userId = await requireUserId(request);

  const user = await getUserById(userId);
  if (user) return user;

  throw redirect(LOGOUT_REDIRECT_URL);
}

export async function createUserSession({
  request,
  redirectTo,
  userJwt,
  userId,
}: {
  request: Request;
  redirectTo: string;
  userJwt: Auth0Jwt;
  userId: string;
}) {
  const session = await getSession(request);

  session.set(SESSION_USER_ID_KEY, userId);
  session.set(SESSION_JWT_TOKEN_KEY, userJwt);
  const newCookieSession = await sessionStorage.commitSession(session, {
    maxAge: 60 * 60 * 24 * 7
  });

  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': newCookieSession
    }
  });
}

export async function getUserAccessTokenSession(request: Request): Promise<Auth0Jwt> {
  const session: SessionData = await getSession(request);
  return session.get(SESSION_JWT_TOKEN_KEY);
}

export async function updateUserSession(request: Request): Promise<UserSession> {
  const session: SessionData = await getSession(request);
  const jwtToken = await session.get(SESSION_JWT_TOKEN_KEY);

  console.log('----!! trying refreshing....', jwtToken);

  try {
    const refreshJwtToken = await refreshAccessToken(jwtToken);
    session.set(SESSION_JWT_TOKEN_KEY, refreshJwtToken);
    return getUser(request, refreshJwtToken);
  } catch(e) {
    throw redirect(LOGOUT_REDIRECT_URL);
  }
};

export async function logout(request: Request) {
  const session = await getSession(request);

  session.unset(SESSION_USER_ID_KEY);
  session.unset(SESSION_JWT_TOKEN_KEY);

  return redirect(ROOT_REDIRECT_URL, {
    headers: {
      'Set-Cookie': await sessionStorage.destroySession(session)
    }
  });
}
