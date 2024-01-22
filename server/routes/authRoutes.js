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

router.use(
  cors({
    origin: "http://54.197.66.72:3000",
    credentials: true,
  })
);

router.get("/api", test);
router.post("/api/register", registerUser);
router.post("/api/login", loginUser);
router.post("/api/logout", logoutUser);
router.get("/api/profile", getProfile);
router.post("/api/deposit", deposit);
router.post("/api/withdraw", withdraw);

module.exports = router;
