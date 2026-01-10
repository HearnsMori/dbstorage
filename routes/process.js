//To Do
//To be implemented in future
const express = require('express');
const router = express.Router();
const controllers = require('../controllers/process/generator/aiJSONGenerator');

router.post('/generator/aiJSONGenerator', controllers.aiJSONGenerator);

module.exports = router;

