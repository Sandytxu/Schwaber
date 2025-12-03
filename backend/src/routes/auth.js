const express = require('express');

const login = require('../controllers/auth/login.js');
const check = require('../controllers/auth/check.js');
const logout = require('../controllers/auth/logout.js');
const router = express.Router();

router.post('/login', login);
router.get('/check', check);
router.get('/logout', logout);


module.exports = router;