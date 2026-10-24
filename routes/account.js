const express = require('express');
const router = express.Router();
const { sql, getPool } = require('../db');
const config = require('../config');
const { requireLogin } = require('../utils');

router.get('/account', requireLogin, (req, res) => {
  res.render('account', { message: req.query.message || null });
});

router.post('/account/change-password', requireLogin, async (req, res) => {
  // SAFE: reject the request unless it carries this session's CSRF token.
  if (config.MODE === 'safe') {
    if (!req.body._csrf || req.body._csrf !== req.session.csrfToken) {
      return res.status(403).send('403 Forbidden: invalid or missing CSRF token. Request blocked.');
    }
  }
  // VULNERABLE: no token check — any page can trigger this on a logged-in user.
  const newPassword = req.body.newPassword || '';
  const pool = await getPool();
  await pool.request()
    .input('p', sql.NVarChar, newPassword)
    .input('id', sql.Int, req.session.user.id)
    .query('UPDATE users SET password = @p WHERE id = @id');

  res.redirect('/account?message=Password changed to: ' + encodeURIComponent(newPassword));
});

module.exports = router;