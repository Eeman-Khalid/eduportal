const express = require('express');
const router = express.Router();
const { sql, getPool } = require('../db');
const config = require('../config');
const { escapeHtml, requireLogin } = require('../utils');

router.get('/dashboard', requireLogin, (req, res) => {
  res.render('dashboard');
});

router.get('/search', requireLogin, async (req, res) => {
  const q = req.query.q || '';
  let courses = [];
  let error = null;

  if (q) {
    try {
      const pool = await getPool();
      let result;
      if (config.MODE === 'safe') {
        // SAFE: bound parameter — no injection possible.
        result = await pool.request()
          .input('q', sql.NVarChar, `%${q}%`)
          .query('SELECT id, title, description FROM courses WHERE title LIKE @q');
      } else {
        // VULNERABLE: concatenated into the query = SQL injection point.
        const query = `SELECT id, title, description FROM courses WHERE title LIKE '%${q}%'`;
        result = await pool.request().query(query);
      }
      courses = result.recordset;
    } catch (err) {
      error = config.MODE === 'safe' ? 'Search failed.' : ('DB error: ' + err.message);
    }
  }

  // Reflected XSS: vulnerable reflects raw q; safe escapes it first.
  const reflected = config.MODE === 'safe' ? escapeHtml(q) : q;
  res.render('search', { q, reflected, courses, error });
});

// DOM-based XSS page (the payload lives in the URL #hash, handled by client JS).
router.get('/welcome', requireLogin, (req, res) => {
  res.render('welcome');
});

module.exports = router;