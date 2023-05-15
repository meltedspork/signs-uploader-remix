import { createCookieSessionStorage, redirect } from '@remix-run/node';
import invariant from 'tiny-invariant';

import type { User } from '~/models/user.server';
import { getUserById } from '~/models/user.server';

import { verifyIdToken, verifyTokens } from '~/servers/jwt.server';

invariant(process.env.SESSION_SECRET, 'SESSION_SECRET must be set');

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '__session',
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === 'production',
  },
});

const TOKEN_SESSION_KEY = 'jwtCookie';

export async function getSession(request: Request) {
  const cookie = request.headers.get('Cookie');
  return sessionStorage.getSession(cookie);
}

export async function getUserId(
  request: Request
): Promise<User['id'] | undefined> {
  const session = await getSession(request);
  // const jwtVerifed: {
  //   access_token: string;
  //   refresh_token: string;
  //   id_token: string;
  //   scope: string;
  //   expires_in: number;
  //   token_type: string;
  // } = await verifyTokens(userJwt);

  // const accessToken = session.get(ACCESS_TOKEN_SESSION_KEY);
  // const refreshTOken = session.get(REFRESH_TOKEN_SESSION_KEY);
  const jwtCookie = session.get(TOKEN_SESSION_KEY);

  //const getUserJwt = await getJwt(request);
  //session.set(USER_JWT_KEY, getUserJwt);

  return jwtCookie;
}

export async function getUser(request: Request) {
  const userId = await getUserId(request);
  if (userId === undefined) return null;

  const user = await getUserById(userId);
  if (user) return user;

  throw await logout(request);
}

export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const userId = await getUserId(request);
  if (!userId) {
    const searchParams = new URLSearchParams([['redirectTo', redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
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
  userJwt: {
    access_token: string;
    refresh_token: string;
    id_token: string;
    scope: string;
    expires_in: number;
    token_type: string;
  };
  userId: string;
}) {
  const session: any = await getSession(request);

  // const accessTokenEncoded = Buffer.from(userJwt.access_token, 'utf8').toString('base64') ; 
  // const refreshTokenEncoded = Buffer.from(userJwt.refresh_token, 'utf8').toString('base64');  
  // session.set(ACCESS_TOKEN_SESSION_KEY, accessTokenEncoded);
  // session.set(REFRESH_TOKEN_SESSION_KEY, refreshTokenEncoded);

  const { sub }: any = await verifyIdToken(userJwt);
  console.log('jwtVerifed:: sub', userJwt);



  // const jwtCookie = await sessionStorage.commitSession(sub, Object.assign({
  //   maxAge: 60 * 60 * 24 * 7 * 1000,
  // }, {user_id: userJwt}));

  // firebaseSessionMiddleware(sub, userJwt);
  // console.log('<<<<< firebaseSessionMiddleware:', firebaseSessionMiddleware);
  console.log('>>>> sub', jwtCookie);

  session.set(TOKEN_SESSION_KEY, sub);

  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await sessionStorage.commitSession(session, {
        maxAge: 60 * 60 * 24 * 7
      })
    }
  });
}

export async function logout(request: Request) {
  const session = await getSession(request);
  return redirect('/', {
    headers: {
      'Set-Cookie': await sessionStorage.destroySession(session)
    }
  });
}
