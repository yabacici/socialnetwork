const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres:postgres:postgres@localhost:5432/socialnet`
);

module.exports.addUser = (first, last, email, hashedPw) => {
    const q = `INSERT INTO users (first, last, email, password) VALUES ($1,$2,$3,$4) RETURNING id`;
    const params = [first, last, email, hashedPw];
    return db.query(q, params);
};

module.exports.findUserByEmail = (email) => {
    const q = `SELECT users.email, users.password, users.id FROM users WHERE email=$1`;
    const params = [email];
    return db.query(q, params);
};

module.exports.insertResetCode = (code, email) => {
    const q = `INSERT INTO reset_codes (code,email) VALUES ($1,$2) RETURNING *`;
    const params = [code, email];
    return db.query(q, params);
};

module.exports.verifyCode = () => {
    const q = `SELECT * FROM reset_codes
    WHERE CURRENT_TIMESTAMP - timestamp < INTERVAL '10 minutes'`;
    return db.query(q);
};

module.exports.insertNewPassword = (email, hashedPw) => {
    const q = `UPDATE users
    SET password = $2
    WHERE email = $1`;
    const params = [email, hashedPw];
    return db.query(q, params);
};

module.exports.getUserData = (userId) => {
    const q = `SELECT * FROM users WHERE id = $1`;
    const params = [userId];
    return db.query(q, params);
};

module.exports.uploadPic = (userId, profilePicUrl) => {
    const q = `UPDATE users
    SET profile_pic_url = $2
    WHERE id = $1 RETURNING profile_pic_url`;
    const params = [userId, profilePicUrl];
    return db.query(q, params);
};

module.exports.addBio = (userId, bio) => {
    const q = `UPDATE users
    SET bio = $2
    WHERE id = $1 RETURNING bio`;
    const params = [userId, bio];
    return db.query(q, params);
};

module.exports.getThreeUsers = () => {
    const q = `SELECT * FROM users ORDER BY id DESC LIMIT 3`;
    // const params = [id];
    return db.query(q);
};

module.exports.getMatchingUsers = (val) => {
    const q = `SELECT id, first, last, profile_pic_url  FROM users WHERE first ILIKE $1;`;
    const params = [val + "%"];
    return db.query(q, params);
};

module.exports.makeFriendRequest = (id, otherUser) => {
    const q = `insert into friendships (sender_id, recipient_id) values ($1, $2) returning accepted;`;
    const params = [id, otherUser];
    return db.query(q, params);
};

module.exports.checkFriendStatus = (recipientId, senderId) => {
    const q = `SELECT * FROM friendships
    WHERE (recipient_id = $1 AND sender_id = $2)
    OR (recipient_id = $2 AND sender_id = $1)`;
    const params = [recipientId, senderId];
    return db.query(q, params);
};

module.exports.createFriendship = (recipientId, senderId) => {
    const q = `INSERT INTO friendships (recipient_id, sender_id) 
     VALUES ($1, $2) RETURNING *`;
    const params = [recipientId, senderId];
    return db.query(q, params);
};
module.exports.acceptFriendReq = (senderId, recipientId) => {
    const q = `UPDATE friendships
    SET accepted = true
    WHERE sender_id = $1 AND recipient_id = $2 OR recipient_id = $1 AND sender_id = $2
    RETURNING accepted`;
    const params = [senderId, recipientId];
    return db.query(q, params);
};

module.exports.unfriend = (recipientId, senderId) => {
    const q = `DELETE FROM friendships WHERE recipient_id = $1 AND sender_id = $2
    OR sender_id = $1 AND recipient_id = $2`;
    const params = [recipientId, senderId];
    return db.query(q, params);
};
// this route will retrieve the list of friends and wannabes from the database and send it back to the client
// this will return users that you're friends with and users who have sent YOU a friend request.
//  Users that you've sent a friend request to will NOT show up in this query.

module.exports.friendsWannabesList = (userId) => {
    const q = `SELECT users.id, first, last, profile_pic_url, accepted, sender_id
    FROM friendships
    JOIN users
    ON (accepted = false AND recipient_id = $1 AND sender_id = users.id)
    OR (accepted = false AND recipient_id = users.id AND sender_id = $1)
    OR (accepted = true AND recipient_id = $1 AND sender_id = users.id)
    OR (accepted = true AND sender_id = $1 AND recipient_id = users.id)`;
    const params = [userId];
    return db.query(q, params);
};

module.exports.delProfilePic = (userId) => {
    const q = `UPDATE users
    SET profile_pic_url = null
    WHERE id = $1 returning profile_pic_url, id`;
    const params = [userId];
    return db.query(q, params);
};

//  to get the ten most recent messages
//  (JOIN the users table to get first, last, image url)
module.exports.showRecentMessages = () => {
    const q = `SELECT message.sender_id, message.message, message.created_at, users.first, users.last, users.profile_pic_url, message.id 
    FROM message
    JOIN users
    ON sender_id = users.id
    ORDER BY message.id DESC LIMIT 10`;

    return db.query(q);
};
module.exports.addMessage = (senderId, message) => {
    const q = `INSERT INTO message (sender_id, message) 
    VALUES ($1, $2) RETURNING *`;
    const params = [senderId, message];
    return db.query(q, params);
};
module.exports.getLastMessage = () => {
    const q = `SELECT message.sender_id, message.message, message.created_at, users.first, users.last, users.profile_pic_url, message.id
    FROM message
    JOIN users
    ON sender_id = users.id
    ORDER BY message.id DESC LIMIT 1`;

    return db.query(q);
};

module.exports.deleteChatMessage = (messageId) => {
    const q = `DELETE FROM message WHERE id = $1 RETURNING *`;
    const params = [messageId];
    return db.query(q, params);
};
