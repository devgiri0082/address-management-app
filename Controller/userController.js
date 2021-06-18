let bcrypt = require("bcrypt");
let user = require("../Model/UserModel");

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
    await givenUser.update({ refresh: token });
    console.log("token updated successfully");
    return { code: 200, message: "success" };
  } catch (err) {
    console.log(err);
    return { code: 403, message: err };
  }
};
function checkEmail(email) {
  var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
  return emailRegex.test(email);
}

module.exports = { signup, login, changeRefresh };
