
// recording timings for types of authentication
let ammountOfReadingsStored = 300

let avePasswordComparison = 1
let PasswordComparisonData = []

function pushToPasswordComparisonData(element) {
    if (PasswordComparisonData.length === ammountOfReadingsStored) {
        PasswordComparisonData.shift();
    }
    PasswordComparisonData.push(element);
  
    let total = 0
    PasswordComparisonData.forEach(number => {
        total = total + number        
    });

    avePasswordComparison = total/pushToPasswordComparisonData.length
  }

let aveTwoFa = 1
let TwoFaData = []

function pushToTwoFaData(element) {
    if (TwoFaData.length === TwoFaData) {
        TwoFaData.shift();
    }
    TwoFaData.push(element);
  
    let total = 0
    TwoFaData.forEach(number => {
        total = total + number        
    });
        
    aveTwoFa = total/TwoFaData.length
  }




/*
 * Author: Harvey Thompson Jack BAiley
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
const twofactor = require("node-2fa");
const steraliseInput= require('./inputSterilisation')

const QRCode = require('qrcode');



// limit the number of login attempts from the same IP address
// uses the express-rate-limit package
const loginLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    // FOR TESTING max: 5,
    max:   1000,
    message:
        'Too many login attempts from this IP, please try again after 10 minutes',
});

// send the login page to the client
login.get('/', (req, res) => {
    res.sendFile('login.html', { root: './frontend' });
});

login.post('/setup2FA', async (req, res) => {
    // Check if the user is authenticated
    if (!req.session.user_id) {
      res.status(401).send('Unauthorized');
      return;
    }
  
    // Retrieve the user from the database using the user_id stored in the session
    const { rows } = await database.query(
      'SELECT * FROM user_data.users WHERE user_id = $1',
      [req.session.user_id]
    );
  
    if (!(rows.length > 0)) {
      res.status(404).send('User not found');
      return;
    }
  
    const user = rows[0];
  
    const newSecret = twofactor.generateSecret({ name: 'YourAppName', account: user.email_address });
  
    // Save the newSecret.secret to the user's account in your database
    await database.query(
      'UPDATE user_data.users SET twofa = $1 WHERE user_id = $2',
      [newSecret.ascii, user.user_id]
    );
  
    QRCode.toDataURL(newSecret.otpauth_url, (err, imageUrl) => {
      if (err) {
        console.error('Error generating QR code:', err);
        res.status(500).send('Error generating QR code');
      } else {
        res.status(200).json({
          qrCodeUrl: imageUrl,
          manualKey: newSecret.ascii,
        });
      }
    });
  });
login.post('/login', loginLimiter, jsonParser, async (req, res) => {
    console.log('Login request received');
    console.log(req.body);

    let email = steraliseInput(req.body.email);
    let password = steraliseInput(req.body.password);
    let twoFA = steraliseInput(req.body.twoFA);
    
    console.log(email, password, 'email and password');
    //decrypt the password before hashing
    password = CryptoJS.AES.decrypt(password, 'Work?').toString(
        CryptoJS.enc.Utf8
    );
    console.log(password, 'decrypted password');

    // return the row if the user exits in the database
    const { rows } = await database.query(
        'SELECT * FROM user_data.users WHERE email_address = $1',
        [email]
    );

    if (!(rows.length > 0)) {
        // handle case when no user was found
        const attemptsLeft = res.getHeader('X-RateLimit-Remaining');

        setTimeout(()=>{
            res.status(404).send({
                message: `Details did not match, try again. You have ${attemptsLeft} attempts left.`,
            });
        },aveTwoFa+avePasswordComparison)

        return;
    }

    const user = rows[0];
    //console.log(user.email_address, user.password, user.salt, 'user found');
    daSalt = user.salt;
    daPwd = user.password;
    daPwdSalted = password + daSalt;
    daHashed = CryptoJS.SHA256(daPwdSalted).toString();
    const secret = user.twofa; // Get the stored secret

    let timeOne = performance.now();

    if (!(daHashed === daPwd)) {
        // handle case when password does not match
        const attemptsLeft = res.getHeader('X-RateLimit-Remaining');

        setTimeout(()=>{
            res.status(404).send({
                message: `Details did not match, try again. You have ${attemptsLeft} attempts left.`,
            });
        },aveTwoFa)

        return;
    }

    let timeTwo = performance.now();

    // Verify the 2FA code using the stored secret
    const verificationResult = twofactor.verifyToken(secret, twoFA);
    if (!verificationResult) {
        console.log("2FA tokens didn't match")
        // handle case when 2FA does not match
        const attemptsLeft = res.getHeader('X-RateLimit-Remaining');
        res.status(404).send({
            message: `Details did not match, try again. You have ${attemptsLeft} attempts left.`,
        });
        return;
    }

        
    // attaches the user id to the session
    req.session.user_ip = CryptoJS.SHA256(req.socket.remoteAddress).toString();
    req.session.user_id = user.user_id
    req.session.save()
    res.status(200).send('Login successful');

    let timeThree = performance.now();
    pushToPasswordComparisonData(timeTwo-timeOne)
    pushToTwoFaData(timeThree-timeTwo)
});

module.exports = login;
