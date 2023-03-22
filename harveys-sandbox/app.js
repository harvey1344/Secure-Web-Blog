const express = require('express');
const cors = require('cors');

// set up server
const PORT = 5000;
const app = express();

// middleware
app.use(express.json());
app.use(cors());

// express routers
app.get('/', (req, res) => {
    res.sendFile('page.html', { root: './' });
});

app.get('/comp', (req, res) => {
    res.sendFile('bower_components/crypto-js/crypto-js.js', { root: '../' });
});

app.get('/js', (req, res) => {
    res.sendFile('cyrpto.js', { root: './' });
});

// run server
app.listen(PORT, () => {
    console.log('listening on port ' + PORT);
});
