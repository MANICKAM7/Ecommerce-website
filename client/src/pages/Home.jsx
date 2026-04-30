import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowRight, FiShoppingBag, FiTruck, FiShield, FiRefreshCw, FiStar, FiZap, FiTrendingUp } from 'react-icons/fi';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import './Home.css';

const CATEGORIES = [
  { name: 'Electronics', slug: 'electronics', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500', color: '#6c63ff' },
  { name: 'Fashion', slug: 'fashion', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=500', color: '#ff6584' },
  { name: 'Home & Living', slug: 'home-living', image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=500', color: '#43e97b' },
  { name: 'Sports & Fitness', slug: 'sports-fitness', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500', color: '#38f9d7' },
  { name: 'Beauty & Health', slug: 'beauty-health', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500', color: '#ffd43b' },
  { name: 'Books & Media', slug: 'books-media', image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=500', color: '#ff922b' },
  { name: 'Toys & Games', slug: 'toys-games', image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=500', color: '#e83e8c' },
  { name: 'Groceries', slug: 'groceries', image: 'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?w=500', color: '#20c997' },
];

const FEATURES = [
  { icon: <FiTruck />, title: 'Free Shipping', desc: 'On orders above ₹5,000' },
  { icon: <FiShield />, title: 'Secure Payment', desc: '100% safe transactions' },
  { icon: <FiRefreshCw />, title: 'Easy Returns', desc: '30-day hassle-free returns' },
  { icon: <FiStar />, title: 'Top Quality', desc: 'Authentic products guaranteed' },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [featRes, trendRes] = await Promise.all([
          api.get('/products?featured=true&limit=8'),
          api.get('/products?sort=popular&limit=8'),
        ]);
        setFeatured(featRes.data.products);
        setTrending(trendRes.data.products);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="home page-enter">
      {/* ===== HERO ===== */}
      <section className="hero">
        <div className="hero__bg-orbs">
          <div className="hero__orb hero__orb--1" />
          <div className="hero__orb hero__orb--2" />
          <div className="hero__orb hero__orb--3" />
        </div>
        <div className="container hero__inner">
          <div className="hero__content">
            <div className="hero__eyebrow">
              <span className="badge badge-primary"><FiZap size={10}/> NEW ARRIVALS 2024</span>
            </div>
            <h1 className="hero__title">
              Shop the products in <span className="hero__title-gradient">Mathesh Shopping Store</span><br />
              with premium quality products
            </h1>
            <p className="hero__subtitle">
              Discover thousands of premium products across electronics, fashion, home decor and more. 
              All at prices that won't break the bank.
            </p>
            <div className="hero__actions">
              <button className="btn btn-primary btn-lg" onClick={() => navigate('/products')}>
                <FiShoppingBag /> Shop Now
              </button>
              <button className="btn btn-secondary btn-lg" onClick={() => navigate('/products?featured=true')}>
                <FiStar /> View Featured
              </button>
            </div>
            <div className="hero__stats">
              <div className="hero__stat">
                <span className="hero__stat-num">50K+</span>
                <span className="hero__stat-label">Products</span>
              </div>
              <div className="hero__stat-divider" />
              <div className="hero__stat">
                <span className="hero__stat-num">200K+</span>
                <span className="hero__stat-label">Happy Customers</span>
              </div>
              <div className="hero__stat-divider" />
              <div className="hero__stat">
                <span className="hero__stat-num">4.9★</span>
                <span className="hero__stat-label">Average Rating</span>
              </div>
            </div>
          </div>

          <div className="hero__visual">
            <div className="hero__image-card">
              <img
                src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600"
                alt="Shopping"
                className="hero__image"
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'; }}
              />
              <div className="hero__floating-card hero__floating-card--1">
                <span className="hero__float-icon">🎉</span>
                <div>
                  <div className="hero__float-title">Order Placed!</div>
                  <div className="hero__float-sub">iPhone 15 Pro Max</div>
                </div>
              </div>
              <div className="hero__floating-card hero__floating-card--2">
                <span className="hero__float-icon">⭐</span>
                <div>
                  <div className="hero__float-title">4.9 / 5.0</div>
                  <div className="hero__float-sub">200K+ reviews</div>
                </div>
              </div>
              <div className="hero__floating-card hero__floating-card--3">
                <span className="hero__float-icon">🚀</span>
                <div>
                  <div className="hero__float-title">Fast Delivery</div>
                  <div className="hero__float-sub">Within 2-3 days</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="features">
        <div className="container features__grid">
          {FEATURES.map((f, i) => (
            <div className="feature-card" key={i}>
              <div className="feature-card__icon">{f.icon}</div>
              <div>
                <h3 className="feature-card__title">{f.title}</h3>
                <p className="feature-card__desc">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">Browse by Category</span>
            <h2 className="section-title">Shop Your Favorites</h2>
            <p className="section-subtitle">Find everything you need in our curated categories</p>
          </div>
          <div className="categories-grid">
            {CATEGORIES.map((cat) => (
              <Link
                to={`/products?category=${cat.slug}`}
                key={cat.slug}
                className="category-card"
                style={{ '--cat-color': cat.color }}
              >
                <div className="category-card__image-container">
                  <img src={cat.image} alt={cat.name} className="category-card__image" />
                </div>
                <div className="category-card__content">
                  <span className="category-card__name">{cat.name}</span>
                  <FiArrowRight className="category-card__arrow" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS ===== */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">Handpicked For You</span>
            <h2 className="section-title">Featured Products</h2>
            <p className="section-subtitle">Curated selection of our best sellers and editor's picks</p>
          </div>
          {loading ? (
            <div className="loading-screen"><div className="spinner" /><span>Loading products...</span></div>
          ) : (
            <>
              <div className="products-grid">
                {featured.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
              <div style={{ textAlign: 'center', marginTop: '40px' }}>
                <Link to="/products?featured=true" className="btn btn-outline btn-lg">
                  View All Featured <FiArrowRight />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ===== PROMO BANNER ===== */}
      <section className="promo-banner">
        <div className="container promo-banner__inner">
          <div className="promo-banner__content">
            <span className="badge badge-warning">⚡ Limited Time</span>
            <h2 className="promo-banner__title">Get 20% Off Your First Order</h2>
            <p className="promo-banner__sub">Use code <strong>WELCOME20</strong> at checkout. Shop now and save big!</p>
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/products')}>
              <FiShoppingBag /> Claim Offer
            </button>
          </div>
          <div className="promo-banner__visual">
            <div className="promo-banner__badge-big">20%<br/>OFF</div>
          </div>
        </div>
      </section>

      {/* ===== TRENDING ===== */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">Most Popular</span>
            <h2 className="section-title">
              <FiTrendingUp size={28} style={{verticalAlign: 'middle', marginRight: 8, color: 'var(--primary)'}} />
              Trending Now
            </h2>
            <p className="section-subtitle">What everyone's been shopping lately</p>
          </div>
          {loading ? (
            <div className="loading-screen"><div className="spinner" /></div>
          ) : (
            <>
              <div className="products-grid">
                {trending.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
              <div style={{ textAlign: 'center', marginTop: '40px' }}>
                <Link to="/products" className="btn btn-outline btn-lg">
                  Explore All Products <FiArrowRight />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
