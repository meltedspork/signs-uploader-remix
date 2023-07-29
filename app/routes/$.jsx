import { redirect } from '@remix-run/node';
import { ROOT_REDIRECT_URL } from '~/constants';

export const loader = async () => redirect(ROOT_REDIRECT_URL);
