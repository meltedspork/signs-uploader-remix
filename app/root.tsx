import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { cssBundleHref } from "@remix-run/css-bundle";
import { json, redirect } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useOutletContext
} from "@remix-run/react";
import { useEffect, useState } from 'react';

import { getUser } from "~/servers/session.server";
import stylesheet from "~/tailwind.css";

import CssBaseline from '@mui/material/CssBaseline';
import GlobalStyles from '@mui/material/GlobalStyles';

import NavigatorBarComponent from '~/components/navigator-bar.component';
import FooterComponent from '~/components/footer.component';

import type { LinksFunction, LoaderArgs } from "@remix-run/node";
import type { UserSerializedData } from './modules/user.module';
import type { UserSession } from './modules/session.module';

type ContextType = {
  user: UserSerializedData | null;
  userAuthenticated: boolean;
};

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export const loader = async ({ request }: LoaderArgs) => {
  const {
    userData,
    isAuthenticated
  }: UserSession = await getUser(request);

  return json({
    userData,
    isAuthenticated
  });
};

export default function App() {
  const {
    userData,
    isAuthenticated
  } = useLoaderData<typeof loader>();

  const [user, setUser] = useState<UserSerializedData | null>(null);
  const [userAuthenticated, setUserAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    setUser(userData);
    setUserAuthenticated(isAuthenticated);
  }, [
    userData, setUser,
    isAuthenticated, setUserAuthenticated
  ]);

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
        <NavigatorBarComponent
          user={userData}
          userAuthenticated={isAuthenticated} />
          <Outlet context={{ user, userAuthenticated }} />
        <FooterComponent />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export function useUser() {
  return useOutletContext<ContextType>();
}
