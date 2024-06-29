import { JwtPayload } from "jsonwebtoken";

export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
}

export type UserType = {
  id: string;
  role: Role;
  email: string;
  password: string;
  last_name: string;
  first_name: string;
  account_pin?: number;
  is_verified?: boolean;
};

export type UserSessionType = {
  access_token: string;
  /**
   * A timestamp of when the token was issued. Returned when a login is confirmed.
   */
  issued_at: number;
  /**
   * The number of seconds until the token expires (since it was issued). Returned when a login is confirmed.
   */
  expires_in: number;
  /**
   * A timestamp of when the token will expire. Returned when a login is confirmed.
   */
  expires_at: string;
  refresh_token: string;
  user: Partial<UserType> | null;
};

export interface UserTokenType extends Omit<JwtPayload, "aud">, UserType {
  aud: string;
}
