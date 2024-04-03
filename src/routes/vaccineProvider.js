const router = require('express').Router();

const { auth } = require('../middlewares/auth');
const { asyncMiddleware, asyncResponse } = require('../middlewares/async');
const vaccineProviderController = require('../controllers/vaccineProvider');
const vaccineProviderValidate = require('../validations/vaccineProvider');

router.get(
  '/vaccineProviders',
  vaccineProviderValidate.getVaccineProviders,
  asyncResponse(vaccineProviderController.getVaccineProviders),
);
router.get(
  '/vaccineProviders/:vaccineProviderId',
  vaccineProviderValidate.getVaccineProviderById,
  asyncResponse(vaccineProviderController.getVaccineProviderById),
);

router.post(
  '/admin/vaccineProviders',
  asyncMiddleware(auth),
  vaccineProviderValidate.createVaccineProvider,
  asyncResponse(vaccineProviderController.createVaccineProviderByAdmin),
);
router.put(
  '/admin/vaccineProviders/:vaccineProviderId',
  asyncMiddleware(auth),
  vaccineProviderValidate.updateVaccineProvider,
  asyncResponse(vaccineProviderController.updateVaccineProviderByAdmin),
);
router.delete(
  '/admin/vaccineProviders/:vaccineProviderId',
  asyncMiddleware(auth),
  vaccineProviderValidate.deleteVaccineProvider,
  asyncResponse(vaccineProviderController.deleteVaccineProviderByAdmin),
);

module.exports = router;
