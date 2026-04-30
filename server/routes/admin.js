const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { adminAuth } = require('../middleware/auth');
const { getAllOrders, updateOrderStatus } = require('../controllers/orderController');

router.use(adminAuth);

// Dashboard Stats
router.get('/stats', async (req, res) => {
  try {
    const [[{ totalUsers }]] = await db.query('SELECT COUNT(*) as totalUsers FROM users WHERE role = "user"');
    const [[{ totalOrders }]] = await db.query('SELECT COUNT(*) as totalOrders FROM orders');
    const [[{ totalRevenue }]] = await db.query('SELECT COALESCE(SUM(final_amount),0) as totalRevenue FROM orders WHERE status != "cancelled"');
    const [[{ totalProducts }]] = await db.query('SELECT COUNT(*) as totalProducts FROM products WHERE is_active = 1');
    const [recentOrders] = await db.query(
      `SELECT o.*, u.name as user_name FROM orders o JOIN users u ON o.user_id = u.id ORDER BY o.created_at DESC LIMIT 5`
    );
    const [topProducts] = await db.query(
      `SELECT p.name, p.image, p.price, SUM(oi.quantity) as total_sold
       FROM order_items oi JOIN products p ON oi.product_id = p.id
       GROUP BY p.id ORDER BY total_sold DESC LIMIT 5`
    );
    const [monthlySales] = await db.query(
      `SELECT DATE_FORMAT(created_at, '%Y-%m') as month, SUM(final_amount) as revenue, COUNT(*) as orders
       FROM orders WHERE status != 'cancelled' AND created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
       GROUP BY month ORDER BY month ASC`
    );
    res.json({ success: true, stats: { totalUsers, totalOrders, totalRevenue, totalProducts }, recentOrders, topProducts, monthlySales });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// Users
router.get('/users', async (req, res) => {
  try {
    const [users] = await db.query('SELECT id, name, email, role, phone, created_at FROM users ORDER BY created_at DESC');
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

router.put('/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    await db.query('UPDATE users SET role = ? WHERE id = ?', [role, req.params.id]);
    res.json({ success: true, message: 'User role updated.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// Categories
router.get('/categories', async (req, res) => {
  try {
    const [cats] = await db.query('SELECT * FROM categories ORDER BY name');
    res.json({ success: true, categories: cats });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

router.post('/categories', async (req, res) => {
  try {
    const { name, description, image } = req.body;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    await db.query('INSERT INTO categories (name, slug, description, image) VALUES (?,?,?,?)', [name, slug, description, image]);
    res.status(201).json({ success: true, message: 'Category created.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// Orders
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);

// Coupons
router.get('/coupons', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM coupons ORDER BY created_at DESC');
    res.json({ success: true, coupons: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

router.post('/coupons', async (req, res) => {
  try {
    const { code, discount_type, discount_value, min_order_amount, max_uses, expires_at } = req.body;
    await db.query(
      'INSERT INTO coupons (code, discount_type, discount_value, min_order_amount, max_uses, expires_at) VALUES (?,?,?,?,?,?)',
      [code.toUpperCase(), discount_type, discount_value, min_order_amount || 0, max_uses || null, expires_at || null]
    );
    res.status(201).json({ success: true, message: 'Coupon created.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

router.delete('/coupons/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM coupons WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Coupon deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
