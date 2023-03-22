/*
 * Author: Harvey Thompson
 * Date: 20/03/2023
 * Description: This file contains the code for the home page of the website.
 *             It is the first page that the user will see when they visit the website.
 */
const bcrypt = require('bcryptjs');

// function to return an array of the most common passwords from a text file
const getPasswords = async () => {
    const response = await fetch('/toppwd.text');
    const data = await response.text();
    const dataArray = data.split('\n'); // split data by newlines to create an array
    return dataArray;
};

const getRegistration = async () => {
    // get array of top passwords from function
    let pwdArray = await getPasswords();
    pwdArray = pwdArray.map((pwd) => pwd.trim());

    // get the user details from the form
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    console.log(typeof password);

    // check if password is common
    console.log(isPasswordCommon(password, pwdArray));

    // use bcrypt to hash the password
    let salt = bcrypt.syngenSaltSync(10);
    let hash = bcrypt.hashSync(password, salt);

    // send user details to database with use of fetch API
    fetch('/register', {
        // Adding method type
        method: 'POST',
        // Adding body or contents to send
        body: JSON.stringify({
            email,
            password,
        }),
        // Adding headers to the request
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    }).then(function (res) {
        console.log(res);
    });
};

// function to check if password is in the most common password
const isPasswordCommon = (password, commonPasswords) => {
    return commonPasswords.includes(password);
};

// function to
const isPasswordStrong = (password) => {
    // Check for length
    if (password.length < 10) {
        return false;
    }

    // Check for at least 1 number
    if (!/\d/.test(password)) {
        return false;
    }

    // Check for repeated characters
    if (/(\w)\1\1/.test(password)) {
        return false;
    }

    // Check for number sequence
    if (/\d{3}/.test(password)) {
        return false;
    }

    // If all checks pass, return true
    return true;
};

module.exports.getPasswords = getPasswords;
module.exports.isPasswordCommon = isPasswordCommon;
module.exports.isPasswordStrong = isPasswordStrong;
