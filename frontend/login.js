async function loginRequest() {
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let twoFA = document.getElementById('twoFactor').value;
  
    // Sterilise input values
    email = sterilise(email);
    password = sterilise(password);
    twoFA = sterilise(twoFA);
  
    // Encrypt the password before sending it
    password = CryptoJS.AES.encrypt(password, 'Work?').toString();
  
    try {
      const response = await fetch('/login', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, twoFA }),
      });
  
      if (response.ok) {
        document.getElementById('alert').style.display = 'block';
        // Show the 2FA setup section after successful login
        document.getElementById('twoFactorSetup').style.display = 'block';
      } else {
        console.error('Error logging in:', response.status);
      }
    } catch (error) {
      console.error('Error fetching login:', error);
    }
}
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

async function generate2FASecret() {
    try {
      const response = await fetch('/setup2FA', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        document.getElementById('qrCode').innerHTML = `<img src="${data.qrCodeUrl}" alt="QR Code">`;
        document.getElementById('manualKey').innerText = `Manual Key: ${data.manualKey}`;
        document.getElementById('twoFactorSetup').style.display = 'block';
      } else {
        console.error('Error generating 2FA secret:', response.status);
        console.log('ERROR GENERTING 2FA SECRET ')
      }
    } catch (error) {
      console.error('Error fetching 2FA secret:', error);
    }
  }
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('enable2FA').addEventListener('click', generate2FASecret);
  });