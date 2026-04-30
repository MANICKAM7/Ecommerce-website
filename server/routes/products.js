const express = require('express');
const router = express.Router();
const { getProducts, getProduct, addReview, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { auth, adminAuth } = require('../middleware/auth');

router.get('/', getProducts);
router.get('/:slug', getProduct);
router.post('/:id/review', auth, addReview);
router.post('/', adminAuth, createProduct);
router.put('/:id', adminAuth, updateProduct);
router.delete('/:id', adminAuth, deleteProduct);

module.exports = router;
