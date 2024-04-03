const router = require('express').Router();

const { asyncResponse } = require('../middlewares/async');
const healthSurveyTemplateController = require('../controllers/healthSurveyTemplate');
const healthSurveyTemplateValidate = require('../validations/healthSurveyTemplate');

router.get(
  '/healthSurveyTemplates',
  healthSurveyTemplateValidate.getHealthSurveyTemplates,
  asyncResponse(healthSurveyTemplateController.getHealthSurveyTemplates),
);

module.exports = router;
