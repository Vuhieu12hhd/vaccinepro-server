const VerificationCode = require('../models/verificationCode');

const findVerificationCode = async (condition) => {
  if (typeof condition === 'number') {
    const verificationCode = await VerificationCode.findByPk(condition);
    return verificationCode?.get();
  }

  if (typeof condition === 'object' && condition != null) {
    const verificationCode = await VerificationCode.findOne({
      where: condition,
    });
    return verificationCode?.get();
  }

  return null;
};

const createVerificationCode = async (data) => {
  const verificationCode = await VerificationCode.create(data);
  return verificationCode?.get();
};

const updateVerificationCode = async (verificationCodeId, data) => {
  await VerificationCode.update(data, {
    where: { id: verificationCodeId },
  });
};

module.exports = {
  findVerificationCode,
  createVerificationCode,
  updateVerificationCode,
};
