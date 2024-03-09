const mail = require("./Mail");
const user = require('./user');
function route(app) {
  app.use("/mail", mail);
  app.use("/user", user);
}

module.exports = route;
