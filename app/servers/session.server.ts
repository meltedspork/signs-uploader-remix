import { AppLoadContext, createCookieSessionStorage, redirect } from '@remix-run/node';
import invariant from 'tiny-invariant';

import { getUserById } from '~/models/user.server';
import { verifyIdToken, verifyJwtTokens } from '~/servers/auth0-jwt.server';

import fireSession from '~/servers/firebase-session.server';

import type { User } from '~/models/user.server';
import type {
  Auth0Jwt,
  Auth0JwtAccessToken,
  Auth0JwtIdToken
} from '~/modules/auth0-jwt.server';

invariant(process.env.SESSION_SECRET, 'SESSION_SECRET must be set');

export const sessionStorage = fireSession({
  cookie: {
    name: process.env.SESSION_NAME!,
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secrets: [process.env.SESSION_SECRET!],
    secure: process.env.NODE_ENV === 'production',
  }
});

// const TOKEN_SESSION_KEY = 'jwtCookie';
const SESSION_USER_ID_KEY = '__userId';
const SESSION_JWT_TOKEN_KEY = '__jwtToken';

export async function getSession(
  request: Request,
  context: AppLoadContext = {}
) {
  const cookie = request.headers.get('Cookie');
  console.log('!!!!!!!!!!!!!!!!');
  console.log('cookie###');
  console.log(cookie);
  console.log('test req:');
  // console.log('getSession###');
  // const serverSession = await getServerSession(cookie);
  // console.log((await getServerSession(cookie)));
  // const result = serverSession.get('__sid')
  // console.log(result);
  // console.log('#####################');
  return sessionStorage.getSession(cookie);
}

export async function getUserId(
  request: Request,
  context: AppLoadContext = {}
): Promise<User['id'] | undefined> {
  const session = await getSession(request, context);
  const jwtToken = await session.get(SESSION_JWT_TOKEN_KEY);
  console.log('getUserId: SESSION_KEY_JWT_TOKEN', SESSION_JWT_TOKEN_KEY);
  console.log('getUserId: jwtToken', jwtToken);
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

export async function getUser(
  request: Request,
  context: AppLoadContext
) {
  try {
    // console.log('!!!!!!! getUser');
    const session = await getSession(request, context);
    const jwtToken = await session.get(SESSION_JWT_TOKEN_KEY);

    const userId = await getUserId(request, context);
    console.log('!!!!!userId', userId);
    if (userId === undefined) return null;
    console.log('!!!!!------!!!!!!!');
    const user = await getUserById(userId);
    console.log('!!!!!user', user);

    if (user) {
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
    console.log('!!!!!user-------!!');
    throw await logout(request);
  } catch (err) {
    console.log('AHHHHH!!');
    throw await logout(request);
  }
}

export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const session: any = await getSession(request);


  // return 'userid';
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
  userJwt: Auth0Jwt;
  userId: string;
}) {
  const session: any = await getSession(request);

  // const accessTokenEncoded = Buffer.from(userJwt.access_token, 'utf8').toString('base64') ; 
  // const refreshTokenEncoded = Buffer.from(userJwt.refresh_token, 'utf8').toString('base64');  
  // session.set(ACCESS_TOKEN_SESSION_KEY, accessTokenEncoded);
  // session.set(REFRESH_TOKEN_SESSION_KEY, refreshTokenEncoded);

  // const { sub }: any = await verifyIdToken(userJwt);
  // console.log('jwtVerifed:: sub', userJwt);

  // const jwtCookie = await sessionStorage.commitSession(sub, Object.assign({
  //   maxAge: 60 * 60 * 24 * 7 * 1000,
  // }, {user_id: userJwt}));

  // const sub = { foobar: true, ahh: 'asdfasfsdfasfasfsa'};

  // firebaseSessionMiddleware(sub, userJwt);
  // console.log('<<<<< firebaseSessionMiddleware:', firebaseSessionMiddleware);
  // console.log('>>>> sub');//, jwtCookie);

  session.set(SESSION_USER_ID_KEY, userId);
  session.set(SESSION_JWT_TOKEN_KEY, userJwt);
  const testData = await sessionStorage.commitSession(session, {
    maxAge: 60 * 60 * 24 * 7
  });

  console.log('testDatatestData', testData)

  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': testData
    }
  });
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
  const userId = await session.get(SESSION_USER_ID_KEY);
  console.log('logout: userId', userId);
  const jwtToken = await session.get(SESSION_JWT_TOKEN_KEY);
  console.log('logout: jwtToken', jwtToken);
  return redirect('/', {
    headers: {
      'Set-Cookie': await sessionStorage.destroySession(session)
    }
  });
}


/*
    const accessToken: Auth0JwtAccessToken = await verifyAccessToken(jwt);
    */