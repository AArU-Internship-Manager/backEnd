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
router.post('/country', (req, res) => {
    const nameOfContry = req.body.contryName
    const sql = "select * from `country` where `EN_Name`='" + nameOfContry + "'";
    pool.query(sql, (err, result) => {
        if (err || result.length == 0) {
            res.status(404)
            res.send("error")
        }
        else {

            const id = result[0]['ID']
            res.json({
                id

            })
        }
    })
})


router.post('/cities', (req, res) => {
    const nameOfCity = req.body.cityName
    const sql = "select * from `city` where `EN_Name`='" + nameOfCity + "'";
    pool.query(sql, (err, result) => {
        if (err || result.length == 0) {
            res.status(404)
            res.send("error")
        }
        else {

            const id = result[0]['ID']
            const arName = result[0]['AR_Name']
            res.json({
                id,
                arName

            })
        }
    })
})

router.post('/universities', (req, res) => {
    const nameOfUniversity = req.body.universityName
    const sql = "select * from `university` where `EN_Name`='" + nameOfUniversity + "'";
    pool.query(sql, (err, result) => {
        if (err || result.length == 0) {
            res.status(404)
            res.send("error")
        }
        else {

            const id = result[0]['ID']
            const arName = result[0]['AR_Name']
            res.json({
                id,
                arName

            })
        }
    })
})

router.post('/supervisors', (req, res) => {
    const nameOfSupervisor = req.body.supervisorName
    const sql = "select * from `representative(user)` where `Name`='" + nameOfSupervisor + "'";
    pool.query(sql, (err, result) => {
        if (err || result.length == 0) {
            res.status(404)
            res.send("error")
        }
        else {

            const id = result[0]['ID']
            const Email = result[0]['Email']
            res.json({
                id,
                Email

            })
        }
    })
})


router.post('/offers', (req, res) => {
    const idOfOffer = req.body.offerId
    const sql = "select * from `offer` where `id`='" + idOfOffer + "'";
    pool.query(sql, (err, result) => {
        if (err || result.length == 0) {
            res.status(404)
            res.send("error")
        }
        else {

            const id = result[0]['id']
            const start_date = result[0]['start_date']
            res.json({
                id,
                start_date

            })
        }
    })
})





function verifyToken(req, res, next) {
    jwt.verify(req.token, 'khqes$30450#$%1234#900$!', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            type = authData.type
            if (type == 'Admin') {
                next()
            } else {
                res.sendStatus(401)
            }
        }
    })
}

function fetchToken(req, res, next) {
    const headrs = req.headers['authorization'];
    if (typeof headrs !== 'undefined') {
        const bearer = headrs.split(',')
        const bearerToken = bearer[0]
        req.token = bearerToken
        next()

    } else {
        res.sendStatus(403)
    }
}

module.exports = router;
