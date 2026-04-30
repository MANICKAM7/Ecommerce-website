import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiStar, FiPackage, FiTruck, FiShield, FiMinus, FiPlus, FiChevronLeft, FiShare2 } from 'react-icons/fi';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import toast from 'react-hot-toast';
import './ProductDetail.css';

const formatPrice = (p) => `₹${Number(p).toLocaleString('en-IN')}`;

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    api.get(`/products/${slug}`)
      .then(({ data }) => {
        setProduct(data.product);
        setReviews(data.reviews);
        setRelated(data.related);
      })
      .catch(() => navigate('/products'))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleAddToCart = () => addToCart(product.id, quantity);

  const handleWishlist = async () => {
    if (!user) { toast.error('Please login to add to wishlist.'); return; }
    try {
      const { data } = await api.post('/wishlist/toggle', { product_id: product.id });
      setWishlisted(data.wishlisted);
      toast.success(data.message);
    } catch { toast.error('Failed.'); }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login to review.'); return; }
    setSubmittingReview(true);
    try {
      await api.post(`/products/${product.id}/review`, { rating: reviewRating, comment: reviewComment });
      toast.success('Review submitted!');
      setReviewComment('');
      const { data } = await api.get(`/products/${slug}`);
      setReviews(data.reviews);
      setProduct(data.product);
    } catch { toast.error('Failed to submit review.'); }
    finally { setSubmittingReview(false); }
  };

  const discount = product && product.original_price && product.original_price > product.price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  if (loading) return <div className="loading-screen"><div className="spinner" /><span>Loading product...</span></div>;
  if (!product) return null;

  const images = product.images ? (typeof product.images === 'string' ? JSON.parse(product.images) : product.images) : [product.image];

  return (
    <div className="product-detail page-enter">
      <div className="container">
        {/* Breadcrumb */}
        <div className="product-detail__breadcrumb">
          <Link to="/" className="breadcrumb-link">Home</Link>
          <span>/</span>
          <Link to="/products" className="breadcrumb-link">Products</Link>
          <span>/</span>
          {product.category_name && (
            <>
              <Link to={`/products?category=${product.category_slug}`} className="breadcrumb-link">{product.category_name}</Link>
              <span>/</span>
            </>
          )}
          <span className="breadcrumb-current">{product.name}</span>
        </div>

        <button className="btn btn-ghost" onClick={() => navigate(-1)} style={{ marginBottom: '20px' }}>
          <FiChevronLeft /> Back
        </button>

        {/* Main Layout */}
        <div className="product-detail__layout">
          {/* Images */}
          <div className="product-detail__images">
            <div className="product-detail__main-image-wrap">
              {discount > 0 && <span className="badge badge-success product-detail__discount-badge">-{discount}% OFF</span>}
              <img
                src={images[selectedImage] || product.image}
                alt={product.name}
                className="product-detail__main-image"
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'; }}
              />
            </div>
            {images.length > 1 && (
              <div className="product-detail__thumbnails">
                {images.map((img, i) => (
                  <button key={i} className={`product-detail__thumb ${selectedImage === i ? 'active' : ''}`} onClick={() => setSelectedImage(i)}>
                    <img src={img} alt="" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'; }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="product-detail__info">
            {product.category_name && (
              <Link to={`/products?category=${product.category_slug}`} className="product-detail__category">
                {product.category_name}
              </Link>
            )}
            <h1 className="product-detail__name">{product.name}</h1>

            <div className="product-detail__rating">
              <div className="stars">
                {[1,2,3,4,5].map(s => (
                  <span key={s} className={`star ${s <= Math.round(product.rating) ? '' : 'star-empty'}`}>★</span>
                ))}
              </div>
              <span>{product.rating} / 5</span>
              <span style={{ color: 'var(--text-muted)' }}>({product.review_count?.toLocaleString()} reviews)</span>
            </div>

            <div className="product-detail__price-block">
              <span className="product-detail__price">{formatPrice(product.price)}</span>
              {product.original_price && product.original_price > product.price && (
                <span className="product-detail__original-price">{formatPrice(product.original_price)}</span>
              )}
              {discount > 0 && <span className="badge badge-success">{discount}% off</span>}
            </div>

            <p className="product-detail__description">{product.description}</p>

            {/* Stock */}
            <div className="product-detail__stock">
              {product.stock > 0 ? (
                <span className="badge badge-success"><FiPackage size={11} /> In Stock ({product.stock} available)</span>
              ) : (
                <span className="badge badge-danger">Out of Stock</span>
              )}
            </div>

            {/* Quantity Select */}
            {product.stock > 0 && (
              <div className="product-detail__qty">
                <span className="form-label">Quantity</span>
                <div className="qty-control">
                  <button className="qty-btn" onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={quantity <= 1}>
                    <FiMinus />
                  </button>
                  <span className="qty-value">{quantity}</span>
                  <button className="qty-btn" onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} disabled={quantity >= product.stock}>
                    <FiPlus />
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="product-detail__actions">
              <button
                className="btn btn-primary btn-lg"
                style={{ flex: 1 }}
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                <FiShoppingCart /> {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
              <button className={`icon-btn ${wishlisted ? 'active' : ''}`} style={{ width: 48, height: 48, fontSize: 20 }} onClick={handleWishlist}>
                <FiHeart />
              </button>
              <button className="icon-btn" style={{ width: 48, height: 48, fontSize: 18 }} onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied!'); }}>
                <FiShare2 />
              </button>
            </div>

            {/* Delivery Info */}
            <div className="product-detail__delivery">
              <div className="delivery-item"><FiTruck /><span>Free delivery on orders above ₹5,000</span></div>
              <div className="delivery-item"><FiShield /><span>100% Authentic product guaranteed</span></div>
              <div className="delivery-item"><FiPackage /><span>30-day easy returns & exchanges</span></div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="reviews-section">
          <h2 className="reviews-section__title">Customer Reviews</h2>

          {/* Write Review */}
          {user && (
            <form className="review-form" onSubmit={submitReview}>
              <h3 className="review-form__title">Write a Review</h3>
              <div className="review-form__rating">
                <span className="form-label">Your Rating</span>
                <div className="stars">
                  {[1,2,3,4,5].map(s => (
                    <button type="button" key={s} className={`star review-star ${s <= reviewRating ? '' : 'star-empty'}`} onClick={() => setReviewRating(s)}>★</button>
                  ))}
                </div>
              </div>
              <textarea
                className="form-input review-textarea"
                placeholder="Share your thoughts about this product..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                rows={4}
              />
              <button type="submit" className="btn btn-primary" disabled={submittingReview}>
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          )}

          {/* Review List */}
          <div className="review-list">
            {reviews.length === 0 ? (
              <div className="no-reviews">No reviews yet. Be the first to review!</div>
            ) : (
              reviews.map(r => (
                <div className="review-item" key={r.id}>
                  <div className="review-item__header">
                    <div className="review-item__avatar">{r.user_name?.[0]?.toUpperCase()}</div>
                    <div>
                      <div className="review-item__name">{r.user_name}</div>
                      <div className="stars">
                        {[1,2,3,4,5].map(s => (
                          <span key={s} className={`star ${s <= r.rating ? '' : 'star-empty'}`}>★</span>
                        ))}
                      </div>
                    </div>
                    <span className="review-item__date">{new Date(r.created_at).toLocaleDateString()}</span>
                  </div>
                  {r.comment && <p className="review-item__comment">{r.comment}</p>}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="related-products">
            <h2 className="reviews-section__title">You May Also Like</h2>
            <div className="products-grid">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
