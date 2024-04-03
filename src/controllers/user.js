const userService = require('../services/user');

// me
const updateMe = async (req) => userService.updateUser(req.user.id, req.body);

const requestVerifyEmail = async (req) => userService.requestVerifyEmail(req.requestId, req.user);
const confirmVerifyEmail = async (req) => userService.confirmVerifyEmail(req.user, req.body);

const requestChangePassword = async (req) =>
  userService.requestChangePassword(req.requestId, req.user, req.body);
const confirmChangePassword = async (req) => userService.confirmChangePassword(req.user, req.body);

// admin
const getUsersByAdmin = async (req) => userService.getUsers(req.query);
const getUserByIdByAdmin = async (req) => userService.getUserById(req.params.userId);
const createUserByAdmin = async (req) =>
  userService.createUser({ ...req.body, isEmailVerified: true });
const updateUserByAdmin = async (req) => userService.updateUser(req.params.userId, req.body);
const deleteUserByAdmin = async (req) => userService.deleteUser(req.params.userId);

module.exports = {
  updateMe,

  requestVerifyEmail,
  confirmVerifyEmail,

  requestChangePassword,
  confirmChangePassword,

  getUsersByAdmin,
  getUserByIdByAdmin,
  createUserByAdmin,
  updateUserByAdmin,
  deleteUserByAdmin,
};
