const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const db = require("./db");
let { hash, compare } = require("./bc");
console.log(hash);
const cookieSession = require("cookie-session");
let cookie_sec;
if (process.env.sessionSecret) {
    cookie_sec = process.env.sessionSecret;
} else {
    cookie_sec = require("./secrets").sessionSecret;
}

app.use(
    cookieSession({
        maxAge: 1000 * 6 * 50 * 14,
        secret: cookie_sec,
        // 2 weeks
    })
);
app.use(express.urlencoded({ extended: false }));
app.use(compression());

app.use(express.static(path.join(__dirname, "..", "client", "public")));
app.use(express.json());

app.get("/welcome", (req, res) => {
    // we need cookie Session middleware to run this
    if (req.session.userId) {
        // if the user is logged in...redirect away from /welcome
        res.redirect("/");
    } else {
        // user is not logged in...don't redirect
        // what happens after  sendFile, after we send our HTML back as a response,
        //is start.js
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

app.get("*", function (req, res) {
    if (!req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

app.post("/registration", (req, res) => {
    // console.log(req.body);
    // console.log(req.body.password);

    const { firstname, lastname, email, password } = req.body;

    hash(password).then((hashedPw) => {
        console.log("hashedPw in /registeration:", hashedPw);
        db.addRegisteration(firstname, lastname, email, hashedPw)
            .then((results) => {
                console.log(results);
                // console.log("Another user joined");
                req.session.userId = results.rows[0];
                return res.json(results.rows[0]);
            })
            .catch((err) => {
                console.log("errorMessage:Oops, something went wrong!!!", err);
            });
    });
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
