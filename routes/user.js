//To Do
//None
const express = require('express');
const router = express.Router();
const user = require('../controllers/user');
const verifyToken = require('../middlewares/verifyToken');

//id=String,
//password=String, 
//role=[String],
//contact=[{name: String, value: any}],

/*
 *Self
 */
//Read
router.get('/get-self-all', verifyToken, user.getSelfAll);
router.get('/get-self-id', verifyToken, user.getSelfId);
router.get('/get-self-password', verifyToken, user.getSelfPassword);
router.get('/get-self-role', verifyToken, user.getSelfRole);
router.get('/get-self-contact', verifyToken, user.getSelfContact);
//Update
router.put('/set-self-all',verifyToken, user.setSelfAll);
router.put('/set-self-id',verifyToken, user.setSelfId);
router.put('/set-self-password',verifyToken, user.setSelfPassword);
router.put('/push-self-role',verifyToken, user.pushSelfRole);
router.put('/push-self-contact',verifyToken, user.pushSelfContact);
//Delete
router.delete('/remove-self-all', verifyToken, user.removeSelfAll);
router.delete('/remove-self-id', verifyToken, user.removeSelfId);
router.delete('/remove-self-password', verifyToken, user.removeSelfPassword);
router.delete('/pop-self-role', verifyToken, user.popSelfRole);
router.delete('/pop-self-contact', verifyToken, user.popSelfContact);

/*
 *Other
 */
//Read
router.get('/get-other-all', verifyToken, user.getOtherAll);
router.get('/get-other-id', verifyToken, user.getOtherId);
router.get('/get-other-password', verifyToken, user.getOtherPassword);
router.get('/get-other-role', verifyToken, user.getOtherRole);
router.get('/get-other-contact', verifyToken, user.getOtherContact);
//Update
router.put('/set-other-all',verifyToken, user.setOtherAll);
router.put('/set-other-id',verifyToken, user.setOtherId);
router.put('/set-other-password',verifyToken, user.setOtherPassword);
router.put('/push-other-role',verifyToken, user.pushOtherRole);
router.put('/push-other-contact',verifyToken, user.pushOtherContact);
//Delete
router.delete('/remove-other-all', verifyToken, user.removeOtherAll);
router.delete('/remove-other-id', verifyToken, user.removeOtherId);
router.delete('/remove-other-password', verifyToken, user.removeOtherPassword);
router.delete('/pop-other-role', verifyToken, user.popOtherRole);
router.delete('/pop-other-contact', verifyToken, user.popOtherContact);

router.delete('/account-delete', verifyToken, user.accountDelete);
router.delete('/account-deactivate', verifyToken, user.accountDeactivate);
router.delete('/account-reactivate', verifyToken, user.accountReactivate);
router.delete('/create-role', verifyToken, user.createRole);

module.exports = router;
