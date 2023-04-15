/*
 * Author: Harvey Thompson
 * Date: 27/03/2023
 * Description: Backend code for the user registration page.
 */

const database = require('./db');
const user = require('express').Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

user.get('/', (req, res) => {
    res.sendFile('register.html', { root: '../frontend' });
});

user.post('/', jsonParser, async (req, res) => {
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
