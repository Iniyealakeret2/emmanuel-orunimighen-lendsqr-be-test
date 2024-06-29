import { Model } from "./model";
import BcryptService from "@app/services/bcrypt.service";
import { UserSessionType, UserType } from "@typings/user";

export class UserModel extends Model<UserType> {
  public static tableName = "users";

  /**
   * CREATE NEW USER
   */
  public async createUser(payload: UserType): Promise<UserType | null> {
    const updatedPayload = await this.preSaveHook(payload);

    return super.create(updatedPayload);
  }
  /**
   * FIND USER BY ID
   */
  public async findUser({ id }: Pick<UserType, "id">): Promise<UserType | null> {
    return super.findOne(id);
  }

  /**
   * FIND USER BY EMAIL
   */
  public async findUserByEmail({ email }: Pick<UserType, "email">): Promise<UserType | null> {
    return super.findOneByEmail(email);
  }

  /**
   * UPDATE USER
   */

  public async updateUser(payload: UserType): Promise<UserType | null> {
    const updatedPayload = await this.preFindOneAndUpdateHook(payload);
    const { id } = updatedPayload;
    return super.findOneAndUpdate(id, updatedPayload);
  }

  /**
   * pre-save hooks
   */
  private async preSaveHook(payload: UserType): Promise<UserType> {
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

  private async preFindOneAndUpdateHook(payload: UserType): Promise<UserType> {
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

  public getSession!: () => Promise<UserSessionType>; // Function declaration

  public validatePassword!: (password: string) => boolean;
}
