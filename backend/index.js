const express = require('express');
const session = require('express-session')

const cors = require('cors');
const users = require('./users');
const login = require('./login');
const blog = require('./blog')

// set up server
const PORT = 5000;
const app = express();

// middleware
app.use(express.json());
app.use(cors());

app.use(session({
    secret: 'test',
    resave: false,
    saveUninitialized: true
}))




// express routers
app.get('/hashing', (req, res) => {
    res.sendFile('bower_components/crypto-js/crypto-js.js', { root: '../' });
});

app.use('/', login);

app.use('/blog', blog);


app.get('/main.css', function (req, res) {
    res.sendFile('main.css', { root: '../frontend' });
});


app.get('/register.js', function (req, res) {
    res.sendFile('register.js', { root: '../frontend' });
});
app.get('/login.js', function (req, res) {
    res.sendFile('login.js', { root: '../frontend' });
});

app.get('/blog.js', (req, res) => {
    res.sendFile('blog.js', { root: '../frontend' });
});

app.get('/toppwd.text', function (req, res) {
    res.sendFile('100pwd.txt', { root: '../' });
});

app.use('/register', users);

// run server
app.listen(PORT, () => {
    console.log('listening on port ' + PORT);
});
