const express = require('express');
const router = express.Router();
const controllers = require('../controllers/auth');

//Routes
router.post('/signup', controllers.signup);
router.post('/signin', controllers.signin);
router.post('/refreshToken', controllers.refreshToken);
router.post('/forgotAccount', controllers.forgotAccount);

module.exports = router;
