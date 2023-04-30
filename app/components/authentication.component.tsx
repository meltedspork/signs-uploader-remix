import { Auth0Provider } from '@auth0/auth0-react';

const AuthenticationComponent = (props: any) => {
  const { children } = props;
  const audience: string = window.ENV.AUTH0.AUDIENCE;
  const clientId: string = window.ENV.AUTH0.CLIENT_ID;
  const domain: string = window.ENV.AUTH0.DOMAIN;
  const redirectUri: string = window.ENV.AUTH0.REDIRECT_URI;

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectUri,
        audience
      }}
    >
      {children}
    </Auth0Provider>
  );
}

export default AuthenticationComponent;
