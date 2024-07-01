import { Response } from "express";
import { UserType } from "@typings/user";
import { PaginateOptions, ObjectId } from "mongoose";

export interface CustomErrorInterface {
  handler: Function;
  notFound: Function;
  converter: Function;
  errorHandler: Function;
}

export interface HttpExceptionInterface {
  status: number;
  message: string;
  payload?: object;
  stack?: string | undefined;
  isPublic?: boolean | undefined;
  errorData?: Record<string, any>;
}

export interface JoiErrorInterface {
  type: string;
  path: string[];
  message: string;
}

export interface ResponseInterface {
  status: number;
  message?: string;
  payload?: object | null;
}

export type ExpressResponseInterface = Promise<void | Response<any, Record<string, any>>>;

export type ConstructPageableOption = Pick<PaginateOptions, "page" | "limit" | "offset"> & {
  skip?: number;
  count: number;
};

export type params = {
  id?: string;
  otp?: string;
  email?: string;
  user_id?: string;
  account_pin?: string;
  is_verified?: boolean;
  access_token?: string;
  wallet_number?: string;
};
