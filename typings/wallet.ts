import { Request, Response, NextFunction } from "express";

import { ExpressResponseInterface } from "./helpers";

export type WalletType = {
  id?: string;
  user_id: string;
  wallet_number: number;
  wallet_balance?: number;
};

export abstract class WalletControllerInterface {
  /**
   * @async
   * @method createPin
   * @param {object} req
   * @param {object} res
   * @returns {ExpressResponseInterface}
   * @memberof UserControllerInterface
   */
  public static createWalletPin: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => ExpressResponseInterface;

  /**
   * @async
   * @method donate
   * @param {object} req
   * @param {object} res
   * @returns {ExpressResponseInterface}
   * @memberof UserControllerInterface
   */
  public static transferFund: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => ExpressResponseInterface;

  /**
   * @async
   * @method getDonations
   * @param {object} req
   * @param {object} res
   * @returns {ExpressResponseInterface}
   * @memberof UserControllerInterface
   */
  public static withdrawFund: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => ExpressResponseInterface;

  /**
   * @async
   * @method getDonation
   * @param {object} req
   * @param {object} res
   * @returns {ExpressResponseInterface}
   * @memberof UserControllerInterface
   */
  public static fundAccount: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => ExpressResponseInterface;
}
