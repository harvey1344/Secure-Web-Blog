const loginRequest = () => {
    console.log("Sending login request");
    // send login request to backend
    let userName = document.getElementById("userName").value;
    let password = document.getElementById("password").value;
    let twoFA = document.getElementById("twoFactor").value;

    userName = sanitizeInput(userName);
    password = sanitizeInput(password);
    twoFA = sanitizeInput(twoFA);

    key = "Work?";
    password = CryptoJS.AES.encrypt(password, key).toString();

    // send user details to database with use of fetch API
    fetch("/login", {
        // Adding method type
        method: "POST",
        // Adding body or contents to send
        body: JSON.stringify({
            userName,
            password,
            twoFA,
        }),
        // Adding headers to the request
        headers: {
            "Content-type": "application/json; charset=UTF-8",
        },
    }).then(function (res) {
        if (res.ok) {
            console.log("Login successful");
            // Registration successful
            showSuccessAlert();
        } else if (res.status === 429) {
            alert("Too many attempts, please try again later");
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
    var alertBox = document.getElementById("alert");
    alertBox.style.display = "block";

    // Hide the alert after 3 seconds
    setTimeout(function () {
        alertBox.style.display = "none";
        window.location.href = "/blog";
    }, 2000);
}
