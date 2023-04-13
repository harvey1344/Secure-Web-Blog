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
    let salt = req.body.salt;

    await database.query(`set search_path to user_data;`);

    // Check if the email already exists in the database
    const { rows } = await database.query(
        `SELECT * FROM user_data.users WHERE email_address = $1`,
        [email]
    );

    if (rows.length > 0) {
        // Email address already exists in the database
        res.status(409).send('Email address already registered');
    } else {
        // Email address does not exist in the database, insert new record
        await database.query(
            `INSERT INTO user_data.users (email_address, password, salt) VALUES ($1, $2, $3)`,
            [email, password, salt]
        );
        console.log(email, password, 'user registered');
        res.send('user registered');
    }
});

module.exports = user;
