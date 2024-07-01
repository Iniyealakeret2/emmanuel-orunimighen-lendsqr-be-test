import type { Knex } from "knex";

// export async function up(knex: Knex): Promise<void> {}

// export async function down(knex: Knex): Promise<void> {}

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("sessions", (table) => {
    table.string("otp").nullable();

    table.string("user_id").nullable();

    table.string("access_token", 512).nullable();

    table.string("refresh_token", 512).nullable();

    table.uuid("id").primary();

    table.timestamps(true);

    table.foreign("user_id").references("id").inTable("users");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("sessions");
}
