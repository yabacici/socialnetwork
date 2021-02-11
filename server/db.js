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
