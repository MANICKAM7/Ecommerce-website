const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

// GET /api/orders
const getOrders = async (req, res) => {
  try {
    const [orders] = await db.query(
      `SELECT o.*, 
        (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as item_count
       FROM orders o WHERE o.user_id = ? ORDER BY o.created_at DESC`,
      [req.user.id]
    );

    for (let order of orders) {
      const [items] = await db.query('SELECT * FROM order_items WHERE order_id = ?', [order.id]);
      order.items = items;
    }

    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// GET /api/orders/:id
const getOrder = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM orders WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Order not found.' });

    const [items] = await db.query('SELECT * FROM order_items WHERE order_id = ?', [req.params.id]);
    res.json({ success: true, order: { ...rows[0], items } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// POST /api/orders
const createOrder = async (req, res) => {
  try {
    const { shipping, payment_method, coupon_code, notes } = req.body;

    const [cartItems] = await db.query(
      `SELECT c.quantity, p.id as product_id, p.name, p.price, p.image, p.stock
       FROM cart c JOIN products p ON c.product_id = p.id
       WHERE c.user_id = ? AND p.is_active = 1`,
      [req.user.id]
    );

    if (!cartItems.length) return res.status(400).json({ success: false, message: 'Cart is empty.' });

    // Validate stock
    for (let item of cartItems) {
      if (item.stock < item.quantity) {
        return res.status(400).json({ success: false, message: `Insufficient stock for ${item.name}.` });
      }
    }

    let totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    let discountAmount = 0;

    // Apply coupon
    if (coupon_code) {
      const [coupons] = await db.query(
        `SELECT * FROM coupons WHERE code = ? AND is_active = 1 AND (expires_at IS NULL OR expires_at > NOW())
         AND (max_uses IS NULL OR used_count < max_uses)`,
        [coupon_code.toUpperCase()]
      );
      if (coupons.length) {
        const coupon = coupons[0];
        if (totalAmount >= coupon.min_order_amount) {
          discountAmount = coupon.discount_type === 'percentage'
            ? totalAmount * (coupon.discount_value / 100)
            : coupon.discount_value;
          await db.query('UPDATE coupons SET used_count = used_count + 1 WHERE id = ?', [coupon.id]);
        }
      }
    }

    const shippingAmount = totalAmount > 5000 ? 0 : 99;
    const taxAmount = (totalAmount - discountAmount) * 0.18;
    const finalAmount = totalAmount - discountAmount + shippingAmount + taxAmount;
    const orderNumber = `AEC-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const [orderResult] = await db.query(
      `INSERT INTO orders (order_number, user_id, total_amount, discount_amount, shipping_amount, tax_amount, 
        final_amount, payment_method, shipping_name, shipping_email, shipping_phone, shipping_address, 
        shipping_city, shipping_country, shipping_zip, notes)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [orderNumber, req.user.id, totalAmount, discountAmount, shippingAmount, taxAmount, finalAmount,
        payment_method || 'cod', shipping.name, shipping.email, shipping.phone, shipping.address,
        shipping.city, shipping.country, shipping.zip, notes || null]
    );

    const orderId = orderResult.insertId;

    for (let item of cartItems) {
      await db.query(
        'INSERT INTO order_items (order_id, product_id, name, price, quantity, image) VALUES (?,?,?,?,?,?)',
        [orderId, item.product_id, item.name, item.price, item.quantity, item.image]
      );
      await db.query('UPDATE products SET stock = stock - ? WHERE id = ?', [item.quantity, item.product_id]);
    }

    await db.query('DELETE FROM cart WHERE user_id = ?', [req.user.id]);

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      order_number: orderNumber,
      order_id: orderId,
      final_amount: finalAmount
    });
  } catch (error) {
    console.error('createOrder error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// POST /api/orders/validate-coupon
const validateCoupon = async (req, res) => {
  try {
    const { code, amount } = req.body;
    const [rows] = await db.query(
      `SELECT * FROM coupons WHERE code = ? AND is_active = 1 
       AND (expires_at IS NULL OR expires_at > NOW())
       AND (max_uses IS NULL OR used_count < max_uses)`,
      [code.toUpperCase()]
    );
    if (!rows.length) return res.status(404).json({ success: false, message: 'Invalid or expired coupon.' });

    const coupon = rows[0];
    if (amount < coupon.min_order_amount) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount is ₹${coupon.min_order_amount} for this coupon.`
      });
    }

    const discount = coupon.discount_type === 'percentage'
      ? amount * (coupon.discount_value / 100)
      : coupon.discount_value;

    res.json({ success: true, coupon, discount });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// Admin: GET all orders
const getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    let conditions = [];
    let params = [];

    if (status) { conditions.push('o.status = ?'); params.push(status); }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const [orders] = await db.query(
      `SELECT o.*, u.name as user_name, u.email as user_email
       FROM orders o JOIN users u ON o.user_id = u.id
       ${where} ORDER BY o.created_at DESC LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    const [countRows] = await db.query(`SELECT COUNT(*) as total FROM orders o ${where}`, params);

    res.json({ success: true, orders, total: countRows[0].total });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// Admin: PUT /api/admin/orders/:id/status
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ success: true, message: 'Order status updated.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { getOrders, getOrder, createOrder, validateCoupon, getAllOrders, updateOrderStatus };
