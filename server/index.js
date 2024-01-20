const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const path = require("path");
const app = express();

// Database connection
mongoose.connection.on("connected", () => {
  console.log("Database Connected");
});

mongoose.connection.on("error", (err) => {
  console.error("Database connection error:", err);
});

mongoose.connect(process.env.MONGO_URL);

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use(cors());

// API routes
app.use("/api", require("./routes/authRoutes"));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "client", "build")));

// Handle other routes and return the React app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

// Start the server on :8000 for the backend
const backendPort = process.env.BACKEND_PORT || 8000;
app.listen(backendPort, () => {
  console.log(`Backend server is running on port: ${backendPort}`);
});

// Start the server on :3000 for the frontend
const frontendPort = process.env.FRONTEND_PORT || 3000;
app.listen(frontendPort, () => {
  console.log(`Frontend server is running on port: ${frontendPort}`);
});
