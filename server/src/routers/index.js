const mail = require("./Mail");

function route(app) {
  app.use("/mail", mail);
}

module.exports = route;
