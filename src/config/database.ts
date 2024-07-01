import knex from "knex";

import config from "@app/config";
import knexConfig from "../../knexfile";

const environment = config.NODE_ENV;
const database = knex(knexConfig[environment]);

database
  .raw("select 1")
  .then(() => {
    console.info(`successfully connected to  ${config.DATABASE_NAME}`);
  })
  .catch((error: any) => {
    console.error("Error connecting to database:", error);
  });

export default database;
