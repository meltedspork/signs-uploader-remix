import * as React from 'react';
import type { V2_MetaFunction } from "@remix-run/node";

import CssBaseline from '@mui/material/CssBaseline';
import GlobalStyles from '@mui/material/GlobalStyles';

import HomeComponent from '~/components/Home.component';
import NavigatorBar from '~/components/NavigatorBar.component';
import FooterComponent from '~/components/Footer.component';

export const meta: V2_MetaFunction = () => {
  return [{ title: "Signs Uploader" }];
};

export default function Index() {
  return (
    <React.Fragment>
      <GlobalStyles styles={{ ul: { margin: 0, padding: 0, listStyle: 'none' } }} />
      <CssBaseline />
      <NavigatorBar />
      <HomeComponent />
      <FooterComponent />
    </React.Fragment>
  );
}
