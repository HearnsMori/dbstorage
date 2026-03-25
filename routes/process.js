//To Do
//To be implemented in future
const express = require('express');
const router = express.Router();

// No Account Needed
router.use('/generative', require('./process/generative'));
router.use('/agent', require('./process/agent'));
// Account Needed
router.use('/automation', require('./process/'));
router.use('/communication', require('./process/'));
router.use('/file', require('./process/'));
router.use('/security', require('./process/'));
router.use('/analytics', require('./process/'));
router.use('/integration', require('./process/'));

module.exports = router;
