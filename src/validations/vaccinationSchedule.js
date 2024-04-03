const { Joi } = require('express-validation');
const { customValidate, joiPagination } = require('./validationUtil');
const { HEALTH_SURVEY_STATUS, USER_GENDER } = require('../constants');

const getVaccinationSchedules = {
  query: Joi.object({
    ...joiPagination,
  }),
};

const getVaccinationScheduleById = {
  params: Joi.object({ vaccinationScheduleId: Joi.number().required() }),
};

const createVaccinationSchedule = {
  body: Joi.object({
    date: Joi.date().required().min(new Date()),
    vaccineId: Joi.number().required(),
    address: Joi.string().trim(),
    injectorInfo: Joi.object({
      name: Joi.string().trim(),
      email: Joi.string().email().trim().lowercase(),
      dob: Joi.string(),
      gender: Joi.string()
        .trim()
        .valid(...Object.values(USER_GENDER)),
    }),
    healthSurveyAnswers: Joi.array()
      .items(
        Joi.object({
          healthSurveyTemplateId: Joi.number().required(),
          choice: Joi.number().required(),
        }),
      )
      .required(),
  }),
};

const updateHealthSurveyStatus = {
  params: Joi.object({
    vaccinationScheduleId: Joi.number().required(),
  }),
  body: Joi.object({
    status: Joi.string()
      .trim()
      .valid(HEALTH_SURVEY_STATUS.FAILED, HEALTH_SURVEY_STATUS.SUCCESS)
      .required(),
  }),
};

const updateVaccinationSchedule = {
  params: Joi.object({
    vaccinationScheduleId: Joi.number().required(),
  }),
  body: Joi.object({
    date: Joi.date().min(new Date()),
    vaccineId: Joi.number(),
    address: Joi.string().trim(),
    isCanceled: Joi.boolean(),
    injectorInfo: Joi.object({
      name: Joi.string().trim(),
      email: Joi.string().email().trim().lowercase(),
      dob: Joi.string(),
      gender: Joi.string()
        .trim()
        .valid(...Object.values(USER_GENDER)),
    }),
    healthSurveyAnswers: Joi.array().items(
      Joi.object({
        healthSurveyTemplateId: Joi.number().required(),
        choice: Joi.number().required(),
      }),
    ),
  }),
};

const deleteVaccinationSchedule = {
  params: Joi.object({ vaccinationScheduleId: Joi.number().required() }),
};

module.exports = {
  getVaccinationSchedules: customValidate(getVaccinationSchedules, {
    keyByField: true,
  }),
  getVaccinationScheduleById: customValidate(getVaccinationScheduleById, {
    keyByField: true,
  }),
  createVaccinationSchedule: customValidate(createVaccinationSchedule, {
    keyByField: true,
  }),
  updateVaccinationSchedule: customValidate(updateVaccinationSchedule, {
    keyByField: true,
  }),
  updateHealthSurveyStatus: customValidate(updateHealthSurveyStatus, {
    keyByField: true,
  }),
  deleteVaccinationSchedule: customValidate(deleteVaccinationSchedule, {
    keyByField: true,
  }),
};
