const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); // relative path, don't change

// Register route
router.post('/register', authController.register);

module.exports = router;