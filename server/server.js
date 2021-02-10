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
//         "ceb@gmail.com",
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
app.post("/registration", async (req, res) => {
    const { first, last, email, password } = req.body;
    try {
        // hash is async and returns a promise : the hashpassword
        // we store it i. a var bcuz we are excpecting sth out
        const hashedPw = await hash(password);
        const results = await db.addUser(first, last, email, hashedPw);
        req.session.userId = results.rows[0].id;
        return res.json({ user: results.rows[0], success: true });
    } catch (err) {
        console.log("err in POST/registration", err);
        res.json({ success: false });
    }
});

app.get("/login", (req, res) => {
    if (req.session.userId) {
        res.redirect("/login");
    } else {
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

app.post("/login", (req, res) => {
    const { email, password } = req.body;
    console.log("email pass: ", email, password);
    db.findUserByEmail(email).then(({ rows }) => {
        console.log("rows: ", rows);
        const hashedPw = rows[0].password;
        compare(password, hashedPw)
            .then((match) => {
                if (match) {
                    req.session.userId = rows[0].id;
                    req.session.loggedIn = rows[0].id;
                    res.json({ success: true });
                } else {
                    console.log("Your email or password doesn't exist");
                    res.json({ success: false });
                }
            })
            .catch((err) => {
                console.log("err in compare:", err);
                res.json({ success: false });
            });
    });
});

// user enters email
app.post("/password/reset/start", (req, res) => {
    console.log("here is the /password/reset/start route");
    const { email } = req.body;
    // verify the email address is in the users table
    db.findUserByEmail(email)
        .then(({ rows }) => {
            console.log(" real user !");
            console.log("rows :", rows);
            const dbEmail = rows[0].email;
            console.log("emaildb: ", dbEmail);
            const secretCode = cryptoRandomString({
                length: 6,
            });
            // generates secret code if email exists
            if (req.body.email === dbEmail) {
                // insert secret code in new table
                db.insertResetCode(secretCode, email).then((results) => {
                    console.log("results rows :", results.rows);
                    console.log("code added in db");
                    // if insert successful send user an email w/ code
                    sendEmail(
                        secretCode,
                        email,
                        "Here is your code to reset your password"
                    )
                        // if email sent successful send resp json indicating success
                        .then((results) => {
                            console.log("results rows :", results.rows);
                            console.log("yay, email sent!");
                            res.json({ success: true });
                        });
                });
            } else {
                console.log("Oops, error with code or email address");
                res.json({ success: false });
            }
        })
        .catch((err) => {
            console.log("there was an error in password reset: ", err);
            res.json({ success: false });
        });
});
// user enters code and new password
app.post("/password/reset/verify", async (req, res) => {
    console.log("verify route");
    console.log(req.body);
    const { code, password } = req.body;
    // find code in dt by email address
    db.verifyCode(code)
        .then((results) => {
            console.log(results.rows);
            if (!results.rows === req.body) {
                // compare code you got from client (req.body) with code in db
                console.log("error in verify code");
                return res.json({ success: false });
            } else {
                hash(password)
                    //when the 2 match then hash the password
                    .then((hashedPw) => {
                        db.insertNewPassword(hashedPw)
                            .then(() => {
                                // send json indicating success
                                res.json({ success: true });
                            })
                            .catch((err) => {
                                console.log("error with new password", err);
                                res.json({ success: false });
                            });
                    })
                    .catch((err) => {
                        console.log("error in hashedpw: ", err);
                        res.json({ success: false });
                    });
            }
        })
        .catch((err) => {
            console.log("Error verifying code: ", err);
        });
});

app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/");
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});

//////////WITHOUT ASYNC AWAIT////
// app.post("/registration", (req, res) => {
//     // console.log(req.body);
//     // console.log(req.body.password);

//     const { first, last, email, password } = req.body;

//     hash(password).then((hashedPw) => {
//         console.log("hashedPw in /registration:", hashedPw);
//         db.addUser(first, last, email, hashedPw)
//             .then((results) => {
//                 console.log(results);
//                 console.log("added to db");
//                 req.session.userId = results.rows[0].id;
//                 return res.json({ user: results.rows[0], success: true });
//             })
//             .catch((err) => {
//                 console.log("errorMessage:Oops, something went wrong!!!", err);
//                 res.json({ success: false });
//             });
//     });
// });
