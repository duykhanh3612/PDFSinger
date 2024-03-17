const user = require("./user");
function route(app) {
  app.use("/user", user);
}

module.exports = route;
