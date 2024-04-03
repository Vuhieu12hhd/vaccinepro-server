const router = require('express').Router();

const { auth } = require('../middlewares/auth');
const { asyncMiddleware, asyncResponse } = require('../middlewares/async');
const vaccinationScheduleController = require('../controllers/vaccinationSchedule');
const vaccinationScheduleValidate = require('../validations/vaccinationSchedule');

// me
router.get(
  '/vaccinationSchedules',
  asyncMiddleware(auth),
  vaccinationScheduleValidate.getVaccinationSchedules,
  asyncResponse(vaccinationScheduleController.getVaccinationSchedules),
);

router.get(
  '/vaccinationSchedules/:vaccinationScheduleId',
  asyncMiddleware(auth),
  vaccinationScheduleValidate.getVaccinationScheduleById,
  asyncResponse(vaccinationScheduleController.getVaccinationScheduleById),
);

router.post(
  '/vaccinationSchedules',
  asyncMiddleware(auth),
  vaccinationScheduleValidate.createVaccinationSchedule,
  asyncResponse(vaccinationScheduleController.createVaccinationSchedule),
);

router.put(
  '/vaccinationSchedules/:vaccinationScheduleId',
  asyncMiddleware(auth),
  vaccinationScheduleValidate.updateVaccinationSchedule,
  asyncResponse(vaccinationScheduleController.updateVaccinationSchedule),
);

// admin
router.get(
  '/admin/vaccinationSchedules',
  asyncMiddleware(auth),
  vaccinationScheduleValidate.getVaccinationSchedules,
  asyncResponse(vaccinationScheduleController.getVaccinationScheduleByAdmin),
);

router.get(
  '/admin/vaccinationSchedules/:vaccinationScheduleId',
  asyncMiddleware(auth),
  vaccinationScheduleValidate.getVaccinationScheduleById,
  asyncResponse(vaccinationScheduleController.getVaccinationScheduleByIdByAdmin),
);

router.put(
  '/admin/vaccinationSchedules/:vaccinationScheduleId/healthSurveyStatus',
  asyncMiddleware(auth),
  vaccinationScheduleValidate.updateHealthSurveyStatus,
  asyncResponse(vaccinationScheduleController.updateHealthSurveyStatusByAdmin),
);

router.delete(
  '/admin/vaccinationSchedules/:vaccinationScheduleId',
  asyncMiddleware(auth),
  vaccinationScheduleValidate.deleteVaccinationSchedule,
  asyncResponse(vaccinationScheduleController.deleteVaccinationScheduleByAdmin),
);

module.exports = router;
