const { DataTypes } = require('sequelize');
const sequelize = require('.');

const HealthSurveyTemplate = sequelize.define(
  'HealthSurveyTemplate',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(100),
    },
    description: {
      type: DataTypes.STRING(255),
    },
    correctAnswer: {
      type: DataTypes.BOOLEAN,
      field: 'correct_answer',
    },
    order: {
      type: DataTypes.INTEGER,
    },
    type: {
      type: DataTypes.STRING(50),
    },
  },
  {
    timestamps: true,
    underscored: true,
    tableName: 'health_survey_templates',
  },
);

module.exports = HealthSurveyTemplate;
