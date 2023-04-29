/*
 * Author: Harvey Thompson
 * Date: 27/03/2023
 * Description: Backend code for the login page. User has 5 attempts to login
 *              before being locked out for 10 minutes. On login, the users email address
 *              is looked up before combining the input password with salt and hashing.
 *              Then the hash is compared to the hash stored in the database.
 */

const database = require('./db');
const login = require('express').Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const rateLimit = require('express-rate-limit');
const CryptoJS = require('crypto-js');

// limit the number of login attempts from the same IP address
// uses the express-rate-limit package
const loginLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 5,
    message:
        'Too many login attempts from this IP, please try again after 10 minutes',
});

// send the login page to the client
login.get('/', (req, res) => {
    res.sendFile('login.html', { root: '../frontend' });
});

login.post('/login', loginLimiter, jsonParser, async (req, res) => {
    console.log('Login request received');
    let email = req.body.email;
    let password = req.body.password;
    console.log(email, password, 'email and password');
    //decrypt the password before hashing
    password = CryptoJS.AES.decrypt(password, 'Work?').toString(
        CryptoJS.enc.Utf8
    );
    console.log(password, 'decrypted password');

    await database.query(`set search_path to user_data;`);

    // return the row if the user exits in the database
    const { rows } = await database.query(
        'SELECT * FROM users WHERE email_address = $1',
        [email]
    );

    if (!(rows.length > 0)) {
        // handle case when no user was found
        const attemptsLeft = res.getHeader('X-RateLimit-Remaining');
        res.status(404).send({
            message: `Details did not match, try again. You have ${attemptsLeft} attempts left.`,
        });
        return;
    }

    const user = rows[0];
    //console.log(user.email_address, user.password, user.salt, 'user found');
    daSalt = user.salt;
    daPwd = user.password;
    daPwdSalted = password + daSalt;
    daHashed = CryptoJS.SHA256(daPwdSalted).toString();

    if (!(daHashed === daPwd)) {
        // handle case when password does not match
        const attemptsLeft = res.getHeader('X-RateLimit-Remaining');
        res.status(404).send({
            message: `Details did not match, try again. You have ${attemptsLeft} attempts left.`,
        });
        return;
    }

    res.status(200).send('Login successful');
});

module.exports = login;
