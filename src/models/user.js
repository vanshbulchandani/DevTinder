const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("emailId is not valid: " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("password is not strong enough");
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    phoneNo: {
      type: Number,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("gender is not valid");
        }
      },
    },
    skills: {
      type: [String],
      validate(value) {
        if (value.length > 10) {
          throw new Error("Cannot have more than 10 skills");
        }
      },
    },
  },
  { timestamps: true }
);

// JWT method (sync)
userSchema.methods.getJWT = function () {
  const user = this;
  const token = jwt.sign({ _id: user._id }, "vansh@123", {
    expiresIn: "7d",
  });
  return token;
};

// Password validation
userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;
  return await bcrypt.compare(passwordInputByUser, passwordHash);
};

module.exports = mongoose.model("user", userSchema);
