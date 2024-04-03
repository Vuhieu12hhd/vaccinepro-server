const { customAlphabet } = require('nanoid');

const generateRandomString = (length, allowedChars) => {
  let text = '';
  const possible =
    allowedChars ||
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const generateId = (length = 10, allowedChars) => {
  allowedChars =
    allowedChars ||
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const nanoid = customAlphabet(allowedChars, length);

  return nanoid();
};

module.exports = { generateRandomString, generateId };
