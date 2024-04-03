const { Joi } = require('express-validation');
const { customValidate, passwordValidate, dobValidate } = require('./validationUtil');
const { USER_GENDER } = require('../constants');

const login = {
  body: Joi.object({
    email: Joi.string().email().trim().lowercase().required(),
    password: passwordValidate,
  }),
};

const register = {
  body: Joi.object({
    email: Joi.string().email().trim().lowercase().required(),
    password: passwordValidate,
    name: Joi.string().trim().required(),
    phoneNumber: Joi.string().trim().required(),
    address: Joi.string().trim(),
    gender: Joi.string()
      .trim()
      .valid(...Object.values(USER_GENDER)),
    dob: dobValidate,
  }),
};

module.exports = {
  loginValidate: customValidate(login, { keyByField: true }),
  registerValidate: customValidate(register, { keyByField: true }),
};
