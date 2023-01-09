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

router.get("/show_student", (req, res, next) => {
  const sql1 = `SELECT university_id FROM representative WHERE user_id=${req.id}`;
  pool.query(sql1, (err, result) => {
    if (err) {
      res.status(404);
      res.send(err);
    } else {
      id = result[0]["university_id"];
      const sql2 = `SELECT * FROM student_e WHERE university_id=${id}`;
      pool.query(sql2, (err, result) => {
        if (err) {
          res.status(404);
          res.send(err);
        } else {
          res.status(200);
          res.json(result);
        }
      });
    }
  });
});

router.get("/show_student/:id", (req, res, next) => {
  const sql = `SELECT * FROM student_e WHERE id = ${req.params.id}`;
  pool.query(sql, (err, result) => {
    if (err) {
      res.status(404);
      res.send(err);
    } else {
      res.status(200);
      res.json(result);
    }
  });
});

router.post("/insert_student", (req, res, next) => {
  const sql1 = `SELECT university_id FROM representative WHERE user_id=${req.id}`;
  pool.query(sql1, (err, result) => {
    console.log(null);
    if (err) {
      res.status(404);
      res.send(err);
    } else {
      const university_id = result[0]["university_id"];
      const {
        address,
        birthDate,
        birthPlace,
        college,
        email,
        fluencyInEnglish,
        gender,
        healthStatus,
        name,
        nationality,
        passportExpiryDate,
        passportNumber,
        phone,
        studyYearFinished,
        studyYears,
        totalCreditHours,
        universityMajor,
      } = req.body;
      const sql = `INSERT INTO student_e (name, nationality, university_id , college, universityMajor, birthPlace, gender, phone, email,  address, passportNumber, healthStatus, studyYearFinished, studyYears, fluencyInEnglish, totalCreditHours, passportExpiryDate, birthDate)
             VALUES ("${name}", "${nationality}", ${university_id}, "${college}", "${universityMajor}","${birthPlace}","${gender}", "${phone}", "${email}","${address}", "${passportNumber}","${healthStatus}", "${studyYearFinished}", "${studyYears}", "${fluencyInEnglish}", ${totalCreditHours}, "${passportExpiryDate}", "${birthDate}")`;
      pool.query(sql, (err, result) => {
        console.log(err);
        console.log(sql);
        if (err) {
          res.status(403);
          return res.json("this id is in use");
        } else {
          res.status(200);
          res.send("ur data insert");
        }
      });
    }
  });
});

router.get("/get-all-data", (req, res) => {
  try {
    // select all users aren't admin
    let sql = `SELECT * FROM student_e WHERE university_id = ${req.id}`;
    let query = pool.query(sql, (error, result) => {
      if (error)
        res
          .status(500)
          .send({ error: "An error occurred while processing your request." });
      let students = result;
      // console.log(students);
      res.send(students);
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ error: "An error occurred while processing your request." });
  }
});
router.get("/get-student", (req, res) => {
  try {
    const { studentId } = req.query;
    let sql = `SELECT * FROM student_e WHERE ID =${studentId}`;
    let query = pool.query(sql, (error, result) => {
      if (error) res.send(error.message);
      let student = result[0];
      let sql = `SELECT o.*
      FROM offer o
      JOIN requests r ON o.id = r.offer_id
      WHERE r.student_id = ${studentId}`;
      let query = pool.query(sql, (err, result) => {
        if (err) res.send(err.message);
        const offer = result[0];
        res.send({
          student: student,
          offer: offer,
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
