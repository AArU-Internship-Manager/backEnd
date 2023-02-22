const express = require("express");
const router = express.Router();
const { createPool } = require("mysql");
var jwt = require("jsonwebtoken");
const md5 = require("md5");
const DB_CONNECTION = require("../db");
const pool = createPool(DB_CONNECTION);

router.use(fetchToken);
router.use(verifyToken);

// get all notifications
router.get("/get-notifications", (req, res) => {
  const sql = `SELECT * FROM notifications JOIN representative ON representative.user_id = ${req.id} WHERE notifications.university_id = representative.university_id ORDER BY notifications.id DESC`;
  pool.query(sql, (err, result) => {
    if (err) {
      res.status(404);
      return res.send("error");
    } else {
      res.status(200);
      return res.send(result);
    }
  });
});

const storeNotification = (data) => {
  try {
    pool.query(
      `INSERT INTO notifications (name, message, type, university_id, link, date) VALUES (?, ?, ?, ?, ?, NOW())`,
      [data.name, data.message, data.type, data.user, data.link],
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

// export const clearNotifications = createAsyncThunk(
//   "notifications/clearNotifications",
//   async () => {
//     try {
//       const response = await axios.delete(
//         "http://localhost:3500/notifications/clear-notifications",
//         {
//           headers: {
//             authorization: JSON.parse(localStorage.getItem("accessToken"))
//           }
//         }
//       )
//       return response.data
//     } catch (error) {}
//   }
// )

// write an endpoint to clear all notifications
router.delete("/clear-notifications/:id", (req, res) => {
  const sql = `DELETE FROM notifications WHERE university_id = ${req.params.id}`;
  pool.query(sql, (err, result) => {
    if (err) {
      res.status(404);
      return res.send("error");
    } else {
      res.status(200);
      console.log("success");
      return res.send("success");
    }
  });
});

router.delete("/delete-notification/:id", (req, res) => {
  const sql = `DELETE FROM notifications WHERE id = ${req.params.id}`;
  pool.query(sql, (err, result) => {
    if (err) {
      res.status(404);
      return res.send("error");
    } else {
      res.status(200);
      return res.send("success");
    }
  });
});

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
