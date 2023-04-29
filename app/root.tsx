import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { json } from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData
} from "@remix-run/react";

export async function loader() {
  return json({
    ENV: {
      NODE_ENV: process.env.NODE_ENV,
      BASE_URL: process.env.REACT_APP_API_BASE_URL,
      AUTH0: {
        AUDIENCE: process.env.AUTH0_CLIENT_AUDIENCE,
        CLIENT_ID: process.env.AUTH0_CLIENT_CLIENT_ID,
        DOMAIN: process.env.AUTH0_CLIENT_DOMAIN,
        REDIRECT_URI: process.env.AUTH0_CLIENT_REDIRECT_URI
      }
    },
  });
}

export default function App() {
  const constants = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(constants.ENV)}`
          }}
        />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
