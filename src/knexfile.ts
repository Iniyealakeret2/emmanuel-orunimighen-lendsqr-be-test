import path from "path";
import type { Knex } from "knex";

import config from "./config";

const knexConfig: { [key: string]: Knex.Config } = {
  development: {
    client: "mysql2",
    connection: {
      host: config.DB_HOST,
      user: config.DB_USER,
      password: config.DB_PASSWORD,
      database: config.DB_NAME,
    },
    pool: {
      min: 1,
      max: 20,
    },
    migrations: {
      directory: path.resolve(__dirname, "./config/database/migrations"),
    },
    seeds: {
      directory: path.resolve(__dirname, "./config/database/seeds"),
    },
  },

  production: {
    client: "mysql2",
    connection: {
      host: config.DB_HOST,
      user: config.DB_USER,
      password: config.DB_PASSWORD,
      database: config.DB_NAME,
    },
    migrations: {
      directory: path.resolve(__dirname, "./config/database/migrations"),
    },
    seeds: {
      directory: path.resolve(__dirname, "./config/database/seeds"),
    },
  },
};

export default knexConfig;
