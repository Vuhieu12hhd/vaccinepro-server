const { Joi } = require('express-validation');
const { customValidate, joiPagination } = require('./validationUtil');
const { VACCINATION_STATUS, USER_GENDER, PAYMENT_METHOD, STATISTIC_TYPE } = require('../constants');

const getVaccinationHistories = {
  query: Joi.object({
    ...joiPagination,
    searchKey: Joi.string().trim(),
    startDate: Joi.date(),
    endDate: Joi.date().min(Joi.ref('startDate')),
    userId: Joi.number(),
    vaccineId: Joi.number(),
    status: Joi.string().trim(),
  }),
};

const getVaccinationHistoryById = {
  params: Joi.object({ vaccinationHistoryId: Joi.number().required() }),
};

const createVaccinationHistory = {
  body: Joi.object({
    userId: Joi.number(),
    vaccinationScheduleId: Joi.number(),
    vaccineId: Joi.number().required(),
    monitorUserId: Joi.number().required(),
    address: Joi.string().trim(),
    note: Joi.string().trim(),
    injectorInfo: Joi.object({
      name: Joi.string().trim(),
      email: Joi.string().email().trim().lowercase(),
      dob: Joi.string(),
      gender: Joi.string()
        .trim()
        .valid(...Object.values(USER_GENDER)),
    }),
  }),
};

const updateVaccinationStatus = {
  params: Joi.object({
    vaccinationHistoryId: Joi.number().required(),
  }),
  body: Joi.object({
    status: Joi.string()
      .trim()
      .valid(...Object.values(VACCINATION_STATUS))
      .required(),
  }),
};

const paymentVaccination = {
  params: Joi.object({
    vaccinationHistoryId: Joi.number().required(),
  }),
  body: Joi.object({
    paymentMethod: Joi.string()
      .trim()
      .valid(...Object.values(PAYMENT_METHOD))
      .required(),
  }),
};

const deleteVaccinationHistory = {
  params: Joi.object({ vaccinationHistoryId: Joi.number().required() }),
};

const statistic = {
  query: Joi.object({
    statisticType: Joi.string()
      .trim()
      .valid(...Object.values(STATISTIC_TYPE))
      .required(),
  }),
};

module.exports = {
  getVaccinationHistories: customValidate(getVaccinationHistories, {
    keyByField: true,
  }),
  getVaccinationHistoryById: customValidate(getVaccinationHistoryById, {
    keyByField: true,
  }),
  createVaccinationHistory: customValidate(createVaccinationHistory, {
    keyByField: true,
  }),
  updateVaccinationStatus: customValidate(updateVaccinationStatus, {
    keyByField: true,
  }),
  paymentVaccination: customValidate(paymentVaccination, {
    keyByField: true,
  }),
  deleteVaccinationHistory: customValidate(deleteVaccinationHistory, {
    keyByField: true,
  }),
  statistic: customValidate(statistic, {
    keyByField: true,
  }),
};
