const vaccineService = require('../services/vaccine');

// me
const getVaccines = async (req) => vaccineService.getVaccines(req.query);
const getVaccineById = async (req) => vaccineService.getVaccineById(req.params.vaccineId);

// admin
const createVaccineByAdmin = async (req) => vaccineService.createVaccine(req.body);
const updateVaccineByAdmin = async (req) =>
  vaccineService.updateVaccine(req.params.vaccineId, req.body);
const deleteVaccineByAdmin = async (req) => vaccineService.deleteVaccine(req.params.vaccineId);

module.exports = {
  getVaccines,
  getVaccineById,
  createVaccineByAdmin,
  updateVaccineByAdmin,
  deleteVaccineByAdmin,
};
