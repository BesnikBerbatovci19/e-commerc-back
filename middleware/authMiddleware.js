const passport = require('passport');

function authMiddleware(req, res, next) {
  passport.authenticate('jwt', { session: false }, (error, user) => {
    if (error) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    req.user = user;
    next();
  })(req, res, next);
}

function checkRole(role) {
  return (req, res, next) => {
    const userRoles = req.user.role;
    if (!userRoles.includes(role)) {
      return res.status(403).json({ message: 'Insufficient privileges' });
    }
    next();
  };
}

module.exports = {
  authMiddleware,
  checkRole,
};