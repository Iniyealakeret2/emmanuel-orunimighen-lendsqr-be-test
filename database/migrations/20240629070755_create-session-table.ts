import { Knex } from "knex";

export const createTable = (tableName: string, knex: Knex): Promise<void> => {
  return knex.schema.createTable(tableName, (table: Knex.TableBuilder) => {
    table.integer("otp").nullable();

    table.string("user_id").nullable();

    table.string("access_token").nullable();

    table.string("refresh_token").nullable();

    table.uuid("id").primary().defaultTo(knex.fn.uuid());

    table.timestamps(true, true);

    table.foreign("user_id").references("id").inTable("users");
  });
};

const tableName = "sessions";

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex: Knex): Promise<void> {
  return createTable(tableName, knex);
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(tableName);
}
