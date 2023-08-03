const Image = require("./../models/imageModel");

exports.getAllImages = async (req, res, next) => {
  try {
    const { label } = req.params;
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
  try {
    await Image.create(req.body);
    res.status(201).json({
      status: "success",
      message: "image posted successfully",
    });
  } catch (error) {
    res.status(400).json({
      statuts: "fail",
      message: error.message,
    });
  }
};

exports.deleteImage = async (req, res, next) => {
  try {
    const imageId = req.params.id;
    const image = await Image.findOneAndDelete(imageId);

    if (!image) {
      throw new Error("No image found with that ID.");
    }

    res.status(204).json({
      status: "success",
      message: "Image deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};
