import { UserSerializedData } from "./user.module";

export interface UserSession {
  userData: UserSerializedData | null;
  isAuthenticated: boolean;
}
