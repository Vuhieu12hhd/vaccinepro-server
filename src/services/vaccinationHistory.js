/* eslint-disable default-case */
/* eslint-disable no-continue */
const moment = require('moment');

const CustomError = require('../errors/CustomError');
const errorCodes = require('../errors/code');

const vaccinationHistoryDao = require('../daos/vaccinationHistory');
const vaccinationScheduleDao = require('../daos/vaccinationSchedule');
const vaccineDao = require('../daos/vaccine');
const userDao = require('../daos/user');

const { VACCINATION_STATUS, USER_ROLE, STATISTIC_TYPE } = require('../constants');

const getVaccinationHistories = async (condition) => {
  const vaccinationHistories = await vaccinationHistoryDao.findVaccinationHistories(condition);
  return vaccinationHistories;
};

const getVaccinationHistoryById = async (query) => {
  const vaccinationHistory = await vaccinationHistoryDao.findVaccinationHistory(query);

  if (!vaccinationHistory) {
    throw new CustomError(errorCodes.VACCINATION_HISTORY_NOT_FOUND);
  }

  return vaccinationHistory;
};

const createVaccinationHistory = async (vaccinationHistoryData) => {
  const {
    userId,
    vaccinationScheduleId,
    vaccineId,
    monitorUserId,
    ...vaccinationHistoryRemainData
  } = vaccinationHistoryData;

  if (vaccinationScheduleId) {
    const vaccinationSchedule = await vaccinationScheduleDao.findVaccinationSchedule(
      vaccinationScheduleId,
    );
    if (!vaccinationSchedule) throw new CustomError(errorCodes.VACCINATION_SCHEDULE_NOT_FOUND);
  }

  if (userId) {
    const user = await userDao.findUser(userId);
    if (!user) throw new CustomError(errorCodes.USER_NOT_FOUND);
  }

  const vaccine = await vaccineDao.findVaccine(vaccineId);
  if (!vaccine) throw new CustomError(errorCodes.VACCINE_NOT_FOUND);

  const monitorUser = await userDao.findUser(monitorUserId);
  if (!monitorUser) throw new CustomError(errorCodes.MONITOR_USER_NOT_FOUND);
  if (monitorUser.role !== USER_ROLE.DOCTOR)
    throw new CustomError(errorCodes.MONITOR_USER_NOT_A_DOCTOR);

  const {
    price: totalCharge,
    quantity,
    injectedQuantity,
    expiredQuantity,
    errorQuantity,
  } = vaccine;

  const remainQuantity = quantity - injectedQuantity - expiredQuantity - errorQuantity;
  if (remainQuantity <= 0) throw new CustomError(errorCodes.VACCINE_NUMBER_RUN_OUT);

  const vaccinationHistory = await vaccinationHistoryDao.createVaccinationHistory({
    ...vaccinationHistoryRemainData,
    date: new Date(),
    status: VACCINATION_STATUS.SCREEN_TEST_WAITING,
    totalCharge,
    isPaid: false,
    vaccinationScheduleId,
    vaccineId,
    userId,
    monitorUserId,
  });

  return vaccinationHistory;
};

const updateVaccinationStatus = async (vaccinationHistoryId, { status }) => {
  const vaccinationHistoryExist = await vaccinationHistoryDao.findVaccinationHistory(
    vaccinationHistoryId,
  );

  if (!vaccinationHistoryExist) {
    throw new CustomError(errorCodes.VACCINATION_HISTORY_NOT_FOUND);
  }

  await vaccinationHistoryDao.updateVaccinationHistory(vaccinationHistoryId, {
    status,
  });

  const vaccinationHistory = await vaccinationHistoryDao.findVaccinationHistory(
    vaccinationHistoryId,
  );

  return vaccinationHistory;
};

const deleteVaccinationHistory = async (vaccinationHistoryId) => {
  const vaccinationHistoryExist = await vaccinationHistoryDao.findVaccinationHistory(
    vaccinationHistoryId,
  );

  if (!vaccinationHistoryExist) {
    throw new CustomError(errorCodes.VACCINATION_HISTORY_NOT_FOUND);
  }

  await vaccinationHistoryDao.deleteVaccinationHistory(vaccinationHistoryId);
};

