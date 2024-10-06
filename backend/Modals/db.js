const mongoose = require("mongoose");

const mongo_url = process.env.CONT_STR;
mongoose
  .connect(mongo_url)
  .then(() => {
    console.log("Database Connected Successfully");
  })
  .catch((err) => {
    console.log("Databse Connection Error : " + err);
  });
