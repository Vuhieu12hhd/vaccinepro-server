const { DataTypes } = require('sequelize');
const sequelize = require('.');
const Vaccine = require('./vaccine');
const User = require('./user');
const VaccinationSchedule = require('./vaccinationSchedule');

const VaccinationHistory = sequelize.define(
  'VaccinationHistory',
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
    status: {
      type: DataTypes.STRING(100),
    },
    note: {
      type: DataTypes.STRING(255),
    },
    totalCharge: {
      type: DataTypes.DOUBLE,
      field: 'total_charge',
    },
    isPaid: {
      type: DataTypes.BOOLEAN,
      field: 'is_paid',
    },
    paymentMethod: {
      type: DataTypes.STRING,
      field: 'payment_method',
    },
    injectorInfo: {
      type: DataTypes.TEXT,
      field: 'injector_info',
      get() {
        return this.getDataValue('injectorInfo') && JSON.parse(this.getDataValue('injectorInfo'));
      },
      set(value) {
        this.setDataValue('injectorInfo', JSON.stringify(value));
      },
    },
    vaccinationScheduleId: {
      type: DataTypes.INTEGER,
      references: {
        model: VaccinationSchedule,
        key: 'id',
      },
      field: 'vaccination_schedule_id',
    },
    monitorUserId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: 'id',
      },
      field: 'monitor_user_id',
    },
  },
  {
    timestamps: true,
    underscored: true,
    tableName: 'vaccination_histories',
  },
);

module.exports = VaccinationHistory;
