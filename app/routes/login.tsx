import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Fragment } from "react";

export const loader = async (_: LoaderArgs) => {
  const domain: string = process.env.AUTH0_DOMAIN!;
  const endpoint: string = 'authorize';
  const queryString: URLSearchParams = new URLSearchParams({
    response_type: 'code',
    audience: process.env.AUTH0_AUDIENCE!,
    client_id: process.env.AUTH0_CLIENT_ID!,
    redirect_uri: process.env.AUTH0_REDIRECT_URI!,
    scope: [
      'openid',
      'profile',
      'offline_access'
    ].join(' '),
    state: ''
  });
  const loginWithRedirectUrl: string = `${domain}/${endpoint}?${queryString.toString()}`;

  return redirect(loginWithRedirectUrl);
};
