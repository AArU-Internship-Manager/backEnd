const express = require("express");
const router = express.Router();
const md5 = require("md5");
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

router.post("/add-user", (req, res) => {
  const {
    username,
    password,
    name,
    email,
    AR_Name,
    EN_Name,
    phone,
    Fax,
    hour_no_week,
    hour_no_day,
    Location_O,
    Study_buisness,
    url,
    city_id,
    avatar,
  } = req.body;
  try {
    let userSql = `select username from user where username='${username}'`;
    pool.query(userSql, (err, result) => {
      if (err || result.length > 0) {
        res.status(400).send("username is already in use");
        return;
      }

      let universitySql = `select ID from university where email='${email}' or phone='${phone}' or url='${url}' or (EN_Name='${EN_Name}' and AR_Name='${AR_Name}')`;
      pool.query(universitySql, (err, result) => {
        if (err || result?.length > 0) {
          res.status(400).send("university details are already in use");
          return;
        }

        let sql = `insert into university (En_Name,Ar_Name,Location_O,Study_business,phone,Fax,
          hour_no_week,hour_no_day,url, city_id, email) values 
          ('${EN_Name}','${AR_Name}','${Location_O}','${Study_buisness}','${phone}',
          '${Fax}','${hour_no_week}','${hour_no_day}','${url}', '${city_id}', '${email}')`;
        pool.query(sql, (err, result) => {
          if (err) {
            res
              .status(400)
              .send("error adding to university, try refreshing the page");
            return;
          }
          console.log(avatar);
          let userSql = `insert into user (username,password,type,name, avatar) values
        ('${username}','${md5(password)}','user','${name}', '${avatar}')`;

          pool.query(userSql, (err, result) => {
            if (err) {
              res
                .status(400)
                .send("error adding to user, try refreshing the page");
              return;
            }
            let userSql = `select id from user where username='${username}'`;
            pool.query(userSql, (err, result) => {
              if (err) {
                res.status(400).send("username not found");
                return;
              }

              let userId = result[0]["id"];

              let universitySql = `select ID from university where email='${email}' and phone='${phone}' and url='${url}' and city_id='${city_id}' and EN_Name='${EN_Name}'`;
              pool.query(universitySql, (err, result) => {
                if (err) {
                  res.status(400).send("university not found");
                  return;
                }
                let universityId = result[0]["ID"];

                let sql = `insert into representative (university_id, start_date, user_id) values('${universityId}','${new Date()
                  .toISOString()
                  .slice(0, 10)}', '${userId}')`;
                pool.query(sql, (err, result) => {
                  if (err) {
                    res.status(400).send("Error adding the user");
                    return;
                  }
                  res.status(200).send("Added User successfully");
                  return;
                });
              });
            });
          });
        });
      });
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error });
  }
});

router.get("/get-user", (req, res) => {
  try {
    const { userId } = req.query;
    let sql = `SELECT id, name, username, status, type FROM user WHERE id = ${userId}`;
    let query = pool.query(sql, (error, result) => {
      if (error) throw error;
      console.log(result);
      let user = {
        name: result[0]["name"],
        username: result[0]["username"],
        id: result[0]["id"],
        status: result[0]["status"],
        type: result[0]["type"],
      };
      let sql = `SELECT university_id, start_date FROM representative WHERE user_id = ${userId}`;
      let query = pool.query(sql, (error, result) => {
        if (error) throw error;
        let universityId = result[0].university_id;
        let start_date = result[0].start_date;
        // Get university data
        let sql = `SELECT * FROM university WHERE id = ${universityId}`;
        let query = pool.query(sql, (error, result) => {
          if (error) throw error;
          let university = result[0];
          console.log({
            ...university,
            ...user,
            start_date,
          });
          let sql = `SELECT * FROM offer WHERE university_id_src = ${university.ID} and status > 0`;
          let query = pool.query(sql, (error, result) => {
            if (error) throw error;
            res.send({
              ...user,
              ...university,
              start_date: start_date,
              email: university.email,
              offers: result,
            });
          });
        });
      });
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ error: "An error occurred while processing your request." });
  }
});

router.get("/get-all-data", (req, res) => {
  try {
    // select all users aren't admin
    let sql = `SELECT id, name, username FROM user WHERE type != 'admin'`;
    let query = pool.query(sql, (error, result) => {
      if (error) res.send(error).status(400);
      let users = result.map((user) => ({
        id: user.id,
        name: user.name,
        username: user.username,
      }));
      let sql = `SELECT * FROM representative WHERE university_id != 'null'`;
      let query = pool.query(sql, (error, result) => {
        if (error) throw error;
        let relations = result;
        // Get university data
        let sql = `SELECT * FROM university`;
        let query = pool.query(sql, (error, result) => {
          if (error) throw error;
          let universities = result;
          // let
          res.send({ users, relations, universities });
        });
      });
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ error: "An error occurred while processing your request." });
  }
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
  console.log("---------------------------------------");
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
