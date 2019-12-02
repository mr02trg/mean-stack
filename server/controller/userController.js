
var express = require('express');
var router = express.Router();

const userService = require('../service/userService');

router.post('/register', userService.registerUser);

router.post('/authenticate', userService.authenticateUser);

module.exports = router;