const { Joi } = require('express-validation');
const { customValidate, joiPagination } = require('./validationUtil');

const getVaccines = {
  query: Joi.object({
    searchKey: Joi.string().trim(),
    vaccineProviderId: Joi.number(),
    lotNumber: Joi.string().trim(),
    fromExpiredAt: Joi.date(),
    toExpiredAt: Joi.date().min(Joi.ref('fromExpiredAt')),
    ...joiPagination,
  }),
};

const getVaccineById = {
  params: Joi.object({ vaccineId: Joi.number().required() }),
};

const createVaccine = {
  body: Joi.object({
    name: Joi.string().trim().required(),
    description: Joi.string().trim(),
    vaccineProviderId: Joi.number().required(),
    lotNumber: Joi.string().trim().required(),
    price: Joi.number().min(1).required(),
    quantity: Joi.number().integer().min(1).required(),
    errorQuantity: Joi.number().integer().min(0),
    standard: Joi.string().trim(),
    expiredAt: Joi.date().greater(new Date()),
  }),
};

const updateVaccine = {
  params: Joi.object({ vaccineId: Joi.number().required() }),
  body: Joi.object({
    description: Joi.string().trim(),
    price: Joi.number().min(1),
    quantity: Joi.number().integer().min(1),
    injectedQuantity: Joi.number().integer().min(0),
    errorQuantity: Joi.number().integer().min(0),
    expiredAt: Joi.date().greater(new Date()),
  }),
};

const deleteVaccine = {
  params: Joi.object({ vaccineId: Joi.number().required() }),
};

module.exports = {
  getVaccines: customValidate(getVaccines, { keyByField: true }),
  getVaccineById: customValidate(getVaccineById, { keyByField: true }),
  createVaccine: customValidate(createVaccine, { keyByField: true }),
  updateVaccine: customValidate(updateVaccine, { keyByField: true }),
  deleteVaccine: customValidate(deleteVaccine, { keyByField: true }),
};
