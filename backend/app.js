const express = require("express");
const app = express();
const PORT = 5000;
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const imageRouter = require("./routes/imageRoutes");
const userRouter = require("./routes/userRoutes");

dotenv.config({
  path: "./.env",
});

const DB = process.env.DB;

mongoose.connect(DB).then(() => {
  console.log("DB connection successfull");
});

app.use(cors());
app.use(express.json());
app.use("/api/v1/users", userRouter);
app.use("/api/v1/images", imageRouter);
app.all("*", (req, res, next) => {
  res.status(400).json({
    status: "fail",
    message: "This url was not found!",
  });
});

app.listen(PORT, () => {
  console.log(`App listening on port: ${PORT}`);
});
