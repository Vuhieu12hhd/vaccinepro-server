const healthSurveyTemplateDao = require('../daos/healthSurveyTemplate');

const getHealthSurveyTemplates = async (query) => {
  const healthSurveyTemplates = await healthSurveyTemplateDao.findHealthSurveyTemplates(query);
  return healthSurveyTemplates;
};

module.exports = {
  getHealthSurveyTemplates,
};
