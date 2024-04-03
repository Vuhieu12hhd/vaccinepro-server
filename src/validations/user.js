const { Joi } = require('express-validation');

const {
  customValidate,
  joiPagination,
  passwordValidate,
  dobValidate,
} = require('./validationUtil');
const { USER_GENDER, USER_ROLE } = require('../constants');

const updateMe = {
  body: Joi.object({
    name: Joi.string().trim(),
    address: Joi.string().trim(),
    gender: Joi.string()
      .trim()
      .valid(...Object.values(USER_GENDER)),
  }),
};

const confirmVerifyEmail = {
  body: Joi.object({
    transactionId: Joi.string().trim().required(),
    code: Joi.string().trim().required(),
  }),
};

const requestChangePassword = {
  body: Joi.object({
    currentPassword: passwordValidate,
  }),
};

const confirmChangePassword = {
  body: Joi.object({
    transactionId: Joi.string().trim().required(),
    code: Joi.string().trim().required(),
    newPassword: passwordValidate,
  }),
};

const getUsers = {
  query: Joi.object({
    searchKey: Joi.string().trim(),
    active: Joi.boolean(),
    isEmailVerified: Joi.boolean(),
    role: Joi.array().items(
      Joi.string()
        .trim()
        .valid(...Object.values(USER_ROLE)),
    ),
    ...joiPagination,
  }),
};

const getUserById = {
  params: Joi.object({ userId: Joi.number().required() }),
};

const createUser = {
  body: Joi.object({
    email: Joi.string().email().trim().lowercase().required(),
    password: passwordValidate,
    name: Joi.string().trim().required(),
    phoneNumber: Joi.string().trim().required(),
    address: Joi.string().trim(),
    gender: Joi.string()
      .trim()
      .valid(...Object.values(USER_GENDER)),
    role: Joi.string()
      .trim()
      .valid(...Object.values(USER_ROLE))
      .required(),
    dob: dobValidate,
  }),
};

const updateUser = {
  params: Joi.object({ userId: Joi.number().required() }),
  body: Joi.object({
    name: Joi.string().trim(),
    address: Joi.string().trim(),
    gender: Joi.string()
      .trim()
      .valid(...Object.values(USER_GENDER)),
    dob: dobValidate,
    role: Joi.string()
      .trim()
      .valid(...Object.values(USER_ROLE)),
    active: Joi.boolean(),
    isEmailVerified: Joi.boolean(),
  }),
};

const deleteUser = {
  params: Joi.object({ userId: Joi.number().required() }),
};

module.exports = {
  updateMe: customValidate(updateMe, { keyByField: true }),
  confirmVerifyEmail: customValidate(confirmVerifyEmail, { keyByField: true }),
  requestChangePassword: customValidate(requestChangePassword, {
    keyByField: true,
  }),
  confirmChangePassword: customValidate(confirmChangePassword, {
    keyByField: true,
  }),

  getUsers: customValidate(getUsers, { keyByField: true }),
  getUserById: customValidate(getUserById, { keyByField: true }),
  createUser: customValidate(createUser, { keyByField: true }),
  updateUser: customValidate(updateUser, { keyByField: true }),
  deleteUser: customValidate(deleteUser, { keyByField: true }),
};
