"use strict";
global.Promise = require("bluebird");

module.exports = Meal => {
  const executeQuery = (ds, q, params) => {
    return new Promise((resolve, reject) => {
      ds.adapter.executeSQL(q, params, {}, (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  };

  Meal.remoteMethod("searchUserMeals", {
    http: { path: "/searchUserMeals", verb: "get" },
    accepts: [
      { arg: "filter", type: "object" },
      { arg: "req", type: "object", http: { source: "req" } }
    ],
    description: "Search User meals",
    returns: { type: "object", root: true }
  });

  Meal.searchUserMeals = (filter, req, next) => {
    const ds = Meal.app.dataSources.db;

    if (req.accessToken && req.accessToken.userId) {
      let query = "SELECT * FROM meal WHERE userId = ?",
        args = [req.accessToken.userId];
      if (filter && filter.startDate && filter.endDate) {
        query += " AND (time BETWEEN ? AND ?)";
        args.push(filter.startDate);
        args.push(filter.endDate);
      }
      if (filter && filter.startTime && filter.endTime) {
        query += " AND HOUR(time) BETWEEN ? AND ?";
        args.push(filter.startTime);
        args.push(filter.endTime);
      }
      query += " ORDER BY time ASC";
      executeQuery(ds, query, args)
        .then(meals => next(null, meals))
        .catch(e => {
          const err = new Error(e.message);
          err.status = 400;
          return next(err);
        });
    } else {
      const err = new Error("userId is required.");
      err.status = 401;
      return next(err);
    }
  };

  Meal.remoteMethod("userMealsStats", {
    http: { path: "/userMealsStats", verb: "get" },
    accepts: [{ arg: "req", type: "object", http: { source: "req" } }],
    description: "Get user meals stats",
    returns: { type: "object", root: true }
  });

  Meal.userMealsStats = (req, next) => {
    const ds = Meal.app.dataSources.db;

    if (req.accessToken && req.accessToken.userId) {
      let query = `SELECT DATE(time) as mealDay, SUM(calories) as dailyCalories FROM meal WHERE userId = ? GROUP BY mealDay`,
        args = [req.accessToken.userId];

      executeQuery(ds, query, args)
        .then(stats => next(null, stats))
        .catch(e => {
          const err = new Error(e.message);
          err.status = 400;
          return next(err);
        });
    } else {
      const err = new Error("userId is required.");
      err.status = 401;
      return next(err);
    }
  };
};
