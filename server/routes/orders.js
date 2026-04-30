const express = require('express');
const router = express.Router();
const { getOrders, getOrder, createOrder, validateCoupon } = require('../controllers/orderController');
const { auth } = require('../middleware/auth');

router.use(auth);
router.get('/', getOrders);
router.get('/:id', getOrder);
router.post('/', createOrder);
router.post('/validate-coupon', validateCoupon);

module.exports = router;
