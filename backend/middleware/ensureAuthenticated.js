// Used for JSON API routes: returns a 401 instead of crashing when req.user is missing.
function ensureAuthenticated(req, res, next) {
  if (req.user) return next();
  return res.status(401).json({ error: "Unauthorized" });
}

// Used for browser-navigated routes where a redirect makes more sense than a JSON error.
function ensureAuthenticatedRedirect(req, res, next) {
  if (req.isAuthenticated()) return next();
  return res.redirect("/");
}

module.exports = { ensureAuthenticated, ensureAuthenticatedRedirect };
