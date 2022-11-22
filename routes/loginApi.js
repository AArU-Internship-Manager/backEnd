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

router.post("/", (req, res, next) => {
  const name = req.body.Username;
  const password = req.body.password;
  const user = req.body.Username;
  const sql = `select type ,username,id from user where Username= "${name}" and password="${password}"`;
  pool.query(sql, (err, result) => {
    if (err || result.length === 0) {
      res.status(404);
      res.send("not found");
    } else {
      const role = result[0]["type"].toLowerCase();
      const id = result[0]["id"];
      const username = result[0]["username"];
      const ability = [
        {
          action: "manage",
          subject: "all",
        },
      ];
      jwt.sign(
        { user, role, id },
        "khqes$30450#$%1234#900$!",
        (err, accessToken) => {
          const sql1 = `SELECT ID  FROM university WHERE ID=(SELECT university_id from representative WHERE user_id=${id})`;
          pool.query(sql1, (err, result) => {
            if (err || result.length === 0) {
              res.json({
                username,
                ability,
                accessToken,
                role,
              });
            } else {
              university_id = result[0]["ID"];
              res.json({
                username,
                ability,
                university_id,
                accessToken,
                role,
              });
            }
          });
        }
      );
    }
  });
});

module.exports = router;
