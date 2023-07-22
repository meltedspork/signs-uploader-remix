import { redirect } from '@remix-run/node';
import { getUserAccessTokenSession } from '~/servers/session.server';

import type { ActionArgs } from '@remix-run/node';

export const loader = async ({ request }: ActionArgs) => {
  const { id_token: idToken } = await getUserAccessTokenSession(request);

  const logoutWithRedirectUrl: URL = new URL(`${process.env.AUTH0_DOMAIN}/oidc/logout`);
  logoutWithRedirectUrl.searchParams.set('id_token_hint', idToken);
  logoutWithRedirectUrl.searchParams.set('post_logout_redirect_uri', process.env.AUTH0_REDIRECT_LOGOUT_URI);

  return redirect(logoutWithRedirectUrl.toString());
};

export const action = async () => redirect('/');
