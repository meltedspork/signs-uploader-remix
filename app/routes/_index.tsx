import type { V2_MetaFunction } from '@remix-run/node';

import HomeComponent from '~/components/home.client';

import { useOptionalUser } from '~/utils';

export const meta: V2_MetaFunction = () => [{ title: 'Signs Uploader' }];

export default function Index() {
  const user = useOptionalUser();

  return <HomeComponent />;
}