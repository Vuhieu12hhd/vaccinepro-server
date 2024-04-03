const CustomError = require('../errors/CustomError');
const errorCodes = require('../errors/code');

const authService = require('../services/auth');
const userService = require('../services/user');
const { USER_ROLE, USER_ROLE_SCOPE, SCOPES } = require('../constants');

const generateScope = (method, path) => `[${method}][${path}]`;

const auth = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) throw new CustomError(errorCodes.UNAUTHORIZED);

  const [tokenType, accessToken] = authorization.split(' ');

  if (tokenType !== 'Bearer') throw new CustomError(errorCodes.UNAUTHORIZED);
  const user = await authService.verifyAccessToken(accessToken);

  await userService.checkUserStatus({ user });

  req.user = user;
  req.accessToken = accessToken;

  const emailVerifiedIgnoreUris = [
    '[POST][/verifyAccessToken]',
    '[POST][/users/me/requestVerifyEmail]',
    '[POST][/users/me/confirmVerifyEmail]',
  ];

  const {
    method,
    route: { path },
  } = req;
  if (
    user.role === USER_ROLE.CUSTOMER &&
    !user.isEmailVerified &&
    !emailVerifiedIgnoreUris.includes(generateScope(method, path))
  ) {
    throw new CustomError(errorCodes.EMAIL_IS_NOT_VERIFIED);
  }

  checkPermissionByRole(req);
  return next();
};

const checkPermissionByRole = (req) => {
  const {
    method,
    route: { path },
    user,
  } = req;
  const { role } = user;
  const userRoleScopeIds = USER_ROLE_SCOPE[role] || [];

  if (path.startsWith('/admin')) {
    const scope = generateScope(method, path);
    const hasPermission = userRoleScopeIds.find(
      (userRoleScopeId) => SCOPES[userRoleScopeId] === scope,
    );
    if (!hasPermission) throw new CustomError(errorCodes.UNAUTHORIZED);
  }
};

module.exports = {
  auth,
};
