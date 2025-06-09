const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://Vansh21112002:XFgY9yYlVg6zZwfb@namastenode.1vheoar.mongodb.net/devTinder?retryWrites=true&w=majority&appName=NamasteNode"
  );
};

module.exports = connectDB;
