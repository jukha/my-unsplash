const express = require("express");
const userController = require("./../controllers/userController");
const router = express.Router();

router.use("/all-users", userController.getAllUsers);
router.use("/signup", userController.signup);
router.use("/login", userController.login);

module.exports = router;