const paymentVaccination = async (vaccinationHistoryId, { paymentMethod }) => {
  const vaccinationHistoryExist = await vaccinationHistoryDao.findVaccinationHistory(
    vaccinationHistoryId,
  );

  if (!vaccinationHistoryExist) {
    throw new CustomError(errorCodes.VACCINATION_HISTORY_NOT_FOUND);
  }

  const { isPaid, vaccineId } = vaccinationHistoryExist;
  if (isPaid) throw new CustomError(errorCodes.VACCINATION_PAID);

  const vaccine = await vaccineDao.findVaccine(vaccineId);
  if (!vaccine) throw new CustomError(errorCodes.VACCINE_NOT_FOUND);

  await vaccinationHistoryDao.updateVaccinationHistory(vaccinationHistoryId, {
    isPaid: true,
    paymentMethod,
  });

  await vaccineDao.updateVaccine(vaccineId, { injectedQuantity: vaccine.injectedQuantity + 1 });

  const vaccinationHistory = await vaccinationHistoryDao.findVaccinationHistory(
    vaccinationHistoryId,
  );

  return vaccinationHistory;
};

const statistic = async ({ statisticType }) => {
  const { items: vaccinationHistories } = await vaccinationHistoryDao.findVaccinationHistories({
    hasGetPagination: false,
    isPaid: true,
  });

  const statisticIncome = {};
  const statisticVaccine = {};
  const statisticIncomeByVaccine = {};

  const today = moment();

  for (const vaccinationHistory of vaccinationHistories) {
    const {
      date,
      totalCharge = 0,
      vaccineId,
      vaccine: { name: vaccineName },
    } = vaccinationHistory;

    if (!date) continue;
    const day = moment(date).format('YYYYMMDD');
    const month = moment(date).month() + 1;
    const year = moment(date).year();

    const vaccineStatKey = `${vaccineId}|${vaccineName}`;

    switch (statisticType) {
      case STATISTIC_TYPE.DAY: {
        statisticIncome[day] = (statisticIncome[day] || 0) + totalCharge;
        statisticVaccine[day] = (statisticVaccine[day] || 0) + 1;

        if (moment(date).isSame(today, 'day')) {
          statisticIncomeByVaccine[vaccineStatKey] =
            (statisticIncomeByVaccine[vaccineStatKey] || 0) + totalCharge;
        }

        break;
      }
      case STATISTIC_TYPE.MONTH: {
        const monthStatKey = `${month}/${year}`;
        statisticIncome[monthStatKey] = (statisticIncome[monthStatKey] || 0) + totalCharge;
        statisticVaccine[monthStatKey] = (statisticVaccine[monthStatKey] || 0) + 1;

        if (moment(date).isSame(today, 'month')) {
          statisticIncomeByVaccine[vaccineStatKey] =
            (statisticIncomeByVaccine[vaccineStatKey] || 0) + totalCharge;
        }

        break;
      }
      case STATISTIC_TYPE.YEAR: {
        statisticIncome[year] = (statisticIncome[year] || 0) + totalCharge;
        statisticVaccine[year] = (statisticVaccine[year] || 0) + 1;

        if (moment(date).isSame(today, 'year')) {
          statisticIncomeByVaccine[vaccineStatKey] =
            (statisticIncomeByVaccine[vaccineStatKey] || 0) + totalCharge;
        }

        break;
      }
    }
  }

  return {
    statisticIncome: Object.keys(statisticIncome).map((key) => ({
      key,
      value: statisticIncome[key],
    })),
    statisticVaccine: Object.keys(statisticVaccine).map((key) => ({
      key,
      value: statisticVaccine[key],
    })),
    statisticIncomeByVaccine: Object.keys(statisticIncomeByVaccine).map((key) => ({
      key,
      value: statisticIncomeByVaccine[key],
    })),
  };
};

module.exports = {
  getVaccinationHistories,
  getVaccinationHistoryById,
  createVaccinationHistory,
  updateVaccinationStatus,
  deleteVaccinationHistory,
  paymentVaccination,
  statistic,
};
