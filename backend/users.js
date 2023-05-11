/*
 * Author: Harvey Thompson
 * Date: 27/03/2023
 * Description: Backend code for the user registration page.
 */ 

const database = require('./db');
const user = require('express').Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const twofactor = require("node-2fa");
const steraliseInput= require('./inputSterilisation')

const CryptoJS = require('crypto-js');
const encryptionKey = process.env.SESSION_KEY;

user.get('/', (req, res) => {
    res.sendFile('register.html', { root: '../frontend' });
});

user.post('/', jsonParser, async (req, res) => {
    let name = steraliseInput(req.body.name);
    let email = steraliseInput(req.body.email);
    let password = steraliseInput(req.body.hash);
    let salt = req.body.salt;
    //let twoFA = twofactor.generateSecret({name: "blog", account: email}).secret// needs encryption!!!
    let twoFA = twofactor.generateSecret({name: "blog", account: email}).secret;
    let encryptedTwoFA = CryptoJS.AES.encrypt(twoFA, encryptionKey).toString();

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
            `INSERT INTO user_data.users (name, email_address, password, salt, twoFA) VALUES ($1, $2, $3, $4, $5)`,
            [name, email, password, salt, encryptedTwoFA]
        );
        console.log(email, password, 'user registered');
        res.status(200).send(JSON.stringify({twoFA:twoFA}));
    }
});

module.exports = user;
