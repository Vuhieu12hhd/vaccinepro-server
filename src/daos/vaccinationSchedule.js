const VaccinationSchedule = require('../models/vaccinationSchedule');
const Vaccine = require('../models/vaccine');
const { findAll } = require('./utils/util');

const toVaccinationSchedule = (vaccinationSchedule) =>
  vaccinationSchedule && {
    ...vaccinationSchedule,
    vaccine: vaccinationSchedule?.Vaccine?.get(),
  };

const findVaccinationSchedules = async ({ limit, pageNum, userId }, attributes) => {
  const filters = {};
  if (userId) filters.userId = userId;

  Vaccine.hasMany(VaccinationSchedule);
  VaccinationSchedule.belongsTo(Vaccine);

  const result = await findAll({
    model: VaccinationSchedule,
    limit,
    pageNum,
    filters,
    attributes,
    relation: [
      {
        model: Vaccine,
        attributes: ['id', 'name', 'price', 'standard', 'lotNumber'],
      },
    ],
  });

  const { items, pagination } = result;

  return {
    items: items.map((vaccinationSchedule) =>
      toVaccinationSchedule({
        ...vaccinationSchedule,
        vaccine: vaccinationSchedule.Vaccine?.get(),
      }),
    ),
    pagination,
  };
};

const findVaccinationSchedule = async (condition) => {
  let filters = {};
  if (typeof condition === 'number') {
    filters.id = condition;
  } else if (typeof condition === 'object' && condition != null) {
    filters = condition;
  } else {
    return null;
  }

  Vaccine.hasMany(VaccinationSchedule);
  VaccinationSchedule.belongsTo(Vaccine);

  const vaccinationSchedule = await VaccinationSchedule.findOne({
    where: filters,
    include: [
      {
        model: Vaccine,
        attributes: ['id', 'name', 'price', 'standard', 'lotNumber'],
      },
    ],
  });

  return toVaccinationSchedule(vaccinationSchedule?.get());
};

const createVaccinationSchedule = async (data) => {
  const vaccinationSchedule = await VaccinationSchedule.create(data);
  return toVaccinationSchedule(vaccinationSchedule?.get());
};

const updateVaccinationSchedule = async (vaccinationScheduleId, data) => {
  await VaccinationSchedule.update(data, {
    where: { id: vaccinationScheduleId },
  });
};

const deleteVaccinationSchedule = async (vaccinationScheduleId) => {
  await VaccinationSchedule.destroy({
    where: { id: vaccinationScheduleId },
  });
};

module.exports = {
  findVaccinationSchedules,
  findVaccinationSchedule,
  createVaccinationSchedule,
  updateVaccinationSchedule,
  deleteVaccinationSchedule,
};
