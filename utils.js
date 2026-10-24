// Small helpers used by the safe version.

// Escapes HTML so user input is shown as text, never executed.
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Blocks pages for users who are not logged in.
function requireLogin(req, res, next) {
  if (!req.session.user) return res.redirect('/login');
  next();
}

module.exports = { escapeHtml, requireLogin };