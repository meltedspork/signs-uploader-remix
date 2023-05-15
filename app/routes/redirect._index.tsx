import type { ActionArgs, HeadersFunction } from "@remix-run/node";
import { json, redirect } from '@remix-run/node';
var axios = require('axios');

import { createUserSession, getUserId } from "~/servers/session.server";

export const loader = async ({ request }: ActionArgs) => {
  console.log('request:::', request);
  const authorizationCode = new URL(request.url).searchParams.get('code');

  const redirectTo: string = '/';
  const domain: string = process.env.AUTH0_DOMAIN!;
  const endpoint: string = 'oauth/token';
  const queryString: URLSearchParams = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: process.env.AUTH0_CLIENT_ID!,
    client_secret: process.env.AUTH0_CLIENT_SECRET!,
    code: authorizationCode!,
    redirect_uri: 'http://localhost:3000'
  });

  const options = {
    method: 'POST',
    url: `${domain}/${endpoint}`,
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: queryString,
  };

  try {
    const {
      data: userJwt
    } = await axios.request(options);

    const userId = 'foobar';

    return createUserSession({
      request,
      redirectTo,
      userJwt,
      userId,
    });
  } catch (err) {
    return redirect('/');
  }
};