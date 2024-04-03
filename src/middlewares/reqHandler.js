const { v4: uuidv4 } = require('uuid');
const camelcaseKeys = require('camelcase-keys');

const { omitIsNil } = require('../utils/omit');

const camelCaseReq = (req) => {
  req.query = camelcaseKeys(req.query, { deep: true });
  req.body = camelcaseKeys(req.body, { deep: true });
};

const omitReq = (req) => {
  req.body = omitIsNil(req.body, { deep: true });
  req.headers = omitIsNil(req.headers, { deep: true });
  req.query = omitIsNil(req.query, { deep: true });
  req.params = omitIsNil(req.params, { deep: true });
};

const reqHandler = (req, res, next) => {
  const requestId = uuidv4();
  req.requestId = requestId;
  req.requestTime = new Date().getTime();

  logger.info(
    `[API][REQUEST][${req.method}][${req.url}] data: ${JSON.stringify({
      headers: req.headers,
      params: req.params,
      query: req.query,
      body: req.body,
    })}`,
    req.requestId,
  );

  camelCaseReq(req);
  omitReq(req);

  next();
};

module.exports = reqHandler;
