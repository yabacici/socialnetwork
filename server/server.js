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

app.get("/welcome", function (req, res) {
    // if u dont have the cookiesession middleware this code will not work
    if (req.session.UserId) {
        res.redirect("/");
    } else {
        // user is not logged in... don't redirect!
        // what happens after send file, afetr we send out html back as a response,
        //is start.js
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

app.get("*", function (req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

app.post("/registration", (req, res) => {
    // console.log(req.body);
    // console.log(req.body.password);

    const { first, last, email, password } = req.body;

    hash(password).then((hashedPw) => {
        console.log("hashedPw in /registration:", hashedPw);
        db.insertRegister(first, last, email, hashedPw)
            .then((results) => {
                console.log(results);
                console.log("added to db");
                req.session.userId = results.rows[0].id;
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
