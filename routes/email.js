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

router.use(verifyToken);
router.use(fetchToken);

router.get("/", (req, res) => {
  console.log(req);
});
router.get("/get-emails", (req, res) => {
  const { q = "", folder = "inbox", label } = req.query;
  const queryLowered = q.toLowerCase();
  console.log(req);
  let sql = "SELECT * FROM Emails";
  let values = [`%${queryLowered}%`, `%${queryLowered}%`];

  // if (folder === "trash") {
  //   sql += ' AND folder = "trash"';
  // } else if (folder === "starred") {
  //   sql += ' AND is_starred = 1 AND folder != "trash"';
  // } else {
  //   sql += ' AND folder = ? AND folder != "trash"';
  //   values.push(folder || folder);
  // }

  // if (label) {
  //   sql += " AND labels LIKE ?";
  //   values.push(`%${label}%`);
  // }

  sql += " ORDER BY time DESC";

  pool.query(sql, values, (error, emails) => {
    console.log(emails);
    if (error) {
      return res.status(500).send(error);
    }

    let sqlMeta = "SELECT COUNT(*) as count, folder FROM Emails WHERE ";

    if (folder === "trash") {
      sqlMeta += 'folder = "trash"';
    } else if (folder === "starred") {
      sqlMeta += 'is_starred = 1 AND folder != "trash"';
    } else {
      sqlMeta += 'folder = ? AND folder != "trash"';
    }

    if (label) {
      sqlMeta += " AND labels LIKE ?";
    }

    sqlMeta += " GROUP BY folder";

    pool.query(sqlMeta, values, (error, results) => {
      if (error) {
        return res.status(500).send(error);
      }
      let emailsMeta = {
        inbox: 0,
        draft: 0,
        spam: 0,
      };

      results.forEach((result) => {
        if (result.folder === "inbox") {
          emailsMeta.inbox = result.count;
        } else if (result.folder === "draft") {
          emailsMeta.draft = result.count;
        } else if (result.folder === "spam") {
          emailsMeta.spam = result.count;
        }
      });

      return res.status(200).send({ emails, emailsMeta });
    });
  });
});

router.post("/apps/email/update-emails", (req, res) => {
  const { emailIds, dataToUpdate } = req.body;

  let sql = "UPDATE Emails SET ";
  let values = [];
  let setValues = [];
  Object.keys(dataToUpdate).forEach(function (key) {
    setValues.push(`${key} = ?`);
    values.push(dataToUpdate[key]);
  });
  sql += setValues.join(", ");
  sql += " WHERE id IN (?)";
  values.push(emailIds);
  pool.query(sql, values, (error, results) => {
    if (error) {
      return res.status(500).send(error);
    }
    return res.status(200).send();
  });
});

router.post("/apps/email/update-emails-label", (req, res) => {
  const { emailIds, label } = req.body;

  let sql = "UPDATE Emails SET labels = CASE ";
  let values = [];
  emailIds.forEach(function (emailId, index) {
    sql += `WHEN id = ? THEN (CASE WHEN labels like '%${label}%' THEN replace(labels, '${label}', '') ELSE concat(labels, ',${label}') END) `;
    values.push(emailId);
  });
  sql += "END WHERE id IN (?)";
  values.push(emailIds);
  pool.query(sql, values, (error, results) => {
    if (error) {
      return res.status(500).send(error);
    }
    return res.status(200).send();
  });
});

router.get("/apps/email/get-email/:id", (req, res) => {
  const emailId = Number(req.params.id);

  pool.query("SELECT * FROM Emails WHERE id = ?", emailId, (error, email) => {
    if (error) {
      return res.status(500).send(error);
    }
    if (!email) {
      return res.status(404).send();
    }
    pool.query(
      "SELECT COUNT(*) as count FROM Emails WHERE id < ?",
      emailId,
      (error, previousMail) => {
        if (error) {
          return res.status(500).send(error);
        }
        pool.query(
          "SELECT COUNT(*) as count FROM Emails WHERE id > ?",
          emailId,
          (error, nextMail) => {
            if (error) {
              return res.status(500).send(error);
            }
            return res.status(200).send({
              email: email,
              hasPreviousMail: previousMail > 0,
              hasNextMail: nextMail > 0,
            });
          }
        );
      }
    );
  });
});

router.get("/apps/email/paginate-email", (req, res) => {
  const { dir, emailId } = req.query;
  let sql;
  if (dir === "previous") {
    sql = "SELECT * FROM Emails WHERE id < ? ORDER BY id DESC LIMIT 1";
  } else {
    sql = "SELECT * FROM Emails WHERE id > ? ORDER BY id ASC LIMIT 1";
  }
  pool.query(sql, emailId, (error, email) => {
    if (error) {
      return res.status(500).send(error);
    }
    if (!email) {
      return res.status(404).send();
    }
    return res.status(200).send(email);
  });
});

function verifyToken(req, res, next) {
  console.log("Fetching token");
  jwt.verify(req.token, "khqes$30450#$%1234#900$!", (err, authData) => {
    console.log("Verifying", err, authData);
    if (err) {
      console.log({ err });
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
    res.sendStatus(404).json({ message: "you are not authorized" });
  }
}

module.exports = router;
