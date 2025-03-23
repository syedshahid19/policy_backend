const mongoose = require("mongoose");
require("dotenv").config();

// connection for Database
exports.dbConnect = () => {
  mongoose
    .connect(process.env.DATABASE_URL)
    .then(() => {
      console.log("DB Connected Successfully");
    })
    .catch((error) => {
      console.log("DB Connection Failed");
      console.log(error);
      process.exit(1);
    });
};
