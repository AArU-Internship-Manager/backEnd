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
    const sql = `select type ,username,id from user where Username= "${name}" and password="${password}"`;
    console.log(sql)
    pool.query(sql, (err, result) => {
        if (err || result.length === 0) {
            res.status(404);
            res.send('not found');
        } else {
            const role = result[0]['type'].toLowerCase();
            const id = result[0]['id'];
            console.log(id);
            const username = result[0]['username'];
            const ability = [{
                "action": "manage",
                "subject": "all"
            }]
            jwt.sign({ user, role, id }, 'khqes$30450#$%1234#900$!', (err, accessToken) => {
                console.log(accessToken);
                const sql1 = `SELECT EN_Name  FROM university WHERE ID=(SELECT university_id from representative WHERE user_id=${id})`;
                pool.query(sql1, (err, result) => {
                    if (err || result.length === 0) {
                        res.json({
                            username,
                            ability,
                            accessToken,
                            role,

                        })
                    } else {
                        console.log(result);
                        uni_name = result[0]['EN_Name']
                        res.json({
                            username,
                            ability,
                            uni_name,
                            accessToken,
                            role,

                        })

                    }
                })






            })

        }
    })
})

module.exports = router;
