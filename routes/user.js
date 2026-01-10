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
router.get('getSelfAll', verifyToken, user.getSelfAll);
router.get('getSelfId', verifyToken, user.getSelfId);
router.get('getSelfPassword', verifyToken, user.getSelfPassword);
router.get('getSelfRole', verifyToken, user.getSelfRole);
router.get('getSelfContact', verifyToken, user.getSelfContact);
//Update
router.put('setSelfAll',verifyToken, user.setSelfAll);
router.put('setSelfId',verifyToken, user.setSelfId);
router.put('setSelfPassword',verifyToken, user.setSelfPassword);
router.put('pushSelfRole',verifyToken, user.pushSelfRole);
router.put('pushSelfContact',verifyToken, user.pushSelfContact);
//Delete
router.delete('removeSelfAll', verifyToken, user.removeSelfAll);
router.delete('removeSelfId', verifyToken, user.removeSelfId);
router.delete('removeSelfPassword', verifyToken, user.removeSelfPassword);
router.delete('popSelfRole', verifyToken, user.popSelfRole);
router.delete('popSelfContact', verifyToken, user.popSelfContact);

/*
 *Other
 */
//Read
router.get('getOtherAll', verifyToken, user.getOtherAll);
router.get('getOtherId', verifyToken, user.getOtherId);
router.get('getOtherPassword', verifyToken, user.getOtherPassword);
router.get('getOtherRole', verifyToken, user.getOtherRole);
router.get('getOtherContact', verifyToken, user.getOtherContact);
//Update
router.put('setOtherAll',verifyToken, user.setOtherAll);
router.put('setOtherId',verifyToken, user.setOtherId);
router.put('setOtherPassword',verifyToken, user.setOtherPassword);
router.put('pushOtherRole',verifyToken, user.pushOtherRole);
router.put('pushOtherContact',verifyToken, user.pushOtherContact);
//Delete
router.delete('removeOtherAll', verifyToken, user.removeOtherAll);
router.delete('removeOtherId', verifyToken, user.removeOtherId);
router.delete('removeOtherPassword', verifyToken, user.removeOtherPassword);
router.delete('popOtherRole', verifyToken, user.popOtherRole);
router.delete('popOtherContact', verifyToken, user.popOtherContact);

module.exports = router;
