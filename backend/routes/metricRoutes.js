const express = require('express');
const router = express.Router();
const { getMetrics } = require('../controllers/metricController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getMetrics);

module.exports = router;
