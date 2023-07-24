import { redirect } from '@remix-run/node';
import { logout, getUserAccessTokenSession } from '~/servers/session.server';

import type { ActionArgs } from '@remix-run/node';

export const loader = async ({ request }: ActionArgs) => {
  try {
    const { id_token: idToken } = await getUserAccessTokenSession(request);

    const logoutWithRedirectUrl: URL = new URL(`${process.env.AUTH0_DOMAIN}/oidc/logout`);
    logoutWithRedirectUrl.searchParams.set('id_token_hint', idToken);
    logoutWithRedirectUrl.searchParams.set('post_logout_redirect_uri', process.env.AUTH0_REDIRECT_LOGOUT_URI);

    return redirect(logoutWithRedirectUrl.toString());
  } catch (e) {
    return logout(request);
  }
};

export const action = async () => redirect('/');
