const db = require('../config/db');

// GET /api/products
const getProducts = async (req, res) => {
  try {
    const { category, search, sort, minPrice, maxPrice, featured, page = 1, limit = 12 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    let conditions = ['p.is_active = 1'];
    let params = [];

    if (category) {
      conditions.push('c.slug = ?');
      params.push(category);
    }
    if (search) {
      conditions.push('(p.name LIKE ? OR p.description LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }
    if (minPrice) {
      conditions.push('p.price >= ?');
      params.push(parseFloat(minPrice));
    }
    if (maxPrice) {
      conditions.push('p.price <= ?');
      params.push(parseFloat(maxPrice));
    }
    if (featured === 'true') {
      conditions.push('p.is_featured = 1');
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    let orderBy = 'p.created_at DESC';
    if (sort === 'price_asc') orderBy = 'p.price ASC';
    else if (sort === 'price_desc') orderBy = 'p.price DESC';
    else if (sort === 'rating') orderBy = 'p.rating DESC';
    else if (sort === 'newest') orderBy = 'p.created_at DESC';
    else if (sort === 'popular') orderBy = 'p.review_count DESC';

    const countQuery = `
      SELECT COUNT(*) as total
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ${whereClause}
    `;
    const [countRows] = await db.query(countQuery, params);
    const total = countRows[0].total;

    const query = `
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ${whereClause}
      ORDER BY ${orderBy}
      LIMIT ? OFFSET ?
    `;
    const [products] = await db.query(query, [...params, parseInt(limit), offset]);

    res.json({
      success: true,
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('getProducts error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// GET /api/products/:slug
const getProduct = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT p.*, c.name as category_name, c.slug as category_slug
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.slug = ? AND p.is_active = 1`,
      [req.params.slug]
    );
    if (!rows.length) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }
    const product = rows[0];

    const [reviews] = await db.query(
      `SELECT r.*, u.name as user_name, u.avatar as user_avatar
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.product_id = ?
       ORDER BY r.created_at DESC
       LIMIT 10`,
      [product.id]
    );

    const [related] = await db.query(
      `SELECT p.*, c.name as category_name FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.category_id = ? AND p.id != ? AND p.is_active = 1
       ORDER BY p.rating DESC LIMIT 4`,
      [product.category_id, product.id]
    );

    res.json({ success: true, product, reviews, related });
  } catch (error) {
    console.error('getProduct error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// POST /api/products/:id/review
const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.id;

    await db.query(
      'INSERT INTO reviews (product_id, user_id, rating, comment) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE rating=?, comment=?',
      [productId, req.user.id, rating, comment, rating, comment]
    );

    const [ratingData] = await db.query(
      'SELECT AVG(rating) as avg_rating, COUNT(*) as count FROM reviews WHERE product_id = ?',
      [productId]
    );
    await db.query(
      'UPDATE products SET rating=?, review_count=? WHERE id=?',
      [parseFloat(ratingData[0].avg_rating).toFixed(1), ratingData[0].count, productId]
    );

    res.json({ success: true, message: 'Review submitted!' });
  } catch (error) {
    console.error('addReview error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// Admin: POST /api/products
const createProduct = async (req, res) => {
  try {
    const { name, description, price, original_price, stock, category_id, image, is_featured } = req.body;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const [result] = await db.query(
      'INSERT INTO products (name, slug, description, price, original_price, stock, category_id, image, is_featured) VALUES (?,?,?,?,?,?,?,?,?)',
      [name, slug, description, price, original_price || null, stock, category_id, image, is_featured ? 1 : 0]
    );
    res.status(201).json({ success: true, message: 'Product created!', id: result.insertId });
  } catch (error) {
    console.error('createProduct error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// Admin: PUT /api/products/:id
const updateProduct = async (req, res) => {
  try {
    const { name, description, price, original_price, stock, category_id, image, is_featured, is_active } = req.body;
    await db.query(
      'UPDATE products SET name=?, description=?, price=?, original_price=?, stock=?, category_id=?, image=?, is_featured=?, is_active=? WHERE id=?',
      [name, description, price, original_price, stock, category_id, image, is_featured ? 1 : 0, is_active ? 1 : 0, req.params.id]
    );
    res.json({ success: true, message: 'Product updated!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// Admin: DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    await db.query('UPDATE products SET is_active = 0 WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Product deleted!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { getProducts, getProduct, addReview, createProduct, updateProduct, deleteProduct };
