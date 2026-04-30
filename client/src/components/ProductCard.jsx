import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiEye } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

const formatPrice = (p) => `₹${Number(p).toLocaleString('en-IN')}`;
const calcDiscount = (orig, curr) => orig && orig > curr ? Math.round(((orig - curr) / orig) * 100) : 0;

const Stars = ({ rating, count }) => (
  <div className="product-card__rating">
    <div className="stars">
      {[1,2,3,4,5].map(s => (
        <span key={s} className={`star ${s <= Math.round(rating) ? '' : 'star-empty'}`}>★</span>
      ))}
    </div>
    <span>({count?.toLocaleString() || 0})</span>
  </div>
);

export default function ProductCard({ product }) {
  const { addToCart, loading } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [wishlisted, setWishlisted] = useState(false);
  const discount = calcDiscount(product.original_price, product.price);

  const handleBuyNow = async (e) => {
    e.preventDefault();
    if (product.stock === 0) return;
    await addToCart(product.id);
    navigate('/cart');
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login to add to wishlist.'); return; }
    try {
      const { data } = await api.post('/wishlist/toggle', { product_id: product.id });
      setWishlisted(data.wishlisted);
      toast.success(data.message);
    } catch {
      toast.error('Failed to update wishlist.');
    }
  };

  return (
    <div className="product-card">
      <div className="product-card__image-wrap">
        <img
          src={product.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'}
          alt={product.name}
          className="product-card__image"
          loading="lazy"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'; }}
        />
        {discount > 0 && (
          <div className="product-card__badge">
            <span className="badge badge-success">-{discount}%</span>
          </div>
        )}
        {product.stock === 0 && (
          <div className="product-card__badge">
            <span className="badge badge-danger">Out of Stock</span>
          </div>
        )}
        <div className="product-card__actions">
          <button className={`icon-btn ${wishlisted ? 'active' : ''}`} onClick={handleWishlist} title="Wishlist">
            <FiHeart />
          </button>
          <Link to={`/products/${product.slug}`} className="icon-btn" title="Quick View">
            <FiEye />
          </Link>
        </div>
      </div>

      <div className="product-card__body">
        {product.category_name && (
          <span className="product-card__category">{product.category_name}</span>
        )}
        <Link to={`/products/${product.slug}`} className="product-card__name">{product.name}</Link>
        <Stars rating={product.rating} count={product.review_count} />
        <div className="product-card__price-row">
          <span className="product-card__price">{formatPrice(product.price)}</span>
          {product.original_price && product.original_price > product.price && (
            <span className="product-card__original-price">{formatPrice(product.original_price)}</span>
          )}
          {discount > 0 && <span className="product-card__discount">{discount}% off</span>}
        </div>
        <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
          <button
            className="btn btn-outline btn-sm"
            style={{ flex: 1 }}
            onClick={() => addToCart(product.id)}
            disabled={loading || product.stock === 0}
          >
            <FiShoppingCart size={14} />
            Add
          </button>
          <button
            className="btn btn-primary btn-sm"
            style={{ flex: 1 }}
            onClick={handleBuyNow}
            disabled={loading || product.stock === 0}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
