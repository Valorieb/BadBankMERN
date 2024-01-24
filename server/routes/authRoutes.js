const express = require("express");
const router = express.Router();
const cors = require("cors");
const {
  test,
  registerUser,
  loginUser,
  logoutUser,
  getProfile,
  deposit,
  withdraw,
} = require("../controllers/authController");

// router.use(
//   cors({
//     origin: "http://valorie-env.eba-zrmhmgsy.eu-north-1.elasticbeanstalk.com/",
//     credentials: true,
//   })
// );

router.get("/", test);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/profile", getProfile);
router.post("/deposit", deposit);
router.post("/withdraw", withdraw);

module.exports = router;
