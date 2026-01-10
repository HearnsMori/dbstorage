const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Storage = require('../models/Storage');
const controllers = require('../controllers/storage');
const verifyToken = require('../middlewares/verifyToken');

//Routes
router.post('/getItem', verifyToken, controllers.getItem);
router.post('/setItem', verifyToken, controllers.setItem);
router.post('/removeItem', verifyToken, controllers.removeItem);

router.post('/getKeyItem', verifyToken, controllers.getKeyItem);
router.post('/setKeyItem', verifyToken, controllers.setKeyItem);
router.post('/removeKeyItem', verifyToken, controllers.removeKeyItem);

router.post('/getCollectionItem', verifyToken, controllers.getCollectionItem);
router.post('/setCollectionItem', verifyToken, controllers.setCollectionItem);
router.post('/removeCollectionItem', verifyToken, controllers.removeCollectionItem);

router.post('/getAppItem', verifyToken, controllers.getAppItem);
router.post('/setAppItem', verifyToken, controllers.setAppItem);
router.post('/removeAppItem', verifyToken, controllers.removeAppItem);

// Name, ?Key, ?Value
router.post('/getJSONItem', verifyToken, controllers.getItem);
router.post('/pushJSONItem', verifyToken, controllers.setItem);
router.post('/popJSONItem', verifyToken, controllers.removeItem);

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
