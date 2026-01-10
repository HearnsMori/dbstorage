const express = require('express');
const router = express.Router();
const controllers = require('../controllers/auth');

//Routes
router.post('/signup', controllers.roleSignup);
router.post('/signin', controllers.roleSignin);
router.post('/refreshtoken', controllers.roleRefreshToken);

module.exports = router;
