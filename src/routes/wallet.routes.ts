/* ************************************************************************************** *
 * ******************************                           ***************************** *
 * ******************************         USER ROUTES       ***************************** *
 * ******************************                           ***************************** *
 * ************************************************************************************** */

import { Router } from "express";
import { celebrate as validate } from "celebrate";

import UserValidation from "../validation/user.validation";
import WalletController from "@app/controllers/wallet.controller";

const router = Router();

router
  .route("/:id/pin")
  .post(
    [validate(UserValidation.createAccountPin, { abortEarly: false })],
    WalletController.createWalletPin
  );

router
  .route("/transfer")
  .post(
    [validate(UserValidation.transferFund, { abortEarly: false })],
    WalletController.transferFund
  );

router
  .route("/withdraw")
  .post(
    [validate(UserValidation.withDrawFund, { abortEarly: false })],
    WalletController.withdrawFund
  );

router
  .route("/deposit")
  .post(
    [validate(UserValidation.withDrawFund, { abortEarly: false })],
    WalletController.fundAccount
  );

export default router;
