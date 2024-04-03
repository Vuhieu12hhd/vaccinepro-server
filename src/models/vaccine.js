const { DataTypes } = require('sequelize');
const sequelize = require('.');
const VaccineProvider = require('./vaccineProvider');

const Vaccine = sequelize.define(
  'Vaccine',
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
    description: {
      type: DataTypes.STRING(100),
    },
    vaccineProviderId: {
      type: DataTypes.INTEGER,
      references: {
        model: VaccineProvider,
        key: 'id',
      },
      field: 'vaccine_provider_id',
    },
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    injectedQuantity: {
      type: DataTypes.INTEGER,
      field: 'injected_quantity',
      defaultValue: 0,
    },
    expiredQuantity: {
      type: DataTypes.INTEGER,
      field: 'expired_quantity',
      defaultValue: 0,
    },
    errorQuantity: {
      type: DataTypes.INTEGER,
      field: 'error_quantity',
      defaultValue: 0,
    },
    price: {
      type: DataTypes.DOUBLE,
      defaultValue: 0,
    },
    standard: {
      type: DataTypes.STRING(100),
    },
    lotNumber: {
      type: DataTypes.STRING(100),
      field: 'lot_number',
    },
    expiredAt: {
      type: DataTypes.DATE,
      field: 'expired_at',
    },
  },
  {
    timestamps: true,
    underscored: true,
    tableName: 'vaccines',
  },
);

module.exports = Vaccine;
