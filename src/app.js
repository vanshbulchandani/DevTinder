const express = require("express");
const connectDB = require("./config/database");
const user = require("./modles/user");

const app = express();
app.use(express.json());

app.get("/signup", async (req, res) => {
  console.log(req.body);
  //   const userdata = new user({
  //     firstName: "vansh",
  //     lastName: "bulchandani",
  //     emailId: "vansh21112002@gmail.com",
  //     password: "vansh123",
  //   });
  const userdata = new user(req.body);

  try {
    await userdata.save();
    res.send("user created");
  } catch (err) {
    console.log(err);
    res.status(500).send("error creating user");
  }
});

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

app.patch("/user", async (req, res) => {
  const userId = req.body.userId; // Corrected
  const data = req.body;

  try {
    const updatedUser = await user.findByIdAndUpdate(userId, data, {
      new: true,
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
    console.log("connection fsiled");
  });
