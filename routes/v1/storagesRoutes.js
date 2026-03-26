const express = require('express');
const router = express.Router();
const storageController = require('../../controllers/v1/storageController');
const verifyToken = require('../../middlewares/verifyToken');

//Routes
router.get('/storages/:platform/:organization/:company/:app/:collection/:key', verifyToken, storageController.getItem);
router.post('/storages/:platform/:organization/:company/:app/:collection/:key', verifyToken, storageController.getItem);
router.patch('/storages/:platform/:organization/:company/:app/:collection/:key', verifyToken, storageController.getItem);
router.put('/storages/:platform/:organization/:company/:app/:collection/:key', verifyToken, storageController.getItem);
router.delete('/storages/:platform/:organization/:company/:app/:collection/:key', verifyToken, storageControllers.getItem);

router.get('/anonymous-storages/:platform/:organization/:company/:app/:collection/:key', storageController.getItem);

module.exports = router;
