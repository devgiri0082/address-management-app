require("dotenv").config();
let mongoose = require("mongoose");
let express = require("express");
let jwt = require("jsonwebtoken");
let authRouter = require("./Router/authRouter");
let addressRouter = require("./Router/addressRouter");
const AddressModel = require("./Model/AddressModel");
(async () => {
  await mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
})();
let app = express();
app.use(express.json());
app.use("/auth", authRouter);
app.use("/", verifyUser, addressRouter);
function verifyUser(req, res, next) {
  let authorization = req.headers["authorization"];
  if (!authorization) {
    res.status(403).json({ message: "Authorization Key not provided" });
    return;
  }
  let token = authorization.split(" ")[1];
  if (!token) {
    res.status(403).json({ message: "Authorization Key not provided" });
    return;
  }
  jwt.verify(token, process.env.AUTHORIZATION_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      res.status(403).json({ message: "Authorization Key is not valid" });
      return;
    } else {
      req.decoded = decoded;
      next();
    }
  });
}

const PORT = 3300;
app.listen(PORT, () => {
  console.log(`listening to port ${PORT}`);
});
