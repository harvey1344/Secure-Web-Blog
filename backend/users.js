const { Pool } = require('pg');

const user = require('express').Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

user.post('/', jsonParser, async (req, res) => {
    let database = new Pool({
        host: 'localhost',
        port: 5432,
        database: 'secure_software',
        user: 'postgres',
        password: 'password',
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000,
    });

    let email = req.body.email;
    let password = req.body.hash;
    await database.query(`set search_path to user_data;`);
    await database.query(
        `INSERT INTO users (email_address, password) VALUES ('${email}', '${password}')`
    );
    console.log('probs working');

    res.send('user registered');
});

module.exports = user;
