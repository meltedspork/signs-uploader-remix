import { createSessionStorage } from '@remix-run/node';
import firebaseAdmin from '~/servers/firebase-admin.server';

import type {
  CookieParseOptions,
  CookieSerializeOptions,
  CookieSignatureOptions,
  Cookie
} from '@remix-run/node';

const createFirebaseCookieSessionStorage = ({
  cookie
}: { 
  cookie: Cookie | (
    CookieParseOptions 
      & CookieSerializeOptions
      & CookieSignatureOptions
      & {
        name: string;
      }
    )
  | undefined
}) => {
  const db = firebaseAdmin.database();
  const sessionRef = db.ref(cookie?.name);

  return createSessionStorage({
    cookie,
    async createData(data, _expires) {
      const session = await sessionRef.push(data);
      // `expires` is a Date after which the data should be considered
      // invalid. You could use it to invalidate the data somehow or
      // automatically purge this record from your database.
      return session.key;
    },
    async readData(id) {
      const session = await sessionRef.child(id).once('value');
      return session.val();
    },
    async updateData(id, data, expires) {
      await sessionRef.child(id).update(data);
    },
    async deleteData(id) {
      if (!!id) {
        await sessionRef.child(id).remove();
      }
    },
  });
}

export default createFirebaseCookieSessionStorage;
