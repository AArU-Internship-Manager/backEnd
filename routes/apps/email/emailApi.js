var jwt = require("jsonwebtoken");

const express = require("express");
const app = express();
const mysql = require("mysql2");
const router = express.Router();

const connection = mysql.createConnection({
  host: "b0v0jmvlsa1lktb7d6ed-mysql.services.clever-cloud.com",
  user: "u4eyummvyv6uncwr",
  password: "8VpsSHue0bcHsFXRLPhc",
  database: "b0v0jmvlsa1lktb7d6ed",
  connectionLimit: "10",
});
router.use(fetchToken);
router.use(verifyToken);

// 1.
// This code defines a GET route that takes a `q`, `folder`, and `label` query parameter, constructs a SQL query based on the values of those parameters, and sends the query to the database. The query retrieves emails that match the specified search term, folder, and label and filter them based on the function isInFolder.
// Then it creates an object emailMeta that contains the count of emails in different folders.
// Then it returns the filtered data along with the emailMeta as a JSON object to the client.

app.get("/apps/email/emails", (req, res) => {
  const { q = "", folder = "inbox", label } = req.query;
  const queryLowered = q.toLowerCase();

  let sql = `SELECT * FROM emails WHERE (from_name LIKE '%${queryLowered}%' OR subject LIKE '%${queryLowered}%') AND folder != 'trash'`;

  if (folder === "trash") {
    sql += ` AND folder = 'trash'`;
  } else if (folder === "starred") {
    sql += ` AND is_starred = 1 AND folder != 'trash'`;
  } else {
    sql += ` AND folder = '${folder}'`;
  }

  if (label) {
    sql += ` AND labels LIKE '%${label}%'`;
  }

  connection.query(sql, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err });
    }

    let sqlMeta = `SELECT COUNT(*) as count, folder FROM emails WHERE is_deleted = 0 and is_read = 0`;

    connection.query(sqlMeta, (err, metaRows) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
      const emailsMeta = metaRows.reduce((acc, row) => {
        acc[row.folder] = row.count;
        return acc;
      }, {});
      return res.status(200).json({
        emails: rows.reverse(),
        emailsMeta,
      });
    });
  });
});

// 2.
// This code defines a POST route that takes an array of email ids and an object containing the data to be updated as the request body.
// It constructs a SQL query that updates the emails that match the given ids with the data specified in the request body.
// It then sends the query to the database, and returns a status code of 200 if the update was successful.

app.post("/apps/email/update-emails", (req, res) => {
  const { emailIds, dataToUpdate } = req.body;
  const setString = Object.keys(dataToUpdate)
    .map((key) => `${key} = '${dataToUpdate[key]}'`)
    .join(", ");
  const idString = emailIds.map((id) => `'${id}'`).join(", ");
  const sql = `UPDATE emails SET ${setString} WHERE id IN (${idString})`;

  connection.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.sendStatus(200);
  });
});

// 3.
// This code defines a POST route that takes an array of email ids and a label as the request body.
// It constructs a SQL query that updates the labels of the emails that match the given ids with the label specified in the request body.
// It then sends the query to the database, and returns a status code of 200 if the update was successful.

app.post("/apps/email/update-emails-label", (req, res) => {
  const { emailIds, label } = req.body;
  const idString = emailIds.map((id) => `'${id}'`).join(", ");

  let sql = `SELECT * FROM emails WHERE id IN (${idString})`;
  connection.query(sql, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err });
    }

    rows.forEach((row) => {
      if (row.labels.includes(label)) {
        row.labels = row.labels.filter((l) => l !== label);
      } else {
        row.labels.push(label);
      }
    });

    const newValues = rows
      .map((row) => `('${row.id}', '${row.labels.join(",")}')`)
      .join(",");
    sql = `INSERT INTO emails (id, labels) VALUES ${newValues} ON DUPLICATE KEY UPDATE labels = VALUES(labels)`;

    connection.query(sql, (err) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
      res.sendStatus(200);
    });
  });
});

// 4.
// This code defines a GET route that takes an id as a parameter, constructs a SQL query that retrieves the email that matches the given id,
// and sends the query to the database. The query retrieves emails that match the specified id,
// and then it constructs another two queries to check if the current email has a previous or next email.
// Then it returns the email along with its previous and next status as a JSON object to the client.

app.get("/apps/email/get-email/:id", (req, res) => {
  const emailId = req.params.id;
  const sql = `SELECT * FROM emails WHERE id = ${emailId}`;

  connection.query(sql, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err });
    }

    if (rows.length === 0) {
      return res.sendStatus(404);
    }

    const mail = rows[0];
    const sql1 = `SELECT COUNT(*) as count FROM emails WHERE id < ${emailId}`;
    connection.query(sql1, (err, count) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
      mail.hasPreviousMail = count[0].count !== 0;
      const sql2 = `SELECT COUNT(*) as count FROM emails WHERE id > ${emailId}`;
      connection.query(sql2, (err, count) => {
        if (err) {
          return res.status(500).json({ error: err });
        }
        mail.hasNextMail = count[0].count !== 0;
        return res.status(200).json(mail);
      });
    });
  });
});

// 5.
// This code defines a GET route that takes two parameters, dir and emailId.
// The dir parameter represents the direction of pagination, whether it's next or previous.
// The emailId parameter represents the current email's id.
// The code then constructs a SQL query that retrieves the current email that matches the given id,
// and sends the query to the database. Then it constructs another query based on the direction to retrieve the next or previous email.
// Then it returns the new email as a JSON object to the client.

app.get("/apps/email/paginate-email", (req, res) => {
  const { dir, emailId } = req.query;
  let sql = "";
  if (dir === "previous") {
    sql = `SELECT * FROM emails WHERE id < ${emailId} ORDER BY id DESC LIMIT 1`;
  } else if (dir === "next") {
    sql = `SELECT * FROM emails WHERE id > ${emailId} ORDER BY id ASC LIMIT 1`;
  } else {
    return res.status(400).json({ error: "Invalid direction" });
  }

  connection.query(sql, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err });
    }

    if (rows.length === 0) {
      return res.sendStatus(404);
    }

    return res.status(200).json(rows[0]);
  });
});

router.get("/apps/email/paginate-email/:dir/:emailId", (req, res, next) => {
  const { dir, emailId } = req.params;

  let sql = `SELECT * FROM emails WHERE id = ${emailId}`;
  pool.query(sql, (err, result) => {
    if (err) {
      return res.json({
        status: 400,
        message: err,
      });
    } else if (result.length === 0) {
      return res.status(404).send();
    } else {
      const currentEmail = result[0];
      if (dir === "previous") {
        sql = `SELECT * FROM emails WHERE id < ${emailId} ORDER BY id DESC LIMIT 1`;
      } else if (dir === "next") {
        sql = `SELECT * FROM emails WHERE id > ${emailId} ORDER BY id ASC LIMIT 1`;
      }
      pool.query(sql, (err, result) => {
        if (err) {
          return res.json({
            status: 400,
            message: err,
          });
        } else if (result.length === 0) {
          return res.status(404).send();
        } else {
          return res.json({
            status: 200,
            data: result[0],
          });
        }
      });
    }
  });
});

function verifyToken(req, res, next) {
  // console.log({ req });
  jwt.verify(req.token, "khqes$30450#$%1234#900$!", (err, authData) => {
    if (err) {
      res.sendStatus(403);
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
    res.sendStatus(403);
  }
}

module.exports = router;
