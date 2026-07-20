const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/User');
const { isAuthenticated } = require('../middleware/auth');

// @route   GET /api/auth/google
// @desc    Start Google OAuth flow
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// @route   GET /api/auth/google/callback
// @desc    Google OAuth callback
router.get('/google/callback', (req, res, next) => {
  passport.authenticate('google', (err, user, info) => {
    if (err) {
      console.error('❌ Google Auth Callback Error:', err);
      return res.redirect('/index.html?error=auth_failed');
    }
    if (!user) {
      console.warn('⚠️ Google Auth Failed - No User Returned:', info);
      return res.redirect('/index.html?error=auth_failed');
    }
    req.logIn(user, (loginErr) => {
      if (loginErr) {
        console.error('❌ Login Session Error:', loginErr);
        return res.redirect('/index.html?error=auth_failed');
      }
      // Successful login — check if PIN is set
      if (!req.user.pinSet) {
        return res.redirect('/setup-pin.html');
      }
      res.redirect('/pin.html');
    });
  })(req, res, next);
});

// @route   POST /api/auth/setup-pin
// @desc    Set 4-digit PIN for the first time
router.post('/setup-pin', isAuthenticated, async (req, res) => {
  try {
    const { pin } = req.body;

    if (!pin || !/^\d{4}$/.test(pin)) {
      return res.status(400).json({ success: false, message: 'PIN must be exactly 4 digits.' });
    }

    const user = await User.findById(req.user._id);
    user.pin = pin;
    user.pinSet = true;
    await user.save();

    // Auto-verify PIN for this session
    req.session.pinVerified = true;

    res.json({ success: true, message: 'PIN set successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// @route   POST /api/auth/verify-pin
// @desc    Verify 4-digit PIN
router.post('/verify-pin', isAuthenticated, async (req, res) => {
  try {
    const { pin } = req.body;

    if (!pin || !/^\d{4}$/.test(pin)) {
      return res.status(400).json({ success: false, message: 'PIN must be exactly 4 digits.' });
    }

    const user = await User.findById(req.user._id);

    const isMatch = await user.comparePin(pin);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect PIN. Please try again.' });
    }

    // Mark PIN as verified in session
    req.session.pinVerified = true;

    res.json({ success: true, message: 'PIN verified.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// @route   POST /api/auth/lock-pin
// @desc    Lock PIN session (called when tab is reopened)
router.post('/lock-pin', isAuthenticated, (req, res) => {
  if (req.session) {
    req.session.pinVerified = false;
  }
  res.json({ success: true, message: 'PIN locked.' });
});

// @route   GET /api/auth/me
// @desc    Get current logged in user info
router.get('/me', isAuthenticated, (req, res) => {
  const { _id, name, email, avatar, pinSet } = req.user;
  const pinVerified = req.session.pinVerified || false;
  res.json({ success: true, user: { _id, name, email, avatar, pinSet, pinVerified } });
});

// @route   GET /api/auth/logout
// @desc    Logout user
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ success: false, message: 'Logout failed.' });
    req.session.destroy();
    res.json({ success: true, message: 'Logged out.' });
  });
});

module.exports = router;
