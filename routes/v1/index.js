const express = require('express');
const router = express.Router();

router.use('/storages', require('./storagesRoutes'));
router.use('/users', require('./usersRoutes'));
router.use('/processes', require('./processesRoutes'));
router.use('/auths', require('./authsRoutes'));
router.use('/roles', require('./rolesRoutes'));

module.exports = router;
