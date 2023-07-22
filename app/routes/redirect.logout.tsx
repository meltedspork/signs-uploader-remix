import { logout } from '~/servers/session.server';

import type { ActionArgs } from '@remix-run/node';

export const loader = async ({ request }: ActionArgs) => logout(request);
