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

// Serve static files from the React app
app.use(express.static("../client/build"));

app.use(
  cors({
    credentials: true,
    origin: process.env.CORS_ORIGIN | "*",
  })
);

// Handle other routes and return the React app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

// API routes
app.use("/api", require("./routes/authRoutes"));

// Start the server on :8000 for the backend
const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Server running on port ${port}`));
