let bcrypt = require("bcrypt");
let user = require("../Model/UserModel");
let address = require("../Model/AddressModel");

const signup = async ({ name, email, password }) => {
  try {
    let validEmail = checkEmail(email);
    if (!validEmail) return { code: 403, message: "Invalid Email" };
    let userExist = await user.findOne({ email: email });
    console.log(userExist);
    if (userExist) return { code: 403, message: "Email Already Exist" };
    let hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
    let newUser = new user({
      name: name,
      email: email,
      password: hashedPassword,
    });
    await newUser.save();
    console.log("sign up successful");
    return { code: 200, message: "Signup Successful" };
  } catch (err) {
    return { code: 403, message: err };
  }
};

const login = async ({ email, password }) => {
  try {
    let givenUser = await user.findOne({ email: email });
    if (!givenUser) return { code: 403, message: "Email does not exist" };
    let passwordMatch = await bcrypt.compare(password, givenUser.password);
    if (!passwordMatch)
      return { code: 403, message: "Password does not match" };
    return { code: 200, message: givenUser };
  } catch (err) {
    return { code: 403, message: err };
  }
};
const changeRefresh = async (email, token) => {
  try {
    let givenUser = await user.findOne({ email: email });
    await givenUser.updateOne({ refresh: token });
    console.log("token updated successfully");
    return { code: 200, message: "success" };
  } catch (err) {
    console.log(err);
    return { code: 403, message: err };
  }
};
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
    let givenUser = await user.findOne({ email: email });
    let newAddress = givenUser.filter((elem) => elem["_id"] !== id);
    await givenUser.updateOne({ address: newAddress });
    return { code: 200, message: "deleted successfully" };
  } catch (err) {
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
function checkEmail(email) {
  var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
  return emailRegex.test(email);
}

module.exports = {
  signup,
  login,
  changeRefresh,
  userLocation,
  addLocation,
  searchAddress,
  deleteAddress,
};
