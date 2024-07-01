import httpStatus from "http-status";
import { Request, Response, Router } from "express";

import AuthPolicy from "../policy/auth.policy";
import authRoute from "../routes/auth.routes";
import walletRoute from "@app/routes/wallet.routes";

const router = Router();

/** GET /health-check - Check service health */
router.get("/health-check", (_req: Request, res: Response) =>
  res.status(httpStatus.OK).json({ check: "lendsqr server started ok*-*" })
);

// mount Auth routes
router.use("/auth", authRoute);
// mount User routes
// router.use("/wallet", walletRoute);

/**
 * Check user access_token and authenticate user to perform HTTP requests
 * @description Validate the request, check if user is signed in and is authorized to perform this request
 */
router.use(AuthPolicy.hasAccessToken);

// mount User routes
router.use("/wallet", walletRoute);

export default router;
