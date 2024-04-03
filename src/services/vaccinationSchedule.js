const CustomError = require('../errors/CustomError');
const errorCodes = require('../errors/code');

const vaccinationScheduleDao = require('../daos/vaccinationSchedule');
const vaccineDao = require('../daos/vaccine');

const getVaccinationSchedules = async (query) => {
  const vaccinationSchedules = await vaccinationScheduleDao.findVaccinationSchedules(query);
  return vaccinationSchedules;
};

const getVaccinationScheduleById = async (query) => {
  const vaccinationSchedule = await vaccinationScheduleDao.findVaccinationSchedule(query);

  if (!vaccinationSchedule) {
    throw new CustomError(errorCodes.VACCINATION_SCHEDULE_NOT_FOUND);
  }

  return vaccinationSchedule;
};

const createVaccinationSchedule = async (userId, { vaccineId, ...vaccinationScheduleData }) => {
  const vaccine = await vaccineDao.findVaccine(vaccineId);
  if (!vaccine) throw new CustomError(errorCodes.VACCINE_NOT_FOUND);

  const { quantity, injectedQuantity, expiredQuantity, errorQuantity } = vaccine;

  const remainQuantity = quantity - injectedQuantity - expiredQuantity - errorQuantity;
  if (remainQuantity <= 0) throw new CustomError(errorCodes.VACCINE_NUMBER_RUN_OUT);

  const vaccinationSchedule = await vaccinationScheduleDao.createVaccinationSchedule({
    ...vaccinationScheduleData,
    vaccineId,
    userId,
  });
  return vaccinationSchedule;
};

const updateVaccinationSchedule = async (
  vaccinationScheduleId,
  vaccinationScheduleUpdateData,
  userId,
) => {
  const vaccinationScheduleExist = await vaccinationScheduleDao.findVaccinationSchedule({
    id: vaccinationScheduleId,
    userId,
  });

  if (!vaccinationScheduleExist) {
    throw new CustomError(errorCodes.VACCINATION_SCHEDULE_NOT_FOUND);
  }

  const { vaccineId, isCanceled } = vaccinationScheduleUpdateData || {};
  if (vaccineId) {
    const vaccine = await vaccineDao.findVaccine(vaccineId);
    if (!vaccine) throw new CustomError(errorCodes.VACCINE_NOT_FOUND);
  }

  if (isCanceled === true) vaccinationScheduleUpdateData.canceledAt = new Date();
  else if (isCanceled === false) vaccinationScheduleUpdateData.canceledAt = null;

  await vaccinationScheduleDao.updateVaccinationSchedule(
    vaccinationScheduleId,
    vaccinationScheduleUpdateData,
  );

  const vaccinationScheduleUpdated = await vaccinationScheduleDao.findVaccinationSchedule(
    vaccinationScheduleId,
  );

  return vaccinationScheduleUpdated;
};

const updateHealthSurveyStatus = async (vaccinationScheduleId, { status }) => {
  const vaccinationScheduleExist = await vaccinationScheduleDao.findVaccinationSchedule(
    vaccinationScheduleId,
  );

  if (!vaccinationScheduleExist) {
    throw new CustomError(errorCodes.VACCINATION_SCHEDULE_NOT_FOUND);
  }

  await vaccinationScheduleDao.updateVaccinationSchedule(vaccinationScheduleId, {
    healthSurveyStatus: status,
  });

  const vaccinationSchedule = await vaccinationScheduleDao.findVaccinationSchedule(
    vaccinationScheduleId,
  );

  return vaccinationSchedule;
};

const deleteVaccinationSchedule = async (vaccinationScheduleId) => {
  const vaccinationScheduleExist = await vaccinationScheduleDao.findVaccinationSchedule(
    vaccinationScheduleId,
  );

  if (!vaccinationScheduleExist) {
    throw new CustomError(errorCodes.VACCINATION_SCHEDULE_NOT_FOUND);
  }

  await vaccinationScheduleDao.deleteVaccinationSchedule(vaccinationScheduleId);
};

module.exports = {
  getVaccinationSchedules,
  getVaccinationScheduleById,
  createVaccinationSchedule,
  updateVaccinationSchedule,
  updateHealthSurveyStatus,
  deleteVaccinationSchedule,
};
