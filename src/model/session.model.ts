import { params } from "@typings/helpers";
import database from "@app/config/database";
import { SessionType } from "@typings/session";

export class SessionModel {
  public static async findOne(payload: params): Promise<SessionType | null> {
    const session = await database("sessions")
      .where({ otp: payload.otp, user_id: payload.user_id })
      .orWhere({ access_token: payload.access_token || "" })
      .first();

    return session;
  }

  public static async findOneById(payload: params): Promise<SessionType | null> {
    return await database("sessions").where({ user_id: payload.user_id }).first();
  }

  public static async findOneAndUpdate(
    param: params,
    payload: Partial<SessionType>
  ): Promise<SessionType | null> {
    const session = await database("sessions")
      .where({ user_id: param.user_id || "" })
      .update(payload)
      .select<SessionType>("*");

    return session || null;
  }
}
