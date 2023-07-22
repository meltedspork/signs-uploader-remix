import { redirect } from "@remix-run/node";

export const loader = async () => {
  const loginWithRedirectUrl: URL = new URL(`${process.env.AUTH0_DOMAIN}/authorize`);
  loginWithRedirectUrl.searchParams.set('response_type', 'code')
  loginWithRedirectUrl.searchParams.set('audience', process.env.AUTH0_AUDIENCE);
  loginWithRedirectUrl.searchParams.set('client_id', process.env.AUTH0_CLIENT_ID);
  loginWithRedirectUrl.searchParams.set('redirect_uri', process.env.AUTH0_REDIRECT_LOGIN_URI);
  loginWithRedirectUrl.searchParams.set('scope', [
    'openid',
    'profile',
    'email',
    'offline_access'
  ].join(' '));
  loginWithRedirectUrl.searchParams.set('state', '');

  return redirect(loginWithRedirectUrl.toString());
};

export const action = async () => redirect('/');
