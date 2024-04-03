const vaccinationScheduleService = require('../services/vaccinationSchedule');

// me
const getVaccinationSchedules = async (req) =>
  vaccinationScheduleService.getVaccinationSchedules({ ...req.query, userId: req.user.id });

const getVaccinationScheduleById = async (req) =>
  vaccinationScheduleService.getVaccinationScheduleById({
    id: req.params.vaccinationScheduleId,
    userId: req.user.id,
  });

const createVaccinationSchedule = async (req) =>
  vaccinationScheduleService.createVaccinationSchedule(req.user.id, req.body);

const updateVaccinationSchedule = async (req) =>
  vaccinationScheduleService.updateVaccinationSchedule(
    req.params.vaccinationScheduleId,
    req.body,
    req.user.id,
  );

// admin
const getVaccinationScheduleByAdmin = async (req) =>
  vaccinationScheduleService.getVaccinationSchedules(req.query);

const getVaccinationScheduleByIdByAdmin = async (req) =>
  vaccinationScheduleService.getVaccinationScheduleById(req.params.vaccinationScheduleId);

const updateHealthSurveyStatusByAdmin = async (req) =>
  vaccinationScheduleService.updateHealthSurveyStatus(req.params.vaccinationScheduleId, req.body);

const deleteVaccinationScheduleByAdmin = async (req) =>
  vaccinationScheduleService.deleteVaccinationSchedule(req.params.vaccinationScheduleId);

module.exports = {
  getVaccinationSchedules,
  getVaccinationScheduleById,
  createVaccinationSchedule,
  updateVaccinationSchedule,

  getVaccinationScheduleByAdmin,
  getVaccinationScheduleByIdByAdmin,
  updateHealthSurveyStatusByAdmin,
  deleteVaccinationScheduleByAdmin,
};
