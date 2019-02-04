"use strict";

const users = [
  {
    username: "admin",
    password: "adminpass",
    email: "admin@email.com"
  },
  {
    username: "manager",
    password: "managerpass",
    email: "manager@email.com"
  }
];

const roleMappings = [
  {
    principalType: "USER",
    roleId: 1
  },
  {
    principalType: "USER",
    roleId: 2
  }
];

module.exports = {
  up: (dataSource, next) => {
    const createUserPromise = dataSource.models.user.count().then(count => {
      return new Promise((resolve, reject) => {
        let sql = `INSERT INTO user
          (id, username, password, email, created, caloriesGoal)
        VALUES `;
        for (let id = 0; id < users.length; id++) {
          const user = users[id];
          const roleMapping = roleMappings[id];
          roleMapping.principalId = count + id + 1;
          sql += `(
              ${count + id + 1},
              '${user.username}',
              '${dataSource.models.user.hashPassword(user.password)}',
              '${user.email}',
              now(),
              1500
            ), `;
        }
        sql = sql.slice(0, -2) + ";";
        dataSource.connector.query(sql, err => {
          if (err) {
            return reject(err);
          }
          resolve();
        });
      });
    });
    return createUserPromise
      .then(() => {
        return new Promise((resolve, reject) => {
          dataSource.models.RoleMapping.create(roleMappings, err => {
            if (err) {
              return reject(err);
            }
            resolve();
          });
        });
      })
      .then(() => {
        next();
      })
      .catch(err => {
        next(err);
      });
  },
  down: (dataSource, next) => {
    const sql = `DELETE FROM ONLY user;
      DELETE FROM ONLY "RoleMapping";`;
    dataSource.connector.query(sql, next);
  }
};
