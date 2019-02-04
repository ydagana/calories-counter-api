"use strict";

const users = [
  {
    username: "testUser1",
    password: "password",
    email: "test1@email.com",
    caloriesGoal: 1700
  },
  {
    username: "testUser2",
    password: "password",
    email: "test2@email.com",
    caloriesGoal: 1500
  },
  {
    username: "testUser3",
    password: "password",
    email: "test3@email.com",
    caloriesGoal: 1200
  },
  {
    username: "testUser4",
    password: "password",
    email: "test4@email.com",
    caloriesGoal: 1800
  },
  {
    username: "testUser5",
    password: "password",
    email: "test5@email.com",
    caloriesGoal: 2000
  }
];

module.exports = {
  up: (dataSource, next) => {
    return dataSource.models.user.count().then(count => {
      let sql = `INSERT INTO user
      (id, username, password, email, created, caloriesGoal) 
      VALUES `;
      for (let id = 0; id < users.length; id++) {
        const user = users[id];
        sql += `(
        ${count + id + 1},
        '${user.username}',
        '${dataSource.models.user.hashPassword(user.password)}',
        '${user.email}',
        now(),
        '${user.caloriesGoal}'
      ), `;
      }
      sql = sql.slice(0, -2) + ";";
      return dataSource.connector.query(sql, next);
    });
  },
  down: (dataSource, next) => {
    const sql = "DELETE FROM ONLY user;";
    dataSource.connector.query(sql, next);
  }
};
