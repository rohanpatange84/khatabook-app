// Middleware to check if user is authenticated via session
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ success: false, message: 'Not authenticated. Please log in.' });
};

// Middleware to check if user has verified PIN this session
const isPinVerified = (req, res, next) => {
  if (req.session && req.session.pinVerified) {
    return next();
  }
  res.status(403).json({ success: false, message: 'PIN verification required.' });
};

module.exports = { isAuthenticated, isPinVerified };
