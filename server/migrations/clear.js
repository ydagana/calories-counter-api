/* eslint-disable no-console */

"use strict";

const server = require("../server");
const ds = server.dataSources.db;

console.log(
  `\nClearing the database schema for node environment: ${
    process.env.NODE_ENV
  }\n`
);

if (process.env.DATABASE_URL) {
  console.log(`Connecting to database URL: ${process.env.DATABASE_URL}`);
} else {
  console.log(`Connecting to localhost database.`);
}

const executeQuery = q => {
  return new Promise((resolve, reject) => {
    ds.adapter.executeSQL(q, null, {}, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
};

const clearDatabase = async () => {
  try {
    await ds.adapter.connect();
    let lbTables = Object.keys(ds.connector._models);
    console.log("lbTables: ", lbTables);

    await executeQuery("SET FOREIGN_KEY_CHECKS = 0;");
    for (let table of lbTables) {
      await executeQuery(`DROP TABLE IF EXISTS ${table};`);
    }
    await executeQuery("SET FOREIGN_KEY_CHECKS = 1;");

    await ds.adapter.disconnect();
    return null;
  } catch (err) {
    console.trace(err);
  } finally {
    process.exit();
  }
};

clearDatabase();
