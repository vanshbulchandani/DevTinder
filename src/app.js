const express = require("express");

const app = express();

app.get("/user", (req, res) => {
  res.send({
    name: "vansh",
    age: "22",
  });
});

app.post("/user", (req, res) => {
  res.send("this is get req from user");
});

app.use("/test", (req, res) => {
  res.send("hello from test is the best route for testing");
});

app.use((req, res) => {
  res.send("hello from server");
});

app.listen(7777, () => {
  console.log("Server is running on port 7777");
});
