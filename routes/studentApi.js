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
    const { full_name, nationality, university_id, collage, study_field, birth_place, gender, passport_end_date, phone, email, birth_date, location, passport_id, Section, Scientific_level, health_status, study_year, total_study_year, fluency_in_English, total_hour } = req.body;


    const sql = `INSERT INTO student_e (full_name, nationality, university_id, collage, study_field, birth_place, gender, phone, email,  location, passport_id, Section, Scientific_level, health_status, study_year, total_study_year, fluency_in_English, total_hour, passport_end_date, birth_date)
     VALUES ("${full_name}", "${nationality}", ${university_id}, "${collage}", "${study_field}","${birth_place}","${gender}", ${phone}, "${email}","${location}", ${passport_id}, "${Section}", "${Scientific_level}","${health_status}", "${study_year}", "${total_study_year}", "${fluency_in_English}", ${total_hour}, "${passport_end_date}", "${birth_date}")`;
    console.log(sql)
    pool.query(sql, (err, result) => {
        if (err) {
            res.status(404);
            res.send(err);
        } else {
            res.status(200);
            res.send("ur data insert")
        }
    })
})

function verifyToken(req, res, next) {
    jwt.verify(req.token, 'khqes$30450#$%1234#900$!', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            next()
        }
    })
}

function fetchToken(req, res, next) {
    const headrs = req.headers['authorization'];
    if (typeof headrs !== 'undefined') {
        const bearer = headrs.split(' ')
        const bearerToken = bearer[1]
        req.token = bearerToken
        next()
    } else {
        res.sendStatus(403)
    }
}


module.exports = router;