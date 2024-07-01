import { v4 as uuidv4 } from "uuid";

import { params } from "@typings/helpers";
import database from "@app/config/database";
import { WalletType } from "@typings/wallet";

export class WalletModel {
  public static async create(payload: WalletType): Promise<WalletType | null> {
    const wallet_id = uuidv4();
    const wallet = { ...payload, id: wallet_id };

    await database("wallets").insert(wallet);

    return { ...payload, id: wallet_id.toString() };
  }

  public static async findOne(payload: params): Promise<WalletType | null> {
    const session = await database("wallets")
      .where({ wallet_number: payload.wallet_number })
      .first();

    return session;
  }

  public static async findOneAndUpdate(
    param: params,
    payload: Partial<WalletType>
  ): Promise<WalletType | null> {
    const wallet = await database("wallets")
      .where({ user_id: param.user_id || "" })
      .update(payload)
      .select<WalletType>("*");

    return wallet || null;
  }
}
