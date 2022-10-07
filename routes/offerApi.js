const express = require('express');
const router = express.Router();
const { createPool } = require('mysql');
var jwt = require('jsonwebtoken');
const { request } = require('express');
const pool = createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "swap-ar-uni",
    connectionLimit: "10",
});

router.use(fetchToken);
router.use(verifyToken);

router.get('/AutoComplete', (req, res) => {
    inst_name = req.query.inst_name
    inst_address = req.query.inst_address
    const sql = `SELECT * FROM org where name= "${inst_name}" and address = "${inst_address}" or name like "%${inst_name}%" and address like "%${inst_address}%" `
    pool.query(sql, (err, result) => {
        if (err) {
            res.status(404);
            res.send(err);
        } else {
            org_id = result[0]['id'] // save it  and send to the req 
            res.status(200);
            res.json(result)
        }
    })

})

router.post('/', (req, res, next) => {
    const sql1 = `SELECT university_id FROM representative WHERE user_id=${req.id}`
    console.log(sql1)
    pool.query(sql1, (err, result) => {
        if (err) {
            res.status(404);
            res.send(err);
        } else {
            university_id_src = result[0]['university_id']

        }
    })
    const { offer_date, requirement, work_description, work_type, start_date, end_date, Financial_support, offer_dead_line, University_id_des, organization_id, user_id, work_address, work_day, weekly_hours, daily_hours, collage, department, major, student_level, gender, work_field, provide_food, provide_dorm, provide_transportation, status } = req.body;

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
            req.id = authData.id
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