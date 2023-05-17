/*
 * Author: Harvey Thompson Jack Bailey
 * Date: 27/03/2023
 * Description: Backend code for the user registration page.
 */

const database = require("./db");
const user = require("express").Router();
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const twofactor = require("node-2fa");
const steraliseInput = require("./inputSterilisation");
const CryptoJS = require("crypto-js");
require("dotenv").config({ path: "./config.env" });

user.get("/", (req, res) => {
    res.sendFile("register.html", { root: "../frontend" });
});

// Gets the infomation from the body and parses it through input steralisation.
user.post("/", jsonParser, async (req, res) => {
    let name = steraliseInput(req.body.name);
    let userName = steraliseInput(req.body.userName);
    let email = steraliseInput(req.body.email);
    let password = steraliseInput(req.body.hash);
    let salt = req.body.salt;

    // genorating a random 2fa secret
    let twoFA = twofactor.generateSecret({
        name: "blog",
        account: email,
    }).secret; 


    // selects all usernames that match the one provided by the user
    const { rows } = await database.query(
        `SELECT * FROM user_data.users WHERE user_name = $1`,
        [userName]
    );

    // selects all users and decrypts them useing the key in the .env account
    let data = await database.query(`select email_address from user_data.users`)

    let emails = data.rows
    emails = emails.map((email) => {
        const decryptedEmail = CryptoJS.AES.decrypt(email.email_address, process.env.ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);
        email.email_address = decryptedEmail; 
        return email; 
    });


    // returns an error code if the email or username is allready registers
    if (rows.length > 0) {
        res.status(409).send();
        return
    }else if(emails.includes(email)){
        res.status(409).send();
        return
    }


    // Inserts the suer data into the database after encryting it with the key in the .env
    await database.query(
        `INSERT INTO user_data.users (name,user_name, email_address, password, salt, twoFA) 
            VALUES ($1, $2, $3, $4, $5, $6)`,
        [
            CryptoJS.AES.encrypt(name, process.env.ENCRYPTION_KEY).toString(),
            userName,            
            CryptoJS.AES.encrypt(email, process.env.ENCRYPTION_KEY).toString(),
            password,
            CryptoJS.AES.encrypt(salt, process.env.ENCRYPTION_KEY).toString(),  
            CryptoJS.AES.encrypt(twoFA, process.env.ENCRYPTION_KEY).toString(),            
        ]
    );
    //sends a sucess status if the registraion was sucessfull
    res.status(200).send(JSON.stringify({ twoFA: twoFA }));
    console.log("Registration successful");
});

module.exports = user;
