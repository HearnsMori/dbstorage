const express = require('express');
const router = express.Router();
const authController = require('../../controller/v1/authController');
const verifyToken = require('../../middlewares/verifyToken');

//Routes
router.post('/signup', authController.signup);
router.post('/login', authController.signin);
router.post('/refresh-token', verifyToken, authController.refreshToken);

router.post('/recover', authController.recover);
router.post('/mfa', verifyToken, authController.mfa);
router.post('/sessions', verifyToken, authController.sessions);

module.exports = router;
