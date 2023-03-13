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
    res.sendFile('home.html', { root: '../frontend' });
});

// run server
app.listen(PORT, () => {
    console.log('listening on port ' + PORT);
});
