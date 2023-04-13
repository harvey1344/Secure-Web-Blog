const express = require('express');
const cors = require('cors');
const users = require('./users');

// set up server
const PORT = 5000;
const app = express();

// middleware
app.use(express.json());
app.use(cors());

// express routers
app.get('/hashing', (req, res) => {
    res.sendFile('bower_components/crypto-js/crypto-js.js', { root: '../' });
});

app.get('/', (req, res) => {
    res.sendFile('home.html', { root: '../frontend' });
});

app.get('/login', (req, res) => {
    res.sendFile('login.html', { root: '../frontend' });
});

app.get('/main.css', function (req, res) {
    res.sendFile('main.css', { root: '../frontend' });
});

app.get('/home.js', function (req, res) {
    res.sendFile('home.js', { root: '../frontend' });
});

app.get('/toppwd.text', function (req, res) {
    res.sendFile('100pwd.txt', { root: '../' });
});

app.use('/register', users);

// run server
app.listen(PORT, () => {
    console.log('listening on port ' + PORT);
});
