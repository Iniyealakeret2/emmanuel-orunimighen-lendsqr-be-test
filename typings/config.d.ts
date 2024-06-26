export interface EnvironmentInterface extends NodeJS.ProcessEnv {
  PORT: string;
  KARMA_API: string;
  KARMA_SECRET: string;
  KARMA_BASE_URL: string;
  DB_HOST: string;
  DB_USER: string;
  DB_PORT: string;
  DB_PASSWORD: string;
  EMAIL_PORT: number;
  BCRYPT_ROUND: string;
  DATABASE_NAME: string;
  EMAIL_SERVICE: string;
  OTP_MAX_NUMBER: number;
  OTP_MIN_NUMBER: number;
  EMAIL_USERNAME: string;
  EMAIL_PASSWORD: string;
  EMAIL_AUTH_USER: string;
  DEFAULT_OTP_CODE: number;
  EMAIL_AUTH_PASSWORD: string;
  ACCESS_TOKEN_SECRET: string;
  ACCESS_TOKEN_EXPIRY: string;
  REFRESH_TOKEN_EXPIRY: string;
  REFRESH_TOKEN_SECRET: string;
  NODE_ENV: "production" | "staging" | "development" | "test";
}

interface ErrorResponseInterface {
  error: string;
  stack?: string;
  status: number;
  message: string;
  payload?: object | null;
  errorData?: object | null;
}

interface ExpressErrorInterface extends Error {
  errors: string;
  status: number;
  stack: string | undefined;
  errorData?: object | null;
}
