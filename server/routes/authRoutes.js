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

//middleware
router.use(
  cors({
    credentials: true,
    origin: process.env.CORS_ORIGIN || "*",
  })
);

router.use(
  cors({
    credentials: true,
    origin:
      process.env.NODE_ENV === "production" ? process.env.CORS_ORIGIN : "*",
  })
);

router.get("/", test);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/profile", getProfile);
router.post("/deposit", deposit);
router.post("/withdraw", withdraw);

module.exports = router;
