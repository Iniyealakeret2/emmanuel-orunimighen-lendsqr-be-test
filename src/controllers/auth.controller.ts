import _ from "lodash";
import httpStatus from "http-status";
import { Request, Response, NextFunction } from "express";

import config from "../config";

import APIError from "../helpers/api.errors";
import { generateOTP } from "../helpers/generate_otp";
import { sendResponse } from "../helpers/send_response";
import { AuthControllerInterface } from "../typings/auth";
import { ExpressResponseInterface } from "../typings/helpers";

/**
 *
 * @class
 * @extends AuthControllerInterface
 * @classdesc Class representing the authentication controller
 * @description App authentication controller
 * @name AuthController
 *
 */
export default class AuthController extends AuthControllerInterface {
  /**
   * Route: POST: /auth/signup
   * @async
   * @method signup
   * @description signup user account
   * @param {Request} req - HTTP Request object
   * @param {Response} res - HTTP Response object
   * @param {NextFunction} next - HTTP NextFunction object
   * @returns {ExpressResponseInterface} {ExpressResponseInterface}
   * @memberof AuthController
   */

  public static async signup(
    req: Request,
    res: Response,
    next: NextFunction
  ): ExpressResponseInterface {
    try {
      return res
        .status(httpStatus.CREATED)
        .json(sendResponse({ message: "success", status: httpStatus.CREATED }));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Route: POST: /auth/signin
   * @async
   * @method signin
   * @description signin to user account
   * @param {Request} req - HTTP Request object
   * @param {Response} res - HTTP Response object
   * @param {NextFunction} next - HTTP NextFunction object
   * @returns {ExpressResponseInterface} {ExpressResponseInterface}
   * @memberof AuthController
   */

  public static async signin(
    req: Request,
    res: Response,
    next: NextFunction
  ): ExpressResponseInterface {
    try {
      return res
        .status(httpStatus.OK)
        .json(sendResponse({ status: httpStatus.OK, message: "successful" }));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Route: POST: /auth/verify-otp
   * @async
   * @method verifyOtp
   * @description verify users otp
   * @param {Request} req - HTTP Request object
   * @param {Response} res - HTTP Response object
   * @param {NextFunction} next - HTTP NextFunction object
   * @returns {ExpressResponseInterface} {ExpressResponseInterface}
   * @memberof AuthController
   */

  public static async verifyOtp(
    req: Request,
    res: Response,
    next: NextFunction
  ): ExpressResponseInterface {
    try {
      return res
        .status(httpStatus.OK)
        .json(sendResponse({ status: httpStatus.OK, message: "Verified successfully" }));
    } catch (error) {
      next(error);
    }
  }
}
