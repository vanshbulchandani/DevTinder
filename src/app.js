const express = require("express");
const connectDB = require("./config/database");
const user = require("./modles/user");
const app = express();

app.get("/signup", async (req, res) => {
  const userdata = new user({
    firstName: "vansh",
    lastName: "bulchandani",
    emailId: "vansh21112002@gmail.com",
    passwors: "vansh123",
  });
  await userdata.save();
  res.send("user created");
});

connectDB()
  .then(() => {
    console.log("databse connected");
    app.listen(7777, () => {
      console.log("Server is running on port 7777");
    });
  })
  .catch((err) => {
    console.log("connection fsiled");
  });
