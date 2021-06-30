let user = require("../Model/UserModel");
let address = require("../Model/AddressModel");

const updateAddress = async (
  email,
  { id, city, pincode, state, country, addressLine1, addressLine2 = "", label }
) => {
  try {
    let givenUser = await address.findOne({ _id: id });
    await givenUser.updateOne({
      city: city,
      pincode: pincode,
      state: state,
      country: country,
      addressLine1: addressLine1,
      addressLine2: addressLine2,
      label: label,
    });
    return { code: 403, message: "updated successfully" };
  } catch (err) {
    return { code: 403, message: err };
  }
};
const deleteAddress = async (email, { id }) => {
  try {
    let updatingValue = await user.update({ $pull: { address: id } });
    console.log(updatingValue);
    // return { code: 200, message: "deleted successfully" };
    let givenAddress = await address.deleteOne({ _id: id });
    console.log(givenAddress);
    return { code: 200, message: "deleted successfully" };
  } catch (err) {
    console.log(err);
    return { code: 403, message: err };
  }
};
const searchAddress = async (email, { params, value }) => {
  try {
    console.log("Hello");
    let givenUser = await user.findOne({ email: email }).populate("address");
    console.log(givenUser);
    let data = givenUser.address.filter((elem) => elem[params] == value);
    return { code: 200, message: data };
  } catch (err) {
    console.log("Hello", err);
    return { code: 403, message: err };
  }
};
const addLocation = async (
  email,
  { city, pincode, state, country, addressLine1, addressLine2 = "", label }
) => {
  try {
    let newAddress = new address({
      city: city,
      pincode: pincode,
      country: country,
      state: state,
      addressLine1: addressLine1,
      addressLine2: addressLine2,
      label: label,
    });
    await newAddress.save();
    let givenUser = await user.findOne({ email: email }).populate("address");
    if (!givenUser) {
      return { code: 403, message: "givenUser does not exist" };
    }
    await givenUser.updateOne({
      address: [...givenUser.address, newAddress["_id"]],
    });
    return { code: 200, message: "updated successfully" };
  } catch (err) {
    return { code: 403, message: err };
  }
};
const userLocation = async (email) => {
  try {
    let givenUser = await user.findOne({ email: email }).populate("address");
    if (!givenUser) {
      return { code: 403, message: "givenUser does not exist" };
    }
    console.log(givenUser, givenUser.address);
    return { code: 200, message: givenUser.address };
  } catch (err) {
    console.log("error: ", err);
    return { code: 404, message: err };
  }
};

module.exports = {
  userLocation,
  addLocation,
  searchAddress,
  deleteAddress,
};
