const express = require('express');
const session = require('express-session');
const path = require('path');
const crypto = require('crypto');
const config = require('./config');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: config.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    // In vulnerable mode the cookie is readable by JS (so XSS can steal it).
    httpOnly: config.MODE === 'safe',
    sameSite: 'lax'
  }
}));

// Make mode + session info available to every page.
app.use((req, res, next) => {
  res.locals.MODE = config.MODE;
  res.locals.isSafe = config.MODE === 'safe';
  res.locals.user = req.session.user || null;

  // A CSRF token is created once per session (only used by the safe version).
  if (!req.session.csrfToken) {
    req.session.csrfToken = crypto.randomBytes(24).toString('hex');
  }
  res.locals.csrfToken = req.session.csrfToken;
  next();
});

app.use('/', require('./routes/auth'));
app.use('/', require('./routes/courses'));
app.use('/', require('./routes/comments'));
app.use('/', require('./routes/account'));

app.get('/', (req, res) => res.redirect('/login'));

app.listen(config.PORT, () => {
  console.log(`EduPortal running in ${config.MODE.toUpperCase()} mode: http://localhost:${config.PORT}`);
});