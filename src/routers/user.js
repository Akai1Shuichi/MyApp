const express = require('express');
const router = new express.Router();
const userController = require('../controller/userController');
const auth = require('../middleware/auth');

// Creat user
router.post('/user', userController.insert);

// Login user
router.post('/user/login', userController.login);

// Logout user
router.post('/user/logout', auth, userController.logout);

// Get User by ID
router.get('/user/you', auth, userController.get);

// Update user
router.patch('/user/you', auth, userController.update);

// Delete user
router.delete('/user/you', auth, userController.delete);

// Get All User
router.get('/allUser', auth, userController.getDetails);

module.exports = router;
