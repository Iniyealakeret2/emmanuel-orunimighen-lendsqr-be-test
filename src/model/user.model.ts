// import { Model } from "./model";
import _ from "lodash";
import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";

import config from "@app/config";
import { params } from "@typings/helpers";
import database from "@app/config/database";
import * as EmailTemplate from "@app/template";
import AuthService from "@app/services/auth.service";
import EmailService from "@app/services/email.service";
import { generateOTP } from "@app/helpers/generate_otp";
import BcryptService from "@app/services/bcrypt.service";
import { UserSessionType, UserType } from "@typings/user";

export class UserModel {
  public static async create(payload: UserType): Promise<Omit<UserType, "password"> | null> {
    const user_id = uuidv4();
    const userPayload = { ...payload, id: user_id };
    const updatedPayload = await this.preSaveHook(userPayload);
    const otp = config.IS_PRODUCTION_OR_STAGING ? generateOTP() : config.DEFAULT_OTP_CODE;

    await database("users").insert(updatedPayload);
    await database("sessions").insert({ user_id, otp });

    EmailService.sendMail({
      to: payload.email,
      subject: "Verify your account",
      html: EmailTemplate.signupMessageTemplate({ otp: otp }),
    });
    const data = _.omit(updatedPayload, "password");

    return { ...data, id: user_id.toString() };
  }

  public static async findOne(payload: params): Promise<UserType | null> {
    const user = await database("users")
      .where({ id: payload.id || "" })
      .orWhere({ email: payload.email || "" })
      .first()
      .select<UserType>();

    return user;
  }

  public static async findOneAndUpdate(
    param: params,
    payload: Partial<UserType>
  ): Promise<UserType | null> {
    const updatedPayload = await this.preFindOneAndUpdateHook(payload as UserType);

    const user = await database("users")
      .where({ id: param.id })
      .orWhere({ email: param.email || "" })
      .update(updatedPayload)
      .select<UserType>("*");

    return user || null;
  }

  /**
   * pre-save hooks
   */
  private static async preSaveHook(payload: UserType): Promise<UserType> {
    try {
      const encryptedPassword = await BcryptService.hashPassword(payload.password);

      return { ...payload, password: encryptedPassword };
    } catch (error) {
      throw error;
    }
  }

  /**
   * pre-update hooks
   */

  private static async preFindOneAndUpdateHook(payload: UserType): Promise<UserType> {
    const { password } = payload;

    if (!password) {
      return payload; // No change if no password provided
    }

    try {
      const encryptedPassword = await BcryptService.hashPassword(password);

      return { ...payload, password: encryptedPassword };
    } catch (error) {
      throw error;
    }
  }

  public static async validatePassword(password: string, userPassword: string): Promise<boolean> {
    return BcryptService.comparePassword(password, userPassword);
  }

  public static async getSession(user: Pick<UserType, "id" | "email">): Promise<UserSessionType> {
    const [access_token, refresh_token] = await Promise.all([
      AuthService.issueAccessToken(user),
      AuthService.issueRefreshToken(user),
    ]);

    const date = dayjs();
    const issued_at = date.unix(); // convert to unix timestamp
    const token_expiry = config.ACCESS_TOKEN_EXPIRY.replace(/\D/g, ""); // Matching for the numbers
    const expires_in = date.add(Number(token_expiry), "day").unix(); // convert to unix timestamp;
    const expires_at = dayjs(expires_in * 1000).toISOString();

    return {
      issued_at,
      expires_at,
      expires_in,
      access_token,
      refresh_token,
      user: { ...user, is_verified: true },
    };
  }
}
