import { UserType } from "./user";

export interface OTPInterface {
  code: string;
  expire_at: Date;
}

export type SessionType = {
  id?: string;
  user_id: string;
  otp: string | null;
  access_token?: string;
  refresh_token?: string;
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
