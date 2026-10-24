// One shared connection pool to SQL Server.
const sql = require('mssql');
const config = require('./config');

let pool;
async function getPool() {
  if (!pool) {
    pool = await sql.connect(config.db);
  }
  return pool;
}

module.exports = { sql, getPool };