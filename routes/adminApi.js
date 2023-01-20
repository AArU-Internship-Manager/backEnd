const express = require("express");
const router = express.Router();
const md5 = require("md5");
const { createPool } = require("mysql");
// const multer = require("multer");
// const storage = multer.diskStorage({
//   destination: "./uploads/images/",
//   filename: (req, file, cb) => {
//     return cb(null, `${file.filename}_${Date.now()}${path}`);
//   },
// });

const jwt = require("jsonwebtoken");
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
      const filtered = result.filter((item) => item.role === "user");
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
  } = req.body;
  try {
    if (req.files) {
      const avatar = req.files.avatar;
      const fileName = `${Date.now()}_${avatar.name}`;
      avatar.mv("./uploads/images/" + fileName, (err) => {
        if (err) {
          return res.status(500).send(err);
        }
      });
      const fileUrl = `http://localhost:3500/${fileName}`;
      let userSql = `select username from user where username='${username}'`;
      pool.query(userSql, (err, result) => {
        if (err || result.length > 0) {
          res.status(400).send(err?.message);
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
            let userSql = `insert into user (username,password,type,name,avatar) values
            ('${username}','${md5(password)}','user','${name}', '${fileUrl}')`;

            pool.query(userSql, (err, result) => {
              if (err) {
                res.status(400).send(err?.message);
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
    }
  } catch (error) {
    res.status(400).send({ error });
  }
});

router.get("/get-user", (req, res) => {
  try {
    const { universityId } = req.query;
    let sql = `SELECT * FROM university WHERE ID = ${universityId}`;
    let query = pool.query(sql, (error, result) => {
      if (error) {
        res.status(400).send(error);
        return;
      }
      let university = result[0];
      let sql = `SELECT u.id, u.name, u.username, u.status, u.type, u.avatar FROM user u LEFT JOIN representative ON u.id = representative.user_id WHERE representative.university_id = ${universityId}`;
      let query = pool.query(sql, (error, result) => {
        if (error) {
          res.status(400).send(error);
          return;
        }
        const activeUser = {
          ...university,
          ...result.filter((user) => user.status === "active")[0],
        };
        const users = result;
        let sql = `SELECT * FROM offer WHERE university_id_src = ${universityId} and status > '0'`;
        let query = pool.query(sql, (error, result) => {
          if (error) {
            return res.status(400).send(error);
          }
          return res
            .status(200)
            .send({ university, users, activeUser, offers: result });
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

router.get("/get-university-users", (req, res) => {
  try {
    const { universityId } = req.query;
    let sql = `SELECT u.id, u.name, u.username, u.status, u.type, u.avatar
    FROM users u
    JOIN representative r ON u.id = r.user_id
    JOIN university uni ON r.university_id = uni.id
    GROUP BY uni.id
    HAVING uni.id = ${universityId}`;
    let query = pool.query(sql, (error, result) => {
      if (error) res.send(error).status(400);
      const active = result.filter((user) => user.status === "active");
      const suspended = result.filter((user) => user.status === "suspend");
      return { active, suspended };
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
    let sql = `SELECT id, name, username, avatar, status FROM user WHERE type != 'admin'`;
    let query = pool.query(sql, (error, result) => {
      if (error) res.send(error).status(400);
      let users = result.map((user) => ({
        id: user.id,
        name: user.name,
        username: user.username,
        avatar: user.avatar,
        status: user.status,
      }));
      let sql = `SELECT * FROM representative WHERE university_id != 'null'`;
      let query = pool.query(sql, (error, result) => {
        if (error) res.send(error).status(400);
        let relations = result;
        // Get university data
        let sql = `SELECT * FROM university`;
        let query = pool.query(sql, (error, result) => {
          if (error) res.send(error).status(400);
          let universities = result;
          // let
          const activeUsers = relations
            ?.map((relation) => {
              const user = users.find(
                (user) =>
                  user.id === relation.user_id && user.status === "active"
              );
              const university = universities.find(
                (university) => university.ID === relation.university_id
              );
              if (university && user) {
                return {
                  ...user,
                  ...university,
                  startDate: relation.startDate,
                  status: relation.status,
                };
              }
              return null;
            })
            .filter((user) => user !== null);
          const suspendedUsers = relations
            ?.map((relation) => {
              const user = users.find(
                (user) =>
                  user.id === relation.user_id && user.status === "suspend"
              );
              const university = universities.find(
                (university) => university.ID === relation.university_id
              );
              if (university && user) {
                return {
                  ...user,
                  ...university,
                  startDate: relation.startDate,
                  status: relation.status,
                };
              }
              return null;
            })
            .filter((user) => user !== null);
          res.send({
            activeUsers,
            suspendedUsers,
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

router.post("/activate-user", (req, res) => {
  try {
    const { userId } = req.body;
    const sql = `update user set status = "active" where id = ${userId}`;
    pool.query(sql, (err, result) => {
      if (err) throw err;
      const sql = `update representative set end_date = null where user_id = ${userId}`;
      pool.query(sql, (err, result) => {
        if (err) throw err;
        res.status(200).send("User activated successfully");
      });
    });
  } catch (error) {
    res
      .status(500)
      .send({ error: "An error occurred while processing your request." });
  }
});

router.post("/suspend-add-user", (req, res) => {
  try {
    if (req.files) {
      const { id, username, password, name, university_id } = req.body;
      const sql = `select username from user where username = '${username}'`;
      pool.query(sql, (err, result) => {
        if (err || result.length > 0) {
          return res.status(400).send({ error: "Username already exists" });
        }
        const sql = `update user set status = "suspend" where id = ${id}`;
        pool.query(sql, (err, result) => {
          if (err)
            return res.status(400).send({ error: "Error Suspending shsmo" });
          const sql = `update representative set end_date = '${new Date()
            .toISOString()
            .slice(0, 10)}' where user_id = ${id}`;
          pool.query(sql, (err, result) => {
            if (err)
              return res.status(400).send({ error: "Can't update user" });
            const avatar = req.files.avatar;
            const fileName = `${Date.now()}_${avatar.name}`;
            avatar.mv("./uploads/images/" + fileName, (err) => {
              if (err) {
                return res.status(500).send(err);
              }
            });
            const fileUrl = `http://localhost:3500/${fileName}`;
            const sql = `insert into user (username, password, type, name,status, avatar) values 
            ('${username}', '${password}', 'user', '${name}',"active", '${fileUrl}')`;
            pool.query(sql, (err, result) => {
              if (err)
                return res.status(400).send({ error: "Can't insert user" });
              const sql = `insert into representative (user_id, university_id, start_date) values
              (${result.insertId}, ${university_id}, '${new Date()
                .toISOString()
                .slice(0, 10)}')`;
              pool.query(sql, (err, result) => {
                if (err)
                  return res
                    .status(400)
                    .send({ error: "Can't insert relation" });
                res.status(200).send("User added successfully");
              });
            });
          });
        });
      });
    }
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

router.post("/reactivate-user", (req, res) => {
  try {
    const { userId, id, university_id } = req.body;
    const sql = `update user SET status = "suspend" where id = ${id}`;
    pool.query(sql, (err, result) => {
      if (err) return res.status(400).send({ error: "Error Suspending shsmo" });
      const sql = `update representative set end_date = '${new Date()
        .toISOString()
        .slice(0, 10)}' where user_id = ${id}`;
      pool.query(sql, (err, result) => {
        if (err) return res.status(400).send({ error: "Can't update user" });
        const sql = `update user SET status = "active" where id = ${userId}`;
        pool.query(sql, (err, result) => {
          if (err) return res.status(400).send({ error: "Can't insert user" });
          const sql = `update representative set end_date = null where user_id = ${userId}`;
          pool.query(sql, (err, result) => {
            if (err)
              return res.status(400).send({ error: "Can't insert relation" });
            res.status(200).send("User added successfully");
          });
        });
      });
    });
  } catch (error) {
    return res.status(500).send(error.message);
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
