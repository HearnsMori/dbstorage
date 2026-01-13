//To Do
//To be implemented in future
const express = require('express');
const router = express.Router();
const aiJSONGenerator = require('../controllers/process/generator/aiJSONGenerator');
const aiTXTGenerator = require('../controllers/process/generator/aiTXTGenerator');
const verifyToken = require('../middlewares/verifyToken');

router.post('/generator/aiJSONGenerator', verifyToken, aiJSONGenerator.aiJSONGenerator);
router.post('/generator/aiTXTGenerator', verifyToken, aiTXTGenerator.aiTXTGenerator);

module.exports = router;

