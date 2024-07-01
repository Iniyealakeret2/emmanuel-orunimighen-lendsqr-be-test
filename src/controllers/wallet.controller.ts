import _ from "lodash";
import httpStatus from "http-status";
import { Request, Response, NextFunction } from "express";

import { UserType } from "@typings/user";
import database from "@app/config/database";
import APIError from "../helpers/api.errors";
import { UserModel } from "@app/model/user.model";
import { sendResponse } from "../helpers/send_response";
import { ExpressResponseInterface } from "@typings/helpers";
import { WalletControllerInterface } from "@typings/wallet";
import { WalletModel } from "@app/model/wallet.model";
import { useSession } from "@app/helpers/use_session";

/**
 *
 * @class
 * @extends UserControllerInterface
 * @classdesc Class representing the user controller
 * @description App authentication controller
 * @name UserController
 *
 */
export default class WalletController extends WalletControllerInterface {
  /**
   * Route: POST: /wallet/:id/pin
   * @async
   * @method createWalletPin
   * @description create user pin
   * @param {Request} req - HTTP Request object
   * @param {Response} res - HTTP Response object
   * @param {NextFunction} next - HTTP NextFunction object
   * @returns {ExpressResponseInterface} {ExpressResponseInterface}
   * @memberof WalletController
   */

