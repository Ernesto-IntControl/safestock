const express = require('express');
const { getExpirationAlerts, getExpiredProducts, getLowStockAlerts } = require('../controllers/alertController');
const { verifyToken } = require('../middlewares/auth');

const router = express.Router();

router.get('/expiration', verifyToken, getExpirationAlerts);
router.get('/expired', verifyToken, getExpiredProducts);
router.get('/low-stock', verifyToken, getLowStockAlerts);

module.exports = router;