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

router.use(fetchToken);
router.use(verifyToken);

// generate api for update password
router.post('/change-password', (req, res, next) => {
    console.log(1111111, "aaaaaaaa")
    const { currentPassword, newPassword } = req.body;
    console.log(currentPassword, newPassword)
    const sql = `SELECT password FROM user WHERE id=${req.id}`;
    pool.query(sql, (err, result) => {
        console.log(result)
        if (err) {
            console.log(err)
            res.status(404);
            res.send("error");
        } else {

            if (result[0]['password'] == currentPassword) {
                console.log(1111111, "bbbbbb")

                const sql1 = `UPDATE user SET password="${newPassword}" WHERE id=${req.id}`;
                pool.query(sql1, (err, result) => {
                    if (err) {
                        console.log("error")
                        res.status(404);
                        res.send(err);
                    } else {
                        res.status(200);
                        res.send({
                            message: "password updated"
                        });
                    }
                })
            } else {
                res.status(404);
                res.send({
                    message: "current password is wrong"
                });
            }
        }
    })
})



function verifyToken(req, res, next) {
    console.log(12344422)
    jwt.verify(req.token, 'khqes$30450#$%1234#900$!', (err, authData) => {
        console.log(err)
        if (err) {
            res.sendStatus(403);
        } else {
            req.id = authData.id

            next()
        }
    })
}

function fetchToken(req, res, next) {
    const headrs = req.headers['authorization'];
    if (typeof headrs !== 'undefined') {
        const bearer = headrs.split(',')
        console.log(bearer)
        const bearerToken = bearer[0]
        req.token = bearerToken;
        req.token = bearerToken
        console.log(req.token, 11111111111)
        next()
    } else {
        res.sendStatus(403)
    }
}


module.exports = router;