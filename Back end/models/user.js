const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: false,
  },
  number: {
    type: Number,
    required: false,
  },
  password: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("User", userSchema);
