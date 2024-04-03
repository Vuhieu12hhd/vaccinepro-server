const { Op } = require('sequelize');
const VaccineProvider = require('../models/vaccineProvider');
const { findAll } = require('./utils/util');

const findVaccineProviders = async ({ limit, pageNum, searchKey }, attributes) => {
  const filters = {};
  if (searchKey) filters.name = { [Op.like]: `%${searchKey}%` };

  const result = await findAll({
    model: VaccineProvider,
    limit,
    pageNum,
    filters,
    attributes,
  });
  return result;
};

const findVaccineProvider = async (condition) => {
  if (typeof condition === 'number') {
    const vaccineProvider = await VaccineProvider.findByPk(condition);
    return vaccineProvider?.get();
  }

  if (typeof condition === 'object' && condition != null) {
    const vaccineProvider = await VaccineProvider.findOne({ where: condition });
    return vaccineProvider?.get();
  }

  return null;
};

const createVaccineProvider = async (data) => {
  const vaccineProvider = await VaccineProvider.create(data);
  return vaccineProvider?.get();
};

const updateVaccineProvider = async (vaccineProviderId, data) => {
  await VaccineProvider.update(data, {
    where: { id: vaccineProviderId },
  });
};

const deleteVaccineProvider = async (vaccineProviderId) => {
  await VaccineProvider.destroy({
    where: { id: vaccineProviderId },
  });
};

module.exports = {
  findVaccineProviders,
  findVaccineProvider,
  createVaccineProvider,
  updateVaccineProvider,
  deleteVaccineProvider,
};
