const { Op } = require('sequelize');
const Vaccine = require('../models/vaccine');
const { findAll } = require('./utils/util');
const VaccineProvider = require('../models/vaccineProvider');

const findVaccines = async (
  {
    limit,
    pageNum,

    searchKey,
    vaccineProviderId,
    lotNumber,
    fromExpiredAt,
    toExpiredAt,
  },
  attributes,
) => {
  const filters = {};
  if (searchKey) filters.name = { [Op.like]: `%${searchKey}%` };
  if (vaccineProviderId) filters.vaccineProviderId = vaccineProviderId;
  if (lotNumber) filters.lotNumber = lotNumber;
  if (fromExpiredAt) filters.expiredAt = { [Op.gte]: fromExpiredAt };
  if (toExpiredAt) filters.expiredAt = { [Op.lte]: toExpiredAt };

  VaccineProvider.hasMany(Vaccine);
  Vaccine.belongsTo(VaccineProvider);

  const result = await findAll({
    model: Vaccine,
    filters,
    limit,
    pageNum,
    attributes,
    relation: [
      {
        model: VaccineProvider,
        attributes: ['id', 'name'],
      },
    ],
  });

  const { items, pagination } = result;

  return {
    items: items.map((item) => ({
      ...item,
      vaccineProvider: item.VaccineProvider?.get(),
    })),
    pagination,
  };
};

const findVaccine = async (condition) => {
  let vaccine = null;

  if (typeof condition === 'number') {
    vaccine = await Vaccine.findByPk(condition);
  } else if (typeof condition === 'object' && condition != null) {
    vaccine = await Vaccine.findOne({ where: condition });
  }

  return vaccine?.get();
};

const createVaccine = async (data) => {
  const vaccine = await Vaccine.create(data);
  return vaccine?.get();
};

const updateVaccine = async (vaccineId, data) => {
  await Vaccine.update(data, {
    where: { id: vaccineId },
  });
};

const deleteVaccine = async (vaccineId) => {
  await Vaccine.destroy({
    where: { id: vaccineId },
  });
};

module.exports = {
  findVaccines,
  findVaccine,
  createVaccine,
  updateVaccine,
  deleteVaccine,
};
