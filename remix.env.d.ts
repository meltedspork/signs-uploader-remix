/// <reference types="@remix-run/dev" />
/// <reference types="@remix-run/node/globals" />

namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;

    SESSION_NAME: string;
    SESSION_SECRET: string;

    DATABASE_URL: string;
    REACT_APP_API_BASE_URL: string;

    AUTH0_ACCESS_TOKEN_DOMAIN: string;
    AUTH0_ALGORITHMS: string;
    AUTH0_AUDIENCE: string;
    AUTH0_CLIENT_ID: string;
    AUTH0_CLIENT_SECRET: string;
    AUTH0_DOMAIN: string;
    AUTH0_ISSUER: string;
    AUTH0_JWKS_URI: string;
    AUTH0_REDIRECT_LOGIN_URI: string;
    AUTH0_REDIRECT_LOGOUT_URI: string;

    FIREBASE_PROJECT_ID: string;
    FIREBASE_DATABASE_URL: string;

    FIREBASE_ADMIN_TYPE: string;
    FIREBASE_ADMIN_PRIVATE_KEY_ID: string;
    FIREBASE_ADMIN_PRIVATE_KEY: string;
    FIREBASE_ADMIN_CLIENT_EMAIL: string;
    FIREBASE_ADMIN_CLIENT_ID: string;
    FIREBASE_ADMIN_AUTH_URI: string;
    FIREBASE_ADMIN_TOKEN_URI: string;
    FIREBASE_ADMIN_AUTH_PROVIDER_x509_CERT_URL: string;
    FIREBASE_ADMIN_CLIENT_x509_CERT_URL: string;
  }
}

interface Window {
  constants: {
    ENV: string;
    BASE_URL: string;
  },
}
