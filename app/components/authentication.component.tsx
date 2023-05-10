import {
  Children,
  cloneElement,
  createContext,
  Fragment,
  useEffect,
  useState
} from 'react';
import { createAuth0Client, useAuth0 } from '@auth0/auth0-spa-js';

interface IContextProps {
  onClickHandlers: any | null;
}

const AuthenticationContext = createContext({
  onClickHandlers: null
} as IContextProps);

const AuthenticationComponent = (props: any) => {
  const {
    children,
    config: {
      audience,
      clientId,
      domain,
      redirect_uri,
      returnTo
    }
  } = props;
  const [onClickHandlers, setOnClickHandlers] = useState<any | null>(null);

  useEffect(() => {
    createAuth0Client({
      domain,
      clientId
    }).then(auth0 => {
      const loginWithRedirect = async (_e: Event) => {
        await auth0.loginWithRedirect({
          authorizationParams: {
            audience: audience!,
            redirect_uri: redirect_uri!
          }
        });
      }

      const logout = async (_e: Event) => {
        await auth0.logout({
          logoutParams: {
            returnTo: returnTo!
          }
        });
      }

      setOnClickHandlers({
        loginWithRedirect,
        logout
      });
    });
  }, [setOnClickHandlers]);

  const renderChildren = ({ onClickHandlers }: any) => {
    return Children.map(children, (child) => {
      return cloneElement(child, onClickHandlers);
    });
  };

  return (
    <AuthenticationContext.Provider value={{ onClickHandlers }}>
      <AuthenticationContext.Consumer>
        {value =>
          <Fragment>
            {renderChildren(value)}
          </Fragment>
        }
      </AuthenticationContext.Consumer>
    </AuthenticationContext.Provider>
  );
}

export default AuthenticationComponent;