const User = require("../models/userModel");
const Image = require("./../models/imageModel");
const axios = require("axios");

const deleteImage = async (req, res, next) => {
  try {
    const { imageId } = req.body;
    const { password } = req.body;

    if (!imageId || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide imageId and password.",
      });
    }

    const image = await Image.findById(imageId);

    if (!image) {
      return res.status(404).json({
        status: "fail",
        message: "Image not found.",
      });
    }

    const user = await User.findById(image.owner).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        status: "fail",
        message: "Incorrect password.",
      });
    }

    // Check if the currently logged-in user ID matches the image owner ID
    if (String(req.user._id) !== String(image.owner)) {
      return res.status(403).json({
        status: "fail",
        message:
          "You are not allowed to delete the image posted by someone else.",
      });
    }

    await Image.findByIdAndDelete(imageId);

    res.status(200).json({
      status: "success",
      message: "Image deleted successfully.",
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

// Function to verify if the URL contains a valid image
const verifyImageURL = async (url) => {
  try {
    const response = await axios.head(url);
    const contentType = response.headers["content-type"];
    return contentType.startsWith("image/");
  } catch (error) {
    // If there's an error making the request or the URL is invalid, return false
    return false;
  }
};

exports.getAllImages = async (req, res, next) => {
  try {
    const { label } = req.query;
    let query = {};
    if (label) query = { $text: { $search: label } };
    const images = await Image.find(query)
      .sort({ createdAt: -1 })
      .select("-__v");
    res.status(200).json({
      status: "success",
      data: images,
    });
  } catch (error) {
    res.status(400).json({
      statuts: "fail",
      message: error,
    });
  }
};

exports.postImage = async (req, res, next) => {
  // Image ID and user password in Payload means DELETE img
  if (req.body.imageId && req.body.password) {
    return deleteImage(req, res, next);
  }
  const imageUrl = req.body.url;

  try {
    const isValidImage = await verifyImageURL(imageUrl);
    if (!isValidImage) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid image URL.",
      });
    }
    await Image.create(req.body);
    res.status(201).json({
      status: "success",
      message: "Image posted successfully.",
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.labelSuggestions = async (req, res, next) => {
  try {
    const { term } = req.query;
    const regex = new RegExp(term, "i");
    const labels = await Image.distinct("label", { label: regex });
    res.status(200).json({
      status: "success",
      suggestions: labels,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};
