const express = require("express");
const md5 = require("md5");
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
const abilityUser = [
  { action: "read", subject: "ACL" },
  { action: "read", subject: "Auth" },
];

const abilityAdmin = [{ action: "manage", subject: "all" }];

router.post("/", (req, res, next) => {
  const name = req.body.Username;
  const password = md5(req.body.password);
  const user = req.body.Username;
  const sql = `select type, username, id, avatar from user where Username= "${name}" and password="${password}"`;
  pool.query(sql, (err, result) => {
    if (err || result.length === 0) {
      res.status(404);
      res.send("not found");
    } else {
      const role = result[0]["type"].toLowerCase();
      const id = result[0]["id"];
      const username = result[0]["username"];
      const avatar = result[0]["avatar"];
      const ability = role === "user" ? abilityAdmin : abilityUser;
      jwt.sign(
        { user, role, id },
        "khqes$30450#$%1234#900$!",
        (err, accessToken) => {
          const sql1 = `SELECT *  FROM university WHERE ID=(SELECT university_id from representative WHERE user_id=${id})`;
          pool.query(sql1, (err, result) => {
            const university = result[0];
            if (err || result.length === 0) {
              res.json({
                id,
                username,
                ability,
                accessToken,
                role,
                avatar,
              });
            } else {
              res.json({
                id,
                username,
                ability,
                university_id: university.ID,
                logo: university.logo,
                EN_Name: university.EN_Name,
                AR_Name: university.AR_Name,
                email: university.email,
                accessToken,
                role,
                avatar,
              });
            }
          });
        }
      );
    }
  });
});

module.exports = router;
