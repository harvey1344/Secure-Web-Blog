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
    fetch('/csrf-token', {
        credentials: 'include' // Include cookies in the request
      })
        .then(response => response.json())
        .then(data => {
          const csrfToken = data.csrfToken;
          return fetch("/login", {
            method: "POST",
            body: JSON.stringify({
              userName,
              password,
              twoFA,
              _csrf: csrfToken // add csrf token to request body
            }),
            headers: {
              "X-CSRF-Token": csrfToken,
              "Content-type": "application/json; charset=UTF-8",
            },
          });
        })
        .then(response => {
          if (!response.ok) {
            return response.text().then(error => { throw new Error(error) });
          }
          return response.text(); // Parse response as text
        })
        .then(text => {
          // Handle successful response
          if (text === "Login successful") {
            console.log("Login successful");
            showSuccessAlert();
          } else {
            alert(text); // Display the response text as an error message
          }
        })
        .catch(error => {
          console.log("Error:", error);
        });
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
