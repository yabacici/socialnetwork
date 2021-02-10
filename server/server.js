const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const cryptoRandomString = require("crypto-random-string");
const csurf = require("csurf");
const db = require("./db");
let { hash, compare } = require("./bc");
console.log(hash);
const { sendEmail } = require("./ses");
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

app.use(csurf());

app.use(function (req, res, next) {
    console.log(csurf);
    res.cookie("mytoken", req.csrfToken());
    next();
});
app.use(express.urlencoded({ extended: false }));
app.use(compression());

app.use(express.static(path.join(__dirname, "..", "client", "public")));
// app.post("password/reset/start", (req, res) => {
//     const secretCode = cryptoRandomString({
//     length: 6
// });

// app.post("/someRoute", function (req, res) {
//     sendEmail(
//         "cecileeboa@gmail.com",
//         "1284712874",
//         "here is your reset password code"
//     )
//         .then(() => {
//             console.log("yay");
//         })
//         .catch((err) => {
//             console.log("there is an error!", err);
//         });
// });

app.use(express.json());

app.get("/welcome", function (req, res) {
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
                return res.json({ user: results.rows[0], success: true });
            })
            .catch((err) => {
                console.log("errorMessage:Oops, something went wrong!!!", err);
                res.json({ success: false });
            });
    });
});

app.get("/login", (req, res) => {
    if (req.session.userId) {
        res.redirect("/login");
    } else {
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

app.post("/login", (req, res) => {
    const { email, pass } = req.body;
    console.log("email pass: ", email, pass);
    db.findUserByEmail(email).then(({ rows }) => {
        console.log("rows: ", rows);
        const hashedPw = rows[0].password;
        compare(pass, hashedPw)
            .then((match) => {
                if (match) {
                    req.session.userId = rows[0].id;
                    req.session.loggedIn = rows[0].id; // check if necessary
                } else {
                    console.log(
                        "errorMessage:This email or password doesn't exist"
                    );
                }
            })
            .catch((err) => {
                console.log("err in compare:", err);
                res.json({ success: false });
            });
    });
});

app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/");
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
