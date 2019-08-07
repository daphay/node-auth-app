module.exports = {
  enforceAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash("error_msg", "You have to be Logged in to view this Page");
    res.redirect("/users/login");
  }
};
