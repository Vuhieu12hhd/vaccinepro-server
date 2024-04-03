const vaccinationHistoryService = require('../services/vaccinationHistory');

// me
const getVaccinationHistories = async (req) =>
  vaccinationHistoryService.getVaccinationHistories({
    ...req.query,
    userId: req.user.id,
  });

const getVaccinationHistoryById = async (req) =>
  vaccinationHistoryService.getVaccinationHistoryById({
    id: req.params.vaccinationHistoryId,
    userId: req.user.id,
  });

// admin
const getVaccinationHistoriesByAdmin = async (req) =>
  vaccinationHistoryService.getVaccinationHistories(req.query);

const getVaccinationHistoryByIdByAdmin = async (req) =>
  vaccinationHistoryService.getVaccinationHistoryById(req.params.vaccinationHistoryId);

const createVaccinationHistoryByAdmin = async (req) =>
  vaccinationHistoryService.createVaccinationHistory(req.body);

const updateVaccinationStatusByAdmin = async (req) =>
  vaccinationHistoryService.updateVaccinationStatus(req.params.vaccinationHistoryId, req.body);

const paymentVaccinationByAdmin = async (req) =>
  vaccinationHistoryService.paymentVaccination(req.params.vaccinationHistoryId, req.body);

const deleteVaccinationHistoryByAdmin = async (req) =>
  vaccinationHistoryService.deleteVaccinationHistory(req.params.vaccinationHistoryId);

const statistic = async (req) => vaccinationHistoryService.statistic(req.query);

module.exports = {
  getVaccinationHistories,
  getVaccinationHistoryById,

  getVaccinationHistoriesByAdmin,
  getVaccinationHistoryByIdByAdmin,
  createVaccinationHistoryByAdmin,
  updateVaccinationStatusByAdmin,
  paymentVaccinationByAdmin,
  deleteVaccinationHistoryByAdmin,
  statistic,
};
