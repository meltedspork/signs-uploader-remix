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

import { getUser } from "~/servers/session.server";
import tailwindStylesheetUrl from "~/styles/tailwind.css";

import CssBaseline from '@mui/material/CssBaseline';
import GlobalStyles from '@mui/material/GlobalStyles';

import AuthenticationComponent from '~/components/authentication.component';
import AuthorizationComponent from '~/components/authorization.component';
import NavigatorBarComponent from '~/components/navigator-bar.component';
import FooterComponent from '~/components/footer.component';

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: tailwindStylesheetUrl },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export const loader = async ({ request }: LoaderArgs) => {
  return json({
    user: await getUser(request),
    ENV: {
      NODE_ENV: process.env.NODE_ENV,
      BASE_URL: process.env.REACT_APP_API_BASE_URL
    },
  });
};

export default function App() {
  const constants = useLoaderData<typeof loader>();

  const { BASE_URL } = constants.ENV;

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
          <Outlet />
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
