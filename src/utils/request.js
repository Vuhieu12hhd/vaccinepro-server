const getClientAddress = (req) => {
  return req.headers.origin;
};

module.exports = { getClientAddress };
