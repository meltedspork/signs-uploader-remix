export {};

declare global {
  interface Window {
    ENV: {
      NODE_ENV: string;
      BASE_URL: string;
      AUTH0: {
        AUDIENCE: string;
        CLIENT_ID: string;
        DOMAIN: string;
        REDIRECT_URI: string;
      }
    },
  }
}
