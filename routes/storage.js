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
router.post('/get-item', verifyToken, controllers.getItem);
router.post('/set-item', verifyToken, controllers.setItem);
router.post('/remove-item', verifyToken, controllers.removeItem);
router.post('/audit-essential', verifyToken, controllers.removeItem);


// Clear all items (if you have a clear function)
router.post('/clear-all', async (req, res) => {
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
