const mailService = require('./mail');

module.exports = {
  sendMail: mailService.send,
};
