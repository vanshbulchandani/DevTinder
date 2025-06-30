const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const userData = req.user;

    console.log("User data:", userData);
    res.send(userData);
  } catch (err) {
    console.log(err);
    res.status(400).send("error reading cookie");
  }
});

module.exports = profileRouter;
