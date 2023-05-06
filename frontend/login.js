const loginRequest = () => {
    console.log('Sending login request');
    // send login request to backend
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let twoFA = document.getElementById('twoFactor').value;

    email = sanitizeInput(email)
    password = sanitizeInput(password)

    key = 'Work?';
    password = CryptoJS.AES.encrypt(password, key).toString();

    // send user details to database with use of fetch API
    fetch('/login', {
        // Adding method type
        method: 'POST',
        // Adding body or contents to send
        body: JSON.stringify({
            email,
            password,
            twoFA
        }),
        // Adding headers to the request
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    }).then(function (res) {
        if (res.ok) {
            console.log('Login successful');
            // Registration successful
            showSuccessAlert();
        } else {
            // Registration failed
            res.json().then(function (data) {
                alert(data.message);
            });
        }
    });
};

function showSuccessAlert() {
    // Show the alert
    var alertBox = document.getElementById('alert');
    alertBox.style.display = 'block';

    // Hide the alert after 3 seconds
    setTimeout(function () {
        alertBox.style.display = 'none';
        window.location.href = '/blog';
    }, 2000);
}
