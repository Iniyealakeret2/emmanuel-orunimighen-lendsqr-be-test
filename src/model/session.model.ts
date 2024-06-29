import { Model } from "./model";
import { SessionType } from "@typings/session";

export class SessionModel extends Model<SessionType> {
  public static tableName = "sessions";

  public async createSession(payload: SessionType): Promise<SessionType | null> {
    return super.create(payload);
  }

  public async updateSession(payload: SessionType): Promise<SessionType | null> {
    return super.findOneAndUpdate(payload.id!!, payload);
  }
}
