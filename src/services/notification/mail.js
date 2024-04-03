const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');

const {
  NOTIFICATION_MAIL_FROM,
  NOTIFICATION_MAIL_USERNAME,
  NOTIFICATION_MAIL_PASSWORD,
} = require('../../configs');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: NOTIFICATION_MAIL_USERNAME,
    pass: NOTIFICATION_MAIL_PASSWORD,
  },
});

const send = async ({ from = NOTIFICATION_MAIL_FROM, to, subject, text }, requestId) => {
  const thirdPartyRequestId = uuidv4();

  try {
    const mailOptions = { from, to, subject, text };

    logger.info(
      `[3RD][${thirdPartyRequestId}][REQUEST][SEND_EMAIL] data: ${JSON.stringify(mailOptions)}`,
      requestId,
    );

    const result = await new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) reject(err);
        resolve(info);
      });
    });

    const data = result.response;
    logger.info(
      `[3RD][${thirdPartyRequestId}][RESPONSE][SEND_EMAIL] status: SUCCESS - data: ${JSON.stringify(
        data,
      )}`,
      requestId,
    );

    return { status: 1, result: data };
  } catch (error) {
    logger.error(
      `[3RD][${thirdPartyRequestId}][RESPONSE][SEND_EMAIL] status: FAILED - data: ${error}`,
      requestId,
    );

    return { status: 0, message: error.message };
  }
};

module.exports = { send };
