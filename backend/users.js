/*
 * Author: Harvey Thompson
 * Date: 27/03/2023
 * Description: Backend code for the user registration page.
 */

const database = require('./db');
const user = require('express').Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const twofactor = require('node-2fa');
const steraliseInput = require('./inputSterilisation');

user.get('/', (req, res) => {
    res.sendFile('register.html', { root: '../frontend' });
});

user.post('/', jsonParser, async (req, res) => {
    let name = steraliseInput(req.body.name);
    let userName = steraliseInput(req.body.userName);
    let email = steraliseInput(req.body.email);
    let password = steraliseInput(req.body.hash);
    let salt = req.body.salt;
    let twoFA = twofactor.generateSecret({
        name: 'blog',
        account: email,
    }).secret; // needs encryption!!!

    // Check if the email already exists in the database
    const { rows } = await database.query(
        `SELECT * FROM user_data.users WHERE email_address = $1 OR user_name = $2`,
        [email, userName]
    );

    if (rows.length > 0) {
        // User with email or username already exists in the database
        if (rows.some((row) => row.email_address === email)) {
            // Email address already registered
            res.status(409).send('Email address already registered');
        } else {
            // Username is taken but email is available
            res.status(409).send('Username is already taken');
        }
    } else {
        // Email address and username are available, insert new record
        await database.query(
            `INSERT INTO user_data.users (name,user_name, email_address, password, salt, twoFA) VALUES ($1, $2, $3, $4, $5,$6)`,
            [name, userName, email, password, salt, twoFA]
        );
        console.log(email, password, 'user registered');
        res.status(200).send(JSON.stringify({ twoFA: twoFA }));
    }
});

module.exports = user;
