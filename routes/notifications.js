const express = require("express");
const router = express.Router();
const { createPool } = require("mysql");
var jwt = require("jsonwebtoken");
const md5 = require("md5");
const pool = createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "swap-ar-uni",
  connectionLimit: "10",
});

router.use(fetchToken);
router.use(verifyToken);

// get all notifications
router.get("/get-notifications", (req, res) => {
  const sql = `SELECT * FROM notifications WHERE user_id=${req.id}`;
  console.log(sql);
  pool.query(sql, (err, result) => {
    if (err) {
      res.status(404);
      res.send("error");
    } else {
      res.status(200);
      res.send(result);
    }
  });
});

const storeNotification = (data) => {
  try {
    pool.query(
      `INSERT INTO notifications (title, body, type, user_id, offer_id) VALUES (?, ?, ?, ?, ?)`,
      [data.title, data.body, data.type, data.user_id, data.offer_id],
      (err, result) => {
        if (err) {
          console.log(err);
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
};

function verifyToken(req, res, next) {
  jwt.verify(req.token, "khqes$30450#$%1234#900$!", (err, authData) => {
    if (err) {
      res.sendStatus(403);
      console.log("token not verified");
    } else {
      req.id = authData.id;
      try {
        next();
      } catch (err) {}
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
    console.log("token not found");
    res.sendStatus(403);
  }
}

module.exports = {
  router,
  storeNotification,
};
