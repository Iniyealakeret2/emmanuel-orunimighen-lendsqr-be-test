import type { Knex } from "knex";
import { Role } from "../../typings/user";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("users", (table: Knex.TableBuilder) => {
    table.integer("account_pin").nullable();

    table.string("password").notNullable();

    table.string("first_name").notNullable();

    table.string("last_name").notNullable();

    table.string("email").unique().notNullable();

    table.boolean("is_verified").defaultTo(false);

    table.uuid("id").primary();

    table.enu("role", [Role.USER, Role.ADMIN]).defaultTo(Role.USER);

    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("users");
}
