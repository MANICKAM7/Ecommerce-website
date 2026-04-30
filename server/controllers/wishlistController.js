const db = require('../config/db');

// GET /api/wishlist
const getWishlist = async (req, res) => {
  try {
    const [items] = await db.query(
      `SELECT w.id, p.id as product_id, p.name, p.price, p.original_price, p.image, p.rating, p.slug, p.stock
       FROM wishlist w JOIN products p ON w.product_id = p.id
       WHERE w.user_id = ? AND p.is_active = 1`,
      [req.user.id]
    );
    res.json({ success: true, items });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// POST /api/wishlist
const toggleWishlist = async (req, res) => {
  try {
    const { product_id } = req.body;
    const [existing] = await db.query('SELECT id FROM wishlist WHERE user_id = ? AND product_id = ?', [req.user.id, product_id]);

    if (existing.length) {
      await db.query('DELETE FROM wishlist WHERE user_id = ? AND product_id = ?', [req.user.id, product_id]);
      return res.json({ success: true, wishlisted: false, message: 'Removed from wishlist.' });
    }

    await db.query('INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)', [req.user.id, product_id]);
    res.json({ success: true, wishlisted: true, message: 'Added to wishlist!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { getWishlist, toggleWishlist };
