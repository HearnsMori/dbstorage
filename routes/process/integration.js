const express = require('express');
const router = express.Router();
const generative = require('../../controllers/process/generative');

router.post('/generate-txt', generative.generateTxt);

module.exports = router;
