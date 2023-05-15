const expressSession = require('express-session');
const FirebaseStore = require('connect-session-firebase')(expressSession);
const firebaseAdmin = require('~/servers/firebase.server');

const firebaseSession = expressSession({
  store: new FirebaseStore({
    database: firebaseAdmin.database(),
  }),
  name: process.env.SESSION_NAME,
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  secure: true,
});

export default firebaseSession;
