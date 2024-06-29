import { Knex } from "knex";
import { Role } from "../../typings/user";

export const createTable = (tableName: string, knex: Knex): Promise<void> => {
  return knex.schema.createTable(tableName, (table: Knex.TableBuilder) => {
    table.integer("pin").nullable();

    table.string("password").notNullable();

    table.string("first_name").notNullable();

    table.string("first_name").notNullable();

    table.string("email").unique().notNullable();

    table.boolean("is_verified").defaultTo(false);

    table.uuid("id").primary().defaultTo(knex.fn.uuid());

    table.enu("role", [Role.USER, Role.ADMIN]).defaultTo(Role.USER);

    table.timestamps(true, true);
  });
};

const tableName = "users";

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
