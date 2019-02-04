"use strict";

const roles = [
  {
    name: "admin",
    description: "General admin."
  },
  {
    name: "manager",
    description: "Users manager."
  }
];

module.exports = {
  up: (dataSource, next) => {
    // using the standard for Loopback roles as defined in https://loopback.io/doc/en/lb3/Defining-and-using-roles.html
    let sql =
      "INSERT INTO Role (id, name, description, created, modified) VALUES ";
    for (let id = 0; id < roles.length; id++) {
      const role = roles[id];
      sql += `(
          ${id + 1},
          '${role.name}',
          '${role.description}',
          now(),
          now()
          ), `;
    }
    sql = sql.slice(0, -2) + ";";
    return dataSource.connector.query(sql, next);
  },
  down: (dataSource, next) => {
    const sql = "DELETE FROM ONLY Role;";
    dataSource.connector.query(sql, next);
  }
};
