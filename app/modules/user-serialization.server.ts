import type { Auth0JwtIdToken } from './auth0-jwt.server';

export interface UserData {
  name: string;
  pictureImgPath: string;
  emailAddress: string;
}

export function idTokenSerialized(idToken: Auth0JwtIdToken): UserData {
  const {
    nickname: name,
    picture: pictureImgPath,
    email: emailAddress
  } = idToken;

  return {
    name,
    pictureImgPath,
    emailAddress
  };
}