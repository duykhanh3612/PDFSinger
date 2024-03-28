const user = require("./user");
const key = require("./key");
const signpdf = require("./signpdf");
const downloadRouter = require('./downloadRouter');
function route(app) {
  app.use("/user", user);
  app.use("/key", key);
  app.use("/signpdf", signpdf);
  app.use("/download", downloadRouter); 
}

module.exports = route;
