const express = require('express');
const router = express.Router();

const user = require('../controllers/user');
const verifyToken = require('../middlewares/verifyToken');

// All routes below require a valid JWT (verified by verifyToken middleware)

// ----------------------------------------------------
// READ OPERATIONS (GET)
// ----------------------------------------------------

// Get non-sensitive general user data
router.get('/read', verifyToken, user.readUser);

// Get specific user ID
router.get('/read-id', verifyToken, user.readId);

// Get all contacts
router.get('/read-contact', verifyToken, user.readContact);

// Get all access rules
router.get('/read-access', verifyToken, user.readAccess);


// ----------------------------------------------------
// UPDATE/MODIFY OPERATIONS (PUT)
// ----------------------------------------------------

// Update login ID
router.put('/update-id', verifyToken, user.updateId);

// Update password
router.put('/update-password', verifyToken, user.updatePassword);


// ----------------------------------------------------
// ARRAY OPERATIONS (POST - used for specific array mutations)
// ----------------------------------------------------

// CONTACTS
// Add a new contact entry to the array
router.post('/contact-add', verifyToken, user.addContact);

// Remove one or more contacts based on criteria (name or value)
router.post('/contact-remove', verifyToken, user.removeContact);


// ACCESS RULES
// Add a new access rule to the array
router.post('/access-add', verifyToken, user.addAccess);

// Remove a specific access rule entry
router.post('/access-remove', verifyToken, user.removeAccess);


// ----------------------------------------------------
// DELETE OPERATION
// ----------------------------------------------------

// Delete the user's account
router.delete('/delete-account', verifyToken, user.deleteAccount);


module.exports = router;