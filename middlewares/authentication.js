// middleware.js
const checkAuth = (req, res, next) => {
  if (req.session.isLoggedIn) {
    // User is logged in, proceed to the next middleware or route handler
    res.locals.session = req.session;
    next();
  } else {
    // User is not logged in, redirect to the signin page
    res.redirect('/login');
  }
};

module.exports = {checkAuth};
