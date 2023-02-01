const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const Representative = sequelize.define(
  "representative",
  {
    ID: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    university_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    end_date: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    start_date: {
      type: Sequelize.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: false,
    tableName: "representative",
    freezeTableName: true,
  }
);

module.exports = Representative;
