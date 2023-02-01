const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const StudentEvaluation = sequelize.define(
  "student_evaluation",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    request_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    offer_match: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    training_program: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    program_rating: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    management_rating: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    employee_rating: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    grad_req: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    housing: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    food: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    accommodation_difficulty: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    university_reception: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    coach_reception: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    recommendation: {
      type: Sequelize.STRING(255),
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

module.exports = StudentEvaluation;
