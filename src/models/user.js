const { DataTypes } = require('sequelize');
const sequelize = require('.');

const { USER_ROLE } = require('../constants');

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'phone_number',
    },
    address: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    gender: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    dob: {
      type: DataTypes.STRING(10),
      field: 'dob',
    },
    role: {
      type: DataTypes.STRING(10),
      allowNull: true,
      defaultValue: USER_ROLE.CUSTOMER,
    },
    isEmailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_email_verified',
    },
    loginMethod: {
      type: DataTypes.STRING(50),
      defaultValue: 'NORMAL',
      field: 'login_method',
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    isLock: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0,
      field: 'is_lock',
    },
    lockTo: {
      type: DataTypes.DATE,
      field: 'lock_to',
    },
    lockReason: {
      type: DataTypes.STRING(100),
      field: 'lock_reason',
    },
    wrongPasswordCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'wrong_password_count',
    },
  },
  {
    timestamps: true,
    underscored: true,
    tableName: 'users',
  },
);

module.exports = User;
