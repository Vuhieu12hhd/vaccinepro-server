const { Op } = require('sequelize');
const VaccinationHistory = require('../models/vaccinationHistory');
const { findAll } = require('./utils/util');
const Vaccine = require('../models/vaccine');

const toVaccinationHistory = (vaccinationHistory) => vaccinationHistory;

const findVaccinationHistories = async (
  {
    limit,
    pageNum,
    startDate,
    endDate,
    vaccineId,
    userId,
    status,
    searchKey,
    hasGetPagination,
    isPaid,
  },
  attributes,
) => {
  const filters = {};
  if (searchKey) filters.injectorInfo = { [Op.like]: `%"name":"%${searchKey}%"%` };
  if (startDate) filters.date = { [Op.gte]: startDate };
  if (endDate) filters.date = { [Op.lte]: endDate };
  if (vaccineId) filters.vaccineId = vaccineId;
  if (userId) filters.userId = userId;
  if (status) filters.status = { [Op.in]: status.split(',') };
  if (isPaid) filters.isPaid = isPaid;

  Vaccine.hasMany(VaccinationHistory);
  VaccinationHistory.belongsTo(Vaccine);

  const result = await findAll({
    model: VaccinationHistory,
    filters,
    limit,
    pageNum,
    attributes,
    relation: [
      {
        model: Vaccine,
        attributes: ['id', 'name', 'price', 'standard', 'lotNumber'],
      },
    ],
    hasGetPagination,
  });

  const { items, pagination } = result;

  return {
    items: items.map((vaccinationHistory) =>
      toVaccinationHistory({
        ...vaccinationHistory,
        vaccine: vaccinationHistory.Vaccine?.get(),
      }),
    ),
    pagination,
  };
};

const findVaccinationHistory = async (condition) => {
  let vaccinationHistory;
  if (typeof condition === 'number') {
    vaccinationHistory = await VaccinationHistory.findByPk(condition);
  } else if (typeof condition === 'object' && condition != null) {
    vaccinationHistory = await VaccinationHistory.findOne({
      where: condition,
    });
  }

  return toVaccinationHistory(vaccinationHistory?.get());
};

const createVaccinationHistory = async (data) => {
  const vaccinationHistory = await VaccinationHistory.create(data);
  return toVaccinationHistory(vaccinationHistory?.get());
};

const updateVaccinationHistory = async (vaccinationHistoryId, data) => {
  await VaccinationHistory.update(data, {
    where: { id: vaccinationHistoryId },
  });
};

const deleteVaccinationHistory = async (vaccinationHistoryId) => {
  await VaccinationHistory.destroy({
    where: { id: vaccinationHistoryId },
  });
};

module.exports = {
  findVaccinationHistories,
  findVaccinationHistory,
  createVaccinationHistory,
  updateVaccinationHistory,
  deleteVaccinationHistory,
};
