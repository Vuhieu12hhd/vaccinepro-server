const { Joi } = require('express-validation');
const { customValidate, joiPagination } = require('./validationUtil');

const getVaccineProviders = {
  query: Joi.object({
    searchKey: Joi.string().trim(),
    ...joiPagination,
  }),
};

const getVaccineProviderById = {
  params: Joi.object({ vaccineProviderId: Joi.number().required() }),
};

const createVaccineProvider = {
  body: Joi.object({
    name: Joi.string().trim().required(),
  }),
};

const updateVaccineProvider = {
  params: Joi.object({ vaccineProviderId: Joi.number().required() }),
  body: Joi.object({
    name: Joi.string().trim(),
  }),
};

const deleteVaccineProvider = {
  params: Joi.object({ vaccineProviderId: Joi.number().required() }),
};

module.exports = {
  getVaccineProviders: customValidate(getVaccineProviders, {
    keyByField: true,
  }),
  getVaccineProviderById: customValidate(getVaccineProviderById, {
    keyByField: true,
  }),
  createVaccineProvider: customValidate(createVaccineProvider, {
    keyByField: true,
  }),
  updateVaccineProvider: customValidate(updateVaccineProvider, {
    keyByField: true,
  }),
  deleteVaccineProvider: customValidate(deleteVaccineProvider, {
    keyByField: true,
  }),
};
