const { DataTypes } = require('sequelize');
const sequelize = require('.');

const VerificationCode = sequelize.define(
  'VerificationCode',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    transactionId: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'transaction_id',
    },
    code: {
      type: DataTypes.STRING(25),
      allowNull: false,
    },
    targetType: {
      type: DataTypes.STRING(25),
      allowNull: false,
      field: 'target_type',
    },
    sendType: {
      type: DataTypes.STRING(25),
      field: 'send_type',
    },
    status: {
      type: DataTypes.STRING(25),
      allowNull: false,
    },
    expirationAt: {
      type: DataTypes.DATE,
      field: 'expiration_at',
    },
  },
  {
    timestamps: true,
    underscored: true,
    tableName: 'verification_code',
  },
);

module.exports = VerificationCode;
