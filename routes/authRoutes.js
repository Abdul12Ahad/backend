const express = require('express');
const passport = require('passport');
const { signup, login, logout, getUser } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Local auth
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout',authMiddleware, logout);
router.get('/me', authMiddleware, getUser);

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

   const isProduction = process.env.NODE_ENV === "production";

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,   // secure only in prod
      sameSite: isProduction ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 24,
    });



    res.redirect('http://localhost:5173/dashboard');
  }
);

module.exports = router;