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
    city_id
  } = req.body
  const Promises = new Promise((resolve, reject) => {
    const sql = `select username from user where username='${username}'`
    pool.query(sql, (err, result) => {
      if (err || result.length > 0) {
        reject("username already exist")
      } else {
        resolve()
      }
    })
  })

  Promises.then(() => {
    return new Promise((resolve, reject) => {
      const sql = `select ID from university where En_Name='${EN_Name}'`
      pool.query(sql, (err, result) => {
        if (err || result.length > 0) {
          reject("university already exist")
        } else {
          resolve()
        }
      })
    })
  })
  .then(() => {
    return new Promise((resolve, reject) => {
      const sql = `insert into university (En_Name,Ar_Name,Location_O,Study_business,phone,Fax,
        hour_no_week,hour_no_day,url) values 
        ('${EN_Name}','${AR_Name}','${Location_O}','${Study_buisness}','${phone}',
        '${Fax}','${hour_no_week}','${hour_no_day}','${url}')`;
      pool.query(sql, (err, result) => {
        if (err) {
          reject("error")
        } else {
          console.log("result1")
          resolve()
        }
      })
    })
  }).then(() => {
    return new Promise((resolve, reject) => {
      const sql = `insert into user (username,password,type,name) values
      ('${username}','${password}','user','${name}')`;
      pool.query(sql, (err, result) => {
        if (err) {
          console.log("err2", err)
          reject(`erro2`)
        } else {
          console.log("result2")
          resolve()
        }
      }
      )
    })

  }).then(() => {
    return new Promise((resolve, reject) => {
      const sql = `select ID from university where En_Name = '${EN_Name}' and Ar_Name = '${AR_Name}'`;
      pool.query(sql, (err, result) => {
        console.log(err, "res", result)
        if (err) {
          console.log("err3", err)
          reject("erro3")
        } else {
          console.log("result3", result[0]["ID"])
          resolve(result[0]["ID"])
        }
      })
    })
  }).then((university_id) => {
    console.log("university_id", university_id)

    return new Promise((resolve, reject) => {
      console.log("this from select user id")
      const sql = `select id from user where username = '${username}'`;
      pool.query(sql, (err, result) => {
        console.log(err, "res", result)
        if (err) {
          console.log("err4", err)
          reject("erro4")
        } else {
          console.log("result4")
          resolve({
            university_id,
            user_id: result[0]["id"]
          })
        }
      })
    })
  }).then((data) => {
    const { university_id, user_id } = data
    console.log("university_id", university_id)
    console.log("user_id", user_id)
    return new Promise((resolve, reject) => {
      const sql = `insert into representative (university_id, Email, phone, fax, start_date, status, user_id)
        values('${university_id}', '${email}', '${phone}', '${Fax}', '${new Date().toISOString().slice(0, 10)}', '1', '${user_id}')`
      pool.query(sql, (err, result) => {
        if (err) {
          console.log("err5", err)
          reject("erro5")
        } else {
          console.log("result5")
          resolve("add user successfully")
        }
      })
    })
  }).then((msg) => {
    return res.status(200).send(msg)
  })
    .catch((err) => {
      return res.status(400).send({err})
    })
})


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
  console.log("---------------------------------------")
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
