const express = require('express');
const health = require('../controllers/health/health.js');

const router = express.Router();

router.post('/', health);

module.exports = router;