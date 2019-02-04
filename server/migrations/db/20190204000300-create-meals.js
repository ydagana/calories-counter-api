"use strict";

const moment = require("moment");

const meals = [
  {
    type: "breakfast",
    userId: 3,
    calories: "650",
    description: "test data",
    time: moment()
      .startOf("day")
      .add(8, "hour")
      .format("YYYY-MM-DD HH:mm:ss")
  },
  {
    type: "lunch",
    userId: 3,
    calories: "700",
    description: "test data",
    time: moment()
      .startOf("day")
      .add(13, "hour")
      .format("YYYY-MM-DD HH:mm:ss")
  },
  {
    type: "dinner",
    userId: 3,
    calories: "600",
    description: "test data",
    time: moment()
      .startOf("day")
      .add(17, "hour")
      .format("YYYY-MM-DD HH:mm:ss")
  },
  {
    type: "snack",
    userId: 3,
    calories: "470",
    description: "test data",
    time: moment()
      .startOf("day")
      .add(20, "hour")
      .format("YYYY-MM-DD HH:mm:ss")
  },
  {
    type: "breakfast",
    userId: 3,
    calories: "550",
    description: "test data",
    time: moment()
      .add(-1, "day")
      .startOf("day")
      .add(8, "hour")
      .format("YYYY-MM-DD HH:mm:ss")
  },
  {
    type: "lunch",
    userId: 3,
    calories: "800",
    description: "test data",
    time: moment()
      .add(-1, "day")
      .startOf("day")
      .add(14, "hour")
      .format("YYYY-MM-DD HH:mm:ss")
  },
  {
    type: "dinner",
    userId: 3,
    calories: "640",
    description: "test data",
    time: moment()
      .add(-1, "day")
      .startOf("day")
      .add(18, "hour")
      .format("YYYY-MM-DD HH:mm:ss")
  },
  {
    type: "breakfast",
    userId: 3,
    calories: "550",
    description: "test data",
    time: moment()
      .add(-2, "day")
      .startOf("day")
      .add(9, "hour")
      .format("YYYY-MM-DD HH:mm:ss")
  },
  {
    type: "lunch",
    userId: 3,
    calories: "850",
    description: "test data",
    time: moment()
      .add(-2, "day")
      .startOf("day")
      .add(12, "hour")
      .format("YYYY-MM-DD HH:mm:ss")
  },
  {
    type: "dinner",
    userId: 3,
    calories: "750",
    description: "test data",
    time: moment()
      .startOf("day")
      .add(20, "hour")
      .format("YYYY-MM-DD HH:mm:ss")
  },
  {
    type: "breakfast",
    userId: 4,
    calories: "520",
    description: "test data",
    time: moment()
      .startOf("day")
      .add(9, "hour")
      .format("YYYY-MM-DD HH:mm:ss")
  },
  {
    type: "lunch",
    userId: 4,
    calories: "750",
    description: "test data",
    time: moment()
      .startOf("day")
      .add(12, "hour")
      .format("YYYY-MM-DD HH:mm:ss")
  },
  {
    type: "dinner",
    userId: 4,
    calories: "900",
    description: "test data",
    time: moment()
      .add(-2, "day")
      .startOf("day")
      .add(20, "hour")
      .format("YYYY-MM-DD HH:mm:ss")
  }
];

module.exports = {
  up: (dataSource, next) => {
    let sql = `INSERT INTO meal (id, type, userId, calories, description, time, created, updated)
    VALUES `;
    // loop through the indication relations to the studies
    for (let id = 0; id < meals.length; id++) {
      const meal = meals[id];
      sql += `(
        ${id + 1},
        '${meal.type}',
        '${meal.userId}',
        '${meal.calories}',
        '${meal.description}',
        '${meal.time}',
        now(),
        now()
        ), `;
    }
    sql = sql.slice(0, -2) + ";";
    return dataSource.connector.query(sql, next);
  },
  down: (dataSource, next) => {
    const sql = "DELETE FROM ONLY meal;";
    dataSource.connector.query(sql, next);
  }
};
