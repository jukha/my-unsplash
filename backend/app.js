const express = require("express");
const app = express();
const PORT = 5000;
const imageController = require("./controllers/imageController");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config({
  path: "./.env",
});

const DB = process.env.DB;

mongoose.connect(DB).then(() => {
  console.log("DB connection successfull");
});

app.use(express.json());

app.get("/images", imageController.getAllImages);
app.delete("/images/:id", imageController.deleteImage);
app.post("/images", imageController.postImage);
app.all("*", (req, res, next) => {
  res.status(400).json({
    status: "fail",
    message: "This url was not found!",
  });
});

app.listen(PORT, () => {
  console.log(`App listening on port: ${PORT}`);
});
