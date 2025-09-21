const express = require("express");
const user = require("../models/user");
const validateSignUpData = require("../utils/validations").validateSignUpData;

const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const authRouter = express.Router();
authRouter.post("/signup", async (req, res) => {
  console.log(req.body);

  try {
    validateSignUpData(req);
    const { firstName, lastName, emailId, password } = req.body;

    const passwordhash = await bcrypt.hash(password, 10);
    console.log("Hashed password:", passwordhash);

    const newUser = new user({
      firstName,
      lastName,
      emailId,
      password: passwordhash,
    });

    const savedUser = await newUser.save();
    const token = await savedUser.getJWT();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });

    res.json({ message: "User Added successfully!", data: savedUser });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    // Use a different variable name
    const existingUser = await user.findOne({ emailId: emailId });
    console.log("User from DB:", existingUser);
    console.log("Entered password:", password);
    console.log("Stored hashed password:", existingUser.password);
    if (!existingUser) {
      throw new Error("invalid credentials");
    }

    const isPasswordValid = await existingUser.validatePassword(password);
    if (!isPasswordValid) {
      throw new Error("invalid credentials");
    } else {
      const token = await existingUser.getJWT(); // should return a string
      res.cookie("token", token, {
        httpOnly: true,
        secure: false, // true in production with HTTPS
        sameSite: "lax",
      });
      res.send(existingUser);
    }
  } catch (err) {
    console.log(err);
    res.status(400).send("Something went wrong");
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("Logout successful");
});
module.exports = authRouter;
