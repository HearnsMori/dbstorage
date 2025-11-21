const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Storage = require('../models/Storage');
const controllers = require('../controllers/storage');
const verifyToken = require('../middlewares/verifyToken');
//Routes
router.post('/setItem', verifyToken, controllers.setItem);
router.post('/removeItem', verifyToken, controllers.removeItem);
router.post('/getItem', verifyToken, controllers.getItem);

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
