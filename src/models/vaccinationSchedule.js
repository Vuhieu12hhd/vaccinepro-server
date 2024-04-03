const { DataTypes } = require('sequelize');
const sequelize = require('.');
const Vaccine = require('./vaccine');
const User = require('./user');
const { HEALTH_SURVEY_STATUS } = require('../constants');

const VaccinationSchedule = sequelize.define(
  'VaccinationSchedule',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
    },
    vaccineId: {
      type: DataTypes.INTEGER,
      references: {
        model: Vaccine,
        key: 'id',
      },
      field: 'vaccine_id',
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: 'id',
      },
      field: 'user_id',
    },
    address: {
      type: DataTypes.STRING(100),
    },
    injectorInfo: {
      type: DataTypes.TEXT,
      field: 'injector_info',
      get() {
        return this.getDataValue('injectorInfo') && JSON.parse(this.getDataValue('injectorInfo'));
      },
      set(value) {
        this.setDataValue('injectorInfo', value && JSON.stringify(value));
      },
    },
    healthSurveyAnswers: {
      type: DataTypes.TEXT,
      field: 'health_survey_answers',
      get() {
        return (
          this.getDataValue('healthSurveyAnswers') &&
          JSON.parse(this.getDataValue('healthSurveyAnswers'))
        );
      },
      set(value) {
        this.setDataValue('healthSurveyAnswers', value && JSON.stringify(value));
      },
    },
    healthSurveyStatus: {
      type: DataTypes.STRING,
      defaultValue: HEALTH_SURVEY_STATUS.PENDING,
      field: 'health_survey_status',
    },
    isCanceled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_canceled',
    },
    canceledAt: {
      type: DataTypes.DATE,
      field: 'canceled_at',
    },
  },
  {
    timestamps: true,
    underscored: true,
    tableName: 'vaccination_schedules',
  },
);

module.exports = VaccinationSchedule;
