const router = require('express').Router();

const { auth } = require('../middlewares/auth');
const { asyncResponse } = require('../middlewares/async');
const authController = require('../controllers/auth');
const authValidate = require('../validations/auth');

router.post('/login', authValidate.loginValidate, asyncResponse(authController.login));
router.post('/register', authValidate.registerValidate, asyncResponse(authController.register));
router.post('/verifyAccessToken', asyncResponse(auth, authController.verifyAccessToken));

module.exports = router;
