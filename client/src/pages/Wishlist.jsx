import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiTrash2 } from 'react-icons/fi';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const formatPrice = (p) => `₹${Number(p).toLocaleString('en-IN')}`;

export default function Wishlist() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  const fetchWishlist = () => {
    api.get('/wishlist').then(({ data }) => setItems(data.items)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchWishlist(); }, []);

  const remove = async (productId) => {
    await api.post('/wishlist/toggle', { product_id: productId });
    toast.success('Removed from wishlist.');
    fetchWishlist();
  };

  return (
    <div style={{ padding: '40px 0 80px' }} className="page-enter">
      <div className="container">
        <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 28, fontWeight: 800, marginBottom: 30, display: 'flex', alignItems: 'center', gap: 12 }}>
          <FiHeart style={{ color: 'var(--secondary)' }} /> My Wishlist
        </h1>

        {loading ? (
          <div className="loading-screen"><div className="spinner" /></div>
        ) : items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>💔</div>
            <h3 style={{ fontSize: 20, color: 'var(--text-secondary)', marginBottom: 8 }}>Your wishlist is empty</h3>
            <p style={{ marginBottom: 20 }}>Save items you love for later</p>
            <Link to="/products" className="btn btn-primary">Start Shopping</Link>
          </div>
        ) : (
          <div className="products-grid">
            {items.map(item => (
              <div className="product-card" key={item.id}>
                <div className="product-card__image-wrap">
                  <img src={item.image} alt={item.name} className="product-card__image"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'; }} />
                  <div className="product-card__actions" style={{ opacity: 1, transform: 'none' }}>
                    <button className="icon-btn active" onClick={() => remove(item.product_id)} title="Remove from wishlist">
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
                <div className="product-card__body">
                  <Link to={`/products/${item.slug}`} className="product-card__name">{item.name}</Link>
                  <div className="product-card__price-row">
                    <span className="product-card__price">{formatPrice(item.price)}</span>
                    {item.original_price > item.price && (
                      <span className="product-card__original-price">{formatPrice(item.original_price)}</span>
                    )}
                  </div>
                  <button
                    className="btn btn-primary btn-sm product-card__add-btn"
                    onClick={() => addToCart(item.product_id)}
                    disabled={item.stock === 0}
                  >
                    <FiShoppingCart size={14} /> {item.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
