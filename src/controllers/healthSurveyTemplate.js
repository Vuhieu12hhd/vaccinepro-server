const healthSurveyTemplateService = require('../services/healthSurveyTemplate');

const getHealthSurveyTemplates = async (req) =>
  healthSurveyTemplateService.getHealthSurveyTemplates(req.query);

module.exports = {
  getHealthSurveyTemplates,
};