  public static async createWalletPin(
    req: Request,
    res: Response,
    next: NextFunction
  ): ExpressResponseInterface {
    try {
      const { account_pin }: UserType = req.body;

      const user = await UserModel.findOne({ id: req.params.id, is_verified: true });

      if (!user) {
        throw new APIError({
          message: "Account not found",
          status: httpStatus.NOT_FOUND,
        });
      }

      await UserModel.findOneAndUpdate({ id: user.id }, { account_pin });

      return res
        .status(httpStatus.CREATED)
        .json(sendResponse({ message: "pin created successfully", status: httpStatus.CREATED }));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Route: POST: /wallet/:id/transfer
   * @async
   * @method transferFund
   * @description create user pin
   * @param {Request} req - HTTP Request object
   * @param {Response} res - HTTP Response object
   * @param {NextFunction} next - HTTP NextFunction object
   * @returns {ExpressResponseInterface} {ExpressResponseInterface}
   * @memberof WalletController
   */

  public static async transferFund(
    req: Request,
    res: Response,
    next: NextFunction
  ): ExpressResponseInterface {
    try {
      const { aud } = useSession();

      const { amount, sender_wallet_number, receiver_wallet_number, pin } = req.body;

      const sender = await UserModel.findOne({ id: aud, account_pin: pin, is_verified: true });

      if (!sender) {
        throw new APIError({
          message: "Account not found",
          status: httpStatus.NOT_FOUND,
        });
      }

      const sender_wallet = await WalletModel.findOne({ wallet_number: sender_wallet_number });

      if (!sender_wallet) {
        throw new APIError({
          message: "Wallet not found",
          status: httpStatus.NOT_FOUND,
        });
      }

      if (sender_wallet.wallet_balance! < amount) {
        throw new APIError({
          message: "Insufficient fund",
          status: httpStatus.NOT_FOUND,
        });
      }

      const beneficiaryWallet = await WalletModel.findOne({
        wallet_number: receiver_wallet_number,
      });

      if (!beneficiaryWallet) {
        throw new APIError({
          message: "Wallet not found",
          status: httpStatus.NOT_FOUND,
        });
      }

      const beneficiaryExists = await UserModel.findOne({ id: beneficiaryWallet.user_id });

      if (!beneficiaryExists) {
        throw new APIError({
          message: "Account not found",
          status: httpStatus.NOT_FOUND,
        });
      }

      await database.transaction(async (trx) => {
        const sender_balance = sender_wallet.wallet_balance! - amount;
        const beneficiary_balance = beneficiaryWallet.wallet_balance + amount;

        await trx("wallets")
          .where({ user_id: sender_wallet.user_id })
          .update({ wallet_balance: sender_balance });

        await trx("wallets")
          .where({ user_id: beneficiaryExists.id })
          .update({ wallet_balance: beneficiary_balance });
      });

      return res.status(httpStatus.CREATED).json(
        sendResponse({
          message: "fund sent successfully",
          status: httpStatus.OK,
          payload: {
            amount_sent: amount,
            sender_name: sender.first_name,
            beneficiary_name: beneficiaryExists?.first_name,
            beneficiary_account_number: beneficiaryWallet.wallet_number,
          },
        })
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Route: GET: /wallet/:id/withdraw
   * @async
   * @method withdrawFund
   * @description create user pin
   * @param {Request} req - HTTP Request object
   * @param {Response} res - HTTP Response object
   * @param {NextFunction} next - HTTP NextFunction object
   * @returns {ExpressResponseInterface} {ExpressResponseInterface}
   * @memberof WalletController
   */

  public static async withdrawFund(
    req: Request,
    res: Response,
    next: NextFunction
  ): ExpressResponseInterface {
    try {
      const { aud } = useSession();

      const { amount, wallet_number, pin } = req.body;

      const withdrawer = await UserModel.findOne({ id: aud, account_pin: pin, is_verified: true });

      if (!withdrawer) {
        throw new APIError({
          message: "Account not found",
          status: httpStatus.NOT_FOUND,
        });
      }

      const user_wallet = await WalletModel.findOne({ wallet_number });

      if (!user_wallet) {
        throw new APIError({
          message: "Wallet not found",
          status: httpStatus.NOT_FOUND,
        });
      }

      if (user_wallet.wallet_balance! < amount) {
        throw new APIError({
          message: "Insufficient fund",
          status: httpStatus.NOT_FOUND,
        });
      }

      await database.transaction(async (trx) => {
        const wallet_balance = user_wallet.wallet_balance! - amount;

        await trx("wallets")
          .where({ user_id: user_wallet.user_id })
          .update({ wallet_balance: wallet_balance });
      });

      return res.status(httpStatus.OK).json(
        sendResponse({
          message: "withdrawal successful",
          status: httpStatus.OK,
          payload: {
            amount_withdrawn: amount,
            wallet_number: user_wallet.wallet_number,
          },
        })
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Route: GET: /user/:id/fund-account
   * @async
   * @method fundAccount
   * @description create user pin
   * @param {Request} req - HTTP Request object
   * @param {Response} res - HTTP Response object
   * @param {NextFunction} next - HTTP NextFunction object
   * @returns {ExpressResponseInterface} {ExpressResponseInterface}
   * @memberof WalletController
   */

  public static async fundAccount(
    req: Request,
    res: Response,
    next: NextFunction
  ): ExpressResponseInterface {
    try {
      const { aud } = useSession();

      const { amount, wallet_number, pin } = req.body;

      const user = await UserModel.findOne({ id: aud, account_pin: pin, is_verified: true });

      if (!user) {
        throw new APIError({
          message: "Account not found",
          status: httpStatus.NOT_FOUND,
        });
      }

      const user_wallet = await WalletModel.findOne({ wallet_number });

      if (!user_wallet) {
        throw new APIError({
          message: "Wallet not found",
          status: httpStatus.NOT_FOUND,
        });
      }

      if (amount <= 0) {
        throw new APIError({
          message: "Amount is too low",
          status: httpStatus.NOT_FOUND,
        });
      }
      await database.transaction(async (trx) => {
        const wallet_balance = user_wallet.wallet_balance + amount;

        await trx("wallets")
          .where({ user_id: user_wallet.user_id })
          .update({ wallet_balance: wallet_balance });
      });

      return res.status(httpStatus.OK).json(
        sendResponse({
          message: "deposit successful",
          status: httpStatus.OK,
          payload: {
            amount_deposited: amount,
            wallet_number: user_wallet.wallet_number,
          },
        })
      );
    } catch (error) {
      next(error);
    }
  }
}
