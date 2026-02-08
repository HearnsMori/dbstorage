//To Do
// LIST
// ARRAY
// STACK
// QUEUE
// HEAP
// TREE
// TABLE
// GRAPH
// TRIE
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Storage = require('../models/Storage');
const controllers = require('../controllers/storage');
const controllersX = require('../controllers/opinion/itemXStorage');
const controllersJSON = require('../controllers/opinion/jsonStorage');
const verifyToken = require('../middlewares/verifyToken');

//Routes
router.post('/getItem', verifyToken, controllers.getItem);
router.post('/setItem', verifyToken, controllers.setItem);
router.post('/removeItem', verifyToken, controllers.removeItem);

router.post('/getKeyItem', verifyToken, controllersX.getKeyItem);
router.post('/setKeyItem', verifyToken, controllersX.setKeyItem);
router.post('/removeKeyItem', verifyToken, controllersX.removeKeyItem);

router.post('/getCollectionItem', verifyToken, controllersX.getCollectionItem);
router.post('/setCollectionItem', verifyToken, controllersX.setCollectionItem);
router.post('/removeCollectionItem', verifyToken, controllersX.removeCollectionItem);

router.post('/getAppItem', verifyToken, controllersX.getAppItem);
router.post('/setAppItem', verifyToken, controllersX.setAppItem);
router.post('/removeAppItem', verifyToken, controllersX.removeAppItem);

// Name, ?Key, ?Value
router.post('/getJSONItem', verifyToken, controllersJSON.getJSONItem);
router.post('/setJSONItem', verifyToken, controllersJSON.setJSONItem);
router.post('/removeJSONItem', verifyToken, controllersJSON.removeJSONItem);
router.post('/pushJSONManyItem', verifyToken, controllersJSON.pushJSONManyItem);
router.post('/popJSONManyItem', verifyToken, controllersJSON.popJSONManyItem);
router.post('/pushJSONOneItem', verifyToken, controllersJSON.pushJSONOneItem);
router.post('/popJSONOneItem', verifyToken, controllersJSON.popJSONOneItem);

// LIST
// ARRAY
// STACK
// QUEUE
// HEAP
// TREE
// TABLE
// GRAPH
// TRIE

// Clear all items (if you have a clear function)
router.post('/clearAll', async (req, res) => {
  const pass = process.env.CLEAR_ALL_KEY;
  const { password } = req.body;
  if (pass !== password) return res.status(401).json({ error: 'Authentication Failed.' })
  try {
    await Storage.deleteMany({});
    await User.deleteMany({});
    res.status(200).json({ message: 'All items cleared successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
