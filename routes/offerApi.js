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
    const { offer_date, university_id_src, requirement, work_description, work_type, start_date, end_date, Financial_support, offer_dead_line, University_id_des, organization_id, user_id, work_address, work_day, weekly_hours, daily_hours, collage, department, major, student_level, gender, work_field, provide_food, provide_dorm, provide_transportation, status } = req.body;

    const sql = `INSERT INTO offer (offer_date, university_id_src,requirement, work_description, work_type, start_date,end_date,Financial_support, offer_dead_line,	University_id_des, organization_id,	user_id, work_address, work_day, weekly_hours, daily_hours,collage, department, major, student_level, gender, work_field, status,provide_food, provide_dorm, provide_transportation)
     VALUES ("${offer_date}", ${university_id_src}, "${requirement}", "${work_description}", "${work_type}",
      "${start_date}", "${end_date}", "${Financial_support}", "${offer_dead_line}", ${University_id_des}, 
      ${organization_id}, ${user_id}, "${work_address}", "${work_day}", ${weekly_hours}, ${daily_hours},
      "${collage}", "${department}", "${major}", "${student_level}","${gender}", "${work_field}", "${status}",
      "${provide_food}", "${provide_dorm}", "${provide_transportation}")`;

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