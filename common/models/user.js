"use strict";

module.exports = function(User) {
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

  User.remoteMethod("getUsers", {
    http: { path: "/getUsers", verb: "get" },
    accepts: [{ arg: "req", type: "object", http: { source: "req" } }],
    description: "Get users details for manager",
    returns: { type: "object", root: true }
  });

  User.getUsers = (req, next) => {
    const ds = User.app.dataSources.db;

    if (req.accessToken && req.accessToken.userId) {
      User.findById(req.accessToken.userId, { include: ["role"] })
        .then(user => {
          let condition = "";
          if (
            user &&
            user.__role &&
            user.__role.name &&
            user.__role.name === "manager"
          ) {
            condition = "AND Role.name IS NULL";
          }
          let query = `
          SELECT user.*, COUNT(meal.id) as mealsCount, Role.name as roleName
          FROM user
            LEFT JOIN RoleMapping rm ON rm.principalId = user.id
            LEFT JOIN Role ON Role.id = rm.roleId
            LEFT JOIN meal ON meal.userId = user.id
          WHERE user.id != ? ${condition}
            GROUP BY user.id, roleName
          ORDER BY user.created ASC`;
          let args = [req.accessToken.userId];

          return executeQuery(ds, query, args);
        })
        .then(users => next(null, users))
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

  User.remoteMethod("deleteUser", {
    http: { path: "/deleteUser", verb: "delete" },
    accepts: [
      { arg: "id", type: "number" },
      { arg: "req", type: "object", http: { source: "req" } }
    ],
    description: "Delete user and related meals",
    returns: { type: "object", root: true }
  });

  User.deleteUser = (id, req, next) => {
    const ds = User.app.dataSources.db;

    let currentUser = null;
    if (
      id &&
      req.accessToken &&
      req.accessToken.userId &&
      id !== req.accessToken.userId
    ) {
      User.findById(req.accessToken.userId, { include: ["role"] })
        .then(cu => {
          currentUser = cu;
          return User.findById(id, { include: ["role"] });
        })
        .then(user => {
          let userRole = user && user.__data.role,
            currentUserRole = currentUser && currentUser.__data.role;
          userRole =
            userRole &&
            userRole[0] &&
            userRole[0].__data &&
            userRole[0].__data.name;
          currentUserRole =
            currentUserRole &&
            currentUserRole[0] &&
            currentUserRole[0].__data &&
            currentUserRole[0].__data.name;
          if (
            currentUserRole === "admin" ||
            (currentUserRole === "manager" && !userRole)
          ) {
            let query = `DELETE FROM meal WHERE userId = ?;`;
            let args = [id];
            return executeQuery(ds, query, args);
          } else {
            const err = new Error("Authorization required!");
            err.status = 401;
            return Promise.reject(err);
          }
        })
        .then(() => {
          let query = `DELETE FROM user WHERE id = ?;`;
          let args = [id];
          return executeQuery(ds, query, args);
        })
        .then(() => next())
        .catch(e => next(e));
    } else {
      const err = new Error("error performing request.");
      err.status = 401;
      return next(err);
    }
  };
};
