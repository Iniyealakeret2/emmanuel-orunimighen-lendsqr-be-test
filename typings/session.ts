export interface OTPInterface {
  code: string;
  expire_at: Date;
}

export type SessionType = {
  id?: string;
  user_id: string;
  otp: number | null;
  access_token?: string;
  refresh_token?: string;
};
