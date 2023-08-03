const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: "String",
    required: [true, "Please enter name."],
  },
  email: {
    type: "String",
    required: [true, "Please enter email."],
    unique: true,
  },
  password: {
    type: "String",
    required: [true, "Please enter password."],
    select: false,
    minlength: 8,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Instance method
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
