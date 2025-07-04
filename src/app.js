const express = require("express");
const connectDB = require("./config/database");

const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    if (userEmail === "") {
      res.status(400).send("emailId is empty");
    } else {
      console.log(userEmail);
      const userdata = await user.findOne({ emailId: userEmail });
      res.send(userdata);
    }
  } catch (err) {
    console.log(err);
    res.status(400).send("soemething went wrong");
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await user.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("error fetching users");
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const deletedUser = await user.findByIdAndDelete(userId);
    res.send("user deleted");
  } catch (err) {
    console.log(err);
    res.status(400).send("error deleting user");
  }
});

app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId; // Corrected
  const data = req.body;

  try {
    const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }
    if (data?.skills && data.skills.length > 10) {
      throw new Error("Skills cannot be more than 10");
    }

    const updatedUser = await user.findByIdAndUpdate(userId, data, {
      new: true,
      runValidators: true,
    });
    console.log(updatedUser);
    res.send("user updated");
  } catch (err) {
    console.log(err);
    res.status(400).send("error updating user");
  }
});

connectDB()
  .then(() => {
    console.log("databse connected");
    app.listen(7777, () => {
      console.log("Server is running on port 7777");
    });
  })
  .catch((err) => {
    console.log("connection failed", err);
  });
