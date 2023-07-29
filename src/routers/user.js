const express = require('express');
const router = new express.Router();
const userController = require('../controller/userController');

// Creat user
router.post('/user', userController.insert);

// Login user
router.post('/user/login', userController.login);

// Get User by ID
router.get('/user/:id', userController.get);

// Get All User
router.get('/user', userController.getDetails);

// Update user
router.patch('/user/:id', userController.update);

// Delete user
router.delete('/user/:id', userController.delete);

// login test
router.post('/user/logintest', userController.loginTest);
module.exports = router;
