
const express = require("express");
const session = require("express-session");
const CryptoJS = require("crypto-js");
const https = require("https");
const rateLimit = require("express-rate-limit");
const fs = require("fs");

require("dotenv").config({ path: "./config.env" });

const users = require("./users");
const login = require("./login");
const blog = require("./blog");
const { config } = require("dotenv");

// set up server
const app = express();

// middle ware to redirect the user if they make a http request
app.use((req, res, next) => {
    if (req.protocol === "http") {
        res.redirect(`https://${req.hostname}${req.url}`);
    } else {
        next();
    }
});


app.use(express.json());


// sets up the sessions middleware to use the secret stored in the .env file,
// to only send cookies over https, only be accaable via html, only be used on the owners website 
// and to expire after one day
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: true, // Ensures cookies are only sent over HTTPS
            httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
            sameSite: "strict", // Restricts the cookie to be sent only with same-site requests
            maxAge: 1000 * 60 * 60 * 24, // expiration time 1 day
        },
    })
);

// express routers
app.get("/hashing", (req, res) => {
    res.sendFile("bower_components/crypto-js/crypto-js.js", { root: "../" });
});

app.use("/", login);

app.use("/blog", checkSessionValidity, checkAuthenticated, blog);

app.get("/main.css", function (req, res) {
    res.sendFile("main.css", { root: "../frontend" });
});

app.get("/inputSterilisation.js", function (req, res) {
    res.sendFile("inputSterilisation.js", { root: "../frontend" });
});

app.get("/register.js", function (req, res) {
    res.sendFile("register.js", { root: "../frontend" });
});

app.get("/login.js", function (req, res) {
    res.sendFile("login.js", { root: "../frontend" });
});
app.get("/qr", function (req, res) {
    res.sendFile("qrcode.js", { root: "../frontend" });
});

app.get("/blog.js", (req, res) => {
    res.sendFile("blog.js", { root: "../frontend" });
});

app.get("/toppwd.text", function (req, res) {
    res.sendFile("100pwd.txt", { root: "../" });
});

app.get("/bad", function (req, res) {
    res.sendFile("/bad.html", { root: "../frontend" });
});

app.get("/logout", checkAuthenticated, function (req, res) {
    req.session.destroy((err) => {
        if (err) {
            res.status(409).send();
        } else {
            res.status(200).send();
        }
    });
});

app.use("/register", users);

function checkAuthenticated(req, res, next) {
    if (req.session.user_id) {
        next();
    } else {
        console.log("not authenticated");
        res.redirect("/");
    }
}

// middle ware to check for ip change and inactivity.
function checkSessionValidity(req, res, next) {
    let timeSinceLastRequest = performance.now() - req.session.lastRequest;
    // hashing the ip to compare to the hash stored in the session
    user_ip = CryptoJS.SHA256(req.socket.remoteAddress).toString();

    if (req.session.user_ip != user_ip) {
        console.log("ip changed");
        req.session.destroy((err) => {
            if (err) {
                console.log("error");
            } else {
                res.redirect("/");
            }
        });
        return;
    }

    if (timeSinceLastRequest > 1000 * 60 * 60) {
        // 1 hour
        console.log("session innactive");
        req.session.destroy((err) => {
            if (err) {
                console.log("error");
            } else {
                res.redirect("/");
            }
        });
        return;
    }
    // Setting the last request to the current time
    req.session.lastRequest = performance.now();
    next();
}

// parsing the file loctions for the https certificates
const httpsOptions = {
    key: fs.readFileSync("./certificates/key.pem"),
    cert: fs.readFileSync("./certificates/cert.pem"),
};

const httpsServer = https.createServer(httpsOptions, app);

httpsServer.listen(5000, () => {
    console.log("HTTPS server listening on port 5000");
});
