const jwt = require("jsonwebtoken");
const ensureAuthenticated = async (req, res, next) => {
  const auth = req.headers["authorization"];
  if (!auth) {
    return res.status(403).json({
      message: "Unauthorized , No token provided , JWT Token required",
    });
  }
  try {
    const decoded = jwt.verify(auth, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized , JWT Token is invalid",
    });
  }
};
module.exports = ensureAuthenticated;
