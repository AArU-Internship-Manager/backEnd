const express = require("express");
const router = express.Router();
const { createPool } = require("mysql");
var jwt = require("jsonwebtoken");
const pool = createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "swap-ar-uni",
  connectionLimit: "10",
});
router.use(fetchToken);
router.use(verifyToken);

router.post("/country", (req, res) => {
  const nameOfContry = req.body.contryName;
  const sql = "select * from `country` where `EN_Name`='" + nameOfContry + "'";
  pool.query(sql, (err, result) => {
    if (err || result.length == 0) {
      res.status(404);
      res.send("error");
    } else {
      const id = result[0]["ID"];
      res.json({
        id,
      });
    }
  });
});

router.post("/cities", (req, res) => {
  const nameOfCity = req.body.cityName;
  const sql = "select * from `city` where `EN_Name`='" + nameOfCity + "'";
  pool.query(sql, (err, result) => {
    if (err || result.length == 0) {
      res.status(404);
      res.send("error");
    } else {
      const id = result[0]["ID"];
      const arName = result[0]["AR_Name"];
      res.json({
        id,
        arName,
      });
    }
  });
});
// generate api for get all universities
router.get("/universities", (req, res) => {
  const sql = "select * from `university`";
  pool.query(sql, (err, result) => {
    if (err || result.length == 0) {
      res.status(404);
      res.send("error");
    } else {
      res.json(result);
    }
  });
});

router.post("/offers", (req, res) => {
  const idOfOffer = req.body.offerId;
  const sql = "select * from `offer` where `id`='" + idOfOffer + "'";
  pool.query(sql, (err, result) => {
    if (err || result.length == 0) {
      res.status(404);
      res.send("error");
    } else {
      const id = result[0]["id"];
      const start_date = result[0]["start_date"];
      res.json({
        id,
        start_date,
      });
    }
  });
});

router.post("/add-university", (req, res) => {
  const {
    ID,
    city_id,
    EN_Name,
    AR_Name,
    Location_O,
    Study_business,
    work_day,
    hour_no_week,
    phone,
    Fax,
    hour_no_day,
    url,
    email,
  } = req.body;
  const sql = `insert into university (ID,city_id,EN_Name,AR_Name,Location_O,Study_business,work_day,hour_no_week,phone,Fax,hour_no_day,url,email) values ('${ID}','${1}','${EN_Name}','${AR_Name}','${Location_O}','${Study_business}','${work_day.toString()}','${hour_no_week}','${phone}','${Fax}','${hour_no_day}','${url}','${email}')`;

  pool.query(sql, (err, result) => {
    if (err) {
      res.status(404);
      res.send("error");
    } else {
      res.status(200);
      res.send("success");
    }
  });
});

function verifyToken(req, res, next) {
  jwt.verify(req.token, "khqes$30450#$%1234#900$!", (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      req.id = authData.id;
      next();
    }
  });
}

function fetchToken(req, res, next) {
  const headrs = req.headers["authorization"];
  if (typeof headrs !== "undefined") {
    const bearer = headrs.split(",");
    const bearerToken = bearer[0];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
}

module.exports = router;
