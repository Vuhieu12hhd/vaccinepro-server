const CustomError = require('../errors/CustomError');
const errorCodes = require('../errors/code');

const vaccineDao = require('../daos/vaccine');
const vaccineProviderDao = require('../daos/vaccineProvider');

const getVaccines = async (query) => {
  const vaccines = await vaccineDao.findVaccines(query);
  return vaccines;
};

const getVaccineById = async (vaccineId) => {
  const vaccine = await vaccineDao.findVaccine(vaccineId);

  if (!vaccine) {
    throw new CustomError(errorCodes.VACCINE_NOT_FOUND);
  }

  return vaccine;
};

const createVaccine = async (vaccineData) => {
  const { name, lotNumber, vaccineProviderId } = vaccineData;
  const vaccineExist = await vaccineDao.findVaccine({ name, lotNumber });

  if (vaccineExist) {
    throw new CustomError(errorCodes.VACCINE_EXIST);
  }

  const vaccineProviderExist = await vaccineProviderDao.findVaccineProvider(vaccineProviderId);
  if (!vaccineProviderExist) {
    throw new CustomError(errorCodes.VACCINE_PROVIDER_NOT_FOUND);
  }

  const vaccine = await vaccineDao.createVaccine(vaccineData);
  return vaccine;
};

const updateVaccine = async (vaccineId, vaccineData) => {
  const vaccineExist = await vaccineDao.findVaccine(vaccineId);

  if (!vaccineExist) {
    throw new CustomError(errorCodes.VACCINE_NOT_FOUND);
  }

  await vaccineDao.updateVaccine(vaccineId, vaccineData);
  const vaccine = await vaccineDao.findVaccine(vaccineId);

  return vaccine;
};

const deleteVaccine = async (vaccineId) => {
  const vaccineExist = await vaccineDao.findVaccine(vaccineId);

  if (!vaccineExist) {
    throw new CustomError(errorCodes.VACCINE_NOT_FOUND);
  }

  await vaccineDao.deleteVaccine(vaccineId);
};

module.exports = {
  getVaccines,
  getVaccineById,
  createVaccine,
  updateVaccine,
  deleteVaccine,
};
