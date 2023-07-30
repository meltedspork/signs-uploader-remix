import type { Auth0JwtIdToken } from './auth0-jwt.module';

export interface UserSerializedData {
  name: string;
  pictureImgPath: string;
  emailAddress: string;
}

export function idTokenSerialized(idToken: Auth0JwtIdToken): UserSerializedData {
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