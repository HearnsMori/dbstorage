//To Do
//None
const express = require('express');
const router = express.Router();
const controllers = require('../controllers/auth');

//Routes
router.post('/signup', controllers.signup);
router.post('/signin', controllers.signin);
router.post('/refresh-token', controllers.refreshToken);

router.post('/recover', controllers.recover);
router.post('/mfa', controllers.mfa);
router.post('/sessions', controllers.sessions);

module.exports = router;
