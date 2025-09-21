const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
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
      enum: ["male", "female", "others"], // cleaner than manual validate
    },
    skills: {
      type: [String],
      validate(value) {
        if (value.length > 10) {
          throw new Error("Cannot have more than 10 skills");
        }
      },
    },
    // ✅ New fields
    photoUrl: {
      type: String,
      validate(value) {
        if (value && !validator.isURL(value)) {
          throw new Error("photoUrl must be a valid URL");
        }
      },
    },
    about: {
      type: String,
      maxlength: 500, // limit text length
      trim: true,
    },
  },
  { timestamps: true }
);

// JWT method (sync)
userSchema.methods.getJWT = function () {
  const user = this;
  return jwt.sign({ _id: user._id }, "vansh@123", {
    expiresIn: "7d",
  });
};

// Password validation
userSchema.methods.validatePassword = async function (passwordInputByUser) {
  return await bcrypt.compare(passwordInputByUser, this.password);
};

module.exports = mongoose.model("user", userSchema);
