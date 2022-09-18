const express = require('express');
const router = express.Router();
const { createPool } = require('mysql');
var jwt = require('jsonwebtoken');
const pool = createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "swap-ar-uni",
    connectionLimit: "10",
});

router.post('/', (req, res, next) => {
    const name = req.body.Username;
    const password = req.body.password;
    const user = req.body.Username;
    const sql = "select type ,username from `user` where `Username`='" + name + "' and `password`='" + password + "'";
    pool.query(sql, (err, result) => {
        if (err || result.length === 0) {
            res.status(404);
            res.send('not found');
        } else {
            const type = result[0]['type'];
            jwt.sign({ user, type }, 'khqes$30450#$%1234#900$!', (err, token) => {
                res.json({
                    token,
                    type
                })
            })

        }
    })
})

module.exports = router;
