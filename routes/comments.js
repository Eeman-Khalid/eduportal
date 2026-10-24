const express = require('express');
const router = express.Router();
const { sql, getPool } = require('../db');
const config = require('../config');
const { escapeHtml, requireLogin } = require('../utils');

router.get('/comments', requireLogin, async (req, res) => {
  const pool = await getPool();
  const result = await pool.request()
    .query('SELECT author, body, created_at FROM comments ORDER BY id DESC');

  // Stored XSS is about OUTPUT: safe mode escapes before display.
  const comments = result.recordset.map(c => ({
    author: config.MODE === 'safe' ? escapeHtml(c.author) : c.author,
    body: config.MODE === 'safe' ? escapeHtml(c.body) : c.body,
    created_at: c.created_at
  }));
  res.render('comments', { comments });
});

router.post('/comments', requireLogin, async (req, res) => {
  const author = req.session.user.username;
  const body = req.body.body || '';
  const pool = await getPool();
  // Insert is parameterized in BOTH modes — stored XSS is a display bug, not a SQL bug.
  await pool.request()
    .input('a', sql.NVarChar, author)
    .input('b', sql.NVarChar(sql.MAX), body)
    .query('INSERT INTO comments (author, body) VALUES (@a, @b)');
  res.redirect('/comments');
});

module.exports = router;