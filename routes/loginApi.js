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
    const sql = "select type ,username,id from `user` where `Username`='" + name + "' and `password`='" + password + "'";
    pool.query(sql, (err, result) => {
        if (err || result.length === 0) {
            res.status(404);
            res.send(err);
        } else {

            const role = result[0]['type'].toLowerCase();
            const username = result[0]['username'];
            const ability = [{
                "action": "manage",
                "subject": "all"
            }]
            jwt.sign({ user }, 'khqes$30450#$%1234#900$!', (err, accessToken) => {
                res.json({
                    accessToken,
                    role,
                    username,
                    ability
                })
            })

        }
    })
})

module.exports = router;
