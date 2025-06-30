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

    await newUser.save(); // ✅ This is what actually stores user in MongoDB

    res.send("user created");
  } catch (err) {
    console.log(err);
    res.status(500).send("error creating user");
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
      res.send("Login successful");
    }
  } catch (err) {
    console.log(err);
    res.status(400).send("Something went wrong");
  }
});
module.exports = authRouter;
