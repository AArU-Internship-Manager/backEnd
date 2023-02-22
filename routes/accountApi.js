const express = require("express");
const DB_CONNECTION = require("../db");
const router = express.Router();
const { createPool } = require("mysql");
var jwt = require("jsonwebtoken");
const md5 = require("md5");
const pool = createPool(DB_CONNECTION);

router.use(fetchToken);
router.use(verifyToken);

router.post("/change-password", (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  const sql = `SELECT password FROM user WHERE id=${req.id}`;
  pool.query(sql, (err, result) => {
    if (err) {
      res.status(404);
      res.send("error");
    } else {
      if (result[0]["password"] == md5(currentPassword)) {
        const sql1 = `UPDATE user SET password="${md5(newPassword)}" WHERE id=${
          req.id
        }`;
        pool.query(sql1, (err, result) => {
          if (err) {
            res.status(404);
            res.send(err);
          } else {
            res.status(200);
            res.send({
              message: "password updated",
            });
          }
        });
      } else {
        res.status(404);
        res.send({
          message: "current password is wrong",
        });
      }
    }
  });
});

router.post("/edit-user", (req, res) => {
  const { id, name, username, ID, email, phone, fax } = req.body;
  const new_avatar = req.files?.avatar;
  const new_logo = req.files?.logo;
  let avatar = null;
  let logo = null;
  if (new_avatar) {
    const fileName = `${Date.now()}_${new_avatar.name}`;
    new_avatar.mv("./uploads/images/" + fileName, (err) => {
      if (err) {
        return res.status(500).send(err);
      }
    });
    avatar = `http://localhost:3500/${fileName}`;
  }
  if (new_logo) {
    const fileName = `${Date.now()}_${new_logo.name}`;
    new_logo.mv("./uploads/images/" + fileName, (err) => {
      if (err) {
        return res.status(500).send(err);
      }
    });
    logo = `http://localhost:3500/${fileName}`;
  }

  const sql = `UPDATE user SET name = COALESCE(?, name), username = COALESCE(?, username), avatar = COALESCE(?, avatar) WHERE id = ?`;
  const values = [name || null, username || null, avatar || null, id];

  pool.query(sql, values, (error, results) => {
    if (error) {
      res.status(500).json({ error });
    } else {
      const sql = `UPDATE university SET email = COALESCE(?, email), phone = COALESCE(?, phone), fax = COALESCE(?, fax), logo = COALESCE(?, logo) WHERE ID = ?`;
      const values = [
        email || null,
        phone || null,
        fax || null,
        logo || null,
        ID,
      ];
      pool.query(sql, values, (error, results) => {
        if (error) {
          res.status(500).json({ error });
        } else {
          res.status(200).json({ message: "user updated successfully" });
        }
      });
    }
  });
});

router.get("/user-details", (req, res, next) => {
  const user_id = req.body.id;
  const sql = `select username from user where id=${user_id}`;
  pool.query(sql, (err, result) => {
    if (err) {
      res.status(404);
      res.send(err);
    } else {
      const username = result[0]["username"];
      const sql2 = `select EN_Name,AR_Name from country where id=(
                select country_id from city where id=(
                    select city_id from university where id=(
                        select university_id from representative where user_id=${user_id}
                    )   
                )
            )`;
      pool.query(sql2, (err, result) => {
        if (err) {
          res.status(404);
          res.send(err);
        } else {
          const countryName = result[0];
          const sql3 = `select EN_Name,AR_Name,email,phone,location_O from university where id=(
                        select university_id from representative where user_id=${user_id}
                        )`;
          pool.query(sql3, (err, result) => {
            if (err) {
              res.status(404);
              res.send(err);
            } else {
              const universityDetails = result[0];
              res.status(200);
              res.send({
                username,
                countryName,
                universityDetails,
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
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
}

module.exports = router;
