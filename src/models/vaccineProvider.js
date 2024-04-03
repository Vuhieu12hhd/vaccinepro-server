const { DataTypes } = require('sequelize');
const sequelize = require('.');

const VaccineProvider = sequelize.define(
  'VaccineProvider',
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
  },
  {
    timestamps: true,
    underscored: true,
    tableName: 'vaccine_providers',
  },
);

module.exports = VaccineProvider;
