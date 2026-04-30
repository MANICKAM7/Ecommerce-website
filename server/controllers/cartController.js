const db = require('../config/db');

// GET /api/cart
const getCart = async (req, res) => {
  try {
    const [items] = await db.query(
      `SELECT c.id, c.quantity, p.id as product_id, p.name, p.price, p.original_price, p.image, p.stock, p.slug
       FROM cart c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = ? AND p.is_active = 1`,
      [req.user.id]
    );
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    res.json({ success: true, items, total, count: items.length });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// POST /api/cart
const addToCart = async (req, res) => {
  try {
    const { product_id, quantity = 1 } = req.body;
    const [product] = await db.query('SELECT id, stock FROM products WHERE id = ? AND is_active = 1', [product_id]);
    if (!product.length) return res.status(404).json({ success: false, message: 'Product not found.' });
    if (product[0].stock < quantity) return res.status(400).json({ success: false, message: 'Insufficient stock.' });

    await db.query(
      'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE quantity = quantity + ?',
      [req.user.id, product_id, quantity, quantity]
    );
    res.json({ success: true, message: 'Item added to cart!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// PUT /api/cart/:id
const updateCart = async (req, res) => {
  try {
    const { quantity } = req.body;
    if (quantity < 1) {
      await db.query('DELETE FROM cart WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
      return res.json({ success: true, message: 'Item removed.' });
    }
    await db.query('UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?', [quantity, req.params.id, req.user.id]);
    res.json({ success: true, message: 'Cart updated.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// DELETE /api/cart/:id
const removeFromCart = async (req, res) => {
  try {
    await db.query('DELETE FROM cart WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    res.json({ success: true, message: 'Item removed from cart.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// DELETE /api/cart
const clearCart = async (req, res) => {
  try {
    await db.query('DELETE FROM cart WHERE user_id = ?', [req.user.id]);
    res.json({ success: true, message: 'Cart cleared.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { getCart, addToCart, updateCart, removeFromCart, clearCart };
