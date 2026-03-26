const express = require('express');
const router = express.Router();
const userController = require('../../controllers/v1/userController');
const verifyToken = require('../../middlewares/verifyToken');

router.get('/:userId/:x', verifyToken, userController.signup);
router.post('/:userId/:x', verifyToken, userController.signup);
router.patch('/:userId/:x', verifyToken, userController.signup);
router.put('/:userId/:x', verifyToken, userController.signup);
router.delete('/:userId/:x', verifyToken, userController.signup);

router.post('/reactivate', verifyToken, userController.signin);
router.post('/deactivate', verifyToken, userController.signin);
router.post('/delete', verifyToken, userController.signin);

router.get('/roles/:roleId', verifyToken, userController.signin);
router.post('/roles/:roleId', verifyToken, userController.signin);
router.patch('/roles/:roleId', verifyToken, userController.signin);
router.put('/roles/:roleId', verifyToken, userController.signin);
router.delete('/roles/:roleId', verifyToken, userController.signin);

router.get('/datas/:roleId', verifyToken, userController.signin);
router.post('/datas/:roleId', verifyToken, userController.signin);
router.patch('/datas/:roleId', verifyToken, userController.signin);
router.put('/datas/:roleId', verifyToken, userController.signin);
router.delete('/datas/:roleId', verifyToken, userController.signin);

router.get('/links/:roleId', verifyToken, userController.signin);
router.post('/links/:roleId', verifyToken, userController.signin);
router.patch('/links/:roleId', verifyToken, userController.signin);
router.put('/links/:roleId', verifyToken, userController.signin);
router.put('/links/:roleId', verifyToken, userController.signin);

module.exports = router;
