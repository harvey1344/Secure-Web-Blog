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

    // sanitise the user inputs
    name = sanitiseInput(name);
    userName = sanitiseInput(userName);
    email = sanitiseInput(email);
    password = sanitiseInput(password);

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
    const saltedPassword = password + salt;
    const hash = CryptoJS.SHA256(saltedPassword).toString();
    fetch("/register", {
        method: "POST",
        body: JSON.stringify({
            name,
            userName,
            email,
            hash,
            salt,
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
        },
    })
        .then(function (res) {
            if (!res.ok) {
                // Registration failed
                alert(
                    "Username or email in use. Please check if you allready have an account."
                );
                return Promise.reject(new Error("Registration failed"));
            } else {
                return res.json();
            }
        })
        .then(function (res) {
            code = res.twoFA;
            alert("2fa code = " + code.toString());
            let qr = qrcode(4, "L");
            qr.addData(code.toUpperCase());
            qr.make();

            // Create an image element with the QR code data
            let imgElement = document.createElement("img");
            imgElement.src = qr.createDataURL();

            // size for the QR code
            let size = 300;
            imgElement.style.width = size + "px";
            imgElement.style.height = size + "px";

            // Get the container elements
            let qrContainer = document.getElementById("qr");

            // Append the image to the QR code container
            qrContainer.appendChild(imgElement);

            showSuccessAlert();
        })
        .catch(function (error) {
            // do nothing :-(
        });
};

// function to check if password is in the most common password
const isPasswordCommon = (password, commonPasswords) => {
    return commonPasswords.includes(password);
};

//using regex to
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
    let alertBox = document.getElementById("alert");
    alertBox.style.display = "block";

    // Hide the alert after 2 mins
    setTimeout(function () {
        alertBox.style.display = "none";
        window.location.href = "/";
    }, 120000);
}

const generateSalt = (length) => {
    let chars =
        "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let salt = "";
    for (let i = 0; i < length; i++) {
        salt += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return salt;
};

function redirectToLogin() {
    window.location.href = "/";
}

module.exports.getPasswords = getPasswords;
module.exports.isPasswordCommon = isPasswordCommon;
module.exports.isPasswordStrong = isPasswordStrong;
