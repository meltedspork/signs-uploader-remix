import * as React from 'react';
import type { V2_MetaFunction } from "@remix-run/node";

import HomeComponent from '~/components/home.component';

export const meta: V2_MetaFunction = () => {
  return [{ title: "Signs Uploader" }];
};

export default function Index() {
  return (
    <HomeComponent />
  );
}
