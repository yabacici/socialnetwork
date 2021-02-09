const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres:postgres:postgres@localhost:5432/socialnet`
);

module.exports.insertRegister = (first, last, email, hashedPw) => {
    const q = `INSERT INTO users (first, last, email, password) VALUES ($1,$2,$3,$4) RETURNING id`;
    const params = [first, last, email, hashedPw];
    return db.query(q, params);
};

module.exports.getLoginData = (email, hashedPw, usersId) => {
    const q = `SELECT  users.email, users.password, users.id FROM users`;
    const params = [email, hashedPw, usersId];
    return db.query(q, params);
};
