const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const userRoute = require("./Routes/userRoutes");
const chatRoute = require("./Routes/chatRoutes");
const messageRoute = require("./Routes/messageRoutes");
const commentRoute = require("./Routes/commentRoutes");

//index.js momin
const app = express();
require("dotenv").config();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Welcome to our chat app APIs.");
});

app.use("/api/v1", userRoute);
app.use("/api/v1", express.static(path.join(__dirname, "uploads")));
app.use("/api/v1", chatRoute);
app.use("/api/v1", messageRoute);
app.use("/api/v1", commentRoute); // Ensure comment route is added

const port = process.env.PORT || 3000;
const uri = "mongodb://localhost:27017/EatGood";

app.listen(port, () => {
  console.log(`Server Running On Port: ${port}`);
});

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connection established");
  })
  .catch((error) => {
    console.log("MongoDB connection failed: ", error.message);
  });
