const router = require('express').Router();

const { auth } = require('../middlewares/auth');
const { asyncMiddleware, asyncResponse } = require('../middlewares/async');
const vaccineController = require('../controllers/vaccine');
const vaccineValidate = require('../validations/vaccine');

router.get('/vaccines', vaccineValidate.getVaccines, asyncResponse(vaccineController.getVaccines));
router.get(
  '/vaccines/:vaccineId',
  vaccineValidate.getVaccineById,
  asyncResponse(vaccineController.getVaccineById),
);

router.post(
  '/admin/vaccines',
  asyncMiddleware(auth),
  vaccineValidate.createVaccine,
  asyncResponse(vaccineController.createVaccineByAdmin),
);
router.put(
  '/admin/vaccines/:vaccineId',
  asyncMiddleware(auth),
  vaccineValidate.updateVaccine,
  asyncResponse(vaccineController.updateVaccineByAdmin),
);
router.delete(
  '/admin/vaccines/:vaccineId',
  asyncMiddleware(auth),
  vaccineValidate.deleteVaccine,
  asyncResponse(vaccineController.deleteVaccineByAdmin),
);

module.exports = router;
