const express = require('express');
const router = express.Router();
const controllers = require('../controllers/auth');

//Routes
router.post('/signup', controllers.signup);
router.post('/signin', controllers.signin);
router.post('/refresh-token', controllers.refreshToken);
router.post('/recover', controllers.recover);

module.exports = router;
