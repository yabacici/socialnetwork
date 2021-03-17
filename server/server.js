const express = require("express");
const app = express();
///////////socket io boilerplate /////////
const server = require("http").Server(app);
const io = require("socket.io")(server, {
    allowRequest: (req, callback) =>
        callback(null, req.headers.referer.startsWith("http://localhost:3000")),
});
///////////////////////////////////////////
const compression = require("compression");
const path = require("path");
const cryptoRandomString = require("crypto-random-string");
const csurf = require("csurf");
const db = require("./db");
const s3 = require("./s3");
let { hash, compare } = require("./bc");
const { sendEmail } = require("./ses");
const cookieSession = require("cookie-session");
const secret = require("./secrets");

const multer = require("multer");
const uidSafe = require("uid-safe");
// let cookie_sec;
// if (process.env.sessionSecret) {
//     cookie_sec = process.env.sessionSecret;
// } else {
//     cookie_sec = require("./secrets").sessionSecret;
// }
// console.log(cookie_sec);

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

// app.use(
//     cookieSessionMiddleware({
//         maxAge: 1000 * 6 * 50 * 14,
//         keys: ["AWS_KEY", "AWS_SECRET"],
//         secret: secret,
//         // 2 weeks
//     })
// );

const cookieSessionMiddleware = cookieSession({
    maxAge: 1000 * 6 * 50 * 14,
    keys: ["AWS_KEY", "AWS_SECRET"],
    secret: secret,
    // 2 weeks
});

