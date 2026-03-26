const express = require('express');
const router = express.Router();
const processController = require('../../controllers/v1/processController');
const verifyToken = require('../../middlewares/verifyToken');


router.post('/generatives/texts', );
router.post('/generatives/jsons', );

router.post('/agents/decisions', );

router.get('/automations/:processId', );
router.post('/automations/:processId', );
router.patch('/automations/:processId', );
router.delete('/automations/:processId', );

router.get('/communications/:communicationId', );
router.post('/communications/:communicationId', );
router.patch('/communications/:communicationId', );
router.delete('/communications/:communicationId', );

router.get('/files/:filePath',);
router.post('/files/:filePath',);
router.put('/files/:filePath',);
router.patch('/files/:filePath',);
router.delete('/files/:filePath',);

router.use('/securities', );
router.use('/analytics', );
router.use('/integrations', );

module.exports = router;
