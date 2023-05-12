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
const CryptoJS = require("crypto-js");
require('dotenv').config({ path: './config.env' });



user.get('/', (req, res) => {
    res.sendFile('register.html', { root: '../frontend' });
});

user.post('/', jsonParser, async (req, res) => {
    let name = steraliseInput(req.body.name);
    let userName = steraliseInput(req.body.userName);
    let userNameHash = CryptoJS.SHA256(userName).toString();
    let email = steraliseInput(req.body.email);
    let emailHash = CryptoJS.SHA256(email).toString();
    let password = steraliseInput(req.body.hash);
    let salt = req.body.salt;
    let twoFA = twofactor.generateSecret({
        name: 'blog',
        account: email,
    }).secret; // needs encryption!!!

        // Generate a random key
    const keySize = 256; // 256 bits
    const key = CryptoJS.lib.WordArray.random(keySize / 8); // 8 bits per byte

    // Convert the key to a string representation
    const keyString = key.toString();

    // Check if the email already exists in the database
    const { rows } = await database.query(
        `SELECT * FROM user_data.users WHERE email_hash = $1 OR user_name_hash = $2`,
        [emailHash, userNameHash]
    );

    if (rows.length > 0) {
        // User with email or username already exists in the database
        if (rows[0].email_hash === emailHash) {
            // Email address already registered
            res.status(409).send(JSON.stringify({message:"Email allready registerd."}));
        } else {
            // Username is taken but email is available
            res.status(409).send(JSON.stringify({message:"Username allready Taken."}));
        }
    } else {
        // Email address and username are available, insert new record
        await database.query(
            `INSERT INTO user_data.users (name,user_name,user_name_hash, email_address,email_hash, password, salt, twoFA, encryption_key) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
            [CryptoJS.AES.encrypt(name,keyString).toString(),
            CryptoJS.AES.encrypt(userName,keyString).toString(),
            userNameHash,
            CryptoJS.AES.encrypt(email,keyString).toString(),
            emailHash,
            password,
            CryptoJS.AES.encrypt(salt,keyString).toString(),
            CryptoJS.AES.encrypt(twoFA,keyString).toString(),
            CryptoJS.AES.encrypt(keyString, process.env.ENCRYPTION_KEY).toString(),]
        );
        console.log(email, password, 'user registered');
        res.status(200).send(JSON.stringify({ twoFA: twoFA }));
    }
});

module.exports = user;