app.use(cookieSessionMiddleware);
io.use(function (socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

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
//  endpoint to fetch the user data when App mounts.
//  route that returns the logged-in user's info.
app.get("/api/user", (req, res) => {
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

app.get("/users", (req, res) => {
    db.getThreeUsers()
        .then((results) => {
            console.log("get three registered");
            console.log("results", results.rows);
            res.json(results.rows);
        })
        .catch((err) => {
            console.log("error getting 3 registered: ", err);
            res.json({ success: false });
        });
});

app.get("/findpeople/:val", (req, res) => {
    // const userId = req.session.userId;
    const val = req.params.val;
    console.log("this is val:", val);
    // console.log("this is req.params", req.params);
    db.getThreeUsers()
        .then((results) => {
            console.log("get three registered");
            console.log("results", results.rows);
        })
        .catch((err) => {
            console.log("error getting 3 registered: ", err);
            res.json({ success: false });
        });
    db.getMatchingUsers(val)
        .then((results) => {
            console.log("results", results.rows);
            res.json(results.rows);
        })
        .catch((err) => {
            console.log("error fetching user data: ", err);
            res.json({ success: false });
        });
});

app.post("/profile-pic", uploader.single("file"), s3.upload, (req, res) => {
    console.log("I'm the post route user/profile-pic");
    const { filename } = req.file;
    let url = "https://cecile-imageboard.s3.amazonaws.com/" + req.file.filename; // create socialnet imgs
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

app.post("/delete-profile-pic", async (req, res) => {
    try {
        const userId = req.session.userId;
        const def = ["default.jpg"];
        console.log("id in /delete: ", userId);
        console.log("/delete here");
        await db.delProfilePic(userId, def);
        res.json({
            sucess: true,
        });
    } catch (err) {
        console.log("err in del profilePic: ", err);
    }
});

// create bio column in users db

app.post("/bio", (req, res) => {
    console.log(" bio route page");
    const { bio } = req.body;

    db.addBio(req.session.userId, bio)
        .then((results) => {
            console.log("results rows:", results.rows[0].bio);
            res.json({ success: true, bio: results.rows[0].bio });
        })
        .catch((err) => {
            console.log(" error in edit bio: ", err);
            res.json({ success: false });
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
                console.log("error with code or email address");
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
// Create a new route for retrieving the user's information by id
// Get the user information from the database & make sure you handle requests for non-existing users!
// Return a JSON response

app.get("/user-display/:id", (req, res) => {
    const { id } = req.params;
    console.log("id: ", id);
    console.log("req.session.userId", req.session.userId);

    db.getUserData(id)
        .then((results) => {
            console.log("get user data");
            console.log("results rows", results.rows[0]);

            res.json({
                rows: results.rows[0],
                cookie: req.session.userId,
                success: true,
            });
        })
        .catch((err) => {
            console.log("error getting user data: ", err);
            res.json({ success: false });
        });
});
app.get("/friendship-status/:id", (req, res) => {
    const loggedInUser = req.session.userId;
    const requestedUserId = req.params.id;
    // console.log("requestedUser: ", requestedUserId);

    db.checkFriendStatus(requestedUserId, loggedInUser)
        .then((results) => {
            if (results.rows.length == 0) {
                res.json({
                    button: "send",
                    friends: false,
                });
            } else if (results.rows.length > 0 && results.rows[0].accepted) {
                res.json({
                    button: "end",
                    friends: true,
                });
            } else if (results.rows.length > 0 && !results.rows[0].accepted) {
                if (loggedInUser == results.rows[0].sender_id) {
                    res.json({
                        button: "cancel",
                    });
                } else if (loggedInUser == results.rows[0].recipient_id) {
                    // db.recipient(
                    // req.session.userID,
                    // req.params.id );
                    res.json({
                        button: "accept",
                        friends: false,
                    });
                }
            }
        })
        .catch((err) => {
            console.log("err in friendshipstatus/id: ", err);
            res.json({ success: false });
        });
});
// user friendship request
app.post("/friendship/send", async (req, res) => {
    const results = await db.makeFriendRequest(req.session.userId, req.body.id);
    console.log(results.rows);
    res.json({
        friends: false,
        button: "Cancel Friend Request",
    });
    // .catch((err) => {
    //     console.log("error in friendship send", err);
    //     res.json({ success: false });
    // });
});
// USE TRY AND CATCH
app.post("/friendship/accept/", async (req, res) => {
    const results = await db.acceptFriendReq(req.session.userId, req.body.id);
    console.log(results.rows);
    res.json({
        friends: true,
        button: "End",
    });
    // .catch((err) => {
    //     console.log("error in friendship accept", err);
    //     res.json({ success: false });
    // });
});

app.post("/friendship/end", async (req, res) => {
    const results = await db.unfriend(req.session.userId, req.body.id);
    console.log(results.rows);
    res.json({
        friends: false,
        //Send Friend Request,
        button: "Send",
    });
    // .catch((err) => {
    //     console.log("error in friendship end", err);
    //     res.json({ success: false });
    // });
});

app.get("/friends-wannabes", async (req, res) => {
    console.log("this is the friends wannabes route:");
    const results = await db.friendsWannabesList(req.session.userId);
    console.log(results.rows);
    res.json({
        rows: results.rows,
        success: true,
    });
    // .catch((err) => {
    //     console.log("error in friends wannabes", err);
    //     res.json({ success: false });
    // });
});

// use ancher tag href= logout
app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/");
});
//
app.get("*", function (req, res) {
    if (!req.session.userId) {
        // if user not logged in redirect to welcome
        res.redirect("/welcome");
    } else {
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

server.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
io.on("connection", async (socket) => {
    // Confirm the user is logged in by finding the user's id in socket.request.session.
    // If the user id is not there, disconnect the socket connection
    console.log("helloooo");
    const { userId } = socket.request.session;
    if (!userId) {
        return socket.disconnect(true);
    }

    // need db query to get info by userId
    socket.on("chatMessage", async (textMessage) => {
        // Start listening for the event that the client will emit to send a chat message.
        // When this event is received you must:
        // Insert the new message into the table
        // Do another query to get the message sender's first, last, and image url by their user id.
        try {
            console.log("textMessage: ", textMessage);
            await db.addMessage(userId, textMessage);
            const newMessage = await db.getLastMessage();
            // Emit an event to ALL clients (io.emit) with the new chat message object as the payload
            io.emit("newMessage", newMessage.rows[0]);
        } catch (err) {
            console.log("err in chatMessg", err);
        }
    });
    try {
        // Emit an event to the client that just connecting
        // containing the ten most recent messages
        // Get the ten most recent out of the db.
        // Use reverse to get them into chronological order if necessary
        const results = await db.showRecentMessages();
        //the results are MESSAGES
        io.emit("chatMessages", results.rows.reverse());
    } catch (err) {
        console.log("err in chatMessg", err);
    }
    // bonus feature
    // ({ messageId }) means that I am only interested in the property of messageId
    socket.on("delete", async ({ messageId }) => {
        console.log("socket delete");
        console.log("this is the msg ID: ", messageId);
        try {
            const results = await db.deleteChatMessage(messageId);
            console.log("results: ", results.rows);
            io.emit("deleteMsg", messageId);
        } catch (err) {
            console.log("err in message db: ", err);
        }
    });
});

// io.on("connection", (socket) => {
//     // console.log(socket);
//     // id prop created there in socket
//     console.log(`Socket with id: ${socket.id} has CONNECTED`);
//     const { userId } = socket.request.session;
//     if (userId) {
//         return socket.disconnect(true);
//     }
//     // socket.on("chatMessage", async text => {
//     //     console.log(`Socket with id: ${socket.id} just DISCONNECTED`);
//     // });
// });

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
