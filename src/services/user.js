const jwt = require('jsonwebtoken');

const moment = require('moment/moment');
const CustomError = require('../errors/CustomError');
const errorCodes = require('../errors/code');

const userDao = require('../daos/user');
const verificationCodeService = require('./verificationCode');
const notificationService = require('./notification');

const {
  VERIFICATION_CODE_TARGET_TYPE,
  VERIFICATION_CODE_SEND_TYPE,
  NOTIFICATION_TEMPLATE,
  USER_LOCK_REASON,
} = require('../constants');
const { fillDataToText } = require('../utils/string');
const { compareBcrypt, generateSalt, hashBcrypt } = require('../utils/encrypt');
const { WRONG_PASS_LIMIT, WRONG_PASS_LOCK_TIME, JWT_SECRET_KEY } = require('../configs');

const generateAccessToken = async (user) => {
  const accessToken = await jwt.sign(
    {
      user: {
        id: user.id,
        email: user.email,
        phoneNumber: user.phoneNumber,
      },
    },
    JWT_SECRET_KEY,
    {},
  );
  return accessToken;
};

const getUsers = async (query) => {
  const users = await userDao.findUsers(query);
  return users;
};

const getUserById = async (userId) => {
  const user = await userDao.findUser(userId);

  if (!user) {
    throw new CustomError(errorCodes.USER_NOT_FOUND);
  }

  return user;
};

const createUser = async (userData) => {
  const { email, phoneNumber, password } = userData;

  const userExist = await Promise.all([
    await userDao.findUser({ email }),
    await userDao.findUser({ phoneNumber }),
  ]);

  if (userExist[0]) throw new CustomError(errorCodes.EMAIL_EXIST);
  if (userExist[1]) throw new CustomError(errorCodes.PHONE_NUMBER_EXIST);

  const salt = generateSalt(10);
  const passwordHashed = await hashBcrypt(password, salt);

  const user = await userDao.createUser({
    ...userData,
    email,
    password: passwordHashed,
    phoneNumber,
  });

  return user;
};

const updateUser = async (userId, userData) => {
  const userExist = await userDao.findUser(userId);

  if (!userExist) {
    throw new CustomError(errorCodes.USER_NOT_FOUND);
  }

  await userDao.updateUser(userId, userData);
  const userUpdated = await userDao.findUser(userId);

  return userUpdated;
};

const requestVerifyEmail = async (requestId, { id: userId, email, isEmailVerified }) => {
  if (isEmailVerified) throw new CustomError(errorCodes.EMAIL_IS_VERIFIED);

  const verificationCode = await verificationCodeService.createVerificationCode({
    userId,
    targetType: VERIFICATION_CODE_TARGET_TYPE.VERIFY_EMAIL,
    sendType: VERIFICATION_CODE_SEND_TYPE.EMAIL,
  });

  const { code, transactionId, sendType, expirationAt, expirationTime } = verificationCode;

  const dataToFill = { code, expirationTime };
  notificationService.sendMail(
    {
      to: email,
      subject: fillDataToText(NOTIFICATION_TEMPLATE.VERIFY_EMAIL.title, dataToFill),
      text: fillDataToText(NOTIFICATION_TEMPLATE.VERIFY_EMAIL.content, dataToFill),
    },
    requestId,
  );

  return { transactionId, sendType, expirationAt, expirationTime };
};

const confirmVerifyEmail = async ({ id: userId }, { code, transactionId }) => {
  await verificationCodeService.submitVerificationCode({
    userId,
    transactionId,
    code,
    targetType: VERIFICATION_CODE_TARGET_TYPE.VERIFY_EMAIL,
  });

  await userDao.updateUser(userId, { isEmailVerified: true });
  const user = await userDao.findUser(userId);

  const accessToken = await generateAccessToken(user);
  return { user, accessToken };
};

const requestChangePassword = async (requestId, { id: userId, email }, { currentPassword }) => {
  const user = await userDao.findUser(userId, true);
  await checkPassword({ user, passwordCheck: currentPassword });

  const verificationCode = await verificationCodeService.createVerificationCode({
    userId,
    targetType: VERIFICATION_CODE_TARGET_TYPE.CHANGE_PASSWORD,
    sendType: VERIFICATION_CODE_SEND_TYPE.EMAIL,
  });

  const { code, transactionId, sendType, expirationAt, expirationTime } = verificationCode;

  const dataToFill = { code, expirationTime };
  notificationService.sendMail(
    {
      to: email,
      subject: fillDataToText(NOTIFICATION_TEMPLATE.CHANGE_PASSWORD.title, dataToFill),
      text: fillDataToText(NOTIFICATION_TEMPLATE.CHANGE_PASSWORD.content, dataToFill),
    },
    requestId,
  );

  return { transactionId, sendType, expirationAt, expirationTime };
};

const confirmChangePassword = async ({ id: userId }, { newPassword, code, transactionId }) => {
  await verificationCodeService.submitVerificationCode({
    userId,
    transactionId,
    code,
    targetType: VERIFICATION_CODE_TARGET_TYPE.CHANGE_PASSWORD,
  });

  const salt = generateSalt(10);
  const newPasswordHashed = await hashBcrypt(newPassword, salt);

  await userDao.updateUser(userId, { password: newPasswordHashed });
  const user = await userDao.findUser(userId);

  const accessToken = await generateAccessToken(user);
  return { user, accessToken };
};

const deleteUser = async (userId) => {
  const userExist = await userDao.findUser(userId);

  if (!userExist) {
    throw new CustomError(errorCodes.USER_NOT_FOUND);
  }

  await userDao.deleteUser(userId);
};

const checkUserStatus = async ({ user }) => {
  if (!user.active) throw new CustomError(errorCodes.USER_INACTIVE);
  if (!user.isLock) return true;
  if (user.lockTo && user.lockTo <= new Date()) {
    await userDao.updateUser(user.id, {
      isLock: false,
      lockTo: null,
      lockReason: null,
      wrongPasswordCount: 0,
    });

    return true;
  }

  throw new CustomError(errorCodes.USER_LOCKED, {
    lockTo: user.lockTo,
    lockReason: user.lockReason,
  });
};

const checkPassword = async ({ user, passwordCheck }) => {
  const isCorrectPassword = await compareBcrypt(passwordCheck, user.password);
  if (isCorrectPassword) {
    if (user.wrongPasswordCount !== 0) {
      await userDao.updateUser(user.id, {
        wrongPasswordCount: 0,
      });
    }

    return true;
  }

  const currentWrongPasswordCount = user.wrongPasswordCount + 1;
  if (currentWrongPasswordCount >= WRONG_PASS_LIMIT) {
    const lockTo = new Date(new Date().getTime() + WRONG_PASS_LOCK_TIME * 1000);
    const lockReason = USER_LOCK_REASON.WRONG_PASSWORD;

    await userDao.updateUser(user.id, {
      isLock: true,
      lockTo,
      lockReason,
      wrongPasswordCount: 0,
    });

    throw new CustomError(errorCodes.USER_LOCKED, {
      lockTo,
      lockReason,
    });
  }

  await userDao.updateUser(user.id, {
    wrongPasswordCount: currentWrongPasswordCount,
  });

  throw new CustomError(errorCodes.WRONG_PASSWORD, {
    wrongPasswordCount: currentWrongPasswordCount,
  });
};

module.exports = {
  generateAccessToken,
  getUsers,
  getUserById,
  createUser,
  updateUser,
  requestVerifyEmail,
  confirmVerifyEmail,
  requestChangePassword,
  confirmChangePassword,
  deleteUser,
  checkPassword,
  checkUserStatus,
};
