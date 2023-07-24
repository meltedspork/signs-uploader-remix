import { ActionArgs, V2_MetaFunction, json } from '@remix-run/node';

import HomeComponent from '~/components/home.component';

import { useOptionalUser } from '~/utils';

export const meta: V2_MetaFunction = () => [{ title: 'Signs Uploader' }];

export const action = async ({ request }: ActionArgs) => {
  return json({});
};

export default function Index() {
  // const user = useOptionalUser();

  return <HomeComponent />;
}