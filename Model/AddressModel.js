let mongoose = require("mongoose");

let AddressSchema = new mongoose.Schema({
  city: {
    type: String,
    required: true,
    unique: false,
  },
  pincode: {
    type: Number,
    required: true,
    unique: false,
  },
  state: {
    type: String,
    required: true,
    unique: false,
  },
  country: {
    type: String,
    required: true,
    unique: false,
  },
  addressLine1: {
    type: String,
    required: true,
    unique: false,
  },
  addressLine2: {
    type: String,
    required: false,
    unique: false,
  },
  label: {
    type: String,
    required: true,
    unique: false,
  },
});

let AddressModel = new mongoose.model("address", AddressSchema);
module.exports = AddressModel;
