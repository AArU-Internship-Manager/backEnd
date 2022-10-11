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

router.post('/', (req, res, next) => {
    const sql1 = `SELECT university_id FROM representative WHERE user_id=${req.id}`;
    pool.query(sql1, (err, result) => {
        if (err) {
            res.status(404);
            res.send(err);
        } else {
            const university_id = result[0]['university_id'];
            const { address,
                birthDate,
                birthPlace,
                college,
                email,
                fluencyInEnglish,
                gender,
                id,
                healthStatus,
                name,
                nationality,
                passportExpiryDate,
                passportNumber,
                phone,
                studyYearFinished,
                studyYears,
                totalCreditHours,
                universityMajor } = req.body;
            const sql = `INSERT INTO student_e (ID,full_name, nationality, university_id , college, major, birth_place, gender, phone, email,  location, passport_id, health_status, study_year, total_study_year, fluency_in_English, total_hour, passport_end_date, birth_date)
             VALUES (${id},"${name}", "${nationality}", ${university_id}, "${college}", "${universityMajor}","${birthPlace}","${gender}", "${phone}", "${email}","${address}", "${passportNumber}","${healthStatus}", "${studyYearFinished}", "${studyYears}", "${fluencyInEnglish}", ${totalCreditHours}, "${passportExpiryDate}", "${birthDate}")`;
            pool.query(sql, (err, result) => {
                if (err) {
                    res.status(403);
                    return res.json("this id is in use");
                } else {
                    res.status(200);
                    res.send("ur data insert")
                }
            })
        }
    })
})

function verifyToken(req, res, next) {
    jwt.verify(req.token, 'khqes$30450#$%1234#900$!', (err, authData) => {
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
        const bearer = headrs.split(',');
        const bearerToken = bearer[0];
        req.token = bearerToken
        next()
    } else {
        res.sendStatus(404).json({ message: "you are not authorized" })
    }
}


module.exports = router;


