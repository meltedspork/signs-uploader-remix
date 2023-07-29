import { redirect } from '@remix-run/node';
import { auth0Client } from "~/modules/auth0-jwt.server";
import { createUserSession, getUserId } from "~/servers/session.server";

import type { ActionArgs } from '@remix-run/node';
import { ROOT_REDIRECT_URL } from '~/constants';

export const loader = async ({ request }: ActionArgs) => {
  const redirectTo: string = ROOT_REDIRECT_URL;

  try {
    const authorizationCode = new URL(request.url).searchParams.get('code');
    const userJwt = await auth0Client({
      grant_type: 'authorization_code',
      code: authorizationCode!,
      redirect_uri: process.env.REACT_APP_API_BASE_URL
    });
    
    //console.log('userJwt ----!.!.', userJwt);
    const userId = 'foobar';

    return createUserSession({
      request,
      redirectTo,
      userJwt,
      userId,
    });
  } catch (err) {
    return redirect(redirectTo);
  }
};
