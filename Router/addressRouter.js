let express = require("express");
const {
  deleteAddress,
  searchAddress,
  addLocation,
  userLocation,
} = require("../Controller/addressController");

let router = express.Router();

router.delete("/delete-address", async (req, res) => {
  console.log("Hello");
  let data = await deleteAddress(req.decoded.email, req.body);
  res.status(data.code).json({ message: data.message });
});
router.get("/get-address", async (req, res) => {
  console.log(req.decoded.email);
  let data = await searchAddress(req.decoded.email, req.body);
  res.status(data.code).json({ message: data.message });
});
router.post("/new-address", async (req, res) => {
  let locationAdded = await addLocation(req.decoded.email, req.body);
  res.status(locationAdded.code).json({ message: locationAdded.message });
});

router.get("/address", async (req, res) => {
  console.log("Hello");
  let data = await userLocation(req.decoded.email);
  console.log("world");
  if (data.code === 403) {
    res.status(403).json({ message: data.message });
    return;
  }
  res.status(200).send({ message: data.message });
});

module.exports = router;
