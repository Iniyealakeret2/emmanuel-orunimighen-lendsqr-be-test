import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("wallets", (table) => {
    table.string("user_id").nullable();

    table.integer("wallet_number", 16).nullable();

    table.integer("wallet_balance", 16).nullable();

    table.uuid("id").primary();

    table.timestamp("created_at").defaultTo(knex.fn.now());

    table.timestamp("updated_at").defaultTo(knex.fn.now());

    table.foreign("user_id").references("id").inTable("users");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("wallets");
}
