const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const path = require("path");
const app = express();

// Database connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Database Connected"))
  .catch((err) => console.error("Database connection error:", err));

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use(
  cors({
    credentials: true,
    origin: process.env.CORS_ORIGIN || " * ",
  })
);

// API routes
app.use("/", require("./routes/authRoutes"));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "Client", "build")));

// Handle other routes and return the React app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "Client", "build", "index.html"));
});
