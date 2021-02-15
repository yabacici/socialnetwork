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
    const q = `SELECT firstname FROM users WHERE firstname ILIKE $1;`;
    const params = [val + "%"];
    return db.query(q, params);
};
// module.exports.getMatchingUsers = (val) => {
//     const q = `SELECT * FROM users WHERE first ILIKE ($1) ORDER BY first ASC LIMIT 5`;
//     const params = [val + "%"];
//     return db.query(q, params);
// };
