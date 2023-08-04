const express = require("express");
const imageController = require("./../controllers/imageController");
const userController = require("./../controllers/userController");
const router = express.Router();

router
  .route("/")
  .get(imageController.getAllImages)
  .post(userController.protect, imageController.postImage);

// router.delete("/:imageId/:userI", userController.protect, imageController.deleteImage);

module.exports = router;
