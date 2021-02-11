const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const cryptoRandomString = require("crypto-random-string");
const csurf = require("csurf");
const db = require("./db");
const s3 = require("./s3");
let { hash, compare } = require("./bc");
const { sendEmail } = require("./ses");
const cookieSession = require("cookie-session");
const multer = require("multer");
const uidSafe = require("uid-safe");
let cookie_sec;
if (process.env.sessionSecret) {
    cookie_sec = process.env.sessionSecret;
} else {
    cookie_sec = require("./secrets").sessionSecret;
}

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});
// middleware
const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

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
app.use(express.json());

app.get("/welcome", (req, res) => {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        // user is not logged in... don't redirect!
        // after a file is sent, we send out html back as a response,
        //is start.js
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

app.post("/registration", (req, res) => {
    // console.log(req.body);
    // console.log(req.body.password);

    const { first, last, email, password } = req.body;

    hash(password).then((hashedPw) => {
        console.log("hashedPw in /registration:", hashedPw);
        db.addUser(first, last, email, hashedPw)
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
//  endpoint to fetch the user data when App mounts.
//  route that returns the logged-in user's info.
app.get("/user", (req, res) => {
    console.log("user get route");
    console.log(req.session.userId);
    db.getUserData(req.session.userId)
        .then((results) => {
            console.log("getting user info");
            console.log("rows", results.rows[0]);
            res.json({ success: true, rows: results.rows[0] });
            //req.session.userId sends data back with res.json)
        })
        .catch((err) => {
            console.log("error fetching user data: ", err);
            res.json({ success: false });
        });
});

app.post("/profile-pic", uploader.single("file"), s3.upload, (req, res) => {
    console.log("I'm the post route user/profile-pic");
    const { filename } = req.file;
    let url =
        "https://cecile-socialnetwork.s3.amazonaws.com/" + req.file.filename; // create socialnet imgs
    console.log("req.session.userId: ", req.session.userId);

    if (filename) {
        db.uploadPic(req.session.userId, url)
            .then((results) => {
                console.log(results.rows);
                res.json({
                    rows: results.rows[0].profile_pic_url,
                    success: true,
                });
            })
            .catch((err) => {
                console.log("Error uploading profile pic: ", err);
                res.json({ success: false });
            });
    } else {
        console.log("no file or too large ");
        res.json({ success: false });
    }
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
            console.log("dbemail: ", dbEmail);
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
                        .then(() => {
                            // console.log("results rows :", results.rows);
                            // console.log("yay, email sent!");
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
app.post("/password/reset/verify", (req, res) => {
    // console.log("verify route");
    const { code, password } = req.body;
    // find code in dt by email address
    db.verifyCode(code)
        .then((results) => {
            const emailCode = results.rows[0].email;
            let currentCode = results.rows.find((row) => {
                console.log(row.code);
                console.log(req.body);
                return row.code === req.body.code;
            });
            console.log("this is a pw", password);
            console.log("code", code);
            console.log("currentcode:", currentCode);
            console.log("results", results.rows);
            if (currentCode) {
                // compare code you got from client (req.body) with code in db
                hash(password)
                    //when the 2 match then hash the password
                    .then((hashedPw) => {
                        db.insertNewPassword(emailCode, hashedPw)
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
                        // res.json({ success: false });
                    });
            } else {
                res.json({ success: false });
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
app.get("*", function (req, res) {
    if (!req.session.userId) {
        // if user not logged in redirect to welcome
        res.redirect("/welcome");
    } else {
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});

//////////WITH ASYNC AWAIT////
// app.post("/registration", async (req, res) => {
//     const { first, last, email, password } = req.body;
//     try {
//         // hash is async and returns a promise : the hashpassword
//         // we store it i. a var bcuz we are excpecting sth out
//         const hashedPw = await hash(password);
//         const results = await db.addUser(first, last, email, hashedPw);
//         req.session.userId = results.rows[0].id;
//         return res.json({ user: results.rows[0], success: true });
//     } catch (err) {
//         console.log("err in POST/registration", err);
//         res.json({ success: false });
//     }
// });
