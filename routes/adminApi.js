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


router.post("/add-user", (req, res) => {
  const {
    username,
    password,
    type,
    email,
    phone,
    fax,
    university_id,
    start_date,
    end_date,
  } = req.body;
  const sql = `select * from user where username='${username}'`;
  pool.query(sql, (err, result) => {
    if (err) {
      return res.json({ status: 400, message: "error" });
    } else if (result.length > 0) {
      return res.json({ status: 400, message: "username already exists" });
    } else {
      const sql2 = `insert into user (username,password,type) values ('${username}','${password}','${type}')`;
      pool.query(sql2, (err, result) => {
        if (err) {
          return res.json({ status: 400, message: "error" });
        } else {
          const sql3 = `select id from user where username='${username}'`;
          pool.query(sql3, (err, result) => {
            if (err) {
              return res.json({ status: 400, message: "error" });
            } else {
              const id = result[0]["id"];
              const sql4 = `insert into representative (user_id,email,phone,fax,university_id,start_date,end_date,status) values ('${id}','${email}','${phone}','${fax}',${university_id},'${start_date}','${end_date}',1)`;
              pool.query(sql4, (err, result) => {
                if (err) {
                  return res.json({ status: 400, message: "error" });
                } else {
                  return res.json({ status: 200, message: "success" });
                }
              });
            }
          });
        }
      });
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
