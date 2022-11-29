import type { Knex } from "knex";

// Update with your config settings.

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "mysql2",
    connection: "mysql2://root:root@localhost:8080/pizza-pasta"
  }
};

module.exports = config;
