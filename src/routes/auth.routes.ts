/* ************************************************************************************** *
 * ******************************                           ***************************** *
 * ******************************         AUTH ROUTES       ***************************** *
 * ******************************                           ***************************** *
 * ************************************************************************************** */

import { Router } from "express";
import { celebrate as validate } from "celebrate";

import AuthValidation from "../validation/auth.validation";
import AuthController from "@app/controllers/auth.controller";

const router = Router();

router
  .route("/signup")
  .post([validate(AuthValidation.signup, { abortEarly: false })], AuthController.signup);

router
  .route("/signin")
  .post([validate(AuthValidation.signin, { abortEarly: false })], AuthController.signin);

router
  .route("/:id/account")
  .get([validate(AuthValidation.id, { abortEarly: false })], AuthController.account);

router
  .route("/verify")
  .post([validate(AuthValidation.verifyOtp, { abortEarly: false })], AuthController.verifyOtp);

export default router;
