const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3500;
const upload = require("express-fileupload");
const path = require("path");
require("./routes/jobs/cron");
require("./routes/socket/socket");

app.use(cors());
app.use(upload());
app.use(express.json());
// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "uploads")));

// Serve a file at the "/:filename" route
app.get("/:filename", (req, res) => {
  // Get the filename from the route parameter
  const filename = req.params.filename;

  // Serve the file located at "public/filename"
  res.sendFile(path.join(__dirname, "uploads/images", filename));
});

const loginRouter = require("./routes/loginApi");
const adminRouter = require("./routes/adminApi");
const studentRouter = require("./routes/studentApi");
const offerRouter = require("./routes/offerApi");
const accountApi = require("./routes/accountApi");
const emailApi = require("./routes/apps/email/emailApi");
const { router: notifications } = require("./routes/notifications");

app.use("/login", loginRouter);
app.use("/admin", adminRouter);
app.use("/student", studentRouter);
app.use("/offer", offerRouter);
app.use("/account", accountApi);
app.use("/email", emailApi);
app.use("/notifications", notifications);

app.listen(port, () => {});
