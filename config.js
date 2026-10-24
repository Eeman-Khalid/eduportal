// Central settings. MODE switches the whole app between vulnerable and safe.
module.exports = {
  MODE: process.env.MODE || 'vulnerable',   // 'vulnerable' or 'safe'
  PORT: process.env.PORT || 3000,
  SESSION_SECRET: 'eduportal-demo-secret',

  db: {
    user: 'eduportal',
    password: 'Eduportal#123',
    server: 'localhost',          // If you use SQL Express, see README note
    database: 'EduPortal',
    options: {
      encrypt: false,
      trustServerCertificate: true
      // , instanceName: 'SQLEXPRESS'   // uncomment ONLY if you use a named instance
    }
  }
};