const HealthSurveyTemplate = require('../models/healthSurveyTemplate');
const { findAll } = require('./utils/util');

const findHealthSurveyTemplates = async ({ limit, pageNum }, attributes) => {
  const result = await findAll({
    model: HealthSurveyTemplate,
    limit,
    pageNum,
    attributes,
  });

  return result;
};

module.exports = {
  findHealthSurveyTemplates,
};
