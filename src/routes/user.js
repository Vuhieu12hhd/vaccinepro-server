const router = require('express').Router();

const { auth } = require('../middlewares/auth');
const { asyncMiddleware, asyncResponse } = require('../middlewares/async');
const userController = require('../controllers/user');
const userValidate = require('../validations/user');

router.put(
  '/users/me/info',
  asyncMiddleware(auth),
  userValidate.updateMe,
  asyncResponse(userController.updateMe),
);

router.post(
  '/users/me/requestVerifyEmail',
  asyncMiddleware(auth),
  asyncResponse(userController.requestVerifyEmail),
);

router.post(
  '/users/me/confirmVerifyEmail',
  asyncMiddleware(auth),
  userValidate.confirmVerifyEmail,
  asyncResponse(userController.confirmVerifyEmail),
);

router.post(
  '/users/me/requestChangePassword',
  asyncMiddleware(auth),
  userValidate.requestChangePassword,
  asyncResponse(userController.requestChangePassword),
);

router.post(
  '/users/me/confirmChangePassword',
  asyncMiddleware(auth),
  userValidate.confirmChangePassword,
  asyncResponse(userController.confirmChangePassword),
);

router.get(
  '/admin/users',
  asyncMiddleware(auth),
  userValidate.getUsers,
  asyncResponse(userController.getUsersByAdmin),
);
router.get(
  '/admin/users/:userId',
  asyncMiddleware(auth),
  userValidate.getUserById,
  asyncResponse(userController.getUserByIdByAdmin),
);
router.post(
  '/admin/users',
  asyncMiddleware(auth),
  userValidate.createUser,
  asyncResponse(userController.createUserByAdmin),
);
router.put(
  '/admin/users/:userId',
  asyncMiddleware(auth),
  userValidate.updateUser,
  asyncResponse(userController.updateUserByAdmin),
);
router.delete(
  '/admin/users/:userId',
  asyncMiddleware(auth),
  userValidate.deleteUser,
  asyncResponse(userController.deleteUserByAdmin),
);

module.exports = router;
