let express = require("express");
let jwt = require("jsonwebtoken");
const {
  changeRefresh,
  signup,
  login,
} = require("../Controller/authController");
const router = express.Router();

router.post("/login", validateRequest, async (req, res) => {
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

router.post("/signup", async (req, res) => {
  let signingUp = await signup(req.body);
  console.log(signingUp);
  res.status(signingUp.code).json({ message: signingUp.message });
});

module.exports = router;
