const express = require("express");
const ensureAuthenticated = require("../Middleware/Auth");
const router = express.Router();

router.get("/", ensureAuthenticated, (req, res) => {
  const products = [
    { name: "mobile", price: 5000 },
    { name: "laptop", price: 10000 },
  ];
  res.status(200).json(products);
});

module.exports = router;
