let mongoose = require("mongoose");

let userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    unique: false,
  },
  address: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "address",
  },
  refresh: {
    type: String,
  },
});

let UserModel = new mongoose.model("user", userSchema);

module.exports = UserModel;
