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
router.post('/country',(req, res) => {
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

function verifyToken(req,res,next){
    jwt.verify(req.token,'khqes$30450#$%1234#900$!',(err,authData)=>{
        if(err){
            res.sendStatus(403);
        }else{
            //TODO: add role check
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
