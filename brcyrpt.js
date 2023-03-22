const bcyrpt = require('bcrypt');

pwd = 'password123';

salt = bcyrpt.genSaltSync(10);
hash = bcyrpt.hashSync(pwd, salt);
console.log('Password: ' + pwd + '|| Hash: ' + hash);

hashpwd = '$2b$10$UPajU/K1FtPEFQ6ZLf4tCOGVIzUqGnnuGvnLxeunJf4h2o9v6QrI6';

const isValid = bcyrpt.compareSync('password', hashpwd);

console.log(isValid);
