const camelcaseKeys = require('camelcase-keys');
const errorCodes = require('../errors/code');

const resHandler = (req, res, next) => {
  const { data: resData } = res;
  const { requestId, requestTime, hasUri, method, url } = req;
  const responseTime = new Date().getTime();
  const tookTime = responseTime - requestTime;

  if (!hasUri) {
    return next({ statusCode: errorCodes.NOT_FOUND });
  }

  logger.info(
    `[API][RESPONSE][${method}][${url}] status: SUCCESS - data: ${JSON.stringify(
      resData,
    )} - took: ${tookTime}`,
    requestId,
  );

  return res.send(camelcaseKeys({ status: 1, result: resData }, { deep: true }));
};

module.exports = resHandler;
