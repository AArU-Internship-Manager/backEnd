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

// router.use(fetchToken);
// router.use(verifyToken);

// generate api for update password
router.post('/change-password', (req, res, next) => {
    const { currentPassword, newPassword } = req.body;
    const sql = `SELECT password FROM user WHERE id=${req.id}`;
    pool.query(sql, (err, result) => {
        console.log(result)
        if (err) {
            console.log(err)
            res.status(404);
            res.send("error");
        } else {

            if (result[0]['password'] == currentPassword) {
                const sql1 = `UPDATE user SET password="${newPassword}" WHERE id=${req.id}`;
                pool.query(sql1, (err, result) => {
                    if (err) {
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

// generate api for  return university name,user name,email,phone number ,address,country
router.get('/user-details', (req, res, next) => {
    console.log(11111)
    const user_id = req.body.id;
    const sql = `select username from user where id=${user_id}`;
    pool.query(sql, (err, result) => {
        if (err) {
            res.status(404);
            res.send(err);
        } else {
            const username = result[0]['username'];
            const sql2 = `select EN_Name,AR_Name from country where id=(
                select country_id from city where id=(
                    select city_id from university where id=(
                        select university_id from representative where user_id=${user_id}
                    )   
                )
            )`;
            pool.query(sql2, (err, result) => {
                if (err) {
                    res.status(404);
                    res.send(err);
                } else {
                    const countryName = result[0];
                    const sql3 = `select EN_Name,AR_Name,email,phone,location_O from university where id=(
                        select university_id from representative where user_id=${user_id}
                        )`;
                    pool.query(sql3, (err, result) => {
                        if (err) {
                            res.status(404);
                            res.send(err);
                        } else {
                            const universityDetails = result[0];
                            res.status(200);
                            res.send({
                                username,
                                countryName,
                                universityDetails
                            });
                        }
                    })
                }
            })
        }
    })
})

function verifyToken(req, res, next) {
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
        const bearerToken = bearer[0]
        req.token = bearerToken;
        req.token = bearerToken
        next()
    } else {
        res.sendStatus(403)
    }
}


module.exports = router;