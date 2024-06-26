import _ from "lodash";
import httpStatus from "http-status";
import { Request, Response, NextFunction } from "express";

import { UserType } from "../typings/user";
import APIError from "../helpers/api.errors";
import * as EmailTemplate from "../template/index";
import { useSession } from "@app/helpers/use_session";
import EmailService from "@app/services/email.service";
import { UserControllerInterface } from "../typings/user";
import { sendResponse } from "@app/helpers/send_response";
import { ExpressResponseInterface } from "@app/typings/helpers";

/**
 *
 * @class
 * @extends UserControllerInterface
 * @classdesc Class representing the user controller
 * @description App authentication controller
 * @name UserController
 *
 */
export default class UserController extends UserControllerInterface {
  /**
   * Route: POST: /user/:id/pin
   * @async
   * @method createPin
   * @description create user pin
   * @param {Request} req - HTTP Request object
   * @param {Response} res - HTTP Response object
   * @param {NextFunction} next - HTTP NextFunction object
   * @returns {ExpressResponseInterface} {ExpressResponseInterface}
   * @memberof UserController
   */

  public static async createPin(
    req: Request,
    res: Response,
    next: NextFunction
  ): ExpressResponseInterface {
    try {
      return res
        .status(httpStatus.CREATED)
        .json(sendResponse({ message: "pin created successfully", status: httpStatus.CREATED }));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Route: GET: /user/:id/account
   * @async
   * @method accountDetails
   * @description get user account details
   * @param {Request} req - HTTP Request object
   * @param {Response} res - HTTP Response object
   * @param {NextFunction} next - HTTP NextFunction object
   * @returns {ExpressResponseInterface} {ExpressResponseInterface}
   * @memberof UserController
   */

  public static async accountDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ): ExpressResponseInterface {
    try {
      return res
        .status(httpStatus.OK)
        .json(sendResponse({ message: "success", status: httpStatus.OK }));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Route: POST: /user/:id/donate
   * @async
   * @method donate
   * @description create user pin
   * @param {Request} req - HTTP Request object
   * @param {Response} res - HTTP Response object
   * @param {NextFunction} next - HTTP NextFunction object
   * @returns {ExpressResponseInterface} {ExpressResponseInterface}
   * @memberof UserController
   */

  public static async donate(
    req: Request,
    res: Response,
    next: NextFunction
  ): ExpressResponseInterface {
    try {
      return res
        .status(httpStatus.OK)
        .json(sendResponse({ message: "success", status: httpStatus.OK }));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Route: GET: /user/:id/donations
   * @async
   * @method getDonations
   * @description create user pin
   * @param {Request} req - HTTP Request object
   * @param {Response} res - HTTP Response object
   * @param {NextFunction} next - HTTP NextFunction object
   * @returns {ExpressResponseInterface} {ExpressResponseInterface}
   * @memberof UserController
   */

  public static async getDonations(
    req: Request,
    res: Response,
    next: NextFunction
  ): ExpressResponseInterface {
    try {
      return res.status(httpStatus.OK).json(
        sendResponse({
          message: "success",
          status: httpStatus.OK,
        })
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Route: GET: /user/:id/donation
   * @async
   * @method getDonation
   * @description create user pin
   * @param {Request} req - HTTP Request object
   * @param {Response} res - HTTP Response object
   * @param {NextFunction} next - HTTP NextFunction object
   * @returns {ExpressResponseInterface} {ExpressResponseInterface}
   * @memberof UserController
   */

  public static async getDonation(
    req: Request,
    res: Response,
    next: NextFunction
  ): ExpressResponseInterface {
    try {
      return res
        .status(httpStatus.OK)
        .json(sendResponse({ message: "success", status: httpStatus.OK }));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Route: GET: /user/:id/donation
   * @async
   * @method getDonationsByDate
   * @description create user pin
   * @param {Request} req - HTTP Request object
   * @param {Response} res - HTTP Response object
   * @param {NextFunction} next - HTTP NextFunction object
   * @returns {ExpressResponseInterface} {ExpressResponseInterface}
   * @memberof UserController
   */

  public static async getDonationsByDate(
    req: Request,
    res: Response,
    next: NextFunction
  ): ExpressResponseInterface {
    try {
      return res
        .status(httpStatus.OK)
        .json(sendResponse({ message: "success", status: httpStatus.OK }));
    } catch (error) {
      next(error);
    }
  }
}
