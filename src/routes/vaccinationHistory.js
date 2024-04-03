const router = require('express').Router();

const { auth } = require('../middlewares/auth');
const { asyncMiddleware, asyncResponse } = require('../middlewares/async');
const vaccinationHistoryController = require('../controllers/vaccinationHistory');
const vaccinationHistoryValidate = require('../validations/vaccinationHistory');

// me
router.get(
  '/vaccinationHistories',
  asyncMiddleware(auth),
  vaccinationHistoryValidate.getVaccinationHistories,
  asyncResponse(vaccinationHistoryController.getVaccinationHistories),
);

router.get(
  '/vaccinationHistories/:vaccinationHistoryId',
  asyncMiddleware(auth),
  vaccinationHistoryValidate.getVaccinationHistoryById,
  asyncResponse(vaccinationHistoryController.getVaccinationHistoryById),
);

// admin
router.get(
  '/admin/statistic',
  asyncMiddleware(auth),
  vaccinationHistoryValidate.statistic,
  asyncResponse(vaccinationHistoryController.statistic),
);

router.get(
  '/admin/vaccinationHistories',
  asyncMiddleware(auth),
  vaccinationHistoryValidate.getVaccinationHistories,
  asyncResponse(vaccinationHistoryController.getVaccinationHistoriesByAdmin),
);

router.get(
  '/admin/vaccinationHistories/:vaccinationHistoryId',
  asyncMiddleware(auth),
  vaccinationHistoryValidate.getVaccinationHistoryById,
  asyncResponse(vaccinationHistoryController.getVaccinationHistoryByIdByAdmin),
);

router.post(
  '/admin/vaccinationHistories',
  asyncMiddleware(auth),
  vaccinationHistoryValidate.createVaccinationHistory,
  asyncResponse(vaccinationHistoryController.createVaccinationHistoryByAdmin),
);

router.put(
  '/admin/vaccinationHistories/:vaccinationHistoryId/status',
  asyncMiddleware(auth),
  vaccinationHistoryValidate.updateVaccinationStatus,
  asyncResponse(vaccinationHistoryController.updateVaccinationStatusByAdmin),
);

router.post(
  '/admin/vaccinationHistories/:vaccinationHistoryId/payment',
  asyncMiddleware(auth),
  vaccinationHistoryValidate.paymentVaccination,
  asyncResponse(vaccinationHistoryController.paymentVaccinationByAdmin),
);

router.delete(
  '/admin/vaccinationHistories/:vaccinationHistoryId',
  asyncMiddleware(auth),
  vaccinationHistoryValidate.deleteVaccinationHistory,
  asyncResponse(vaccinationHistoryController.deleteVaccinationHistoryByAdmin),
);

module.exports = router;
