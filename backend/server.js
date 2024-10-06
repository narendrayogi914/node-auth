const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const bodyParser = require("body-parser");
const { required } = require("joi");
require("dotenv").config();

const app = express();
require("./Modals/db");
// Apply Helmet middleware to secure HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

// Apply rate limiting to the /auth/login route
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login attempts per windowMs
  message:
    "Too many login attempts from this IP, please try again after 15 minutes",
});

// Middleware
app.use(bodyParser.json());

app.use(cors());

app.options("*", cors()); // Allow preflight requests for all routes

app.use(express.static("build"));

// Routes
app.use("/auth/login", loginLimiter); // Apply rate limiter to login route
app.use("/auth", require("./Routes/AuthRouter")); // Authentication routes
app.use("/products", require("./Routes/ProductRouter")); // Product routes

// Test endpoint
app.get("/", (req, res) => {
  res.send("Server is running securely!");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running securely on port ${PORT}`);
});
