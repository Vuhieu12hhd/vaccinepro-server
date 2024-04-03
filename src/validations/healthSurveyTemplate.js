const { Joi } = require('express-validation');
const { customValidate, joiPagination } = require('./validationUtil');

const getHealthSurveyTemplates = {
  query: Joi.object({
    ...joiPagination,
  }),
};

module.exports = {
  getHealthSurveyTemplates: customValidate(getHealthSurveyTemplates, {
    keyByField: true,
  }),
};
