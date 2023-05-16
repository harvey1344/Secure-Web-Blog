/*
 * Author: Harvey Thompson
 * Date: 20/03/2023
 * Description: This file contains the code for the home page of the website.
 *             It is the first page that the user will see when they visit the website.
 */

// function to return an array of the most common passwords from a text file
const getPasswords = async () => {
    const response = await fetch("/toppwd.text");
    const data = await response.text();
    const dataArray = data.split("\n"); // split data by newlines to create an array
    return dataArray;
};

const getRegistration = async () => {
    // get array of top passwords from function
    let pwdArray = await getPasswords();
    pwdArray = pwdArray.map((pwd) => pwd.trim());

    // get the user details from the form
    let name = document.getElementById("Name").value;
    let userName = document.getElementById("userName").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    name = sanitizeInput(name);
    userName = sanitizeInput(userName);
    email = sanitizeInput(email);
    password = sanitizeInput(password);

    // check if password is common
    if (isPasswordCommon(password, pwdArray)) {
        alert("Password is too common");
        return;
    }
    if (!isPasswordStrong(password)) {
        alert("Password is not strong enough");
        return;
    }

    // salt the password before hashing
    // appened salt after pwd
    const salt = generateSalt(10);
    const saltedPassword = password + salt; // concatenate password and salt
    const hash = CryptoJS.SHA256(saltedPassword).toString();
    // send user details to database with use of fetch API
fetch("/csrf-token", {
        credentials: "include", // Include cookies in the request
    })
    .then((response) => response.json())
    .then((data) => {
        const csrfToken = data.csrfToken;
        return fetch("/register", {
            method: "POST",
            body: JSON.stringify({
            name,
            userName,
            email,
            hash,
            salt,
            }),
            headers: {
                "X-CSRF-Token": csrfToken,
                "Content-type": "application/json; charset=UTF-8",
            },
      })
    })
        .then(function (res) {
            if (!res.ok) {
                // Registration failed
                alert("User fail");
                return Promise.reject(new Error("Registration failed"));
            } else {
                return res.json();
            }
        })
        .then(function (res) {
            //console.log(res.body)
            alert("2fa code = " + res.twoFA);
            console.log("Registration successful");
            // Registration successful
            showSuccessAlert();
        })
        .catch((error) => {
            console.log("Error:", error);
            // Handle the error here
            //do nothing
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

function showSuccessAlert() {
    // Show the alert
    var alertBox = document.getElementById("alert");
    alertBox.style.display = "block";

    // Hide the alert after 3 seconds
    setTimeout(function () {
        alertBox.style.display = "none";
        window.location.href = "/";
    }, 3000);
}

function closeAlert() {
    var alertBox = document.getElementById("alert");
    alertBox.style.display = "none";
}

const generateSalt = (length) => {
    var chars =
        "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var salt = "";
    for (var i = 0; i < length; i++) {
        salt += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return salt;
};

function redirectToBlog() {
    window.location.href = "/blog";
}

module.exports.getPasswords = getPasswords;
module.exports.isPasswordCommon = isPasswordCommon;
module.exports.isPasswordStrong = isPasswordStrong;
