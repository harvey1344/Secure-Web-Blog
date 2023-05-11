const { Pool } = require('pg');
require('dotenv').config({ path: './backend/config.env' });

console.log(process.env.DB_NAME)

const pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: process.env.DB_NAME,
    user: process.env.DB_USER_NAME,
    password:process.env.DB_PASSWORD,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
});

module.exports = pool;

