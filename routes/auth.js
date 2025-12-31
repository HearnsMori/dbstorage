const express = require('express');
const router = express.Router();
const controllers = require('../controllers/auth');

//Routes
router.post('/signup', controllers.signup);
router.post('/signin', controllers.signin);
router.post('/refreshtoken', controllers.refreshToken);
router.post('/forgotaccount', controllers.forgotAccount);

module.exports = router;
