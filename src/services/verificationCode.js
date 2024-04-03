const { v4: uuidv4 } = require('uuid');

const CustomError = require('../errors/CustomError');
const errorCodes = require('../errors/code');

const verificationCodeDao = require('../daos/verificationCode');
const { generateOTP } = require('../utils/string');

const { VERIFICATION_CODE_STATUS } = require('../constants');
const { VERIFICATION_CODE_EXPIRATION_TIME } = require('../configs');

const createVerificationCode = async ({
  userId,
  code,
  targetType,
  sendType,
  expirationTime = VERIFICATION_CODE_EXPIRATION_TIME,
}) => {
  const transactionId = uuidv4();

  const verificationCode = await verificationCodeDao.createVerificationCode({
    userId,
    transactionId,
    code: code || generateOTP(),
    status: VERIFICATION_CODE_STATUS.PENDING,
    targetType,
    sendType,
    expirationAt: new Date(new Date().getTime() + expirationTime * 1000),
  });

  return { ...verificationCode, expirationTime };
};

const submitVerificationCode = async ({
  transactionId,
  userId,
  code: codeRequest,
  targetType: targetTypeRequest,
}) => {
  let verificationCode = await verificationCodeDao.findVerificationCode({
    transactionId,
    userId,
  });

  if (!verificationCode) {
    throw new CustomError(errorCodes.VERIFICATION_CODE_NOT_FOUND);
  }

  const { id: verificationCodeId, targetType, expirationAt, status, code } = verificationCode;

  if (targetType !== targetTypeRequest) {
    throw new CustomError(errorCodes.VERIFICATION_CODE_INVALID);
  }

  if (status !== VERIFICATION_CODE_STATUS.PENDING) {
    throw new CustomError(errorCodes.VERIFICATION_CODE_VERIFIED);
  }

  const currentDate = new Date();
  if (expirationAt < currentDate) {
    throw new CustomError(errorCodes.VERIFICATION_CODE_EXPIRED);
  }

  if (code !== codeRequest) {
    await verificationCodeDao.updateVerificationCode(verificationCodeId, {
      status: VERIFICATION_CODE_STATUS.FAILED,
    });

    throw new CustomError(errorCodes.VERIFICATION_CODE_INCORRECT);
  }

  await verificationCodeDao.updateVerificationCode(verificationCodeId, {
    status: VERIFICATION_CODE_STATUS.SUCCESS,
  });

  verificationCode = verificationCodeDao.findVerificationCode(verificationCodeId);

  return verificationCode;
};

module.exports = {
  createVerificationCode,
  submitVerificationCode,
};
