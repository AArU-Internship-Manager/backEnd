const express = require("express");
const router = express.Router();
const { createPool } = require("mysql");
const { storeNotification } = require("./notifications");
var jwt = require("jsonwebtoken");
const { request } = require("express");
const moment = require("moment");
const DB_CONNECTION = require("../db");

const pool = createPool(DB_CONNECTION);

router.use(fetchToken);
router.use(verifyToken);

router.get("/get-offer", (req, res) => {
  try {
    const { id } = req.query;
    const sql = `SELECT * FROM offer WHERE id=${id}`;
    pool.query(sql, (err, result) => {
      if (err) {
        res.status(404);
        res.send(err);
      } else {
        res.status(200);
        res.json(result[0]);
      }
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ error: "An error occurred while processing your request." });
  }
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

router.get("/get-finished", (req, res, next) => {
  const sql1 = `SELECT university_id FROM representative WHERE user_id=${req.id}`;
  pool.query(sql1, (err, result) => {
    if (err) {
      res.status(404);
      res.send(err);
    } else {
      id = result[0]["university_id"];
      const sql2 = `SELECT * FROM offer WHERE (university_id_src=${id} or University_id_des=${id}) and status >= 8`;
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

router.get("/show_offer", (req, res, next) => {
  if (!req.id) return res.send(400);
  const sql1 = `SELECT university_id FROM representative WHERE user_id=${req.id}`;
  pool.query(sql1, (err, result) => {
    if (err) {
      res.status(404);
      res.send(err);
    } else {
      id = result[0]["university_id"];
      const sql2 = `SELECT * FROM offer WHERE (university_id_src=${id} or University_id_des=${id}) and status < 8`;
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
    if (err || result.length == 0) {
      return res.json({
        status: 400,
        message: "you are not a representative",
      });
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
                 train_length,train_start_date,train_end_date,support_amount,user_id,
                 train_aria, days_of_work, weekly_hours, daily_hours,college_name, branch_name,major_name, stu_level, stu_sex,
                  work_field, status,meals_text, residence_text, transfer_text,inst_phone,inst_fax,inst_name,inst_address,trainer_name, place_of_work)
             VALUES ("${new Date()
               .toISOString()
               .slice(
                 0,
                 10
               )}", ${university_id_src}, "${other_requirments}", "${train_description}", "${train_type}",
             ${train_length},"${train_start_date}", "${train_end_date}", "${support_amount}", 
               ${userId}, "${train_aria}", "${days_of_work.toString()}", "${weekly_hours}", "${daily_hours}",
              "${college_name}", "${branch_name}", "${major_name}", "${stu_level}","${stu_sex}", "${null}", 0,
              "${meals ? meals_text : null}", "${
        residence ? residence_text : null
      }", "${transfer ? transfer_text : null}",
              "${inst_phone}", "${inst_fax}", "${inst_name}", "${inst_address}", "${trainer_name}", "${place_of_work}")`;

      pool.query(sql, (err, result) => {
        if (err) {
          return res.json({
            status: 400,
            message: err,
          });
        } else {
          return res.json({
            status: 200,
            message: "offer inserted successfully",
          });
        }
      });
    }
  });
});

router.patch("/update_offer", (req, res, next) => {
  const sql1 = `SELECT university_id FROM representative WHERE user_id=${req.id}`;
  pool.query(sql1, (err, result) => {
    if (err || result.length == 0) {
      return res.json({
        status: 400,
        message: "you are not a representative",
      });
    } else {
      const university_id_src = result[0]["university_id"];
      const { id } = req.body;
      let setString = "";
      Object.entries(req.body).forEach(([key, value]) => {
        if (value !== null && value !== "") {
          if (key === "meals_text" && !req.body.meals) return;
          if (key === "residence_text" && !req.body.residence) return;
          if (key === "transfer_text" && !req.body.transfer) return;
          if (key === "offer_id") return;
          if (key === "meals" || key === "transfer" || key === "residence")
            return;
          setString += `${key} = "${value}",`;
        }
      });
      setString = setString.slice(0, -1);
      const sql = `UPDATE offer SET ${setString} WHERE id = ${id}`;
      pool.query(sql, (err, result) => {
        if (err) {
          return res.json({
            status: 400,
            message: err,
          });
        } else {
          return res.json({
            status: 200,
            message: "offer updated successfully",
          });
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

  const receive_date = new Date().toISOString().slice(0, 10);

  const sql = `update offer set 
        status=status+1, 
        University_id_des="${university_id_des}", 
        receive_date="${receive_date}" where id="${offer_id}"`;
  pool.query(sql, async (err, result) => {
    if (err) {
      return res.json({
        status: 404,
        message: "error",
      });
    }
    return res.json({
      status: 200,
      message: "offer updated successfully",
    });
  });
});

router.post("/accept-offer", (req, res, next) => {
  const { offer_id } = req.body;
  const sql = `UPDATE offer SET status=status+1 where id=${offer_id}`;
  pool.query(sql, (err, result) => {
    if (err) {
      return res.json({
        status: 404,
        message: "error",
      });
    }
    return res.json({
      status: 200,
      message: "offer updated successfully",
    });
  });
});

router.post("/reject-offer", (req, res, next) => {
  const { offer_id } = req.body;

  const sql = `update offer set status=status-1, University_id_des=NULL where id=${offer_id}`;
  pool.query(sql, (err, result) => {
    if (err) {
      res.json({
        status: 404,
        message: "error",
      });
    }
    return res.json({
      status: 200,
      message: "offer updated successfully",
    });
  });
});

router.post("/reject-submission", (req, res, next) => {
  const { offer_id } = req.body;

  const sql = `update offer set status=status-1 where id=${offer_id}`;
  pool.query(sql, (err, result) => {
    if (err) {
      return res.json({
        status: 404,
        message: "error",
      });
    }
    return res.json({
      status: 200,
      message: "offer updated successfully",
    });
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
        return res.json({
          status: 200,
          message: "success",
        });
      });
    }
  });
});

// add student to request and add 1 to status of offer
router.post("/add-student", (req, res, next) => {
  const { offer_id, student_id } = req.body;
  const id = req.id;
  const sql = `update offer set status=status+1 where id=${offer_id}`;
  pool.query(sql, (err, result) => {
    if (err) {
      res.json({
        status: 404,
        message: "error",
      });
    } else {
      const sql2 = `insert into requests (offer_id, student_id, assignDate) values (${offer_id}, ${student_id}, NOW())`;
      pool.query(sql2, (err, result) => {
        if (err) {
          return res.json({
            status: 404,
            message: "error",
          });
        } else {
          return res.json({
            status: 200,
            message: "offer updated successfully",
          });
        }
      });
    }
  });
});

router.post("/remove-student", (req, res, next) => {
  const { offer_id, student_id } = req.body;
  const sql = `update offer set status= status-1 where id=${offer_id}`;
  pool.query(sql, (err, result) => {
    if (err) {
      return res.json({
        status: 400,
        message: err.message,
      });
    }
    const sql2 = `DELETE from requests
    WHERE requests.offer_id = ${offer_id} AND requests.student_id = ${student_id};
    `;
    pool.query(sql2, (err, result) => {
      if (err) {
        return res.json({
          status: 400,
          message: err.message,
        });
      }
      return res.json({
        status: 200,
        message: "offer updated successfully",
      });
    });
  });
});

router.get("/get-university-data", (req, res, next) => {
  const { universityId } = req.query;
  const sql = `select * from university where id= "${universityId}"`;
  pool.query(sql, (err, result) => {
    if (err || result.length === 0) {
      res.status(404);
      res.send("not found");
    } else {
      const university = result[0];
      res.status(200).send(university);
    }
  });
});

router.get("/get-student-data", (req, res, next) => {
  const { offerId } = req.query;
  const sql = `SELECT s.*, r.*
  FROM student s
  JOIN requests r ON s.ID = r.student_id
  WHERE r.offer_id = "${offerId}"`;
  pool.query(sql, (err, result) => {
    if (err || result.length === 0) {
      console.error(err);
      res.status(404);
      res.send("not found");
    } else {
      const student = result[0];
      res.status(200).send(student);
    }
  });
});

router.get("/get-request-data", (req, res, next) => {
  const { offerId } = req.query;
  const sql = `SELECT r.*
  FROM student s
  JOIN requests r ON s.ID = r.student_id
  WHERE r.offer_id = "${offerId}"`;
  pool.query(sql, (err, result) => {
    if (err || result.length === 0) {
      console.error(err);
      res.status(404);
      res.send("not found");
    } else {
      const request = result[0];
      res.status(200).send(request);
    }
  });
});

router.get("/get-university-report", (req, res, next) => {
  const { requestId } = req.query;
  const sql = `
  SELECT * FROM university_evaluation WHERE request_id = ?`;
  pool.query(sql, [requestId], (err, result) => {
    if (err) {
      console.error(err);
      res.status(404);
      res.send("not found");
    } else {
      const request = result[0];
      return res.send(request).status(200);
    }
  });
});
router.get("/get-student-report", (req, res, next) => {
  const { requestId } = req.query;
  const sql = `
  SELECT * FROM student_evaluation WHERE request_id = ?`;
  pool.query(sql, [requestId], (err, result) => {
    if (err) {
      console.error(err);
      res.status(404);
      res.send("not found");
    } else {
      const request = result[0];
      return res.send(request).status(200);
    }
  });
});

router.put("/update-request", (req, res) => {
  let sql = `UPDATE requests SET `;
  const data = req.body;
  const keys = Object.keys(data.values);
  keys.forEach((key, index) => {
    sql += `${key} = '${data.values[key]}',`;
  });
  sql += `status=1 WHERE offer_id = ${data.offer_id}`;
  console.log(sql);
  pool.query(sql, (err, result) => {
    if (err) {
      return res.json({
        status: 400,
        message: err.message,
      });
    }
    return res.json({
      status: 200,
      message: "offer updated successfully",
    });
  });
});

router.put("/submit-request", (req, res) => {
  const data = req.body;
  let sql = `UPDATE requests r JOIN offer o ON r.offer_id = o.id SET r.submitDate = NOW(), o.status = o.status + 1 WHERE r.offer_id = ?`;
  pool.query(sql, [data.offer_id], (err, result) => {
    if (err) {
      return res.json({
        status: 400,
        message: err.message,
      });
    }
    return res.json({
      status: 200,
      message: "offer updated successfully",
    });
  });
});

router.put("/accept-request", (req, res) => {
  const data = req.body;
  let sql = `UPDATE requests r JOIN offer o ON r.offer_id = o.id 
  SET r.acceptDate = NOW(), 
      o.status = o.status + IF(o.train_start_date > NOW(),1,2)
  WHERE r.offer_id = ?`;
  pool.query(sql, [data.offer_id], (err, result) => {
    if (err) {
      return res.json({
        status: 400,
        message: err.message,
      });
    }
    return res.json({
      status: 200,
      message: "offer updated successfully",
    });
  });
});

router.put("/reject-request", (req, res) => {
  const data = req.body;
  let sql = `UPDATE requests r JOIN offer o ON r.offer_id = o.id SET r.acceptDate = null, o.status = o.status - 1 WHERE r.offer_id = ?`;
  pool.query(sql, [data.offer_id], (err, result) => {
    if (err) {
      return res.json({
        status: 400,
        message: err.message,
      });
    }
    return res.json({
      status: 200,
      message: "request rejected successfully",
    });
  });
});

const getStatus = async (offer_id) => {
  const sql = `select status from offer where id=${offer_id}`;
  return new Promise((resolve, reject) => {
    pool.query(sql, (err, result) => {
      if (err || result.length === 0) {
        reject("offer not found");
      } else {
        resolve(result[0]["status"]);
      }
    });
  });
};

const getOfferDetails = async (offer_id) => {
  const sql = `select * from offer where id=${offer_id}`;
  return new Promise((resolve, reject) => {
    pool.query(sql, (err, result) => {
      if (err || result.length === 0) {
        reject("offer not found");
      } else {
        resolve(result[0]);
      }
    });
  });
};
const addOffer = async (offerDetails) => {
  const {
    university_id_src,
    other_requirments,
    train_description,
    train_type,
    train_start_date,
    train_end_date,
    support_amount,
    University_id_des,
    organization_id,
    user_id,
    train_aria,
    days_of_work,
    weekly_hours,
    daily_hours,
    college_name,
    branch_name,
    major_name,
    stu_level,
    stu_sex,
    work_field,
    meals_text,
    residence_text,
    transfer_text,
    status,
    inst_address,
    inst_fax,
    inst_phone,
    trainer_name,
    train_length,
    inst_name,
  } = offerDetails;

  const sql = `insert into offer (offer_date,university_id_src, other_requirments,train_description,train_type,
    train_start_date,train_end_date,support_amount,University_id_des,organization_id,user_id,train_aria,
    days_of_work,weekly_hours,daily_hours,college_name,branch_name,major_name,
    stu_level,stu_sex,work_field,meals_text,residence_text,transfer_text,status,
    inst_address,inst_fax,inst_phone,trainer_name,train_length,inst_name)
  values ("${new Date()
    .toISOString()
    .slice(0, 10)}","${university_id_src}", "${other_requirments}",
  "${train_description}","${train_type}","${train_start_date}","${train_end_date}",
  "${support_amount}", ${University_id_des}, ${organization_id},"${user_id}", "${train_aria}",
  "${days_of_work}","${weekly_hours}","${daily_hours}","${college_name}","${branch_name}","${major_name}",
  "${stu_level}","${stu_sex}","${work_field}","${meals_text}","${residence_text}","${transfer_text}","${status}",
  "${inst_address}","${inst_fax}", "${inst_phone}", "${trainer_name}", "${train_length}", "${inst_name}")`;

  return new Promise((resolve, reject) => {
    pool.query(sql, (err, result) => {
      if (err) {
        reject("offer not found");
      } else {
        resolve(result);
      }
    });
  });
};

// generate a api for duplicate offer by number of duplicate
router.post("/duplicate", async (req, res, next) => {
  const { offer_id, number } = req.body.body;
  try {
    const offerStatus = await getStatus(offer_id);
    if (offerStatus !== 0) {
      return res.json({
        status: 400,
        message: "can not duplicate",
      });
    }
    const offerDetails = await getOfferDetails(offer_id);
    for (let i = 0; i < number; i++) {
      await addOffer(offerDetails);
    }
    return res.json({
      status: 200,
      message: "offer duplicated",
    });
  } catch (err) {
    return res.json({
      status: 400,
      message: "offer not found",
    });
  }
});

router.post("/insert_evaluation", (req, res, next) => {
  const { values: data, requestId } = req.body;
  // console.log(data);
  const issueDate = new Date().toISOString().slice(0, 10);
  const keys = Object.keys(data).concat("request_id").concat("issueDate");
  const values = Object.values(data).concat(requestId).concat(issueDate);
  const sql = `INSERT INTO university_evaluation (${keys.join(
    ", "
  )}) VALUES ("${values.join('", "')}")`;
  // console.log(sql);
  pool.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      return res.json({
        status: 400,
        message: err,
      });
    } else {
      return res.json({
        status: 200,
        message: "evaluation added successfully",
      });
    }
  });
});

router.post("/insert_feedback", (req, res, next) => {
  const { values: data, requestId, offerId } = req.body;
  const issueDate = new Date().toISOString().slice(0, 10);
  const keys = Object.keys(data).concat("request_id").concat("issueDate");
  const values = Object.values(data).concat(requestId).concat(issueDate);
  const sql = `INSERT INTO student_evaluation (${keys.join(
    ", "
  )}) VALUES ("${values.join('", "')}")`;
  pool.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      return res.json({
        status: 400,
        message: err,
      });
    } else {
      pool.query(
        `UPDATE offer SET status = ? WHERE id = ?`,
        [8, offerId],
        (err, result) => {
          if (err) {
            console.error(err);
            return res.json({
              status: 400,
              message: err,
            });
          } else {
            return res.json({
              status: 200,
              message: "evaluation added successfully",
            });
          }
        }
      );
    }
  });
});

router.post("/student/insert_evaluation", (req, res, next) => {
  const data = req.body;
  const keys = Object.keys(data);
  const values = Object.values(data);

  const sql = `INSERT INTO student_evaluation (${keys.join(
    ", "
  )}) VALUES ("${values.join('", "')}")`;

  pool.query(sql, (err, result) => {
    if (err) {
      return res.json({
        status: 400,
        message: err,
      });
    } else {
      return res.json({
        status: 200,
        message: "evaluation added successfully",
      });
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

const updateOfferStatus = async () => {
  try {
    const offers = pool.query(
      `SELECT * FROM offer WHERE receive_date < DATE_SUB(?, INTERVAL 2 DAY) AND status = 1;`,
      [currentDate],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          result.forEach(async (offer) => {
            pool.query(
              `UPDATE offer SET status = ?, University_id_des = ? WHERE id = ?`,
              [0, null, offer.id]
            );
          });
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
};

const beginOffer = async () => {
  try {
    const offers = pool.query(
      `SELECT * FROM offer WHERE train_start_date < NOW() AND status = 5;`,
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          result.forEach(async (offer) => {
            pool.query(`UPDATE offer SET status = ? WHERE id = ?`, [
              6,
              offer.id,
            ]);
          });
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
};
const finishOffer = async () => {
  try {
    pool.query(
      `SELECT * FROM offer WHERE train_end_date < NOW() AND status = 6;`,
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          result.forEach(async (offer) => {
            pool.query(`UPDATE offer SET status = ? WHERE id = ?`, [
              7,
              offer.id,
            ]);
          });
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
};

const closeOffer = async (offerId) => {
  try {
    pool.query(`UPDATE offer SET status = ? WHERE id = ?`, [8, offerId]);
  } catch (err) {
    console.log(err);
  }
};

module.exports = updateOfferStatus;
module.exports = finishOffer;
module.exports = beginOffer;
module.exports = router;
