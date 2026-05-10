const express = require('express');
const { addStockEntry, removeStock, getStockHistory, getAllLots } = require('../controllers/stockController');
const { verifyToken, authorize } = require('../middlewares/auth');

const router = express.Router();

router.post('/entry', verifyToken, authorize(['Administrateur', 'Magasinier']), addStockEntry);
router.post('/remove', verifyToken, authorize(['Administrateur', 'Magasinier']), removeStock);
router.get('/history/:lotId', verifyToken, getStockHistory);
router.get('/', verifyToken, getAllLots);

module.exports = router;