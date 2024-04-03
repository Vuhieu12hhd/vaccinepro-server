const vaccineProviderService = require('../services/vaccineProvider');

// me
const getVaccineProviders = async (req) => vaccineProviderService.getVaccineProviders(req.query);
const getVaccineProviderById = async (req) =>
  vaccineProviderService.getVaccineProviderById(req.params.vaccineProviderId);

// admin
const createVaccineProviderByAdmin = async (req) =>
  vaccineProviderService.createVaccineProvider(req.body);
const updateVaccineProviderByAdmin = async (req) =>
  vaccineProviderService.updateVaccineProvider(req.params.vaccineProviderId, req.body);
const deleteVaccineProviderByAdmin = async (req) =>
  vaccineProviderService.deleteVaccineProvider(req.params.vaccineProviderId);

module.exports = {
  getVaccineProviders,
  getVaccineProviderById,

  createVaccineProviderByAdmin,
  updateVaccineProviderByAdmin,
  deleteVaccineProviderByAdmin,
};
