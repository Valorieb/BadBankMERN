const User = require("../models/user");
const { hashPassword, comparePassword } = require("../helpers/auth");
const jwt = require("jsonwebtoken");

const test = (req, res) => {
  res.json("test is working");
};

//Register endpoint
const registerUser = async (req, res) => {
  console.log("registerUser function called");
  try {
    const { name, email, password } = req.body;
    // Check if name was entered
    if (!name) {
      return res.json({
        error: "name is required",
      });
    }
    // Check is password good
    if (!password || password.length < 6) {
      return res.json({
        error: "Password is required and should be at least 6 characters",
      });
    }

    // Check if email contains a domain
    if (!email.includes("@") || !email.split("@")[1].trim() === "") {
      console.log("Invalid email address. Please include a domain.");
      return res.json({
        error: "Invalid email address. Please include a domain.",
      });
    }

    // Check email using regex pattern
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(email)) {
      return res.json({
        error: "Invalid email address",
      });
    }

    //Check email
    const exist = await User.findOne({ email });
    if (exist) {
      return res.json({
        error: "Email is taken already",
      });
    }

    const hashedPassword = await hashPassword(password);
    //Create user in database
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      transactions: [],
    });

    return res.json(user);
  } catch (error) {
    console.log("Unexpected error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Login Endpoint
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    //Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        error: "No user found",
      });
    }

    //Check if passwords match
    const match = await comparePassword(password, user.password);
    if (match) {
      jwt.sign(
        { email: user.email, id: user._id, name: user.name },
        process.env.JWT_SECRET,
        {},
        (err, token) => {
          if (err) throw err;
          res.cookie("token", token).json(user);
        }
      );
    }
    if (!match) {
      res.json({
        error: "Passwords do not match",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

//logout endpoints
const logoutUser = async (req, res) => {
  try {
    // Clear the token cookie
    res.clearCookie("token");
    res.json({ message: "Logout successful" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
};

const getProfile = (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, decodedToken) => {
      if (err) throw err;

      try {
        const user = await User.findById(decodedToken.id);

        if (
          user &&
          user.email &&
          user.id &&
          user.name &&
          user.balance !== undefined &&
          user.transactions
        ) {
          res.json({
            email: user.email,
            id: user.id,
            name: user.name,
            balance: user.balance,
            transactions: user.transactions,
          });
        } else {
          res.status(500).json({ error: "Incomplete user data" });
        }
      } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error fetching user data" });
      }
    });
  } else {
    res.json(null);
  }
};

const validateDeposit = (amount) => {
  // Check if amount is a valid positive number
  if (!/^\d*\.?\d+$/.test(amount) || parseFloat(amount) <= 0) {
    return { error: "Deposit amount must be a positive number" };
  }

  return null;
};
const deposit = async (req, res) => {
  try {
    const { amount } = req.body;
    const { token } = req.cookies;

    // Validate deposit amount
    const depositValidationResult = validateDeposit(amount);
    if (depositValidationResult) {
      return res.status(400).json(depositValidationResult);
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        console.error("Error verifying token:", err);
        return res.status(401).json({ error: "Invalid token" });
      }

      console.log("Decoded Token:", decodedToken);

      const user = await User.findById(decodedToken.id);
      console.log("User before update:", user);

      const updatedUser = await User.findByIdAndUpdate(
        decodedToken.id,
        {
          $inc: { balance: amount },
          $push: {
            transactions: {
              type: "deposit",
              amount: parseFloat(amount),
              date: new Date(),
            },
          },
        },
        { new: true }
      );

      console.log("User after update:", updatedUser);

      res.json({
        balance: updatedUser.balance,
        transactions: updatedUser.transactions,
      });
    });
  } catch (error) {
    console.log("Error in deposit function:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const withdraw = async (req, res) => {
  try {
    const { amount } = req.body;
    const { token } = req.cookies;

    // Check if amount is a valid positive number
    if (!/^\d*\.?\d+$/.test(amount) || parseFloat(amount) <= 0) {
      return res
        .status(400)
        .json({ error: "Withdrawal amount must be a positive number" });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        return res.status(401).json({ error: "Invalid token" });
      }

      // Fetch the user from the database
      const user = await User.findById(decodedToken.id);

      // Check if user has sufficient balance
      if (user.balance < amount) {
        return res.json({ error: "Insufficient balance" });
      }

      const updatedUser = await User.findByIdAndUpdate(
        decodedToken.id,
        {
          $inc: { balance: -amount },
          $push: { transactions: { type: "withdraw", amount } },
        },
        { new: true }
      );

      res.json({
        balance: updatedUser.balance,
        transactions: updatedUser.transactions,
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  test,
  registerUser,
  loginUser,
  logoutUser,
  getProfile,
  deposit,
  withdraw,
};
