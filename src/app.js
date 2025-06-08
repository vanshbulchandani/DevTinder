const express = require("express");

const app = express();

app.use("/test", (req, res) => {
  res.send("hello from test is the best route for testing");
});

app.use((req, res) => {
  res.send("hello from server");
});

app.listen(7777, () => {
  console.log("Server is running on port 7777");
});
