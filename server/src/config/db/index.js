const mongoose = require("mongoose");

async function connect() {
  const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  try {
    mongoose.connect(
      "mongodb+srv://thanhyarn:{password}@atlascluster.bfqeyvn.mongodb.net/TaskVault"
    );
    console.log("database connected");
  } catch (error) {
    console.log(error);
  }
}

module.exports = { connect };
