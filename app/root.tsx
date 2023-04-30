import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData
} from "@remix-run/react";

import { getUser } from "~/session.server";
import tailwindStylesheetUrl from "~/styles/tailwind.css";

import CssBaseline from '@mui/material/CssBaseline';
import GlobalStyles from '@mui/material/GlobalStyles';

import NavigatorBarComponent from '~/components/navigator_bar.component';
import FooterComponent from '~/components/footer.component';
import AuthorizationComponent from '~/components/authorization.component';

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: tailwindStylesheetUrl },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export const loader = async ({ request }: LoaderArgs) => {
  return json({
    user: await getUser(request),
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
};

export default function App() {
  const constants = useLoaderData<typeof loader>();

  console.log('constants:', constants);
  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-full">
      <GlobalStyles styles={{ ul: { margin: 0, padding: 0, listStyle: 'none' } }} />
        <CssBaseline />
        <NavigatorBarComponent />
        <AuthorizationComponent>
          <Outlet />
        </AuthorizationComponent>
        <FooterComponent />
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


/*
        <GlobalStyles styles={{ ul: { margin: 0, padding: 0, listStyle: 'none' } }} />
        <CssBaseline />
        <NavigatorBarComponent />
        <AuthorizationComponent>
          <Outlet />
        </AuthorizationComponent>
        <FooterComponent />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(constants.ENV)}`
          }}
        />
        */