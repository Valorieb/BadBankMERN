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

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "client", "build")));

// Handle other routes and return the React app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

// API routes
app.use("/api", require("./routes/authRoutes"));

const port = process.env.PORT || 8000;
const host = "0.0.0.0";
app.listen(port, () => console.log(`Server is running on port ${port}`));
