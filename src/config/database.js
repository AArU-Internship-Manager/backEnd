const Sequelize = require("sequelize");

const sequelize = new Sequelize("swap-ar-uni", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = sequelize;
