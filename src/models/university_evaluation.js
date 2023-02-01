const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const UniversityEvaluation = sequelize.define(
  "university_evaluation",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    student_performance: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    coworker_relationship: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    training_officer_relationship: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    duty_performance: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    learning_ability: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    documentation_ability: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    request_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    issueDate: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = UniversityEvaluation;
