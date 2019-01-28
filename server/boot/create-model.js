module.exports = function(app) {
  app.dataSources.db.autoupdate('AccessToken', (err) => {
    if (err) throw err;
  });
  app.dataSources.db.autoupdate('ACL', (err) => {
      if (err) throw err;
  });
  app.dataSources.db.autoupdate('RoleMapping', (err) => {
      if (err) throw err;
  });
  app.dataSources.db.autoupdate('Role', (err) => {
      if (err) throw err;
  });
  app.dataSources.db.autoupdate('user', (err) => {
      if (err) throw err;
  });
};
