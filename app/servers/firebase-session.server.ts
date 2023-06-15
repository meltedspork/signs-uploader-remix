import { createSessionStorage } from '@remix-run/node';
import type {
  CookieParseOptions,
  CookieSerializeOptions,
  CookieSignatureOptions,
  Cookie
} from '@remix-run/node';
import firebaseAdmin from '~/servers/firebase.server';

const createFirebaseSessionStorage = ({
  cookie
}: { 
  cookie: Cookie | (
    CookieParseOptions 
      & CookieSerializeOptions
      & CookieSignatureOptions
      & {
        name?: string;
      }
    )
  | undefined
}) => {
  const db = firebaseAdmin.database();
  const sessionRef = db.ref(process.env.SESSION_SECRET);

  return createSessionStorage({
    cookie,
    async createData(data, expires) {
      console.log('createData: data', data);
      console.log('createData: expires', expires);
      const session = await sessionRef.push(data);
      // `expires` is a Date after which the data should be considered
      // invalid. You could use it to invalidate the data somehow or
      // automatically purge this record from your database.
      //const id = await db.insert(data);
      console.log('createData: session.key', session.key);
      return session.key;
    },
    async readData(id) {
      console.log('readData: id', id);
      // return (await db.select(id)) || null;
      const session = await sessionRef.child(id).once('value');
      console.log('readData: session.key', session.key);
      console.log('readData: session.val()', session.val());
      return session.val();
    },
    async updateData(id, data, expires) {
      console.log('updateData: id', id);
      console.log('updateData: data', data);
      console.log('updateData: expires', expires);
      await sessionRef.child(id).update(data);
    },
    async deleteData(id) {
      console.log('deleteData: id', id);
      console.log('deleteData: !!id', !!id);
      if (!!id) {
        await sessionRef.child(id).remove();
      }
    },
  });
}

export default createFirebaseSessionStorage;
