const express = require("express");
const router = express.Router();
const { createPool } = require("mysql");
var jwt = require("jsonwebtoken");
const { request } = require("express");
const pool = createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "swap-ar-uni",
  connectionLimit: "10",
});

router.use(fetchToken);
router.use(verifyToken);

router.put("/update_offer", (req, res, next) => {
  const { offer_id, university_id_dest } = req.body;
  const sql1 = `SELECT university_id FROM representative WHERE user_id=${req.id}`;
  pool.query(sql1, (err, result) => {
    if (err) {
      res.status(404);
      res.send(err);
    } else {
      id = result[0]["university_id"];
      const sql2 = `UPDATE offer SET University_id_des=${university_id_dest}, status="waiting" WHERE id=${offer_id} AND university_id_src=${id}`;
      pool.query(sql2, (err, result) => {
        if (err) {
          res.status(404);
          res.send(err);
        } else {
          res.status(200);
          res.send("offer updated");
        }
      });
    }
  });
});

router.get("/show_offer/:id", (req, res, next) => {
  const sql = `SELECT * FROM offer WHERE id=${req.params.id}`;
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

router.get("/show_offer", (req, res, next) => {
  const sql1 = `SELECT university_id FROM representative WHERE user_id=${req.id}`;
  pool.query(sql1, (err, result) => {
    if (err) {
      res.status(404);
      res.send(err);
    } else {
      id = result[0]["university_id"];
      const sql2 = `SELECT * FROM offer WHERE university_id_src=${id} or University_id_des=${id}`;
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

router.get("/AutoComplete", (req, res) => {
  inst_name = req.query.inst_name;
  inst_address = req.query.inst_address;
  const sql = `SELECT * FROM org where name= "${inst_name}" and address = "${inst_address}" or name like "%${inst_name}%" and address like "%${inst_address}%" `;
  pool.query(sql, (err, result) => {
    if (err) {
      res.status(404);
      res.send(err);
    } else {
      org_id = result[0]["id"]; // save it  and send to the req
      res.status(200);
      res.json(result);
    }
  });
});

router.post("/insert_offer", (req, res, next) => {
  const sql1 = `SELECT university_id FROM representative WHERE user_id=${req.id}`;
  pool.query(sql1, (err, result) => {
    if (err) {
      res.status(404);
      res.send(err);
    } else {
      const university_id_src = result[0]["university_id"];
      const userId = req.id;
      const {
        train_description,
        train_type,
        train_length,
        train_start_date,
        train_end_date,
        support_amount,
        support_types,
        meals_text,
        residence_text,
        transfer_text,
        meals,
        residence,
        transfer,
        inst_name,
        inst_address,
        place_of_work,
        train_aria,
        trainer_name,
        days_of_work,
        inst_phone,
        inst_fax,
        weekly_hours,
        daily_hours,
        college_name,
        branch_name,
        major_name,
        stu_level,
        stu_sex,
        other_requirments,
      } = req.body;
      if (new Date(train_end_date) < new Date()) {
        return res.json({
          status: 400,
          message: "end date must be after today",
        });
      }
      if (new Date(train_start_date) > new Date(train_end_date)) {
        return res.json({
          status: 400,
          message: "start date must be before end date",
        });
      }
      if (new Date(train_start_date) < new Date()) {
        return res.json({
          status: 400,
          message: "start date must be after today",
        });
      }
      const sql = `INSERT INTO offer (offer_date, university_id_src,other_requirments, train_description, train_type,
                 train_length,train_start_date,train_end_date,support_amount, organization_id,user_id,
                 train_aria, days_of_work, weekly_hours, daily_hours,college_name, branch_name,major_name, stu_level, stu_sex,
                  work_field, status,meals_text, residence_text, transfer_text,inst_phone,inst_fax,inst_name,inst_address,trainer_name)
             VALUES ("${new Date()
               .toISOString()
               .slice(
                 0,
                 10
               )}", ${university_id_src}, "${other_requirments}", "${train_description}", "${train_type}",
             ${train_length},"${train_start_date}", "${train_end_date}", "${support_amount}", 
              ${1}, ${userId}, "${train_aria}", "${days_of_work.toString()}", ${weekly_hours}, ${daily_hours},
              "${college_name}", "${branch_name}", "${major_name}", "${stu_level}","${stu_sex}", "${null}", 0,
              "${meals ? meals_text : null}", "${
        residence ? residence_text : null
      }", "${transfer ? transfer_text : null}",
              "${inst_phone}", "${inst_fax}", "${inst_name}", "${inst_address}", "${trainer_name}")`;

      pool.query(sql, (err, result) => {
        if (err) {
          res.status(404);
          res.send(err);
        } else {
          res.status(200);
          res.send("ur data insert");
        }
      });
    }
  });
});

router.get("/own-offers", (req, res, next) => {
  const id = req.body.id;
  const sql = `SELECT * FROM offer WHERE user_id=${id} and status=0`;
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

router.get("/obtained-offers", (req, res, next) => {
  const id = req.id;
  const sql = `SELECT * FROM offer WHERE user_id=${id} and status=1`;
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
router.get("/active-offers", (req, res, next) => {
  const id = req.id;
  const sql = `SELECT * FROM offer WHERE user_id=${id} and status=3`;
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
router.get("/ended-offers", (req, res, next) => {
  const id = req.id;
  const sql = `SELECT * FROM offer WHERE user_id=${id} and status=5`;
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

router.post("/send-offer", (req, res, next) => {
  const { offer_id, university_id_des } = req.body;
  const sql = `select status from offer where id=${offer_id}`;
  const retrieveOffer = pool.query(sql, (err, result) => {
    if (err) {
      return res.json({
        status: 404,
        message: err.message,
      });
    } else {
      const offerStatus = result[0]["status"];
      if (offerStatus === "not found") {
        return res.json({
          status: 404,
          message: "offer not found",
        });
      }
      const sql = `update offer set status="${
        +offerStatus + 1
      }", University_id_des=${university_id_des} where id=${offer_id}`;
      pool.query(sql, (err, result) => {
        if (err) {
          res.json({
            status: 404,
            message: "error",
          });
        }
      });
      return res.json({
        status: 200,
        message: "success",
      });
    }
  });
});

router.post("/accept-offer", (req, res, next) => {
  const { offer_id } = req.body;
  const sql = `select status from offer where id=${offer_id}`;
  const retrieveOffer = pool.query(sql, (err, result) => {
    if (err) {
      return res.json({
        status: 404,
        message: err.message,
      });
    } else {
      const offerStatus = result[0]["status"];
      if (offerStatus === "not found") {
        return res.json({
          status: 404,
          message: "offer not found",
        });
      }
      const sql = `update offer set status="${
        +offerStatus + 1
      }" where id=${offer_id}`;
      pool.query(sql, (err, result) => {
        if (err) {
          res.json({
            status: 404,
            message: "error",
          });
        }
      });
      return res.json({
        status: 200,
        message: "success",
      });
    }
  });
});

router.post("/reject-offer", (req, res, next) => {
  const { offer_id } = req.body;
  const sql = `select status from offer where id=${offer_id}`;
  const retrieveOffer = pool.query(sql, (err, result) => {
    if (err) {
      return res.json({
        status: 404,
        message: err.message,
      });
    } else {
      const offerStatus = result[0]["status"];
      if (offerStatus === "not found") {
        return res.json({
          status: 404,
          message: "offer not found",
        });
      }
      const sql = `update offer set status="${
        +offerStatus - 1
      }" where id=${offer_id}`;
      pool.query(sql, (err, result) => {
        if (err) {
          res.json({
            status: 404,
            message: "error",
          });
        }
      });
      return res.json({
        status: 200,
        message: "success",
      });
    }
  });
});

router.post("/delete-offer", (req, res, next) => {
  const { offer_id } = req.body;
  const sql = `select status from offer where id=${offer_id}`;
  pool.query(sql, (err, result) => {
    if (err) {
      return res.json({
        status: 404,
        message: err.message,
      });
    } else {
      const offerStatus = result[0]["status"];
      if (offerStatus === "not found") {
        return res.json({
          status: 404,
          message: "offer not found",
        });
      }
      const sql = `delete from offer where id=${offer_id}`;
      pool.query(sql, (err, result) => {
        if (err) {
          return res.json({
            status: 404,
            message: "error",
          });
        }
      });
      return res.json({
        status: 200,
        message: "success",
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
