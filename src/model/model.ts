import database from "@app/config/database";

export abstract class Model<T> {
  protected tableName?: string;

  protected get table() {
    if (!this.tableName) {
      throw new Error("The table name must be defined for the model.");
    }
    return database(this.tableName);
  }

  public async create<Payload extends T, Result extends T>(data: Payload): Promise<Result> {
    const [result] = await this.table.insert(data).returning("*");
    return result;
  }

  public async findOne<Result extends T>(id: string): Promise<Result> {
    return this.table.where("id", id).select("*").first();
  }

  public async findOneByEmail<Result extends T>(email: string): Promise<Result> {
    return this.table.where("email", email).select("*").first();
  }

  public async find<Result extends T>(): Promise<Result[]> {
    return this.table.select("*");
  }

  public async findOneAndUpdate<T>(id: string, data: Partial<T>): Promise<T | null> {
    const [result] = await this.table.where({ id }).update(data).returning("*");
    return result || null;
  }

  public async bulkWrite<Payload extends T, Result extends T>(data: Payload[]): Promise<Result[]> {
    const results = await this.table.insert(data).returning("*");
    return results;
  }
}
