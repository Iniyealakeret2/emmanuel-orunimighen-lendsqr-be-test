import _ from "lodash";
import httpStatus from "http-status";
import { Request, Response, NextFunction } from "express";

import config from "@app/config";
import { UserType } from "@typings/user";
import APIError from "../helpers/api.errors";
import * as EmailTemplate from "@app/template";
import { UserModel } from "@app/model/user.model";
import EmailService from "@app/services/email.service";
import { SessionModel } from "@app/model/session.model";
import { generateOTP } from "@app/helpers/generate_otp";
import { sendResponse } from "../helpers/send_response";
import { AuthControllerInterface } from "../../typings/auth";
import { ExpressResponseInterface } from "../../typings/helpers";

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
      const userModel = new UserModel();
      const sessionModel = new SessionModel();

      const { email }: UserType = req.body;

      const userExists = await userModel.findUserByEmail({ email });

      if (userExists) {
        throw new APIError({
          status: httpStatus.BAD_REQUEST,
          message: "Account already registered with us",
        });
      }
      const code = config.IS_PRODUCTION_OR_STAGING ? generateOTP() : config.DEFAULT_OTP_CODE;

      const user = await userModel.createUser(req.body);

      await sessionModel.createSession({ otp: code, user_id: user!!.id });

      EmailService.sendMail({
        to: user!!.email,
        subject: "Verify your account",
        html: EmailTemplate.signupMessageTemplate({ otp: code }),
      });

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
    _req: Request,
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
    _req: Request,
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
