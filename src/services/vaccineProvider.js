const CustomError = require('../errors/CustomError');
const errorCodes = require('../errors/code');

const vaccineProviderDao = require('../daos/vaccineProvider');

const getVaccineProviders = async (query) => {
  const vaccineProviders = await vaccineProviderDao.findVaccineProviders(query);
  return vaccineProviders;
};

const getVaccineProviderById = async (vaccineProviderId) => {
  const vaccineProvider = await vaccineProviderDao.findVaccineProvider(vaccineProviderId);

  if (!vaccineProvider) {
    throw new CustomError(errorCodes.VACCINE_PROVIDER_NOT_FOUND);
  }

  return vaccineProvider;
};

const createVaccineProvider = async (vaccineProviderData) => {
  const vaccineProviderNameExist = await vaccineProviderDao.findVaccineProvider({
    name: vaccineProviderData.name,
  });

  if (vaccineProviderNameExist) {
    throw new CustomError(errorCodes.VACCINE_PROVIDER_NAME_EXIST);
  }

  const vaccineProvider = await vaccineProviderDao.createVaccineProvider(vaccineProviderData);

  return vaccineProvider;
};

const updateVaccineProvider = async (vaccineProviderId, vaccineProviderData) => {
  const vaccineProviderExist = await vaccineProviderDao.findVaccineProvider(vaccineProviderId);

  if (!vaccineProviderExist) {
    throw new CustomError(errorCodes.VACCINE_PROVIDER_NOT_FOUND);
  }

  const vaccineProviderNameExist = await vaccineProviderDao.findVaccineProvider({
    name: vaccineProviderData.name,
  });

  if (vaccineProviderNameExist && vaccineProviderNameExist.id !== vaccineProviderId) {
    throw new CustomError(errorCodes.VACCINE_PROVIDER_NAME_EXIST);
  }

  await vaccineProviderDao.updateVaccineProvider(vaccineProviderId, vaccineProviderData);

  const vaccineProvider = await vaccineProviderDao.findVaccineProvider(vaccineProviderId);

  return vaccineProvider;
};

const deleteVaccineProvider = async (vaccineProviderId) => {
  const vaccineProviderExist = await vaccineProviderDao.findVaccineProvider(vaccineProviderId);

  if (!vaccineProviderExist) {
    throw new CustomError(errorCodes.VACCINE_PROVIDER_NOT_FOUND);
  }

  await vaccineProviderDao.deleteVaccineProvider(vaccineProviderId);
};

module.exports = {
  getVaccineProviders,
  getVaccineProviderById,
  createVaccineProvider,
  updateVaccineProvider,
  deleteVaccineProvider,
};
