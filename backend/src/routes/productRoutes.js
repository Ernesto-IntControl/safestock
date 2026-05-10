const express = require('express');
const { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { verifyToken, authorize } = require('../middlewares/auth');

const router = express.Router();

router.get('/', verifyToken, getAllProducts);
router.get('/:id', verifyToken, getProductById);
router.post('/', verifyToken, authorize(['Administrateur', 'Magasinier']), createProduct);
router.put('/:id', verifyToken, authorize(['Administrateur', 'Magasinier']), updateProduct);
router.delete('/:id', verifyToken, authorize(['Administrateur']), deleteProduct);

module.exports = router;