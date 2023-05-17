const loginRequest = () => {
    let userName = document.getElementById("userName").value;
    let password = document.getElementById("password").value;
    let twoFA = document.getElementById("twoFactor").value;

    // sanitise user input
    userName = sanitiseInput(userName);
    password = sanitiseInput(password);
    twoFA = sanitiseInput(twoFA);

    // encrypts the user password for sending
    key = "twoMan!";
    password = CryptoJS.AES.encrypt(password, key).toString();

    // send user details to database with use of fetch API
    fetch("/login", {
        method: "POST",
        body: JSON.stringify({
            userName,
            password,
            twoFA,
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
        },
    }).then(function (res) {
        if (res.ok) {
            showSuccessAlert();
        } else if (res.status === 429) {
            // handles too many requests
            alert("Too many attempts, please try again later");
        } else {
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
