const jwt = require('jsonwebtoken');

const CustomError = require('../errors/CustomError');
const errorCodes = require('../errors/code');
const { JWT_SECRET_KEY } = require('../configs');

const userDao = require('../daos/user');
const userService = require('./user');
const { USER_ROLE } = require('../constants');

const login = async ({ email, password }) => {
  const user = await userDao.findUser({ email, active: 1 }, true);
  if (!user) throw new CustomError(errorCodes.USER_NOT_FOUND);

  await userService.checkUserStatus({ user });
  await userService.checkPassword({ user, passwordCheck: password });

  const accessToken = await userService.generateAccessToken(user);
  delete user.password;
  return { user, accessToken };
};

const register = async (userData) => {
  const user = await userService.createUser({
    ...userData,
    role: USER_ROLE.CUSTOMER,
  });

  const accessToken = await userService.generateAccessToken(user);
  return { user, accessToken };
};

const verifyAccessToken = async (accessToken) => {
  const data = await jwt.verify(accessToken, JWT_SECRET_KEY);

  const { user: userInToken } = data;
  if (!userInToken || !userInToken.id) throw new CustomError(errorCodes.UNAUTHORIZED);

  const user = await userDao.findUser({
    id: userInToken.id,
    active: 1,
  });
  if (!user) throw new CustomError(errorCodes.USER_NOT_FOUND);

  return user;
};

module.exports = {
  login,
  register,
  verifyAccessToken,
};
