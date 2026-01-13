//To Do
//None
const express = require('express');
const router = express.Router();
const controllers = require('../controllers/auth');
const verifyToken = require('../middlewares/verifyToken');

//Routes
router.post('/signup', verifyToken, controllers.roleSignup);
router.post('/signin', verifyToken, controllers.roleSignin);
router.post('/refreshToken', verifyToken, controllers.roleRefreshToken);

module.exports = router;
