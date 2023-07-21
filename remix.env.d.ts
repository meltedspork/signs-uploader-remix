/// <reference types="@remix-run/dev" />
/// <reference types="@remix-run/node/globals" />

interface Window {
  constants: {
    ENV: string;
    BASE_URL: string;
  },
}