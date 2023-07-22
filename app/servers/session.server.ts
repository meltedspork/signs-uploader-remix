import { AppLoadContext, SessionData, redirect } from '@remix-run/node';
import invariant from 'tiny-invariant';
import { getUserById } from '~/models/user.server';
import { verifyIdToken, verifyJwtTokens } from '~/servers/auth0-jwt.server';

import firebaseCookieSessionStorage from '~/servers/frebase-cookie-session-storage.server';

import type { User } from '~/models/user.server';
import type {
  Auth0Jwt,
  Auth0JwtAccessToken,
  Auth0JwtIdToken
} from '~/modules/auth0-jwt.server';

invariant(process.env.SESSION_SECRET, 'SESSION_SECRET must be set');

export const sessionStorage = firebaseCookieSessionStorage({
  cookie: {
    name: process.env.SESSION_NAME,
    httpOnly: true,
    path: '/',
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
    if (!!jwtToken && (new URL(request.url).pathname !== '/')) {
      throw await logout(request);
    }
  }
}

export async function getUser(request: Request) {
  try {
    const session: SessionData = await getSession(request);
    const jwtToken = await session.get(SESSION_JWT_TOKEN_KEY);

    // const userId = await getUserId(request);
    // console.log('!!!!!userId', userId);
    // if (userId === undefined) return null;
    console.log('!!!!!------!!!!!!!');
    // const user = await getUserById(userId);
    // console.log('!!!!!user', user);
    const user = true;

    if (user && jwtToken) {
      const {
        accessToken,
        idToken
      }: {
        accessToken: Auth0JwtAccessToken,
        idToken: Auth0JwtIdToken
      } = await verifyJwtTokens(jwtToken);
      console.log('**accessToken: ', accessToken);
      console.log('**idToken: ', idToken);
      // should we check and refresh here when expired maybe?
      return {
        accessToken,
        idToken
      };
    };

    // throw await logout(request);
  } catch (err) {
    console.log('AHHHHH!!');
    // throw await logout(request);
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

  throw await logout(request);
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

// export async function updateUserSession(
//   request,
//   userJwt,
//   userId,
// }: {
//   request: Request;
//   redirectTo: string;
//   userJwt: Auth0Jwt;
//   userId: string;
// }) {
//   const session: any = await getSession(request);

//   session.set(SESSION_USER_ID_KEY, userId);
//   session.set(SESSION_JWT_TOKEN_KEY, userJwt);
//   const testData = await sessionStorage.commitSession(session, {
//     maxAge: 60 * 60 * 24 * 7
//   });
// };

export async function logout(request: Request) {
  const session = await getSession(request);

  session.unset(SESSION_USER_ID_KEY);
  session.unset(SESSION_JWT_TOKEN_KEY);

  return redirect('/', {
    headers: {
      'Set-Cookie': await sessionStorage.destroySession(session)
    }
  });
}


/*
    const accessToken: Auth0JwtAccessToken = await verifyAccessToken(jwt);
    */