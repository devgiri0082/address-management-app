require("dotenv").config();
let mongoose = require("mongoose");
let express = require("express");
let jwt = require("jsonwebtoken");
const { signup, login, changeRefresh } = require("./Controller/userController");
(async () => {
  await mongoose.connect("mongodb://127.0.0.1:27017/test", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
})();
let app = express();
app.use(express.json());
app.post("/login", validateRequest, async (req, res) => {
  console.log(req.details);
  let payload = {
    email: req.details.email,
    name: req.details.name,
  };
  let authorizationToken = jwt.sign(
    payload,
    process.env.AUTHORIZATION_TOKEN_SECRET,
    {
      expiresIn: process.env.AUTHORIZATION_TOKEN_EXPIRATION_TIME,
    }
  );
  let refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRATION_TIME,
  });
  let addToken = await changeRefresh(req.details.email, refreshToken);
  if (addToken.code === 403) {
    res.status(403).json({ message: "could not create a authorization token" });
    return;
  }
  res
    .status(200)
    .json({ access_token: authorizationToken, refresh_token: refreshToken });
});

async function validateRequest(req, res, next) {
  let validUser = await login(req.body);
  if (validUser.code === 403) {
    res.status(403).json({ message: validUser.message });
    return;
  } else {
    req.details = validUser.message;
    next();
  }
}

app.post("/signup", async (req, res) => {
  let signingUp = await signup(req.body);
  console.log(signingUp);
  res.status(signingUp.code).json({ message: signingUp.message });
});
const PORT = 3300;
app.listen(PORT, () => {
  console.log(`listening to port ${PORT}`);
});
