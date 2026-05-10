const express = require('express');
const { getDashboardStats, getInventoryReport, getMovementStats } = require('../controllers/reportController');
const { verifyToken } = require('../middlewares/auth');

const router = express.Router();

router.get('/dashboard', verifyToken, getDashboardStats);
router.get('/inventory', verifyToken, getInventoryReport);
router.get('/movements', verifyToken, getMovementStats);

module.exports = router;