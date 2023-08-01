const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  url: {
    type: "String",
    required: true,
    validate: {
      validator: function (value) {
        const urlRegex = /^(http|https):\/\/[^ "]+$/;
        return urlRegex.test(value);
      },
      message: "URL is not valid",
    },
  },
  label: {
    type: "String",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

// Create a text index on the "label" field
imageSchema.index({ label: "text" });

imageSchema.pre("save", function (next) {
  // Convert the "name" field to uppercase before saving
  this.label = this.label.charAt(0).toUpperCase() + this.label.slice(1);
  next();
});

const Image = mongoose.model("Image", imageSchema);

module.exports = Image;
