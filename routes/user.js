const express = require('express');
const router = express.Router();

const user = require('../controllers/user');
const verifyToken = require('../middlewares/verifyToken');

router.put('/update-id', verifyToken, user.updateId);
router.put('/update-password', verifyToken, user.updatePassword);
router.put('/update-contact', verifyToken, user.updateContact);
router.put('/update-access', verifyToken, user.updateAccess);
router.delete('/delete-account', verifyToken, user.deleteAccount);

module.exports = router;
