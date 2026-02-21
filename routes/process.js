//To Do
//To be implemented in future
const express = require('express');
const router = express.Router();
const aiJSONGenerator = require('../controllers/process/generator/aiJSONGenerator');
const aiTXTGenerator = require('../controllers/process/generator/aiTXTGenerator');

//Doesn't need an account
router.post('/generator/aiJSONGenerator', aiJSONGenerator.aiJSONGenerator);
router.post('/generator/aiTXTGenerator', aiTXTGenerator.aiTXTGenerator);

module.exports = router;

