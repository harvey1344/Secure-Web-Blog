let text = 'Hello World!';
console.log(text);

let encryptedMessage = CryptoJS.AES.encrypt(text, 'mySecretKey').toString();
console.log(encryptedMessage);
