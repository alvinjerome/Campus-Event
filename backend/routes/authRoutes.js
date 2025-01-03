const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/authMiddleware");
const {
  registerUser,
  loginUser,
  refreshToken,
  logout,
  becomeAdmin,
} = require("../controllers/authController");

// Public routes
router.post("/signup", registerUser);
router.post("/login", loginUser);
router.post("/refresh-token", refreshToken);
router.post("/request-admin", becomeAdmin);

// Protected routes
router.use(verifyToken);
router.post("/logout", logout);

module.exports = router;
