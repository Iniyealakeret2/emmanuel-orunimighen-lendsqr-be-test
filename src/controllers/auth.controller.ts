import _ from "lodash";
// import axios from "axios";
import httpStatus from "http-status";
import { Request, Response, NextFunction } from "express";

import { UserType } from "@typings/user";
import APIError from "../helpers/api.errors";
import { UserModel } from "@app/model/user.model";
import { sendResponse } from "../helpers/send_response";
import { AuthControllerInterface } from "../../typings/auth";
import { ExpressResponseInterface } from "../../typings/helpers";
import { SessionModel } from "@app/model/session.model";
import { WalletModel } from "@app/model/wallet.model";
import { generateWalletNumber } from "@app/helpers/generate_wallet_number";
import { checkKarmaList } from "@app/helpers/check_karma_list";
// import AdjudicatorService from "@app/services/Adjudicator.service";

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
      const payload: UserType = req.body;

      const result = await checkKarmaList(payload.email);

      if (result?.message !== "Identity not found in karma") {
        return res.status(httpStatus.BAD_REQUEST).json(
          sendResponse({
            status: httpStatus.BAD_REQUEST,
            message: "You are defaulting in one of your loans",
          })
        );
      }

      const user = await UserModel.create(payload);

      return res
        .status(httpStatus.CREATED)
        .json(sendResponse({ message: "success", payload: user, status: httpStatus.CREATED }));
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
      const { email, password }: UserType = req.body;

      const user = await UserModel.findOne({ email, is_verified: true });

      if (!user) {
        throw new APIError({
          status: httpStatus.BAD_REQUEST,
          message: "Invalid email or password",
        });
      }

      const isCorrect = await UserModel.validatePassword(password, user.password);

      if (!isCorrect) {
        throw new APIError({
          status: httpStatus.BAD_REQUEST,
          message: "Invalid, email or password",
        });
      }

      const session = await UserModel.getSession({ id: user.id, email: user.email });

      await SessionModel.findOneAndUpdate(
        { user_id: user.id },
        { ..._.pick(session, ["refresh_token", "access_token"]) }
      );

      return res
        .status(httpStatus.OK)
        .json(sendResponse({ status: httpStatus.OK, payload: session, message: "successful" }));
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
      const { otp, email }: UserType & { otp: string } = req.body;

      const user = await UserModel.findOne({ email });

      if (!user) {
        throw new APIError({
          status: httpStatus.BAD_REQUEST,
          message: "Invalid email or password",
        });
      }

      const session = await SessionModel.findOne({ user_id: user.id, otp });

      if (!session) {
        throw new APIError({
          status: httpStatus.BAD_REQUEST,
          message: "Invalid OTP",
        });
      }

      const wallet_number = generateWalletNumber();

      await Promise.all([
        WalletModel.create({ user_id: user.id, wallet_number }),
        SessionModel.findOneAndUpdate({ user_id: user.id }, { otp: "" }),
        UserModel.findOneAndUpdate({ id: user.id }, { is_verified: true }),
      ]);

      return res
        .status(httpStatus.OK)
        .json(sendResponse({ status: httpStatus.OK, message: "Verified successfully" }));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Route: POST: /auth/account
   * @async
   * @method account
   * @description signin to user account
   * @param {Request} req - HTTP Request object
   * @param {Response} res - HTTP Response object
   * @param {NextFunction} next - HTTP NextFunction object
   * @returns {ExpressResponseInterface} {ExpressResponseInterface}
   * @memberof AuthController
   */

  public static async account(
    req: Request,
    res: Response,
    next: NextFunction
  ): ExpressResponseInterface {
    try {
      const user = await UserModel.findOne({ id: req.params.id });

      if (!user) {
        throw new APIError({
          status: httpStatus.BAD_REQUEST,
          message: "Invalid Request",
        });
      }

      return res
        .status(httpStatus.OK)
        .json(sendResponse({ status: httpStatus.OK, payload: user, message: "successful" }));
    } catch (error) {
      next(error);
    }
  }
}
