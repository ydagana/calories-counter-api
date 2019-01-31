"use strict";

const server = require("../server/server");
const ds = server.dataSources.db;

console.log(
  `\nRunning the ${
    process.env.UPDATE ? "update" : "create"
  } database schema script for node environment: ${process.env.NODE_ENV}\n`
);

if (process.env.DATABASE_URL) {
  console.log(`Connecting to database URL: ${process.env.DATABASE_URL}`);
} else {
  console.log(`Connecting to localhost database.`);
}

const migration = async () => {
  try {
    await ds.adapter.connect();

    // migrate one table at a time to prevent overloading the database with connections
    // get the tables from the data source directly
    let lbTables = Object.keys(ds.connector._models);
    if (process.env.UPDATE) {
      await ds.autoupdate(lbTables);
    } else {
      await ds.automigrate(lbTables);
    }
    console.log("The following Loopback tables:\n");
    for (let lbTable of lbTables) {
      console.log(lbTable);
    }
    console.log(`\nwere ${process.env.UPDATE ? "update" : "create"}d.`);
    console.log(
      `\n${lbTables.length} Loopback tables ${
        process.env.UPDATE ? "update" : "create"
      }d in ${ds.adapter.name} for node environment: ${process.env.NODE_ENV}\n`
    );
    await ds.adapter.disconnect();
    return null;
  } catch (err) {
    console.log(err);
  } finally {
    process.exit();
  }
};

migration();
