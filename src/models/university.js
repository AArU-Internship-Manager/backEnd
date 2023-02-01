const Sequelize = require("sequelize");
const sequelize = require("../config/database");

//define the model for the university table
const University = sequelize.define("university", {
  ID: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  EN_Name: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  AR_Name: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  Location_O: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  Study_business: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  work_day: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  hour_no_week: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  phone: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  Fax: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  hour_no_day: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  url: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  city_id: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  logo: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  role: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
});

module.exports = University;
