const user = require("./user");
const key = require("./key");
function route(app) {
  app.use("/user", user);
  app.use("/key", key);
}

module.exports = route;
